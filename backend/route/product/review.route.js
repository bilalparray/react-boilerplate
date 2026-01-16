/**
 * @swagger
 * tags:
 *   - name: Reviews
 *     description: Product review endpoints
 */

import express from "express";
import {
  getAllReviews,
  getReviewById,
  createReviewForProduct,
  getPaginatedReviewsForProduct,
  getAverageRatingForProduct,getReviewCount
} from "../../controller/product/reviewController.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/review/getall/paginated:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Get paginated reviews
 *     description: Returns all reviews with pagination support
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
 *         description: Paginated reviews retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get("/getall/paginated", getAllReviews);

/**
 * @swagger
 * /api/v1/review/count:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Get review count
 *     description: Returns the total number of reviews
 *     security: []
 *     responses:
 *       200:
 *         description: Review count retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get("/count", getReviewCount);

/**
 * @swagger
 * /api/v1/review/{id}:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Get review by ID
 *     description: Returns a specific review by its ID
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/:id", getReviewById);

/**
 * @swagger
 * /api/v1/review/GetAllPaginatedProductReviewsByProductId/{productId}:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Get paginated reviews by product ID
 *     description: Returns paginated reviews for a specific product
 *     security: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
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
 *         description: Product reviews retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get("/GetAllPaginatedProductReviewsByProductId/:productId", getPaginatedReviewsForProduct);

/**
 * @swagger
 * /api/v1/review/product/average-rating/{productId}:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Get average rating for product
 *     description: Returns the average rating for a specific product
 *     security: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Average rating retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get("/product/average-rating/:productId", getAverageRatingForProduct);

/**
 * @swagger
 * /api/v1/review/CreateProductReviewByProductId/{productId}:
 *   post:
 *     tags:
 *       - Reviews
 *     summary: Create review for product
 *     description: Creates a new review for a specific product
 *     security: []
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
 *                   - rating
 *                   - comment
 *                 properties:
 *                   rating:
 *                     type: integer
 *                     minimum: 1
 *                     maximum: 5
 *                     example: 5
 *                   comment:
 *                     type: string
 *                     example: "Great product!"
 *                   customerId:
 *                     type: integer
 *                     example: 1
 *     responses:
 *       200:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post("/CreateProductReviewByProductId/:productId", createReviewForProduct);

export default router;
