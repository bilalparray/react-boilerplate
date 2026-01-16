/**
 * @swagger
 * tags:
 *   - name: Modules
 *     description: License module management endpoints
 */

import express from "express";
import {
  createModule,
  getAllModules,
  getModuleById,
  updateModule,
  deleteModule,
    getModulesByLicenseId,
} from "../../controller/License-controller/moduleController.js";

import { authenticateToken } from "../../middlewares/auth/auth.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/module:
 *   post:
 *     tags:
 *       - Modules
 *     summary: Create module (Admin only)
 *     description: Creates a new license module
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
 *                   - licenseId
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Module Name"
 *                   licenseId:
 *                     type: integer
 *                     example: 1
 *                   description:
 *                     type: string
 *                     example: "Module description"
 *     responses:
 *       200:
 *         description: Module created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post("/", authenticateToken, createModule);

/**
 * @swagger
 * /api/v1/module:
 *   get:
 *     tags:
 *       - Modules
 *     summary: Get all modules
 *     description: Returns all modules with pagination support
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
 *         description: Modules retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get("/", getAllModules);

/**
 * @swagger
 * /api/v1/module/{id}:
 *   get:
 *     tags:
 *       - Modules
 *     summary: Get module by ID
 *     description: Returns a specific module by its ID
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Module ID
 *     responses:
 *       200:
 *         description: Module retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/:id", getModuleById);

/**
 * @swagger
 * /api/v1/module/{id}:
 *   put:
 *     tags:
 *       - Modules
 *     summary: Update module (Admin only)
 *     description: Updates an existing module
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Module ID
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
 *                     example: "Updated Module Name"
 *                   description:
 *                     type: string
 *                     example: "Updated description"
 *     responses:
 *       200:
 *         description: Module updated successfully
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
router.put("/:id",authenticateToken, updateModule);

/**
 * @swagger
 * /api/v1/module/{id}:
 *   delete:
 *     tags:
 *       - Modules
 *     summary: Delete module (Admin only)
 *     description: Deletes a module by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Module ID
 *     responses:
 *       200:
 *         description: Module deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete("/:id",authenticateToken, deleteModule);

/**
 * @swagger
 * /api/v1/module/by-license/{licenseId}:
 *   get:
 *     tags:
 *       - Modules
 *     summary: Get modules by license ID (Admin only)
 *     description: Returns all modules for a specific license
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: licenseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: License ID
 *     responses:
 *       200:
 *         description: Modules retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
 router.get("/by-license/:licenseId", authenticateToken, getModulesByLicenseId);

export default router;
