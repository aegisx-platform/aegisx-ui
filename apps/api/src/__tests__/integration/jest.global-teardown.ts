import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { globalTeardown } from './setup';

// Load test environment variables
dotenv.config({ path: resolve(__dirname, '../../../../../.env.test') });

/**
 * Global teardown for integration tests
 * This runs once after all tests complete
 */
export default async (): Promise<void> => {
  console.log('🧹 Starting integration test teardown...');
  
  try {
    // Run global teardown from our setup utility
    await globalTeardown();
    
    console.log('✅ Integration test teardown completed successfully');
  } catch (error) {
    console.error('❌ Integration test teardown failed:', error);
    // Don't throw error in teardown to avoid masking test failures
    console.error('Error details:', error);
  }
};