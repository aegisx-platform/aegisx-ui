# CRUD Generator Template Versioning System

## Overview

The CRUD generator supports two template versions:

- **V1 Templates** (`frontend-templates/`): Legacy inline templates
- **V2 Templates** (`frontend-templates-v2/`): Modern multi-file templates with enhanced features

## Quick Start

```bash
# Generate with V2 templates (default)
node tools/crud-generator/generate-frontend-direct.js authors

# Generate with V1 templates (legacy)
node tools/crud-generator/generate-frontend-direct.js authors v1

# Explicitly use V2 templates
node tools/crud-generator/generate-frontend-direct.js authors v2
```

## Template Versions Comparison

### V1 Templates (Legacy)

**File Structure:**

```
frontend-templates/
├── list-component.hbs         # Single file with inline HTML/CSS
├── create-dialog.hbs
├── edit-dialog.hbs
├── view-dialog.hbs
├── shared-form.hbs
├── service.hbs
├── routes.hbs
└── types.hbs
```

**Output:**

```
authors/
└── components/
    └── authors-list.component.ts    # Single file with inline template & styles
```

**Features:**

- ✅ Basic list, create, edit, view functionality
- ✅ Inline HTML templates in TypeScript
- ✅ Inline CSS styles
- ✅ Simple table layout
- ❌ No expandable rows
- ❌ No sticky headers
- ❌ No row click handlers

### V2 Templates (Modern)

**File Structure:**

```
frontend-templates-v2/
├── list-component-v2.hbs              # TypeScript logic
├── list-component.html-v2.hbs         # Separate HTML template
├── list-component.scss-v2.hbs         # Separate styles
├── create-dialog.hbs                  # Same as V1
├── edit-dialog.hbs                    # Same as V1
├── view-dialog.hbs                    # Same as V1
├── shared-form.hbs                    # Same as V1
├── service.hbs                        # Same as V1
├── routes.hbs                         # Same as V1
└── types.hbs                          # Same as V1
```

**Output:**

```
authors/
└── components/
    ├── authors-list.component.ts      # Component logic
    ├── authors-list.component.html    # Separate HTML template
    └── authors-list.component.scss    # Separate styles
```

**Features:**

- ✅ All V1 features
- ✅ Separate HTML/SCSS files (better maintainability)
- ✅ Sticky table headers
- ✅ Expandable row details
- ✅ Row click to view
- ✅ Enhanced animations
- ✅ Better responsive design

## Technical Implementation

### Handlebars vs String Replacement

**V1 Templates** use Handlebars compilation for all files:

```javascript
const template = Handlebars.compile(templateContent);
const code = template(context);
```

**V2 Templates** use mixed approach:

- **TypeScript (.ts)**: Handlebars compilation
- **HTML (.html)**: String replacement (avoids Angular `{{ }}` conflicts)
- **SCSS (.scss)**: Handlebars compilation

### HTML String Replacement Patterns

```javascript
// V2 HTML template uses string replacement to avoid Handlebars/Angular conflicts
htmlContent = htmlContent.replace(/\{\{pascalCase moduleName\}\}/g, 'Authors');
htmlContent = htmlContent.replace(/\{\{pascalCase singularName\}\}/g, 'Author');
htmlContent = htmlContent.replace(/\{\{camelCase moduleName\}\}/g, 'authors');
htmlContent = htmlContent.replace(/\{\{camelCase singularName\}\}/g, 'author');
htmlContent = htmlContent.replace(/\{\{lowercase moduleName\}\}/g, 'authors');
htmlContent = htmlContent.replace(/\{\{lowercase singularName\}\}/g, 'author');
```

**Why String Replacement?**

V2 HTML templates contain both:

- **Handlebars variables**: `{{lowercase moduleName}}`
- **Angular expressions**: `{{ searchTermSignal() }}`

Handlebars parser cannot distinguish between the two, causing parse errors. String replacement solves this by replacing only the known Handlebars variables before the file is written.

## Creating New Templates

### Creating V1 Template

1. Create file in `frontend-templates/`
2. Use Handlebars syntax: `{{variable}}`
3. Template will be compiled with Handlebars

### Creating V2 Template

1. Create file in `frontend-templates-v2/`
2. For TypeScript/SCSS: Use Handlebars syntax `{{variable}}`
3. For HTML: Use Handlebars syntax for variables that need replacement
   - Module name: `{{lowercase moduleName}}`, `{{camelCase moduleName}}`, `{{pascalCase moduleName}}`
   - Singular name: `{{lowercase singularName}}`, `{{camelCase singularName}}`, `{{pascalCase singularName}}`
4. For Angular expressions: Use normal Angular syntax `{{ angularExpression() }}`

## Migration Guide

### Migrating from V1 to V2

**Step 1: Generate with V2**

```bash
node tools/crud-generator/generate-frontend-direct.js authors v2
```

**Step 2: Compare Files**

```bash
# Backup old V1 component
cp apps/web/src/app/features/authors/components/authors-list.component.ts \
   apps/web/src/app/features/authors/components/authors-list.component.ts.v1-backup

# New V2 files
ls apps/web/src/app/features/authors/components/authors-list.component.*
# authors-list.component.ts
# authors-list.component.html
# authors-list.component.scss
```

**Step 3: Test**

```bash
pnpm run dev:web
# Navigate to /authors and test functionality
```

**Step 4: Update Component Registration**
V2 components use `templateUrl` and `styleUrl`:

```typescript
@Component({
  selector: 'app-authors-list',
  templateUrl: './authors-list.component.html',   // V2: External template
  styleUrl: './authors-list.component.scss',      // V2: External styles
  // ...
})
```

### Rolling Back to V1

```bash
# Regenerate with V1
node tools/crud-generator/generate-frontend-direct.js authors v1

# Or restore backup
cp apps/web/src/app/features/authors/components/authors-list.component.ts.v1-backup \
   apps/web/src/app/features/authors/components/authors-list.component.ts

# Remove V2 files
rm apps/web/src/app/features/authors/components/authors-list.component.html
rm apps/web/src/app/features/authors/components/authors-list.component.scss
```

## Development Workflow

### Creating a New Module

**Option 1: Use Default V2**

```bash
# Generates with V2 templates (default)
node tools/crud-generator/generate-frontend-direct.js products
```

**Option 2: Specify Version**

```bash
# Explicitly use V1
node tools/crud-generator/generate-frontend-direct.js products v1

# Explicitly use V2
node tools/crud-generator/generate-frontend-direct.js products v2
```

### Updating Existing Module

**Regenerate with Same Version**

```bash
# Check current version (V1 has single .ts file, V2 has .ts + .html + .scss)
ls apps/web/src/app/features/authors/components/authors-list.component.*

# Regenerate with same version
node tools/crud-generator/generate-frontend-direct.js authors v2
```

## Template Variables Reference

### Available Variables

| Variable                      | Example Output | Description                        |
| ----------------------------- | -------------- | ---------------------------------- |
| `{{lowercase moduleName}}`    | `authors`      | Lowercase module name (kebab-case) |
| `{{camelCase moduleName}}`    | `authors`      | Camel case module name             |
| `{{pascalCase moduleName}}`   | `Authors`      | Pascal case module name (plural)   |
| `{{lowercase singularName}}`  | `author`       | Lowercase singular name            |
| `{{camelCase singularName}}`  | `author`       | Camel case singular name           |
| `{{pascalCase singularName}}` | `Author`       | Pascal case singular name          |

### Usage in Templates

**V1 (Handlebars Compilation):**

```handlebars
<!-- All files use Handlebars syntax -->
export class
{{pascalCase moduleName}}ListComponent {
{{camelCase moduleName}}Service = inject({{pascalCase singularName}}Service); }
```

**V2 TypeScript (Handlebars Compilation):**

```handlebars
<!-- Same as V1 -->
export class
{{pascalCase moduleName}}ListComponent {
{{camelCase moduleName}}Service = inject({{pascalCase singularName}}Service); }
```

**V2 HTML (String Replacement):**

```html
<!-- Handlebars variables (will be replaced) -->
<app-{{lowercase moduleName}}-list-header></app-{{lowercase moduleName}}-list-header>

<!-- Angular expressions (will NOT be replaced) -->
<span>{{ searchTermSignal() }}</span>
<div>{{ authorsService.loading() }}</div>
```

## Troubleshooting

### Issue: HTML Template Contains Unreplaced Variables

**Symptom:**

```html
<span>Get started by adding your first {{lowercase singularName}}</span>
```

**Cause:** String replacement pattern missing in `frontend-generator.js`

**Solution:** Add missing pattern to replacement list:

```javascript
// File: tools/crud-generator/src/frontend-generator.js
htmlContent = htmlContent.replace(/\{\{lowercase singularName\}\}/g, singularCamelName);
```

### Issue: Angular Expressions Being Replaced

**Symptom:**

```html
<!-- Before -->
<span>{{ searchTermSignal() }}</span>

<!-- After (wrong) -->
<span>authors</span>
```

**Cause:** Overly broad replacement pattern

**Solution:** Use more specific patterns that only match Handlebars template variables:

```javascript
// ❌ Too broad
.replace(/\{\{.*\}\}/g, 'authors')

// ✅ Specific
.replace(/\{\{lowercase moduleName\}\}/g, 'authors')
```

### Issue: Handlebars Parse Error in V2 HTML

**Symptom:**

```
Parse error on line 53:
...{{ searchTermSignal() }
-----------------------^
```

**Cause:** V2 HTML file being compiled with Handlebars instead of string replacement

**Solution:** Ensure generator uses string replacement for V2 HTML:

```javascript
if (isV2) {
  // Use string replacement for HTML (NOT Handlebars.compile)
  let htmlContent = fs.readFileSync(htmlTemplatePath, 'utf8');
  htmlContent = htmlContent.replace(/\{\{lowercase moduleName\}\}/g, kebabName);
  fs.writeFileSync(htmlFile, htmlContent);
}
```

## Best Practices

### When to Use V1

- ✅ Simple CRUD operations
- ✅ Minimal UI requirements
- ✅ Consistency with existing V1 modules
- ✅ Quick prototypes

### When to Use V2

- ✅ New modules (default)
- ✅ Enhanced user experience needed
- ✅ Better maintainability required
- ✅ Future-proof architecture
- ✅ Complex table features (expandable rows, sticky headers)

### Template Naming Conventions

**V1 Templates:**

- `<name>.hbs` (e.g., `list-component.hbs`)

**V2 Templates:**

- TypeScript: `<name>-v2.hbs` (e.g., `list-component-v2.hbs`)
- HTML: `<name>.html-v2.hbs` (e.g., `list-component.html-v2.hbs`)
- SCSS: `<name>.scss-v2.hbs` (e.g., `list-component.scss-v2.hbs`)

## Version History

### V1 (Original)

- Single-file components with inline templates
- Basic CRUD functionality
- Simple table layout

### V2 (Current)

- Multi-file components (separate HTML/SCSS)
- Enhanced table features (sticky headers, expandable rows)
- Row click handlers
- Better animations
- String replacement for HTML to avoid Handlebars/Angular conflicts

## Future Enhancements

Planned features for future versions:

- **V3**: Standalone component architecture
- **Virtual scrolling** for large datasets
- **Advanced filtering** components
- **Drag-and-drop** row reordering
- **Column customization** (show/hide, reorder)
- **Export templates** for dialogs and forms

## References

- [Handlebars Documentation](https://handlebarsjs.com/)
- [Angular Signals Guide](https://angular.dev/guide/signals)
- [Angular Material Table](https://material.angular.io/components/table/overview)
- [books-list.component.ts](/apps/web/src/app/features/books/components/books-list.component.ts) - V2 reference implementation
