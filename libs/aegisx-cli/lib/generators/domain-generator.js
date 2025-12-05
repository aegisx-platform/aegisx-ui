const fs = require('fs').promises;
const path = require('path');
const Handlebars = require('handlebars');

/**
 * Calculate correct output directory relative to monorepo root
 */
function getMonorepoPath(relativePath) {
  const cwd = process.cwd();
  const isInLibsCli =
    cwd.includes('/libs/aegisx-cli') || cwd.endsWith('libs/aegisx-cli');
  const isInLibsCrudGenerator =
    cwd.includes('/libs/aegisx-crud-generator') ||
    cwd.endsWith('libs/aegisx-crud-generator');
  const isInToolsCrudGenerator = cwd.endsWith('tools/crud-generator');

  let basePath;
  if (isInLibsCli || isInLibsCrudGenerator) {
    basePath = path.resolve(cwd, '../..');
  } else if (isInToolsCrudGenerator) {
    basePath = path.resolve(cwd, '../..');
  } else {
    basePath = cwd;
  }

  return path.resolve(basePath, relativePath);
}

/**
 * Convert domain name to various formats
 */
function formatDomainName(domainName) {
  const kebabCase = domainName.toLowerCase().replace(/_/g, '-');
  const snakeCase = domainName.toLowerCase().replace(/-/g, '_');
  const pascalCase = domainName
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
  const camelCase = pascalCase.charAt(0).toLowerCase() + pascalCase.slice(1);

  return {
    original: domainName,
    kebabCase,
    snakeCase,
    pascalCase,
    camelCase,
    upperCase: snakeCase.toUpperCase(),
  };
}

/**
 * Check if domain already exists
 */
async function isDomainInitialized(domainName) {
  const formats = formatDomainName(domainName);
  const knexfilePath = getMonorepoPath(`knexfile-${formats.kebabCase}.ts`);
  const migrationsPath = getMonorepoPath(
    `apps/api/src/database/migrations-${formats.kebabCase}`,
  );

  try {
    await fs.access(knexfilePath);
    return { exists: true, knexfile: true, migrations: false };
  } catch {
    // Knexfile doesn't exist
  }

  try {
    await fs.access(migrationsPath);
    return { exists: true, knexfile: false, migrations: true };
  } catch {
    // Migrations folder doesn't exist
  }

  return { exists: false, knexfile: false, migrations: false };
}

/**
 * Generate domain initialization files
 */
async function initializeDomain(domainName, options = {}) {
  const { dryRun = false, force = false } = options;

  const formats = formatDomainName(domainName);
  const generatedFiles = [];

  console.log(`\n🚀 Initializing domain: ${formats.pascalCase}`);
  console.log(`   Schema: ${formats.snakeCase}`);
  console.log(`   Knexfile: knexfile-${formats.kebabCase}.ts`);
  console.log(`   Migrations: migrations-${formats.kebabCase}/\n`);

  // Check if domain already exists
  const status = await isDomainInitialized(domainName);
  if (status.exists && !force) {
    console.log(`⚠️  Domain '${domainName}' already initialized:`);
    if (status.knexfile) console.log(`   ✓ Knexfile exists`);
    if (status.migrations) console.log(`   ✓ Migrations folder exists`);
    console.log(`\n   Use --force to reinitialize.`);
    return { success: false, reason: 'already_exists' };
  }

  // 1. Create knexfile
  const knexfileContent = generateKnexfileContent(formats);
  const knexfilePath = getMonorepoPath(`knexfile-${formats.kebabCase}.ts`);

  if (dryRun) {
    console.log(`📋 Would create: ${knexfilePath}`);
  } else {
    await fs.writeFile(knexfilePath, knexfileContent, 'utf8');
    console.log(`✅ Created: knexfile-${formats.kebabCase}.ts`);
  }
  generatedFiles.push(knexfilePath);

  // 2. Create migrations folder
  const migrationsPath = getMonorepoPath(
    `apps/api/src/database/migrations-${formats.kebabCase}`,
  );

  if (dryRun) {
    console.log(`📋 Would create: ${migrationsPath}/`);
  } else {
    await fs.mkdir(migrationsPath, { recursive: true });
    console.log(`✅ Created: migrations-${formats.kebabCase}/`);
  }
  generatedFiles.push(migrationsPath);

  // 3. Create seeds folder
  const seedsPath = getMonorepoPath(
    `apps/api/src/database/seeds-${formats.kebabCase}`,
  );

  if (dryRun) {
    console.log(`📋 Would create: ${seedsPath}/`);
  } else {
    await fs.mkdir(seedsPath, { recursive: true });
    // Create .gitkeep
    await fs.writeFile(path.join(seedsPath, '.gitkeep'), '', 'utf8');
    console.log(`✅ Created: seeds-${formats.kebabCase}/`);
  }
  generatedFiles.push(seedsPath);

  // 4. Create schema migration
  const schemaMigrationContent = generateSchemaMigrationContent(formats);
  const schemaMigrationPath = path.join(
    migrationsPath,
    `001_create_${formats.snakeCase}_schema.ts`,
  );

  if (dryRun) {
    console.log(`📋 Would create: ${schemaMigrationPath}`);
  } else {
    await fs.writeFile(schemaMigrationPath, schemaMigrationContent, 'utf8');
    console.log(
      `✅ Created: migrations-${formats.kebabCase}/001_create_${formats.snakeCase}_schema.ts`,
    );
  }
  generatedFiles.push(schemaMigrationPath);

  // 5. Create modules folder
  const modulesPath = getMonorepoPath(
    `apps/api/src/modules/${formats.kebabCase}`,
  );

  if (dryRun) {
    console.log(`📋 Would create: ${modulesPath}/`);
  } else {
    await fs.mkdir(modulesPath, { recursive: true });
    console.log(`✅ Created: modules/${formats.kebabCase}/`);
  }
  generatedFiles.push(modulesPath);

  // 6. Create domain index.ts (plugin registration)
  const domainIndexContent = generateDomainIndexContent(formats);
  const domainIndexPath = path.join(modulesPath, 'index.ts');

  if (dryRun) {
    console.log(`📋 Would create: ${domainIndexPath}`);
  } else {
    await fs.writeFile(domainIndexPath, domainIndexContent, 'utf8');
    console.log(`✅ Created: modules/${formats.kebabCase}/index.ts`);
  }
  generatedFiles.push(domainIndexPath);

  // Summary
  console.log(`\n🎉 Domain '${formats.pascalCase}' initialized successfully!`);
  console.log(`\n📝 Next steps:`);
  console.log(`   1. Run migration to create schema:`);
  console.log(
    `      npx knex migrate:latest --knexfile knexfile-${formats.kebabCase}.ts`,
  );
  console.log(`\n   2. Generate CRUD modules:`);
  console.log(
    `      pnpm run crud -- <table_name> --domain ${formats.kebabCase} --schema ${formats.snakeCase} --force`,
  );
  console.log(`\n   3. Register domain in main app (if needed):`);
  console.log(
    `      import ${formats.camelCase}Plugin from './modules/${formats.kebabCase}';`,
  );
  console.log(
    `      fastify.register(${formats.camelCase}Plugin, { prefix: '/api/${formats.kebabCase}' });`,
  );

  return {
    success: true,
    domain: formats,
    files: generatedFiles,
  };
}

/**
 * Generate knexfile content for domain
 */
function generateKnexfileContent(formats) {
  return `import type { Knex } from 'knex';
import * as dotenv from 'dotenv';

// Load .env first (base configuration)
dotenv.config();

// Load environment-specific configuration for development only
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env.local', override: true });
}

/**
 * Knex configuration for ${formats.pascalCase} Domain
 * Uses separate schema '${formats.snakeCase}' to isolate from system tables in 'public'
 */
const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'postgresql',
    connection: {
      host:
        process.env.DATABASE_HOST || process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(
        process.env.DATABASE_PORT || process.env.POSTGRES_PORT || '5432',
      ),
      database:
        process.env.DATABASE_NAME || process.env.POSTGRES_DB || 'aegisx_db',
      user:
        process.env.DATABASE_USER || process.env.POSTGRES_USER || 'postgres',
      password:
        process.env.DATABASE_PASSWORD ||
        process.env.POSTGRES_PASSWORD ||
        'postgres',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './apps/api/src/database/migrations-${formats.kebabCase}',
      tableName: 'knex_migrations_${formats.snakeCase}',
      schemaName: '${formats.snakeCase}',
      extension: 'ts',
    },
    seeds: {
      directory: './apps/api/src/database/seeds-${formats.kebabCase}',
      extension: 'ts',
    },
  },
  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL || {
      host:
        process.env.DATABASE_HOST || process.env.POSTGRES_HOST || 'postgres',
      port: parseInt(
        process.env.DATABASE_PORT || process.env.POSTGRES_PORT || '5432',
      ),
      database:
        process.env.DATABASE_NAME || process.env.POSTGRES_DB || 'aegisx_db',
      user:
        process.env.DATABASE_USER || process.env.POSTGRES_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || process.env.POSTGRES_PASSWORD,
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
    },
    pool: {
      min: 5,
      max: 20,
    },
    migrations: {
      directory: './apps/api/src/database/migrations-${formats.kebabCase}',
      tableName: 'knex_migrations_${formats.snakeCase}',
      schemaName: '${formats.snakeCase}',
      extension: 'ts',
    },
  },
};

export default config;
`;
}

/**
 * Generate schema migration content
 */
function generateSchemaMigrationContent(formats) {
  return `import { Knex } from 'knex';

/**
 * Create ${formats.pascalCase} schema
 * This migration creates the PostgreSQL schema for the ${formats.pascalCase} domain
 */
export async function up(knex: Knex): Promise<void> {
  // Create ${formats.snakeCase} schema if not exists
  await knex.raw(\`CREATE SCHEMA IF NOT EXISTS ${formats.snakeCase}\`);

  // Set search_path to include ${formats.snakeCase} schema
  await knex.raw(\`SET search_path TO ${formats.snakeCase}, public\`);

  // Grant privileges
  await knex.raw(\`GRANT ALL ON SCHEMA ${formats.snakeCase} TO postgres\`);
  await knex.raw(\`GRANT USAGE ON SCHEMA ${formats.snakeCase} TO postgres\`);

  console.log('✅ Created schema: ${formats.snakeCase}');
}

export async function down(knex: Knex): Promise<void> {
  // Warning: This will drop the entire schema and all its objects
  // Only use in development
  await knex.raw(\`DROP SCHEMA IF EXISTS ${formats.snakeCase} CASCADE\`);

  console.log('🗑️  Dropped schema: ${formats.snakeCase}');
}
`;
}

/**
 * Generate domain index.ts (Fastify plugin)
 */
function generateDomainIndexContent(formats) {
  return `import fp from 'fastify-plugin';
import type { FastifyInstance, FastifyPluginOptions } from 'fastify';

/**
 * ${formats.pascalCase} Domain Plugin
 *
 * This plugin registers all routes for the ${formats.pascalCase} domain.
 * Submodules will be registered automatically as they are generated.
 *
 * @example
 * // In main app.ts
 * import ${formats.camelCase}Plugin from './modules/${formats.kebabCase}';
 * fastify.register(${formats.camelCase}Plugin, { prefix: '/api/${formats.kebabCase}' });
 */
export default fp(
  async function ${formats.camelCase}DomainPlugin(
    fastify: FastifyInstance,
    options: FastifyPluginOptions
  ) {
    const prefix = options.prefix || '/${formats.kebabCase}';

    fastify.log.info(\`Registering ${formats.pascalCase} domain at \${prefix}\`);

    // Domain health check
    fastify.get(\`\${prefix}/health\`, async () => ({
      domain: '${formats.kebabCase}',
      status: 'healthy',
      timestamp: new Date().toISOString(),
    }));

    // TODO: Register submodules here as they are generated
    // Example:
    // import employeesPlugin from './employees';
    // await fastify.register(employeesPlugin, { ...options, prefix: \`\${prefix}/employees\` });
  },
  {
    name: '${formats.kebabCase}-domain-plugin',
    dependencies: ['database', 'authentication'],
  }
);
`;
}

/**
 * List all initialized domains
 */
async function listDomains() {
  const databasePath = getMonorepoPath('apps/api/src/database');

  try {
    const files = await fs.readdir(databasePath);
    const domains = files
      .filter((f) => f.startsWith('migrations-') && f !== 'migrations')
      .map((f) => f.replace('migrations-', ''));

    if (domains.length === 0) {
      console.log('No domains initialized yet.');
      console.log('Run: aegisx domain init <domain-name>');
      return [];
    }

    console.log('\n📦 Initialized Domains:\n');
    for (const domain of domains) {
      const formats = formatDomainName(domain);
      const knexfileExists = await fileExists(
        getMonorepoPath(`knexfile-${formats.kebabCase}.ts`),
      );
      const modulesPath = getMonorepoPath(
        `apps/api/src/modules/${formats.kebabCase}`,
      );
      const modulesExist = await fileExists(modulesPath);

      console.log(`  ${formats.pascalCase}`);
      console.log(`    Schema: ${formats.snakeCase}`);
      console.log(
        `    Knexfile: ${knexfileExists ? '✓' : '✗'} knexfile-${formats.kebabCase}.ts`,
      );
      console.log(
        `    Modules: ${modulesExist ? '✓' : '✗'} modules/${formats.kebabCase}/`,
      );
      console.log('');
    }

    return domains;
  } catch (error) {
    console.error('Error listing domains:', error.message);
    return [];
  }
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

module.exports = {
  initializeDomain,
  isDomainInitialized,
  listDomains,
  formatDomainName,
  getMonorepoPath,
};
