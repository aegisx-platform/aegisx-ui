# Activity Tracking System - Troubleshooting Guide

## Overview

This troubleshooting guide covers common issues, diagnostic procedures, and solutions for the Activity Tracking System. It's organized by component and includes both quick fixes and detailed investigation steps.

## Quick Diagnostic Commands

### System Health Check

```bash
# Quick health check script
#!/bin/bash
echo "=== Activity Tracking System Health Check ==="

# Check API health
curl -s http://localhost:3333/health/activity-tracking | jq .

# Check database connection
psql -h localhost -U activity_user -d activity_tracking_db -c "SELECT COUNT(*) FROM user_activity_logs WHERE created_at > NOW() - INTERVAL '1 hour';"

# Check recent activities
psql -h localhost -U activity_user -d activity_tracking_db -c "SELECT action, COUNT(*) FROM user_activity_logs WHERE created_at > NOW() - INTERVAL '1 day' GROUP BY action ORDER BY count DESC LIMIT 5;"

# Check application processes
pm2 status

# Check memory usage
free -h

# Check disk space
df -h
```

### Log Monitoring

```bash
# Real-time log monitoring
tail -f /var/log/aegisx/api-combined.log | grep -i activity

# Check for errors in the last hour
grep "ERROR" /var/log/aegisx/api-error.log | grep "$(date -d '1 hour ago' '+%Y-%m-%d %H')"

# Check PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-15-main.log | grep -i error
```

## Frontend Issues

### Activity Dashboard Not Loading

#### Symptoms

- Blank dashboard or loading spinner that never completes
- Console errors related to API calls
- Network errors in browser developer tools

#### Diagnosis

```typescript
// Check browser console for errors
// Open Developer Tools (F12) and look for:

// 1. Network errors
fetch('http://localhost:3333/api/profile/activity')
  .then((response) => response.json())
  .then((data) => console.log('API Response:', data))
  .catch((error) => console.error('API Error:', error));

// 2. Authentication errors
console.log('Auth token:', localStorage.getItem('auth_token'));

// 3. CORS issues
console.log('Request headers:', {
  Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
  'Content-Type': 'application/json',
});
```

#### Solutions

**Solution 1: API Connection Issues**

```bash
# Check if API is running
curl -I http://localhost:3333/api/health

# Check if activity endpoints are available
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3333/api/profile/activity

# If API is down, restart it
pm2 restart aegisx-api
```

**Solution 2: Authentication Issues**

```typescript
// Check token validity in browser console
const token = localStorage.getItem('auth_token');
if (!token) {
  console.log('No auth token found - user needs to login');
} else {
  // Decode JWT to check expiration
  const payload = JSON.parse(atob(token.split('.')[1]));
  const isExpired = payload.exp * 1000 < Date.now();
  console.log('Token expired:', isExpired);
}
```

**Solution 3: CORS Configuration**

```typescript
// In your Fastify server configuration
await fastify.register(require('@fastify/cors'), {
  origin: ['http://localhost:4200', 'https://yourdomain.com'],
  credentials: true,
});
```

### Activity Table Performance Issues

#### Symptoms

- Slow loading of activity data
- Browser becomes unresponsive when displaying many activities
- Pagination not working properly

#### Diagnosis

```typescript
// Monitor Angular performance
import { ChangeDetectorRef } from '@angular/core';

// In your component
ngAfterViewInit() {
  console.time('activity-table-render');
  this.cdr.detectChanges();
  console.timeEnd('activity-table-render');
}

// Check virtual scrolling
<cdk-virtual-scroll-viewport itemSize="50" class="activity-viewport">
  <div *cdkVirtualFor="let activity of activities()">
    <!-- Activity row content -->
  </div>
</cdk-virtual-scroll-viewport>
```

#### Solutions

**Solution 1: Enable Virtual Scrolling**

```typescript
// Install Angular CDK
npm install @angular/cdk

// Update component template
<cdk-virtual-scroll-viewport itemSize="60" class="activity-viewport">
  <div *cdkVirtualFor="let activity of activities()" class="activity-row">
    <ax-activity-row [activity]="activity"></ax-activity-row>
  </div>
</cdk-virtual-scroll-viewport>
```

**Solution 2: Optimize Change Detection**

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
export class ActivityLogComponent {
  // Use OnPush change detection with signals
  activities = this.activityService.activities;

  // Implement trackBy for better performance
  trackByActivityId(index: number, activity: ActivityLog): string {
    return activity.id;
  }
}
```

### Filter Issues

#### Symptoms

- Filters not applying correctly
- Search not working
- Date range filters causing errors

#### Diagnosis

```typescript
// Debug filter state
console.log('Current filters:', this.activityService.getCurrentFilters());

// Check API call with filters
const filters = { action: 'login', severity: 'warning' };
this.http.get('/api/profile/activity', { params: filters }).subscribe(
  (data) => console.log('Filtered data:', data),
  (error) => console.error('Filter error:', error),
);
```

#### Solutions

**Solution 1: Fix Date Filter Format**

```typescript
// Ensure proper date format
formatDateForApi(date: Date): string {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
}

// Update filter service
updateFilters(filters: Partial<ActivityLogFilters>): void {
  const processedFilters = { ...filters };

  if (processedFilters.dateFrom) {
    processedFilters.dateFrom = this.formatDateForApi(new Date(processedFilters.dateFrom));
  }

  if (processedFilters.dateTo) {
    processedFilters.dateTo = this.formatDateForApi(new Date(processedFilters.dateTo));
  }

  this.loadActivities(processedFilters).subscribe();
}
```

## Backend Issues

### Activity Logging Not Working

#### Symptoms

- No activities being logged
- Activities logged with missing information
- High memory usage from activity logging

#### Diagnosis

```typescript
// Check activity logging plugin status
console.log('Activity logging enabled:', fastify.activityLoggingConfig.enabled);

// Debug activity middleware
export class ActivityMiddleware {
  async onResponse(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    console.log('Middleware triggered for:', request.method, request.url);
    console.log('Should log:', this.shouldLog(request, reply));
    console.log('User authenticated:', !!request.user);

    // Rest of middleware logic
  }
}
```

#### Solutions

**Solution 1: Enable Activity Logging**

```typescript
// Ensure plugin is registered and enabled
await fastify.register(activityLoggingPlugin, {
  config: {
    enabled: true,
    async: true,
    batchSize: 50,
    flushInterval: 5000,
  },
});
```

**Solution 2: Fix Middleware Registration**

```typescript
// Correct hook registration order
fastify.addHook('onReady', async function () {
  // Initialize services first
  const userActivityRepository = new UserActivityRepository(fastify.knex);
  const userActivityService = new UserActivityService(userActivityRepository);
  const middleware = new ActivityMiddleware(fastify, userActivityService, config);

  // Register hooks after initialization
  fastify.addHook('onResponse', async (request, reply) => {
    await middleware.onResponse(request, reply);
  });
});
```

**Solution 3: Fix Batch Processing**

```typescript
// Implement robust batch processing with error handling
class ActivityBatcher {
  private async flushBatch(): Promise<void> {
    if (this.processing || this.batchQueue.length === 0) return;

    this.processing = true;
    const batch = [...this.batchQueue];
    this.batchQueue = [];

    try {
      await this.repository.createActivitiesBatch(batch);
      this.logger.info(`Processed batch of ${batch.length} activities`);
    } catch (error) {
      this.logger.error('Batch processing failed:', error);

      // Retry individual items
      for (const activity of batch) {
        try {
          await this.repository.createActivityLog(activity.userId, activity.data);
        } catch (itemError) {
          this.logger.error('Individual activity failed:', itemError);
        }
      }
    } finally {
      this.processing = false;
    }
  }
}
```

### Database Performance Issues

#### Symptoms

- Slow activity queries
- High database CPU usage
- Connection pool exhaustion

#### Diagnosis

```sql
-- Check slow queries
SELECT
  query,
  calls,
  total_time,
  mean_time,
  rows,
  100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0) AS hit_percent
FROM pg_stat_statements
WHERE query LIKE '%user_activity_logs%'
ORDER BY total_time DESC
LIMIT 10;

-- Check index usage
SELECT
  schemaname,
  tablename,
  indexname,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE tablename = 'user_activity_logs'
ORDER BY idx_tup_read DESC;

-- Check table bloat
SELECT
  n_dead_tup,
  n_live_tup,
  round((n_dead_tup * 100.0 / GREATEST(n_live_tup + n_dead_tup, 1)), 2) AS dead_pct
FROM pg_stat_user_tables
WHERE tablename = 'user_activity_logs';
```

#### Solutions

**Solution 1: Add Missing Indexes**

```sql
-- Add frequently used composite indexes
CREATE INDEX CONCURRENTLY idx_user_activity_user_action_created
  ON user_activity_logs (user_id, action, created_at DESC);

CREATE INDEX CONCURRENTLY idx_user_activity_severity_created
  ON user_activity_logs (severity, created_at DESC)
  WHERE severity IN ('error', 'critical');

-- Add partial index for recent activities
CREATE INDEX CONCURRENTLY idx_user_activity_recent
  ON user_activity_logs (user_id, created_at DESC)
  WHERE created_at > CURRENT_DATE - INTERVAL '30 days';
```

**Solution 2: Optimize Connection Pool**

```typescript
// Optimize Knex connection pool
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

    // Add connection validation
    afterCreate: function (conn, done) {
      conn.query('SELECT 1', function (err) {
        done(err, conn);
      });
    },
  },
};
```

**Solution 3: Implement Query Optimization**

```typescript
// Optimize repository queries
export class UserActivityRepository {
  async getUserActivities(userId: string, query: GetActivityLogsQuery): Promise<PaginationResult<ActivityLog>> {
    let queryBuilder = this.knex('user_activity_logs').where('user_id', userId);

    // Use efficient date range queries
    if (query.from_date) {
      queryBuilder = queryBuilder.where('created_at', '>=', query.from_date);
    }
    if (query.to_date) {
      queryBuilder = queryBuilder.where('created_at', '<=', query.to_date);
    }

    // Use LIMIT/OFFSET efficiently
    const offset = (query.page - 1) * query.limit;

    // Get count and data in single transaction
    const [countResult, data] = await Promise.all([queryBuilder.clone().count('* as count').first(), queryBuilder.select('id', 'action', 'description', 'severity', 'created_at', 'device_info').orderBy('created_at', 'desc').limit(query.limit).offset(offset)]);

    return {
      data,
      pagination: {
        page: query.page,
        limit: query.limit,
        total: parseInt(countResult.count as string, 10),
        // ... other pagination fields
      },
    };
  }
}
```

### Memory Issues

#### Symptoms

- Node.js process running out of memory
- "JavaScript heap out of memory" errors
- High memory usage by activity logging

#### Diagnosis

```bash
# Monitor memory usage
node --inspect dist/apps/api/main.js

# Use clinic.js for memory profiling
clinic doctor -- node dist/apps/api/main.js

# Check V8 heap usage
node -e "console.log(process.memoryUsage())"
```

#### Solutions

**Solution 1: Increase Node.js Memory Limit**

```bash
# Increase heap size
node --max-old-space-size=4096 dist/apps/api/main.js

# Or in PM2 configuration
{
  "name": "aegisx-api",
  "script": "dist/apps/api/main.js",
  "node_args": "--max-old-space-size=4096"
}
```

**Solution 2: Implement Streaming for Large Datasets**

```typescript
// Stream large activity datasets
async getUserActivitiesStream(userId: string): Promise<NodeJS.ReadableStream> {
  const stream = this.knex('user_activity_logs')
    .where('user_id', userId)
    .orderBy('created_at', 'desc')
    .stream();

  return stream;
}

// Use streaming in controller
async getActivitiesExport(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const stream = await this.service.getUserActivitiesStream(request.user.id);

  reply.type('application/json');
  reply.send(stream);
}
```

**Solution 3: Optimize Batch Processing**

```typescript
// Prevent memory leaks in batch processing
class ActivityBatcher {
  private maxQueueSize = 1000; // Prevent unlimited queue growth

  async addToBatch(activity: ActivityBatch): Promise<void> {
    if (this.batchQueue.length >= this.maxQueueSize) {
      this.logger.warn('Activity queue full, forcing flush');
      await this.flushBatch();
    }

    this.batchQueue.push(activity);

    if (this.batchQueue.length >= this.batchSize) {
      await this.flushBatch();
    }
  }

  // Cleanup method called on shutdown
  async cleanup(): Promise<void> {
    await this.flushBatch();
    this.batchQueue = [];

    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = undefined;
    }
  }
}
```

## Network Issues

### API Connection Problems

#### Symptoms

- Intermittent connection failures
- Request timeouts
- CORS errors from frontend

#### Diagnosis

```bash
# Test API connectivity
curl -v http://localhost:3333/api/health

# Check network latency
ping localhost

# Check if port is listening
netstat -tlnp | grep :3333

# Check firewall rules
sudo ufw status
```

#### Solutions

**Solution 1: Fix CORS Configuration**

```typescript
// Proper CORS setup for activity endpoints
await fastify.register(require('@fastify/cors'), {
  origin: function (origin, callback) {
    const allowedOrigins = ['http://localhost:4200', 'https://yourdomain.com'];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

**Solution 2: Configure Request Timeouts**

```typescript
// Set appropriate timeouts
const server = fastify({
  logger: true,
  requestTimeout: 30000, // 30 seconds request timeout
  keepAliveTimeout: 5000, // 5 seconds keep-alive
  bodyLimit: 1048576, // 1MB body limit
});

// Configure client-side timeouts
const httpClient = axios.create({
  timeout: 10000, // 10 seconds timeout
  retry: 3, // Retry failed requests
  retryDelay: 1000, // 1 second between retries
});
```

### Rate Limiting Issues

#### Symptoms

- 429 Too Many Requests errors
- Users unable to access activity data
- API blocking legitimate requests

#### Diagnosis

```bash
# Check rate limiting logs
grep "rate limit" /var/log/nginx/access.log

# Test rate limiting
for i in {1..20}; do curl -I http://localhost:3333/api/profile/activity; done
```

#### Solutions

**Solution 1: Adjust Rate Limits**

```typescript
// Configure appropriate rate limits
const rateLimitConfig = {
  max: 100, // Increased from default
  timeWindow: '1 minute',
  keyGenerator: (request: FastifyRequest) => {
    return `activity_${request.user.id}`;
  },
  skipSuccessfulRequests: true, // Don't count successful requests
  skipFailedRequests: false, // Count failed requests
  allowList: ['127.0.0.1'], // Whitelist localhost
};
```

**Solution 2: Implement Intelligent Rate Limiting**

```typescript
// Different limits for different endpoints
const rateLimits = {
  '/api/profile/activity': { max: 100, timeWindow: '1 minute' },
  '/api/profile/activity/stats': { max: 10, timeWindow: '1 minute' },
  '/api/profile/activity/log': { max: 5, timeWindow: '1 minute' },
};

// Apply rate limiting per endpoint
Object.entries(rateLimits).forEach(([path, config]) => {
  fastify.register(require('@fastify/rate-limit'), {
    ...config,
    prefix: path,
  });
});
```

## Data Issues

### Missing Activity Data

#### Symptoms

- Activities not appearing in dashboard
- Incomplete activity information
- Data inconsistencies

#### Diagnosis

```sql
-- Check for missing activities
SELECT
  DATE_TRUNC('hour', created_at) as hour,
  COUNT(*) as activity_count
FROM user_activity_logs
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY hour
ORDER BY hour;

-- Check for data integrity issues
SELECT
  COUNT(*) FILTER (WHERE user_id IS NULL) as missing_user_id,
  COUNT(*) FILTER (WHERE action IS NULL) as missing_action,
  COUNT(*) FILTER (WHERE description IS NULL) as missing_description
FROM user_activity_logs;

-- Check for orphaned activities
SELECT COUNT(*)
FROM user_activity_logs ual
LEFT JOIN users u ON ual.user_id = u.id
WHERE u.id IS NULL;
```

#### Solutions

**Solution 1: Fix Data Validation**

```typescript
// Ensure all required fields are present
export class UserActivityService {
  async logActivity(userId: string, action: ActivityAction, description: string, request?: FastifyRequest, options?: ActivityOptions): Promise<ActivityLog> {
    // Validate required fields
    if (!userId || !action || !description) {
      throw new Error('Missing required activity fields');
    }

    const activityData: CreateActivityLog = {
      action,
      description: description.trim(),
      severity: options?.severity || 'info',
      metadata: options?.metadata,
    };

    const requestInfo = request ? this.extractRequestInfo(request) : {};

    return this.repository.createActivityLog(userId, activityData, requestInfo);
  }
}
```

**Solution 2: Implement Data Cleanup**

```sql
-- Clean up orphaned activities
DELETE FROM user_activity_logs
WHERE user_id NOT IN (SELECT id FROM users);

-- Fix missing descriptions
UPDATE user_activity_logs
SET description = 'Activity: ' || action
WHERE description IS NULL OR description = '';

-- Add constraints to prevent future issues
ALTER TABLE user_activity_logs
  ALTER COLUMN user_id SET NOT NULL,
  ALTER COLUMN action SET NOT NULL,
  ALTER COLUMN description SET NOT NULL,
  ADD CONSTRAINT chk_description_not_empty CHECK (length(trim(description)) > 0);
```

### Performance Degradation

#### Symptoms

- Slow query performance over time
- Increasing response times
- Database locks and timeouts

#### Diagnosis

```sql
-- Check table bloat
SELECT
  schemaname,
  tablename,
  n_dead_tup,
  n_live_tup,
  round((n_dead_tup * 100.0 / GREATEST(n_live_tup + n_dead_tup, 1)), 2) AS dead_pct
FROM pg_stat_user_tables
WHERE tablename = 'user_activity_logs';

-- Check index bloat
SELECT
  indexname,
  idx_tup_read,
  idx_tup_fetch,
  round((idx_tup_read * 100.0 / GREATEST(idx_tup_fetch, 1)), 2) AS read_fetch_ratio
FROM pg_stat_user_indexes
WHERE tablename = 'user_activity_logs'
ORDER BY idx_tup_read DESC;

-- Check locks
SELECT
  pid,
  usename,
  mode,
  locktype,
  relation::regclass,
  page,
  tuple,
  virtualxid,
  transactionid,
  granted
FROM pg_locks
WHERE relation = 'user_activity_logs'::regclass;
```

#### Solutions

**Solution 1: Regular Maintenance**

```sql
-- Schedule regular maintenance
CREATE OR REPLACE FUNCTION maintain_activity_logs()
RETURNS void AS $$
BEGIN
  -- Vacuum and analyze
  VACUUM ANALYZE user_activity_logs;

  -- Reindex if needed
  REINDEX INDEX CONCURRENTLY idx_user_activity_user_created;

  -- Update statistics
  ANALYZE user_activity_logs;

  RAISE NOTICE 'Activity logs maintenance completed at %', NOW();
END;
$$ LANGUAGE plpgsql;

-- Schedule via cron
SELECT cron.schedule('maintain-activity-logs', '0 2 * * 0', 'SELECT maintain_activity_logs();');
```

**Solution 2: Implement Partitioning**

```sql
-- Convert to partitioned table for better performance
CREATE TABLE user_activity_logs_new (
    LIKE user_activity_logs INCLUDING ALL
) PARTITION BY RANGE (created_at);

-- Create monthly partitions
CREATE TABLE user_activity_logs_2024_01
PARTITION OF user_activity_logs_new
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- Migrate data
INSERT INTO user_activity_logs_new SELECT * FROM user_activity_logs;

-- Rename tables
ALTER TABLE user_activity_logs RENAME TO user_activity_logs_old;
ALTER TABLE user_activity_logs_new RENAME TO user_activity_logs;
```

## Security Issues

### Unauthorized Access

#### Symptoms

- Users seeing other users' activities
- API calls succeeding without proper authentication
- Suspicious activity in logs

#### Diagnosis

```typescript
// Check authentication middleware
fastify.addHook('preHandler', async (request, reply) => {
  console.log('Auth check:', {
    url: request.url,
    method: request.method,
    user: request.user?.id,
    token: !!request.headers.authorization,
  });
});
```

#### Solutions

**Solution 1: Fix Authorization Checks**

```typescript
// Ensure proper authorization in controllers
export class UserActivityController {
  async getUserActivities(request: FastifyRequest, reply: FastifyReply) {
    // Verify user is authenticated
    if (!request.user || !request.user.id) {
      return reply.code(401).send({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'User not authenticated' },
      });
    }

    // Users can only access their own activities
    const requestedUserId = request.params.userId || request.user.id;
    if (requestedUserId !== request.user.id && request.user.role !== 'admin') {
      return reply.code(403).send({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Access denied' },
      });
    }

    // Proceed with request
    const activities = await this.service.getUserActivities(requestedUserId, request.query);
    return reply.send({ success: true, data: activities });
  }
}
```

### Data Privacy Issues

#### Symptoms

- Sensitive data exposed in logs
- Personal information visible to unauthorized users
- GDPR compliance concerns

#### Solutions

**Solution 1: Implement Data Masking**

```typescript
class DataPrivacyManager {
  maskActivityData(activity: ActivityLog, userRole: string): Partial<ActivityLog> {
    const masked = { ...activity };

    // Mask IP addresses for non-admin users
    if (userRole !== 'admin' && masked.ip_address) {
      masked.ip_address = this.maskIpAddress(masked.ip_address);
    }

    // Remove sensitive metadata
    if (masked.metadata && masked.metadata.sensitive_data) {
      delete masked.metadata.sensitive_data;
    }

    // Truncate user agent strings
    if (masked.user_agent && masked.user_agent.length > 100) {
      masked.user_agent = masked.user_agent.substring(0, 100) + '...';
    }

    return masked;
  }

  private maskIpAddress(ip: string): string {
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.xxx.xxx`;
    }
    return 'xxx.xxx.xxx.xxx';
  }
}
```

## Emergency Procedures

### System Recovery

#### Complete System Failure

```bash
#!/bin/bash
# Emergency recovery script

echo "Starting emergency recovery..."

# Stop all services
pm2 stop all
sudo systemctl stop nginx
sudo systemctl stop postgresql

# Check disk space
df -h

# Check for corrupted files
sudo fsck /dev/sda1

# Restart services in order
sudo systemctl start postgresql
sleep 10

# Test database connection
psql -h localhost -U activity_user -d activity_tracking_db -c "SELECT 1;"

if [ $? -eq 0 ]; then
    echo "Database is accessible"

    # Start application
    pm2 start ecosystem.config.js --env production
    sleep 30

    # Test API
    if curl -sf http://localhost:3333/health; then
        echo "API is responding"

        # Start reverse proxy
        sudo systemctl start nginx

        echo "Recovery completed successfully"
    else
        echo "API failed to start - manual intervention required"
    fi
else
    echo "Database connection failed - check PostgreSQL logs"
fi
```

#### Data Recovery

```sql
-- Point-in-time recovery procedure
-- 1. Stop the database
sudo systemctl stop postgresql

-- 2. Restore from backup
sudo -u postgres pg_restore -d activity_tracking_db /backup/activity_logs_latest.sql

-- 3. Apply WAL files for point-in-time recovery
sudo -u postgres pg_waldump /backup/wal/

-- 4. Start database
sudo systemctl start postgresql

-- 5. Verify data integrity
SELECT
  COUNT(*) as total_activities,
  MAX(created_at) as latest_activity,
  MIN(created_at) as oldest_activity
FROM user_activity_logs;
```

## Monitoring and Alerting

### Set Up Alerts

```bash
#!/bin/bash
# Alert configuration script

# API Health Alert
(crontab -l 2>/dev/null; echo "*/5 * * * * /opt/aegisx/scripts/check-api-health.sh") | crontab -

# Database Health Alert
(crontab -l 2>/dev/null; echo "*/10 * * * * /opt/aegisx/scripts/check-db-health.sh") | crontab -

# Disk Space Alert
(crontab -l 2>/dev/null; echo "0 */6 * * * /opt/aegisx/scripts/check-disk-space.sh") | crontab -
```

### Custom Health Checks

```typescript
// Custom health check endpoint
@Controller('/health')
export class HealthController {
  @Get('/detailed')
  async getDetailedHealth(): Promise<any> {
    const checks = await Promise.allSettled([this.checkDatabase(), this.checkRecentActivities(), this.checkBatchProcessing(), this.checkMemoryUsage()]);

    return {
      timestamp: new Date().toISOString(),
      status: checks.every((c) => c.status === 'fulfilled') ? 'healthy' : 'unhealthy',
      checks: checks.map((check, i) => ({
        name: ['database', 'recent_activities', 'batch_processing', 'memory'][i],
        status: check.status,
        details: check.status === 'fulfilled' ? check.value : check.reason,
      })),
    };
  }
}
```

---

This troubleshooting guide covers the most common issues you may encounter with the Activity Tracking System. For issues not covered here, check the system logs, enable debug logging, and consider reaching out to the development team with specific error messages and symptoms.
