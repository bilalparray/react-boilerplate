import { Product, Image, categories as Category, ProductVariant, UnitValue, Review } from "../../db/dbconnection.js";
import { sendSuccess, sendError } from "../../Helper/response.helper.js";
import { convertImageToBase64, deleteFileSafe } from "../../Helper/multer.helper.js";
import { Op, fn, col, literal } from "sequelize";
import razorpay from "../../route/customer/razorpay.js";

/**
 * Helper function to add review summary (averageRating, reviewCount) to products
 * @param {Array} products - Array of product objects
 * @returns {Promise<Array>} Products with review data added
 */
async function addReviewSummaryToProducts(products) {
  if (!products || products.length === 0) return products;
  
  const productIds = products.map(p => p.id);
  
  // Get review summaries for all products in one query
  const reviewSummaries = await Review.findAll({
    where: { 
      productId: { [Op.in]: productIds },
      isApproved: true  // Only count approved reviews
    },
    attributes: [
      'productId',
      [fn('AVG', col('rating')), 'averageRating'],
      [fn('COUNT', col('id')), 'reviewCount']
    ],
    group: ['productId'],
    raw: true
  });
  
  // Create a map for quick lookup
  const reviewMap = {};
  reviewSummaries.forEach(summary => {
    reviewMap[summary.productId] = {
      averageRating: parseFloat(summary.averageRating) || 0,
      reviewCount: parseInt(summary.reviewCount) || 0
    };
  });
  
  // Add review data to each product
  return products.map(product => {
    const reviewData = reviewMap[product.id] || { averageRating: 0, reviewCount: 0 };
    return {
      ...product,
      averageRating: Math.round(reviewData.averageRating * 10) / 10, // Round to 1 decimal
      reviewCount: reviewData.reviewCount
    };
  });
}

  export const createProduct = async (req, res) => {
    try {
      if (req.user.role !== "Admin") return sendError(res, "Unauthorized", 403);

      // Parse reqData - handle both string (from FormData) and object (direct JSON)
      let reqData;
      if (typeof req.body.reqData === 'string') {
        try {
          reqData = JSON.parse(req.body.reqData);
        } catch (parseError) {
          console.error("❌ JSON parse error in createProduct:", parseError);
          return sendError(res, `Invalid JSON in reqData: ${parseError.message}`, 400);
        }
      } else {
        reqData = req.body.reqData || {};
      }
      const variants = reqData.variants || [];
      
      // Validate variants
      if (!variants || !Array.isArray(variants) || variants.length === 0) {
        return sendError(res, "At least one product variant is required", 400);
      }

      // Validate each variant
      for (const variant of variants) {
        if (!variant.unitValueId || !variant.quantity || !variant.price || !variant.sku) {
          return sendError(res, "Each variant must have unitValueId, quantity, price, and sku", 400);
        }
        if (variant.stock === undefined || variant.stock < 0) {
          return sendError(res, "Each variant must have a valid stock value (>= 0)", 400);
        }
      }

      // Check for duplicate SKUs
      const skus = variants.map(v => v.sku);
      if (new Set(skus).size !== skus.length) {
        return sendError(res, "Duplicate SKUs found in variants", 400);
      }

      // Check if SKUs already exist
      const existingSkus = await ProductVariant.findAll({
        where: { sku: { [Op.in]: skus } },
        attributes: ['sku'],
      });
      if (existingSkus.length > 0) {
        return sendError(res, `SKUs already exist: ${existingSkus.map(s => s.sku).join(', ')}`, 409);
      }

      // Check if barcodes already exist (if provided)
      const barcodes = variants.filter(v => v.barcode).map(v => v.barcode);
      if (barcodes.length > 0) {
        const existingBarcodes = await ProductVariant.findAll({
          where: { barcode: { [Op.in]: barcodes } },
          attributes: ['barcode'],
        });
        if (existingBarcodes.length > 0) {
          return sendError(res, `Barcodes already exist: ${existingBarcodes.map(b => b.barcode).join(', ')}`, 409);
        }
      }

      // Verify unit values exist
      const unitValueIds = [...new Set(variants.map(v => v.unitValueId))];
      
      const unitValues = await UnitValue.findAll({ where: { id: { [Op.in]: unitValueIds } } });
      if (unitValues.length !== unitValueIds.length) {
        return sendError(res, "One or more unit values not found", 404);
      }

      // Create product (without price/stock/razorpayItemId)
      const product = await Product.create({
        name: reqData.name,
        description: reqData.description,
        richDescription: reqData.richDescription,
        itemId: reqData.itemId,
        // weight: reqData.weight,
        currency: reqData.currency || "INR",
        isBestSelling: reqData.isBestSelling || false,
        hsnCode: reqData.hsnCode,
        taxRate: reqData.taxRate,
        categoryId: reqData.categoryId,
        createdBy: req.user.id,
        lastModifiedBy: req.user.id,
      });

      // Create variants with Razorpay items
      const createdVariants = [];
      let defaultVariantSet = false;

      for (const variantData of variants) {
        // Create Razorpay item for this variant
        const unitValue = unitValues.find(uv => uv.id === variantData.unitValueId);
        
        const variantName = `${reqData.name} - ${variantData.quantity}${unitValue?.symbol || unitValue?.name || ''}`;
        
        let razorpayItemId = null;
        try {
          const razorpayItem = await razorpay.items.create({
            name: variantName,
            description: reqData.description || '',
            amount: Math.round(variantData.price * 100),
            currency: reqData.currency || "INR",
            hsn_code: reqData.hsnCode,
            tax_rate: reqData.taxRate,
            unit: unitValue?.symbol || unitValue?.name || '',
          });
          razorpayItemId = razorpayItem.id;
        } catch (razorpayError) {
          console.error("Razorpay item creation failed:", razorpayError);
          // Continue without Razorpay item ID if creation fails
        }

        // Set first variant as default if none specified
        const isDefault = variantData.isDefaultVariant !== undefined 
          ? variantData.isDefaultVariant 
          : !defaultVariantSet;

        if (isDefault) defaultVariantSet = true;

        const variant = await ProductVariant.create({
          productId: product.id,
          unitValueId: variantData.unitValueId,
          quantity: variantData.quantity,
          weight: variantData.weight || null,
          price: variantData.price,
          comparePrice: variantData.comparePrice || null,
          sku: variantData.sku,
          barcode: variantData.barcode || null,
          gtin: variantData.gtin || null,
          stock: variantData.stock,
          minOrderQuantity: variantData.minOrderQuantity || 1,
          maxOrderQuantity: variantData.maxOrderQuantity || null,
          discount: variantData.discount || 0,
          wholesalePrice: variantData.wholesalePrice || null,
          wholesaleMinQuantity: variantData.wholesaleMinQuantity || null,
          razorpayItemId,
          isDefaultVariant: isDefault,
          isActive: variantData.isActive !== undefined ? variantData.isActive : true,
          createdBy: req.user.id,
          lastModifiedBy: req.user.id,
        });

        createdVariants.push(variant);
      }

      // Handle images - support both single file (req.file) and multiple files (req.files)
      const imageFiles = req.files || (req.file ? [req.file] : []);
      
      if (imageFiles.length > 0) {
        console.log(`📸 Processing ${imageFiles.length} image(s) for product ${product.id}`);
        for (const f of imageFiles) {
          if (f && f.path) {
            await Image.create({ imagePath: f.path, productId: product.id });
            console.log(`✅ Image saved: ${f.path}`);
          } else {
            console.warn(`⚠️ Invalid file object:`, f);
          }
        }
      } else {
        console.log("ℹ️ No images provided for product creation");
      }

      // Fetch complete product with variants and images
      const final = await Product.findByPk(product.id, {
        include: [
          { model: Image, as: "images", order: [["createdOnUTC", "ASC"]] },
          { model: Category, as: "category" },
          {
            model: ProductVariant,
            as: "variants",
            include: [
              { model: UnitValue, as: "unitValue" },
            ],
            order: [["isDefaultVariant", "DESC"], ["price", "ASC"]],
          },
        ],
      });

      final.images = final.images.map((x) => convertImageToBase64(x.imagePath));
      return sendSuccess(res, final, 201);
    } catch (e) {
      console.error("❌ CREATE PRODUCT ERROR:", e);
      return sendError(res, e.message);
    }
  };

  export const updateProduct = async (req, res) => {
    try {
      if (req.user.role !== "Admin") return sendError(res, "Unauthorized", 403);

      const reqData = JSON.parse(req.body.reqData || "{}");
      const variants = reqData.variants; // Optional: variants array for update

      const product = await Product.findByPk(req.params.id);
      if (!product) return sendError(res, "Product not found", 404);

      // Update product basic info (excluding variants)
      const { variants: _, ...productData } = reqData;
      await product.update({
        ...productData,
        lastModifiedBy: req.user.id,
      });

      // Update variants if provided
      if (variants && Array.isArray(variants)) {
        // Validate variants
        for (const variant of variants) {
          if (variant.id && (!variant.unitValueId || !variant.quantity || !variant.price || !variant.sku)) {
            return sendError(res, "Updating variant requires unitValueId, quantity, price, and sku", 400);
          }
          if (!variant.id && (!variant.unitValueId || !variant.quantity || !variant.price || !variant.sku)) {
            return sendError(res, "New variant must have unitValueId, quantity, price, and sku", 400);
          }
        }

        // Get existing variant IDs
        const existingVariants = await ProductVariant.findAll({
          where: { productId: product.id },
          attributes: ['id'],
        });
        const existingVariantIds = existingVariants.map(v => v.id);
        const incomingVariantIds = variants.filter(v => v.id).map(v => v.id);
        const variantsToDelete = existingVariantIds.filter(id => !incomingVariantIds.includes(id));

        // Delete removed variants (and their Razorpay items)
        for (const variantId of variantsToDelete) {
          const variant = await ProductVariant.findByPk(variantId);
          if (variant?.razorpayItemId) {
            try {
              await razorpay.items.delete(variant.razorpayItemId);
            } catch (e) {
              console.error("Failed to delete Razorpay item:", e);
            }
          }
          await variant.destroy();
        }

        // Update or create variants
        let defaultVariantSet = false;
        const existingDefault = await ProductVariant.findOne({
          where: { productId: product.id, isDefaultVariant: true },
        });
        if (existingDefault && !variants.some(v => v.id === existingDefault.id && v.isDefaultVariant)) {
          defaultVariantSet = true; // Keep existing default if not being updated
        }

        for (const variantData of variants) {
          if (variantData.id) {
            // Update existing variant
            const variant = await ProductVariant.findByPk(variantData.id);
            if (!variant || variant.productId !== product.id) {
              return sendError(res, `Variant with ID ${variantData.id} not found for this product`, 404);
            }

            // Update Razorpay item if price changed
            if (variantData.price && variantData.price !== variant.price && variant.razorpayItemId) {
              try {
                const unitValue = await UnitValue.findByPk(variantData.unitValueId || variant.unitValueId);
                const variantName = `${product.name} - ${variantData.quantity || variant.quantity}${unitValue?.symbol || unitValue?.name || ''}`;
                
                await razorpay.items.update(variant.razorpayItemId, {
                  name: variantName,
                  amount: Math.round(variantData.price * 100),
                });
              } catch (e) {
                console.error("Failed to update Razorpay item:", e);
              }
            }

            await variant.update({
              unitValueId: variantData.unitValueId || variant.unitValueId,
              quantity: variantData.quantity !== undefined ? variantData.quantity : variant.quantity,
              weight: variantData.weight !== undefined ? variantData.weight : variant.weight,
              price: variantData.price !== undefined ? variantData.price : variant.price,
              comparePrice: variantData.comparePrice !== undefined ? variantData.comparePrice : variant.comparePrice,
              sku: variantData.sku || variant.sku,
              barcode: variantData.barcode !== undefined ? variantData.barcode : variant.barcode,
              gtin: variantData.gtin !== undefined ? variantData.gtin : variant.gtin,
              stock: variantData.stock !== undefined ? variantData.stock : variant.stock,
              minOrderQuantity: variantData.minOrderQuantity !== undefined ? variantData.minOrderQuantity : variant.minOrderQuantity,
              maxOrderQuantity: variantData.maxOrderQuantity !== undefined ? variantData.maxOrderQuantity : variant.maxOrderQuantity,
              discount: variantData.discount !== undefined ? variantData.discount : variant.discount,
              wholesalePrice: variantData.wholesalePrice !== undefined ? variantData.wholesalePrice : variant.wholesalePrice,
              wholesaleMinQuantity: variantData.wholesaleMinQuantity !== undefined ? variantData.wholesaleMinQuantity : variant.wholesaleMinQuantity,
              isDefaultVariant: variantData.isDefaultVariant !== undefined ? variantData.isDefaultVariant : variant.isDefaultVariant,
              isActive: variantData.isActive !== undefined ? variantData.isActive : variant.isActive,
              lastModifiedBy: req.user.id,
            });

            if (variant.isDefaultVariant) defaultVariantSet = true;
          } else {
            // Create new variant
            const unitValue = await UnitValue.findByPk(variantData.unitValueId);
            
            const variantName = `${product.name} - ${variantData.quantity}${unitValue?.symbol || unitValue?.name || ''}`;
            
            let razorpayItemId = null;
            try {
              const razorpayItem = await razorpay.items.create({
                name: variantName,
                description: product.description || '',
                amount: Math.round(variantData.price * 100),
                currency: product.currency || "INR",
                hsn_code: product.hsnCode,
                tax_rate: product.taxRate,
                unit: unitValue?.symbol || unitValue?.name || '',
              });
              razorpayItemId = razorpayItem.id;
            } catch (razorpayError) {
              console.error("Razorpay item creation failed:", razorpayError);
            }

            const isDefault = variantData.isDefaultVariant !== undefined 
              ? variantData.isDefaultVariant 
              : !defaultVariantSet;

            if (isDefault) defaultVariantSet = true;

            await ProductVariant.create({
              productId: product.id,
              unitValueId: variantData.unitValueId,
              quantity: variantData.quantity,
              weight: variantData.weight,
              price: variantData.price,
              comparePrice: variantData.comparePrice || null,
              sku: variantData.sku,
              barcode: variantData.barcode || null,
              gtin: variantData.gtin || null,
              stock: variantData.stock,
              minOrderQuantity: variantData.minOrderQuantity || 1,
              maxOrderQuantity: variantData.maxOrderQuantity || null,
              discount: variantData.discount || 0,
              wholesalePrice: variantData.wholesalePrice || null,
              wholesaleMinQuantity: variantData.wholesaleMinQuantity || null,
              razorpayItemId,
              isDefaultVariant: isDefault,
              isActive: variantData.isActive !== undefined ? variantData.isActive : true,
              createdBy: req.user.id,
              lastModifiedBy: req.user.id,
            });
          }
        }
      }

      // Handle images
      const newFiles = req.files || [];
      if (newFiles.length > 0) {
        const existing = await Image.findAll({
          where: { productId: product.id },
          order: [["createdOnUTC", "ASC"]],
        });

        const minReplace = Math.min(existing.length, newFiles.length);

        for (let i = 0; i < minReplace; i++) {
          const oldImg = existing[i];
          if (oldImg?.imagePath) deleteFileSafe(oldImg.imagePath);
          oldImg.imagePath = newFiles[i].path;
          await oldImg.save();
        }

        for (let i = minReplace; i < newFiles.length; i++) {
          await Image.create({ imagePath: newFiles[i].path, productId: product.id });
        }
      }

      // Fetch complete product with variants and images
      const updated = await Product.findByPk(req.params.id, {
        include: [
          { model: Image, as: "images", order: [["createdOnUTC", "ASC"]] },
          { model: Category, as: "category" },
          {
            model: ProductVariant,
            as: "variants",
            include: [
              { model: UnitValue, as: "unitValue" },
            ],
            order: [["isDefaultVariant", "DESC"], ["price", "ASC"]],
          },
        ],
      });

      updated.images = updated.images.map((x) => convertImageToBase64(x.imagePath));
      return sendSuccess(res, updated);
    } catch (e) {
      console.error("❌ UPDATE PRODUCT ERROR:", e);
      return sendError(res, e.message);
    }
  };


// ✅ SEARCH PRODUCTS WITH ODATA

export const searchProductsOdata = async (req, res) => {
  try {
    const keyword = req.query.q ? req.query.q.trim() : "";

    // Require at least 3 characters
    if (!keyword || keyword.length < 3) {
      return sendError(res, "Please enter at least 3 characters", 400);
    }

    const skip = parseInt(req.query.$skip, 10) || 0;
    const top = parseInt(req.query.$top, 10) || 10;

    // 🔍 Search condition across product name & category
    const whereCondition = {
      [Op.or]: [
        { name: { [Op.iLike]: `%${keyword}%` } },               // product name
        { description: { [Op.iLike]: `%${keyword}%` } },        // product description if exists
      ]
    };

    const { count: total, rows: items } = await Product.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: Category,
          as: "category",
          where: { name: { [Op.iLike]: `%${keyword}%` } }, // match category too
          required: false
        },
        { model: Image, as: "images" },
        {
          model: ProductVariant,
          as: "variants",
          where: { isActive: true },
          include: [
            { model: UnitValue, as: "unitValue" },
          ],
          required: false,
        },
      ],
      offset: skip,
      limit: top,
    });
    
 if (!items.length) {
      return sendError(res, "No products found for this keyword", 404);
    }
    // ✅ Convert images and transform variants
    let result = items.map(prod => {
      const obj = prod.toJSON();
      obj.images = obj.images.map(img => convertImageToBase64(img.imagePath)).filter(Boolean);
      
      // Transform variants
      if (obj.variants && Array.isArray(obj.variants)) {
        obj.variants = obj.variants.map(variant => {
          if (variant.unitValue) {
            variant.unitId = variant.unitValueId;
            variant.unitName = variant.unitValue.name || '';
            variant.unitSymbol = variant.unitValue.symbol || variant.unitValue.name || '';
          }
          return variant;
        });
      }
      
      return obj;
    });

    // Add review summary to each product
    result = await addReviewSummaryToProducts(result);

    return sendSuccess(res, result);
  } catch (err) {
    console.error("❌ SEARCH PRODUCTS ERROR:", err);
    return sendError(res, err.message);
  }
};

// ✅ GET PRODUCTS BY CATEGORY ID
// ✅ GET PRODUCTS BY CATEGORY ID (with pagination)
export const getProductsByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return sendError(res, "Category ID is required", 400);
    }

    const skip = parseInt(req.query.skip, 10) || 0;
    const top = parseInt(req.query.top, 10) || 10;

    const { count: total, rows: items } = await Product.findAndCountAll({
      where: { categoryId },
      offset: skip,
      limit: top,
      include: [
        { model: Category, as: "category",
          attributes: ["id", "name"] },
        { model: Image, as: "images" },
        {
          model: ProductVariant,
          as: "variants",
          where: { isActive: true },
          include: [
            { model: UnitValue, as: "unitValue" },
          ],
          required: false,
        },
      ],
    });

    if (!items.length) {
      return sendError(res, "No products found for this category", 404);
    }

    let result = items.map((prod) => {
      const obj = prod.toJSON();
      obj.images = obj.images
        .map((img) => convertImageToBase64(img.imagePath))
        .filter(Boolean);
      
      // Transform variants
      if (obj.variants && Array.isArray(obj.variants)) {
        obj.variants = obj.variants.map(variant => {
          if (variant.unitValue) {
            variant.unitId = variant.unitValueId;
            variant.unitName = variant.unitValue.name || '';
            variant.unitSymbol = variant.unitValue.symbol || variant.unitValue.name || '';
          }
          return variant;
        });
      }
      
      return obj;
    });

    // Add review summary to each product
    result = await addReviewSummaryToProducts(result);

    return sendSuccess(res, result);
  } catch (err) {
    console.error("❌ GET PRODUCTS BY CATEGORY ERROR:", err);
    return sendError(res, err.message);
  }
};

// ✅ GET PRODUCT COUNT BY CATEGORY ID
export const getProductCountByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return sendError(res, "Category ID is required", 400);
    }

    const count = await Product.count({
      where: { categoryId },
    });

    return sendSuccess(res, { categoryId, total: count });
  } catch (err) {
    console.error("❌ GET PRODUCT COUNT BY CATEGORY ERROR:", err);
    return sendError(res, err.message);
  }
};

// ✅ GET NEW ARRIVAL PRODUCTS (Last 10 Added)
export const getNewArrivalProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      order: [["createdOnUTC", "DESC"]], // newest first
      limit: 8,
      include: [
        { model: Category, as: "category",
          attributes: ["id", "name"] },
        { model: Image, as: "images" },
        {
          model: ProductVariant,
          as: "variants",
          where: { isActive: true },
          include: [
            { model: UnitValue, as: "unitValue" },
          ],
          required: false,
        },
      ],
    });

    let result = products.map((prod) => {
      const obj = prod.toJSON();
      obj.images = obj.images
        .map((img) => convertImageToBase64(img.imagePath))
        .filter(Boolean);
      
      // Transform variants
      if (obj.variants && Array.isArray(obj.variants)) {
        obj.variants = obj.variants.map(variant => {
          if (variant.unitValue) {
            variant.unitId = variant.unitValueId;
            variant.unitName = variant.unitValue.name || '';
            variant.unitSymbol = variant.unitValue.symbol || variant.unitValue.name || '';
          }
          return variant;
        });
      }
      
      return obj;
    });

    // Add review summary to each product
    result = await addReviewSummaryToProducts(result);

    return sendSuccess(res, result);
  } catch (err) {
    console.error("❌ GET NEW ARRIVALS ERROR:", err);
    return sendError(res, err.message);
  }
};


// ✅ NEW: Get 8 Recently Added Best-Selling Products
export const getRecentBestSellingProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { isBestSelling: true },
      order: [["createdOnUTC", "DESC"]], // newest best-sellers first
      limit: 8,
      include: [
        { model: Category, as: "category",
          attributes: ["id", "name"] },
        { model: Image, as: "images" },
        {
          model: ProductVariant,
          as: "variants",
          where: { isActive: true },
          include: [
            { model: UnitValue, as: "unitValue" },
          ],
          required: false,
        },
      ],
    });

    if (!products.length) {
      return sendError(res, "No best-selling products found", 404);
    }

    let result = products.map((prod) => {
      const obj = prod.toJSON();
      obj.images = obj.images
        .map((img) => convertImageToBase64(img.imagePath))
        .filter(Boolean);
      
      // Transform variants
      if (obj.variants && Array.isArray(obj.variants)) {
        obj.variants = obj.variants.map(variant => {
          if (variant.unitValue) {
            variant.unitId = variant.unitValueId;
            variant.unitName = variant.unitValue.name || '';
            variant.unitSymbol = variant.unitValue.symbol || variant.unitValue.name || '';
          }
          return variant;
        });
      }
      
      return obj;
    });

    // Add review summary to each product
    result = await addReviewSummaryToProducts(result);

    return sendSuccess(res, result);
  } catch (err) {
    console.error("❌ GET BEST SELLING PRODUCTS ERROR:", err);
    return sendError(res, err.message);
  }
};


// ✅ NEW: Admin can set Product Best Selling State (true or false)
export const updateBestSellingState = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return sendError(res, "Unauthorized", 403);
    }

    const { id } = req.params;

    // Extract boolResponse from reqData
    const { boolResponse: isBestSelling } = req.body.reqData || {};

    // Validate input
    if (typeof isBestSelling !== "boolean") {
      return sendError(
        res,
        "Please provide a valid boolean value for isBestSelling",
        400
      );
    }

    // Find product
    const product = await Product.findByPk(id);
    if (!product) return sendError(res, "Product not found", 404);

    // Update product
    await product.update({
      isBestSelling,
      lastModifiedBy: req.user.id,
    });

    // Fetch complete product with variants and images
    const updated = await Product.findByPk(id, {
      include: [
        { model: Category, as: "category" },
        { model: Image, as: "images", order: [["createdOnUTC", "ASC"]] },
        {
          model: ProductVariant,
          as: "variants",
          include: [
            { model: UnitValue, as: "unitValue" },
          ],
          order: [["isDefaultVariant", "DESC"], ["price", "ASC"]],
        },
      ],
    });

    const result = updated.toJSON();
    result.images = result.images.map(img => convertImageToBase64(img.imagePath)).filter(Boolean);

    return sendSuccess(res, result);
  } catch (err) {
    console.error("❌ UPDATE BEST SELLING STATE ERROR:", err);
    return sendError(res, err.message);
  }
};



// ✅ GET ALL PRODUCTS
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Category, as: "category",
          attributes: ["id", "name"] },
        { model: Image, as: "images" },
        {
          model: ProductVariant,
          as: "variants",
          where: { isActive: true },
          include: [
            { model: UnitValue, as: "unitValue" },
          ],
          required: false,
        },
      ],
    });
    // REFACTOR: Transform variants to include unitId, unitName, unitSymbol from unitValue
    let result = products.map(prod => {
      const obj = prod.toJSON();
      obj.images = obj.images.map(img => convertImageToBase64(img.imagePath)).filter(Boolean);
      
      // Transform variants to include denormalized unit fields
      if (obj.variants && Array.isArray(obj.variants)) {
        obj.variants = obj.variants.map(variant => {
          if (variant.unitValue) {
            variant.unitId = variant.unitValueId;
            variant.unitName = variant.unitValue.name || '';
            variant.unitSymbol = variant.unitValue.symbol || variant.unitValue.name || '';
          }
          return variant;
        });
      }
      
      return obj;
    });
    
    // Add review summary (averageRating, reviewCount) to each product
    result = await addReviewSummaryToProducts(result);
    
    return sendSuccess(res, result);
  } catch (err) {
    console.error("❌ GET ALL PRODUCTS ERROR:", err);
    return sendError(res, err.message);
  }
};

// ✅ GET PRODUCTS WITH PAGINATION
export const getAllProductsByOdata = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip, 10) || 0;
    const top = parseInt(req.query.top, 10) || 10;
    const { count: total, rows: items } = await Product.findAndCountAll({
      offset: skip,
      limit: top,
      include: [
        { model: Category, as: "category",
          attributes: ["id", "name"] },
        { model: Image, as: "images" },
        {
          model: ProductVariant,
          as: "variants",
          where: { isActive: true },
          include: [
            { model: UnitValue, as: "unitValue" },
          ],
          required: false,
        },
      ],
    });

    // REFACTOR: Transform variants to include unitId, unitName, unitSymbol from unitValue
    let productsWithBase64 = items.map(prod => {
      const obj = prod.toJSON();
      obj.images = obj.images.map(img => convertImageToBase64(img.imagePath)).filter(Boolean);
      
      // Transform variants to include denormalized unit fields
      if (obj.variants && Array.isArray(obj.variants)) {
        obj.variants = obj.variants.map(variant => {
          if (variant.unitValue) {
            variant.unitId = variant.unitValueId;
            variant.unitName = variant.unitValue.name || '';
            variant.unitSymbol = variant.unitValue.symbol || variant.unitValue.name || '';
          }
          return variant;
        });
      }
      
      return obj;
    });

    // Add review summary to each product
    productsWithBase64 = await addReviewSummaryToProducts(productsWithBase64);

    return sendSuccess(res, productsWithBase64);
  } catch (err) {
    console.error("❌ ODATA PRODUCTS ERROR:", err);
    return sendError(res, err.message);
  }
};
// ✅ UPDATE PRODUCT

// ✅ GET PRODUCT COUNT
export const getProductCount = async (req, res) => {
  try {
    const total = await Product.count();
    return sendSuccess(res, { intResponse: total, responseMessage: "Total product count fetched successfully" });
  } catch (err) {
    console.error("❌ PRODUCT COUNT ERROR:", err);
    return sendError(res, err.message);
  }
};
//get all
// ✅ GET PRODUCT BY ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category, as: "category",
          attributes: ["id", "name"] },
        { model: Image, as: "images" },
        {
          model: ProductVariant,
          as: "variants",
          where: { isActive: true },
          include: [
            { model: UnitValue, as: "unitValue" },
          ],
          required: false,
        },
      ],
    });
    if (!product) return sendError(res, "Product not found", 404);

    const result = product.toJSON();
    result.images = result.images.map(img => convertImageToBase64(img.imagePath)).filter(Boolean);
    
    // REFACTOR: Transform variants to include unitId, unitName, unitSymbol from unitValue
    if (result.variants && Array.isArray(result.variants)) {
      result.variants = result.variants.map(variant => {
        if (variant.unitValue) {
          variant.unitId = variant.unitValueId; // unitId = unitValueId
          variant.unitName = variant.unitValue.name || '';
          variant.unitSymbol = variant.unitValue.symbol || variant.unitValue.name || '';
          variant.weight = variant.weight || 0;
        }
        return variant;
      });
    }
    
    return sendSuccess(res, result);
  } catch (err) {
    console.error("❌ GET PRODUCT ERROR:", err);
    return sendError(res, err.message);
  }
};



// ✅ DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    if (req.user.role !== "Admin") return sendError(res, "Unauthorized", 403);

    const product = await Product.findByPk(req.params.id);
    if (!product) return sendError(res, "Product not found", 404);

    // Step 1: Delete in Razorpay
    if (product.razorpayItemId) {
      await razorpay.items.delete(product.razorpayItemId);
    }

    // Step 2: Delete variants (and their Razorpay items)
    const variants = await ProductVariant.findAll({ where: { productId: product.id } });
    for (const variant of variants) {
      if (variant.razorpayItemId) {
        try {
          await razorpay.items.delete(variant.razorpayItemId);
        } catch (e) {
          console.error("Failed to delete Razorpay item:", e);
        }
      }
    }
    await ProductVariant.destroy({ where: { productId: product.id } });

    // Step 3: Delete images & DB record
    const images = await Image.findAll({ where: { productId: product.id } });
    for (const img of images) deleteFileSafe(img.imagePath);
    await Image.destroy({ where: { productId: product.id } });
    await product.destroy();

    return sendSuccess(res, null);
  } catch (err) {
    console.error("❌ DELETE PRODUCT ERROR:", err);
    return sendError(res, err.message);
  }
};

/**
 * Get Variants By Product ID
 * GET /api/admin/products/:productId/variants
 */
export const getVariantsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findByPk(productId);
    if (!product) return sendError(res, "Product not found", 404);

    const variants = await ProductVariant.findAll({
      where: { productId },
      include: [
        { model: UnitValue, as: "unitValue" },
      ],
      order: [["isDefaultVariant", "DESC"], ["price", "ASC"]],
    });

    return sendSuccess(res, variants);
  } catch (e) {
    console.error("❌ GET VARIANTS BY PRODUCT ERROR:", e);
    return sendError(res, e.message);
  }
};

/**
 * Delete Product Variant
 * DELETE /api/admin/products/:productId/variants/:variantId
 */
export const deleteProductVariant = async (req, res) => {
  try {
    if (req.user.role !== "Admin") return sendError(res, "Unauthorized", 403);

    const { productId, variantId } = req.params;
    
    const product = await Product.findByPk(productId);
    if (!product) return sendError(res, "Product not found", 404);

    const variant = await ProductVariant.findOne({
      where: { id: variantId, productId },
    });
    if (!variant) return sendError(res, "Variant not found", 404);

    // Check if it's the last variant
    const variantCount = await ProductVariant.count({ where: { productId } });
    if (variantCount === 1) {
      return sendError(res, "Cannot delete the last variant. Product must have at least one variant.", 400);
    }

    // Delete Razorpay item
    if (variant.razorpayItemId) {
      try {
        await razorpay.items.delete(variant.razorpayItemId);
      } catch (e) {
        console.error("Failed to delete Razorpay item:", e);
      }
    }

    await variant.destroy();

    // If deleted variant was default, set another as default
    if (variant.isDefaultVariant) {
      const newDefault = await ProductVariant.findOne({ where: { productId } });
      if (newDefault) {
        await newDefault.update({ isDefaultVariant: true });
      }
    }

    return sendSuccess(res, { message: "Variant deleted successfully" });
  } catch (e) {
    console.error("❌ DELETE VARIANT ERROR:", e);
    return sendError(res, e.message);
  }
};
