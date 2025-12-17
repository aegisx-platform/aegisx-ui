#!/usr/bin/env node
/**
 * API Version Documentation Generator
 *
 * Generates versioned API documentation from OpenAPI specs and route definitions.
 * Tracks changes between API versions and generates migration guides.
 *
 * Usage:
 *   npx ts-node scripts/generate-api-version-docs.ts
 *   npx ts-node scripts/generate-api-version-docs.ts --version v2
 *   npx ts-node scripts/generate-api-version-docs.ts --compare v1 v2
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

interface APIEndpoint {
  method: string;
  path: string;
  summary?: string;
  description?: string;
  tags?: string[];
  deprecated?: boolean;
  version: string;
  module: string;
  file: string;
}

interface APIVersion {
  version: string;
  releaseDate: string;
  endpoints: APIEndpoint[];
  changes?: {
    added: APIEndpoint[];
    removed: APIEndpoint[];
    modified: APIEndpoint[];
    deprecated: APIEndpoint[];
  };
}

/**
 * Extract API endpoints from route files
 */
async function extractEndpoints(version: string): Promise<APIEndpoint[]> {
  const endpoints: APIEndpoint[] = [];

  // Find all route files
  const routeFiles = await glob('apps/api/src/**/*.routes.ts', {
    ignore: ['**/*.spec.ts', '**/*.test.ts', '**/node_modules/**'],
  });

  for (const file of routeFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');

    // Extract module name from path
    const moduleName = path.basename(path.dirname(file));

    // Find route registrations
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Look for fastify.route() or app.route() calls
      if (
        line.includes('.route({') ||
        line.includes('.get(') ||
        line.includes('.post(') ||
        line.includes('.put(') ||
        line.includes('.delete(')
      ) {
        let method = 'GET';
        let routePath = '';
        let summary = '';
        let description = '';
        let tags: string[] = [];
        let deprecated = false;

        // Determine method
        if (line.includes('.get(')) method = 'GET';
        else if (line.includes('.post(')) method = 'POST';
        else if (line.includes('.put(')) method = 'PUT';
        else if (line.includes('.delete(')) method = 'DELETE';
        else if (line.includes('.patch(')) method = 'PATCH';

        // Extract route details from the next few lines
        for (let j = i; j < Math.min(i + 30, lines.length); j++) {
          const routeLine = lines[j].trim();

          // Extract URL
          if (routeLine.startsWith('url:') || routeLine.startsWith('path:')) {
            const match = routeLine.match(/['"]([^'"]+)['"]/);
            if (match) routePath = match[1];
          }

          // Extract method from schema
          if (routeLine.startsWith('method:')) {
            const match = routeLine.match(/['"](\w+)['"]/);
            if (match) method = match[1];
          }

          // Extract summary
          if (routeLine.startsWith('summary:')) {
            const match = routeLine.match(/['"]([^'"]+)['"]/);
            if (match) summary = match[1];
          }

          // Extract description
          if (routeLine.startsWith('description:')) {
            const match = routeLine.match(/['"]([^'"]+)['"]/);
            if (match) description = match[1];
          }

          // Extract tags
          if (routeLine.includes('tags:')) {
            const tagMatch = routeLine.match(/\[([^\]]+)\]/);
            if (tagMatch) {
              tags = tagMatch[1]
                .split(',')
                .map((t) => t.trim().replace(/['"]/g, ''));
            }
          }

          // Check if deprecated
          if (routeLine.includes('deprecated:') && routeLine.includes('true')) {
            deprecated = true;
          }

          // End of route definition
          if (routeLine.includes('});') || routeLine.includes('})')) {
            break;
          }
        }

        if (routePath) {
          endpoints.push({
            method,
            path: routePath,
            summary,
            description,
            tags,
            deprecated,
            version,
            module: moduleName,
            file: path.relative(process.cwd(), file),
          });
        }
      }
    }
  }

  return endpoints;
}

/**
 * Compare two API versions
 */
function compareVersions(
  oldEndpoints: APIEndpoint[],
  newEndpoints: APIEndpoint[],
): {
  added: APIEndpoint[];
  removed: APIEndpoint[];
  modified: APIEndpoint[];
  deprecated: APIEndpoint[];
} {
  const oldMap = new Map<string, APIEndpoint>();
  const newMap = new Map<string, APIEndpoint>();

  oldEndpoints.forEach((ep) => {
    oldMap.set(`${ep.method} ${ep.path}`, ep);
  });

  newEndpoints.forEach((ep) => {
    newMap.set(`${ep.method} ${ep.path}`, ep);
  });

  const added: APIEndpoint[] = [];
  const removed: APIEndpoint[] = [];
  const modified: APIEndpoint[] = [];
  const deprecated: APIEndpoint[] = [];

  // Find added endpoints
  newEndpoints.forEach((ep) => {
    const key = `${ep.method} ${ep.path}`;
    if (!oldMap.has(key)) {
      added.push(ep);
    } else {
      // Check if modified
      const oldEp = oldMap.get(key)!;
      if (
        oldEp.summary !== ep.summary ||
        oldEp.description !== ep.description ||
        JSON.stringify(oldEp.tags) !== JSON.stringify(ep.tags)
      ) {
        modified.push(ep);
      }

      // Check if newly deprecated
      if (!oldEp.deprecated && ep.deprecated) {
        deprecated.push(ep);
      }
    }
  });

  // Find removed endpoints
  oldEndpoints.forEach((ep) => {
    const key = `${ep.method} ${ep.path}`;
    if (!newMap.has(key)) {
      removed.push(ep);
    }
  });

  return { added, removed, modified, deprecated };
}

/**
 * Generate API version documentation
 */
function generateVersionDocs(apiVersion: APIVersion): string {
  let markdown = `# API ${apiVersion.version} Documentation\n\n`;
  markdown += `**Release Date:** ${apiVersion.releaseDate}\n\n`;

  // Group endpoints by module
  const byModule = new Map<string, APIEndpoint[]>();
  apiVersion.endpoints.forEach((ep) => {
    if (!byModule.has(ep.module)) {
      byModule.set(ep.module, []);
    }
    byModule.get(ep.module)!.push(ep);
  });

  markdown += `## Summary\n\n`;
  markdown += `- **Total Endpoints:** ${apiVersion.endpoints.length}\n`;
  markdown += `- **Modules:** ${byModule.size}\n\n`;

  // Changes section
  if (apiVersion.changes) {
    const { added, removed, modified, deprecated } = apiVersion.changes;

    if (
      added.length + removed.length + modified.length + deprecated.length >
      0
    ) {
      markdown += `## What's Changed\n\n`;

      if (added.length > 0) {
        markdown += `### ✨ New Endpoints (${added.length})\n\n`;
        added.forEach((ep) => {
          markdown += `- \`${ep.method} ${ep.path}\` - ${ep.summary || ep.description || 'No description'}\n`;
        });
        markdown += `\n`;
      }

      if (modified.length > 0) {
        markdown += `### 🔄 Modified Endpoints (${modified.length})\n\n`;
        modified.forEach((ep) => {
          markdown += `- \`${ep.method} ${ep.path}\` - ${ep.summary || ep.description || 'Updated'}\n`;
        });
        markdown += `\n`;
      }

      if (deprecated.length > 0) {
        markdown += `### ⚠️ Deprecated Endpoints (${deprecated.length})\n\n`;
        deprecated.forEach((ep) => {
          markdown += `- \`${ep.method} ${ep.path}\` - ${ep.summary || ep.description || 'Deprecated'}\n`;
        });
        markdown += `\n`;
      }

      if (removed.length > 0) {
        markdown += `### ❌ Removed Endpoints (${removed.length})\n\n`;
        removed.forEach((ep) => {
          markdown += `- \`${ep.method} ${ep.path}\` - ${ep.summary || ep.description || 'Removed'}\n`;
        });
        markdown += `\n`;
      }
    }
  }

  // Endpoints by module
  markdown += `## Endpoints by Module\n\n`;

  const sortedModules = Array.from(byModule.keys()).sort();

  for (const module of sortedModules) {
    const endpoints = byModule.get(module)!;
    markdown += `### ${module} (${endpoints.length} endpoints)\n\n`;

    // Sort by method and path
    const sorted = endpoints.sort((a, b) => {
      if (a.method !== b.method) {
        return a.method.localeCompare(b.method);
      }
      return a.path.localeCompare(b.path);
    });

    markdown += `| Method | Path | Description |\n`;
    markdown += `|--------|------|-------------|\n`;

    sorted.forEach((ep) => {
      const deprecated = ep.deprecated ? ' ⚠️ **DEPRECATED**' : '';
      markdown += `| \`${ep.method}\` | \`${ep.path}\` | ${ep.summary || ep.description || '-'}${deprecated} |\n`;
    });

    markdown += `\n`;
  }

  // Full endpoint details
  markdown += `## Endpoint Details\n\n`;

  for (const module of sortedModules) {
    const endpoints = byModule.get(module)!;

    endpoints.forEach((ep) => {
      markdown += `### \`${ep.method} ${ep.path}\`\n\n`;

      if (ep.deprecated) {
        markdown += `> ⚠️ **DEPRECATED** - This endpoint is deprecated and will be removed in a future version.\n\n`;
      }

      if (ep.description) {
        markdown += `${ep.description}\n\n`;
      }

      if (ep.tags && ep.tags.length > 0) {
        markdown += `**Tags:** ${ep.tags.map((t) => `\`${t}\``).join(', ')}\n\n`;
      }

      markdown += `**Module:** ${ep.module}\n\n`;
      markdown += `**Source:** [\`${path.basename(ep.file)}\`](../../${ep.file})\n\n`;
      markdown += `---\n\n`;
    });
  }

  return markdown;
}

/**
 * Generate migration guide
 */
function generateMigrationGuide(
  from: string,
  to: string,
  changes: NonNullable<APIVersion['changes']>,
): string {
  let markdown = `# API Migration Guide: ${from} → ${to}\n\n`;
  markdown += `**Date:** ${new Date().toISOString().split('T')[0]}\n\n`;

  const { added, removed, modified, deprecated } = changes;

  markdown += `## Overview\n\n`;
  markdown += `This guide will help you migrate from API ${from} to ${to}.\n\n`;

  if (removed.length > 0 || deprecated.length > 0) {
    markdown += `⚠️ **Action Required:** This version contains breaking changes.\n\n`;
  }

  markdown += `### Summary of Changes\n\n`;
  markdown += `- New endpoints: ${added.length}\n`;
  markdown += `- Modified endpoints: ${modified.length}\n`;
  markdown += `- Deprecated endpoints: ${deprecated.length}\n`;
  markdown += `- Removed endpoints: ${removed.length}\n\n`;

  // Breaking changes
  if (removed.length > 0 || deprecated.length > 0) {
    markdown += `## 🚨 Breaking Changes\n\n`;

    if (removed.length > 0) {
      markdown += `### Removed Endpoints\n\n`;
      markdown += `The following endpoints have been removed:\n\n`;

      removed.forEach((ep) => {
        markdown += `#### \`${ep.method} ${ep.path}\`\n\n`;
        markdown += `**Migration:** `;
        // Try to find replacement
        const similar = added.find((a) => a.module === ep.module);
        if (similar) {
          markdown += `Use \`${similar.method} ${similar.path}\` instead.\n\n`;
        } else {
          markdown += `No direct replacement. Please contact support.\n\n`;
        }
      });
    }

    if (deprecated.length > 0) {
      markdown += `### Deprecated Endpoints\n\n`;
      markdown += `The following endpoints are deprecated and will be removed in the next major version:\n\n`;

      deprecated.forEach((ep) => {
        markdown += `- \`${ep.method} ${ep.path}\` - ${ep.description || 'No description'}\n`;
      });
      markdown += `\n`;
    }
  }

  // New features
  if (added.length > 0) {
    markdown += `## ✨ New Features\n\n`;

    const byModule = new Map<string, APIEndpoint[]>();
    added.forEach((ep) => {
      if (!byModule.has(ep.module)) {
        byModule.set(ep.module, []);
      }
      byModule.get(ep.module)!.push(ep);
    });

    for (const [module, endpoints] of byModule) {
      markdown += `### ${module}\n\n`;
      endpoints.forEach((ep) => {
        markdown += `- \`${ep.method} ${ep.path}\` - ${ep.summary || ep.description || 'New endpoint'}\n`;
      });
      markdown += `\n`;
    }
  }

  // Modified endpoints
  if (modified.length > 0) {
    markdown += `## 🔄 Modified Endpoints\n\n`;
    markdown += `The following endpoints have been updated:\n\n`;

    modified.forEach((ep) => {
      markdown += `- \`${ep.method} ${ep.path}\` - ${ep.description || 'Updated'}\n`;
    });
    markdown += `\n`;
  }

  return markdown;
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const versionIndex = args.indexOf('--version');
  const compareIndex = args.indexOf('--compare');

  if (compareIndex >= 0) {
    // Compare two versions
    const v1 = args[compareIndex + 1] || 'v1';
    const v2 = args[compareIndex + 2] || 'v2';

    console.log(`📊 Comparing API ${v1} → ${v2}...`);

    const oldEndpoints = await extractEndpoints(v1);
    const newEndpoints = await extractEndpoints(v2);

    const changes = compareVersions(oldEndpoints, newEndpoints);

    console.log(`\n📝 Changes:`);
    console.log(`   Added: ${changes.added.length}`);
    console.log(`   Removed: ${changes.removed.length}`);
    console.log(`   Modified: ${changes.modified.length}`);
    console.log(`   Deprecated: ${changes.deprecated.length}`);

    // Generate migration guide
    const migrationGuide = generateMigrationGuide(v1, v2, changes);
    const outputPath = path.join(
      process.cwd(),
      'docs',
      'api',
      `migration-${v1}-to-${v2}.md`,
    );

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, migrationGuide);

    console.log(`\n✅ Migration guide generated: ${outputPath}`);
  } else {
    // Generate docs for single version
    const version = versionIndex >= 0 ? args[versionIndex + 1] : 'current';

    console.log(`📋 Generating API documentation for ${version}...`);

    const endpoints = await extractEndpoints(version);

    console.log(`📝 Found ${endpoints.length} endpoints`);

    const apiVersion: APIVersion = {
      version,
      releaseDate: new Date().toISOString().split('T')[0],
      endpoints,
    };

    const markdown = generateVersionDocs(apiVersion);

    const outputDir = path.join(process.cwd(), 'docs', 'api', 'versions');
    const outputPath = path.join(outputDir, `${version}.md`);

    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(outputPath, markdown);

    console.log(`✅ API documentation generated: ${outputPath}`);

    // Also create a latest.md symlink or copy
    const latestPath = path.join(outputDir, 'latest.md');
    fs.writeFileSync(latestPath, markdown);
    console.log(`✅ Latest API documentation: ${latestPath}`);
  }
}

main().catch(console.error);
