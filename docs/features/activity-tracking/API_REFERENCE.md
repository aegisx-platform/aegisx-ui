# Activity Tracking System - API Reference

## Overview

This document provides complete API documentation for the Activity Tracking System endpoints. All endpoints require authentication and return standardized JSON responses.

## Base URL

```
Production: https://api.aegisx.com
Development: http://localhost:3333
```

## Authentication

All activity tracking endpoints require valid authentication. Include the JWT token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

## Standard Response Format

All endpoints follow the standardized API response format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
```

## Endpoints

### Get User Activities

Retrieve paginated user activity logs with optional filtering.

```http
GET /api/profile/activity
```

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number (minimum: 1) |
| `limit` | integer | No | 20 | Items per page (1-100) |
| `action` | string | No | - | Filter by specific action type |
| `severity` | string | No | - | Filter by severity: `info`, `warning`, `error`, `critical` |
| `from_date` | string | No | - | Start date filter (YYYY-MM-DD format) |
| `to_date` | string | No | - | End date filter (YYYY-MM-DD format) |
| `search` | string | No | - | Search in activity descriptions |

#### Example Request

```http
GET /api/profile/activity?page=1&limit=20&action=login&severity=warning&search=failed
```

#### Success Response (200)

```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "user_id": "user-123",
        "action": "login_failed",
        "description": "Failed login attempt",
        "severity": "warning",
        "ip_address": "192.168.1.100",
        "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "session_id": "sess_abc123",
        "request_id": "req_xyz789",
        "device_info": {
          "browser": "Chrome",
          "os": "Windows",
          "device": "Desktop",
          "isMobile": false,
          "isDesktop": true,
          "isTablet": false
        },
        "location_info": {
          "country": "US",
          "city": "San Francisco",
          "timezone": "America/Los_Angeles"
        },
        "metadata": {
          "attempt_count": 3,
          "reason": "invalid_password"
        },
        "created_at": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### Error Response (400)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid query parameters",
    "details": {
      "page": "must be greater than 0",
      "limit": "must be between 1 and 100"
    }
  }
}
```

#### Error Response (401)

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "User not authenticated"
  }
}
```

#### Error Response (500)

```json
{
  "success": false,
  "error": {
    "code": "ACTIVITY_FETCH_ERROR",
    "message": "Failed to retrieve activity logs"
  }
}
```

### Get Activity Statistics

Retrieve comprehensive activity statistics for the authenticated user.

```http
GET /api/profile/activity/stats
```

#### Success Response (200)

```json
{
  "success": true,
  "data": {
    "total_activities": 1250,
    "activities_by_action": {
      "login": 45,
      "logout": 43,
      "profile_update": 12,
      "password_change": 3,
      "login_failed": 8,
      "profile_view": 892,
      "preferences_update": 15
    },
    "activities_by_severity": {
      "info": 1180,
      "warning": 55,
      "error": 12,
      "critical": 3
    },
    "recent_activities_count": {
      "today": 8,
      "this_week": 42,
      "this_month": 156
    },
    "unique_devices": 4,
    "unique_locations": 2,
    "last_activity": "2024-01-15T15:45:32.000Z"
  }
}
```

#### Error Response (500)

```json
{
  "success": false,
  "error": {
    "code": "ACTIVITY_STATS_ERROR",
    "message": "Failed to retrieve activity statistics"
  }
}
```

### Get Activity Sessions

Retrieve user activity sessions grouped by session ID.

```http
GET /api/profile/activity/sessions
```

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number (minimum: 1) |
| `limit` | integer | No | 10 | Items per page (1-50) |

#### Example Request

```http
GET /api/profile/activity/sessions?page=1&limit=10
```

#### Success Response (200)

```json
{
  "success": true,
  "data": {
    "sessions": [
      {
        "session_id": "sess_abc123def456",
        "start_time": "2024-01-15T09:00:00.000Z",
        "end_time": "2024-01-15T17:30:00.000Z",
        "ip_address": "192.168.1.100",
        "device_info": {
          "browser": "Chrome",
          "os": "Windows",
          "device": "Desktop"
        },
        "location_info": {
          "country": "US",
          "city": "San Francisco"
        },
        "activities_count": 25,
        "is_active": false
      },
      {
        "session_id": "sess_xyz789ghi012",
        "start_time": "2024-01-15T18:00:00.000Z",
        "end_time": null,
        "ip_address": "10.0.0.5",
        "device_info": {
          "browser": "Safari",
          "os": "iOS",
          "device": "Mobile"
        },
        "location_info": {
          "country": "US",
          "city": "San Francisco"
        },
        "activities_count": 8,
        "is_active": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 32,
      "pages": 4,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### Error Response (500)

```json
{
  "success": false,
  "error": {
    "code": "ACTIVITY_SESSIONS_ERROR",
    "message": "Failed to retrieve activity sessions"
  }
}
```

### Manual Activity Logging

Create a new activity log entry manually (typically for internal/admin use).

```http
POST /api/profile/activity/log
```

#### Request Body

```json
{
  "action": "custom_action",
  "description": "User performed a custom action",
  "severity": "info",
  "metadata": {
    "custom_field": "value",
    "additional_info": "details"
  }
}
```

#### Request Body Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `action` | string | Yes | Action type (1-100 characters) |
| `description` | string | Yes | Human readable description |
| `severity` | string | No | Severity level: `info` (default), `warning`, `error`, `critical` |
| `metadata` | object | No | Additional action-specific data |

#### Success Response (201)

```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "user_id": "user-123",
    "action": "custom_action",
    "description": "User performed a custom action",
    "severity": "info",
    "ip_address": "192.168.1.100",
    "user_agent": "Mozilla/5.0...",
    "session_id": "sess_abc123",
    "request_id": "req_xyz789",
    "device_info": {
      "browser": "Chrome",
      "os": "Windows",
      "device": "Desktop"
    },
    "location_info": null,
    "metadata": {
      "custom_field": "value",
      "additional_info": "details"
    },
    "created_at": "2024-01-15T16:20:00.000Z"
  }
}
```

#### Error Response (400)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": {
      "action": "is required",
      "description": "must be at least 1 character"
    }
  }
}
```

#### Error Response (500)

```json
{
  "success": false,
  "error": {
    "code": "ACTIVITY_LOG_ERROR",
    "message": "Failed to log activity"
  }
}
```

## Data Models

### ActivityLog

Complete activity log entry with all fields.

```typescript
interface ActivityLog {
  id: string;                           // UUID primary key
  user_id: string;                      // UUID reference to user
  action: string;                       // Action type (max 100 chars)
  description: string;                  // Human readable description
  severity: 'info' | 'warning' | 'error' | 'critical';
  ip_address?: string;                  // Client IP address (max 45 chars)
  user_agent?: string;                  // User agent string
  session_id?: string;                  // Session identifier (max 128 chars)
  request_id?: string;                  // Request correlation ID (max 64 chars)
  device_info?: DeviceInfo;             // Parsed device information
  location_info?: LocationInfo;         // Geographic location data
  metadata?: Record<string, any>;       // Additional custom data
  created_at: string;                   // ISO timestamp
}
```

### DeviceInfo

Device and browser information parsed from user agent.

```typescript
interface DeviceInfo {
  browser?: string;                     // Browser name (Chrome, Firefox, etc.)
  os?: string;                          // Operating system (Windows, macOS, etc.)
  device?: string;                      // Device type (Desktop, Mobile, Tablet)
  isMobile?: boolean;                   // Is mobile device
  isDesktop?: boolean;                  // Is desktop device
  isTablet?: boolean;                   // Is tablet device
}
```

### LocationInfo

Geographic location information (IP-based).

```typescript
interface LocationInfo {
  country?: string;                     // Country code or name
  city?: string;                        // City name
  timezone?: string;                    // Timezone identifier
}
```

### ActivitySession

Session-grouped activity information.

```typescript
interface ActivitySession {
  session_id: string;                   // Session identifier
  start_time: string;                   // Session start time (ISO)
  end_time?: string;                    // Session end time (ISO) or null if active
  ip_address?: string;                  // Session IP address
  device_info?: Partial<DeviceInfo>;    // Device information
  location_info?: Partial<LocationInfo>; // Location information
  activities_count: number;             // Number of activities in session
  is_active: boolean;                   // Is session currently active
}
```

### ActivityStats

Comprehensive activity statistics.

```typescript
interface ActivityStats {
  total_activities: number;             // Lifetime activity count
  activities_by_action: Record<string, number>; // Activity counts by action type
  activities_by_severity: {             // Activity counts by severity
    info: number;
    warning: number;
    error: number;
    critical: number;
  };
  recent_activities_count: {            // Recent activity counts
    today: number;
    this_week: number;
    this_month: number;
  };
  unique_devices: number;               // Number of unique devices used
  unique_locations: number;             // Number of unique locations
  last_activity?: string;               // Last activity timestamp (ISO)
}
```

### Pagination

Standard pagination information.

```typescript
interface Pagination {
  page: number;                         // Current page number
  limit: number;                        // Items per page
  total: number;                        // Total number of items
  pages: number;                        // Total number of pages
  hasNext: boolean;                     // Has next page
  hasPrev: boolean;                     // Has previous page
}
```

## Activity Action Types

Standard activity action constants used throughout the system.

### Authentication Actions

| Action | Description |
|--------|-------------|
| `login` | Successful user login |
| `logout` | User logout |
| `login_failed` | Failed login attempt |
| `password_reset_request` | Password reset requested |
| `password_reset_complete` | Password reset completed |

### Profile Management Actions

| Action | Description |
|--------|-------------|
| `profile_view` | Profile page accessed |
| `profile_update` | Profile information updated |
| `password_change` | Password changed |
| `avatar_upload` | Profile avatar uploaded |
| `avatar_delete` | Profile avatar removed |

### Preferences Actions

| Action | Description |
|--------|-------------|
| `preferences_view` | Preferences page accessed |
| `preferences_update` | User preferences updated |
| `theme_change` | UI theme changed |
| `language_change` | Language preference changed |

### Security Actions

| Action | Description |
|--------|-------------|
| `session_created` | New session established |
| `session_destroyed` | Session terminated |
| `suspicious_activity` | Suspicious behavior detected |
| `account_locked` | Account locked for security |
| `account_unlocked` | Account unlocked |

### System Actions

| Action | Description |
|--------|-------------|
| `api_error` | API endpoint error occurred |
| `validation_error` | Data validation failed |

## Error Codes

Standard error codes returned by activity tracking endpoints.

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | User not authenticated |
| `FORBIDDEN` | 403 | User not authorized to access resource |
| `VALIDATION_ERROR` | 400 | Invalid request parameters or body |
| `ACTIVITY_FETCH_ERROR` | 500 | Failed to retrieve activities |
| `ACTIVITY_STATS_ERROR` | 500 | Failed to retrieve statistics |
| `ACTIVITY_SESSIONS_ERROR` | 500 | Failed to retrieve sessions |
| `ACTIVITY_LOG_ERROR` | 500 | Failed to create activity log |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_SERVER_ERROR` | 500 | Generic server error |

## Rate Limiting

Activity tracking endpoints are rate limited to prevent abuse:

- **Standard endpoints**: 100 requests per minute per user
- **Stats endpoint**: 30 requests per minute per user
- **Manual logging**: 10 requests per minute per user

Rate limit headers are included in responses:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642262400
```

## Code Examples

### JavaScript/TypeScript

```typescript
// Activity API client
class ActivityApiClient {
  constructor(private baseUrl: string, private token: string) {}

  async getActivities(filters?: {
    page?: number;
    limit?: number;
    action?: string;
    severity?: string;
    from_date?: string;
    to_date?: string;
    search?: string;
  }) {
    const params = new URLSearchParams();
    Object.entries(filters || {}).forEach(([key, value]) => {
      if (value !== undefined) params.set(key, value.toString());
    });

    const response = await fetch(
      `${this.baseUrl}/api/profile/activity?${params}`,
      {
        headers: { 'Authorization': `Bearer ${this.token}` }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async getStats() {
    const response = await fetch(
      `${this.baseUrl}/api/profile/activity/stats`,
      {
        headers: { 'Authorization': `Bearer ${this.token}` }
      }
    );

    return response.json();
  }

  async logActivity(activity: {
    action: string;
    description: string;
    severity?: string;
    metadata?: any;
  }) {
    const response = await fetch(
      `${this.baseUrl}/api/profile/activity/log`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(activity)
      }
    );

    return response.json();
  }
}

// Usage example
const client = new ActivityApiClient('http://localhost:3333', 'your-jwt-token');

// Get recent login activities
const loginActivities = await client.getActivities({
  action: 'login',
  limit: 50
});

// Get activity statistics
const stats = await client.getStats();

// Log custom activity
await client.logActivity({
  action: 'custom_feature_access',
  description: 'User accessed premium feature',
  severity: 'info',
  metadata: { feature_id: 'premium-dashboard' }
});
```

### Python

```python
import requests
from typing import Optional, Dict, Any

class ActivityApiClient:
    def __init__(self, base_url: str, token: str):
        self.base_url = base_url
        self.headers = {'Authorization': f'Bearer {token}'}

    def get_activities(self, **filters) -> Dict[str, Any]:
        """Get user activities with optional filters."""
        params = {k: v for k, v in filters.items() if v is not None}
        response = requests.get(
            f"{self.base_url}/api/profile/activity",
            headers=self.headers,
            params=params
        )
        response.raise_for_status()
        return response.json()

    def get_stats(self) -> Dict[str, Any]:
        """Get activity statistics."""
        response = requests.get(
            f"{self.base_url}/api/profile/activity/stats",
            headers=self.headers
        )
        response.raise_for_status()
        return response.json()

    def log_activity(self, action: str, description: str, 
                    severity: str = 'info', metadata: Optional[Dict] = None) -> Dict[str, Any]:
        """Log a custom activity."""
        data = {
            'action': action,
            'description': description,
            'severity': severity
        }
        if metadata:
            data['metadata'] = metadata

        response = requests.post(
            f"{self.base_url}/api/profile/activity/log",
            headers={**self.headers, 'Content-Type': 'application/json'},
            json=data
        )
        response.raise_for_status()
        return response.json()

# Usage example
client = ActivityApiClient('http://localhost:3333', 'your-jwt-token')

# Get failed login attempts
failed_logins = client.get_activities(
    action='login_failed',
    severity='warning',
    limit=20
)

# Get statistics
stats = client.get_stats()
print(f"Total activities: {stats['data']['total_activities']}")

# Log custom activity
client.log_activity(
    action='data_export',
    description='User exported personal data',
    severity='info',
    metadata={'export_format': 'json', 'record_count': 1500}
)
```

### cURL Examples

```bash
# Get recent activities
curl -X GET "http://localhost:3333/api/profile/activity?page=1&limit=20" \
  -H "Authorization: Bearer your-jwt-token"

# Get activities with filters
curl -X GET "http://localhost:3333/api/profile/activity?action=login&severity=warning&from_date=2024-01-01" \
  -H "Authorization: Bearer your-jwt-token"

# Get activity statistics
curl -X GET "http://localhost:3333/api/profile/activity/stats" \
  -H "Authorization: Bearer your-jwt-token"

# Get activity sessions
curl -X GET "http://localhost:3333/api/profile/activity/sessions?page=1&limit=10" \
  -H "Authorization: Bearer your-jwt-token"

# Log custom activity
curl -X POST "http://localhost:3333/api/profile/activity/log" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "feature_access",
    "description": "User accessed premium feature",
    "severity": "info",
    "metadata": {"feature": "advanced_analytics"}
  }'
```

## Testing

### API Testing with Jest

```typescript
describe('Activity API Endpoints', () => {
  it('should get user activities with pagination', async () => {
    const response = await request(app)
      .get('/api/profile/activity')
      .query({ page: 1, limit: 10 })
      .set('Authorization', `Bearer ${validToken}`)
      .expect(200);

    expect(response.body).toMatchObject({
      success: true,
      data: {
        activities: expect.any(Array),
        pagination: expect.objectContaining({
          page: 1,
          limit: 10,
          total: expect.any(Number)
        })
      }
    });
  });

  it('should filter activities by action', async () => {
    const response = await request(app)
      .get('/api/profile/activity')
      .query({ action: 'login' })
      .set('Authorization', `Bearer ${validToken}`)
      .expect(200);

    response.body.data.activities.forEach(activity => {
      expect(activity.action).toBe('login');
    });
  });
});
```

### Integration Testing

```typescript
describe('Activity Tracking Integration', () => {
  it('should automatically log profile view activity', async () => {
    // Make API call that should trigger activity logging
    await request(app)
      .get('/api/profile')
      .set('Authorization', `Bearer ${validToken}`)
      .expect(200);

    // Verify activity was logged
    const activities = await request(app)
      .get('/api/profile/activity')
      .set('Authorization', `Bearer ${validToken}`)
      .expect(200);

    const profileViewActivity = activities.body.data.activities
      .find(a => a.action === 'profile_view');
      
    expect(profileViewActivity).toBeDefined();
  });
});
```

---

This API reference provides complete documentation for integrating with the Activity Tracking System, including detailed endpoint specifications, data models, error handling, and practical code examples in multiple languages.