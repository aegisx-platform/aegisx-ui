#!/usr/bin/env ts-node

/**
 * Convert Books Component to Handlebars Template V2
 *
 * This script converts the books list component (our reference implementation)
 * into reusable Handlebars templates for CRUD generation.
 *
 * Features included:
 * - Sticky header
 * - Expandable rows with animations
 * - Row click to view
 * - Two-layer signal pattern (INPUT/ACTIVE)
 * - Date range filters
 * - Event propagation management
 * - Tailwind-first styling
 */

import * as fs from 'fs';
import * as path from 'path';

interface ConversionRule {
  pattern: RegExp;
  replacement: string;
  description: string;
}

class TemplateConverter {
  private sourceDir = path.join(
    process.cwd(),
    'apps/web/src/app/features/books/components',
  );
  private targetDir = path.join(
    process.cwd(),
    'tools/crud-generator/frontend-templates-v2',
  );

  // Conversion rules for TypeScript component
  private tsRules: ConversionRule[] = [
    // Import statements
    {
      pattern: /from '\.\.\/services\/books\.service'/g,
      replacement: "from '../services/{{lowercase moduleName}}.service'",
      description: 'Service import path',
    },
    {
      pattern: /from '\.\.\/types\/books\.types'/g,
      replacement: "from '../types/{{lowercase moduleName}}.types'",
      description: 'Types import path',
    },
    {
      pattern: /from '\.\/books-create\.dialog'/g,
      replacement: "from './{{lowercase moduleName}}-create.dialog'",
      description: 'Create dialog import',
    },
    {
      pattern: /from '\.\/books-edit\.dialog'/g,
      replacement: "from './{{lowercase moduleName}}-edit.dialog'",
      description: 'Edit dialog import',
    },
    {
      pattern: /from '\.\/books-view\.dialog'/g,
      replacement: "from './{{lowercase moduleName}}-view.dialog'",
      description: 'View dialog import',
    },
    {
      pattern: /from '\.\/books-list-filters\.component'/g,
      replacement: "from './{{lowercase moduleName}}-list-filters.component'",
      description: 'Filters component import',
    },
    {
      pattern: /from '\.\/books-list-header\.component'/g,
      replacement: "from './{{lowercase moduleName}}-list-header.component'",
      description: 'Header component import',
    },

    // Class and type names
    {
      pattern: /BookService/g,
      replacement: '{{pascalCase singularName}}Service',
      description: 'Service class name',
    },
    {
      pattern: /Book(?!s)/g,
      replacement: '{{pascalCase singularName}}',
      description: 'Entity type name',
    },
    {
      pattern: /ListBookQuery/g,
      replacement: 'List{{pascalCase singularName}}Query',
      description: 'Query type name',
    },
    {
      pattern: /BookCreateDialogComponent/g,
      replacement: '{{pascalCase singularName}}CreateDialogComponent',
      description: 'Create dialog component',
    },
    {
      pattern: /BookEditDialogComponent/g,
      replacement: '{{pascalCase singularName}}EditDialogComponent',
      description: 'Edit dialog component',
    },
    {
      pattern: /BookViewDialogComponent/g,
      replacement: '{{pascalCase singularName}}ViewDialogComponent',
      description: 'View dialog component',
    },
    {
      pattern: /BookEditDialogData/g,
      replacement: '{{pascalCase singularName}}EditDialogData',
      description: 'Edit dialog data type',
    },
    {
      pattern: /BookViewDialogData/g,
      replacement: '{{pascalCase singularName}}ViewDialogData',
      description: 'View dialog data type',
    },
    {
      pattern: /BooksListFiltersComponent/g,
      replacement: '{{pascalCase moduleName}}ListFiltersComponent',
      description: 'Filters component name',
    },
    {
      pattern: /BooksListHeaderComponent/g,
      replacement: '{{pascalCase moduleName}}ListHeaderComponent',
      description: 'Header component name',
    },
    {
      pattern: /BooksListComponent/g,
      replacement: '{{pascalCase moduleName}}ListComponent',
      description: 'List component name',
    },

    // Service method names
    {
      pattern: /booksService/g,
      replacement: '{{camelCase moduleName}}Service',
      description: 'Service instance name',
    },
    {
      pattern: /\.loading\(\)/g,
      replacement: '.loading()',
      description: 'Loading method (keep as is)',
    },
    {
      pattern: /\.error\(\)/g,
      replacement: '.error()',
      description: 'Error method (keep as is)',
    },
    {
      pattern: /\.loadBookList/g,
      replacement: '.load{{pascalCase singularName}}List',
      description: 'Load list method',
    },
    {
      pattern: /\.booksList/g,
      replacement: '.{{camelCase moduleName}}List',
      description: 'List getter',
    },
    {
      pattern: /\.totalBook/g,
      replacement: '.total{{pascalCase singularName}}',
      description: 'Total count getter',
    },
    {
      pattern: /\.availableCount/g,
      replacement: '.availableCount',
      description: 'Available count (keep if exists)',
    },
    {
      pattern: /\.unavailableCount/g,
      replacement: '.unavailableCount',
      description: 'Unavailable count (keep if exists)',
    },
    {
      pattern: /\.thisWeekCount/g,
      replacement: '.thisWeekCount',
      description: 'This week count (keep if exists)',
    },
    {
      pattern: /\.exportBook/g,
      replacement: '.export{{pascalCase singularName}}',
      description: 'Export method',
    },
    {
      pattern: /\.deleteBook/g,
      replacement: '.delete{{pascalCase singularName}}',
      description: 'Delete method',
    },
    {
      pattern: /\.permissionError/g,
      replacement: '.permissionError',
      description: 'Permission error getter',
    },
    {
      pattern: /\.clearPermissionError/g,
      replacement: '.clearPermissionError',
      description: 'Clear permission error method',
    },
    {
      pattern: /\.lastErrorStatus/g,
      replacement: '.lastErrorStatus',
      description: 'Last error status getter',
    },

    // Selector and template URLs
    {
      pattern: /selector: 'app-books-list'/g,
      replacement: "selector: 'app-{{lowercase moduleName}}-list'",
      description: 'Component selector',
    },
    {
      pattern: /templateUrl: '\.\/books-list\.component\.html'/g,
      replacement:
        "templateUrl: './{{lowercase moduleName}}-list.component.html'",
      description: 'Template URL',
    },
    {
      pattern: /styleUrl: '\.\/books-list\.component\.scss'/g,
      replacement: "styleUrl: './{{lowercase moduleName}}-list.component.scss'",
      description: 'Style URL',
    },

    // Variable names and signals
    {
      pattern: /expandedBook/g,
      replacement: 'expanded{{pascalCase singularName}}',
      description: 'Expanded row signal',
    },

    // String literals for user messages
    {
      pattern: /'Book deleted successfully'/g,
      replacement: "'{{pascalCase singularName}} deleted successfully'",
      description: 'Delete success message',
    },
    {
      pattern: /'Failed to delete book'/g,
      replacement: "'Failed to delete {{lowercase singularName}}'",
      description: 'Delete error message',
    },
    {
      pattern: /'Loading books\.\.\.'/g,
      replacement: "'Loading {{lowercase moduleName}}...'",
      description: 'Loading message',
    },
    {
      pattern: /'Refreshing\.\.\.'/g,
      replacement: "'Refreshing...'",
      description: 'Refreshing message',
    },
    {
      pattern: /'No books found'/g,
      replacement: "'No {{lowercase moduleName}} found'",
      description: 'Empty state title',
    },
    {
      pattern: /'Add your first book'/g,
      replacement: "'Add your first {{lowercase singularName}}'",
      description: 'Empty state action',
    },

    // Breadcrumb
    {
      pattern: /id: 'books'/g,
      replacement: "id: '{{lowercase moduleName}}'",
      description: 'Breadcrumb ID',
    },
    {
      pattern: /title: 'Books'/g,
      replacement: "title: '{{pascalCase moduleName}}'",
      description: 'Breadcrumb title',
    },

    // Module name in export
    {
      pattern: /moduleName]="'books'"/g,
      replacement: 'moduleName]="\'{{lowercase moduleName}}\'"',
      description: 'Export module name',
    },

    // Data property names in dialog data
    {
      pattern: /{ books: book }/g,
      replacement: '{ {{camelCase moduleName}}: {{camelCase singularName}} }',
      description: 'Dialog data property',
    },

    // Bulk delete message
    {
      pattern: /'books'/g,
      replacement: "'{{lowercase moduleName}}'",
      description: 'Bulk delete entity name',
    },
    {
      pattern: /book\(s\) deleted/g,
      replacement: '{{lowercase singularName}}(s) deleted',
      description: 'Bulk delete message',
    },
    {
      pattern: /delete some books/g,
      replacement: 'delete some {{lowercase moduleName}}',
      description: 'Bulk delete error',
    },

    // Method parameter names
    {
      pattern: /\(book: Book\)/g,
      replacement: '({{camelCase singularName}}: {{pascalCase singularName}})',
      description: 'Method parameter',
    },
    {
      pattern: /onViewBook\(/g,
      replacement: 'onView{{pascalCase singularName}}(',
      description: 'View method name',
    },
    {
      pattern: /onEditBook\(/g,
      replacement: 'onEdit{{pascalCase singularName}}(',
      description: 'Edit method name',
    },
    {
      pattern: /onDeleteBook\(/g,
      replacement: 'onDelete{{pascalCase singularName}}(',
      description: 'Delete method name',
    },

    // Confirm delete parameter
    {
      pattern: /confirmDelete\(book\.title\)/g,
      replacement: 'confirmDelete({{camelCase singularName}}.{{titleField}})',
      description: 'Confirm delete title field',
    },
  ];

  // Conversion rules for HTML template
  private htmlRules: ConversionRule[] = [
    // Component selectors
    {
      pattern: /<app-books-list-header/g,
      replacement: '<app-{{lowercase moduleName}}-list-header',
      description: 'Header component tag',
    },
    {
      pattern: /<\/app-books-list-header>/g,
      replacement: '</app-{{lowercase moduleName}}-list-header>',
      description: 'Header component closing tag',
    },
    {
      pattern: /<app-books-list-filters/g,
      replacement: '<app-{{lowercase moduleName}}-list-filters',
      description: 'Filters component tag',
    },
    {
      pattern: /<\/app-books-list-filters>/g,
      replacement: '</app-{{lowercase moduleName}}-list-filters>',
      description: 'Filters component closing tag',
    },

    // Service references
    {
      pattern: /booksService/g,
      replacement: '{{camelCase moduleName}}Service',
      description: 'Service instance name',
    },

    // Variable names
    {
      pattern: /let book/g,
      replacement: 'let {{camelCase singularName}}',
      description: 'Loop variable name',
    },
    {
      pattern: /book\./g,
      replacement: '{{camelCase singularName}}.',
      description: 'Object property access',
    },
    {
      pattern: /expandedBook/g,
      replacement: 'expanded{{pascalCase singularName}}',
      description: 'Expanded signal name',
    },

    // Method calls
    {
      pattern: /toggleExpandRow\(book\)/g,
      replacement: 'toggleExpandRow({{camelCase singularName}})',
      description: 'Toggle expand method call',
    },
    {
      pattern: /isRowExpanded\(book\)/g,
      replacement: 'isRowExpanded({{camelCase singularName}})',
      description: 'Is expanded check',
    },
    {
      pattern: /onViewBook\(book\)/g,
      replacement:
        'onView{{pascalCase singularName}}({{camelCase singularName}})',
      description: 'View method call',
    },
    {
      pattern: /onEditBook\(book\)/g,
      replacement:
        'onEdit{{pascalCase singularName}}({{camelCase singularName}})',
      description: 'Edit method call',
    },
    {
      pattern: /onDeleteBook\(book\)/g,
      replacement:
        'onDelete{{pascalCase singularName}}({{camelCase singularName}})',
      description: 'Delete method call',
    },

    // String messages
    {
      pattern: /Loading books\.\.\./g,
      replacement: 'Loading {{lowercase moduleName}}...',
      description: 'Loading message',
    },
    {
      pattern: /No books found/g,
      replacement: 'No {{lowercase moduleName}} found',
      description: 'Empty message',
    },
    {
      pattern: /Add your first book/g,
      replacement: 'Add your first {{lowercase singularName}}',
      description: 'Empty action',
    },
    {
      pattern: /Select all books/g,
      replacement: 'Select all {{lowercase moduleName}}',
      description: 'Select all label',
    },

    // Module name
    {
      pattern: /moduleName]="'books'"/g,
      replacement: 'moduleName]="\'{{lowercase moduleName}}\'"',
      description: 'Module name attribute',
    },

    // Data attribute
    {
      pattern: /data-book-id/g,
      replacement: 'data-{{lowercase singularName}}-id',
      description: 'Data attribute name',
    },
  ];

  // Conversion rules for SCSS
  private scssRules: ConversionRule[] = [
    // No specific SCSS rules needed - styles are generic
  ];

  async convert(): Promise<void> {
    console.log('🚀 Starting Books to Template V2 Conversion...\n');

    // Ensure target directory exists
    if (!fs.existsSync(this.targetDir)) {
      fs.mkdirSync(this.targetDir, { recursive: true });
    }

    // Convert TypeScript component
    await this.convertFile(
      path.join(this.sourceDir, 'books-list.component.ts'),
      path.join(this.targetDir, 'list-component-v2.hbs'),
      this.tsRules,
    );

    // Convert HTML template
    await this.convertFile(
      path.join(this.sourceDir, 'books-list.component.html'),
      path.join(this.targetDir, 'list-component.html-v2.hbs'),
      this.htmlRules,
    );

    // Convert SCSS styles
    await this.convertFile(
      path.join(this.sourceDir, 'books-list.component.scss'),
      path.join(this.targetDir, 'list-component.scss-v2.hbs'),
      this.scssRules,
    );

    console.log('\n✅ Conversion completed successfully!');
    console.log(`📁 Templates saved to: ${this.targetDir}`);
  }

  private async convertFile(
    sourcePath: string,
    targetPath: string,
    rules: ConversionRule[],
  ): Promise<void> {
    console.log(`📝 Converting: ${path.basename(sourcePath)}`);

    // Read source file
    let content = fs.readFileSync(sourcePath, 'utf-8');

    // Apply conversion rules
    let rulesApplied = 0;
    for (const rule of rules) {
      const matches = content.match(rule.pattern);
      if (matches) {
        content = content.replace(rule.pattern, rule.replacement);
        rulesApplied++;
        console.log(
          `   ✓ ${rule.description} (${matches.length} occurrence${matches.length > 1 ? 's' : ''})`,
        );
      }
    }

    // Write to target file
    fs.writeFileSync(targetPath, content, 'utf-8');
    console.log(
      `   ✅ Saved: ${path.basename(targetPath)} (${rulesApplied} rules applied)\n`,
    );
  }
}

// Run conversion
const converter = new TemplateConverter();
converter.convert().catch(console.error);
