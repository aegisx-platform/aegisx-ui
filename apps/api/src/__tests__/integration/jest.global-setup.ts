import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { globalSetup } from './setup';

// Load test environment variables
dotenv.config({ path: resolve(__dirname, '../../../../../.env.test') });

/**
 * Global setup for integration tests
 * This runs once before all tests start
 */
export default async (): Promise<void> => {
  console.log('🚀 Starting integration test setup...');
  
  try {
    // Run global setup from our setup utility
    await globalSetup();
    
    console.log('✅ Integration test setup completed successfully');
  } catch (error) {
    console.error('❌ Integration test setup failed:', error);
    throw error;
  }
};