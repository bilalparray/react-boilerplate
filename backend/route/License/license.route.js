/**
 * @swagger
 * tags:
 *   - name: Licenses
 *     description: License management endpoints
 */

import express from "express";
import {
  createLicense,
  getAllLicenses,
  getLicenseById,
  updateLicense,
  deleteLicense,
} from "../../controller/License-controller/licenseController.js";
import { authenticateToken } from "../../middlewares/auth/auth.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/license:
 *   post:
 *     tags:
 *       - Licenses
 *     summary: Create license (Admin only)
 *     description: Creates a new license
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
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Premium License"
 *                   description:
 *                     type: string
 *                     example: "License description"
 *     responses:
 *       200:
 *         description: License created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post("/", authenticateToken, createLicense);

/**
 * @swagger
 * /api/v1/license:
 *   get:
 *     tags:
 *       - Licenses
 *     summary: Get all licenses
 *     description: Returns all licenses
 *     security: []
 *     responses:
 *       200:
 *         description: Licenses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get("/", getAllLicenses);

/**
 * @swagger
 * /api/v1/license/{id}:
 *   get:
 *     tags:
 *       - Licenses
 *     summary: Get license by ID
 *     description: Returns a specific license by its ID
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: License ID
 *     responses:
 *       200:
 *         description: License retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/:id", getLicenseById);

/**
 * @swagger
 * /api/v1/license/{id}:
 *   put:
 *     tags:
 *       - Licenses
 *     summary: Update license (Admin only)
 *     description: Updates an existing license
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: License ID
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
 *                     example: "Updated License Name"
 *                   description:
 *                     type: string
 *                     example: "Updated description"
 *     responses:
 *       200:
 *         description: License updated successfully
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
router.put("/:id", authenticateToken, updateLicense);

/**
 * @swagger
 * /api/v1/license/{id}:
 *   delete:
 *     tags:
 *       - Licenses
 *     summary: Delete license (Admin only)
 *     description: Deletes a license by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: License ID
 *     responses:
 *       200:
 *         description: License deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete("/:id", authenticateToken, deleteLicense);

export default router;
