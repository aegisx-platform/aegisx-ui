---
title: 'Documentation Automation'
description: 'Automated documentation generation from code comments, git commits, and API versions'
category: guides
tags: [documentation, automation, tools]
---

# Documentation Automation

> Automatically generate and maintain project documentation from code comments, git commits, and API versioning.

## Overview

This guide covers three automated documentation tools:

1. **Feature Documentation Generator** - Auto-generate feature docs from JSDoc comments
2. **Changelog Generator** - Auto-update CHANGELOG.md from conventional commits
3. **API Version Documentation** - Generate versioned API docs and migration guides

---

## 1. Feature Documentation Generator

### What It Does

Extracts JSDoc comments from TypeScript files and generates comprehensive feature documentation including:

- API endpoints (controllers)
- Business logic (services)
- Data models (schemas)
- Database access (repositories)

### Usage

```bash
# Generate docs for a specific feature
pnpm run docs:generate:feature departments

# Or use directly
npx ts-node scripts/generate-feature-docs.ts departments
```

### Example Input (Code Comments)

```typescript
// apps/api/src/layers/platform/departments/departments.controller.ts

/**
 * Get all departments with pagination and filtering
 *
 * Retrieves a paginated list of departments with optional search and filtering.
 * Supports sorting and field selection.
 *
 * @param {Object} request - Fastify request object
 * @param {Object} request.query - Query parameters
 * @param {number} request.query.page - Page number (default: 1)
 * @param {number} request.query.limit - Items per page (default: 20)
 * @param {string} request.query.search - Search term for dept_name
 * @param {boolean} request.query.is_active - Filter by active status
 * @returns {Promise<PaginatedResponse<Department>>} Paginated department list
 *
 * @example
 * // GET /api/departments?page=1&limit=20&search=IT
 * {
 *   "success": true,
 *   "data": [...],
 *   "pagination": { "page": 1, "total": 50 }
 * }
 */
export async function listDepartments(request, reply) {
  // Implementation...
}
```

### Example Output (Generated Markdown)

The tool generates `docs/features/departments/CODE_REFERENCE.md`:

````markdown
# Departments - Feature Documentation

> Auto-generated from code comments on 2025-01-17

## API Endpoints

### listDepartments

Get all departments with pagination and filtering. Retrieves a paginated list of departments with optional search and filtering. Supports sorting and field selection.

**Parameters:**

| Name                      | Type      | Description                  |
| ------------------------- | --------- | ---------------------------- |
| `request.query.page`      | `number`  | Page number (default: 1)     |
| `request.query.limit`     | `number`  | Items per page (default: 20) |
| `request.query.search`    | `string`  | Search term for dept_name    |
| `request.query.is_active` | `boolean` | Filter by active status      |

**Returns:** Promise<PaginatedResponse<Department>> Paginated department list

**Example:**

```typescript
// GET /api/departments?page=1&limit=20&search=IT
{
  "success": true,
  "data": [...],
  "pagination": { "page": 1, "total": 50 }
}
```

_Source: [`departments.controller.ts`](apps/api/src/layers/platform/departments/departments.controller.ts) (Line 45)_

---
````

### Best Practices

#### JSDoc Comment Format

Use this format for all public methods:

```typescript
/**
 * Brief one-line description
 *
 * Detailed description with multiple lines explaining what this does,
 * why it exists, and any important usage notes.
 *
 * @param {Type} paramName - Parameter description
 * @param {Type} anotherParam - Another parameter description
 * @returns {ReturnType} Description of return value
 *
 * @example
 * // Usage example
 * const result = await myFunction('test');
 *
 * @see {@link RelatedFunction} for related functionality
 * @throws {ErrorType} When error occurs
 */
```

#### What to Document

**✅ DO Document:**

- All public API endpoints (controllers)
- Core business logic methods (services)
- Complex algorithms or calculations
- Public interfaces and types
- Integration points with external systems

**❌ DON'T Document:**

- Private helper functions (unless complex)
- Self-explanatory getters/setters
- Test files
- Generated code

### Generated File Structure

```
docs/features/[feature-name]/
├── CODE_REFERENCE.md    # ✅ Auto-generated (don't edit manually)
├── OVERVIEW.md          # ✏️ Manual (feature description)
├── REQUIREMENTS.md      # ✏️ Manual (requirements)
├── DESIGN.md           # ✏️ Manual (technical design)
└── API_CONTRACTS.md    # ✏️ Manual (API contracts)
```

---

## 2. Changelog Generator

### What It Does

Automatically generates and updates `CHANGELOG.md` from git commit messages using [Conventional Commits](https://www.conventionalcommits.org/) format.

### Usage

```bash
# Generate changelog from latest tag to HEAD
pnpm run docs:generate:changelog

# Generate for specific version
pnpm run docs:generate:changelog --version 1.2.0

# Generate from specific ref to HEAD
pnpm run docs:generate:changelog --from v1.0.0 --to HEAD
```

### Conventional Commit Format

```bash
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat`: New feature (✨)
- `fix`: Bug fix (🐛)
- `docs`: Documentation changes (📚)
- `refactor`: Code refactoring (♻️)
- `perf`: Performance improvement (⚡)
- `test`: Test updates (✅)
- `chore`: Maintenance tasks (🔧)

**Examples:**

```bash
# Feature with scope
feat(departments): add bulk import functionality

# Bug fix with detailed description
fix(auth): prevent session expiration during active use

Fixed an issue where user sessions would expire even when
actively using the application. Now updates session expiry
on each API call.

Closes #123

# Breaking change
feat(api): migrate to v2 authentication

BREAKING CHANGE: JWT token format has changed. All clients
must update their authentication flow.

# Multiple types
feat(users): add profile picture upload
test(users): add profile picture tests
docs(users): update profile API documentation
```

### Example Output

```markdown
## [1.2.0] - 2025-01-17

### ✨ Features

- **departments**: add bulk import functionality ([`a1b2c3d`](https://github.com/owner/repo/commit/a1b2c3d))
- **users**: add profile picture upload ([`e4f5g6h`](https://github.com/owner/repo/commit/e4f5g6h))

### 🐛 Bug Fixes

- **auth**: prevent session expiration during active use ([#123](https://github.com/owner/repo/pull/123)) ([`i7j8k9l`](https://github.com/owner/repo/commit/i7j8k9l))

### 📚 Documentation

- **users**: update profile API documentation ([`m1n2o3p`](https://github.com/owner/repo/commit/m1n2o3p))
```

### Integration with Git Workflow

#### Pre-commit Hook (Recommended)

Create `.husky/commit-msg`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Validate conventional commit format
npx --no -- commitlint --edit $1
```

#### Post-release Script

```bash
# After creating a new release/tag
git tag v1.2.0
pnpm run docs:generate:changelog --version 1.2.0
git add CHANGELOG.md
git commit -m "docs: update CHANGELOG for v1.2.0"
git push origin main --tags
```

---

## 3. API Version Documentation

### What It Does

- Extracts API endpoints from route files
- Generates versioned API documentation
- Compares API versions to identify changes
- Creates migration guides between versions

### Usage

```bash
# Generate docs for current API
pnpm run docs:generate:api

# Generate docs for specific version
pnpm run docs:generate:api --version v2

# Compare two versions and generate migration guide
pnpm run docs:generate:api:compare v1 v2
```

### Example: Generate API Docs

```bash
$ pnpm run docs:generate:api --version v2

📋 Generating API documentation for v2...
📝 Found 157 endpoints
✅ API documentation generated: docs/api/versions/v2.md
✅ Latest API documentation: docs/api/versions/latest.md
```

**Output Structure:**

```markdown
# API v2 Documentation

**Release Date:** 2025-01-17

## Summary

- **Total Endpoints:** 157
- **Modules:** 12

## Endpoints by Module

### departments (8 endpoints)

| Method   | Path                         | Description             |
| -------- | ---------------------------- | ----------------------- |
| `GET`    | `/api/departments`           | List all departments    |
| `GET`    | `/api/departments/:id`       | Get department by ID    |
| `POST`   | `/api/departments`           | Create new department   |
| `PUT`    | `/api/departments/:id`       | Update department       |
| `DELETE` | `/api/departments/:id`       | Delete department       |
| `GET`    | `/api/departments/dropdown`  | Get dropdown list       |
| `GET`    | `/api/departments/hierarchy` | Get hierarchy tree      |
| `POST`   | `/api/departments/bulk`      | Bulk import departments |

...
```

### Example: Compare Versions

```bash
$ pnpm run docs:generate:api:compare v1 v2

📊 Comparing API v1 → v2...

📝 Changes:
   Added: 12
   Removed: 3
   Modified: 5
   Deprecated: 2

✅ Migration guide generated: docs/api/migration-v1-to-v2.md
```

**Migration Guide Output:**

```markdown
# API Migration Guide: v1 → v2

**Date:** 2025-01-17

## Overview

This guide will help you migrate from API v1 to v2.

⚠️ **Action Required:** This version contains breaking changes.

### Summary of Changes

- New endpoints: 12
- Modified endpoints: 5
- Deprecated endpoints: 2
- Removed endpoints: 3

## 🚨 Breaking Changes

### Removed Endpoints

#### `GET /api/users/legacy`

**Migration:** Use `GET /api/users` instead.

### Deprecated Endpoints

The following endpoints are deprecated and will be removed in the next major version:

- `GET /api/departments/old-format` - Use `/api/departments` instead
- `POST /api/auth/login-v1` - Use `/api/auth/login` instead

## ✨ New Features

### departments

- `POST /api/departments/bulk` - Bulk import departments
- `GET /api/departments/hierarchy` - Get hierarchy tree

...
```

### API Versioning Strategy

#### 1. URL Path Versioning (Recommended)

```typescript
// apps/api/src/api-versions/v1/departments.routes.ts
export const registerV1Routes = (app: FastifyInstance) => {
  app.register(departmentsRoutes, { prefix: '/v1/departments' });
};

// apps/api/src/api-versions/v2/departments.routes.ts
export const registerV2Routes = (app: FastifyInstance) => {
  app.register(departmentsRoutesV2, { prefix: '/v2/departments' });
};
```

#### 2. Header-Based Versioning

```typescript
// Middleware to check API version header
app.addHook('onRequest', async (request, reply) => {
  const apiVersion = request.headers['api-version'] || 'v1';
  request.apiVersion = apiVersion;
});
```

#### 3. Deprecation Warnings

```typescript
// Add deprecation warning to old endpoints
app.get('/api/departments/old-format', {
  schema: {
    deprecated: true,
    description: 'DEPRECATED: Use /api/departments instead',
  },
  handler: async (request, reply) => {
    reply.header('Deprecation', 'true');
    reply.header('Sunset', '2025-06-01');
    reply.header('Link', '</api/departments>; rel="successor-version"');
    // ... implementation
  },
});
```

---

## Workflow Integration

### 1. Feature Development Workflow

```bash
# Step 1: Develop feature with JSDoc comments
# (Write code with proper JSDoc comments)

# Step 2: Commit with conventional commits
git add .
git commit -m "feat(departments): add bulk import functionality

Implemented bulk CSV/Excel import for departments with
validation and error handling."

# Step 3: Generate feature documentation
pnpm run docs:generate:feature departments

# Step 4: Review generated docs
cat docs/features/departments/CODE_REFERENCE.md

# Step 5: Commit generated docs
git add docs/features/departments/CODE_REFERENCE.md
git commit -m "docs(departments): update auto-generated feature docs"
```

### 2. Release Workflow

```bash
# Step 1: Update version in package.json
npm version minor  # 1.1.0 -> 1.2.0

# Step 2: Generate changelog
pnpm run docs:generate:changelog --version 1.2.0

# Step 3: Generate API version docs
pnpm run docs:generate:api --version v1.2

# Step 4: Review changes
cat CHANGELOG.md
cat docs/api/versions/v1.2.md

# Step 5: Commit and tag
git add CHANGELOG.md docs/api/versions/v1.2.md package.json
git commit -m "chore(release): v1.2.0"
git tag v1.2.0
git push origin main --tags
```

### 3. API Version Update Workflow

```bash
# Step 1: Create new API version
mkdir -p apps/api/src/api-versions/v2

# Step 2: Implement v2 routes
# (Write new route implementations)

# Step 3: Generate API docs for v2
pnpm run docs:generate:api --version v2

# Step 4: Compare with v1 and generate migration guide
pnpm run docs:generate:api:compare v1 v2

# Step 5: Review migration guide
cat docs/api/migration-v1-to-v2.md

# Step 6: Commit changes
git add apps/api/src/api-versions/v2/ docs/api/
git commit -m "feat(api): add v2 API with enhanced features

BREAKING CHANGE: Authentication endpoint format has changed.
See migration guide for details."
```

---

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/docs-automation.yml`:

```yaml
name: Documentation Automation

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  update-docs:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0 # Fetch all history for changelog

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '22'

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 10

      - name: Install dependencies
        run: pnpm install

      - name: Generate Changelog
        run: pnpm run docs:generate:changelog

      - name: Generate API Docs
        run: pnpm run docs:generate:api

      - name: Commit Updated Docs
        run: |
          git config --local user.email "github-actions[bot]@users.noreply.github.com"
          git config --local user.name "github-actions[bot]"
          git add CHANGELOG.md docs/api/
          git diff-index --quiet HEAD || git commit -m "docs: auto-update documentation [skip ci]"
          git push
```

---

## Best Practices

### 1. JSDoc Comments

- ✅ Write clear, concise descriptions
- ✅ Document all parameters with types
- ✅ Include usage examples for complex functions
- ✅ Link related functions with `@see`
- ✅ Document thrown errors with `@throws`
- ❌ Don't duplicate information (DRY)
- ❌ Don't state the obvious

### 2. Conventional Commits

- ✅ Use semantic types (feat, fix, docs, etc.)
- ✅ Include scope when applicable
- ✅ Write clear, actionable subjects
- ✅ Add body for complex changes
- ✅ Reference issues/PRs in footer
- ❌ Don't use vague messages
- ❌ Don't commit unrelated changes together

### 3. API Versioning

- ✅ Use semantic versioning (semver)
- ✅ Deprecate before removing
- ✅ Provide migration guides
- ✅ Set sunset dates for old versions
- ✅ Test migrations thoroughly
- ❌ Don't break compatibility without notice
- ❌ Don't remove endpoints suddenly

---

## Troubleshooting

### Feature Docs Not Generating

**Problem:** No output from `docs:generate:feature`

**Solutions:**

1. Check file path patterns in script
2. Verify JSDoc comment format
3. Ensure files are not in ignore list
4. Check console for error messages

### Changelog Missing Commits

**Problem:** Some commits not appearing in CHANGELOG

**Solutions:**

1. Verify conventional commit format
2. Check git history: `git log --oneline`
3. Ensure commits are between specified refs
4. Check for merge commits (may need special handling)

### API Docs Incomplete

**Problem:** Missing endpoints in API documentation

**Solutions:**

1. Verify route registration
2. Check schema definitions
3. Ensure proper TypeBox usage
4. Look for syntax errors in route files

---

## Summary

| Tool                   | Purpose                      | Command                               | Output                                   |
| ---------------------- | ---------------------------- | ------------------------------------- | ---------------------------------------- |
| Feature Docs Generator | Auto-doc from JSDoc comments | `docs:generate:feature [name]`        | `docs/features/[name]/CODE_REFERENCE.md` |
| Changelog Generator    | Auto-update from git commits | `docs:generate:changelog`             | `CHANGELOG.md`                           |
| API Version Docs       | Generate versioned API docs  | `docs:generate:api --version [v]`     | `docs/api/versions/[v].md`               |
| API Migration Guide    | Compare API versions         | `docs:generate:api:compare [v1] [v2]` | `docs/api/migration-[v1]-to-[v2].md`     |

---

## Next Steps

1. **Setup**: Install dependencies and test scripts
2. **Adopt**: Start using conventional commits
3. **Document**: Add JSDoc comments to existing code
4. **Automate**: Integrate with CI/CD pipeline
5. **Maintain**: Regularly update and review generated docs

For more information, see:

- [Feature Development Standard](./feature-development-standard.md)
- [API Calling Standard](./api-calling-standard.md)
- [Git Flow Guide](../infrastructure/version-management/git-flow-release-guide.md)
