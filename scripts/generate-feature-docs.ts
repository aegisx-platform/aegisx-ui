#!/usr/bin/env node
/**
 * Feature Documentation Generator
 *
 * Automatically generates feature documentation from TypeScript code comments.
 * Extracts JSDoc comments from:
 * - Controllers (API endpoints)
 * - Services (Business logic)
 * - Schemas (Data models)
 *
 * Usage:
 *   npx ts-node scripts/generate-feature-docs.ts [feature-name]
 *   npx ts-node scripts/generate-feature-docs.ts departments
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

interface DocComment {
  type: 'controller' | 'service' | 'schema' | 'repository';
  name: string;
  description: string;
  params?: Array<{ name: string; type: string; description: string }>;
  returns?: string;
  example?: string;
  tags?: string[];
  file: string;
  lineNumber: number;
}

interface FeatureDoc {
  name: string;
  overview: string;
  controllers: DocComment[];
  services: DocComment[];
  schemas: DocComment[];
  repositories: DocComment[];
}

/**
 * Extract JSDoc comments from TypeScript file
 */
function extractDocComments(filePath: string): DocComment[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const comments: DocComment[] = [];

  let currentComment: Partial<DocComment> = {};
  let inComment = false;
  let commentStart = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Start of JSDoc comment
    if (line.startsWith('/**')) {
      inComment = true;
      commentStart = i + 1;
      currentComment = {
        file: filePath,
        lineNumber: i + 1,
        params: [],
        tags: [],
      };
      continue;
    }

    // End of JSDoc comment
    if (line.startsWith('*/') && inComment) {
      inComment = false;

      // Try to find the function/class name on next non-empty line
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        const nextLine = lines[j].trim();
        if (nextLine && !nextLine.startsWith('//')) {
          const match = nextLine.match(
            /(?:export\s+)?(?:async\s+)?(?:function|class|const|export\s+const)\s+(\w+)/,
          );
          if (match) {
            currentComment.name = match[1];
          }
          break;
        }
      }

      // Determine type from file path
      if (filePath.includes('.controller.')) {
        currentComment.type = 'controller';
      } else if (filePath.includes('.service.')) {
        currentComment.type = 'service';
      } else if (filePath.includes('.schema')) {
        currentComment.type = 'schema';
      } else if (filePath.includes('.repository.')) {
        currentComment.type = 'repository';
      }

      if (currentComment.name && currentComment.description) {
        comments.push(currentComment as DocComment);
      }
      currentComment = {};
      continue;
    }

    // Inside JSDoc comment
    if (inComment && line.startsWith('*')) {
      const content = line.substring(1).trim();

      // Main description
      if (!content.startsWith('@')) {
        if (!currentComment.description) {
          currentComment.description = content;
        } else if (content) {
          currentComment.description += ' ' + content;
        }
      }

      // @param tag
      else if (content.startsWith('@param')) {
        const match = content.match(/@param\s+\{([^}]+)\}\s+(\w+)\s+-\s+(.+)/);
        if (match) {
          currentComment.params = currentComment.params || [];
          currentComment.params.push({
            name: match[2],
            type: match[1],
            description: match[3],
          });
        }
      }

      // @returns tag
      else if (content.startsWith('@returns')) {
        const match = content.match(/@returns\s+(.+)/);
        if (match) {
          currentComment.returns = match[1];
        }
      }

      // @example tag
      else if (content.startsWith('@example')) {
        currentComment.example = '';
      } else if (currentComment.example !== undefined && content) {
        currentComment.example += content + '\n';
      }

      // @tag
      else if (content.startsWith('@')) {
        const match = content.match(/@(\w+)/);
        if (match) {
          currentComment.tags = currentComment.tags || [];
          currentComment.tags.push(match[1]);
        }
      }
    }
  }

  return comments;
}

/**
 * Generate markdown documentation from extracted comments
 */
function generateMarkdown(featureDoc: FeatureDoc): string {
  let markdown = `# ${featureDoc.name} - Feature Documentation\n\n`;
  markdown += `> Auto-generated from code comments on ${new Date().toISOString().split('T')[0]}\n\n`;

  if (featureDoc.overview) {
    markdown += `## Overview\n\n${featureDoc.overview}\n\n`;
  }

  // Controllers (API Endpoints)
  if (featureDoc.controllers.length > 0) {
    markdown += `## API Endpoints\n\n`;
    featureDoc.controllers.forEach((doc) => {
      markdown += `### ${doc.name}\n\n`;
      markdown += `${doc.description}\n\n`;

      if (doc.params && doc.params.length > 0) {
        markdown += `**Parameters:**\n\n`;
        markdown += `| Name | Type | Description |\n`;
        markdown += `|------|------|-------------|\n`;
        doc.params.forEach((param) => {
          markdown += `| \`${param.name}\` | \`${param.type}\` | ${param.description} |\n`;
        });
        markdown += `\n`;
      }

      if (doc.returns) {
        markdown += `**Returns:** ${doc.returns}\n\n`;
      }

      if (doc.example) {
        markdown += `**Example:**\n\n\`\`\`typescript\n${doc.example}\`\`\`\n\n`;
      }

      markdown += `*Source: [\`${path.basename(doc.file)}\`](${doc.file}) (Line ${doc.lineNumber})*\n\n`;
      markdown += `---\n\n`;
    });
  }

  // Services (Business Logic)
  if (featureDoc.services.length > 0) {
    markdown += `## Business Logic\n\n`;
    featureDoc.services.forEach((doc) => {
      markdown += `### ${doc.name}\n\n`;
      markdown += `${doc.description}\n\n`;

      if (doc.params && doc.params.length > 0) {
        markdown += `**Parameters:**\n\n`;
        doc.params.forEach((param) => {
          markdown += `- \`${param.name}\` (\`${param.type}\`): ${param.description}\n`;
        });
        markdown += `\n`;
      }

      if (doc.returns) {
        markdown += `**Returns:** ${doc.returns}\n\n`;
      }

      markdown += `*Source: [\`${path.basename(doc.file)}\`](${doc.file}) (Line ${doc.lineNumber})*\n\n`;
    });
  }

  // Schemas (Data Models)
  if (featureDoc.schemas.length > 0) {
    markdown += `## Data Models\n\n`;
    featureDoc.schemas.forEach((doc) => {
      markdown += `### ${doc.name}\n\n`;
      markdown += `${doc.description}\n\n`;
      markdown += `*Source: [\`${path.basename(doc.file)}\`](${doc.file}) (Line ${doc.lineNumber})*\n\n`;
    });
  }

  return markdown;
}

/**
 * Main execution
 */
async function main() {
  const featureName = process.argv[2];

  if (!featureName) {
    console.error(
      'Usage: npx ts-node scripts/generate-feature-docs.ts [feature-name]',
    );
    console.error(
      'Example: npx ts-node scripts/generate-feature-docs.ts departments',
    );
    process.exit(1);
  }

  console.log(`🔍 Scanning for ${featureName} feature files...`);

  // Find feature files
  const featurePaths = [
    `apps/api/src/layers/platform/${featureName}/**/*.ts`,
    `apps/api/src/layers/domains/**/${featureName}/**/*.ts`,
    `apps/api/src/modules/${featureName}/**/*.ts`,
  ];

  const allFiles: string[] = [];
  for (const pattern of featurePaths) {
    const files = await glob(pattern, {
      ignore: ['**/*.spec.ts', '**/*.test.ts', '**/node_modules/**'],
    });
    allFiles.push(...files);
  }

  if (allFiles.length === 0) {
    console.error(`❌ No files found for feature: ${featureName}`);
    process.exit(1);
  }

  console.log(`📄 Found ${allFiles.length} files`);

  // Extract documentation from all files
  const featureDoc: FeatureDoc = {
    name: featureName.charAt(0).toUpperCase() + featureName.slice(1),
    overview: '',
    controllers: [],
    services: [],
    schemas: [],
    repositories: [],
  };

  for (const file of allFiles) {
    const comments = extractDocComments(file);

    comments.forEach((comment) => {
      switch (comment.type) {
        case 'controller':
          featureDoc.controllers.push(comment);
          break;
        case 'service':
          featureDoc.services.push(comment);
          break;
        case 'schema':
          featureDoc.schemas.push(comment);
          break;
        case 'repository':
          featureDoc.repositories.push(comment);
          break;
      }
    });
  }

  console.log(`📝 Extracted:`);
  console.log(`   - ${featureDoc.controllers.length} controllers`);
  console.log(`   - ${featureDoc.services.length} services`);
  console.log(`   - ${featureDoc.schemas.length} schemas`);
  console.log(`   - ${featureDoc.repositories.length} repositories`);

  // Generate markdown
  const markdown = generateMarkdown(featureDoc);

  // Create output directory
  const outputDir = path.join(process.cwd(), 'docs', 'features', featureName);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write documentation
  const outputPath = path.join(outputDir, 'CODE_REFERENCE.md');
  fs.writeFileSync(outputPath, markdown);

  console.log(`✅ Documentation generated: ${outputPath}`);
}

main().catch(console.error);
