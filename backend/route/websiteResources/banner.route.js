/**
 * @swagger
 * tags:
 *   - name: Banners
 *     description: Banner management endpoints
 */

import express from "express";
import {
  createBanner,
  getAllBanners,
  getAllBannersByPagination,
  getBannerById,
  getBannersByType,
  updateBanner,
  deleteBanner,
  getTotalBannerCount,
} from "../../controller/website-resources/bannerController.js";

import { authenticateToken } from "../../middlewares/auth/auth.js";

import {
  upload,                    // same multer instance used for products
  compressUploadedBannerImage // single-image compression
} from "../../Helper/multer.helper.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/banner/create:
 *   post:
 *     tags:
 *       - Banners
 *     summary: Create a new banner
 *     description: Creates a new banner with a single image upload
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
 *               - imagePath
 *             properties:
 *               reqData:
 *                 type: string
 *                 format: json
 *                 description: JSON string containing banner data
 *                 example: '{"title":"Summer Sale","type":"homepage","link":"/products"}'
 *               imagePath:
 *                 type: string
 *                 format: binary
 *                 description: Banner image file
 *     responses:
 *       200:
 *         description: Banner created successfully
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
  "/create",
  authenticateToken,
  (req, res, next) => {
    req.uploadFolder = "alpine-uploads/banners"; // ensure folder defined
    next();
  },
  upload.single("imagePath"),           // 🔥 SINGLE FILE UPLOAD
  compressUploadedBannerImage,          // 🔥 SINGLE FILE COMPRESSION
  createBanner
);

/**
 * @swagger
 * /api/v1/banner/count:
 *   get:
 *     tags:
 *       - Banners
 *     summary: Get total banner count
 *     description: Returns the total number of banners
 *     security: []
 *     responses:
 *       200:
 *         description: Banner count retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get("/count", getTotalBannerCount);

/**
 * @swagger
 * /api/v1/banner/getall:
 *   get:
 *     tags:
 *       - Banners
 *     summary: Get all banners
 *     description: Returns all banners without pagination
 *     security: []
 *     responses:
 *       200:
 *         description: Banners retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get("/getall", getAllBanners);

/**
 * @swagger
 * /api/v1/banner/getall/paginated:
 *   get:
 *     tags:
 *       - Banners
 *     summary: Get paginated banners
 *     description: Returns banners with pagination support
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
 *         description: Paginated banners retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get("/getall/paginated", getAllBannersByPagination);

/**
 * @swagger
 * /api/v1/banner/getbyid/{id}:
 *   get:
 *     tags:
 *       - Banners
 *     summary: Get banner by ID
 *     description: Returns a specific banner by its ID
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Banner ID
 *     responses:
 *       200:
 *         description: Banner retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/getbyid/:id", getBannerById);

/**
 * @swagger
 * /api/v1/banner/getbytype/{type}:
 *   get:
 *     tags:
 *       - Banners
 *     summary: Get banners by type
 *     description: Returns banners filtered by type
 *     security: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: Banner type (e.g., homepage, category)
 *     responses:
 *       200:
 *         description: Banners retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get("/getbytype/:type", getBannersByType);

/**
 * @swagger
 * /api/v1/banner/update/{id}:
 *   put:
 *     tags:
 *       - Banners
 *     summary: Update banner
 *     description: Updates an existing banner with optional image upload
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Banner ID
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
 *                 description: JSON string containing updated banner data
 *                 example: '{"title":"Updated Banner","type":"homepage"}'
 *               imagePath:
 *                 type: string
 *                 format: binary
 *                 description: New banner image file (optional)
 *     responses:
 *       200:
 *         description: Banner updated successfully
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
  "/update/:id",
  authenticateToken,
  (req, res, next) => {
    req.uploadFolder = "alpine-uploads/banners";
    next();
  },
  upload.single("imagePath"),           // 🔥 SINGLE FILE
  compressUploadedBannerImage,
  updateBanner
);

/**
 * @swagger
 * /api/v1/banner/delete/{id}:
 *   delete:
 *     tags:
 *       - Banners
 *     summary: Delete banner
 *     description: Deletes a banner by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Banner ID
 *     responses:
 *       200:
 *         description: Banner deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete("/delete/:id", authenticateToken, deleteBanner);

export default router;
