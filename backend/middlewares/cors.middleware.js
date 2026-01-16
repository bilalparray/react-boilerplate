/**
 * ✅ SINGLE SOURCE OF TRUTH — CORS MIDDLEWARE
 * No manual headers
 * No duplicate handlers
 *
 * MODE:
 *   All browser origins allowed
 */

import cors from "cors";

// Always open
const OPEN_CORS = true;

// Kept for reference but no longer used
const allowedOrigins = [
  "https://wildvalleyfoods.in",
  "https://www.wildvalleyfoods.in",
  "https://dev.wildvalleyfoods.in",
  "http://localhost:4200",
  "http://localhost:8081",
  "http://127.0.0.1:4200",
];

export const corsMiddleware = cors({
  origin: "*",

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
