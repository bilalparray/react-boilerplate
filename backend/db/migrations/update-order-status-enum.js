/**
 * Migration: Update Order Status Enum
 * Adds new status values: shipped, delivered, cancelled
 * Run this once to update the database enum type
 */

export const updateOrderStatusEnum = async (sequelize) => {
  try {
    console.log('🔄 Updating Order status enum...');
    
    // Check if enum exists
    const [enumCheck] = await sequelize.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'enum_Orders_status'
      ) as exists;
    `);

    if (enumCheck && enumCheck[0] && enumCheck[0].exists) {
      // Add new enum values if they don't exist
      const newValues = ['shipped', 'delivered', 'cancelled'];
      
      for (const value of newValues) {
        try {
          // Use direct SQL to add enum values
          await sequelize.query(`
            DO $$ 
            BEGIN
              IF NOT EXISTS (
                SELECT 1 FROM pg_enum 
                WHERE enumlabel = '${value}' 
                AND enumtypid = (
                  SELECT oid FROM pg_type WHERE typname = 'enum_Orders_status'
                )
              ) THEN
                ALTER TYPE "enum_Orders_status" ADD VALUE '${value}';
              END IF;
            END $$;
          `);
          console.log(`✅ Added enum value: ${value}`);
        } catch (err) {
          // Value might already exist, that's okay
          const errMsg = err.message || '';
          if (errMsg.includes('already exists') || errMsg.includes('duplicate')) {
            console.log(`ℹ️  Enum value '${value}' already exists`);
          } else {
            console.warn(`⚠️  Could not add enum value '${value}':`, errMsg);
          }
        }
      }
      
      console.log('✅ Order status enum update completed');
    } else {
      console.log('ℹ️  Enum type does not exist yet, it will be created on next sync');
    }
  } catch (err) {
    console.error('❌ Error updating Order status enum:', err);
    // Don't throw - allow server to continue
    console.warn('⚠️  Continuing despite enum update error...');
  }
};
