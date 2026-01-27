import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import webhooks from "./controller/payments/webhookController.js";
import { registerRoutes } from "./MainRoute/mainRoutes.js";
import { dbConnection } from "./db/dbconnection.js";
import { setupSwagger } from "./swagger/swagger-setup.js";
import { initializeErrorLogger } from "./Helper/errorLogger.helper.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/errorHandler.middleware.js";

import { corsMiddleware } from "./middlewares/cors.middleware.js";

dotenv.config();

const app = express();

/* ======================================================
   ✅ CORS (FIRST — DO NOT MOVE)
====================================================== */
app.use(corsMiddleware);
app.options("*", corsMiddleware);

/* ======================================================
   🔥 Razorpay Webhook (RAW BODY)
====================================================== */
app.use(
  "/api/v1/webhooks",
  express.raw({ type: "application/json" }),
  webhooks
);

/* ======================================================
   📦 BODY PARSERS
====================================================== */
app.use(express.json({ limit: "2gb" }));
app.use(express.urlencoded({ extended: true, limit: "2gb" }));
app.use(cookieParser());

/* ======================================================
   🚀 SERVER BOOTSTRAP
====================================================== */
async function startServer() {
  try {
    // Optional visitor tracking
    try {
      const { trackVisitor } = await import("./middlewares/visitorTracker.middleware.js");
      app.use(trackVisitor);
      console.log("✅ Visitor tracking enabled");
    } catch {
      console.warn("⚠️ Visitor tracking skipped");
    }

    const db = await dbConnection();
    console.log("✅ Database connected");

    if (db?.models?.ErrorLog) {
      initializeErrorLogger(db.models.ErrorLog);
    }

    const baseUrl = process.env.BASE_URL || "/api/v1";
    registerRoutes(app, baseUrl);

    await setupSwagger(app, baseUrl);

    app.use(notFoundHandler);
    app.use(errorHandler);

    const PORT = process.env.PORT || 8081;
    app.listen(PORT, () => {
      console.log(`🚀 API running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Startup failed:", err);
    process.exit(1);
  }
}

startServer();
