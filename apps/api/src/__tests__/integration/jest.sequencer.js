const Sequencer = require('@jest/test-sequencer').default;

class IntegrationTestSequencer extends Sequencer {
  /**
   * Custom test sequencer to control the order of integration tests
   * This helps avoid database conflicts and ensures proper test isolation
   */
  sort(tests) {
    // Define test execution order
    const testOrder = [
      'setup.spec.ts',           // Setup tests first
      'auth-flow.integration.spec.ts',    // Authentication tests
      'user-profile.integration.spec.ts', // User profile tests  
      'navigation.integration.spec.ts',   // Navigation tests
      'cross-module.integration.spec.ts', // Cross-module tests last
    ];

    // Sort tests based on defined order
    const sortedTests = tests.sort((testA, testB) => {
      const getTestOrder = (testPath) => {
        for (let i = 0; i < testOrder.length; i++) {
          if (testPath.includes(testOrder[i])) {
            return i;
          }
        }
        return testOrder.length; // Put unmatched tests at the end
      };

      const orderA = getTestOrder(testA.path);
      const orderB = getTestOrder(testB.path);

      // Primary sort by defined order
      if (orderA !== orderB) {
        return orderA - orderB;
      }

      // Secondary sort alphabetically for tests with same priority
      return testA.path.localeCompare(testB.path);
    });

    // Log the test execution order for debugging
    if (process.env.JEST_VERBOSE === 'true') {
      console.log('\n📋 Integration Test Execution Order:');
      sortedTests.forEach((test, index) => {
        const testName = test.path.split('/').pop();
        console.log(`  ${index + 1}. ${testName}`);
      });
      console.log('');
    }

    return sortedTests;
  }
}

module.exports = IntegrationTestSequencer;