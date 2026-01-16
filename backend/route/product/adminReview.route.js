/**
 * @swagger
 * tags:
 *   - name: Admin Reviews
 *     description: Review management endpoints (Admin only)
 */

import express from "express";
import { updateReview, deleteReview,approveOrRejectReview } from "../../controller/product/reviewController.js";
import authenticate from "../../middlewares/auth/auth.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/AdminReview/ByReviewId/{id}:
 *   put:
 *     tags:
 *       - Admin Reviews
 *     summary: Update review (Admin only)
 *     description: Updates an existing review
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Review ID
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
 *                   rating:
 *                     type: integer
 *                     minimum: 1
 *                     maximum: 5
 *                     example: 4
 *                   comment:
 *                     type: string
 *                     example: "Updated review comment"
 *     responses:
 *       200:
 *         description: Review updated successfully
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
router.put("/ByReviewId/:id", authenticate, updateReview);

/**
 * @swagger
 * /api/v1/AdminReview/ByReviewId/{id}:
 *   delete:
 *     tags:
 *       - Admin Reviews
 *     summary: Delete review (Admin only)
 *     description: Deletes a review by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete("/ByReviewId/:id", authenticate, deleteReview);

/**
 * @swagger
 * /api/v1/AdminReview/approve/{id}:
 *   put:
 *     tags:
 *       - Admin Reviews
 *     summary: Approve or reject review (Admin only)
 *     description: Approves or rejects a review
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Review ID
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
 *                   - status
 *                 properties:
 *                   status:
 *                     type: string
 *                     enum: [approved, rejected]
 *                     example: "approved"
 *     responses:
 *       200:
 *         description: Review status updated successfully
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
router.put("/approve/:id", authenticate, approveOrRejectReview);

export default router;
