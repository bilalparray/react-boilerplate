import {
  CustomerDetail as Customer,
  CustomerAddressDetail as CustomerAddress,
} from "../../db/dbconnection.js";
import razorpay from "../../route/customer/razorpay.js";
import { sendSuccess, sendError } from "../../Helper/response.helper.js";
import { Op } from "sequelize";

/* ======================================================
   🔧 HELPER FUNCTIONS
====================================================== */

/**
 * Helper function to format and validate contact number for Razorpay
 * @param {string|number} contact - Contact number
 * @returns {string|null} - Formatted 10-digit contact or null if invalid
 */
const formatContactForRazorpay = (contact) => {
  if (!contact) return null;
  
  // Remove all non-digit characters
  const digitsOnly = String(contact).replace(/\D/g, '');
  
  // Razorpay requires 10-digit Indian phone numbers
  if (digitsOnly.length === 10) {
    return digitsOnly;
  }
  
  // If it's 11 digits and starts with 0, remove the leading 0
  if (digitsOnly.length === 11 && digitsOnly.startsWith('0')) {
    return digitsOnly.substring(1);
  }
  
  // If it's 12 digits and starts with 91 (India country code), remove it
  if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
    return digitsOnly.substring(2);
  }
  
  return null;
};

/**
 * Helper function to create Razorpay customer with proper error handling
 * @param {Object} customerData - Customer data with name, email, contact
 * @returns {Promise<Object|null>} - Razorpay customer object or null
 */
const createRazorpayCustomer = async (customerData) => {
  const { firstName, lastName, email, contact } = customerData;
  
  // Validate required fields
  if (!email || !email.trim()) {
    console.warn("⚠️ Cannot create Razorpay customer: email is required");
    return null;
  }
  
  // Validate contact is provided
  if (!contact) {
    console.warn("⚠️ Cannot create Razorpay customer: contact number is required", { 
      email, 
      firstName, 
      lastName 
    });
    return null;
  }
  
  // Format contact
  const formattedContact = formatContactForRazorpay(contact);
  if (!formattedContact) {
    console.warn("⚠️ Cannot create Razorpay customer: invalid contact number format", { 
      contact, 
      email,
      note: "Contact must be 10 digits (Indian phone number)"
    });
    return null;
  }
  
  // Create name from firstName and lastName, fallback to email username
  const customerName = `${firstName || ''} ${lastName || ''}`.trim() || email.split('@')[0];
  
  try {
    const razorpayCustomer = await razorpay.customers.create({
      name: customerName,
      email: email.trim().toLowerCase(),
      contact: formattedContact,
    });
    
    console.log(`✅ Razorpay customer created successfully: ${razorpayCustomer.id}`);
    return razorpayCustomer;
  } catch (razorpayErr) {
    // Log detailed error for debugging
    const errorDetails = razorpayErr.error || razorpayErr;
    console.error("❌ Razorpay customer creation failed:", {
      error: razorpayErr.message,
      errorCode: errorDetails?.code,
      errorDescription: errorDetails?.description,
      customerData: { 
        name: customerName, 
        email: email.trim().toLowerCase(), 
        contact: formattedContact 
      }
    });
    
    // If it's a duplicate customer error, try to fetch existing
    if (errorDetails?.code === 'BAD_REQUEST_ERROR' && errorDetails?.description?.includes('already exists')) {
      try {
        // Try to find by email
        const customers = await razorpay.customers.all({ email: email.trim().toLowerCase() });
        if (customers.items && customers.items.length > 0) {
          console.log(`✅ Found existing Razorpay customer: ${customers.items[0].id}`);
          return customers.items[0];
        }
      } catch (fetchErr) {
        console.warn("⚠️ Could not fetch existing Razorpay customer:", fetchErr.message);
      }
    }
    
    return null;
  }
};

/* ======================================================
   ✅ CREATE CUSTOMER (with optional addresses)
   Smart upsert: Returns existing customer if email exists, creates new otherwise
   This ensures smooth checkout across devices without confusing errors
====================================================== */
export const createCustomer = async (req, res) => {
  try {
    const reqData = req.body.reqData || {};
    let { firstName, lastName, email, contact, addresses = [] } = reqData;

    // Normalize email (trim and lowercase) to prevent duplicate issues
    if (email) {
      email = email.trim().toLowerCase();
    }

    if (!email) {
      return sendError(res, "Email is required", 400);
    }

    // Check if customer already exists by email (case-insensitive)
    const existingCustomer = await Customer.findOne({ 
      where: { 
        email: { [Op.iLike]: email } // Case-insensitive search
      },
      include: [{ model: CustomerAddress, as: "addresses" }]
    });

    if (existingCustomer) {
      // Customer exists - handle gracefully (upsert pattern)
      console.log(`✅ Customer found with email: ${email}, returning existing customer`);
      
      let razorpayCustomer = null;
      
      // Ensure Razorpay customer exists
      if (!existingCustomer.razorpayCustomerId) {
        // Use helper function for Razorpay creation
        razorpayCustomer = await createRazorpayCustomer({
          firstName: existingCustomer.firstName || firstName,
          lastName: existingCustomer.lastName || lastName,
          email: existingCustomer.email,
          contact: existingCustomer.contact || contact,
        });
        
        if (razorpayCustomer) {
          await existingCustomer.update({ razorpayCustomerId: razorpayCustomer.id });
        }
      } else {
        try {
          // Get Razorpay customer details
          razorpayCustomer = await razorpay.customers.fetch(existingCustomer.razorpayCustomerId);
        } catch (razorpayErr) {
          console.warn("⚠️ Could not fetch Razorpay customer:", razorpayErr.message);
        }
      }

      // Add new addresses if provided (merge, don't replace)
      if (addresses && addresses.length > 0) {
        // Check which addresses are new (by comparing address fields)
        const existingAddresses = existingCustomer.addresses || [];
        
        for (const newAddr of addresses) {
          // Check if this address already exists (simple check on key fields)
          const addressExists = existingAddresses.some(existing => 
            existing.addressLine1 === newAddr.addressLine1 &&
            existing.city === newAddr.city &&
            existing.pincode === newAddr.pincode
          );

          if (!addressExists) {
            // Add new address
            await CustomerAddress.create({
              ...newAddr,
              customerDetailId: existingCustomer.id,
              createdBy: req.user?.id || null,
            });
          }
        }
      }

      // Fetch updated customer with all addresses - retry if needed
      let updatedCustomer = await Customer.findByPk(existingCustomer.id, {
        include: [{ model: CustomerAddress, as: "addresses" }],
      });

      // If findByPk returns null, try again (sometimes there's a slight delay in DB)
      if (!updatedCustomer) {
        console.warn("⚠️ First attempt to fetch customer returned null, retrying...");
        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
        updatedCustomer = await Customer.findByPk(existingCustomer.id, {
          include: [{ model: CustomerAddress, as: "addresses" }],
        });
      }

      if (!updatedCustomer) {
        console.error("❌ Failed to fetch existing customer from database after retry");
        // Still return the existing customer we found, even if we can't fetch it with addresses
        const fallbackResult = {
          ...existingCustomer.toJSON(),
          addresses: existingCustomer.addresses || [],
          razorpay: razorpayCustomer,
          isExisting: true
        };
        console.warn("⚠️ Returning customer data without full fetch due to database timing issue");
        return sendSuccess(res, fallbackResult, 200);
      }

      const result = { 
        ...updatedCustomer.toJSON(), 
        razorpay: razorpayCustomer,
        isExisting: true // Flag to indicate this was an existing customer
      };

      // Validate result before sending
      if (!result || !result.id) {
        console.error("❌ Invalid customer result before sending response:", result);
        return sendError(res, "Customer data is invalid. Please contact support.", 500);
      }
      
      // Return 200 (not 201) since customer already existed
      return sendSuccess(res, result, 200);
    }

    // Customer doesn't exist - create new
    console.log(`✅ Creating new customer with email: ${email}`);

    // Create Razorpay Customer using helper function
    const razorpayCustomer = await createRazorpayCustomer({
      firstName,
      lastName,
      email,
      contact,
    });

    // Prepare customer data with normalized email and cleaned contact
    const customerData = {
      ...reqData,
      email: email, // Use normalized email (already lowercased and trimmed)
      contact: contact ? String(contact).replace(/\D/g, '') : contact, // Clean contact
      razorpayCustomerId: razorpayCustomer?.id || null,
      createdBy: req.user?.id || null,
    };

    // Remove addresses from customerData as they're handled separately
    delete customerData.addresses;

    // Save in DB with error handling for unique constraint
    let customer;
    try {
      customer = await Customer.create(customerData);
      console.log(`✅ Customer created in DB with ID: ${customer.id}`);
    } catch (dbErr) {
      // Handle unique constraint violation (email already exists)
      if (dbErr.name === 'SequelizeUniqueConstraintError' || dbErr.name === 'SequelizeValidationError') {
        console.warn("⚠️ Customer creation failed due to constraint violation, checking for existing customer...");
        
        // Try to find the existing customer
        const existingCustomerByEmail = await Customer.findOne({ 
          where: { 
            email: { [Op.iLike]: email }
          },
          include: [{ model: CustomerAddress, as: "addresses" }]
        });
        
        if (existingCustomerByEmail) {
          // Return existing customer instead of error
          let razorpayCustomerForExisting = null;
          
          // Ensure Razorpay customer exists
          if (!existingCustomerByEmail.razorpayCustomerId) {
            razorpayCustomerForExisting = await createRazorpayCustomer({
              firstName: existingCustomerByEmail.firstName || firstName,
              lastName: existingCustomerByEmail.lastName || lastName,
              email: existingCustomerByEmail.email,
              contact: existingCustomerByEmail.contact || contact,
            });
            
            if (razorpayCustomerForExisting) {
              await existingCustomerByEmail.update({ razorpayCustomerId: razorpayCustomerForExisting.id });
            }
          } else {
            try {
              razorpayCustomerForExisting = await razorpay.customers.fetch(existingCustomerByEmail.razorpayCustomerId);
            } catch (razorpayErr) {
              console.warn("⚠️ Could not fetch Razorpay customer:", razorpayErr.message);
            }
          }

          const result = {
            ...existingCustomerByEmail.toJSON(),
            razorpay: razorpayCustomerForExisting,
            isExisting: true
          };

          // Validate result before sending
          if (!result || !result.id) {
            console.error("❌ Invalid customer result before sending response:", result);
            return sendError(res, "Customer data is invalid. Please contact support.", 500);
          }

          return sendSuccess(res, result, 200);
        }
      }
      
      // Re-throw if it's not a constraint error
      throw dbErr;
    }

    // Save address records if provided
    if (addresses && addresses.length > 0) {
      const addressRecords = addresses.map((addr) => ({
        ...addr,
        customerDetailId: customer.id,
        createdBy: req.user?.id || null,
      }));
      await CustomerAddress.bulkCreate(addressRecords);
    }

    // Fetch full customer with addresses - retry if needed
    let fullCustomer = await Customer.findByPk(customer.id, {
      include: [{ model: CustomerAddress, as: "addresses" }],
    });

    // If findByPk returns null, try again (sometimes there's a slight delay in DB)
    if (!fullCustomer) {
      console.warn("⚠️ First attempt to fetch customer returned null, retrying...");
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
      fullCustomer = await Customer.findByPk(customer.id, {
        include: [{ model: CustomerAddress, as: "addresses" }],
      });
    }

    if (!fullCustomer) {
      console.error("❌ Failed to fetch created customer from database after retry");
      // Still return the customer we created, even if we can't fetch it with addresses
      const fallbackResult = {
        ...customer.toJSON(),
        addresses: addresses || [],
        razorpay: razorpayCustomer,
        isExisting: false
      };
      console.warn("⚠️ Returning customer data without full fetch due to database timing issue");
      return sendSuccess(res, fallbackResult, 201);
    }

    const result = { 
      ...fullCustomer.toJSON(), 
      razorpay: razorpayCustomer,
      isExisting: false // Flag to indicate this is a new customer
    };

    // Validate result before sending
    if (!result || !result.id) {
      console.error("❌ Invalid customer result before sending response:", result);
      return sendError(res, "Customer created but response data is invalid. Please contact support.", 500);
    }
    
    return sendSuccess(res, result, 201);
  } catch (err) {
    console.error("❌ CREATE CUSTOMER ERROR:", err);
    return sendError(res, err.message);
  }
};

/* ======================================================
   ✅ GET CUSTOMER BY ID
====================================================== */
export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id, {
      include: [{ model: CustomerAddress, as: "addresses" }],
    });
    if (!customer) return sendError(res, "Customer not found", 404);
    return sendSuccess(res, customer.toJSON());
  } catch (err) {
    return sendError(res, err.message);
  }
};

/* ======================================================
   ✅ GET CUSTOMER BY EMAIL (for checking before creation)
   Helps frontend check if customer exists before attempting creation
====================================================== */
export const getCustomerByEmail = async (req, res) => {
  try {
    const email = req.query.email || req.params.email;
    
    if (!email) {
      return sendError(res, "Email parameter is required", 400);
    }

    const customer = await Customer.findOne({ 
      where: { 
        email: { [Op.iLike]: email } // Case-insensitive search
      },
      include: [{ model: CustomerAddress, as: "addresses" }],
    });

    if (!customer) {
      return sendSuccess(res, { exists: false, customer: null });
    }

    return sendSuccess(res, { 
      exists: true, 
      customer: customer.toJSON() 
    });
  } catch (err) {
    console.error("❌ GET CUSTOMER BY EMAIL ERROR:", err);
    return sendError(res, err.message);
  }
};

/* ======================================================
   ✅ GET ALL CUSTOMERS (Paginated with Search)
====================================================== */
export const getAllCustomersPaginated = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const top = parseInt(req.query.top) || 10;
    const search = req.query.search ? req.query.search.trim() : null;

    // Build where condition for search
    const where = {};
    if (search) {
      where[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { contact: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count: total, rows: customers } = await Customer.findAndCountAll({
      where,
      offset: skip,
      limit: top,
      include: [{ model: CustomerAddress, as: "addresses", required: false }],
      order: [["createdOnUTC", "DESC"]],
      distinct: true // Important for count with joins
    });

    // Return customers with pagination metadata
    return sendSuccess(res, {
      data: customers.map((c) => c.toJSON()),
      total: total,
      skip: skip,
      top: top,
      hasMore: (skip + top) < total
    });
  } catch (err) {
    console.error("❌ GET ALL CUSTOMERS PAGINATED ERROR:", err);
    return sendError(res, err.message);
  }
};

/* ======================================================
   ✅ UPDATE CUSTOMER (and addresses if provided)
====================================================== */
export const updateCustomer = async (req, res) => {
  try {
    const reqData = req.body.reqData || {};
    const { firstName, lastName, email, contact, addresses = [] } = reqData;

    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return sendError(res, "Customer not found", 404);

    // Update in Razorpay
    if (customer.razorpayCustomerId) {
      await razorpay.customers.edit(customer.razorpayCustomerId, {
        name: `${firstName} ${lastName}`,
        email,
        contact,
      });
    }

    reqData.lastModifiedBy = req.user?.id || null;
    await customer.update(reqData);

    // Update addresses (simplified: delete & recreate)
    await CustomerAddress.destroy({ where: { customerDetailId: customer.id } });
    if (addresses && addresses.length > 0) {
      const addressRecords = addresses.map((addr) => ({
        ...addr,
        customerDetailId: customer.id,
        createdBy: req.user?.id || null,
      }));
      await CustomerAddress.bulkCreate(addressRecords);
    }

    const updatedCustomer = await Customer.findByPk(customer.id, {
      include: [{ model: CustomerAddress, as: "addresses" }],
    });

    return sendSuccess(res, updatedCustomer.toJSON());
  } catch (err) {
    return sendError(res, err.message);
  }
};

/* ======================================================
   ✅ DELETE CUSTOMER (Cascade delete addresses)
====================================================== */
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return sendError(res, "Customer not found", 404);

    await Customer.destroy({ where: { id: req.params.id } });
    // Sequelize cascade deletes CustomerAddressDetails
    return sendSuccess(res, { message: "Customer deleted successfully" });
  } catch (err) {
    return sendError(res, err.message);
  }
};

/* ======================================================
   ✅ SEPARATE CRUD FOR CUSTOMER ADDRESS
====================================================== */
export const createCustomerAddress = async (req, res) => {
  try {
    const reqData = req.body.reqData || {};
    const { customerDetailId } = reqData;

    const customer = await Customer.findByPk(customerDetailId);
    if (!customer) return sendError(res, "Customer not found", 404);

    const address = await CustomerAddress.create({
      ...reqData,
      createdBy: req.user?.id || null,
    });

    return sendSuccess(res, address, 201);
  } catch (err) {
    return sendError(res, err.message);
  }
};

export const updateCustomerAddress = async (req, res) => {
  try {
    const reqData = req.body.reqData || {};
    const address = await CustomerAddress.findByPk(req.params.id);
    if (!address) return sendError(res, "Address not found", 404);

    reqData.lastModifiedBy = req.user?.id || null;
    await address.update(reqData);

    return sendSuccess(res, address);
  } catch (err) {
    return sendError(res, err.message);
  }
};

export const deleteCustomerAddress = async (req, res) => {
  try {
    const address = await CustomerAddress.findByPk(req.params.id);
    if (!address) return sendError(res, "Address not found", 404);

    await CustomerAddress.destroy({ where: { id: req.params.id } });
    return sendSuccess(res, { message: "Address deleted successfully" });
  } catch (err) {
    return sendError(res, err.message);
  }
};
