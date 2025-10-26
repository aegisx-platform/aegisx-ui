#!/usr/bin/env node

/**
 * Direct Frontend Generation Script
 * Bypasses CLI and database connection
 */

const path = require('path');
const FrontendGenerator = require('./libs/aegisx-crud-generator/lib/generators/frontend-generator');

async function generateBudgetsFrontend() {
  try {
    const toolsDir = path.join(__dirname, 'libs/aegisx-crud-generator');
    const projectRoot = __dirname;

    const frontendGenerator = new FrontendGenerator(toolsDir, projectRoot, {
      templateVersion: 'v2',
    });

    console.log(
      '🎨 Generating budgets frontend module with Import feature...\n',
    );

    const generatedFiles = await frontendGenerator.generateFrontendModule(
      'budgets',
      {
        enhanced: false,
        full: false,
        dryRun: false,
        force: true,
        withImport: true,
      },
    );

    console.log('\n✅ Frontend module generated successfully!');
    console.log('📂 Generated files:');
    generatedFiles.forEach((file) => {
      console.log(`  ✓ ${file}`);
    });
  } catch (error) {
    console.error('\n❌ Error generating frontend module:');
    console.error(error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

generateBudgetsFrontend();
