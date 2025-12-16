# Monitoring & Audit System

## Overview

The Monitoring & Audit System provides comprehensive logging, tracking, and management capabilities for monitoring application errors, user activities, API access, and user profiles.

**Version:** 1.0.0
**Status:** ✅ Production Ready
**Last Updated:** 2025-12-16

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Modules](#modules)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Frontend Pages](#frontend-pages)
- [Use Cases](#use-cases)
- [Permissions](#permissions)
- [Configuration](#configuration)
- [Best Practices](#best-practices)

---

## Features

### Error Logging & Monitoring

- **Centralized Error Tracking** - Capture and log all application errors in one place
- **Level-based Filtering** - Organize errors by severity (error, warn, info)
- **Type Categorization** - Group errors by type for easier analysis
- **Search & Filter** - Advanced search and filtering capabilities
- **Statistics Dashboard** - Real-time error statistics and trends
- **Export Functionality** - Export error logs to CSV or JSON
- **Automated Cleanup** - Scheduled cleanup of old error logs
- **Redis Caching** - Cached statistics for improved performance

### Activity Auditing

- **Comprehensive Audit Trail** - Track all user actions and system events
- **Timeline Visualization** - Beautiful timeline view of activities
- **Severity Levels** - Categorize activities by severity (info, warning, error, critical)
- **User Activity Tracking** - Monitor specific user activities
- **Entity Tracking** - Track changes to specific entities (orders, products, etc.)
- **Search & Filter** - Advanced filtering by action, user, entity, date
- **Export for Compliance** - Export audit logs for compliance requirements
- **Real-time Updates** - WebSocket support for real-time activity monitoring

### User Profile Management

- **Profile Information** - Manage basic user information (name, email, department)
- **Department Integration** - Link users to departments with validation
- **Avatar Management** - Upload, display, and delete user avatars
- **Image Processing** - Automatic resize to 200x200px and WebP conversion
- **User Preferences** - Theme, language, and notification preferences
- **Activity History** - View user's recent activities
- **Real-time Theme Switching** - Theme changes apply immediately
- **Responsive Design** - Mobile-friendly profile pages

### API Keys Management

- **Secure Key Generation** - Generate cryptographically secure API keys
- **Permission-based Access** - Granular permission control per key
- **Key Lifecycle Management** - Create, view, update, and revoke keys
- **Usage Tracking** - Track API key usage with detailed statistics
- **Expiration Management** - Set expiration dates for keys
- **Usage Analytics** - View usage by endpoint and over time
- **Security Features** - Bcrypt hashing, prefix display, one-time key reveal
- **Revocation** - Instant key revocation with audit trail

---

## Architecture

### Backend Architecture

```
apps/api/src/layers/
├── core/
│   └── audit/
│       ├── error-logs/          # Error logging module
│       │   ├── error-logs.schemas.ts
│       │   ├── error-logs.repository.ts
│       │   ├── error-logs.service.ts
│       │   ├── error-logs.controller.ts
│       │   ├── error-logs.routes.ts
│       │   └── error-logs.plugin.ts
│       └── activity-logs/       # Activity auditing module
│           ├── activity-logs.schemas.ts
│           ├── activity-logs.repository.ts
│           ├── activity-logs.service.ts
│           ├── activity-logs.controller.ts
│           ├── activity-logs.routes.ts
│           └── activity-logs.plugin.ts
└── platform/
    ├── user-profile/            # User profile module
    │   ├── schemas/
    │   ├── repositories/
    │   ├── services/
    │   │   ├── profile.service.ts
    │   │   └── avatar.service.ts
    │   ├── controllers/
    │   │   ├── profile.controller.ts
    │   │   ├── avatar.controller.ts
    │   │   ├── preferences.controller.ts
    │   │   └── activity.controller.ts
    │   ├── routes/
    │   └── user-profile.plugin.ts
    └── api-keys/                # API keys module
        ├── api-keys.schemas.ts
        ├── api-keys.repository.ts
        ├── api-keys.service.ts
        ├── services/
        │   └── crypto.service.ts
        ├── middleware/
        │   └── api-key-auth.middleware.ts
        ├── api-keys.controller.ts
        ├── api-keys.routes.ts
        └── api-keys.plugin.ts
```

### Frontend Architecture

```
apps/web/src/app/
├── core/
│   ├── monitoring/
│   │   ├── pages/
│   │   │   ├── error-logs/
│   │   │   │   ├── error-logs-list.page.ts
│   │   │   │   ├── error-logs-detail.page.ts
│   │   │   │   └── error-logs.config.ts
│   │   │   └── activity-logs/
│   │   │       ├── activity-logs-list.page.ts
│   │   │       ├── activity-logs-detail.page.ts
│   │   │       └── activity-logs.config.ts
│   │   └── services/
│   │       ├── error-logs.service.ts
│   │       └── activity-logs.service.ts
│   ├── users/
│   │   ├── pages/
│   │   │   └── profile/
│   │   │       ├── profile.page.ts
│   │   │       └── components/
│   │   │           ├── profile-info.component.ts
│   │   │           ├── profile-avatar.component.ts
│   │   │           ├── profile-preferences.component.ts
│   │   │           └── profile-activity.component.ts
│   │   └── services/
│   │       └── user.service.ts  # Extended with profile methods
│   └── api-keys/
│       ├── pages/
│       │   ├── api-keys-list.page.ts
│       │   ├── api-keys-detail.page.ts
│       │   └── components/
│       │       └── api-key-wizard.component.ts
│       └── services/
│           └── api-keys.service.ts
└── shared/
    └── components/
        └── data-table/
            └── data-table.component.ts  # Reusable table component
```

### Database Schema

```sql
-- Error Logs
CREATE TABLE error_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level VARCHAR(10) NOT NULL,  -- error, warn, info
  message TEXT NOT NULL,
  type VARCHAR(100),
  stack TEXT,
  metadata JSONB,
  user_id UUID REFERENCES users(id),
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Activity Logs
CREATE TABLE user_activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action VARCHAR(100) NOT NULL,  -- e.g., 'user.login', 'order.created'
  severity VARCHAR(20) NOT NULL,  -- info, warning, error, critical
  description TEXT,
  user_id UUID REFERENCES users(id),
  user_email VARCHAR(255),
  user_name VARCHAR(255),
  entity_type VARCHAR(50),
  entity_id VARCHAR(100),
  metadata JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- API Keys
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  key_hash VARCHAR(255) NOT NULL UNIQUE,
  key_prefix VARCHAR(20) NOT NULL,
  permissions TEXT[] NOT NULL,
  last_used_at TIMESTAMP,
  usage_count INTEGER DEFAULT 0,
  expires_at TIMESTAMP,
  revoked BOOLEAN DEFAULT FALSE,
  revoked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_error_logs_level ON error_logs(level);
CREATE INDEX idx_error_logs_created_at ON error_logs(created_at DESC);
CREATE INDEX idx_activity_logs_action ON user_activity_logs(action);
CREATE INDEX idx_activity_logs_user_id ON user_activity_logs(user_id);
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash);
```

---

## Modules

### 1. Error Logs Module

**Purpose:** Centralized error logging and monitoring

**Backend Endpoints:**

- `GET /api/error-logs` - List error logs with filtering
- `GET /api/error-logs/:id` - Get error log details
- `GET /api/error-logs/stats` - Get error statistics
- `POST /api/error-logs` - Create error log
- `DELETE /api/error-logs/:id` - Delete error log
- `DELETE /api/error-logs/cleanup` - Cleanup old errors
- `GET /api/error-logs/export` - Export error logs

**Frontend Pages:**

- `/monitoring/error-logs` - Error logs list with filters and stats
- `/monitoring/error-logs/:id` - Error log detail view

**Key Features:**

- Real-time error tracking
- Advanced filtering (level, type, date, user)
- Statistics dashboard with trends
- Export to CSV/JSON
- Automated cleanup

### 2. Activity Logs Module

**Purpose:** Comprehensive audit trail for user actions and system events

**Backend Endpoints:**

- `GET /api/activity-logs` - List activity logs with filtering
- `GET /api/activity-logs/:id` - Get activity log details
- `GET /api/activity-logs/stats` - Get activity statistics
- `DELETE /api/activity-logs/:id` - Delete activity log
- `DELETE /api/activity-logs/cleanup` - Cleanup old activities
- `GET /api/activity-logs/export` - Export activity logs

**Frontend Pages:**

- `/monitoring/activity-logs` - Activity logs with timeline view
- `/monitoring/activity-logs/:id` - Activity log detail view

**Key Features:**

- Timeline visualization
- Severity-based color coding
- User and entity tracking
- Toggle between timeline and table views
- Real-time WebSocket updates (optional)
- Export for compliance

### 3. User Profile Module

**Purpose:** Enhanced user profile management with avatar and preferences

**Backend Endpoints:**

- `GET /api/v1/platform/profile` - Get user profile
- `PUT /api/v1/platform/profile` - Update user profile
- `POST /api/v1/platform/profile/avatar` - Upload avatar
- `DELETE /api/v1/platform/profile/avatar` - Delete avatar
- `GET /api/v1/platform/profile/preferences` - Get preferences
- `PUT /api/v1/platform/profile/preferences` - Update preferences
- `GET /api/v1/platform/profile/activity` - Get user's activity history

**Frontend Pages:**

- `/profile` - Profile page with 4 tabs:
  - **Info** - Name, email, department
  - **Avatar** - Avatar upload/delete
  - **Preferences** - Theme, language, notifications
  - **Activity** - User's recent activities

**Key Features:**

- Department integration with validation
- Avatar upload with automatic resize and WebP conversion
- Real-time theme switching
- User activity history
- Responsive design

### 4. API Keys Module

**Purpose:** Secure API key generation and management for programmatic access

**Backend Endpoints:**

- `GET /api/v1/platform/api-keys` - List user's API keys
- `POST /api/v1/platform/api-keys` - Create new API key
- `GET /api/v1/platform/api-keys/:id` - Get API key details
- `PUT /api/v1/platform/api-keys/:id` - Update API key
- `DELETE /api/v1/platform/api-keys/:id` - Revoke API key
- `GET /api/v1/platform/api-keys/:id/usage` - Get usage statistics

**Frontend Pages:**

- `/settings/api-keys` - API keys list with status badges
- `/settings/api-keys/:id` - API key detail with usage chart
- API Key Creation Wizard (4-step):
  1. Name input
  2. Permission selection
  3. Expiration date
  4. Review and create (key shown once)

**Key Features:**

- Secure key generation with bcrypt
- Permission-based access control
- Usage tracking and analytics
- Key expiration management
- One-time key display with copy-to-clipboard
- Instant revocation

---

## Quick Start

### Backend Setup

1. **Run Database Migrations:**

```bash
cd apps/api
pnpm run db:migrate
```

2. **Verify Tables Created:**

```bash
psql -U postgres -d aegisx_db -c "\dt"
# Should see: error_logs, user_activity_logs, api_keys
```

3. **Start Backend:**

```bash
pnpm run dev:api
```

4. **Verify Endpoints:**

```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/error-logs -H "Authorization: Bearer YOUR_TOKEN"
```

### Frontend Setup

1. **Build Frontend:**

```bash
cd apps/web
nx build web
```

2. **Start Frontend:**

```bash
pnpm run dev:web
```

3. **Access Pages:**

- Error Logs: http://localhost:4200/monitoring/error-logs
- Activity Logs: http://localhost:4200/monitoring/activity-logs
- Profile: http://localhost:4200/profile
- API Keys: http://localhost:4200/settings/api-keys

### Seed Permissions

```bash
# Add required permissions to database
psql -U postgres -d aegisx_db <<EOF
INSERT INTO permissions (resource, action, description) VALUES
('monitoring', 'read', 'View error logs and monitoring data'),
('monitoring', 'write', 'Manage error logs'),
('audit', 'read', 'View activity logs'),
('audit', 'admin', 'Manage and export activity logs'),
('api-keys', 'manage', 'Manage API keys');

-- Assign to Admin role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'Admin'
AND p.resource IN ('monitoring', 'audit', 'api-keys');
EOF
```

---

## API Documentation

### Complete API References

- **[Error Logs API](../../reference/api/error-logs-api.md)** - 600+ lines, 7 endpoints, examples
- **[Activity Logs API](../../reference/api/activity-logs-api.md)** - 750+ lines, 6 endpoints, examples
- **[Profile API](../../reference/api/profile-api.md)** - 650+ lines, 7 endpoints, examples
- **[API Keys API](../../reference/api/api-keys-api.md)** - 700+ lines, 6 endpoints, examples

### Quick API Examples

**Create Error Log:**

```bash
curl -X POST http://localhost:3000/api/error-logs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "level": "error",
    "message": "Payment processing failed",
    "type": "PaymentError",
    "metadata": {"orderId": "ORD-12345", "amount": 150.00}
  }'
```

**Get Activity Statistics:**

```bash
curl http://localhost:3000/api/activity-logs/stats \
  -H "Authorization: Bearer $TOKEN"
```

**Update Profile:**

```bash
curl -X PUT http://localhost:3000/api/v1/platform/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "department_id": "uuid-here"
  }'
```

**Create API Key:**

```bash
curl -X POST http://localhost:3000/api/v1/platform/api-keys \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production Key",
    "permissions": ["users:read", "orders:read"],
    "expires_at": "2026-12-31T23:59:59Z"
  }'
```

---

## Frontend Pages

### Error Logs Pages

**List Page** (`/monitoring/error-logs`)

- Statistics cards (total, by level)
- Data table with error logs
- Filter panel (date range, level, type, user)
- Search functionality
- Export button (CSV/JSON)
- Pagination
- Click row to view details

**Detail Page** (`/monitoring/error-logs/:id`)

- Full error information
- Stack trace (expandable)
- Metadata display
- User information
- IP address and user agent
- Timestamps
- Delete button (if has permission)

### Activity Logs Pages

**List Page** (`/monitoring/activity-logs`)

- Timeline view (default)
- Table view (toggle)
- Activities grouped by date
- Severity color-coding
- Filter panel (user, action, severity, date)
- Statistics cards
- Export button
- Real-time updates (if WebSocket enabled)

**Detail Page** (`/monitoring/activity-logs/:id`)

- Full activity information
- Severity badge
- User information
- Entity tracking
- Metadata display
- IP address and user agent
- Timestamps

### Profile Page

**Main Page** (`/profile`)

- 4 tabs:
  1. **Profile Info**
     - First name, last name
     - Email (readonly)
     - Department selector
     - Save button
  2. **Avatar**
     - Current avatar display
     - Drag-and-drop upload
     - File validation
     - Delete button
  3. **Preferences**
     - Theme selector (light/dark/auto)
     - Language selector (en/th)
     - Notification toggles
     - Auto-save
  4. **Activity**
     - Recent activities (read-only)
     - Timeline format
     - Load more button

### API Keys Pages

**List Page** (`/settings/api-keys`)

- Data table with API keys
- Status badges (Active/Expired/Revoked)
- Filter by status
- "Create API Key" button
- Click row to view details
- Revoke button with confirmation

**Creation Wizard** (Modal/Page)

- 4-step wizard:
  1. **Name** - Input key name
  2. **Permissions** - Checkbox groups
  3. **Expiration** - Date picker with presets
  4. **Review & Create** - Summary
  5. **Success** - Key shown once with copy button

**Detail Page** (`/settings/api-keys/:id`)

- Key information (no full key)
- Key prefix
- Permissions list
- Expiration date
- Status badge
- Usage statistics:
  - Total requests
  - Usage chart
  - Requests by endpoint
  - Last used info
- Revoke button

---

## Use Cases

### 1. Error Monitoring for DevOps

**Scenario:** Monitor production errors in real-time

**Solution:**

- Error Logs dashboard displays all errors
- Filter by level (error) to see critical issues
- Export daily error reports for analysis
- Set up automated cleanup to manage storage

### 2. Compliance Auditing

**Scenario:** Compliance officer needs audit trail of user actions

**Solution:**

- Activity Logs provides complete audit trail
- Filter by user and date range
- Export to CSV for compliance reports
- Timeline view for easy understanding

### 3. API Integration

**Scenario:** Developer needs programmatic access to API

**Solution:**

- Create API key with specific permissions
- Use key for authentication (`X-API-Key` header)
- Track usage through usage statistics
- Revoke key when integration is decommissioned

### 4. User Profile Management

**Scenario:** Users want to customize their experience

**Solution:**

- Profile page allows users to:
  - Update personal information
  - Upload custom avatar
  - Switch theme (light/dark)
  - Change language preference
  - View their activity history

### 5. Security Incident Investigation

**Scenario:** Investigate suspicious user activity

**Solution:**

1. Check Activity Logs for user's actions
2. View Error Logs for any errors during that time
3. Check API Key usage if API keys were involved
4. Export logs for detailed analysis

---

## Permissions

### Required Permissions

| Resource   | Action | Description                            | Typical Role |
| ---------- | ------ | -------------------------------------- | ------------ |
| monitoring | read   | View error logs and statistics         | Developer    |
| monitoring | write  | Delete and cleanup error logs          | Admin        |
| audit      | read   | View activity logs                     | Auditor      |
| audit      | admin  | Delete, cleanup, and export activities | Admin        |
| api-keys   | manage | Create and manage API keys             | Developer    |
| profile    | write  | Update own profile (implicit)          | All Users    |

### Permission Assignment

**Admin Role:**

- `monitoring:read`
- `monitoring:write`
- `audit:read`
- `audit:admin`
- `api-keys:manage`

**Developer Role:**

- `monitoring:read`
- `api-keys:manage`

**Auditor Role:**

- `audit:read`

**User Role:**

- Implicit `profile:write` for own profile
- View own activities via `/profile` (no special permission needed)

---

## Configuration

### Environment Variables

```bash
# Error Logging
ERROR_LOG_RETENTION_DAYS=30
ERROR_LOG_CACHE_TTL=300  # 5 minutes

# Activity Logging
ACTIVITY_LOGGING_ENABLED=true
ACTIVITY_LOG_RETENTION_DAYS=90

# API Keys
API_KEY_BCRYPT_ROUNDS=12

# File Upload (for avatars)
FILE_UPLOAD_DIR=/var/uploads
FILE_UPLOAD_MAX_SIZE=5242880  # 5MB
FILE_AVATAR_SIZE=200  # 200x200px

# Redis (for caching)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
```

### Retention Policies

| Log Type      | Retention Period  | Cleanup Schedule  |
| ------------- | ----------------- | ----------------- |
| Error Logs    | 30 days           | Daily at 2 AM     |
| Activity Logs | 90 days           | Daily at 3 AM     |
| API Keys      | Never auto-delete | Manual revocation |
| Avatars       | Never             | On user request   |

---

## Best Practices

### Error Logging

1. **Use appropriate levels:**
   - `error`: Critical issues requiring immediate attention
   - `warn`: Recoverable issues or degraded functionality
   - `info`: Informational messages

2. **Include context:**
   - Always include relevant metadata
   - Add user ID if applicable
   - Include entity IDs for traceability

3. **Avoid sensitive data:**
   - Never log passwords
   - Never log credit card numbers
   - Never log API keys or tokens

### Activity Logging

1. **Log all state changes:**
   - User authentication (login/logout)
   - Data modifications (create/update/delete)
   - Configuration changes

2. **Use consistent action names:**
   - Format: `<entity>.<operation>`
   - Examples: `user.login`, `order.created`, `product.updated`

3. **Set appropriate severity:**
   - `info`: Normal operations
   - `warning`: Important changes
   - `error`: Failed operations
   - `critical`: Security incidents

### API Keys

1. **Generate with minimum permissions:**
   - Only grant necessary permissions
   - Review permissions regularly

2. **Set expiration dates:**
   - Production keys: 90 days
   - Development keys: 30 days

3. **Rotate regularly:**
   - Implement automatic rotation
   - Maintain grace period when rotating

4. **Monitor usage:**
   - Set up alerts for unusual patterns
   - Review usage statistics monthly

### Profile Management

1. **Validate department assignments:**
   - Ensure department exists
   - Verify user has permission

2. **Image optimization:**
   - Resize to standard size (200x200px)
   - Convert to WebP for smaller file sizes
   - Validate file types and sizes

3. **Privacy considerations:**
   - Allow users to delete avatars
   - Make activity history opt-in/out if needed

---

## Deployment

### Deployment Guide

Complete deployment instructions: [Monitoring & Audit Deployment Guide](../../deployment/monitoring-audit-deployment.md)

### Quick Deployment Checklist

- [ ] Database migrations run successfully
- [ ] Environment variables configured
- [ ] Backend deployed and health check passes
- [ ] Frontend deployed and pages accessible
- [ ] Permissions seeded
- [ ] Navigation menu updated
- [ ] Automated cleanup jobs scheduled
- [ ] Monitoring configured

### Verification

Use the comprehensive verification checklist: [Verification Checklist](../../deployment/verification-checklist.md)

---

## Troubleshooting

### Common Issues

**Issue: Endpoints return 404**

- Verify plugins are registered in `plugin.loader.ts`
- Check server logs for plugin loading errors
- Ensure migrations have run

**Issue: 403 Forbidden**

- Verify user has required permissions
- Check role assignments
- Confirm RBAC middleware is working

**Issue: Avatar upload fails**

- Check file size (<5MB)
- Verify file type (image/\*)
- Check upload directory permissions
- Verify disk space

**Issue: API key authentication not working**

- Verify key is not revoked or expired
- Check `X-API-Key` header format
- Confirm permissions are granted

### Support

For issues or questions:

- GitHub Issues: https://github.com/aegisx-platform/aegisx-starter/issues
- Documentation: https://aegisx-platform.github.io/aegisx-starter-1/
- Email: support@aegisx.io

---

## Version History

### v1.0.0 (2025-12-16)

- Initial release
- Error Logs module
- Activity Logs module
- User Profile enhancement
- API Keys management
- Complete documentation
- Deployment guides

---

**Last Updated:** 2025-12-16
**Maintained By:** AegisX Platform Team
