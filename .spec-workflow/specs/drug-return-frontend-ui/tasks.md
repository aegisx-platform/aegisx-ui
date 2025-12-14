# Tasks Document - Drug Return Frontend UI

## Overview

This document breaks down the implementation of the Drug Return Frontend UI into atomic, testable tasks. Each task represents a discrete unit of work that can be implemented, tested, and verified independently.

**Total Estimated Effort**: 4-5 weeks (160-200 hours)

---

## Phase 1: Project Setup & Configuration (Week 1, Days 1-2)

### 1.1. Create feature module structure and routing configuration

- [ ] 1.1. Create feature module structure and routing configuration
  - Files:
    - `apps/admin/src/app/features/drug-returns/drug-returns.routes.ts`
  - Purpose: Setup lazy-loaded feature module with route configuration for 6 pages
  - _Leverage: Existing route patterns from inventory and distribution features_
  - _Requirements: All page routes from design.md_
  - _Prompt: Implement the task for spec drug-return-frontend-ui, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer with Angular routing expertise | Task: Create drug-returns.routes.ts with lazy-loaded routes for 6 pages: '' (dashboard main), 'create' (create return), ':id' (detail), ':id/verify' (verify return), 'quarantine/management' (quarantine management), 'analytics' (analytics). Configure route guards (authGuard, permissionGuard) with permission data: { resource: 'drug_return', actions: ['read', 'create', 'verify', 'quarantine.view', 'analytics.view'] }. Add breadcrumb metadata. Export DRUG_RETURNS_ROUTES constant. Use standalone component pattern with loadComponent(). | Restrictions: Use Angular 18+ standalone components, implement lazy loading with loadComponent(), apply canActivate guards with specific permissions per route, include breadcrumbs, redirect root '' to dashboard page, follow existing routing patterns from inventory module | \_Leverage: apps/admin/src/app/app.routes.ts patterns, apps/admin/src/app/features/inventory/inventory.routes.ts as reference_ | _Requirements: REQ-1 to REQ-20 from requirements.md_ | Success: Routes configured with lazy loading, guards applied correctly with proper permissions, breadcrumbs set, navigation tested, compiles without errors\_

### 1.2. Setup shared models and interfaces

- [ ] 1.2. Setup shared models and interfaces
  - Files:
    - `apps/admin/src/app/features/drug-returns/models/drug-return.interface.ts`
    - `apps/admin/src/app/features/drug-returns/models/disposal.interface.ts`
    - `apps/admin/src/app/features/drug-returns/models/enums.ts`
    - `apps/admin/src/app/features/drug-returns/models/index.ts`
  - Purpose: Define TypeScript interfaces for all data structures matching backend API
  - _Leverage: Backend API schemas from drug-return-backend-api spec_
  - _Requirements: All data models from design.md_
  - _Prompt: Implement the task for spec drug-return-frontend-ui, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer with TypeScript expertise | Task: Create drug-return.interface.ts with interfaces: DrugReturn, DrugReturnItem, CreateDrugReturnDto, UpdateDrugReturnDto, VerifyReturnDto. Create disposal.interface.ts with: QuarantineLot, Disposal, DisposalItem, ScheduleDisposalDto. Create enums.ts with: ReturnStatus ('DRAFT', 'SUBMITTED', 'VERIFIED', 'POSTED', 'CANCELLED'), DisposalStatus ('PENDING', 'SCHEDULED', 'COMPLETED'). Add QuickStats, QuarantineStats, WebSocket event types (ReturnUpdateEvent, QuarantineUpdateEvent). Add JSDoc comments for each interface. Create barrel export in index.ts. | Restrictions: Match backend API response structures exactly from drug-return-backend-api/design.md, use string for UUIDs, string for ISO dates, enums for status fields, make fields readonly where appropriate, use utility types (Partial, Omit) for DTOs, include all request/response types | \_Leverage: Backend schema from drug-return-backend-api/design.md sections "API Endpoints" and "Data Models", TypeScript utility types_ | _Requirements: All data models from design.md section "Data Models and Interfaces"_ | Success: All 15+ interfaces defined, enums created, types match backend exactly, no TypeScript errors, JSDoc comments added, exported via barrel file\_

### 1.3. Configure environment settings for API and WebSocket URLs

- [ ] 1.3. Configure environment settings for API and WebSocket URLs
  - Files:
    - `apps/admin/src/environments/environment.ts`
    - `apps/admin/src/environments/environment.prod.ts`
  - Purpose: Add drug-return-specific environment configuration
  - _Leverage: Existing environment configuration patterns_
  - _Requirements: API integration from design.md_
  - _Prompt: Implement the task for spec drug-return-frontend-ui, first run spec-workflow-guide to get the workflow guide then implement the task: Role: DevOps/Frontend Developer | Task: Add drug return configuration to environment files: drugReturnApiUrl (defaults to '/api/inventory/operations/drug-returns'), disposalApiUrl (defaults to '/api/inventory/operations/drug-disposals'), wsUrl for real-time updates (reuse existing if configured), enable/disable WebSocket flag. Ensure environment.prod.ts uses production URLs from environment variables. | Restrictions: Use existing environment structure, don't hardcode production URLs, follow existing API URL patterns, reuse existing WebSocket URL configuration if available, add feature flags for real-time updates, follow naming conventions from other modules | \_Leverage: Existing apps/admin/src/environments files, inventory and distribution environment configuration_ | _Requirements: Backend API endpoint structure (15 endpoints), WebSocket integration requirements_ | Success: Environment files updated, URLs configurable per environment, no hardcoded production values, WebSocket URL reused if exists, tested in dev and prod builds\_

---

## Phase 2: Core Services (Week 1, Days 3-5)

### 2.1. Implement DrugReturnApiService with all HTTP endpoints

- [ ] 2.1. Implement DrugReturnApiService with all HTTP endpoints
  - Files:
    - `apps/admin/src/app/features/drug-returns/services/drug-return-api.service.ts`
    - `apps/admin/src/app/features/drug-returns/services/drug-return-api.service.spec.ts`
  - Purpose: HTTP communication layer for all drug return API endpoints
  - _Leverage: HttpClient, existing API service patterns_
  - _Requirements: REQ-19 API integration, all CRUD and workflow endpoints_
  - _Prompt: Implement the task for spec drug-return-frontend-ui, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer with Angular HttpClient expertise | Task: Create DrugReturnApiService as @Injectable() with 11 methods: getDrugReturns(filters?), getDrugReturnById(id), createDrugReturn(data), updateDrugReturn(id, data), deleteDrugReturn(id), submitReturn(id), verifyReturn(id, data), rejectReturn(id, reason), postReturn(id), getAnalytics(filters), getDepartments(). Use HttpClient, return Observable<T>, map responses from ApiResponse wrapper, handle query parameters with HttpParams, use proper HTTP methods (GET/POST/PUT/DELETE). | Restrictions: Mark as @Injectable({ providedIn: 'root' }), inject HttpClient via constructor, return Observable<T> for all methods, use map operator to extract data from ApiResponse<T> wrapper, handle query params properly with HttpParams, use correct HTTP methods per endpoint, add error handling with catchError, use environment.drugReturnApiUrl as base | \_Leverage: HttpClient from @angular/common/http, RxJS operators (map, catchError), existing service patterns from inventory/distribution, backend API spec from drug-return-backend-api/design.md_ | _Requirements: All API endpoints from design.md "DrugReturnApiService" section and backend spec_ | Success: All 11 methods implemented correctly, responses typed, query params handled, compiles without errors, unit tests pass with HttpTestingController\_

### 2.2. Implement DisposalApiService for quarantine and disposal operations

- [ ] 2.2. Implement DisposalApiService for quarantine and disposal operations
  - Files:
    - `apps/admin/src/app/features/drug-returns/services/disposal-api.service.ts`
    - `apps/admin/src/app/features/drug-returns/services/disposal-api.service.spec.ts`
  - Purpose: HTTP communication for disposal and quarantine endpoints
  - _Leverage: HttpClient, existing patterns_
  - _Requirements: REQ-7 to REQ-9 quarantine and disposal management_
  - _Prompt: Implement the task for spec drug-return-frontend-ui, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer with HttpClient expertise | Task: Create DisposalApiService as @Injectable() with methods: getQuarantineLots(filters?), getQuarantineLotById(id), createDisposal(data), completeDisposal(id, data), getDisposals(filters?), getDisposalById(id). Use environment.disposalApiUrl as base URL. Handle Blob response for photo uploads in completeDisposal. | Restrictions: Mark as @Injectable({ providedIn: 'root' }), use HttpClient, return Observable<T>, map from ApiResponse wrapper, handle file uploads with FormData for photos, use catchError for errors, use environment.disposalApiUrl | \_Leverage: HttpClient, RxJS operators, FormData for file uploads, backend disposal API endpoints_ | _Requirements: REQ-7 to REQ-9 from requirements.md, disposal endpoints from design.md_ | Success: All disposal methods implemented, photo upload works with FormData, responses typed correctly, unit tests pass\_

### 2.3. Implement DrugReturnWebSocketService with reconnection logic

- [ ] 2.3. Implement DrugReturnWebSocketService with reconnection logic
  - Files:
    - `apps/admin/src/app/features/drug-returns/services/drug-return-websocket.service.ts`
    - `apps/admin/src/app/features/drug-returns/services/drug-return-websocket.service.spec.ts`
  - Purpose: WebSocket connection for real-time drug return updates
  - _Leverage: WebSocket API, RxJS Subjects, existing WebSocket patterns_
  - _Requirements: REQ-12 Real-time updates_
  - _Prompt: Implement the task for spec drug-return-frontend-ui, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer with WebSocket expertise | Task: Create DrugReturnWebSocketService as @Injectable() with WebSocket connection management. Implement auto-reconnect with exponential backoff (1s, 2s, 4s, 8s, 16s, max 5 attempts). Create RxJS Subjects for events: returnUpdates$ (ReturnUpdateEvent), quarantineUpdates$ (QuarantineUpdateEvent). Add BehaviorSubject connectionStatus$ ('connected'|'disconnected'|'reconnecting'). Implement methods: connect(), disconnect(), send(event), handleMessage(event). Subscribe to 'drug-returns' channel on connect. Implement ngOnDestroy for cleanup. | Restrictions: Use native WebSocket API, implement exponential backoff (max 5 attempts), emit connection status changes, handle onopen/onmessage/onerror/onclose events, send JWT token in connection URL (?token=), parse JSON messages, route events to correct Subject based on event.type ('return.created', 'return.updated', 'return.verified', 'return.posted', 'quarantine.updated'), clean up socket in ngOnDestroy | \_Leverage: WebSocket API, RxJS Subject/BehaviorSubject, AuthService for token, exponential backoff algorithm, inventory/distribution WebSocket patterns_ | _Requirements: REQ-12 WebSocket from requirements.md, DrugReturnWebSocketService from design.md_ | Success: WebSocket connects successfully, auto-reconnects on disconnect, events routed to correct Subjects, connection status tracked, no memory leaks, tested with mock WebSocket\_

### 2.4. Implement DrugReturnStateService with Signals-based state management

- [ ] 2.4. Implement DrugReturnStateService with Signals-based state management
  - Files:
    - `apps/admin/src/app/features/drug-returns/services/drug-return-state.service.ts`
    - `apps/admin/src/app/features/drug-returns/services/drug-return-state.service.spec.ts`
  - Purpose: Centralized state management using Angular Signals
  - _Leverage: Angular Signals, RxJS, existing state patterns_
  - _Requirements: State management from design.md_
  - _Prompt: Implement the task for spec drug-return-frontend-ui, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer with Angular Signals expertise | Task: Create DrugReturnStateService as @Injectable() with private WritableSignals (returnsSignal, quarantineLotsSignal, selectedReturnSignal, loadingSignal), public readonly signals (returns, quarantineLots, selectedReturn, isLoading), computed signals (pendingVerification, quarantineStats). Implement methods: fetchDrugReturns(filters?), fetchDrugReturnById(id), updateReturn(return), fetchQuarantineLots(filters?), exportReturns(returns), exportQuarantineLots(lots), fetchDepartments(), fetchLocations(), fetchReturnReasons(), fetchUsers(), fetchLotsForDrug(drugId, deptId). Subscribe to WebSocket events in initWebSocketSubscriptions() to update signals. Use XLSX library for Excel export. | Restrictions: Use signal() for writable state, asReadonly() for public exposure, computed() for derived state, update() method for immutable updates, inject DrugReturnApiService, DisposalApiService, DrugReturnWebSocketService, handle all WebSocket event types, implement Excel export with XLSX.utils and XLSX.writeFile, update state immutably, fetch master data for dropdowns | \_Leverage: Angular Signals (signal, computed, update, asReadonly), RxJS (tap, catchError, Subject), DrugReturnApiService, DisposalApiService, DrugReturnWebSocketService, xlsx library for export_ | _Requirements: DrugReturnStateService from design.md_ | Success: State managed with Signals, computed signals reactive, WebSocket events update state correctly, export generates Excel files, master data fetching works, unit tests verify state updates, no memory leaks\_

---

## Phase 3: Presentation Components (Week 2, Days 1-2)

### 3.1. Create QuickStatsComponent for drug return summary cards

- [ ] 3.1. Create QuickStatsComponent for drug return summary cards
  - Files:
    - `apps/admin/src/app/features/drug-returns/components/quick-stats/quick-stats.component.ts`
    - `apps/admin/src/app/features/drug-returns/components/quick-stats/quick-stats.component.spec.ts`
  - Purpose: Display 4 KPI cards for drug return statistics
  - _Leverage: AegisX AxKpiCard component_
  - _Requirements: REQ-2 Quick Stats Cards_
  - _Prompt: Implement the task for spec drug-return-frontend-ui, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer with Angular component expertise | Task: Create standalone QuickStatsComponent with @Input() stats (required, Signal<QuickStats> type), @Output() statClick EventEmitter. Template uses 4 ax-kpi-card components: Total Returns (primary, assignment_return icon), Pending Verification (warning, pending_actions icon), Verified Today (success, check_circle icon), Quarantine Items (danger, warning icon). Emit statClick event with stat type ('total', 'pending', 'verified', 'quarantine') on card click. Apply responsive grid (grid-cols-1 md:grid-cols-4). | Restrictions: Use standalone component, import CommonModule and AxKpiCard, make stats input required with Signal<QuickStats> type, use appropriate Material icons, apply color coding per stat type, use TailwindCSS responsive grid classes, emit specific stat types as string literals | \_Leverage: AegisX AxKpiCard, Angular Material icons, TailwindCSS grid, EventEmitter_ | _Requirements: REQ-2 from requirements.md_ | Success: Component displays 4 cards correctly, stats update reactively, click events emit correctly, responsive on mobile/tablet, unit tests pass\_

### 3.2. Create ReturnTableComponent for list display

- [ ] 3.2. Create ReturnTableComponent for list display
  - Files:
    - `apps/admin/src/app/features/drug-returns/components/return-table/return-table.component.ts`
    - `apps/admin/src/app/features/drug-returns/components/return-table/return-table.component.html`
    - `apps/admin/src/app/features/drug-returns/components/return-table/return-table.component.spec.ts`
  - Purpose: Display drug returns in Material table with status badges
  - _Leverage: Angular Material Table, StatusBadgeComponent_
  - _Requirements: REQ-1 Return Dashboard_
  - _Prompt: Implement the task for spec drug-return-frontend-ui, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer with Angular Material expertise | Task: Create standalone ReturnTableComponent with @Input() returns (required, Signal<DrugReturn[]>), @Input() currentUser (Signal<User | null>), @Output() viewReturn EventEmitter. Implement Material table with 7 columns: returnNumber (font-mono, link style), returnDate (format yyyy-MM-dd), department (show dept name), returnReason, status (use StatusBadgeComponent), totalItems, totalAmount (currency format), actions (View Details button, conditionally show Edit/Delete for DRAFT returns if user is creator). Add MatSort, MatPaginator with page sizes [20, 50, 100]. Use computed signal for dataSource. Implement getStatusColor() and getStatusIcon() helpers. | Restrictions: Use standalone component, import MatTableModule/MatSortModule/MatPaginatorModule/StatusBadgeComponent/AxButton, create computed() for dataSource from input signal, display department name, format dates with date pipe, format currency with currency pipe, use status badge component, conditionally show action buttons based on status and currentUser, emit viewReturn event, add hover effect on rows | \_Leverage: Angular Material Table/Sort/Paginator, StatusBadgeComponent, AxButton, computed() API, pipes_ | _Requirements: REQ-1 table from requirements.md_ | Success: Table displays 7 columns correctly, sorting works, pagination functional, status badges colored properly, conditional action buttons work, events emit correctly, responsive, unit tests pass\_

### 3.3. Create StatusBadgeComponent for reusable status display

- [ ] 3.3. Create StatusBadgeComponent for reusable status display
  - Files:
    - `apps/admin/src/app/features/drug-returns/components/status-badge/status-badge.component.ts`
    - `apps/admin/src/app/features/drug-returns/components/status-badge/status-badge.component.spec.ts`
  - Purpose: Reusable component for displaying return status badges
  - _Leverage: AegisX AxBadge component_
  - _Requirements: REQ-1 status display_
  - _Prompt: Implement the task for spec drug-return-frontend-ui, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Create standalone StatusBadgeComponent with @Input() status (required, ReturnStatus type). Implement getVariant() method that returns badge variant based on status: DRAFT='default', SUBMITTED='info', VERIFIED='success', POSTED='primary', CANCELLED='danger'. Implement getIcon() method that returns icon: DRAFT='edit', SUBMITTED='send', VERIFIED='verified', POSTED='check_circle', CANCELLED='cancel'. Template uses ax-badge with variant and icon from computed properties, displays status text. | Restrictions: Use standalone component, import AxBadge, make status input required, type status as ReturnStatus enum, use computed() or method for variant/icon logic, pure presentation component, no business logic | \_Leverage: AegisX AxBadge component, computed() API_ | _Requirements: REQ-1 status badges from requirements.md_ | Success: Badge displays correctly with appropriate color/icon per status, status text shown, reusable across components, unit tests pass\_

### 3.4. Create ReturnItemsTableComponent for items display

- [ ] 3.4. Create ReturnItemsTableComponent for items display
  - Files:
    - `apps/admin/src/app/features/drug-returns/components/return-items-table/return-items-table.component.ts`
    - `apps/admin/src/app/features/drug-returns/components/return-items-table/return-items-table.component.html`
    - `apps/admin/src/app/features/drug-returns/components/return-items-table/return-items-table.component.spec.ts`
  - Purpose: Reusable table for displaying return items with good/damaged quantities
  - _Leverage: Angular Material Table_
  - _Requirements: REQ-4 Return Details View_
  - _Prompt: Implement the task for spec drug-return-frontend-ui, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Create standalone ReturnItemsTableComponent with @Input() items (required, Signal<DrugReturnItem[]>), @Input() showGoodDamaged (optional, boolean, default false). Implement Material table with columns: # (row number), drugName (show trade name + generic name subtitle), lotNumber, expiryDate (yyyy-MM format), totalQuantity (with unit), goodQuantity (if showGoodDamaged), damagedQuantity (if showGoodDamaged), notes. Add computed signal for dataSource. Color-code rows: good_quantity > 0 (green background), damaged_quantity > 0 (orange background). Add footer row with totals. | Restrictions: Use standalone component, import MatTableModule, create computed() for dataSource, conditionally display good/damaged columns based on input, display drug names with subtitle, format dates as yyyy-MM, calculate and display totals in footer, color-code rows based on quantities, make table responsive | \_Leverage: Angular Material Table, computed() API, number/date pipes, TailwindCSS for row colors_ | _Requirements: REQ-4 items table from requirements.md_ | Success: Items display correctly, drug names show with subtitle, conditional columns work, totals calculated accurately, row colors correct, responsive layout, unit tests pass\_

### 3.5. Create AuditTimelineComponent for status history

- [ ] 3.5. Create AuditTimelineComponent for status history
  - Files:
    - `apps/admin/src/app/features/drug-returns/components/audit-timeline/audit-timeline.component.ts`
    - `apps/admin/src/app/features/drug-returns/components/audit-timeline/audit-timeline.component.html`
    - `apps/admin/src/app/features/drug-returns/components/audit-timeline/audit-timeline.component.spec.ts`
  - Purpose: Display drug return status change timeline
  - _Leverage: Material icons, TailwindCSS_
  - _Requirements: REQ-4 audit trail_
  - _Prompt: Implement the task for spec drug-return-frontend-ui, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Create standalone AuditTimelineComponent with @Input() drugReturn (required, Signal<DrugReturn>). Extract timeline events: created (returnNumber, returnBy, createdAt), submitted (timestamp from status change), verified (verifiedBy, verifiedAt), posted (timestamp), cancelled (notes). Display vertical timeline with Material icons (radio_button_unchecked for future, check_circle for completed, cancel for cancelled), connecting lines, timestamp (format 'medium'), user name, action label, notes if present. Color-code events: pending=gray, submitted=blue, verified=green, posted=success, cancelled=red. | Restrictions: Use standalone component, derive timeline from drugReturn fields, display events in chronological order, use Material icons for event types, connect events with vertical line (TailwindCSS borders), format timestamps with date:'medium' pipe, show user who performed action, color-code by status, handle missing events gracefully (show as pending), display notes for cancelled status | \_Leverage: Material icons, TailwindCSS for timeline styling (borders, spacing), date pipe_ | _Requirements: REQ-4 audit trail from requirements.md_ | Success: Timeline displays all events correctly, timestamps formatted, user names shown, visual styling correct, handles missing events, notes displayed for cancelled, unit tests pass\_

### 3.6. Create QuarantineLotsTableComponent for quarantine display

- [ ] 3.6. Create QuarantineLotsTableComponent for quarantine display
  - Files:
    - `apps/admin/src/app/features/drug-returns/components/quarantine-lots-table/quarantine-lots-table.component.ts`
    - `apps/admin/src/app/features/drug-returns/components/quarantine-lots-table/quarantine-lots-table.component.html`
    - `apps/admin/src/app/features/drug-returns/components/quarantine-lots-table/quarantine-lots-table.component.spec.ts`
  - Purpose: Display quarantine lots with disposal status
  - _Leverage: Angular Material Table, MatCheckboxModule_
  - _Requirements: REQ-7 Quarantine Management View_
  - _Prompt: Implement the task for spec drug-return-frontend-ui, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Create standalone QuarantineLotsTableComponent with @Input() lots (required, Signal<QuarantineLot[]>), @Input() selectedLots (required, Signal<Set<string>>), @Output() toggleSelectAll EventEmitter<boolean>, @Output() toggleSelectLot EventEmitter<{lotId: string, checked: boolean}>. Implement Material table with columns: select (checkbox), drugName, lotNumber, quantity, unitCost, totalValue (calculated), expiryDate, daysInQuarantine (calculated), sourceReturn (link), disposalStatus (badge), actions (View Details button). Add MatSort, MatPaginator. Implement master checkbox for select all. Add footer with totals (count, quantity, value). | Restrictions: Use standalone component, import MatTableModule/MatSortModule/MatPaginatorModule/MatCheckboxModule/AxBadge/AxButton, use computed() for dataSource, implement master checkbox with indeterminate state, emit toggle events, calculate totalValue = quantity × unitCost, calculate daysInQuarantine from receivedDate, make sourceReturn clickable link, show disposal status badge, display totals in footer row | \_Leverage: Angular Material Table/Sort/Paginator/Checkbox, AxBadge, AxButton, computed() API, RouterModule for links_ | _Requirements: REQ-7 quarantine table from requirements.md_ | Success: Table displays all columns, checkboxes work correctly, master checkbox has indeterminate state, calculations accurate, links work, totals calculated, unit tests pass\_

---

## Phase 4: Container Components (Week 2-3, Days 3-5 & Days 1-2)

### 4.1. Create ReturnDashboardPage container component

- [ ] 4.1. Create ReturnDashboardPage container component
  - Files:
    - `apps/admin/src/app/features/drug-returns/pages/return-dashboard/return-dashboard.page.ts`
    - `apps/admin/src/app/features/drug-returns/pages/return-dashboard/return-dashboard.page.html`
    - `apps/admin/src/app/features/drug-returns/pages/return-dashboard/return-dashboard.page.spec.ts`
  - Purpose: Main dashboard for viewing all returns with filtering and stats
  - _Leverage: DrugReturnStateService, child components_
  - _Requirements: REQ-1 Return Dashboard, REQ-2 Quick Stats_
  - _Prompt: Implement the task for spec drug-return-frontend-ui, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer with state management expertise | Task: Create standalone ReturnDashboardPage with signals: returns, quickStats (computed), statusFilter ('ALL' default), departmentFilter (null), dateRange ({from, to}), searchTerm, isLoading, currentUser, departments. Implement filteredReturns computed signal that filters by all criteria (status, department, dateRange, searchTerm). Inject DrugReturnStateService, Router, AuthService. Implement ngOnInit() to call loadCurrentUser(), loadReturns(), loadMasterData(), subscribeToRealtimeUpdates(). Implement filter handlers, onCreateReturn() navigates to create page, onViewReturn() navigates to detail, onExportReport() calls state service. Template uses QuickStatsComponent (with statClick handler to set statusFilter), filter section with 4 filters (status dropdown, department dropdown, date range picker, search input), ReturnTableComponent, loading skeleton, Create Return button if user has permission. | Restrictions: Use standalone component, implement OnInit/OnDestroy, use signal() for state, computed() for filteredReturns and quickStats, inject services via constructor, use takeUntilDestroyed() for subscriptions, navigate with Router, implement calculateStats() helper, handle WebSocket updates with handleReturnUpdate() to update signal, show AxSkeleton while loading, conditionally show Create button based on AuthService.hasPermission('drug_return.create'), apply filter changes reactively | \_Leverage: DrugReturnStateService, QuickStatsComponent, ReturnTableComponent, Router, AuthService, AxSelect, AxInput, AxDateRangePicker, AxButton, AxSkeleton_ | _Requirements: REQ-1, REQ-2, REQ-12 from requirements.md_ | Success: Dashboard displays return list, all 4 filters work correctly, stats update reactively, navigation works, real-time updates applied, export functional, permission-based Create button, unit tests pass\_

### 4.2. Create CreateReturnPage container component

- [ ] 4.2. Create CreateReturnPage container component
  - Files:
    - `apps/admin/src/app/features/drug-returns/pages/create-return/create-return.page.ts`
    - `apps/admin/src/app/features/drug-returns/pages/create-return/create-return.page.html`
    - `apps/admin/src/app/features/drug-returns/pages/create-return/create-return.page.spec.ts`
  - Purpose: Form for creating new drug return request with multiple items
  - _Leverage: ReactiveFormsModule, DrugReturnStateService_
  - _Requirements: REQ-3 Create Return Form_
  - _Prompt: Implement the task for spec drug-return-frontend-ui, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer with Angular Forms expertise | Task: Create standalone CreateReturnPage with ReactiveForm: returnForm (departmentId, toLocationId, returnDate, returnBy, returnReason, notes, items: FormArray). Use signals: departments, locations, returnReasons, users, availableDrugs, availableLotsForDrug (per item), isLoading, isSaving. Inject FormBuilder, DrugReturnStateService, Router, AuthService, NotificationService. Implement ngOnInit() to load master data and prefill defaults (current user dept, Central Pharmacy, today's date, current user). Implement createReturnForm(), createItemFormGroup(). For each item: drug selector triggers loadLotsForDrug(), lot selector auto-fills expiry/unit/availableQuantity and adds max validator. Implement onAddItem(), onRemoveItem(), onSaveDraft() (status=DRAFT), onSubmitReturn() (status=SUBMITTED), validateForm(), onCancel(). Template uses AxForm, AxInput, AxSelect, AxDatepicker, AxTextarea, AxRadioGroup for condition, AxButton, table for items with Add/Remove buttons. | Restrictions: Use standalone component, use ReactiveFormsModule, create FormGroup with validators (required, min for quantities), implement FormArray for items with min 1 item, watch valueChanges to trigger API calls, auto-fill fields from selected lot, validate return quantity <= available quantity, call DrugReturnStateService.createDrugReturn(), navigate on success, show NotificationService toasts, confirm on cancel if form dirty | \_Leverage: ReactiveFormsModule, FormBuilder, DrugReturnStateService, Router, AuthService, NotificationService, AxForm, AxInput, AxSelect, AxDatepicker, AxTextarea, AxButton_ | _Requirements: REQ-3 complete create form from requirements.md_ | Success: Form displays correctly, master data loaded, prefill works, item add/remove works, lot selection auto-fills, validation correct, save draft works, submit works, navigation correct, notifications shown, unit tests pass\_

### 4.3. Create ReturnDetailPage container component

- [ ] 4.3. Create ReturnDetailPage container component
  - Files:
    - `apps/admin/src/app/features/drug-returns/pages/return-detail/return-detail.page.ts`
    - `apps/admin/src/app/features/drug-returns/pages/return-detail/return-detail.page.html`
    - `apps/admin/src/app/features/drug-returns/pages/return-detail/return-detail.page.spec.ts`
  - Purpose: Display drug return details with workflow action buttons
  - _Leverage: DrugReturnApiService, dialog components_
  - _Requirements: REQ-4 Return Details View, REQ-6 Post Return Confirmation_
  - _Prompt: Implement the task for spec drug-return-frontend-ui, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Create standalone ReturnDetailPage with signals: returnId, drugReturn, isLoading, errorMessage. Implement computed signals for button visibility: canEdit (status=DRAFT && user is creator), canSubmit (status=DRAFT && user is creator), canDelete (status=DRAFT && user is creator), canVerify (status=SUBMITTED && has permission 'drug_return.verify'), canPost (status=VERIFIED && has permission 'drug_return.verify'). Inject ActivatedRoute, Router, DrugReturnApiService, AuthService, MatDialog, NotificationService. Get id from route params, load drugReturn in ngOnInit(), subscribe to WebSocket updates. Implement action handlers: onEdit() navigates to edit page (future), onSubmit() calls submitReturn API, onDelete() confirms and calls deleteDrugReturn API, onVerify() navigates to verify page, onPost() opens PostReturnConfirmationDialog, onBack() navigates to dashboard. Template displays return info in cards (Return Information, Items Table with ReturnItemsTableComponent showGoodDamaged=true if verified, Audit Timeline), StatusBadgeComponent, action buttons conditionally shown. | Restrictions: Use standalone component, get route param with ActivatedRoute, inject all required services, use computed() for button visibility based on status and permissions, check permissions with AuthService.hasPermission(), open PostConfirmationDialog with MatDialog width 800px, handle dialog afterClosed() to reload return, display loading state with AxSkeleton, show error AxAlert if load fails, conditionally render action buttons based on computed signals, use AxCard for sections | \_Leverage: ActivatedRoute, Router, DrugReturnApiService, MatDialog, AuthService, NotificationService, StatusBadgeComponent, ReturnItemsTableComponent, AuditTimelineComponent, PostReturnConfirmationDialog, AxCard, AxButton, AxAlert, AxSkeleton_ | _Requirements: REQ-4, REQ-6 complete detail view and post confirmation from requirements.md_ | Success: Detail page displays all info correctly, action buttons shown based on status/permissions, dialogs open correctly, data reloads after actions, navigation works, WebSocket updates applied, error handling works, unit tests pass\_

### 4.4. Create VerifyReturnPage container component

- [ ] 4.4. Create VerifyReturnPage container component
  - Files:
    - `apps/admin/src/app/features/drug-returns/pages/verify-return/verify-return.page.ts`
    - `apps/admin/src/app/features/drug-returns/pages/verify-return/verify-return.page.html`
    - `apps/admin/src/app/features/drug-returns/pages/verify-return/verify-return.page.spec.ts`
  - Purpose: Pharmacist verification form with good/damaged separation
  - _Leverage: ReactiveFormsModule, DrugReturnStateService_
  - _Requirements: REQ-5 Verify Return Form_
  - _Prompt: Implement the task for spec drug-return-frontend-ui, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer with complex form validation expertise | Task: Create standalone VerifyReturnPage with signals: returnId, drugReturn, isLoading, isSaving. Create ReactiveForm: verificationForm (verifiedBy, verifiedDate, verificationNotes, items: FormArray). For each item FormGroup: itemId, drugName (disabled), lotNumber (disabled), expiryDate (disabled), claimedQuantity (disabled), actualQuantity (required, min 0), goodQuantity (required, min 0), damagedQuantity (required, min 0), itemNotes. Inject FormBuilder, ActivatedRoute, Router, DrugReturnApiService, AuthService, NotificationService. Get returnId from route params, load drugReturn, check status=SUBMITTED (else navigate back with error). Populate form with items. Implement custom validator validateQuantities() that ensures goodQuantity + damagedQuantity = actualQuantity for each item (real-time validation on valueChanges). Compute totalGoodQuantity and totalDamagedQuantity. Implement onRejectReturn() (confirm + API call), onSaveProgress() (API call, keep status SUBMITTED), onCompleteVerification() (validate all items + API call). Template displays return info (read-only), verification form with items table (editable actual/good/damaged fields with inline validation errors), action buttons (Reject, Save Progress, Complete Verification). | Restrictions: Use standalone component, get route param, check status before showing form, use ReactiveFormsModule with FormArray, implement custom validator for quantity validation (good + damaged = actual), watch valueChanges to trigger validation, display inline validation errors with red border and message, disable Complete button if any validation errors, prefill verifiedBy with current user, call DrugReturnApiService.verifyReturn(), navigate on success, show notifications | \_Leverage: ReactiveFormsModule, FormBuilder, ActivatedRoute, Router, DrugReturnApiService, AuthService, NotificationService, custom validators, AxForm, AxInput, AxTextarea, AxButton, AxAlert_ | _Requirements: REQ-5 complete verify form from requirements.md_ | Success: Verification form displays, validation works in real-time, good+damaged=actual enforced, buttons work correctly, reject/save/complete API calls succeed, navigation correct, notifications shown, unit tests pass with validation scenarios\_

### 4.5. Create QuarantineManagementPage container component

- [ ] 4.5. Create QuarantineManagementPage container component
  - Files:
    - `apps/admin/src/app/features/drug-returns/pages/quarantine-management/quarantine-management.page.ts`
    - `apps/admin/src/app/features/drug-returns/pages/quarantine-management/quarantine-management.page.html`
    - `apps/admin/src/app/features/drug-returns/pages/quarantine-management/quarantine-management.page.spec.ts`
  - Purpose: View and manage quarantine lots, schedule disposals
  - _Leverage: DrugReturnStateService, dialog components_
  - _Requirements: REQ-7 Quarantine Management View, REQ-8 Schedule Disposal Dialog_
  - _Prompt: Implement the task for spec drug-return-frontend-ui, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Create standalone QuarantineManagementPage with signals: quarantineLots, selectedLots (Set<string>), quickStats (computed: totalItems, totalValue, pendingDisposal, disposedThisMonth), disposalStatusFilter ('ALL'), dateRange ({from, to}), isLoading. Implement filteredLots computed signal that filters by disposalStatus and dateRange. Inject DrugReturnStateService, MatDialog, NotificationService. Load quarantine lots in ngOnInit(), subscribe to WebSocket quarantineUpdates$. Implement onDisposalStatusFilterChange(), onDateRangeChange(), onToggleSelectAll(), onToggleSelectLot(), onScheduleDisposal() (opens ScheduleDisposalDialog with selected lots). Template uses QuickStatsComponent (quarantine stats variant), filter section (disposal status dropdown, date range picker), QuarantineLotsTableComponent with selection, bulk actions section (Select All checkbox, Schedule Disposal button enabled if selectedLots.size > 0). | Restrictions: Use standalone component, implement OnInit/OnDestroy, use signal() for state, computed() for filteredLots and quickStats, inject services, use takeUntilDestroyed() for subscriptions, open ScheduleDisposalDialog with MatDialog width 800px passing selectedLotIds and lots array, handle afterClosed() to clear selection and reload data, show notification if no lots selected, calculate stats from lots signal (count, sum of value, filter by disposalStatus and date) | \_Leverage: DrugReturnStateService, QuickStatsComponent, QuarantineLotsTableComponent, ScheduleDisposalDialog, MatDialog, NotificationService, AxSelect, AxDateRangePicker, AxButton, AxCheckbox_ | _Requirements: REQ-7, REQ-8 from requirements.md_ | Success: Quarantine page displays lots, filters work, stats calculated correctly, selection works, bulk actions functional, dialog opens with correct data, disposal scheduled successfully, unit tests pass\_

### 4.6. Create ReturnAnalyticsPage container component

- [ ] 4.6. Create ReturnAnalyticsPage container component
  - Files:
    - `apps/admin/src/app/features/drug-returns/pages/return-analytics/return-analytics.page.ts`
    - `apps/admin/src/app/features/drug-returns/pages/return-analytics/return-analytics.page.html`
    - `apps/admin/src/app/features/drug-returns/pages/return-analytics/return-analytics.page.spec.ts`
  - Purpose: Display return analytics and trends with charts
  - _Leverage: DrugReturnApiService, Chart.js or similar_
  - _Requirements: REQ-10 Return Analytics Dashboard_
  - _Prompt: Implement the task for spec drug-return-frontend-ui, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer with data visualization expertise | Task: Create standalone ReturnAnalyticsPage with signals: analytics (kpis, chartData), dateRange ({from: last 6 months, to: today}), departmentFilter (null), returnReasonFilter (null), isLoading. Inject DrugReturnApiService. Call getAnalytics() API with filters in ngOnInit() and on filter changes. Display KPI cards (Total Returns This Month, Good Return Rate %, Damaged Value, Avg Processing Time in days). Implement charts using Chart.js or ng2-charts: Returns by Reason (pie chart), Returns Trend (line chart, last 6 months), Top Departments by Return Count (bar chart), Good vs Damaged Quantities (stacked bar chart). Implement filter section (date range picker, department dropdown, return reason dropdown). Implement onExportReport() to download Excel with summary, returns list, chart data sheets. Implement chart click handlers for drill-down (pie segment click filters by reason, bar click filters by department). | Restrictions: Use standalone component, fetch analytics from DrugReturnApiService.getAnalytics(), use Chart.js or ng2-charts library for charts, display 4 KPI cards, implement 4 charts with proper configuration (labels, colors, tooltips, legends), implement filter controls that trigger data reload, use debounceTime(300) on filter changes, implement Excel export with XLSX library (multiple sheets), implement chart interaction (onClick to drill down and update filters), show loading state, handle errors | \_Leverage: DrugReturnApiService.getAnalytics(), Chart.js or ng2-charts, AxKpiCard, AxDateRangePicker, AxSelect, AxButton, xlsx library, RxJS debounceTime_ | _Requirements: REQ-10 complete analytics from requirements.md_ | Success: Analytics page displays KPIs and charts correctly, filters trigger data reload, charts render with proper styling, drill-down interactions work, export downloads Excel with multiple sheets, unit tests pass\_

---

## Phase 5: Dialog Components (Week 3, Days 3-5)

### 5.1. Create PostReturnConfirmationDialog component

- [ ] 5.1. Create PostReturnConfirmationDialog component
  - Files:
    - `apps/admin/src/app/features/drug-returns/dialogs/post-confirmation/post-confirmation.dialog.ts`
    - `apps/admin/src/app/features/drug-returns/dialogs/post-confirmation/post-confirmation.dialog.html`
    - `apps/admin/src/app/features/drug-returns/dialogs/post-confirmation/post-confirmation.dialog.spec.ts`
  - Purpose: Confirmation dialog before posting return to inventory with preview
  - _Leverage: MatDialog, DrugReturnApiService_
  - _Requirements: REQ-6 Post Return Confirmation_
  - _Prompt: Implement the task for spec drug-return-frontend-ui, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer with dialog expertise | Task: Create standalone PostReturnConfirmationDialog with @Inject(MAT_DIALOG_DATA) data: { returnId, drugReturn }. Use signals: isPosting. Display summary section (Total Good Quantity, Total Damaged Quantity from drugReturn.items), Inventory Changes Preview table (Drug, Location, Current Stock, Good Qty, New Stock = Current + Good), Quarantine Lots table (Drug, Lot Number, Damaged Qty, Quarantine Location), Warnings section (if any damaged items: "⚠️ X items will be moved to quarantine for disposal"). Inject DrugReturnApiService, MatDialogRef, NotificationService. Implement onConfirm() that calls postReturn API, shows loading, closes dialog with result on success. Implement onCancel() that closes dialog. Template displays all sections, Cancel and Confirm buttons (Confirm disabled while posting). | Restrictions: Use standalone component, import MatDialogModule, inject MAT_DIALOG_DATA and MatDialogRef, calculate totals from drugReturn.items (sum good_quantity, sum damaged_quantity), display preview tables, show warning if damaged > 0, disable confirm button while posting, call DrugReturnApiService.postReturn(returnId), close dialog with { success: true } on success, handle errors and show notification, keep dialog open on error | \_Leverage: DrugReturnApiService.postReturn(), MatDialog/MatDialogRef/MAT_DIALOG_DATA, NotificationService, AxButton, AxAlert, Material Table for preview_ | _Requirements: REQ-6 from requirements.md_ | Success: Dialog opens with correct data, summary calculated accurately, preview tables display correctly, warnings shown if applicable, confirm posts successfully, dialog closes with result, errors handled, unit tests pass\_

### 5.2. Create ScheduleDisposalDialog component

- [ ] 5.2. Create ScheduleDisposalDialog component
  - Files:
    - `apps/admin/src/app/features/drug-returns/dialogs/schedule-disposal/schedule-disposal.dialog.ts`
    - `apps/admin/src/app/features/drug-returns/dialogs/schedule-disposal/schedule-disposal.dialog.html`
    - `apps/admin/src/app/features/drug-returns/dialogs/schedule-disposal/schedule-disposal.dialog.spec.ts`
  - Purpose: Dialog for scheduling disposal with committee assignment
  - _Leverage: MatDialog, ReactiveFormsModule, DisposalApiService_
  - _Requirements: REQ-8 Schedule Disposal Dialog_
  - _Prompt: Implement the task for spec drug-return-frontend-ui, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Create standalone ScheduleDisposalDialog with @Inject(MAT_DIALOG_DATA) data: { selectedLotIds: string[], lots: QuarantineLot[] }. Create ReactiveForm: disposalForm (disposalDate default today, disposalMethod dropdown with options: Incineration/Chemical Destruction/Return to Vendor/Landfill/Other, committeeMembers multi-select with min 3 required, notes textarea optional). Use signals: users (for committee selector), isSubmitting. Inject FormBuilder, DisposalApiService, MatDialogRef, NotificationService. Load users in ngOnInit(). Display Selected Items Summary (count, total quantity, total value, preview table: Drug, Lot, Quantity). Implement form validation (committeeMembers must have min 3 selected). Implement onSchedule() that validates, calls createDisposal API, closes with result. Template displays summary, form fields, Cancel and Schedule buttons (Schedule disabled if invalid or submitting). | Restrictions: Use standalone component, import MatDialogModule and ReactiveFormsModule, inject MAT_DIALOG_DATA, create FormGroup with validators (required, custom minLength(3) for committeeMembers array), calculate summary from lots input, disable Schedule button if form invalid, call DisposalApiService.createDisposal(), close with { success: true } on success, show notification, handle errors | \_Leverage: DisposalApiService.createDisposal(), ReactiveFormsModule, MatDialog/MatDialogRef/MAT_DIALOG_DATA, NotificationService, AxForm, AxDatepicker, AxSelect, AxMultiSelect, AxTextarea, AxButton, Material Table_ | _Requirements: REQ-8 from requirements.md_ | Success: Dialog opens with selected lots, summary calculated, form validation works (min 3 committee), disposal scheduled successfully, dialog closes with result, errors handled, unit tests pass\_

### 5.3. Create CompleteDisposalDialog component

- [ ] 5.3. Create CompleteDisposalDialog component
  - Files:
    - `apps/admin/src/app/features/drug-returns/dialogs/complete-disposal/complete-disposal.dialog.ts`
    - `apps/admin/src/app/features/drug-returns/dialogs/complete-disposal/complete-disposal.dialog.html`
    - `apps/admin/src/app/features/drug-returns/dialogs/complete-disposal/complete-disposal.dialog.spec.ts`
  - Purpose: Dialog for completing disposal with photo evidence and signatures
  - _Leverage: MatDialog, ReactiveFormsModule, AttachmentService_
  - _Requirements: REQ-9 Complete Disposal Form_
  - _Prompt: Implement the task for spec drug-return-frontend-ui, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Create standalone CompleteDisposalDialog with @Inject(MAT_DIALOG_DATA) data: { disposal: Disposal }. Create ReactiveForm: completionForm (actualDisposalDate default today, disposalLocation text input, photoEvidence file upload multiple (min 1, max 10, accept jpg/png/pdf, max 10MB each), committeeSignatures FormGroup with checkbox for each committee member all required, completionNotes textarea). Use signals: uploadedPhotos (array of {file, preview, uploading}), isCompleting. Inject FormBuilder, DisposalApiService, AttachmentService, MatDialogRef, NotificationService. Display Disposal Information (read-only: disposal date, method, committee members), Items Being Disposed table (Drug, Lot, Quantity, Expiry). Implement photo upload: onFileSelect() validates file type/size, uploads via AttachmentService, adds to uploadedPhotos signal with preview. Implement form validation (min 1 photo, all committee members must sign). Implement onComplete() that validates, calls completeDisposal API with photo URLs, closes with result. Template displays disposal info, items table, completion form, photo upload section with previews and remove buttons, committee signatures checkboxes, Cancel and Complete buttons (Complete disabled if invalid or completing). | Restrictions: Use standalone component, import MatDialogModule/ReactiveFormsModule/MatCheckboxModule, inject MAT_DIALOG_DATA, create FormGroup with custom validators (min 1 photo, all signatures required), validate file uploads (type: jpg/png/pdf, size: max 10MB), upload photos via AttachmentService.upload() to get URLs, display photo previews with thumbnails, implement remove photo, disable Complete if form invalid or any photo uploading, call DisposalApiService.completeDisposal(disposalId, { actualDisposalDate, disposalLocation, photoEvidence: photoUrls, committeeSignatures, completionNotes }), close with result, handle errors | \_Leverage: DisposalApiService.completeDisposal(), AttachmentService.upload(), ReactiveFormsModule, MatDialog/MatDialogRef/MAT_DIALOG_DATA, MatCheckboxModule, NotificationService, AxForm, AxDatepicker, AxInput, AxTextarea, AxButton, AxFileUpload or custom file input_ | _Requirements: REQ-9 from requirements.md_ | Success: Dialog opens with disposal data, photo upload works with validation and previews, all committee signatures required, disposal completed successfully with photos, dialog closes with result, errors handled, unit tests pass\_

### 5.4. Create LotPreviewDialog component (optional)

- [ ] 5.4. Create LotPreviewDialog component (optional)
  - Files:
    - `apps/admin/src/app/features/drug-returns/dialogs/lot-preview/lot-preview.dialog.ts`
    - `apps/admin/src/app/features/drug-returns/dialogs/lot-preview/lot-preview.dialog.html`
    - `apps/admin/src/app/features/drug-returns/dialogs/lot-preview/lot-preview.dialog.spec.ts`
  - Purpose: Dialog to preview lot details when creating return
  - _Leverage: MatDialog, DrugReturnStateService_
  - _Requirements: REQ-3 Create Return Form (lot preview)_
  - _Prompt: Implement the task for spec drug-return-frontend-ui, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Create standalone LotPreviewDialog with @Inject(MAT_DIALOG_DATA) data: { drugId, departmentId }. Use signals: lots, isLoading. Inject DrugReturnStateService, MatDialogRef. Load lots for drug and department in ngOnInit() via DrugReturnStateService.fetchLotsForDrug(). Display Material table with columns: Lot Number, Quantity Available, Expiry Date, Days Until Expiry, Location. Color-code by expiry status (<30=danger, 30-90=warning, 90-180=info, >180=success). Add Close button. | Restrictions: Use standalone component, import MatDialogModule, inject MAT_DIALOG_DATA, fetch lots on init, display table with color-coded rows based on days until expiry, show loading state, display error if load fails, close button calls dialogRef.close() | \_Leverage: DrugReturnStateService.fetchLotsForDrug(), MatDialog/MatDialogRef/MAT_DIALOG_DATA, Material Table, AxButton, AxBadge for status_ | _Requirements: REQ-3 lot preview from requirements.md_ | Success: Dialog opens and loads lots, table displays correctly, color coding accurate, close button works, error handling, unit tests pass\_

### 5.5. Create ReasonManagementDialog component (admin only)

- [ ] 5.5. Create ReasonManagementDialog component (admin only)
  - Files:
    - `apps/admin/src/app/features/drug-returns/dialogs/reason-management/reason-management.dialog.ts`
    - `apps/admin/src/app/features/drug-returns/dialogs/reason-management/reason-management.dialog.html`
    - `apps/admin/src/app/features/drug-returns/dialogs/reason-management/reason-management.dialog.spec.ts`
  - Purpose: Dialog for managing return reason master data (admin)
  - _Leverage: MatDialog, ReactiveFormsModule, DrugReturnApiService_
  - _Requirements: REQ-11 Return Reason Master Data_
  - _Prompt: Implement the task for spec drug-return-frontend-ui, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Create standalone ReasonManagementDialog. Use signals: returnReasons, isLoading, editingReason (null or ReturnReason). Inject DrugReturnApiService, MatDialogRef, NotificationService. Load return reasons in ngOnInit(). Display Material table with columns: Reason Code, Reason Description, Is Active, Created Date, Actions (Edit, Deactivate/Activate buttons). Implement form section (shows when Add clicked or Edit clicked): ReactiveForm with fields reasonCode, reasonDescription, isActive checkbox. Implement onAdd() (shows form), onEdit(reason) (populates form with reason), onSave() (validates, calls create or update API), onDeactivate(reason) (confirms, calls update with isActive=false API), onActivate(reason) (calls update with isActive=true API), onCancel() (hides form). Template displays table, form section (conditional), Add Reason button, Close button. | Restrictions: Use standalone component, import MatDialogModule/ReactiveFormsModule, use MatTable, create FormGroup with validators (required for code and description), call DrugReturnApiService methods for CRUD (createReturnReason, updateReturnReason), show/hide form based on editingReason signal, confirm before deactivate, show notifications on success/error, reload reasons after save/deactivate/activate | \_Leverage: DrugReturnApiService (return reason endpoints), ReactiveFormsModule, MatDialog/MatDialogRef, MatTable, NotificationService, AxForm, AxInput, AxCheckbox, AxButton_ | _Requirements: REQ-11 from requirements.md_ | Success: Dialog displays reasons table, form shows/hides correctly, add/edit/deactivate/activate work, validations correct, API calls succeed, notifications shown, unit tests pass\_

---

## Phase 6: Testing & Documentation (Week 4)

### 6.1. Write unit tests for all services

- [ ] 6.1. Write unit tests for all services
  - Files:
    - All `*.service.spec.ts` files
  - Purpose: Ensure 80%+ unit test coverage for services
  - _Leverage: Jasmine, Karma, HttpTestingController_
  - _Requirements: All service requirements_
  - _Prompt: Implement the task for spec drug-return-frontend-ui, first run spec-workflow-guide to get the workflow guide then implement the task: Role: QA Engineer with Angular testing expertise | Task: Write comprehensive unit tests for DrugReturnApiService, DisposalApiService, DrugReturnWebSocketService, DrugReturnStateService. For API services: mock HttpClient with HttpTestingController, test all methods (success and error cases), verify HTTP method/URL/body/params, verify response mapping. For WebSocket service: mock WebSocket, test connect/disconnect/reconnect logic, verify event routing to correct Subjects, test connection status changes. For State service: test signal updates, computed signal calculations, WebSocket event handlers, export functions. Target 80%+ code coverage. | Restrictions: Use Jasmine/Karma framework, import HttpClientTestingModule for API services, mock WebSocket constructor for WebSocket service, test all public methods, test error scenarios, verify signal updates are immutable, verify computed signals recalculate correctly, use TestBed for service instantiation, clean up subscriptions in afterEach | \_Leverage: Jasmine, Karma, HttpClientTestingModule, HttpTestingController, jasmine.createSpy for mocks_ | _Requirements: All service specifications from design.md_ | Success: All service methods tested, success and error cases covered, HTTP calls verified, WebSocket logic tested, signal updates tested, 80%+ coverage achieved, tests pass in CI\_

### 6.2. Write unit tests for all components

- [ ] 6.2. Write unit tests for all components
  - Files:
    - All `*.component.spec.ts` files
  - Purpose: Ensure 80%+ unit test coverage for components
  - _Leverage: Jasmine, Karma, ComponentFixture_
  - _Requirements: All component requirements_
  - _Prompt: Implement the task for spec drug-return-frontend-ui, first run spec-workflow-guide to get the workflow guide then implement the task: Role: QA Engineer | Task: Write comprehensive unit tests for all presentation and container components (QuickStatsComponent, ReturnTableComponent, StatusBadgeComponent, ReturnItemsTableComponent, AuditTimelineComponent, QuarantineLotsTableComponent, all page components). Test component rendering, input signal updates trigger re-render, output events emit correctly, computed signals calculate correctly, user interactions (button clicks, filter changes), conditional rendering (permissions, status), form validation (CreateReturnPage, VerifyReturnPage). Mock all dependencies (services, dialogs, router). Target 80%+ coverage. | Restrictions: Use ComponentFixture, TestBed, compile components with TestBed.createComponent(), use ComponentFixture.detectChanges() to trigger change detection, mock services with jasmine.createSpyObj, test @Input() by setting signal values, test @Output() by subscribing to EventEmitter, test computed() by verifying calculated values, test conditional rendering with fixture.nativeElement.querySelector, test form validation by setting control values and checking errors, verify router navigation with Router spy, verify dialog opening with MatDialog spy | \_Leverage: Jasmine, Karma, TestBed, ComponentFixture, DebugElement, jasmine.createSpyObj for service mocks_ | _Requirements: All component requirements from requirements.md_ | Success: All components tested, inputs/outputs verified, computed signals tested, user interactions tested, conditional rendering tested, form validation tested, 80%+ coverage, tests pass\_

### 6.3. Write integration tests for critical workflows

- [ ] 6.3. Write integration tests for critical workflows
  - Files:
    - `apps/admin/src/app/features/drug-returns/integration-tests/*.spec.ts`
  - Purpose: Test end-to-end user workflows with real component integration
  - _Leverage: Jasmine, HttpTestingController, ComponentFixture_
  - _Requirements: All workflow requirements_
  - _Prompt: Implement the task for spec drug-return-frontend-ui, first run spec-workflow-guide to get the workflow guide then implement the task: Role: QA Engineer with integration testing expertise | Task: Write integration tests for 4 critical workflows: (1) Create Return → Submit → Verify → Post (complete cycle), (2) Create Return → Submit → Reject (rejection flow), (3) Quarantine Lot → Schedule Disposal → Complete Disposal (disposal workflow), (4) Return Analytics → Filter → Drill Down → Export (analytics workflow). For each workflow: set up test with real components and mocked HTTP/WebSocket, simulate user actions (fill form, click buttons), verify state changes, verify API calls made with correct data, verify navigation, verify notifications shown. Mock backend responses. | Restrictions: Use Jasmine for integration tests, set up TestBed with real components and mocked services (HttpTestingController for HTTP, spy for WebSocket), simulate user interactions with ComponentFixture (setValue on inputs, click on buttons), use tick() and flush() for async operations, verify HTTP requests with expectOne(), verify navigation with Router spy, verify MatDialog.open() called, verify NotificationService.show() called, verify state updates in services, test happy path and error scenarios for each workflow | \_Leverage: Jasmine, TestBed, HttpTestingController, ComponentFixture, fakeAsync/tick/flush for async testing_ | _Requirements: REQ-3 to REQ-9 workflow requirements from requirements.md_ | Success: All 4 workflows tested end-to-end, user actions simulated, state changes verified, API calls verified, navigation verified, notifications verified, error scenarios tested, tests pass consistently\_

### 6.4. Setup E2E tests with Playwright or Cypress

- [ ] 6.4. Setup E2E tests with Playwright or Cypress
  - Files:
    - `apps/admin-e2e/src/drug-returns/*.spec.ts` (or Playwright equivalent)
  - Purpose: Automated end-to-end testing of drug return workflows in real browser
  - _Leverage: Playwright or Cypress framework_
  - _Requirements: All user journey requirements_
  - _Prompt: Implement the task for spec drug-return-frontend-ui, first run spec-workflow-guide to get the workflow guide then implement the task: Role: QA Automation Engineer | Task: Set up E2E testing framework (Playwright or Cypress) for drug return feature. Write E2E tests for: (1) Ward Staff: Login → Navigate to Drug Returns → Create Return → Add Items → Submit → Verify Submitted Status, (2) Pharmacist: Login → View Pending Returns → Open Return → Verify Return (separate good/damaged) → Post to Inventory → Verify Posted Status, (3) Disposal Committee: Login → View Quarantine → Select Lots → Schedule Disposal → Complete Disposal with Photo Upload → Verify Disposal Completed. Test on Chrome, Firefox, Safari. Use page object model pattern for maintainability. | Restrictions: Choose Playwright or Cypress, configure test framework in workspace, create page objects for reusable selectors/actions (LoginPage, ReturnDashboardPage, CreateReturnPage, VerifyReturnPage, QuarantineManagementPage), write test specs that import page objects, use data-testid attributes for stable selectors, run against local development server, seed test database with known data, clean up test data after each test, run tests in headless mode in CI, take screenshots on failure, generate HTML test report | \_Leverage: Playwright or Cypress framework, page object model pattern, test database seeding_ | _Requirements: All user journeys from requirements.md_ | Success: E2E framework configured, page objects created, 3 complete user journeys tested, tests run in multiple browsers, tests pass consistently, screenshots captured on failure, HTML report generated\_

### 6.5. Create component documentation with Storybook (optional)

- [ ] 6.5. Create component documentation with Storybook (optional)
  - Files:
    - `*.stories.ts` files for presentation components
  - Purpose: Document reusable components with interactive examples
  - _Leverage: Storybook for Angular_
  - _Requirements: REQ-20 Component Reusability_
  - _Prompt: Implement the task for spec drug-return-frontend-ui, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer with documentation expertise | Task: Set up Storybook for Angular in workspace. Create stories for all presentation components (QuickStatsComponent, ReturnTableComponent, StatusBadgeComponent, ReturnItemsTableComponent, AuditTimelineComponent, QuarantineLotsTableComponent). For each component: create default story, create stories for all variations (different statuses, with/without data, loading states, error states), add controls for inputs (Args), add actions for outputs (actions), add JSDoc documentation. Configure Storybook with AegisX UI theme. | Restrictions: Install @storybook/angular, configure .storybook/main.js and preview.js, create \*.stories.ts files using CSF (Component Story Format), export default meta with component/title/tags, export stories as const (Default, WithData, Loading, Error, etc.), use args for input props, use argTypes for controls, use play function for interactions if needed, configure AegisX theme in preview.js, run storybook with npm run storybook | \_Leverage: Storybook for Angular, CSF format, Args/ArgTypes, Actions addon_ | _Requirements: REQ-20 component reusability and documentation_ | Success: Storybook configured, stories created for all presentation components, variations documented, controls work, actions log events, documentation clear, builds and runs successfully\_

### 6.6. Write user documentation and README

- [ ] 6.6. Write user documentation and README
  - Files:
    - `apps/admin/src/app/features/drug-returns/README.md`
    - `docs/features/drug-returns/USER_GUIDE.md` (optional)
  - Purpose: Provide developer and user documentation
  - _Leverage: Markdown_
  - _Requirements: All features_
  - _Prompt: Implement the task for spec drug-return-frontend-ui, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Technical Writer | Task: Create README.md for drug-returns feature module with sections: Overview (purpose, features), Architecture (diagram, tech stack), Getting Started (setup, run dev), Project Structure (folder layout), Key Components (list with descriptions), Services (list with responsibilities), User Workflows (step-by-step guides for Ward Staff, Pharmacist, Disposal Committee), Testing (how to run unit/integration/E2E tests), Troubleshooting (common issues and solutions), Contributing (code style, PR process). Optionally create USER_GUIDE.md with screenshots and detailed user instructions for each role. | Restrictions: Use markdown format, include code examples for key patterns, add mermaid diagrams for architecture, use relative links for internal references, keep concise but comprehensive, use headers for navigation, add table of contents, include screenshots if creating USER_GUIDE | \_Leverage: Markdown, Mermaid for diagrams, screenshot tools_ | _Requirements: All specifications from requirements.md and design.md_ | Success: README.md created with all sections, architecture documented, workflows explained, testing documented, clear and readable, USER*GUIDE.md created (if applicable) with screenshots and step-by-step instructions*

---

## Testing Checklist

Before marking spec as complete, verify:

- All 35 tasks completed and tested
- Test coverage >80% (unit tests)
- All critical workflows tested (integration tests)
- E2E tests pass for all user journeys
- All components render correctly without errors
- Real-time WebSocket updates work
- Form validation enforces business rules (good + damaged = total)
- Permission-based access control works
- Export functionality generates correct files
- Photo upload works with file validation
- Responsive design works on mobile/tablet
- Accessibility tested (keyboard navigation, screen reader)
- No console errors or warnings
- Performance acceptable (dashboard loads <2s)
- Documentation complete

---

## Notes

- **Estimated Total Effort**: 160-200 hours (4-5 weeks with 1 developer)
- **Dependencies**: Requires drug-return-backend-api to be implemented first
- **Critical Path**: Phase 1-2 (setup, services) → Phase 3-4 (components, pages) → Phase 5 (dialogs) → Phase 6 (testing)
- **Parallel Work**: Presentation components (Phase 3) can be built in parallel once services (Phase 2) are complete
- **Testing**: Unit tests written alongside each task, integration tests in Phase 6, E2E tests after all features complete
