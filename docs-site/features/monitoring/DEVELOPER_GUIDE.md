---
title: Activity Tracking System - Developer Guide
---

<div v-pre>

# Activity Tracking System - Developer Guide

## Overview

This guide provides comprehensive technical documentation for developers working with the Activity Tracking System. It covers the system architecture, implementation details, extension patterns, and best practices for maintaining and extending the feature.

## System Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Angular)     │    │   (Fastify)     │    │   (PostgreSQL)  │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ Activity Log    │◄──►│ Activity        │◄──►│ user_activity   │
│ Component       │    │ Controller      │    │ _logs table     │
│                 │    │                 │    │                 │
│ Activity Stats  │    │ Activity        │    │ Indexes &       │
│ Component       │    │ Service         │    │ Functions       │
│                 │    │                 │    │                 │
│ Activity Filter │    │ Activity        │    │ Cleanup Jobs    │
│ Component       │    │ Repository      │    │                 │
│                 │    │                 │    │                 │
│ Activity        │    │ Activity        │    │                 │
│ Service         │    │ Middleware      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Component Interaction Flow

```
┌───────────┐     ┌──────────────┐     ┌─────────────────┐
│ HTTP      │────►│ Activity     │────►│ Activity        │
│ Request   │     │ Middleware   │     │ Service         │
└───────────┘     └──────────────┘     └─────────────────┘
                           │                     │
                           ▼                     ▼
                  ┌──────────────┐     ┌─────────────────┐
                  │ Async Queue  │     │ Activity        │
                  │ (Batching)   │     │ Repository      │
                  └──────────────┘     └─────────────────┘
                           │                     │
                           ▼                     ▼
                  ┌──────────────┐     ┌─────────────────┐
                  │ Database     │◄────│ PostgreSQL      │
                  │ Batch Write  │     │ Database        │
                  └──────────────┘     └─────────────────┘
```

## Backend Implementation

### Database Schema

```sql
-- User Activity Logs Table
CREATE TABLE user_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Activity Information
    action VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    severity activity_severity DEFAULT 'info',

    -- Request Context
    ip_address VARCHAR(45),
    user_agent TEXT,
    session_id VARCHAR(128),
    request_id VARCHAR(64),

    -- JSON Data
    device_info JSONB,
    location_info JSONB,
    metadata JSONB,

    -- Timestamp
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Strategic Indexes
CREATE INDEX idx_user_activity_user_id ON user_activity_logs(user_id);
CREATE INDEX idx_user_activity_user_created ON user_activity_logs(user_id, created_at);
CREATE INDEX idx_user_activity_user_action ON user_activity_logs(user_id, action);
CREATE INDEX idx_user_activity_action ON user_activity_logs(action);
CREATE INDEX idx_user_activity_session ON user_activity_logs(session_id);
CREATE INDEX idx_user_activity_created ON user_activity_logs(created_at);
CREATE INDEX idx_user_activity_severity_created ON user_activity_logs(severity, created_at);
CREATE INDEX idx_user_activity_ip ON user_activity_logs(ip_address);
```

### TypeBox Schema Definitions

```typescript
// /apps/api/src/modules/user-profile/user-activity.schemas.ts

// Base activity log schema
export const ActivityLogSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  user_id: Type.String({ format: 'uuid' }),
  action: Type.String({ minLength: 1, maxLength: 100 }),
  description: Type.String({ minLength: 1 }),
  severity: Type.Union([Type.Literal('info'), Type.Literal('warning'), Type.Literal('error'), Type.Literal('critical')], { default: 'info' }),
  // ... additional fields
});

// Activity action constants
export const ACTIVITY_ACTIONS = {
  // Authentication
  LOGIN: 'login',
  LOGOUT: 'logout',
  LOGIN_FAILED: 'login_failed',

  // Profile Management
  PROFILE_VIEW: 'profile_view',
  PROFILE_UPDATE: 'profile_update',
  PASSWORD_CHANGE: 'password_change',

  // Security
  SUSPICIOUS_ACTIVITY: 'suspicious_activity',
  SESSION_CREATED: 'session_created',

  // System
  API_ERROR: 'api_error',
  VALIDATION_ERROR: 'validation_error',
} as const;
```

### Activity Middleware

```typescript
// /apps/api/src/plugins/activity-logging/activity-middleware.ts

export class ActivityMiddleware {
  private batchQueue: ActivityBatch[] = [];
  private flushTimer?: NodeJS.Timeout;

  async preHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    // Set up activity context
    request.activityContext = {
      startTime: Date.now(),
      requestId: request.id,
      shouldLog: this.shouldLogRequest(request),
    };
  }

  async onResponse(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    if (!request.user || !request.activityContext?.shouldLog) {
      return;
    }

    const activity = this.buildActivity(request, reply);

    if (this.config.async) {
      await this.addToBatch(activity);
    } else {
      await this.service.logActivity(/* ... */);
    }
  }

  private async addToBatch(activity: ActivityBatch): Promise<void> {
    this.batchQueue.push(activity);

    if (this.batchQueue.length >= this.config.batchSize) {
      await this.flushBatch();
    } else if (!this.flushTimer) {
      this.flushTimer = setTimeout(() => this.flushBatch(), this.config.flushInterval);
    }
  }
}
```

### Activity Service Layer

```typescript
// /apps/api/src/modules/user-profile/user-activity.service.ts

export class UserActivityService {
  constructor(private repository: UserActivityRepository) {}

  // High-level logging methods
  async logLogin(userId: string, request: FastifyRequest, success: boolean = true): Promise<ActivityLog> {
    const action = success ? ACTIVITY_ACTIONS.LOGIN : ACTIVITY_ACTIONS.LOGIN_FAILED;
    const description = success ? 'User successfully logged in' : 'Failed login attempt';
    const severity = success ? 'info' : 'warning';

    return this.logActivity(userId, action, description, request, {
      severity,
      metadata: { success, timestamp: new Date().toISOString() },
    });
  }

  async logProfileUpdate(userId: string, request: FastifyRequest, fields: string[]): Promise<ActivityLog> {
    return this.logActivity(userId, ACTIVITY_ACTIONS.PROFILE_UPDATE, `Profile updated: ${fields.join(', ')}`, request, { metadata: { fields_updated: fields } });
  }

  // Core logging method
  async logActivity(
    userId: string,
    action: ActivityAction,
    description: string,
    request?: FastifyRequest,
    options?: {
      severity?: 'info' | 'warning' | 'error' | 'critical';
      metadata?: Record<string, any>;
    },
  ): Promise<ActivityLog> {
    const requestInfo = request ? this.extractRequestInfo(request) : undefined;

    const activityData: CreateActivityLog = {
      action,
      description,
      severity: options?.severity || 'info',
      metadata: options?.metadata,
    };

    return this.repository.createActivityLog(userId, activityData, requestInfo);
  }

  // Request information extraction
  private extractRequestInfo(request: FastifyRequest): RequestInfo {
    return {
      ip_address: this.getClientIp(request),
      user_agent: request.headers['user-agent'],
      session_id: this.extractSessionId(request),
      request_id: request.id,
      device_info: this.parseUserAgent(request.headers['user-agent']),
      location_info: undefined, // Implement IP geolocation if needed
    };
  }
}
```

### Repository Layer

```typescript
// /apps/api/src/modules/user-profile/user-activity.repository.ts

export class UserActivityRepository {
  constructor(private knex: Knex) {}

  async createActivityLog(userId: string, data: CreateActivityLog, requestInfo?: RequestInfo): Promise<ActivityLog> {
    const [activity] = await this.knex('user_activity_logs')
      .insert({
        user_id: userId,
        action: data.action,
        description: data.description,
        severity: data.severity || 'info',
        ip_address: requestInfo?.ip_address,
        user_agent: requestInfo?.user_agent,
        session_id: requestInfo?.session_id,
        request_id: requestInfo?.request_id,
        device_info: requestInfo?.device_info,
        location_info: requestInfo?.location_info,
        metadata: data.metadata,
      })
      .returning('*');

    return activity;
  }

  async getUserActivities(userId: string, query: GetActivityLogsQuery = {}): Promise<PaginationResult<ActivityLog>> {
    const { page = 1, limit = 20, action, severity, from_date, to_date, search } = query;

    let queryBuilder = this.knex('user_activity_logs').where('user_id', userId);

    // Apply filters
    if (action) queryBuilder = queryBuilder.where('action', action);
    if (severity) queryBuilder = queryBuilder.where('severity', severity);
    if (from_date) queryBuilder = queryBuilder.where('created_at', '>=', from_date);
    if (to_date) queryBuilder = queryBuilder.where('created_at', '<=', to_date);
    if (search) queryBuilder = queryBuilder.where('description', 'ilike', `%${search}%`);

    // Get total count
    const [{ count }] = await queryBuilder.clone().count('* as count');
    const total = parseInt(count as string, 10);

    // Get paginated results
    const data = await queryBuilder
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset((page - 1) * limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  async getUserActivityStats(userId: string): Promise<ActivityStats> {
    // Complex aggregation queries for statistics
    const [totalActivities] = await this.knex('user_activity_logs').where('user_id', userId).count('* as count');

    const activitiesByAction = await this.knex('user_activity_logs').where('user_id', userId).select('action').count('* as count').groupBy('action');

    // ... additional statistical queries

    return {
      total_activities: parseInt(totalActivities.count as string, 10),
      activities_by_action: Object.fromEntries(activitiesByAction.map((row) => [row.action, parseInt(row.count as string, 10)])),
      // ... additional stats
    };
  }
}
```

## Frontend Implementation

### Angular Service with Signals

```typescript
// /apps/web/src/app/features/user-profile/components/activity-log/activity-log.service.ts

@Injectable({ providedIn: 'root' })
export class ActivityLogService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/api/profile/activity`;

  // Signal-based state management
  private activitiesSignal = signal<ActivityLog[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);
  private statsSignal = signal<ActivityLogStats | null>(null);
  private paginationSignal = signal<PaginationInfo | null>(null);

  // Filter state with BehaviorSubject
  private filtersSubject = new BehaviorSubject<ActivityLogFilters>({
    page: 1,
    limit: 20,
  });

  // Public readonly signals
  readonly activities = this.activitiesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly stats = this.statsSignal.asReadonly();
  readonly pagination = this.paginationSignal.asReadonly();

  // Computed signals
  readonly hasActivities = computed(() => this.activitiesSignal().length > 0);
  readonly totalActivities = computed(() => this.paginationSignal()?.total ?? 0);

  loadActivities(filters?: ActivityLogFilters): Observable<ActivityLogResponse> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    // Build HTTP params from filters
    let httpParams = new HttpParams();
    const currentFilters = { ...this.filtersSubject.value, ...filters };

    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    return this.http.get<ApiResponse<ActivityLogResponse>>(this.baseUrl, { params: httpParams }).pipe(
      map((response) => {
        if (!response.success || !response.data) {
          throw new Error(response.error || 'Failed to load activities');
        }
        return response.data;
      }),
      tap((data) => {
        this.activitiesSignal.set(data.activities);
        this.paginationSignal.set(data.pagination);
        this.loadingSignal.set(false);
      }),
      catchError((error) => {
        const errorMessage = error.error?.error || error.message || 'Failed to load activities';
        this.errorSignal.set(errorMessage);
        this.loadingSignal.set(false);
        throw error;
      }),
    );
  }
}
```

### Activity Log Component

```typescript
// /apps/web/src/app/features/user-profile/components/activity-log/activity-log.component.ts

@Component({
  selector: 'ax-activity-log',
  standalone: true,
  template: `
    <div class="activity-log-container space-y-6">
      <!-- Statistics Section -->
      @if (showStats()) {
        <ax-activity-log-stats [stats]="stats()" [autoRefresh]="autoRefresh()"></ax-activity-log-stats>
      }

      <!-- Filters Section -->
      <ax-activity-log-filter [initialFilters]="currentFilters()" (filtersChange)="onFiltersChange($event)"></ax-activity-log-filter>

      <!-- Activity Table -->
      <ax-card [appearance]="'elevated'">
        <table mat-table [dataSource]="activities()">
          <!-- Column definitions -->
          <ng-container matColumnDef="timestamp">
            <th mat-header-cell *matHeaderCellDef>Timestamp</th>
            <td mat-cell *matCellDef="let activity">
              {{ formatDate(activity.created_at) }}
            </td>
          </ng-container>

          <!-- Additional columns... -->

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let activity; columns: displayedColumns" (click)="onRowClick(activity)"></tr>
        </table>

        <!-- Pagination -->
        <mat-paginator [length]="pagination()?.total" [pageSize]="pagination()?.limit" [pageIndex]="pagination()?.page - 1" (page)="onPageChange($event)"></mat-paginator>
      </ax-card>
    </div>
  `,
})
export class ActivityLogComponent implements OnInit, OnDestroy {
  private activityLogService = inject(ActivityLogService);

  // Signals from service
  activities = this.activityLogService.activities;
  stats = this.activityLogService.stats;
  pagination = this.activityLogService.pagination;
  isLoading = this.activityLogService.loading;
  error = this.activityLogService.error;

  // Component-specific signals
  showStats = signal<boolean>(true);
  autoRefresh = signal<boolean>(false);

  // Computed signals
  hasActivities = this.activityLogService.hasActivities;
  totalActivities = this.activityLogService.totalActivities;
  currentFilters = computed(() => this.activityLogService.getCurrentFilters());

  ngOnInit(): void {
    this.loadInitialData();
    this.setupAutoRefresh();
  }

  private setupAutoRefresh(): void {
    timer(0, 30000)
      .pipe(
        switchMap(() => (this.autoRefresh() ? timer(0) : [])),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        if (!this.isLoading()) {
          this.activityLogService.refresh();
        }
      });
  }
}
```

## Extension Patterns

### Adding New Activity Types

1. **Update Schema Constants**:

```typescript
// In user-activity.schemas.ts
export const ACTIVITY_ACTIONS = {
  // ... existing actions
  NEW_FEATURE_ACCESS: 'new_feature_access',
  NEW_FEATURE_UPDATE: 'new_feature_update',
} as const;
```

2. **Add Service Methods**:

```typescript
// In user-activity.service.ts
async logNewFeatureAccess(userId: string, featureName: string, request: FastifyRequest): Promise<ActivityLog> {
  return this.logActivity(
    userId,
    ACTIVITY_ACTIONS.NEW_FEATURE_ACCESS,
    `Accessed new feature: ${featureName}`,
    request,
    { metadata: { feature_name: featureName } }
  );
}
```

3. **Update Frontend Icons/Labels**:

```typescript
// In activity-log.component.ts
getActionIcon(action: string): string {
  const iconMap: Record<string, string> = {
    // ... existing mappings
    new_feature_access: 'new_releases',
    new_feature_update: 'system_update'
  };
  return iconMap[action] || 'help_outline';
}
```

### Custom Middleware Configuration

```typescript
// Register activity logging plugin with custom config
await fastify.register(activityLoggingPlugin, {
  config: {
    enabled: true,
    async: true,
    batchSize: 100,
    flushInterval: 3000,
    defaultConfig: {
      enabled: true,
      severity: 'info',
      skipSuccessfulGets: true,
      includeRequestData: false,
      includeResponseData: false,
      async: true,
    },
    routeConfigs: {
      '/api/sensitive-endpoint': {
        enabled: true,
        severity: 'warning',
        includeRequestData: true,
        async: false, // Log immediately for sensitive operations
      },
    },
  },
});
```

### Route-Specific Activity Logging

```typescript
// Enable specific logging for a route
fastify.get(
  '/api/admin/users',
  {
    schema: {
      // ... regular schema
      activityLog: {
        enabled: true,
        action: 'admin_user_list_access',
        description: 'Administrator accessed user list',
        severity: 'warning',
        includeRequestData: false,
        includeResponseData: false,
      },
    },
  },
  async (request, reply) => {
    // Route handler implementation
  },
);
```

## Performance Optimization

### Database Optimization

#### Strategic Indexing

```sql
-- Most common query patterns
CREATE INDEX CONCURRENTLY idx_user_activity_user_created
  ON user_activity_logs(user_id, created_at DESC);

-- Partial index for recent activities (hot data)
CREATE INDEX CONCURRENTLY idx_user_activity_recent
  ON user_activity_logs(user_id, created_at)
  WHERE created_at > CURRENT_DATE - INTERVAL '30 days';

-- Composite index for filtered queries
CREATE INDEX CONCURRENTLY idx_user_activity_filter
  ON user_activity_logs(user_id, action, severity, created_at);
```

#### Connection Pooling

```typescript
// Knex configuration for high-volume logging
const knexConfig = {
  client: 'postgresql',
  connection: {
    // ... connection details
  },
  pool: {
    min: 5,
    max: 20,
    acquireTimeoutMillis: 10000,
    createTimeoutMillis: 10000,
    destroyTimeoutMillis: 5000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 200,
  },
  acquireConnectionTimeout: 10000,
};
```

### Batching and Async Processing

```typescript
class ActivityBatcher {
  private batchQueue: ActivityBatch[] = [];
  private processing = false;

  async addToBatch(activity: ActivityBatch): Promise<void> {
    this.batchQueue.push(activity);

    if (this.batchQueue.length >= this.batchSize || !this.processing) {
      await this.processBatch();
    }
  }

  private async processBatch(): Promise<void> {
    if (this.processing || this.batchQueue.length === 0) return;

    this.processing = true;
    const batch = this.batchQueue.splice(0, this.batchSize);

    try {
      await this.repository.createActivitiesBatch(batch);
    } catch (error) {
      // Error handling and retry logic
      this.handleBatchError(batch, error);
    } finally {
      this.processing = false;

      // Process remaining items
      if (this.batchQueue.length > 0) {
        setImmediate(() => this.processBatch());
      }
    }
  }
}
```

### Memory Management

```typescript
// Implement connection pooling and result streaming
async getUserActivitiesStream(
  userId: string,
  query: GetActivityLogsQuery
): Promise<NodeJS.ReadableStream> {
  const stream = this.knex('user_activity_logs')
    .where('user_id', userId)
    .orderBy('created_at', 'desc')
    .stream();

  return stream;
}

// Frontend: Virtual scrolling for large datasets
// Use Angular CDK Virtual Scrolling for activity table
<cdk-virtual-scroll-viewport itemSize="60" class="activity-viewport">
  <div *cdkVirtualFor="let activity of activities()" class="activity-item">
    <!-- Activity row content -->
  </div>
</cdk-virtual-scroll-viewport>
```

## Testing Strategies

### Unit Testing

#### Backend Service Testing

```typescript
// user-activity.service.spec.ts
describe('UserActivityService', () => {
  let service: UserActivityService;
  let mockRepository: jest.Mocked<UserActivityRepository>;
  let mockRequest: FastifyRequest;

  beforeEach(() => {
    mockRepository = {
      createActivityLog: jest.fn(),
      getUserActivities: jest.fn(),
      getUserActivityStats: jest.fn(),
    } as any;

    service = new UserActivityService(mockRepository);

    mockRequest = {
      id: 'req-123',
      ip: '127.0.0.1',
      headers: { 'user-agent': 'test-agent' },
      cookies: { sessionId: 'session-123' },
      user: { id: 'user-123' },
    } as any;
  });

  describe('logLogin', () => {
    it('should log successful login', async () => {
      const expectedActivity = { id: 'activity-123', action: 'login' };
      mockRepository.createActivityLog.mockResolvedValue(expectedActivity as any);

      const result = await service.logLogin('user-123', mockRequest, true);

      expect(mockRepository.createActivityLog).toHaveBeenCalledWith(
        'user-123',
        expect.objectContaining({
          action: 'login',
          description: 'User successfully logged in',
          severity: 'info',
        }),
        expect.objectContaining({
          ip_address: '127.0.0.1',
          request_id: 'req-123',
        }),
      );

      expect(result).toEqual(expectedActivity);
    });

    it('should log failed login attempt', async () => {
      await service.logLogin('user-123', mockRequest, false);

      expect(mockRepository.createActivityLog).toHaveBeenCalledWith(
        'user-123',
        expect.objectContaining({
          action: 'login_failed',
          description: 'Failed login attempt',
          severity: 'warning',
        }),
        expect.any(Object),
      );
    });
  });
});
```

#### Frontend Service Testing

```typescript
// activity-log.service.spec.ts
describe('ActivityLogService', () => {
  let service: ActivityLogService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(ActivityLogService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should load activities and update signals', () => {
    const mockResponse = {
      success: true,
      data: {
        activities: [{ id: '1', action: 'login', description: 'User logged in' }],
        pagination: { page: 1, limit: 20, total: 1, pages: 1, hasNext: false, hasPrev: false },
      },
    };

    service.loadActivities().subscribe();

    const req = httpMock.expectOne('/api/profile/activity');
    req.flush(mockResponse);

    expect(service.activities()).toEqual(mockResponse.data.activities);
    expect(service.pagination()).toEqual(mockResponse.data.pagination);
    expect(service.loading()).toBe(false);
  });
});
```

### Integration Testing

```typescript
// activity-tracking.integration.spec.ts
describe('Activity Tracking Integration', () => {
  let app: FastifyInstance;
  let knex: Knex;

  beforeAll(async () => {
    // Set up test database and Fastify app
    knex = setupTestDatabase();
    app = await setupTestApp(knex);
  });

  describe('Automatic Activity Logging', () => {
    it('should automatically log profile view', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/profile',
        headers: {
          authorization: 'Bearer ' + testToken,
        },
      });

      expect(response.statusCode).toBe(200);

      // Verify activity was logged
      const activities = await knex('user_activity_logs').where('user_id', testUserId).where('action', 'profile_view');

      expect(activities).toHaveLength(1);
      expect(activities[0].description).toBe('Viewed activity log');
    });
  });

  describe('Manual Activity Logging', () => {
    it('should log custom activity', async () => {
      const activityData = {
        action: 'custom_action',
        description: 'Custom activity description',
        severity: 'info',
      };

      const response = await app.inject({
        method: 'POST',
        url: '/api/profile/activity/log',
        headers: { authorization: 'Bearer ' + testToken },
        payload: activityData,
      });

      expect(response.statusCode).toBe(201);

      const activity = await knex('user_activity_logs').where('user_id', testUserId).where('action', 'custom_action').first();

      expect(activity).toBeDefined();
      expect(activity.description).toBe('Custom activity description');
    });
  });
});
```

### E2E Testing with Playwright

```typescript
// activity-log.e2e.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Activity Log Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-test="email"]', 'test@example.com');
    await page.fill('[data-test="password"]', 'password');
    await page.click('[data-test="login-button"]');

    await page.goto('/profile/activity');
  });

  test('should display activity dashboard', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Activity Log');
    await expect(page.locator('[data-test="activity-table"]')).toBeVisible();
  });

  test('should filter activities by action', async ({ page }) => {
    await page.click('[data-test="action-filter"]');
    await page.click('[data-test="filter-option-login"]');

    // Wait for filtered results
    await page.waitForSelector('[data-test="activity-row"]');

    const activityRows = await page.locator('[data-test="activity-row"]').all();
    for (const row of activityRows) {
      const actionCell = row.locator('[data-test="action-cell"]');
      await expect(actionCell).toContainText('Login');
    }
  });

  test('should paginate through activities', async ({ page }) => {
    await page.click('[data-test="next-page"]');
    await expect(page.locator('[data-test="page-info"]')).toContainText('Page 2');

    await page.click('[data-test="prev-page"]');
    await expect(page.locator('[data-test="page-info"]')).toContainText('Page 1');
  });

  test('should show activity statistics', async ({ page }) => {
    await expect(page.locator('[data-test="total-activities"]')).toBeVisible();
    await expect(page.locator('[data-test="activities-chart"]')).toBeVisible();
  });
});
```

## Security Considerations

### Data Privacy

```typescript
// Implement data masking for sensitive information
class ActivityPrivacyManager {
  maskSensitiveData(activity: ActivityLog): ActivityLog {
    const maskedActivity = { ...activity };

    // Mask IP addresses (keep first two octets)
    if (maskedActivity.ip_address) {
      const ipParts = maskedActivity.ip_address.split('.');
      if (ipParts.length === 4) {
        maskedActivity.ip_address = `${ipParts[0]}.${ipParts[1]}.xxx.xxx`;
      }
    }

    // Remove sensitive metadata
    if (maskedActivity.metadata) {
      delete maskedActivity.metadata.sensitive_field;
    }

    return maskedActivity;
  }

  // Implement field-level access control
  filterFieldsByRole(activity: ActivityLog, userRole: string): Partial<ActivityLog> {
    const allowedFields = this.getAllowedFields(userRole);
    return pick(activity, allowedFields);
  }
}
```

### Access Control

```typescript
// Implement authorization checks
async function checkActivityAccess(request: FastifyRequest, targetUserId: string): Promise<boolean> {
  const currentUser = request.user;

  // Users can only access their own activities
  if (currentUser.id === targetUserId) {
    return true;
  }

  // Admins can access any user's activities
  if (currentUser.role === 'admin') {
    return true;
  }

  // Support staff can access activities with proper permission
  if (currentUser.role === 'support' && currentUser.permissions.includes('view_user_activities')) {
    return true;
  }

  return false;
}
```

### Rate Limiting

```typescript
// Implement rate limiting for activity endpoints
const activityRateLimit = {
  max: 100, // Max 100 requests per window
  timeWindow: '1 minute',
  keyGenerator: (request: FastifyRequest) => {
    return `activity_${request.user.id}`;
  },
  errorResponseBuilder: () => {
    return {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many activity requests. Please try again later.',
      },
    };
  },
};

fastify.register(require('@fastify/rate-limit'), activityRateLimit);
```

## Monitoring and Observability

### Logging Configuration

```typescript
// Enhanced logging for activity system
const logger = fastify.log.child({
  component: 'activity-tracking',
  version: '1.0.0',
});

// Log activity system performance
class ActivityMetrics {
  private metrics = {
    activitiesLogged: 0,
    batchesProcessed: 0,
    averageLatency: 0,
    errors: 0,
  };

  recordActivityLogged(latency: number): void {
    this.metrics.activitiesLogged++;
    this.updateLatency(latency);

    logger.debug({
      metric: 'activity_logged',
      latency,
      total: this.metrics.activitiesLogged,
    });
  }

  recordBatchProcessed(batchSize: number, processingTime: number): void {
    this.metrics.batchesProcessed++;

    logger.info({
      metric: 'batch_processed',
      batch_size: batchSize,
      processing_time: processingTime,
      total_batches: this.metrics.batchesProcessed,
    });
  }

  recordError(error: Error, context: any): void {
    this.metrics.errors++;

    logger.error({
      metric: 'activity_error',
      error: error.message,
      context,
      total_errors: this.metrics.errors,
    });
  }
}
```

### Health Checks

```typescript
// Activity system health check endpoint
fastify.get('/health/activity-tracking', async (request, reply) => {
  const health = {
    service: 'activity-tracking',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    checks: {},
  };

  try {
    // Check database connectivity
    await fastify.knex.raw('SELECT 1');
    health.checks.database = { status: 'healthy' };
  } catch (error) {
    health.status = 'unhealthy';
    health.checks.database = {
      status: 'unhealthy',
      error: error.message,
    };
  }

  try {
    // Check recent activity logging
    const recentActivities = await fastify
      .knex('user_activity_logs')
      .where('created_at', '>', new Date(Date.now() - 5 * 60 * 1000))
      .count('* as count');

    health.checks.recent_activities = {
      status: 'healthy',
      count: recentActivities[0].count,
    };
  } catch (error) {
    health.checks.recent_activities = {
      status: 'unhealthy',
      error: error.message,
    };
  }

  const statusCode = health.status === 'healthy' ? 200 : 503;
  return reply.code(statusCode).send(health);
});
```

## Deployment Considerations

### Environment Configuration

```typescript
// Environment-specific activity logging configuration
const activityConfig = {
  development: {
    enabled: true,
    async: false, // Immediate logging for debugging
    logLevel: 'debug',
    includeRequestData: true,
    includeResponseData: true,
  },

  staging: {
    enabled: true,
    async: true,
    batchSize: 25,
    flushInterval: 2000,
    logLevel: 'info',
  },

  production: {
    enabled: true,
    async: true,
    batchSize: 100,
    flushInterval: 5000,
    logLevel: 'warn',
    includeRequestData: false,
    includeResponseData: false,
  },
};
```

### Database Migration Strategy

```typescript
// Migration for activity logging indices
export async function up(knex: Knex): Promise<void> {
  // Create indices concurrently to avoid downtime
  await knex.raw(`
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_activity_user_created 
    ON user_activity_logs (user_id, created_at DESC);
  `);

  await knex.raw(`
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_activity_recent 
    ON user_activity_logs (user_id, created_at) 
    WHERE created_at > CURRENT_DATE - INTERVAL '30 days';
  `);
}

// Zero-downtime deployment strategy
export async function safeDeployment(knex: Knex): Promise<void> {
  // 1. Deploy new code with feature flag disabled
  // 2. Run database migrations
  // 3. Enable feature flag gradually
  // 4. Monitor for issues
  // 5. Full rollout or rollback as needed
}
```

## Troubleshooting Guide

### Common Issues and Solutions

#### High Memory Usage

```typescript
// Solution: Implement proper connection pooling and result streaming
const streamingQuery = knex('user_activity_logs').where('user_id', userId).orderBy('created_at', 'desc').stream({ highWaterMark: 16 }); // Process 16 rows at a time
```

#### Slow Query Performance

```sql
-- Solution: Add missing indices and optimize queries
EXPLAIN ANALYZE
SELECT * FROM user_activity_logs
WHERE user_id = $1 AND created_at > $2
ORDER BY created_at DESC;

-- Add composite index for common query patterns
CREATE INDEX CONCURRENTLY idx_user_activity_composite
ON user_activity_logs (user_id, created_at DESC, action, severity);
```

#### Batch Processing Failures

```typescript
// Solution: Implement retry logic with exponential backoff
class BatchProcessor {
  async processBatchWithRetry(batch: ActivityBatch[], maxRetries = 3): Promise<void> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.processBatch(batch);
        return; // Success
      } catch (error) {
        if (attempt === maxRetries) {
          // Log to dead letter queue for manual processing
          await this.logToDeadLetterQueue(batch, error);
          throw error;
        }

        // Exponential backoff
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
}
```

---

This developer guide provides comprehensive technical documentation for understanding, maintaining, and extending the Activity Tracking System. It covers all aspects from database schema to frontend implementation, testing strategies, and deployment considerations.

</div>
