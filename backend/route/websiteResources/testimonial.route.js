/**
 * @swagger
 * tags:
 *   - name: Testimonials
 *     description: Testimonial management endpoints
 */

import express from "express";
import {
  createTestimonial,
  getAllTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
  getTestimonialCount,
} from "../../controller/website-resources/testimonialController.js";
import authenticate from "../../middlewares/auth/auth.js";
const router = express.Router();

/**
 * @swagger
 * /api/v1/testimonial/getAll/paginated:
 *   get:
 *     tags:
 *       - Testimonials
 *     summary: Get paginated testimonials
 *     description: Returns testimonials with pagination support
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
 *         description: Paginated testimonials retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get("/getAll/paginated", getAllTestimonials);

/**
 * @swagger
 * /api/v1/testimonial/count:
 *   get:
 *     tags:
 *       - Testimonials
 *     summary: Get testimonial count
 *     description: Returns the total number of testimonials
 *     security: []
 *     responses:
 *       200:
 *         description: Testimonial count retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get("/count", getTestimonialCount);

/**
 * @swagger
 * /api/v1/testimonial/getbyid/{id}:
 *   get:
 *     tags:
 *       - Testimonials
 *     summary: Get testimonial by ID
 *     description: Returns a specific testimonial by its ID
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Testimonial ID
 *     responses:
 *       200:
 *         description: Testimonial retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/getbyid/:id", getTestimonialById);

/**
 * @swagger
 * /api/v1/testimonial/create:
 *   post:
 *     tags:
 *       - Testimonials
 *     summary: Create testimonial (Admin only)
 *     description: Creates a new testimonial
 *     security:
 *       - BearerAuth: []
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
 *                   - message
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "John Doe"
 *                   message:
 *                     type: string
 *                     example: "Great product!"
 *                   rating:
 *                     type: integer
 *                     minimum: 1
 *                     maximum: 5
 *                     example: 5
 *     responses:
 *       200:
 *         description: Testimonial created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post("/create",authenticate, createTestimonial);

/**
 * @swagger
 * /api/v1/testimonial/update/{id}:
 *   put:
 *     tags:
 *       - Testimonials
 *     summary: Update testimonial (Admin only)
 *     description: Updates an existing testimonial
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Testimonial ID
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
 *                   message:
 *                     type: string
 *                     example: "Updated testimonial message"
 *                   rating:
 *                     type: integer
 *                     minimum: 1
 *                     maximum: 5
 *                     example: 4
 *     responses:
 *       200:
 *         description: Testimonial updated successfully
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
router.put("/update/:id",authenticate, updateTestimonial);

/**
 * @swagger
 * /api/v1/testimonial/delete/{id}:
 *   delete:
 *     tags:
 *       - Testimonials
 *     summary: Delete testimonial (Admin only)
 *     description: Deletes a testimonial by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Testimonial ID
 *     responses:
 *       200:
 *         description: Testimonial deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete("/delete/:id",authenticate, deleteTestimonial);

export default router;
