/**
 * Visitor Log Cleanup Job
 * Automatically removes visitor logs older than 24 hours (IST)
 * Run this as a scheduled job (cron) or manually
 */

import { VisitorLog } from '../db/dbconnection.js';
import { Op } from 'sequelize';

/**
 * Convert IST time to UTC for database queries
 * IST is UTC+5:30
 */
const getISTDate = () => {
  const now = new Date();
  // IST offset: +5:30 hours = +5.5 hours = +19800000 milliseconds
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istTime = new Date(now.getTime() + istOffset);
  return istTime;
};

/**
 * Get cutoff date (24 hours ago in IST)
 */
const getCutoffDate = () => {
  const istNow = getISTDate();
  // 24 hours ago
  const cutoff = new Date(istNow.getTime() - (24 * 60 * 60 * 1000));
  // Convert back to UTC for database (subtract IST offset)
  const istOffset = 5.5 * 60 * 60 * 1000;
  return new Date(cutoff.getTime() - istOffset);
};

/**
 * Run cleanup job - removes visitor logs older than 24 hours (IST)
 * @returns {Promise<{deletedCount: number, lastLogDate: Date | null, cutoffDate: Date}>}
 */
export const runCleanupJob = async () => {
  try {
    if (!VisitorLog) {
      console.warn('⚠️ VisitorLog model not available');
      return { deletedCount: 0, lastLogDate: null, cutoffDate: null };
    }

    const cutoffDate = getCutoffDate();
    const istNow = getISTDate();
    
    // console.log(`🧹 Starting visitor log cleanup (IST: ${istNow.toISOString()})...`);
    // console.log(`📅 Removing logs older than: ${cutoffDate.toISOString()} (24 hours ago in IST)`);

    // Get the last log date before cleanup (for display)
    const lastLog = await VisitorLog.findOne({
      order: [['visitedAt', 'DESC']],
      attributes: ['visitedAt'],
      raw: true,
    });
    const lastLogDate = lastLog?.visitedAt || null;

    // Delete logs older than 24 hours
    const deletedCount = await VisitorLog.destroy({
      where: {
        visitedAt: {
          [Op.lt]: cutoffDate,
        },
      },
    });

    // console.log(`✅ Cleanup completed. Deleted ${deletedCount} visitor logs older than 24 hours (IST).`);
    if (lastLogDate) {
      console.log(`📊 Last visitor log date before cleanup: ${new Date(lastLogDate).toISOString()}`);
    }

    return {
      deletedCount,
      lastLogDate: lastLogDate ? new Date(lastLogDate) : null,
      cutoffDate,
      cleanupDate: new Date(),
    };
  } catch (error) {
    console.error('❌ Visitor log cleanup job failed:', error);
    throw error;
  }
};

/**
 * Get cleanup status (last cleanup date and current log count)
 */
export const getCleanupStatus = async () => {
  try {
    if (!VisitorLog) {
      return { lastCleanupDate: null, totalLogs: 0, oldestLogDate: null };
    }

    // Get oldest log date
    const oldestLog = await VisitorLog.findOne({
      order: [['visitedAt', 'ASC']],
      attributes: ['visitedAt'],
      raw: true,
    });

    // Get total count
    const totalLogs = await VisitorLog.count();

    return {
      lastCleanupDate: null, // Will be stored separately or in a config table
      totalLogs,
      oldestLogDate: oldestLog?.visitedAt ? new Date(oldestLog.visitedAt) : null,
    };
  } catch (error) {
    console.error('❌ Error getting cleanup status:', error);
    return { lastCleanupDate: null, totalLogs: 0, oldestLogDate: null };
  }
};

// Track last cleanup to avoid running multiple times
let lastCleanupDate = null;

/**
 * Schedule cleanup job to run daily at 2:00 AM IST
 * Uses setInterval to check if it's time to run cleanup
 */
export const scheduleCleanup = () => {
  const checkAndRun = async () => {
    try {
      const now = new Date();
      const istOffset = 5.5 * 60 * 60 * 1000; // IST = UTC + 5:30
      const istTime = now.getTime() + istOffset;
      const istDate = new Date(istTime);
      const hours = istDate.getUTCHours();
      const minutes = istDate.getUTCMinutes();
      const date = istDate.toISOString().split('T')[0]; // YYYY-MM-DD
      
      // Run at 2:00 AM IST
      // Check if it's between 2:00 AM and 2:10 AM IST and we haven't run today
      if (hours === 2 && minutes >= 0 && minutes < 10) {
        if (lastCleanupDate !== date) {
          lastCleanupDate = date;
          console.log(`🧹 Running scheduled visitor log cleanup (IST: ${istDate.toISOString()})...`);
          await runCleanupJob();
        }
      }
    } catch (error) {
      console.error('❌ Scheduled cleanup failed:', error);
    }
  };

  // Check every 5 minutes
  const interval = setInterval(checkAndRun, 5 * 60 * 1000);
  
  // Run immediately on startup if it's cleanup time
  checkAndRun();

  console.log('✅ Visitor log cleanup scheduler started (runs daily at 2:00 AM IST)');
  
  return interval;
};

