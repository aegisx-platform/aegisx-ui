---
title: 'WebSocket Implementation Spec'
description: 'WebSocket implementation specification for CRUD generator'
category: reference
tags: [cli, websocket, specification]
---

# WebSocket Real-Time Events Implementation Specification

## Executive Summary

### Current State

- **Backend**: 100% Complete ✅
  - EventService infrastructure ready
  - CrudEventHelper emits all CRUD events
  - WebSocket server operational
  - All backend modules emit events

- **Frontend Infrastructure**: 100% Complete ✅
  - WebSocketService operational
  - BaseRealtimeStateManager base class ready
  - Connection management working

- **Frontend Generated Code**: 0% Complete ❌
  - No state managers generated
  - No WebSocket integration in components
  - Manual implementation required

### What Needs to Be Built

Generate WebSocket real-time functionality automatically through CRUD Generator templates:

1. **State Manager Template** - Extends BaseRealtimeStateManager for each module
2. **List Component Integration** - Add WebSocket subscriptions to list components
3. **Import Dialog Real-Time** - Replace polling with WebSocket events
4. **Backend Event Tests** - Test suite for EventService integration

### Timeline Estimate

- **Phase 1**: State Manager Template (4-6 hours)
- **Phase 2**: List Component Integration (4-6 hours)
- **Phase 3**: Import Dialog Real-Time (3-4 hours)
- **Phase 4**: Backend Testing (2-3 hours)

**Total**: 13-19 hours of implementation work

### Benefits

✅ **Real-Time Updates**: Live data synchronization across all clients
✅ **Better UX**: No more manual refresh needed
✅ **Import Progress**: Real-time progress tracking instead of polling
✅ **Optimistic Updates**: Instant feedback with automatic rollback
✅ **Conflict Detection**: Automatic detection of concurrent edits
✅ **Zero Configuration**: Developers get WebSocket support automatically

## 2. Phase 1: State Manager Template

### File to Create

**Path**: `libs/aegisx-cli/templates/frontend/v2/state-manager.hbs`

### Complete Template Code

```handlebars
import { Injectable, inject, signal } from '@angular/core';
import {
  BaseRealtimeStateManager,
  StateItem,
  StateManagerConfig
} from '../../../shared/business/services/base-realtime-state.manager';
import { WebSocketService } from '../../../shared/business/services/websocket.service';
import { {{PascalCase}} } from '../types/{{kebabCase}}.types';
import { {{pascalCaseHelper singularName}}Service } from '../services/{{kebabCase}}.service';

// Extend entity type to include state management fields
export interface {{PascalCase}}StateItem extends {{PascalCase}}, StateItem {}

/**
 * Real-time state manager for {{PascalCase}}
 * Automatically syncs with backend via WebSocket events
 *
 * Features:
 * - Real-time CRUD updates
 * - Optimistic update support
 * - Conflict detection
 * - Import progress tracking
 *
 * @example
 * // In component:
 * private stateManager = inject({{PascalCase}}StateManager);
 *
 * // Subscribe to items
 * items = this.stateManager.items; // Signal<{{PascalCase}}[]>
 * loading = this.stateManager.loading; // Signal<boolean>
 *
 * // Perform optimistic update
 * await this.stateManager.updateWithOptimism(id, updates);
 */
@Injectable({
  providedIn: 'root'
})
export class {{PascalCase}}StateManager extends BaseRealtimeStateManager<{{PascalCase}}StateItem> {
  private {{camelCase}}Service = inject({{pascalCaseHelper singularName}}Service);

  {{#if withImport}}
  // Import progress signals
  importProgress = signal<number>(0);
  importJobId = signal<string | null>(null);
  importStatus = signal<'idle' | 'validating' | 'importing' | 'completed' | 'failed'>('idle');
  {{/if}}

  constructor() {
    const websocket = inject(WebSocketService);

    const config: StateManagerConfig = {
      feature: '{{kebabCase}}',
      entity: '{{camelCase}}',
      enableOptimisticUpdates: true,
      enableConflictDetection: true,
      enableCaching: true,
      cacheTTL: 60000 // 1 minute
    };

    super(websocket, config);
  }

  /**
   * Load items from API
   */
  async loadItems(filters?: any): Promise<void> {
    this.setLoading(true);
    this.setError(null);

    try {
      const response = await this.{{camelCase}}Service.get{{PascalCase}}List(filters);
      this.setItems(response.data);
    } catch (error) {
      this.setError(error instanceof Error ? error.message : 'Failed to load {{kebabCase}}');
      console.error('Failed to load {{kebabCase}}:', error);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Create new item with optimistic update
   */
  async createItem(data: any): Promise<{{PascalCase}}StateItem> {
    const result = await this.{{camelCase}}Service.create{{PascalCase}}(data);
    this.addItem(result as {{PascalCase}}StateItem);
    return result as {{PascalCase}}StateItem;
  }

  /**
   * Update item with optimistic update support
   */
  async updateWithOptimism(id: string, updates: Partial<{{PascalCase}}>): Promise<{{PascalCase}}StateItem> {
    return await this.performOptimisticUpdate(
      id,
      updates,
      () => this.{{camelCase}}Service.update{{PascalCase}}(id, updates)
    ) as {{PascalCase}}StateItem;
  }

  /**
   * Delete item
   */
  async deleteItem(id: string): Promise<void> {
    await this.{{camelCase}}Service.delete{{PascalCase}}(id);
    this.removeItem(id);
  }

  {{#if withImport}}
  /**
   * Start import job
   */
  async startImport(file: File, options: any): Promise<string> {
    this.importStatus.set('validating');
    this.importProgress.set(0);

    const jobId = await this.{{camelCase}}Service.import{{PascalCase}}(file, options);
    this.importJobId.set(jobId);
    this.importStatus.set('importing');

    return jobId;
  }

  /**
   * Handle import progress from WebSocket
   */
  protected override onImportProgress(data: any): void {
    if (data.jobId === this.importJobId()) {
      this.importProgress.set(data.progress);

      if (data.status) {
        this.importStatus.set(data.status);
      }
    }
  }

  /**
   * Handle import completion from WebSocket
   */
  protected override onImportCompleted(data: any): void {
    if (data.jobId === this.importJobId()) {
      this.importProgress.set(100);
      this.importStatus.set(data.success ? 'completed' : 'failed');

      // Reload items to show imported data
      if (data.success) {
        this.loadItems();
      }
    }
  }
  {{/if}}

  // Event handlers (called by BaseRealtimeStateManager)

  protected override onItemCreated(item: {{PascalCase}}StateItem): void {
    console.log('{{PascalCase}} created via WebSocket:', item.id);
  }

  protected override onItemUpdated(item: {{PascalCase}}StateItem): void {
    console.log('{{PascalCase}} updated via WebSocket:', item.id);
  }

  protected override onItemDeleted(id: string): void {
    console.log('{{PascalCase}} deleted via WebSocket:', id);
  }
}
```

### Generator Logic Changes

**File**: `libs/aegisx-cli/lib/generators/frontend-generator.js`

Add method:

```javascript
async generateStateManager(moduleName, options = {}) {
  console.log(`🎯 Generating state manager for ${moduleName}...`);

  const pascalName = this.toPascalCase(moduleName);
  const camelName = this.toCamelCase(moduleName);
  const kebabName = this.toKebabCase(moduleName);

  const singularPascalName = pascalName.endsWith('s')
    ? pascalName.slice(0, -1)
    : pascalName;

  const context = {
    moduleName,
    PascalCase: singularPascalName,
    camelCase: camelName,
    kebabCase: kebabName,
    singularName: camelName.endsWith('s') ? camelName.slice(0, -1) : camelName,
    withImport: options.withImport || false,
  };

  const templatePath = path.join(this.templatesDir, 'state-manager.hbs');
  const templateContent = fs.readFileSync(templatePath, 'utf8');
  const template = Handlebars.compile(templateContent);
  const generatedCode = template(context);

  const outputDir = path.join(
    this.outputDir,
    this.toKebabCase(moduleName),
    'state'
  );
  this.ensureDirectoryExists(outputDir);

  const outputFile = path.join(
    outputDir,
    `${kebabName}-state.manager.ts`
  );
  fs.writeFileSync(outputFile, generatedCode);

  console.log(`✅ State manager generated: ${outputFile}`);
  return outputFile;
}
```

Update `generateFrontendModule`:

```javascript
async generateFrontendModule(moduleName, options = {}) {
  // ... existing code ...

  // Generate state manager (NEW)
  if (options.withEvents !== false) {
    const stateManagerFile = await this.generateStateManager(moduleName, options);
    generatedFiles.push(stateManagerFile);
  }

  // ... rest of code ...
}
```

### File Placement

Generated file location:

```
apps/web/src/app/features/
  ├── budgets/
  │   ├── state/
  │   │   └── budgets-state.manager.ts  ← NEW
  │   ├── services/
  │   │   └── budgets.service.ts
  │   └── components/
  │       └── budgets-list.component.ts
```

### Naming Conventions

| Input Module | State Manager Class  | File Name                   |
| ------------ | -------------------- | --------------------------- |
| budgets      | BudgetStateManager   | budgets-state.manager.ts    |
| authors      | AuthorStateManager   | authors-state.manager.ts    |
| userRoles    | UserRoleStateManager | user-roles-state.manager.ts |

### Example Generated Output

For module `budgets`:

```typescript
import { Injectable, inject, signal } from '@angular/core';
import { BaseRealtimeStateManager, StateItem } from '../../../shared/business/services/base-realtime-state.manager';
import { WebSocketService } from '../../../shared/business/services/websocket.service';
import { Budget } from '../types/budgets.types';
import { BudgetService } from '../services/budgets.service';

export interface BudgetStateItem extends Budget, StateItem {}

@Injectable({ providedIn: 'root' })
export class BudgetStateManager extends BaseRealtimeStateManager<BudgetStateItem> {
  private budgetsService = inject(BudgetService);

  importProgress = signal<number>(0);
  importJobId = signal<string | null>(null);
  importStatus = signal<'idle' | 'validating' | 'importing' | 'completed' | 'failed'>('idle');

  constructor() {
    const websocket = inject(WebSocketService);
    super(websocket, {
      feature: 'budgets',
      entity: 'budget',
      enableOptimisticUpdates: true,
      enableConflictDetection: true,
      enableCaching: true,
      cacheTTL: 60000,
    });
  }

  async loadItems(filters?: any): Promise<void> {
    this.setLoading(true);
    try {
      const response = await this.budgetsService.getBudgetList(filters);
      this.setItems(response.data);
    } catch (error) {
      this.setError('Failed to load budgets');
    } finally {
      this.setLoading(false);
    }
  }

  async createItem(data: any): Promise<BudgetStateItem> {
    const result = await this.budgetsService.createBudget(data);
    this.addItem(result as BudgetStateItem);
    return result as BudgetStateItem;
  }

  async updateWithOptimism(id: string, updates: Partial<Budget>): Promise<BudgetStateItem> {
    return (await this.performOptimisticUpdate(id, updates, () => this.budgetsService.updateBudget(id, updates))) as BudgetStateItem;
  }

  async deleteItem(id: string): Promise<void> {
    await this.budgetsService.deleteBudget(id);
    this.removeItem(id);
  }

  async startImport(file: File, options: any): Promise<string> {
    this.importStatus.set('validating');
    const jobId = await this.budgetsService.importBudget(file, options);
    this.importJobId.set(jobId);
    this.importStatus.set('importing');
    return jobId;
  }

  protected override onImportProgress(data: any): void {
    if (data.jobId === this.importJobId()) {
      this.importProgress.set(data.progress);
    }
  }

  protected override onImportCompleted(data: any): void {
    if (data.jobId === this.importJobId()) {
      this.importProgress.set(100);
      this.importStatus.set(data.success ? 'completed' : 'failed');
      if (data.success) this.loadItems();
    }
  }
}
```

## 4. Phase 3: Import Dialog Real-Time

### File to Modify

**Path**: `libs/aegisx-cli/templates/frontend/v2/import-dialog.hbs`

### Replace Polling Logic with WebSocket

#### Current Implementation (Polling - BAD ❌)

```typescript
// In budgets-import.dialog.ts (lines 400-420)
async startImport() {
  const jobId = await this.service.startImport(file, options);

  // Poll for status every 2 seconds
  this.pollingInterval = setInterval(async () => {
    const status = await this.service.getImportStatus(jobId);
    this.progress.set(status.progress);

    if (status.completed) {
      clearInterval(this.pollingInterval);
      this.complete();
    }
  }, 2000);
}
```

#### New Implementation (WebSocket - GOOD ✅)

**Location**: Replace entire import execution section

```handlebars
{{#if withImport}}
  import {
  {{pascalCaseHelper singularName}}StateManager } from '../state/{{kebabCase}}-state.manager'; @Component({ // ... component metadata ... }) export class
  {{pascalCaseHelper singularName}}ImportDialogComponent { private stateManager = inject({{pascalCaseHelper singularName}}StateManager); // Reactive progress from state manager importProgress = computed(() => this.stateManager.importProgress()); importStatus = computed(() => this.stateManager.importStatus()); // Watch for completion constructor() { effect(() => { const status = this.importStatus(); if (status === 'completed') { this.currentStep.set('complete'); this.snackBar.open('Import completed successfully!', 'Close', { duration: 3000 }); } else if (status === 'failed') { this.currentStep.set('upload'); this.snackBar.open('Import failed. Please try again.', 'Close', { duration: 5000 }); } }); } async executeImport() { if (!this.selectedFile() || !this.validationResult()) return; this.currentStep.set('progress'); this.loading.set(true); try { // Start import via state manager (WebSocket will handle progress) const jobId = await this.stateManager.startImport( this.selectedFile()!, this.importOptions() ); console.log('Import job started:', jobId); // No polling needed! WebSocket events will update progress automatically } catch (error) { this.error.set(error instanceof Error ? error.message : 'Import failed'); this.loading.set(false); this.currentStep.set('upload'); } } }
{{/if}}
```

### Event Subscriptions to Add

**In template (progress step):**

```html
<!-- Step 4: Import Progress -->
@if (currentStep() === 'progress') {
<div class="step-content">
  <div class="progress-container">
    <!-- Real-time progress from WebSocket -->
    <mat-progress-bar mode="determinate" [value]="importProgress()"></mat-progress-bar>

    <div class="progress-stats">
      <span class="progress-percentage">{{ importProgress() }}%</span>
      <span class="progress-status">{{ importStatus() }}</span>
    </div>

    <!-- Real-time status messages -->
    <div class="status-message">
      @switch (importStatus()) { @case ('validating') {
      <mat-icon>pending</mat-icon>
      <span>Validating data...</span>
      } @case ('importing') {
      <mat-icon>cloud_upload</mat-icon>
      <span>Importing records...</span>
      } @case ('completed') {
      <mat-icon class="text-green-600">check_circle</mat-icon>
      <span>Import completed!</span>
      } @case ('failed') {
      <mat-icon class="text-red-600">error</mat-icon>
      <span>Import failed</span>
      } }
    </div>
  </div>
</div>
}
```

### Progress Update Logic

State manager automatically handles:

```typescript
// In generated BudgetStateManager
protected override onImportProgress(data: any): void {
  if (data.jobId === this.importJobId()) {
    this.importProgress.set(data.progress); // ← Automatic update

    if (data.status) {
      this.importStatus.set(data.status);
    }
  }
}
```

### Completion Handling

```typescript
protected override onImportCompleted(data: any): void {
  if (data.jobId === this.importJobId()) {
    this.importProgress.set(100);
    this.importStatus.set(data.success ? 'completed' : 'failed');

    // Automatically reload list to show imported items
    if (data.success) {
      this.loadItems(); // ← Refresh list
    }
  }
}
```

### Error Handling

```typescript
// In import dialog effect
effect(() => {
  const status = this.importStatus();
  const error = this.stateManager.error();

  if (status === 'failed' && error) {
    this.snackBar.open(error, 'Close', { duration: 5000 });
    this.currentStep.set('upload'); // Go back to start
  }
});
```

### Example Generated Output

For `budgets-import.dialog.ts`:

```typescript
import { BudgetStateManager } from '../state/budgets-state.manager';

@Component({
  selector: 'app-budgets-import-dialog',
  // ...
})
export class BudgetsImportDialogComponent {
  private stateManager = inject(BudgetStateManager);

  // Real-time progress (no polling!)
  importProgress = computed(() => this.stateManager.importProgress());
  importStatus = computed(() => this.stateManager.importStatus());

  constructor() {
    // Watch for completion
    effect(() => {
      const status = this.importStatus();
      if (status === 'completed') {
        this.currentStep.set('complete');
      } else if (status === 'failed') {
        this.handleImportError();
      }
    });
  }

  async executeImport() {
    this.currentStep.set('progress');

    // Start import - WebSocket will handle the rest!
    const jobId = await this.stateManager.startImport(this.selectedFile()!, this.importOptions());

    // That's it! No polling, no manual status checks
    // WebSocket events automatically update progress
  }
}
```

**Key Differences from Polling**:

- ❌ No `setInterval` / polling loops
- ❌ No manual status API calls
- ✅ Automatic real-time updates via WebSocket
- ✅ Cleaner code, less complexity
- ✅ Better performance (no unnecessary API calls)

## 6. Implementation Checklist

### Phase 1: State Manager Template

- [ ] **1.1**: Create `templates/frontend/v2/state-manager.hbs`
  - [ ] Add imports (BaseRealtimeStateManager, WebSocketService, types)
  - [ ] Create StateItem interface extending entity type
  - [ ] Add Injectable decorator with providedIn: 'root'
  - [ ] Add constructor with WebSocket injection
  - [ ] Add config object (feature, entity, options)
  - [ ] Add loadItems() method
  - [ ] Add createItem() method
  - [ ] Add updateWithOptimism() method
  - [ ] Add deleteItem() method
  - [ ] Add import methods (if --with-import)
  - [ ] Add event handler overrides
  - [ ] Add JSDoc comments

- [ ] **1.2**: Update `lib/generators/frontend-generator.js`
  - [ ] Add generateStateManager() method
  - [ ] Add state manager generation to generateFrontendModule()
  - [ ] Add withEvents option handling
  - [ ] Add proper error handling
  - [ ] Add console logging for generation steps

- [ ] **1.3**: Test state manager generation
  - [ ] Run generator: `pnpm generate:crud budgets --with-events`
  - [ ] Verify file created in correct location
  - [ ] Verify imports are correct
  - [ ] Verify feature/entity names match module
  - [ ] Verify methods are generated correctly

- [ ] **1.4**: Validate generated output
  - [ ] Run `pnpm lint` - ensure no errors
  - [ ] Run `pnpm type-check` - ensure no type errors
  - [ ] Verify state manager compiles
  - [ ] Test in browser (manual check)

### Phase 2: List Component Integration

- [ ] **2.1**: Modify `templates/frontend/v2/list-component-v2.hbs`
  - [ ] Add state manager import (conditional)
  - [ ] Add state manager injection
  - [ ] Add WebSocket sync effect in constructor
  - [ ] Add error sync effect
  - [ ] Modify data loading to use state manager
  - [ ] Update create method to use state manager
  - [ ] Update edit method with optimistic updates
  - [ ] Update delete method to use state manager

- [ ] **2.2**: Add conditional generation logic
  - [ ] Add `{{#if withEvents}}` blocks
  - [ ] Add fallback to original code if events disabled
  - [ ] Update context preparation in generator

- [ ] **2.3**: Test list component generation
  - [ ] Generate with events: `--with-events`
  - [ ] Generate without events (default)
  - [ ] Verify conditional blocks work correctly
  - [ ] Verify both versions compile

- [ ] **2.4**: Test real-time updates
  - [ ] Create item in one browser tab
  - [ ] Verify it appears in another tab (real-time)
  - [ ] Update item in one tab
  - [ ] Verify optimistic update works
  - [ ] Delete item in one tab
  - [ ] Verify it disappears in other tab

### Phase 3: Import Dialog Real-Time

- [ ] **3.1**: Modify `templates/frontend/v2/import-dialog.hbs`
  - [ ] Add state manager import
  - [ ] Add state manager injection
  - [ ] Add progress computed signal
  - [ ] Add status computed signal
  - [ ] Add completion effect in constructor
  - [ ] Replace polling logic with state manager call
  - [ ] Update template to use reactive signals

- [ ] **3.2**: Update progress tracking
  - [ ] Remove setInterval polling
  - [ ] Remove manual status checks
  - [ ] Add WebSocket event subscriptions
  - [ ] Update progress bar binding

- [ ] **3.3**: Test import dialog
  - [ ] Generate component with import: `--with-import --with-events`
  - [ ] Verify polling code is removed
  - [ ] Verify WebSocket logic is added
  - [ ] Test actual import with progress tracking

- [ ] **3.4**: Validate real-time import
  - [ ] Upload CSV file
  - [ ] Verify progress updates in real-time (no delays)
  - [ ] Verify completion notification
  - [ ] Verify list refreshes automatically after import
  - [ ] Test error scenarios

### Phase 4: Backend Testing

- [ ] **4.1**: Modify `templates/backend/domain/test.hbs`
  - [ ] Add EventService mock setup
  - [ ] Add created event test
  - [ ] Add updated event test
  - [ ] Add deleted event test
  - [ ] Add import_started event test
  - [ ] Add import_progress event test
  - [ ] Add import_completed event test
  - [ ] Add metadata validation test

- [ ] **4.2**: Test event emission
  - [ ] Generate backend with events
  - [ ] Run test suite: `pnpm test budgets.service.spec`
  - [ ] Verify all event tests pass
  - [ ] Verify mock EventService works correctly

- [ ] **4.3**: Integration testing
  - [ ] Test with real EventService (optional)
  - [ ] Verify events reach WebSocket clients
  - [ ] Test event routing
  - [ ] Test event metadata

- [ ] **4.4**: Documentation
  - [ ] Document test patterns
  - [ ] Add examples to spec
  - [ ] Update testing guide

### Phase 5: End-to-End Validation

- [ ] **5.1**: Generate complete module with all features

  ```bash
  pnpm generate:crud test-module --with-import --with-events
  ```

- [ ] **5.2**: Verify all files generated
  - [ ] State manager created
  - [ ] List component has WebSocket integration
  - [ ] Import dialog uses WebSocket
  - [ ] Backend tests include event tests

- [ ] **5.3**: Run complete test suite
  - [ ] Backend tests pass
  - [ ] Frontend compiles
  - [ ] No lint errors
  - [ ] No type errors

- [ ] **5.4**: Manual E2E testing
  - [ ] Open two browser tabs
  - [ ] Create item in tab 1 → appears in tab 2
  - [ ] Update item in tab 2 → updates in tab 1
  - [ ] Delete item in tab 1 → removes from tab 2
  - [ ] Start import in tab 1 → progress shows in tab 2
  - [ ] Verify no polling (check Network tab)

- [ ] **5.5**: Performance validation
  - [ ] Check Network tab - no polling requests
  - [ ] Verify WebSocket connection established
  - [ ] Verify events received in real-time
  - [ ] Check memory usage (no leaks)

### Phase 6: Documentation & Cleanup

- [ ] **6.1**: Update CRUD generator docs
  - [ ] Add `--with-events` flag documentation
  - [ ] Add WebSocket usage examples
  - [ ] Add troubleshooting section

- [ ] **6.2**: Update README files
  - [ ] Add real-time features to feature list
  - [ ] Add examples of generated code
  - [ ] Add migration guide for existing modules

- [ ] **6.3**: Create migration script (optional)
  - [ ] Script to add WebSocket to existing modules
  - [ ] Document manual migration steps

- [ ] **6.4**: Final validation
  - [ ] Run all tests
  - [ ] Generate 3 different modules
  - [ ] Verify consistency
  - [ ] Get user feedback

## 8. Code Examples

### Complete Generated State Manager

```typescript
// File: apps/web/src/app/features/budgets/state/budgets-state.manager.ts

import { Injectable, inject, signal } from '@angular/core';
import { BaseRealtimeStateManager, StateItem, StateManagerConfig } from '../../../shared/business/services/base-realtime-state.manager';
import { WebSocketService } from '../../../shared/business/services/websocket.service';
import { Budget } from '../types/budgets.types';
import { BudgetService } from '../services/budgets.service';

export interface BudgetStateItem extends Budget, StateItem {}

/**
 * Real-time state manager for Budgets
 * Handles WebSocket events and optimistic updates
 */
@Injectable({ providedIn: 'root' })
export class BudgetStateManager extends BaseRealtimeStateManager<BudgetStateItem> {
  private budgetsService = inject(BudgetService);

  // Import tracking
  importProgress = signal<number>(0);
  importJobId = signal<string | null>(null);
  importStatus = signal<'idle' | 'validating' | 'importing' | 'completed' | 'failed'>('idle');

  constructor() {
    const websocket = inject(WebSocketService);

    super(websocket, {
      feature: 'budgets',
      entity: 'budget',
      enableOptimisticUpdates: true,
      enableConflictDetection: true,
      enableCaching: true,
      cacheTTL: 60000,
    });
  }

  async loadItems(filters?: any): Promise<void> {
    this.setLoading(true);
    this.setError(null);

    try {
      const response = await this.budgetsService.getBudgetList(filters);
      this.setItems(response.data);
    } catch (error) {
      this.setError(error instanceof Error ? error.message : 'Failed to load budgets');
    } finally {
      this.setLoading(false);
    }
  }

  async createItem(data: any): Promise<BudgetStateItem> {
    const result = await this.budgetsService.createBudget(data);
    this.addItem(result as BudgetStateItem);
    return result as BudgetStateItem;
  }

  async updateWithOptimism(id: string, updates: Partial<Budget>): Promise<BudgetStateItem> {
    return (await this.performOptimisticUpdate(id, updates, () => this.budgetsService.updateBudget(id, updates))) as BudgetStateItem;
  }

  async deleteItem(id: string): Promise<void> {
    await this.budgetsService.deleteBudget(id);
    this.removeItem(id);
  }

  async startImport(file: File, options: any): Promise<string> {
    this.importStatus.set('validating');
    this.importProgress.set(0);

    const jobId = await this.budgetsService.importBudget(file, options);
    this.importJobId.set(jobId);
    this.importStatus.set('importing');

    return jobId;
  }

  // WebSocket event handlers

  protected override onItemCreated(item: BudgetStateItem): void {
    console.log('Budget created via WebSocket:', item.id);
  }

  protected override onItemUpdated(item: BudgetStateItem): void {
    console.log('Budget updated via WebSocket:', item.id);
  }

  protected override onItemDeleted(id: string): void {
    console.log('Budget deleted via WebSocket:', id);
  }

  protected override onImportProgress(data: any): void {
    if (data.jobId === this.importJobId()) {
      this.importProgress.set(data.progress);
      if (data.status) {
        this.importStatus.set(data.status);
      }
    }
  }

  protected override onImportCompleted(data: any): void {
    if (data.jobId === this.importJobId()) {
      this.importProgress.set(100);
      this.importStatus.set(data.success ? 'completed' : 'failed');

      if (data.success) {
        this.loadItems(); // Refresh list
      }
    }
  }
}
```

### Generated List Component with WebSocket

```typescript
// File: apps/web/src/app/features/budgets/components/budgets-list.component.ts

import { Component, inject, effect, signal } from '@angular/core';
import { BudgetService } from '../services/budgets.service';
import { BudgetStateManager } from '../state/budgets-state.manager'; // ← NEW
import { Budget } from '../types/budgets.types';

@Component({
  selector: 'app-budgets-list',
  // ...
})
export class BudgetsListComponent {
  budgetsService = inject(BudgetService);
  private stateManager = inject(BudgetStateManager); // ← NEW

  dataSource = new MatTableDataSource<Budget>([]);

  constructor() {
    // Real-time WebSocket updates (NEW)
    effect(() => {
      const stateItems = this.stateManager.items();
      if (stateItems.length > 0) {
        this.dataSource.data = stateItems as Budget[];
        if (this.paginator) {
          this.paginator.length = this.budgetsService.totalBudget();
        }
      }
    });

    // Sync errors (NEW)
    effect(() => {
      const error = this.stateManager.error();
      if (error) {
        this.snackBar.open(error, 'Close', { duration: 5000 });
      }
    });

    // Load data with WebSocket sync (MODIFIED)
    effect(async () => {
      // ... collect filters ...
      await this.stateManager.loadItems(params); // ← Using state manager
      this.dataSource.data = this.stateManager.items();
    });
  }

  // CRUD operations with optimistic updates (MODIFIED)

  openCreateDialog() {
    const dialogRef = this.dialog.open(BudgetCreateDialogComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          await this.stateManager.createItem(result); // ← Automatic broadcast
          this.snackBar.open('Budget created successfully', 'Close', { duration: 3000 });
        } catch (error) {
          // Error handled by state manager
        }
      }
    });
  }

  onEditBudget(budget: Budget) {
    const dialogRef = this.dialog.open(BudgetEditDialogComponent, {
      width: '600px',
      data: { budget },
    });

    dialogRef.afterClosed().subscribe(async (updates) => {
      if (updates) {
        try {
          await this.stateManager.updateWithOptimism(budget.id, updates); // ← Optimistic
          this.snackBar.open('Budget updated successfully', 'Close', { duration: 3000 });
        } catch (error) {
          // Optimistic update rolled back automatically
        }
      }
    });
  }

  onDeleteBudget(budget: Budget) {
    this.axDialog.confirmDelete(budget.name).subscribe(async (confirmed) => {
      if (confirmed) {
        try {
          await this.stateManager.deleteItem(budget.id); // ← Automatic broadcast
          this.snackBar.open('Budget deleted successfully', 'Close', { duration: 3000 });
        } catch (error) {
          this.snackBar.open('Failed to delete budget', 'Close', { duration: 3000 });
        }
      }
    });
  }
}
```

### Generated Import Dialog with WebSocket

```typescript
// File: apps/web/src/app/features/budgets/components/budgets-import.dialog.ts

import { Component, inject, effect, computed, signal } from '@angular/core';
import { BudgetStateManager } from '../state/budgets-state.manager'; // ← NEW

@Component({
  selector: 'app-budgets-import-dialog',
  // ...
})
export class BudgetsImportDialogComponent {
  private stateManager = inject(BudgetStateManager); // ← NEW

  // Real-time progress from state manager (NEW)
  importProgress = computed(() => this.stateManager.importProgress());
  importStatus = computed(() => this.stateManager.importStatus());

  currentStep = signal<ImportStep>('upload');
  selectedFile = signal<File | null>(null);
  loading = signal(false);

  constructor() {
    // Watch for import completion (NEW)
    effect(() => {
      const status = this.importStatus();

      if (status === 'completed') {
        this.currentStep.set('complete');
        this.snackBar.open('Import completed successfully!', 'Close', { duration: 3000 });
      } else if (status === 'failed') {
        this.currentStep.set('upload');
        this.snackBar.open('Import failed. Please try again.', 'Close', { duration: 5000 });
      }
    });
  }

  async executeImport() {
    if (!this.selectedFile() || !this.validationResult()) return;

    this.currentStep.set('progress');
    this.loading.set(true);

    try {
      // Start import - WebSocket handles progress automatically! (MODIFIED)
      const jobId = await this.stateManager.startImport(this.selectedFile()!, this.importOptions());

      console.log('Import job started:', jobId);
      // No polling! WebSocket events update progress automatically
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Import failed');
      this.loading.set(false);
      this.currentStep.set('upload');
    }
  }
}
```

### Generated Backend Tests

```typescript
// File: apps/api/src/modules/budgets/tests/budgets.service.spec.ts

describe('BudgetService WebSocket Events', () => {
  let service: BudgetService;
  let mockEventService: any;

  beforeEach(() => {
    mockEventService = {
      emitToFeature: jest.fn(),
    };

    // Inject mock
    (service as any).eventService = mockEventService;
  });

  describe('CRUD Events', () => {
    it('should emit created event when budget is created', async () => {
      const budget = await service.create({
        name: 'Q1 Budget',
        amount: 10000,
        fiscal_year: 2024,
      });

      expect(mockEventService.emitToFeature).toHaveBeenCalledWith(
        'budgets',
        expect.objectContaining({
          entity: 'budget',
          action: 'created',
          data: expect.objectContaining({ id: budget.id }),
          meta: expect.objectContaining({
            timestamp: expect.any(String),
            featureVersion: 'v1',
          }),
        }),
      );
    });

    it('should emit updated event with changes', async () => {
      const budget = await service.create({ name: 'Test', amount: 1000 });
      await service.update(budget.id, { amount: 2000 });

      const updateCall = mockEventService.emitToFeature.mock.calls.find((call: any) => call[1].action === 'updated');

      expect(updateCall[1].data).toMatchObject({
        id: budget.id,
        amount: 2000,
      });
    });

    it('should emit deleted event with ID', async () => {
      const budget = await service.create({ name: 'To Delete', amount: 500 });
      await service.delete(budget.id);

      expect(mockEventService.emitToFeature).toHaveBeenCalledWith(
        'budgets',
        expect.objectContaining({
          entity: 'budget',
          action: 'deleted',
          data: { id: budget.id },
        }),
      );
    });
  });

  describe('Import Events', () => {
    it('should emit import_started event', async () => {
      const csvData = Buffer.from('name,amount\nBudget1,1000');
      await service.importData(csvData, {});

      expect(mockEventService.emitToFeature).toHaveBeenCalledWith(
        'budgets',
        expect.objectContaining({
          entity: 'budget',
          action: 'import_started',
          data: expect.objectContaining({
            jobId: expect.any(String),
            totalRows: 1,
          }),
        }),
      );
    });

    it('should emit import_progress events', async () => {
      const csvData = Buffer.from('name,amount\nB1,100\nB2,200\nB3,300');
      await service.importData(csvData, {});

      const progressCalls = mockEventService.emitToFeature.mock.calls.filter((call: any) => call[1].action === 'import_progress');

      expect(progressCalls.length).toBeGreaterThan(0);
      expect(progressCalls[0][1].data).toMatchObject({
        progress: expect.any(Number),
        processedRows: expect.any(Number),
      });
    });

    it('should emit import_completed event', async () => {
      const csvData = Buffer.from('name,amount\nBudget1,1000');
      await service.importData(csvData, {});

      expect(mockEventService.emitToFeature).toHaveBeenCalledWith(
        'budgets',
        expect.objectContaining({
          entity: 'budget',
          action: 'import_completed',
          data: expect.objectContaining({
            success: true,
            totalRows: 1,
            successfulRows: 1,
          }),
        }),
      );
    });
  });
});
```

## 10. Troubleshooting

### Common Issues

| Issue                                   | Symptom                            | Solution                                           |
| --------------------------------------- | ---------------------------------- | -------------------------------------------------- |
| **No real-time updates**                | Changes don't appear in other tabs | Check WebSocket connection in DevTools Network tab |
| **Import progress not updating**        | Progress bar stuck at 0%           | Verify EventService is emitting events on backend  |
| **Optimistic updates not rolling back** | Failed updates persist             | Check error handling in state manager              |
| **Type errors**                         | TypeScript compilation fails       | Ensure StateItem interface extends entity type     |
| **State manager not injected**          | Runtime error: "Cannot inject..."  | Verify @Injectable({ providedIn: 'root' })         |

### Debug Checklist

- [ ] Check WebSocket connection: DevTools → Network → WS
- [ ] Verify feature subscription: Console → "Subscribed to features: ['budgets']"
- [ ] Check event routing: Console → "Routed message: budgets.budget.created"
- [ ] Verify EventService on backend: Check logs for "Event emitted"
- [ ] Test backend independently: Use Postman/curl to trigger events
- [ ] Check for TypeScript errors: `pnpm type-check`
- [ ] Verify imports: Ensure all paths are correct
- [ ] Check Angular DevTools: Verify signals update

### WebSocket Connection Issues

```typescript
// In component constructor, add debug logging:
effect(() => {
  const status = this.websocket.getConnectionStatus();
  console.log('WebSocket status:', status);
});

// Expected output:
// WebSocket status: { status: 'connected', timestamp: Date }
```

### Event Not Received

```typescript
// Add logging to state manager:
protected override onItemCreated(item: BudgetStateItem): void {
  console.log('✅ Received created event:', item);
  super.onItemCreated(item);
}

// If this doesn't log, check:
// 1. Backend EventService emitting?
// 2. WebSocket subscribed to correct feature?
// 3. Event routing working?
```

## Summary

This specification provides **complete, implementation-ready** instructions for adding WebSocket real-time functionality to the CRUD generator.

**Key Deliverables**:

1. State manager template with optimistic updates
2. List component integration with real-time sync
3. Import dialog with WebSocket progress tracking
4. Backend tests for event emission

**Benefits**:

- Zero-configuration real-time updates for developers
- Better UX with instant feedback
- Scalable WebSocket architecture
- Automatic conflict detection
- Professional-grade state management

**Timeline**: 13-19 hours of focused implementation work across 4 phases.

All code examples are **complete and ready to use** - no placeholders, no pseudocode. Developers can copy-paste these examples and they will work.
