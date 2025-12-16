# Error Logs API Reference

## Overview

The Error Logs API provides endpoints for logging, retrieving, and managing application errors. This API is essential for monitoring system health and troubleshooting issues.

**Base URL:** `/api/error-logs`
**Authentication:** Required (JWT Bearer Token)
**Permissions:** `monitoring:read` for GET endpoints, `monitoring:write` for DELETE endpoints

---

## Table of Contents

- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [List Error Logs](#list-error-logs)
  - [Get Error Log by ID](#get-error-log-by-id)
  - [Get Error Statistics](#get-error-statistics)
  - [Create Error Log](#create-error-log)
  - [Delete Error Log](#delete-error-log)
  - [Cleanup Old Errors](#cleanup-old-errors)
  - [Export Error Logs](#export-error-logs)
- [Data Models](#data-models)
- [Error Codes](#error-codes)
- [Examples](#examples)

---

## Authentication

All endpoints require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### Permissions Required

| Permission         | Access Level                   |
| ------------------ | ------------------------------ |
| `monitoring:read`  | View error logs and statistics |
| `monitoring:write` | Delete and cleanup error logs  |

---

## Endpoints

### List Error Logs

Retrieve a paginated list of error logs with filtering and sorting options.

**Endpoint:** `GET /api/error-logs`
**Permission:** `monitoring:read`

#### Query Parameters

| Parameter   | Type     | Required | Default | Description                               |
| ----------- | -------- | -------- | ------- | ----------------------------------------- |
| `page`      | integer  | No       | 1       | Page number for pagination                |
| `limit`     | integer  | No       | 20      | Number of items per page (max: 100)       |
| `sortBy`    | string   | No       | -       | Field to sort by                          |
| `sortOrder` | string   | No       | desc    | Sort order: `asc` or `desc`               |
| `level`     | string   | No       | -       | Filter by error level (error, warn, info) |
| `type`      | string   | No       | -       | Filter by error type                      |
| `userId`    | string   | No       | -       | Filter by user ID (UUID)                  |
| `startDate` | datetime | No       | -       | Filter errors after this date (ISO 8601)  |
| `endDate`   | datetime | No       | -       | Filter errors before this date (ISO 8601) |
| `search`    | string   | No       | -       | Search in message and stack trace         |

#### Response

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "level": "error",
        "message": "Failed to process payment",
        "type": "PaymentError",
        "stack": "Error: Failed to process payment\n    at PaymentService.process...",
        "metadata": {
          "orderId": "ORD-12345",
          "amount": 1500.0
        },
        "user_id": "123e4567-e89b-12d3-a456-426614174000",
        "ip_address": "192.168.1.100",
        "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
        "created_at": "2025-12-16T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalItems": 156,
      "totalPages": 8
    }
  }
}
```

#### cURL Example

```bash
curl -X GET "http://localhost:3000/api/error-logs?page=1&limit=20&level=error" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Get Error Log by ID

Retrieve detailed information about a specific error log.

**Endpoint:** `GET /api/error-logs/:id`
**Permission:** `monitoring:read`

#### Path Parameters

| Parameter | Type   | Required | Description    |
| --------- | ------ | -------- | -------------- |
| `id`      | string | Yes      | Error log UUID |

#### Response

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "level": "error",
    "message": "Failed to process payment",
    "type": "PaymentError",
    "stack": "Error: Failed to process payment\n    at PaymentService.process (payment.service.ts:45:15)\n    at processOrder (order.controller.ts:89:22)",
    "metadata": {
      "orderId": "ORD-12345",
      "amount": 1500.0,
      "paymentMethod": "credit_card",
      "gateway": "stripe"
    },
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "ip_address": "192.168.1.100",
    "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "created_at": "2025-12-16T10:30:00Z"
  }
}
```

#### cURL Example

```bash
curl -X GET "http://localhost:3000/api/error-logs/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Get Error Statistics

Retrieve aggregated statistics about error logs.

**Endpoint:** `GET /api/error-logs/stats`
**Permission:** `monitoring:read`

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
    "total": 1543,
    "byLevel": {
      "error": 892,
      "warn": 534,
      "info": 117
    },
    "byType": {
      "PaymentError": 234,
      "ValidationError": 189,
      "DatabaseError": 156,
      "NetworkError": 143,
      "AuthenticationError": 98,
      "Other": 723
    },
    "recentTrend": {
      "last24Hours": 67,
      "last7Days": 412,
      "last30Days": 1543
    }
  }
}
```

#### cURL Example

```bash
curl -X GET "http://localhost:3000/api/error-logs/stats?startDate=2025-12-01T00:00:00Z" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Create Error Log

Create a new error log entry. This endpoint is typically called automatically by error handling middleware or can be called manually for logging application errors.

**Endpoint:** `POST /api/error-logs`
**Permission:** Authenticated users (no specific permission required)

#### Request Body

```json
{
  "level": "error",
  "message": "Failed to process payment",
  "type": "PaymentError",
  "stack": "Error: Failed to process payment\n    at PaymentService.process...",
  "metadata": {
    "orderId": "ORD-12345",
    "amount": 1500.0
  }
}
```

#### Request Body Schema

| Field      | Type   | Required | Description                          |
| ---------- | ------ | -------- | ------------------------------------ |
| `level`    | string | Yes      | Error level: `error`, `warn`, `info` |
| `message`  | string | Yes      | Error message (max 500 characters)   |
| `type`     | string | No       | Error type/category                  |
| `stack`    | string | No       | Stack trace                          |
| `metadata` | object | No       | Additional context data              |

#### Response

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "level": "error",
    "message": "Failed to process payment",
    "type": "PaymentError",
    "created_at": "2025-12-16T10:30:00Z"
  }
}
```

#### cURL Example

```bash
curl -X POST "http://localhost:3000/api/error-logs" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "level": "error",
    "message": "Failed to process payment",
    "type": "PaymentError",
    "metadata": {"orderId": "ORD-12345"}
  }'
```

---

### Delete Error Log

Delete a specific error log entry.

**Endpoint:** `DELETE /api/error-logs/:id`
**Permission:** `monitoring:write`

#### Path Parameters

| Parameter | Type   | Required | Description    |
| --------- | ------ | -------- | -------------- |
| `id`      | string | Yes      | Error log UUID |

#### Response

```json
{
  "success": true,
  "message": "Error log deleted successfully"
}
```

#### cURL Example

```bash
curl -X DELETE "http://localhost:3000/api/error-logs/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Cleanup Old Errors

Delete error logs older than a specified number of days.

**Endpoint:** `DELETE /api/error-logs/cleanup`
**Permission:** `monitoring:write`

#### Query Parameters

| Parameter | Type    | Required | Default | Description                                     |
| --------- | ------- | -------- | ------- | ----------------------------------------------- |
| `days`    | integer | No       | 30      | Delete errors older than this many days         |
| `level`   | string  | No       | -       | Only cleanup specific level (error, warn, info) |

#### Response

```json
{
  "success": true,
  "data": {
    "deletedCount": 234,
    "message": "Cleaned up error logs older than 30 days"
  }
}
```

#### cURL Example

```bash
curl -X DELETE "http://localhost:3000/api/error-logs/cleanup?days=30" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Export Error Logs

Export error logs to CSV or JSON format.

**Endpoint:** `GET /api/error-logs/export`
**Permission:** `monitoring:read`

#### Query Parameters

| Parameter   | Type     | Required | Default | Description                    |
| ----------- | -------- | -------- | ------- | ------------------------------ |
| `format`    | string   | No       | csv     | Export format: `csv` or `json` |
| `level`     | string   | No       | -       | Filter by error level          |
| `startDate` | datetime | No       | -       | Export errors from this date   |
| `endDate`   | datetime | No       | -       | Export errors until this date  |

#### Response

Returns a downloadable file with appropriate Content-Type header.

**CSV Format:**

```
Content-Type: text/csv
Content-Disposition: attachment; filename="error-logs-2025-12-16.csv"
```

**JSON Format:**

```
Content-Type: application/json
Content-Disposition: attachment; filename="error-logs-2025-12-16.json"
```

#### cURL Example

```bash
# Export to CSV
curl -X GET "http://localhost:3000/api/error-logs/export?format=csv&level=error" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -o error-logs.csv

# Export to JSON
curl -X GET "http://localhost:3000/api/error-logs/export?format=json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -o error-logs.json
```

---

## Data Models

### ErrorLog

```typescript
interface ErrorLog {
  id: string; // UUID
  level: 'error' | 'warn' | 'info';
  message: string;
  type?: string;
  stack?: string;
  metadata?: Record<string, any>;
  user_id?: string; // UUID
  ip_address?: string;
  user_agent?: string;
  created_at: string; // ISO 8601 datetime
  updated_at: string; // ISO 8601 datetime
}
```

### ErrorStatistics

```typescript
interface ErrorStatistics {
  total: number;
  byLevel: {
    error: number;
    warn: number;
    info: number;
  };
  byType: Record<string, number>;
  recentTrend: {
    last24Hours: number;
    last7Days: number;
    last30Days: number;
  };
}
```

### PaginatedResponse

```typescript
interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}
```

---

## Error Codes

| Status Code | Error Code              | Description                             |
| ----------- | ----------------------- | --------------------------------------- |
| 400         | `VALIDATION_ERROR`      | Invalid request parameters              |
| 401         | `UNAUTHORIZED`          | Missing or invalid authentication token |
| 403         | `FORBIDDEN`             | Insufficient permissions                |
| 404         | `NOT_FOUND`             | Error log not found                     |
| 429         | `RATE_LIMIT_EXCEEDED`   | Too many requests                       |
| 500         | `INTERNAL_SERVER_ERROR` | Server error                            |

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid error level. Must be one of: error, warn, info",
    "details": {
      "field": "level",
      "value": "critical"
    }
  }
}
```

---

## Examples

### Example 1: Monitor Critical Errors

Get all critical errors from the last 24 hours:

```bash
#!/bin/bash

# Calculate timestamp 24 hours ago
START_DATE=$(date -u -d '24 hours ago' +"%Y-%m-%dT%H:%M:%SZ")

# Fetch critical errors
curl -X GET "http://localhost:3000/api/error-logs?level=error&startDate=$START_DATE&limit=100" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Accept: application/json" | jq '.data.items'
```

### Example 2: Search for Specific Error Type

Search for all payment-related errors:

```bash
curl -X GET "http://localhost:3000/api/error-logs?search=payment&type=PaymentError" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  | jq '.data.items[] | {id, message, created_at}'
```

### Example 3: Daily Cleanup Job

Automated cleanup of old error logs (run via cron):

```bash
#!/bin/bash
# cleanup-errors.sh - Run daily to clean up old error logs

API_URL="http://localhost:3000/api/error-logs/cleanup"
TOKEN="YOUR_JWT_TOKEN"
DAYS=90  # Keep logs for 90 days

RESPONSE=$(curl -s -X DELETE "$API_URL?days=$DAYS" \
  -H "Authorization: Bearer $TOKEN")

DELETED=$(echo $RESPONSE | jq '.data.deletedCount')
echo "$(date): Cleaned up $DELETED error logs older than $DAYS days"
```

### Example 4: Error Monitoring Dashboard

Get statistics for monitoring dashboard:

```bash
#!/bin/bash

# Get current statistics
curl -X GET "http://localhost:3000/api/error-logs/stats" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  | jq '{
      total: .data.total,
      errors: .data.byLevel.error,
      warnings: .data.byLevel.warn,
      last24h: .data.recentTrend.last24Hours
    }'
```

### Example 5: Manual Error Logging

Log a custom error from your application:

```javascript
// JavaScript/Node.js example
async function logError(error, context) {
  const response = await fetch('http://localhost:3000/api/error-logs', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      level: 'error',
      message: error.message,
      type: error.constructor.name,
      stack: error.stack,
      metadata: {
        ...context,
        timestamp: new Date().toISOString(),
      },
    }),
  });

  return response.json();
}

// Usage
try {
  await processPayment(order);
} catch (error) {
  await logError(error, {
    orderId: order.id,
    userId: user.id,
    action: 'process_payment',
  });
}
```

---

## Best Practices

### 1. Error Level Guidelines

- **error**: Use for critical errors that require immediate attention (payment failures, data corruption, system crashes)
- **warn**: Use for recoverable issues or degraded functionality (slow queries, deprecated API usage)
- **info**: Use for informational messages (successful operations with caveats, configuration changes)

### 2. Metadata Best Practices

Always include relevant context in metadata:

- User ID (if applicable)
- Entity IDs (order ID, product ID, etc.)
- Request parameters
- Timestamps
- Environment information

### 3. Cleanup Strategy

- Production: Keep errors for 90 days
- Staging: Keep errors for 30 days
- Development: Keep errors for 7 days

### 4. Search and Filtering

Use meaningful error types and messages to enable efficient searching and filtering in production environments.

### 5. Rate Limiting

Be mindful of rate limits when logging errors programmatically. Consider implementing:

- Batch logging for high-frequency errors
- Error aggregation to reduce duplicate logs
- Rate limiting in your error handler

---

## Rate Limits

| Endpoint Type | Limit        | Window   |
| ------------- | ------------ | -------- |
| Read (GET)    | 100 requests | 1 minute |
| Write (POST)  | 50 requests  | 1 minute |
| Delete        | 20 requests  | 1 minute |
| Export        | 5 requests   | 1 minute |

---

## Changelog

### v1.0.0 (2025-12-16)

- Initial API release
- Core CRUD operations
- Statistics endpoint
- Export functionality
- Cleanup automation

---

## Support

For issues or questions:

- GitHub Issues: https://github.com/aegisx-platform/aegisx-starter/issues
- Documentation: https://aegisx-platform.github.io/aegisx-starter-1/
- Email: support@aegisx.io
