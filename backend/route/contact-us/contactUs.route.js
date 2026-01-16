/**
 * @swagger
 * tags:
 *   - name: Contact Us
 *     description: Contact form and inquiry management endpoints
 */

import express from "express";
import {
  createContactUs,
  getAllContactUs,
  getAllContactUsPaginated,
  getContactUsById,
  getContactUsCount,
  updateContactUs,
  deleteContactUs,
} from "../../controller/contact-us/contactUsController.js";
import authenticate from "../../middlewares/auth/auth.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/contactus/create:
 *   post:
 *     tags:
 *       - Contact Us
 *     summary: Submit contact form
 *     description: Creates a new contact form submission (public endpoint)
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
 *                   - message
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
 *                   message:
 *                     type: string
 *                     example: "I have a question about your products"
 *                   subject:
 *                     type: string
 *                     example: "Product Inquiry"
 *     responses:
 *       200:
 *         description: Contact form submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post("/create", createContactUs);

/**
 * @swagger
 * /api/v1/contactus/all:
 *   get:
 *     tags:
 *       - Contact Us
 *     summary: Get all contact submissions (Admin only)
 *     description: Returns all contact form submissions without pagination
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Contact submissions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/all",authenticate, getAllContactUs);

/**
 * @swagger
 * /api/v1/contactus/count:
 *   get:
 *     tags:
 *       - Contact Us
 *     summary: Get contact submission count (Admin only)
 *     description: Returns the total number of contact form submissions
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Contact count retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/count",authenticate, getContactUsCount);

/**
 * @swagger
 * /api/v1/contactus/getall/paginated:
 *   get:
 *     tags:
 *       - Contact Us
 *     summary: Get paginated contact submissions (Admin only)
 *     description: Returns contact form submissions with pagination support
 *     security:
 *       - BearerAuth: []
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
 *         description: Paginated contact submissions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/getall/paginated",authenticate, getAllContactUsPaginated);

/**
 * @swagger
 * /api/v1/contactus/getbyid/{id}:
 *   get:
 *     tags:
 *       - Contact Us
 *     summary: Get contact submission by ID (Admin only)
 *     description: Returns a specific contact form submission by its ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Contact submission ID
 *     responses:
 *       200:
 *         description: Contact submission retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/getbyid/:id",authenticate, getContactUsById);

/**
 * @swagger
 * /api/v1/contactus/update/{id}:
 *   put:
 *     tags:
 *       - Contact Us
 *     summary: Update contact submission (Admin only)
 *     description: Updates a contact form submission
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Contact submission ID
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
 *                   status:
 *                     type: string
 *                     enum: [new, read, replied, resolved]
 *                     example: "read"
 *                   notes:
 *                     type: string
 *                     example: "Admin notes"
 *     responses:
 *       200:
 *         description: Contact submission updated successfully
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
router.put("/update/:id",authenticate, updateContactUs);

/**
 * @swagger
 * /api/v1/contactus/delete/{id}:
 *   delete:
 *     tags:
 *       - Contact Us
 *     summary: Delete contact submission (Admin only)
 *     description: Deletes a contact form submission
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Contact submission ID
 *     responses:
 *       200:
 *         description: Contact submission deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete("/delete/:id",authenticate, deleteContactUs);

export default router;
