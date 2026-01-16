/**
 * @swagger
 * tags:
 *   - name: Categories
 *     description: Product category management endpoints
 */

import express from "express";
import {
createCategory,
updateCategory,
deleteCategory,
getAllCategories,
getCategoryById,
getAllCategoriesPaginated,
getCategoryCount,
} from "../../controller/product/categoryController.js";
import authenticate from "../../middlewares/auth/auth.js";
import {
uploadCategory,
compressUploadedImage,
} from "../../Helper/multer.helper.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/categories/paginated:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get paginated categories
 *     description: Returns categories with pagination support
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
 *         description: Paginated categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get("/categories/paginated", getAllCategoriesPaginated);

/**
 * @swagger
 * /api/v1/categories:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get all categories
 *     description: Returns all categories without pagination
 *     security: []
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get("/categories", getAllCategories);

/**
 * @swagger
 * /api/v1/categories/count:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get category count
 *     description: Returns the total number of categories
 *     security: []
 *     responses:
 *       200:
 *         description: Category count retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get("/categories/count", getCategoryCount);

/**
 * @swagger
 * /api/v1/categoryById/{id}:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get category by ID
 *     description: Returns a specific category by its ID
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/categoryById/:id", getCategoryById);

/**
 * @swagger
 * /api/v1/admin/createcategory:
 *   post:
 *     tags:
 *       - Categories
 *     summary: Create a new category (Admin only)
 *     description: Creates a new product category with icon upload
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
 *               - category_icon
 *             properties:
 *               reqData:
 *                 type: string
 *                 format: json
 *                 description: JSON string containing category data
 *                 example: '{"name":"Electronics","description":"Electronic products"}'
 *               category_icon:
 *                 type: string
 *                 format: binary
 *                 description: Category icon image file
 *     responses:
 *       200:
 *         description: Category created successfully
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
"/admin/createcategory",
authenticate,
(req, res, next) => {
req.uploadFolder = "alpine-uploads/category-icons";
next();
},
uploadCategory.single("category_icon"),
compressUploadedImage,
createCategory
);

/**
 * @swagger
 * /api/v1/admin/updatecategoryById/{id}:
 *   put:
 *     tags:
 *       - Categories
 *     summary: Update category (Admin only)
 *     description: Updates an existing category with optional icon upload
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
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
 *                 description: JSON string containing updated category data
 *                 example: '{"name":"Updated Category","description":"Updated description"}'
 *               category_icon:
 *                 type: string
 *                 format: binary
 *                 description: New category icon image file (optional)
 *     responses:
 *       200:
 *         description: Category updated successfully
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
"/admin/updatecategoryById/:id",
authenticate,
(req, res, next) => {
req.uploadFolder = "alpine-uploads/category-icons";
next();
},
uploadCategory.single("category_icon"),
compressUploadedImage,
updateCategory
);

/**
 * @swagger
 * /api/v1/admin/deletecategoryById/{id}:
 *   delete:
 *     tags:
 *       - Categories
 *     summary: Delete category (Admin only)
 *     description: Deletes a category by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete("/admin/deletecategoryById/:id", authenticate, deleteCategory);

export default router;