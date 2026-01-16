import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendError } from '../../Helper/response.helper.js';
import { User } from '../../db/dbconnection.js';
dotenv.config();

const generateAccessToken=async(user)=>{
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    return token;
}

const generateRefreshToken=async(user)=>{
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );
    return token;

}

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return sendError(res, "Invalid token", 401);
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        if (error.name === 'TokenExpiredError') {
          return sendError(res, "Token Expired", 403);
        }
        return sendError(res, "Invalid token", 401);
      }
      req.user = decoded; // ✅ SET req.user
      next();
    });
  } catch (error) {
    return sendError(res, "Token processing failed", 500);
  }
};
  
export default async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Authentication token missing', 401);
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user) return sendError(res, 'User not found', 404);

    req.user = { id: user.id, role: user.role };
    next();
  } catch (err) {
    console.error('JWT Error:', err);
    if (err.name === 'TokenExpiredError') {
      return sendError(res, 'Token expired', 401);
    } else if (err.name === 'JsonWebTokenError') {
      return sendError(res, 'Invalid token', 401);
    }
    return sendError(res, 'Authentication failed', 401);
  }
}


// export default async function authenticate(req, res, next) {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer')) {
//       return sendError(res, 'Authentication token missing', 401);
//     }
//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

//     const user = await User.findByPk(decoded.id);
//     if (!user) return sendError(res, 'User not found', 404);

//     req.user = { id: user.id, role: user.role };
//     next();
//   } catch (err) {
//     return sendError(res, 'Invalid or expired token', 401);
//   }
// }
export {
    generateAccessToken,generateRefreshToken,authenticateToken,authenticate
}