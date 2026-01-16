/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: Product browsing and search endpoints
 */

import express from "express";
import {
  searchProductsOdata,
  getAllProducts,
  getProductById,
  getAllProductsByOdata,
  getProductCount,
  getNewArrivalProducts,
  getProductsByCategoryId,
  getProductCountByCategoryId,
  getRecentBestSellingProducts
} from "../../controller/product/productController.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/product/search:
 *   get:
 *     tags:
 *       - Products
 *     summary: Search products
 *     description: Search products using OData query parameters
 *     security: []
 *     parameters:
 *       - in: query
 *         name: $filter
 *         schema:
 *           type: string
 *         description: OData filter expression
 *       - in: query
 *         name: $orderby
 *         schema:
 *           type: string
 *         description: OData orderby expression
 *       - in: query
 *         name: $skip
 *         schema:
 *           type: integer
 *         description: Number of records to skip
 *       - in: query
 *         name: $top
 *         schema:
 *           type: integer
 *         description: Number of records to return
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get("/search", searchProductsOdata);

/**
 * @swagger
 * /api/v1/product:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get all products
 *     description: Returns all products without pagination
 *     security: []
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get("/", getAllProducts);

/**
 * @swagger
 * /api/v1/product/paginated:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get paginated products
 *     description: Returns products with pagination and OData support
 *     security: []
 *     parameters:
 *       - in: query
 *         name: $filter
 *         schema:
 *           type: string
 *         description: OData filter expression
 *       - in: query
 *         name: $orderby
 *         schema:
 *           type: string
 *         description: OData orderby expression
 *       - in: query
 *         name: $skip
 *         schema:
 *           type: integer
 *         description: Number of records to skip
 *       - in: query
 *         name: $top
 *         schema:
 *           type: integer
 *         description: Number of records to return
 *     responses:
 *       200:
 *         description: Paginated products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get("/paginated", getAllProductsByOdata);

/**
 * @swagger
 * /api/v1/product/count:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get product count
 *     description: Returns the total number of products
 *     security: []
 *     responses:
 *       200:
 *         description: Product count retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get("/count", getProductCount);

/**
 * @swagger
 * /api/v1/product/ByCategoryId/{categoryId}/paginated:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get paginated products by category
 *     description: Returns products filtered by category ID with pagination
 *     security: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
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
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get("/ByCategoryId/:categoryId/paginated", getProductsByCategoryId);

/**
 * @swagger
 * /api/v1/product/new-arrivals:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get new arrival products
 *     description: Returns recently added products
 *     security: []
 *     responses:
 *       200:
 *         description: New arrival products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get("/new-arrivals", getNewArrivalProducts);

/**
 * @swagger
 * /api/v1/product/isBestSelling:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get best selling products
 *     description: Returns recent best selling products
 *     security: []
 *     responses:
 *       200:
 *         description: Best selling products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get("/isBestSelling", getRecentBestSellingProducts);

/**
 * @swagger
 * /api/v1/product/count/ByCategoryId/{categoryId}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get product count by category
 *     description: Returns the total number of products in a category
 *     security: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Product count retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get("/count/ByCategoryId/:categoryId", getProductCountByCategoryId);

/**
 * @swagger
 * /api/v1/product/{id}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get product by ID
 *     description: Returns a specific product by its ID
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/:id", getProductById);

export default router;
