#!/usr/bin/env node

const FrontendGenerator = require('./src/frontend-generator');

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];
const moduleName = args[1];

function showUsage() {
  console.log(`
🎯 Frontend CRUD Generator

Usage:
  node frontend-index.js generate <module-name> [options]

Commands:
  generate    Generate frontend Angular code for existing backend module

Options:
  --enhanced   Include enhanced operations (bulk operations, dropdown)
  --full       Include full operations (validation, stats, uniqueness check)
  --websocket  Include WebSocket real-time features
  --help       Show this help message

Examples:
  # Generate basic frontend for notifications module
  node frontend-index.js generate notifications

  # Generate with enhanced operations
  node frontend-index.js generate notifications --enhanced

  # Generate with WebSocket real-time features
  node frontend-index.js generate notifications --websocket

  # Generate with all operations (full package)
  node frontend-index.js generate notifications --enhanced --full --websocket

Requirements:
  - Backend module must already exist in apps/api/src/modules/<module-name>/
  - Backend must have schemas and routes files
  `);
}

async function main() {
  if (!command || command === '--help' || command === 'help') {
    showUsage();
    return;
  }

  if (command !== 'generate') {
    console.error('❌ Unknown command:', command);
    showUsage();
    process.exit(1);
  }

  if (!moduleName) {
    console.error('❌ Module name is required');
    showUsage();
    process.exit(1);
  }

  // Parse options
  const options = {
    enhanced: args.includes('--enhanced'),
    full: args.includes('--full'),
    websocket: args.includes('--websocket')
  };

  try {
    console.log('🚀 Frontend CRUD Generator');
    console.log('=' .repeat(50));
    
    const generator = new FrontendGenerator();
    const generatedFiles = await generator.generateFrontendModule(moduleName, options);

    console.log('\\n🎉 Generation completed successfully!');
    console.log(`📁 Generated ${generatedFiles.length} files:`);
    generatedFiles.forEach(file => {
      const relativePath = file.replace(process.cwd(), '.');
      console.log(`   ✅ ${relativePath}`);
    });

    console.log('\\n📝 Next Steps:');
    console.log('   1. Add routing for the new module');
    console.log('   2. Import the service in your components');
    console.log('   3. Update navigation to include the new feature');
    console.log('   4. Test the generated code with your backend API');

  } catch (error) {
    console.error('\\n❌ Generation failed:', error.message);
    console.error('\\nDebugging info:');
    console.error('  - Check that the backend module exists');
    console.error('  - Verify schemas and routes files are present');
    console.error('  - Ensure proper file permissions');
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled rejection:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error);
  process.exit(1);
});

// Run the main function
main();