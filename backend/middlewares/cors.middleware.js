/**
 * ✅ SINGLE SOURCE OF TRUTH — CORS MIDDLEWARE
 * No manual headers
 * No duplicate handlers
 *
 * ENV CONTROL:
 *   OPEN_CORS=true  -> Allow ALL origins (dev / testing)
 *   OPEN_CORS=false -> Allow ONLY whitelisted origins (production)
 */

import cors from "cors";

const OPEN_CORS = process.env.OPEN_CORS === "true";

// 🔒 Whitelist (used only when OPEN_CORS=false)
const allowedOrigins = [
  "https://wildvalleyfoods.in",
  "https://www.wildvalleyfoods.in",
  "https://dev.wildvalleyfoods.in",

  "http://13.235.53.15:8081",
  "http://13.235.53.15:4200",

  "http://localhost:4200",
  "http://localhost:8081",
  "http://127.0.0.1:4200",
];

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // ✅ Always allow Postman, mobile apps, server-to-server
    if (!origin) {
      console.log("🟢 [CORS] Allowed request with no origin (server/Postman/mobile)");
      return callback(null, true);
    }

    // 🔓 OPEN MODE: allow ALL browser origins
    if (OPEN_CORS) {
      console.log(`🟡 [CORS:OPEN] Allowed origin: ${origin}`);
      return callback(null, true);
    }

    // 🔒 STRICT MODE: allow only whitelisted
    if (allowedOrigins.includes(origin)) {
      console.log(`🟢 [CORS:STRICT] Allowed origin: ${origin}`);
      return callback(null, true);
    }

    // ❌ Blocked
    console.error(`🔴 [CORS:BLOCKED] Origin blocked: ${origin}`);
    return callback(new Error("Not allowed by CORS"));
  },

  credentials: true,

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Accept",
    "X-Requested-With",
    "Cache-Control",
    "Pragma",
    "targetapitype",
    "isdeveloperapk",
    "appversion",
  ],

  exposedHeaders: ["Authorization", "X-Total-Count"],

  optionsSuccessStatus: 204,
});
