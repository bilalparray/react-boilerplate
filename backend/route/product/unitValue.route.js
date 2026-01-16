/**
 * @swagger
 * tags:
 *   - name: Unit Values
 *     description: Product unit value management endpoints
 */

import express from "express";
import {
  createUnitValue,
  updateUnitValue,
  deleteUnitValue,
  getAllUnitValues,
  getUnitValueById,
  getUnitCount
} from "../../controller/product/unitValueController.js";
import authenticate from "../../middlewares/auth/auth.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/admin/unit-values/count:
 *   get:
 *     tags:
 *       - Unit Values
 *     summary: Get unit value count
 *     description: Returns the total number of unit values
 *     security: []
 *     responses:
 *       200:
 *         description: Unit count retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get("/count",getUnitCount);

/**
 * @swagger
 * /api/v1/admin/unit-values/getAllUnitsBySkipTop:
 *   get:
 *     tags:
 *       - Unit Values
 *     summary: Get all unit values
 *     description: Returns all unit values with pagination support
 *     security: []
 *     parameters:
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
 *         description: Unit values retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get("/getAllUnitsBySkipTop", getAllUnitValues);

/**
 * @swagger
 * /api/v1/admin/unit-values/createUnit:
 *   post:
 *     tags:
 *       - Unit Values
 *     summary: Create unit value (Admin only)
 *     description: Creates a new product unit value
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
 *                   - value
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "kg"
 *                   value:
 *                     type: string
 *                     example: "kilogram"
 *     responses:
 *       200:
 *         description: Unit value created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post("/createUnit", authenticate, createUnitValue);

/**
 * @swagger
 * /api/v1/admin/unit-values/updateUnit/{id}:
 *   put:
 *     tags:
 *       - Unit Values
 *     summary: Update unit value (Admin only)
 *     description: Updates an existing unit value
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unit value ID
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
 *                     example: "kg"
 *                   value:
 *                     type: string
 *                     example: "kilogram"
 *     responses:
 *       200:
 *         description: Unit value updated successfully
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
router.put("/updateUnit/:id", authenticate, updateUnitValue);

/**
 * @swagger
 * /api/v1/admin/unit-values/deleteUnit/{id}:
 *   delete:
 *     tags:
 *       - Unit Values
 *     summary: Delete unit value (Admin only)
 *     description: Deletes a unit value by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unit value ID
 *     responses:
 *       200:
 *         description: Unit value deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete("/deleteUnit/:id", authenticate, deleteUnitValue);

/**
 * @swagger
 * /api/v1/admin/unit-values/getSingleUnit/{id}:
 *   get:
 *     tags:
 *       - Unit Values
 *     summary: Get unit value by ID
 *     description: Returns a specific unit value by its ID
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unit value ID
 *     responses:
 *       200:
 *         description: Unit value retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/getSingleUnit/:id", getUnitValueById);

export default router;

