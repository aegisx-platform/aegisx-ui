# Activity Logs API Reference

## Overview

The Activity Logs API provides comprehensive auditing capabilities for tracking user actions, system events, and data changes throughout the application.

**Base URL:** `/api/activity-logs`
**Authentication:** Required (JWT Bearer Token)
**Permissions:** `audit:read` for GET endpoints, `audit:admin` for DELETE/export endpoints

---

## Table of Contents

- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [List Activity Logs](#list-activity-logs)
  - [Get Activity Log by ID](#get-activity-log-by-id)
  - [Get Activity Statistics](#get-activity-statistics)
  - [Delete Activity Log](#delete-activity-log)
  - [Cleanup Old Activities](#cleanup-old-activities)
  - [Export Activity Logs](#export-activity-logs)
- [Data Models](#data-models)
- [Activity Actions](#activity-actions)
- [Examples](#examples)

---

## Authentication

All endpoints require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### Permissions Required

| Permission    | Access Level                           |
| ------------- | -------------------------------------- |
| `audit:read`  | View activity logs and statistics      |
| `audit:admin` | Delete, cleanup, and export activities |

---

## Endpoints

### List Activity Logs

Retrieve a paginated list of activity logs with filtering and sorting options.

**Endpoint:** `GET /api/activity-logs`
**Permission:** `audit:read`

#### Query Parameters

| Parameter    | Type     | Required | Default | Description                                         |
| ------------ | -------- | -------- | ------- | --------------------------------------------------- |
| `page`       | integer  | No       | 1       | Page number for pagination                          |
| `limit`      | integer  | No       | 20      | Number of items per page (max: 100)                 |
| `sortBy`     | string   | No       | -       | Field to sort by                                    |
| `sortOrder`  | string   | No       | desc    | Sort order: `asc` or `desc`                         |
| `action`     | string   | No       | -       | Filter by action type (see Activity Actions)        |
| `severity`   | string   | No       | -       | Filter by severity (info, warning, error, critical) |
| `userId`     | string   | No       | -       | Filter by user ID (UUID)                            |
| `entityType` | string   | No       | -       | Filter by entity type (user, order, product, etc.)  |
| `entityId`   | string   | No       | -       | Filter by entity ID                                 |
| `startDate`  | datetime | No       | -       | Filter activities after this date (ISO 8601)        |
| `endDate`    | datetime | No       | -       | Filter activities before this date (ISO 8601)       |
| `search`     | string   | No       | -       | Search in description and metadata                  |

#### Response

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "660e8400-e29b-41d4-a716-446655440000",
        "action": "user.login",
        "severity": "info",
        "description": "User logged in successfully",
        "user_id": "123e4567-e89b-12d3-a456-426614174000",
        "user_email": "john.doe@example.com",
        "user_name": "John Doe",
        "entity_type": "user",
        "entity_id": "123e4567-e89b-12d3-a456-426614174000",
        "metadata": {
          "ip": "192.168.1.100",
          "userAgent": "Mozilla/5.0...",
          "loginMethod": "password"
        },
        "ip_address": "192.168.1.100",
        "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
        "created_at": "2025-12-16T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalItems": 5432,
      "totalPages": 272
    }
  }
}
```

#### cURL Example

```bash
curl -X GET "http://localhost:3000/api/activity-logs?page=1&limit=20&action=user.login" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Get Activity Log by ID

Retrieve detailed information about a specific activity log.

**Endpoint:** `GET /api/activity-logs/:id`
**Permission:** `audit:read`

#### Path Parameters

| Parameter | Type   | Required | Description       |
| --------- | ------ | -------- | ----------------- |
| `id`      | string | Yes      | Activity log UUID |

#### Response

```json
{
  "success": true,
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "action": "order.updated",
    "severity": "info",
    "description": "Order status updated from 'pending' to 'processing'",
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "user_email": "admin@example.com",
    "user_name": "Admin User",
    "entity_type": "order",
    "entity_id": "ORD-12345",
    "metadata": {
      "previousStatus": "pending",
      "newStatus": "processing",
      "reason": "Payment confirmed",
      "changedFields": ["status", "updated_at"]
    },
    "ip_address": "192.168.1.100",
    "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "created_at": "2025-12-16T10:30:00Z"
  }
}
```

#### cURL Example

```bash
curl -X GET "http://localhost:3000/api/activity-logs/660e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Get Activity Statistics

Retrieve aggregated statistics about activity logs.

**Endpoint:** `GET /api/activity-logs/stats`
**Permission:** `audit:read`

#### Query Parameters

| Parameter   | Type     | Required | Default | Description                                |
| ----------- | -------- | -------- | ------- | ------------------------------------------ |
| `startDate` | datetime | No       | -       | Calculate stats from this date (ISO 8601)  |
| `endDate`   | datetime | No       | -       | Calculate stats until this date (ISO 8601) |

#### Response

```json
{
  "success": true,
  "data": {
    "total": 5432,
    "byAction": {
      "user.login": 1234,
      "user.logout": 1123,
      "order.created": 456,
      "order.updated": 789,
      "product.created": 234,
      "product.updated": 567,
      "other": 1029
    },
    "bySeverity": {
      "info": 4821,
      "warning": 456,
      "error": 123,
      "critical": 32
    },
    "topUsers": [
      {
        "user_id": "123e4567-e89b-12d3-a456-426614174000",
        "user_name": "Admin User",
        "count": 234
      }
    ],
    "recentTrend": {
      "last24Hours": 156,
      "last7Days": 892,
      "last30Days": 5432
    }
  }
}
```

#### cURL Example

```bash
curl -X GET "http://localhost:3000/api/activity-logs/stats?startDate=2025-12-01T00:00:00Z" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Delete Activity Log

Delete a specific activity log entry. Use with caution as this affects audit trail.

**Endpoint:** `DELETE /api/activity-logs/:id`
**Permission:** `audit:admin`

#### Path Parameters

| Parameter | Type   | Required | Description       |
| --------- | ------ | -------- | ----------------- |
| `id`      | string | Yes      | Activity log UUID |

#### Response

```json
{
  "success": true,
  "message": "Activity log deleted successfully"
}
```

#### cURL Example

```bash
curl -X DELETE "http://localhost:3000/api/activity-logs/660e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Cleanup Old Activities

Delete activity logs older than a specified number of days.

**Endpoint:** `DELETE /api/activity-logs/cleanup`
**Permission:** `audit:admin`

#### Query Parameters

| Parameter  | Type    | Required | Default | Description                                 |
| ---------- | ------- | -------- | ------- | ------------------------------------------- |
| `days`     | integer | No       | 90      | Delete activities older than this many days |
| `severity` | string  | No       | -       | Only cleanup specific severity level        |

#### Response

```json
{
  "success": true,
  "data": {
    "deletedCount": 1234,
    "message": "Cleaned up activity logs older than 90 days"
  }
}
```

#### cURL Example

```bash
curl -X DELETE "http://localhost:3000/api/activity-logs/cleanup?days=90" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Export Activity Logs

Export activity logs to CSV or JSON format.

**Endpoint:** `GET /api/activity-logs/export`
**Permission:** `audit:admin`

#### Query Parameters

| Parameter   | Type     | Required | Default | Description                       |
| ----------- | -------- | -------- | ------- | --------------------------------- |
| `format`    | string   | No       | csv     | Export format: `csv` or `json`    |
| `action`    | string   | No       | -       | Filter by action type             |
| `severity`  | string   | No       | -       | Filter by severity                |
| `userId`    | string   | No       | -       | Filter by user ID                 |
| `startDate` | datetime | No       | -       | Export activities from this date  |
| `endDate`   | datetime | No       | -       | Export activities until this date |

#### Response

Returns a downloadable file with appropriate Content-Type header.

**CSV Format:**

```
Content-Type: text/csv
Content-Disposition: attachment; filename="activity-logs-2025-12-16.csv"
```

**JSON Format:**

```
Content-Type: application/json
Content-Disposition: attachment; filename="activity-logs-2025-12-16.json"
```

#### cURL Example

```bash
# Export to CSV
curl -X GET "http://localhost:3000/api/activity-logs/export?format=csv&action=user.login" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -o activity-logs.csv

# Export to JSON
curl -X GET "http://localhost:3000/api/activity-logs/export?format=json&startDate=2025-12-01T00:00:00Z" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -o activity-logs.json
```

---

## Data Models

### ActivityLog

```typescript
interface ActivityLog {
  id: string; // UUID
  action: string; // Action type (e.g., 'user.login')
  severity: 'info' | 'warning' | 'error' | 'critical';
  description: string;
  user_id?: string; // UUID
  user_email?: string;
  user_name?: string;
  entity_type?: string; // Type of affected entity
  entity_id?: string; // ID of affected entity
  metadata?: Record<string, any>; // Additional context
  ip_address?: string;
  user_agent?: string;
  created_at: string; // ISO 8601 datetime
  updated_at: string; // ISO 8601 datetime
}
```

### ActivityStatistics

```typescript
interface ActivityStatistics {
  total: number;
  byAction: Record<string, number>;
  bySeverity: {
    info: number;
    warning: number;
    error: number;
    critical: number;
  };
  topUsers: Array<{
    user_id: string;
    user_name: string;
    count: number;
  }>;
  recentTrend: {
    last24Hours: number;
    last7Days: number;
    last30Days: number;
  };
}
```

---

## Activity Actions

Activity actions follow a hierarchical naming convention: `<entity>.<operation>`

### User Actions

| Action                  | Description          | Severity |
| ----------------------- | -------------------- | -------- |
| `user.login`            | User logged in       | info     |
| `user.logout`           | User logged out      | info     |
| `user.login_failed`     | Failed login attempt | warning  |
| `user.password_changed` | Password was changed | info     |
| `user.created`          | New user created     | info     |
| `user.updated`          | User profile updated | info     |
| `user.deleted`          | User account deleted | warning  |
| `user.role_changed`     | User role modified   | warning  |

### Order Actions

| Action            | Description           | Severity |
| ----------------- | --------------------- | -------- |
| `order.created`   | New order created     | info     |
| `order.updated`   | Order details updated | info     |
| `order.cancelled` | Order cancelled       | warning  |
| `order.completed` | Order completed       | info     |
| `order.refunded`  | Order refunded        | warning  |

### Product Actions

| Action              | Description             | Severity |
| ------------------- | ----------------------- | -------- |
| `product.created`   | New product added       | info     |
| `product.updated`   | Product details updated | info     |
| `product.deleted`   | Product removed         | warning  |
| `product.published` | Product made public     | info     |

### System Actions

| Action                  | Description                  | Severity |
| ----------------------- | ---------------------------- | -------- |
| `system.config_changed` | System configuration changed | warning  |
| `system.backup_created` | Backup created               | info     |
| `system.maintenance`    | Maintenance mode toggled     | warning  |

### API Key Actions

| Action           | Description              | Severity |
| ---------------- | ------------------------ | -------- |
| `apikey.created` | API key generated        | info     |
| `apikey.revoked` | API key revoked          | warning  |
| `apikey.used`    | API key used for request | info     |

---

## Examples

### Example 1: Track User Login Activity

Monitor login attempts for security analysis:

```bash
#!/bin/bash

# Get failed login attempts in the last 24 hours
START_DATE=$(date -u -d '24 hours ago' +"%Y-%m-%dT%H:%M:%SZ")

curl -X GET "http://localhost:3000/api/activity-logs?action=user.login_failed&startDate=$START_DATE" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  | jq '.data.items[] | {user_email, ip_address, created_at}'
```

### Example 2: Audit Trail for Specific Entity

Get all activities related to a specific order:

```bash
curl -X GET "http://localhost:3000/api/activity-logs?entityType=order&entityId=ORD-12345" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  | jq '.data.items[] | {action, user_name, description, created_at}'
```

### Example 3: Monitor Critical Activities

Get real-time critical activities:

```bash
#!/bin/bash
# monitor-critical.sh - Run in cron every 5 minutes

API_URL="http://localhost:3000/api/activity-logs"
TOKEN="YOUR_JWT_TOKEN"

# Get activities from last 5 minutes
START_DATE=$(date -u -d '5 minutes ago' +"%Y-%m-%dT%H:%M:%SZ")

CRITICAL=$(curl -s "$API_URL?severity=critical&startDate=$START_DATE" \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.data.items')

COUNT=$(echo $CRITICAL | jq 'length')

if [ "$COUNT" -gt 0 ]; then
  echo "⚠️  ALERT: $COUNT critical activities detected!"
  echo $CRITICAL | jq '.[] | {action, user_name, description}'
  # Send notification (email, Slack, etc.)
fi
```

### Example 4: User Activity Report

Generate activity report for a specific user:

```bash
#!/bin/bash
USER_ID="123e4567-e89b-12d3-a456-426614174000"
START_DATE="2025-12-01T00:00:00Z"
END_DATE="2025-12-31T23:59:59Z"

curl -X GET "http://localhost:3000/api/activity-logs?userId=$USER_ID&startDate=$START_DATE&endDate=$END_DATE&limit=1000" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  | jq '{
      user: .data.items[0].user_name,
      totalActivities: .data.pagination.totalItems,
      actions: [.data.items[] | .action] | group_by(.) | map({action: .[0], count: length})
    }'
```

### Example 5: Export Compliance Report

Export activity logs for compliance audit:

```bash
#!/bin/bash
# Generate monthly compliance report

MONTH="2025-12"
START_DATE="${MONTH}-01T00:00:00Z"
END_DATE="${MONTH}-31T23:59:59Z"

curl -X GET "http://localhost:3000/api/activity-logs/export?format=csv&startDate=$START_DATE&endDate=$END_DATE" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -o "compliance-report-${MONTH}.csv"

echo "Compliance report generated: compliance-report-${MONTH}.csv"
```

### Example 6: Real-time Activity Monitoring (WebSocket)

If WebSocket is enabled, subscribe to real-time activity updates:

```javascript
// JavaScript/Node.js example
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: {
    token: 'YOUR_JWT_TOKEN',
  },
});

// Subscribe to activity log events
socket.on('activity:created', (activity) => {
  console.log('New activity:', activity);

  // Alert on critical activities
  if (activity.severity === 'critical') {
    console.error('🚨 CRITICAL ACTIVITY:', activity.description);
    sendAlert(activity);
  }
});

// Subscribe to specific action types
socket.emit('subscribe', { action: 'user.login_failed' });

socket.on('activity:user.login_failed', (activity) => {
  console.warn('Failed login attempt:', {
    email: activity.user_email,
    ip: activity.ip_address,
    time: activity.created_at,
  });
});
```

---

## Best Practices

### 1. Severity Level Guidelines

- **info**: Normal operations (login, logout, read operations)
- **warning**: Important changes that require awareness (role changes, configuration updates)
- **error**: Failed operations or validation errors
- **critical**: Security incidents, data breaches, system failures

### 2. Activity Logging Best Practices

**DO:**

- Log all user authentication events
- Log all data modifications (create, update, delete)
- Include relevant entity IDs for traceability
- Store IP address and user agent for security analysis
- Use consistent action naming conventions

**DON'T:**

- Log sensitive data (passwords, credit cards) in metadata
- Log every read operation (can cause storage issues)
- Use generic action names ("action" is better than "do_something")

### 3. Metadata Best Practices

Structure metadata consistently:

```json
{
  "metadata": {
    "previousValue": "old_status",
    "newValue": "new_status",
    "changedFields": ["status", "updated_at"],
    "reason": "User request",
    "additionalContext": {}
  }
}
```

### 4. Retention Policy

Recommended retention periods by severity:

- **critical**: 365 days (1 year)
- **error**: 180 days (6 months)
- **warning**: 90 days (3 months)
- **info**: 30 days (1 month)

### 5. Performance Considerations

- Use pagination for large result sets
- Apply date range filters to limit query scope
- Create database indexes on frequently queried fields:
  - `action`
  - `user_id`
  - `entity_type` + `entity_id`
  - `created_at`
  - `severity`

### 6. Compliance Requirements

For compliance (GDPR, HIPAA, SOC 2):

- Never delete critical activities
- Implement role-based access control
- Export capabilities for audit requests
- Immutable logging (no updates after creation)
- Regular backup of activity logs

---

## Rate Limits

| Endpoint Type | Limit        | Window   |
| ------------- | ------------ | -------- |
| Read (GET)    | 100 requests | 1 minute |
| Delete        | 10 requests  | 1 minute |
| Export        | 5 requests   | 1 minute |

---

## Integration Examples

### Automatic Activity Logging Middleware

```typescript
// Fastify middleware example
import { FastifyRequest, FastifyReply } from 'fastify';
import { ActivityLogsService } from './activity-logs.service';

async function activityLoggingHook(request: FastifyRequest, reply: FastifyReply) {
  const activityService = new ActivityLogsService();

  // Log after request completes
  reply.addHook('onSend', async (request, reply, payload) => {
    // Only log state-changing operations
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
      await activityService.create({
        action: `${request.routeOptions.url}.${request.method.toLowerCase()}`,
        severity: 'info',
        description: `${request.method} ${request.routeOptions.url}`,
        user_id: request.user?.id,
        user_email: request.user?.email,
        user_name: request.user?.name,
        metadata: {
          method: request.method,
          url: request.url,
          statusCode: reply.statusCode,
        },
        ip_address: request.ip,
        user_agent: request.headers['user-agent'],
      });
    }
  });
}
```

---

## Changelog

### v1.0.0 (2025-12-16)

- Initial API release
- Core CRUD operations
- Statistics endpoint
- Export functionality
- Real-time WebSocket support

---

## Support

For issues or questions:

- GitHub Issues: https://github.com/aegisx-platform/aegisx-starter/issues
- Documentation: https://aegisx-platform.github.io/aegisx-starter-1/
- Email: support@aegisx.io
