/**
 * @swagger
 * tags:
 *   - name: Videos
 *     description: Video management endpoints
 */

import express from "express";
import {
  createVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  getVideoCount,
  getPaginatedVideos, // 👈 new
} from "../../controller/website-resources/videoController.js";
import authenticate from "../../middlewares/auth/auth.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/video:
 *   get:
 *     tags:
 *       - Videos
 *     summary: Get all videos
 *     description: Returns all videos without pagination
 *     security: []
 *     responses:
 *       200:
 *         description: Videos retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get("/", getAllVideos);

/**
 * @swagger
 * /api/v1/video/getall/paginated:
 *   get:
 *     tags:
 *       - Videos
 *     summary: Get paginated videos
 *     description: Returns videos with pagination support
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
 *         description: Paginated videos retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get("/getall/paginated", getPaginatedVideos);

/**
 * @swagger
 * /api/v1/video/count:
 *   get:
 *     tags:
 *       - Videos
 *     summary: Get video count
 *     description: Returns the total number of videos
 *     security: []
 *     responses:
 *       200:
 *         description: Video count retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get("/count", getVideoCount);

/**
 * @swagger
 * /api/v1/video/getbyid/{id}:
 *   get:
 *     tags:
 *       - Videos
 *     summary: Get video by ID
 *     description: Returns a specific video by its ID
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Video ID
 *     responses:
 *       200:
 *         description: Video retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/getbyid/:id", getVideoById);

/**
 * @swagger
 * /api/v1/video/create:
 *   post:
 *     tags:
 *       - Videos
 *     summary: Create video (Admin only)
 *     description: Creates a new video
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
 *                   - title
 *                   - url
 *                 properties:
 *                   title:
 *                     type: string
 *                     example: "Product Video"
 *                   url:
 *                     type: string
 *                     format: uri
 *                     example: "https://youtube.com/watch?v=..."
 *                   description:
 *                     type: string
 *                     example: "Video description"
 *     responses:
 *       200:
 *         description: Video created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post("/create",authenticate, createVideo);

/**
 * @swagger
 * /api/v1/video/update/{id}:
 *   put:
 *     tags:
 *       - Videos
 *     summary: Update video (Admin only)
 *     description: Updates an existing video
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Video ID
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
 *                   title:
 *                     type: string
 *                     example: "Updated Video Title"
 *                   url:
 *                     type: string
 *                     format: uri
 *                     example: "https://youtube.com/watch?v=..."
 *                   description:
 *                     type: string
 *                     example: "Updated description"
 *     responses:
 *       200:
 *         description: Video updated successfully
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
router.put("/update/:id",authenticate, updateVideo);

/**
 * @swagger
 * /api/v1/video/delete/{id}:
 *   delete:
 *     tags:
 *       - Videos
 *     summary: Delete video (Admin only)
 *     description: Deletes a video by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Video ID
 *     responses:
 *       200:
 *         description: Video deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete("/delete/:id",authenticate, deleteVideo);

export default router;
