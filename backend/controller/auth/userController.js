// 📁 controllers/authController.js
import { User } from "../../db/dbconnection.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Op } from "sequelize";
import { sendSuccess, sendError } from "../../Helper/response.helper.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../middlewares/auth/auth.js";
import sendEmail from "../../middlewares/utills/sendEmail.js";

// ✅ REGISTER
export const registerController = async (req, res) => {
  try {
    // Validate request body structure
    if (!req.body) {
      return sendError(res, "Request body is required", 400);
    }

    const { reqData } = req.body;
    
    // Validate reqData exists
    if (!reqData || typeof reqData !== 'object') {
      return sendError(res, "reqData object is required in request body", 400);
    }

    const { username, email, password, role } = reqData;
    const validRoles = ["Admin", "endUser"];

    // Validate required fields
    if (!username) {
      return sendError(res, "Username is required", 400);
    }
    if (!email) {
      return sendError(res, "Email is required", 400);
    }
    if (!password) {
      return sendError(res, "Password is required", 400);
    }
    if (!role || !validRoles.includes(role)) {
      return sendError(res, `Invalid or missing role. Valid roles: ${validRoles.join(", ")}`, 400);
    }

    // Check if user already exists
    const existUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });
    if (existUser) {
      return sendError(res, "Username or email already exists", 409);
    }

    // Hash password and create user
    const hashedPass = await bcryptjs.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPass,
      role,
      refreshToken: null 
    });

    return sendSuccess(
      res,
      {
        username: user.username,
        email: user.email,
        role: user.role,
      },
      201
    );
  } catch (error) {
    console.error("❌ Register error:", error);
    return sendError(res, error.message || "Registration failed", 500);
  }
};

// ✅ CHECK EMAIL
export const checkEmailExistsController = async (req, res) => {
  try {
    const { reqData } = req.body || {};
    const { email } = reqData || {};
    
    if (!email) {
      return sendError(res, "Email is required", 400);
    }

    const user = await User.findOne({ where: { email } });
    if (user) {
      return sendError(res, "Email already exists", 409);
    }
    
    return sendSuccess(res, { message: "Email is available" });
  } catch (err) {
    console.error("❌ Check email error:", err);
    return sendError(res, err.message || "Internal Error", 500);
  }
};

// ✅ LOGIN
export const loginController = async (req, res) => {
  try {
    const { reqData } = req.body || {};
    const { username, password } = reqData || {};

    // Validate required fields
    if (!username) {
      return sendError(res, "Username is required", 400);
    }
    if (!password) {
      return sendError(res, "Password is required", 400);
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return sendError(res, "User not found", 404);
    }

    const isValid = await bcryptjs.compare(password, user.password);
    if (!isValid) {
      return sendError(res, "Invalid credentials", 401);
    }

    const accessToken = await generateAccessToken(user.dataValues);
    const refreshToken = await generateRefreshToken(user.dataValues);

    await user.update({ refreshToken, lastLoginAt: new Date() });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return sendSuccess(res, {
      username: user.username,
      role: user.role,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    return sendError(res, error.message || "Internal Error", 500);
  }
};

// ✅ FORGOT PASSWORD
export const forgotPasswordController = async (req, res) => {
  try {
    const { reqData } = req.body || {};
    const { email } = reqData || {};

    if (!email) {
      return sendError(res, "Email is required", 400);
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return sendError(res, "User not found", 404);
    }

    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = Date.now() + 1000 * 60 * 15; // 15 minutes

    await user.update({ resetToken: token, resetTokenExpiry: tokenExpiry });

    const resetLink = `https://alpine/reset-password/${token}`;
    await sendEmail(
      user.email,
      "Reset Password",
      `<p>Click <a href='${resetLink}'>here</a> to reset your password.</p>`
    );

    return sendSuccess(res, { message: "Reset link sent to email." });
  } catch (err) {
    console.error("❌ Forgot password error:", err);
    return sendError(res, err.message || "Something went wrong.", 500);
  }
};

// ✅ RESET PASSWORD
export const resetPasswordController = async (req, res) => {
  try {
    const { token } = req.params;
    const { reqData } = req.body || {};
    const { newPassword } = reqData || {};

    if (!token) {
      return sendError(res, "Reset token is required", 400);
    }

    if (!newPassword) {
      return sendError(res, "New password is required", 400);
    }

    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiry: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      return sendError(res, "Invalid or expired token", 400);
    }

    const hashedPass = await bcryptjs.hash(newPassword, 10);
    await user.update({
      password: hashedPass,
      resetToken: null,
      resetTokenExpiry: null,
    });

    return sendSuccess(res, { message: "Password reset successful." });
  } catch (err) {
    console.error("❌ Reset password error:", err);
    return sendError(res, err.message || "Something went wrong.", 500);
  }
};

// ✅ REFRESH TOKEN
export const refreshController = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return sendError(res, "Refresh token is required", 403);
    }

    const user = await User.findOne({ where: { refreshToken } });
    if (!user) {
      return sendError(res, "Invalid refresh token", 403);
    }

    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return sendError(res, "Invalid or expired refresh token", 403);
      }
      const accessToken = generateAccessToken(user.dataValues);
      return sendSuccess(res, { accessToken });
    });
  } catch (e) {
    console.error("❌ Refresh token error:", e);
    return sendError(res, e.message || "Internal Error", 500);
  }
};

// ✅ LOGOUT
export const logoutController = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (refreshToken) {
      const user = await User.findOne({ where: { refreshToken } });
      if (user) {
        await user.update({ refreshToken: null });
      }
    }
    
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    
    return sendSuccess(res, { message: "Logged out successfully" });
  } catch (e) {
    console.error("❌ Logout error:", e);
    return sendError(res, e.message || "Internal Error", 500);
  }
};
