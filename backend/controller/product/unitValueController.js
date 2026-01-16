import { UnitValue } from "../../db/dbconnection.js";
import { sendSuccess, sendError } from "../../Helper/response.helper.js";
import { Op } from "sequelize";

/**
 * Create Unit Value
 * POST /api/admin/unit-values
 */
export const createUnitValue = async (req, res) => {
  try {
    if (req.user.role !== "Admin") return sendError(res, "Unauthorized", 403);

    const reqData = req.body.reqData || req.body; // Support both patterns for backward compatibility
    const { unitType, name, symbol, multiplier, isBaseUnit, displayOrder } = reqData;

    if (!name || !name.trim()) {
      return sendError(res, "Name is required", 400);
    }

    // Check if unit value already exists with this name
    const existing = await UnitValue.findOne({
      where: {
        name: { [Op.iLike]: name.trim() },
      },
    });
    if (existing) {
      return sendError(res, "Unit value with this name already exists", 409);
    }

    const unitValue = await UnitValue.create({
      unitType: unitType ? unitType.trim() : null,
      name: name.trim(),
      symbol: symbol || null,
      multiplier: multiplier || 1.0,
      isBaseUnit: isBaseUnit || false,
      displayOrder: displayOrder || 0,
      createdBy: req.user.id,
      lastModifiedBy: req.user.id,
    });

    return sendSuccess(res, unitValue, 201);
  } catch (e) {
    console.error("❌ CREATE UNIT VALUE ERROR:", e);
    return sendError(res, e.message);
  }
};

/**
 * Update Unit Value
 * PUT /api/admin/unit-values/:id
 */
export const updateUnitValue = async (req, res) => {
  try {
    if (req.user.role !== "Admin") return sendError(res, "Unauthorized", 403);

    const { id } = req.params;
    const reqData = req.body.reqData || req.body; // Support both patterns for backward compatibility
    const { unitType, name, symbol, multiplier, isBaseUnit, displayOrder, isActive } = reqData;

    const unitValue = await UnitValue.findByPk(id);
    if (!unitValue) return sendError(res, "Unit value not found", 404);

    // Check if name is being changed and if it conflicts
    if (name && name.trim() !== unitValue.name) {
      const existing = await UnitValue.findOne({
        where: {
          name: { [Op.iLike]: name.trim() },
          id: { [Op.ne]: id },
        },
      });
      if (existing) {
        return sendError(res, "Unit value with this name already exists", 409);
      }
    }

    await unitValue.update({
      unitType: unitType !== undefined ? (unitType ? unitType.trim() : null) : unitValue.unitType,
      name: name ? name.trim() : unitValue.name,
      symbol: symbol !== undefined ? symbol : unitValue.symbol,
      multiplier: multiplier !== undefined ? multiplier : unitValue.multiplier,
      isBaseUnit: isBaseUnit !== undefined ? isBaseUnit : unitValue.isBaseUnit,
      displayOrder: displayOrder !== undefined ? displayOrder : unitValue.displayOrder,
      isActive: isActive !== undefined ? isActive : unitValue.isActive,
      lastModifiedBy: req.user.id,
    });

    return sendSuccess(res, unitValue);
  } catch (e) {
    console.error("❌ UPDATE UNIT VALUE ERROR:", e);
    return sendError(res, e.message);
  }
};

/**
 * Delete Unit Value
 * DELETE /api/admin/unit-values/:id
 */
export const deleteUnitValue = async (req, res) => {
  try {
    if (req.user.role !== "Admin") return sendError(res, "Unauthorized", 403);

    const { id } = req.params;
    const unitValue = await UnitValue.findByPk(id);
    if (!unitValue) return sendError(res, "Unit value not found", 404);

    // Check if unit value has associated product variants
    const { ProductVariant } = await import("../../db/dbconnection.js");
    const variantsCount = await ProductVariant.count({ where: { unitValueId: id } });

    if (variantsCount > 0) {
      return sendError(
        res,
        `Cannot delete unit value. It has ${variantsCount} associated product variant(s). Delete variants first.`,
        400
      );
    }

    await unitValue.destroy();
    return sendSuccess(res, { message: "Unit value deleted successfully" });
  } catch (e) {
    console.error("❌ DELETE UNIT VALUE ERROR:", e);
    return sendError(res, e.message);
  }
};

/**
 * Get All Unit Values
 * GET /api/admin/unit-values
 */
export const getAllUnitValues = async (req, res) => {
  try {
    const { unitType, isActive, search } = req.query;

    const where = {};
    if (unitType) {
      where.unitType = { [Op.iLike]: `%${unitType}%` };
    }
    if (isActive !== undefined) {
      where.isActive = isActive === "true";
    }
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { symbol: { [Op.iLike]: `%${search}%` } },
        { unitType: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const unitValues = await UnitValue.findAll({
      where,
      order: [["displayOrder", "ASC"], ["name", "ASC"]],
    });

    return sendSuccess(res, unitValues);
  } catch (e) {
    console.error("❌ GET UNIT VALUES ERROR:", e);
    return sendError(res, e.message);
  }
};

/**
 * Get Unit Value By ID
 * GET /api/admin/unit-values/:id
 */
export const getUnitValueById = async (req, res) => {
  try {
    const { id } = req.params;
    const unitValue = await UnitValue.findByPk(id);

    if (!unitValue) return sendError(res, "Unit value not found", 404);
    return sendSuccess(res, unitValue);
  } catch (e) {
    console.error("❌ GET UNIT VALUE ERROR:", e);
    return sendError(res, e.message);
  }
};

// ✅ GET UNIT COUNT
export const getUnitCount = async (req, res) => {
  try {
    const total = await UnitValue.count();
    return sendSuccess(res, { intResponse: total, responseMessage: "Total unit count fetched successfully" });
  } catch (err) {
    console.error("❌ GET UNIT COUNT ERROR:", err);
    return sendError(res, err.message);
  }
};

