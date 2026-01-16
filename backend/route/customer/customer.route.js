/**
 * @swagger
 * tags:
 *   - name: Customers
 *     description: Customer management endpoints
 */

import { Router } from "express";
import {
  createCustomer,
  getCustomerById,
  getAllCustomersPaginated,
  updateCustomer,
  deleteCustomer,
  getCustomerByEmail,
} from "../../controller/customer-controller/customerController.js";

const router = Router();

/**
 * @swagger
 * /api/v1/customer/create:
 *   post:
 *     tags:
 *       - Customers
 *     summary: Create a new customer
 *     description: Creates a new customer record
 *     security: []
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
 *                   - email
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "John Doe"
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: "john@example.com"
 *                   phone:
 *                     type: string
 *                     example: "+1234567890"
 *     responses:
 *       200:
 *         description: Customer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post("/create", createCustomer);

/**
 * @swagger
 * /api/v1/customer/getall/paginated:
 *   get:
 *     tags:
 *       - Customers
 *     summary: Get paginated customers
 *     description: Returns customers with pagination support
 *     security: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Paginated customers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get("/getall/paginated", getAllCustomersPaginated);

/**
 * @swagger
 * /api/v1/customer/getbyid/{id}:
 *   get:
 *     tags:
 *       - Customers
 *     summary: Get customer by ID
 *     description: Returns a specific customer by its ID
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/getbyid/:id", getCustomerById);

/**
 * @swagger
 * /api/v1/customer/getbyemail:
 *   get:
 *     tags:
 *       - Customers
 *     summary: Get customer by email (query parameter)
 *     description: Returns a customer by email address using query parameter
 *     security: []
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Customer email address
 *     responses:
 *       200:
 *         description: Customer retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/getbyemail", getCustomerByEmail);

/**
 * @swagger
 * /api/v1/customer/getbyemail/{email}:
 *   get:
 *     tags:
 *       - Customers
 *     summary: Get customer by email (path parameter)
 *     description: Returns a customer by email address using path parameter
 *     security: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Customer email address
 *     responses:
 *       200:
 *         description: Customer retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/getbyemail/:email", getCustomerByEmail);

/**
 * @swagger
 * /api/v1/customer/update/{id}:
 *   put:
 *     tags:
 *       - Customers
 *     summary: Update customer
 *     description: Updates an existing customer record
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
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
 *                     example: "John Doe Updated"
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: "john.updated@example.com"
 *                   phone:
 *                     type: string
 *                     example: "+1234567890"
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put("/update/:id", updateCustomer);

/**
 * @swagger
 * /api/v1/customer/delete/{id}:
 *   delete:
 *     tags:
 *       - Customers
 *     summary: Delete customer
 *     description: Deletes a customer by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete("/delete/:id", deleteCustomer);

export default router;
