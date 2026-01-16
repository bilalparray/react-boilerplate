/**
 * @swagger
 * tags:
 *   - name: Admin Products
 *     description: Product management endpoints (Admin only)
 */

import express from "express";
import {
createProduct,
updateProduct,
deleteProduct,
getRecentBestSellingProducts,
updateBestSellingState,
getVariantsByProduct,
deleteProductVariant,
} from "../../controller/product/productController.js";
import {
createProductVariant,
updateProductVariant,
} from "../../controller/product/productVariantController.js";
import authenticate from "../../middlewares/auth/auth.js";
import {
upload,
compressMultipleImages,
} from "../../Helper/multer.helper.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/admin/product/createproduct:
 *   post:
 *     tags:
 *       - Admin Products
 *     summary: Create a new product (Admin only)
 *     description: Creates a new product with multiple image uploads
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - reqData
 *               - images
 *             properties:
 *               reqData:
 *                 type: string
 *                 format: json
 *                 description: JSON string containing product data
 *                 example: '{"name":"Product Name","description":"Description","price":99.99,"categoryId":1}'
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Product images (up to 10 files)
 *     responses:
 *       200:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post(
"/createproduct",
authenticate,
(req, res, next) => {
req.uploadFolder = "alpine-uploads/products";
next();
},
upload.array("images", 10),
compressMultipleImages,
createProduct
);

/**
 * @swagger
 * /api/v1/admin/product/updateproductById/{id}:
 *   put:
 *     tags:
 *       - Admin Products
 *     summary: Update product (Admin only)
 *     description: Updates an existing product with optional image uploads
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               reqData:
 *                 type: string
 *                 format: json
 *                 description: JSON string containing updated product data
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: New product images (up to 10 files, optional)
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put(
"/updateproductById/:id",
authenticate,
(req, res, next) => {
req.uploadFolder = "alpine-uploads/products";
next();
},
upload.array("images", 10),
compressMultipleImages,
updateProduct
);

/**
 * @swagger
 * /api/v1/admin/product/deleteproductById/{id}:
 *   delete:
 *     tags:
 *       - Admin Products
 *     summary: Delete product (Admin only)
 *     description: Deletes a product by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete("/deleteproductById/:id", authenticate, deleteProduct);

/**
 * @swagger
 * /api/v1/admin/product/bestselling/state/{id}:
 *   put:
 *     tags:
 *       - Admin Products
 *     summary: Update best selling state (Admin only)
 *     description: Updates the best selling status of a product
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reqData
 *             properties:
 *               reqData:
 *                 type: object
 *                 required:
 *                   - isBestSelling
 *                 properties:
 *                   isBestSelling:
 *                     type: boolean
 *                     example: true
 *     responses:
 *       200:
 *         description: Best selling state updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put("/bestselling/state/:id", authenticate, updateBestSellingState);

/**
 * @swagger
 * /api/v1/admin/product/{productId}/variants:
 *   get:
 *     tags:
 *       - Admin Products
 *     summary: Get product variants
 *     description: Returns all variants for a specific product
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product variants retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/:productId/variants", getVariantsByProduct);

/**
 * @swagger
 * /api/v1/admin/product/{productId}/variants:
 *   post:
 *     tags:
 *       - Admin Products
 *     summary: Create product variant (Admin only)
 *     description: Creates a new variant for a product
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reqData
 *             properties:
 *               reqData:
 *                 type: object
 *                 required:
 *                   - name
 *                   - price
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Small"
 *                   price:
 *                     type: number
 *                     example: 99.99
 *                   stock:
 *                     type: integer
 *                     example: 100
 *     responses:
 *       200:
 *         description: Product variant created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post("/:productId/variants", authenticate, createProductVariant);

/**
 * @swagger
 * /api/v1/admin/product/{productId}/variants/{variantId}:
 *   put:
 *     tags:
 *       - Admin Products
 *     summary: Update product variant (Admin only)
 *     description: Updates an existing product variant
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Variant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reqData
 *             properties:
 *               reqData:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Medium"
 *                   price:
 *                     type: number
 *                     example: 129.99
 *                   stock:
 *                     type: integer
 *                     example: 50
 *     responses:
 *       200:
 *         description: Product variant updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put("/:productId/variants/:variantId", authenticate, updateProductVariant);

/**
 * @swagger
 * /api/v1/admin/product/{productId}/variants/{variantId}:
 *   delete:
 *     tags:
 *       - Admin Products
 *     summary: Delete product variant (Admin only)
 *     description: Deletes a product variant
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Variant ID
 *     responses:
 *       200:
 *         description: Product variant deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete("/:productId/variants/:variantId", authenticate, deleteProductVariant);

export default router;