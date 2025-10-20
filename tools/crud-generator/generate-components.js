const FG = require('./src/frontend-generator');

const moduleName = process.argv[2] || 'authors';
const component = process.argv[3] || 'list';

const gen = new FG();

(async () => {
  try {
    console.log(`Generating ${component} for ${moduleName}...`);

    let files;
    switch (component) {
      case 'list':
        files = await gen.generateListComponent(moduleName);
        break;
      case 'dialogs':
        files = await gen.generateDialogComponents(moduleName);
        break;
      default:
        throw new Error(`Unknown component type: ${component}`);
    }

    console.log('✅ Generated files:');
    files.forEach((f) => console.log(`   - ${f}`));
    process.exit(0);
  } catch (e) {
    console.error('❌ Error:', e.message);
    console.error(e.stack);
    process.exit(1);
  }
})();
