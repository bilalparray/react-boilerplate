/**
 * Error Log Cleanup Job
 * Automatically removes old resolved error logs
 * Run this as a scheduled job (cron) or manually
 */

import { cleanupOldLogs } from '../Helper/errorLogger.helper.js';

/**
 * Run cleanup job
 * @param {number} daysToKeep - Number of days to keep logs (default: 30)
 */
export const runCleanupJob = async (daysToKeep = 30) => {
  try {
    console.log(`🧹 Starting error log cleanup (keeping last ${daysToKeep} days)...`);
    const deletedCount = await cleanupOldLogs(daysToKeep);
    console.log(`✅ Cleanup completed. Deleted ${deletedCount} old error logs.`);
    return deletedCount;
  } catch (error) {
    console.error('❌ Error log cleanup job failed:', error);
    throw error;
  }
};

/**
 * Schedule cleanup job using node-cron (if installed)
 * Uncomment and configure if you want automatic scheduling
 */
// import cron from 'node-cron';
// 
// // Run cleanup every day at 2 AM
// export const scheduleCleanupJob = () => {
//   cron.schedule('0 2 * * *', async () => {
//     await runCleanupJob(30); // Keep last 30 days
//   });
//   console.log('✅ Error log cleanup job scheduled (daily at 2 AM)');
// };

