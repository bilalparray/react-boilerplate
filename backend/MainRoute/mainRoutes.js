import router from "../route/auth/auth.routes.js";
import licenseRouter from "../route/License/license.route.js";
import moduleRouter from "../route/License/module.route.js";
import bannerRoute from "../route/websiteResources/banner.route.js";
import category from "../route/product/category.route.js";
import product from "../route/product/product.route.js";
import adminProduct from "../route/product/adminProduct.route.js";
import unitValueRoute from "../route/product/unitValue.route.js";
import customer from "../route/customer/customer.route.js";
import contactus from "../route/contact-us/contactUs.route.js";
import Review  from "../route/product/review.route.js"
import adminReview from "../route/product/adminReview.route.js"
import testimonials from "../route/websiteResources/testimonial.route.js";
import video from "../route/websiteResources/video.route.js"; 
import orderRoute from "../route/Order/order.route.js";
import reportsRoute from "../route/reports/reports.route.js";
import dashboardRoute from "../route/dashboard/dashboard.route.js";
import invoiceRoute from "../route/invoice/invoice.route.js";
import errorLogRoute from "../route/errorLog/errorLog.route.js";
import frontendErrorLogRoute from "../route/errorLog/frontendErrorLog.route.js";
/**
 * Registers all routes with base paths
 * @param {Express.Application} app 
 * @param {string} baseUrl 
 */
export const registerRoutes = (app, baseUrl = "") => {
  // Log route registration for debugging
  // console.log(`📋 Registering routes with BASE_URL: "${baseUrl || '(empty)'}"`);
  // console.log(`   Auth routes will be at: ${baseUrl || ''}/register, ${baseUrl || ''}/login, etc.`);
  
  app.use(`${baseUrl}`, router);
  app.use(`${baseUrl}/license`, licenseRouter);
  app.use(`${baseUrl}/module`, moduleRouter);
  app.use(`${baseUrl}/banner`, bannerRoute);
  app.use(`${baseUrl}`, category);
  app.use(`${baseUrl}/product`, product);
  app.use(`${baseUrl}/admin/product`, adminProduct);
  app.use(`${baseUrl}/admin/unit-values`, unitValueRoute);
  app.use(`${baseUrl}/customer`, customer);
  app.use(`${baseUrl}/contactus`, contactus);
  // app.use(`${baseUrl}/webhooks`, webhooks);
   // IMPORTANT — RAW BODY FOR WEBHOOK
  // app.use(
  //   `${baseUrl}/webhooks`,           // <--- FIXED (api replaced with baseUrl)
  //   express.raw({ type: "*/*" }),
  //   webhooks
  // );
  app.use(`${baseUrl}/review`, Review);
  app.use(`${baseUrl}/AdminReview`, adminReview);
  app.use(`${baseUrl}/testimonial`, testimonials);
  app.use(`${baseUrl}/video`, video);
  app.use(`${baseUrl}/order`, orderRoute);
  app.use(`${baseUrl}/reports`, reportsRoute);
  app.use(`${baseUrl}/dashboard`, dashboardRoute);
  app.use(`${baseUrl}/invoice`, invoiceRoute);
  app.use(`${baseUrl}/error-log`, frontendErrorLogRoute); // Public endpoint for frontend
  app.use(`${baseUrl}/admin/error-logs`, errorLogRoute); // Admin-only endpoint
  
  // Payment webhook (must use raw body - already handled above for /webhooks)
  // If you want separate payment webhook endpoint, uncomment below:
  // app.use(
  //   `${baseUrl}/payments/webhook`,
  //   express.raw({ type: "*/*" }),
  //   paymentRoute
  // );

};
