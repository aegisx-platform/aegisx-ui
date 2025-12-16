# Monitoring & Audit Modules - Verification Checklist

## Overview

This checklist ensures that all monitoring and audit modules are functioning correctly after deployment. Complete each section sequentially and document any issues encountered.

**Deployment Date:** ******\_\_\_******
**Environment:** [ ] Development [ ] Staging [ ] Production
**Verified By:** ******\_\_\_******

---

## 1. Pre-Verification Setup

### Required Access

- [ ] Admin account credentials
- [ ] Test user account credentials
- [ ] API access token (JWT)
- [ ] Database read access
- [ ] Redis access (optional, for cache verification)

### Required Tools

- [ ] cURL or Postman installed
- [ ] Browser (Chrome/Firefox with DevTools)
- [ ] Database client (psql, DBeaver, etc.)
- [ ] Redis CLI (optional)

---

## 2. Database Verification

### Table Existence

```bash
# Connect to database
psql -U postgres -d aegisx_db

# Check tables exist
\dt

# Verify these tables:
```

- [ ] `api_keys` table exists
- [ ] `error_logs` table exists
- [ ] `user_activity_logs` table exists
- [ ] `users` table exists (should already exist)

### Table Structure Verification

```sql
-- API Keys table
\d api_keys
```

Verify columns:

- [ ] `id` (uuid, primary key)
- [ ] `user_id` (uuid, foreign key)
- [ ] `name` (varchar)
- [ ] `key_hash` (varchar)
- [ ] `key_prefix` (varchar)
- [ ] `permissions` (text[] array)
- [ ] `last_used_at` (timestamp)
- [ ] `usage_count` (integer)
- [ ] `expires_at` (timestamp)
- [ ] `revoked` (boolean)
- [ ] `revoked_at` (timestamp)
- [ ] `created_at` (timestamp)
- [ ] `updated_at` (timestamp)

### Index Verification

```sql
-- Check indexes
\di api_keys*
\di error_logs*
\di user_activity_logs*
```

- [ ] `api_keys_pkey` (primary key)
- [ ] `api_keys_user_id_idx` (user_id index)
- [ ] `api_keys_key_hash_idx` (key_hash index)
- [ ] `api_keys_revoked_idx` (revoked index)
- [ ] Error logs indexes exist
- [ ] Activity logs indexes exist

### Foreign Key Constraints

```sql
-- Verify FK constraints
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'api_keys'
    AND tc.constraint_type = 'FOREIGN KEY';
```

- [ ] `api_keys.user_id` → `users.id` (ON DELETE CASCADE)

**Issues Found:** ******\_\_\_******

---

## 3. Backend API Verification

### Health Check

```bash
curl http://localhost:3000/api/health
```

Expected Response:

```json
{
  "status": "ok",
  "timestamp": "2025-12-16T12:00:00.000Z",
  "uptime": 123.456,
  "environment": "production"
}
```

- [ ] Health endpoint returns 200 OK
- [ ] Response contains correct environment

### Error Logs API

#### List Error Logs

```bash
curl -X GET "http://localhost:3000/api/error-logs?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

- [ ] Returns 200 OK
- [ ] Response contains `items` array
- [ ] Response contains `pagination` object
- [ ] Can filter by level (`?level=error`)
- [ ] Can filter by date range (`?startDate=...&endDate=...`)
- [ ] Can search (`?search=keyword`)

#### Get Error Log by ID

```bash
curl -X GET "http://localhost:3000/api/error-logs/UUID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

- [ ] Returns 200 OK with valid ID
- [ ] Returns 404 with invalid ID
- [ ] Response contains full error details

#### Get Error Stats

```bash
curl -X GET "http://localhost:3000/api/error-logs/stats" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

- [ ] Returns 200 OK
- [ ] Response contains `total` count
- [ ] Response contains `byLevel` breakdown
- [ ] Response contains `byType` breakdown
- [ ] Response contains `recentTrend` data

#### Create Error Log

```bash
curl -X POST "http://localhost:3000/api/error-logs" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "level": "error",
    "message": "Test error",
    "type": "TestError"
  }'
```

- [ ] Returns 201 Created
- [ ] Response contains created error log
- [ ] Error appears in database

#### Delete Error Log

```bash
curl -X DELETE "http://localhost:3000/api/error-logs/UUID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

- [ ] Returns 200 OK
- [ ] Requires `monitoring:write` permission
- [ ] Returns 403 Forbidden without permission

#### Cleanup Old Errors

```bash
curl -X DELETE "http://localhost:3000/api/error-logs/cleanup?days=30" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

- [ ] Returns 200 OK
- [ ] Response contains `deletedCount`
- [ ] Requires `monitoring:write` permission

#### Export Error Logs

```bash
curl -X GET "http://localhost:3000/api/error-logs/export?format=csv" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -o error-logs.csv
```

- [ ] Downloads CSV file
- [ ] CSV contains headers and data
- [ ] Can export as JSON (`?format=json`)

**Issues Found:** ******\_\_\_******

### Activity Logs API

#### List Activity Logs

```bash
curl -X GET "http://localhost:3000/api/activity-logs?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

- [ ] Returns 200 OK
- [ ] Response contains `items` array
- [ ] Response contains `pagination` object
- [ ] Can filter by action (`?action=user.login`)
- [ ] Can filter by severity (`?severity=info`)
- [ ] Can filter by user (`?userId=UUID`)

#### Get Activity Log by ID

```bash
curl -X GET "http://localhost:3000/api/activity-logs/UUID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

- [ ] Returns 200 OK with valid ID
- [ ] Returns 404 with invalid ID
- [ ] Response contains full activity details

#### Get Activity Stats

```bash
curl -X GET "http://localhost:3000/api/activity-logs/stats" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

- [ ] Returns 200 OK
- [ ] Response contains `total` count
- [ ] Response contains `byAction` breakdown
- [ ] Response contains `bySeverity` breakdown
- [ ] Response contains `topUsers` list

#### Delete Activity Log

```bash
curl -X DELETE "http://localhost:3000/api/activity-logs/UUID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

- [ ] Returns 200 OK
- [ ] Requires `audit:admin` permission
- [ ] Returns 403 Forbidden without permission

#### Export Activity Logs

```bash
curl -X GET "http://localhost:3000/api/activity-logs/export?format=csv" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -o activity-logs.csv
```

- [ ] Downloads CSV file
- [ ] CSV contains headers and data
- [ ] Requires `audit:admin` permission

**Issues Found:** ******\_\_\_******

### User Profile API

#### Get Profile

```bash
curl -X GET "http://localhost:3000/api/v1/platform/profile" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

- [ ] Returns 200 OK
- [ ] Response contains user profile data
- [ ] Response includes department info (if assigned)
- [ ] Response includes avatar URL (if uploaded)
- [ ] Response includes preferences

#### Update Profile

```bash
curl -X PUT "http://localhost:3000/api/v1/platform/profile" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "User",
    "department_id": "VALID_UUID"
  }'
```

- [ ] Returns 200 OK
- [ ] Updates profile in database
- [ ] Validates department ID exists
- [ ] Returns 400 with invalid department

#### Upload Avatar

```bash
curl -X POST "http://localhost:3000/api/v1/platform/profile/avatar" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "avatar=@test-image.jpg"
```

- [ ] Returns 200 OK
- [ ] Response contains new avatar URL
- [ ] Avatar saved to file system/storage
- [ ] Old avatar deleted (if existed)
- [ ] Returns 400 with invalid file type
- [ ] Returns 400 with file too large (>5MB)

#### Delete Avatar

```bash
curl -X DELETE "http://localhost:3000/api/v1/platform/profile/avatar" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

- [ ] Returns 200 OK
- [ ] Avatar removed from file system/storage
- [ ] `avatar_url` set to null in database

#### Get Preferences

```bash
curl -X GET "http://localhost:3000/api/v1/platform/profile/preferences" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

- [ ] Returns 200 OK
- [ ] Response contains `theme`, `language`, `notifications`

#### Update Preferences

```bash
curl -X PUT "http://localhost:3000/api/v1/platform/profile/preferences" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "theme": "dark",
    "language": "en",
    "notifications": {
      "email": true,
      "push": false,
      "sms": false
    }
  }'
```

- [ ] Returns 200 OK
- [ ] Preferences updated in database
- [ ] Validates theme value (light/dark/auto)
- [ ] Validates language value (en/th)

#### Get User Activity

```bash
curl -X GET "http://localhost:3000/api/v1/platform/profile/activity?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

- [ ] Returns 200 OK
- [ ] Response contains user's activities only
- [ ] Pagination works correctly
- [ ] Can filter by action

**Issues Found:** ******\_\_\_******

### API Keys API

#### List API Keys

```bash
curl -X GET "http://localhost:3000/api/v1/platform/api-keys" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

- [ ] Returns 200 OK
- [ ] Response contains user's keys only
- [ ] Key hash never exposed
- [ ] Key prefix shown for identification
- [ ] Requires `api-keys:manage` permission

#### Create API Key

```bash
curl -X POST "http://localhost:3000/api/v1/platform/api-keys" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Key",
    "permissions": ["users:read", "orders:read"],
    "expires_at": "2026-12-31T23:59:59Z"
  }'
```

- [ ] Returns 201 Created
- [ ] Response contains plain API key (shown once)
- [ ] Response includes warning message
- [ ] Key hash stored in database (not plain key)
- [ ] Key prefix stored correctly
- [ ] Permissions array stored correctly
- [ ] Requires `api-keys:manage` permission

#### Get API Key Details

```bash
curl -X GET "http://localhost:3000/api/v1/platform/api-keys/UUID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

- [ ] Returns 200 OK
- [ ] Response contains key details (no hash)
- [ ] Shows usage count
- [ ] Shows last used timestamp
- [ ] User can only access their own keys

#### Update API Key

```bash
curl -X PUT "http://localhost:3000/api/v1/platform/api-keys/UUID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "permissions": ["users:read"]
  }'
```

- [ ] Returns 200 OK
- [ ] Name updated
- [ ] Permissions updated
- [ ] Cannot update revoked keys

#### Revoke API Key

```bash
curl -X DELETE "http://localhost:3000/api/v1/platform/api-keys/UUID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

- [ ] Returns 200 OK
- [ ] Key marked as revoked in database
- [ ] `revoked_at` timestamp set
- [ ] Key can no longer authenticate

#### Get API Key Usage

```bash
curl -X GET "http://localhost:3000/api/v1/platform/api-keys/UUID/usage" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

- [ ] Returns 200 OK
- [ ] Response contains usage statistics
- [ ] Shows requests by date
- [ ] Shows requests by endpoint

#### Authenticate with API Key

```bash
curl -X GET "http://localhost:3000/api/users" \
  -H "X-API-Key: YOUR_GENERATED_API_KEY"
```

- [ ] Authentication successful
- [ ] Permissions enforced (can't access beyond granted permissions)
- [ ] Revoked keys rejected (401/403)
- [ ] Expired keys rejected (401/403)
- [ ] Usage count incremented
- [ ] `last_used_at` updated

**Issues Found:** ******\_\_\_******

---

## 4. Permission Verification

### Required Permissions

Verify these permissions exist in the database:

```sql
SELECT * FROM permissions
WHERE resource IN ('monitoring', 'audit', 'api-keys', 'profile')
ORDER BY resource, action;
```

- [ ] `monitoring:read` exists
- [ ] `monitoring:write` exists
- [ ] `audit:read` exists
- [ ] `audit:admin` exists
- [ ] `api-keys:manage` exists

### Role Assignment

Verify Admin role has all permissions:

```sql
SELECT r.name, p.resource, p.action
FROM roles r
JOIN role_permissions rp ON r.id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id
WHERE r.name = 'Admin'
AND p.resource IN ('monitoring', 'audit', 'api-keys');
```

- [ ] Admin has `monitoring:read`
- [ ] Admin has `monitoring:write`
- [ ] Admin has `audit:read`
- [ ] Admin has `audit:admin`
- [ ] Admin has `api-keys:manage`

### Permission Enforcement

Test with user WITHOUT permissions:

```bash
# Create test user without monitoring permissions
# Try to access error logs
curl -X GET "http://localhost:3000/api/error-logs" \
  -H "Authorization: Bearer TEST_USER_TOKEN"
```

- [ ] Returns 403 Forbidden (not 401)
- [ ] Error message indicates lack of permission
- [ ] User with permission CAN access

**Issues Found:** ******\_\_\_******

---

## 5. Frontend Verification

### Navigation

Open the application in a browser:

- [ ] Login page loads
- [ ] Can login successfully
- [ ] Dashboard loads without errors

Check navigation menu:

- [ ] "Monitoring" section appears in sidebar
- [ ] "Error Logs" submenu item visible
- [ ] "Activity Logs" submenu item visible
- [ ] "Profile" link in user menu
- [ ] "API Keys" link in settings or user menu

**Issues Found:** ******\_\_\_******

### Error Logs Pages

#### Error Logs List Page

Navigate to: `/monitoring/error-logs`

- [ ] Page loads without JavaScript errors
- [ ] Statistics cards display at top
- [ ] Data table displays error logs
- [ ] Pagination works correctly
- [ ] Filter panel present with:
  - [ ] Date range picker
  - [ ] Level selector (error/warn/info)
  - [ ] Type input
  - [ ] User selector
- [ ] Filters apply correctly
- [ ] Search box works
- [ ] "Export" button present
- [ ] Can click row to view details
- [ ] Loading state shows while fetching

#### Error Logs Detail Page

Click on an error log from the list:

- [ ] Detail page loads
- [ ] Error ID displayed
- [ ] Level badge shows correct color
- [ ] Message displayed
- [ ] Stack trace shown (if present)
- [ ] Metadata displayed (if present)
- [ ] User information shown (if present)
- [ ] IP address and user agent shown
- [ ] Timestamp formatted correctly
- [ ] "Back" button works
- [ ] "Delete" button present (if has permission)

**Issues Found:** ******\_\_\_******

### Activity Logs Pages

#### Activity Logs List Page

Navigate to: `/monitoring/activity-logs`

- [ ] Page loads without JavaScript errors
- [ ] Timeline view displays by default
- [ ] Activities grouped by date
- [ ] Activity icons displayed
- [ ] Severity color-coding works:
  - [ ] info = blue/green
  - [ ] warning = yellow/orange
  - [ ] error = red
  - [ ] critical = dark red
- [ ] Filter panel present
- [ ] Can toggle between timeline and table view
- [ ] Table view displays correctly
- [ ] Statistics cards show data
- [ ] "Export" button present
- [ ] Can click activity to view details

#### Activity Logs Detail Page

Click on an activity from the list:

- [ ] Detail page loads
- [ ] Activity ID displayed
- [ ] Action displayed
- [ ] Severity badge correct
- [ ] Description shown
- [ ] User information displayed
- [ ] Entity information shown (if present)
- [ ] Metadata formatted nicely
- [ ] IP address and user agent shown
- [ ] Timestamp formatted correctly
- [ ] "Back" button works

**Issues Found:** ******\_\_\_******

### Profile Page

Navigate to: `/profile` or user menu → Profile

- [ ] Page loads without JavaScript errors
- [ ] 4 tabs present:
  1. [ ] Profile Info
  2. [ ] Avatar
  3. [ ] Preferences
  4. [ ] Activity

#### Profile Info Tab

- [ ] Current profile data displayed
- [ ] First name field editable
- [ ] Last name field editable
- [ ] Email field readonly
- [ ] Department selector present
- [ ] Department list populated
- [ ] Can change department
- [ ] "Save" button works
- [ ] Success message shown after save
- [ ] Data updates in database

#### Avatar Tab

- [ ] Current avatar displayed (or placeholder)
- [ ] File upload area present
- [ ] Drag-and-drop works
- [ ] Click to browse works
- [ ] Preview shown before upload
- [ ] "Upload" button works
- [ ] Avatar updates after upload
- [ ] File type validation works (rejects non-images)
- [ ] File size validation works (rejects >5MB)
- [ ] "Delete" button present (if avatar exists)
- [ ] Delete confirmation shown
- [ ] Avatar removed after delete

#### Preferences Tab

- [ ] Current preferences displayed
- [ ] Theme selector present:
  - [ ] Light option
  - [ ] Dark option
  - [ ] Auto option
- [ ] Theme changes apply immediately
- [ ] Language selector present (en/th)
- [ ] Notification toggles present:
  - [ ] Email notifications
  - [ ] Push notifications
  - [ ] SMS notifications
- [ ] Toggles work correctly
- [ ] Changes save automatically or on button click
- [ ] Success message shown

#### Activity Tab

- [ ] Recent activities displayed
- [ ] Timeline format
- [ ] Shows last 10-20 activities
- [ ] Activity icons displayed
- [ ] Timestamps formatted
- [ ] Readonly (no edit/delete buttons)
- [ ] "Load more" button (if applicable)

**Issues Found:** ******\_\_\_******

### API Keys Page

Navigate to: `/settings/api-keys` or from settings menu

#### API Keys List Page

- [ ] Page loads without JavaScript errors
- [ ] Data table displays user's API keys
- [ ] Columns present:
  - [ ] Name
  - [ ] Key prefix (pk*live*...)
  - [ ] Status badge (Active/Expired/Revoked)
  - [ ] Last used date
  - [ ] Created date
  - [ ] Actions (View, Revoke)
- [ ] "Create API Key" button present
- [ ] Filter by status works
- [ ] Can click to view details
- [ ] Revoke button shows confirmation
- [ ] Status badges color-coded:
  - [ ] Active = green
  - [ ] Expired = gray
  - [ ] Revoked = red

#### API Key Creation Wizard

Click "Create API Key":

- [ ] Wizard modal/page opens
- [ ] Uses mat-stepper or similar
- [ ] Step 1: Name
  - [ ] Input for key name
  - [ ] Required validation
  - [ ] "Next" button
- [ ] Step 2: Permissions
  - [ ] Checkboxes grouped by category
  - [ ] Can select multiple
  - [ ] "Select All" option (if present)
  - [ ] "Next" button
- [ ] Step 3: Expiration
  - [ ] Date picker
  - [ ] Preset buttons (30d, 90d, 1y, Never)
  - [ ] "Next" button
- [ ] Step 4: Review
  - [ ] Shows summary of selections
  - [ ] "Create" button
- [ ] Step 5: Success
  - [ ] API key displayed in monospace font
  - [ ] Copy-to-clipboard button works
  - [ ] Warning message shown (key shown once)
  - [ ] "Done" button closes wizard
- [ ] New key appears in list
- [ ] Can navigate back through steps

#### API Keys Detail Page

Click on an API key from the list:

- [ ] Detail page loads
- [ ] Key information displayed (no full key)
- [ ] Key prefix shown
- [ ] Permissions list displayed
- [ ] Expiration date shown (if set)
- [ ] Status badge present
- [ ] Usage statistics displayed:
  - [ ] Total requests
  - [ ] Usage chart (line/bar chart)
  - [ ] Requests by endpoint table
  - [ ] Last used info
- [ ] "Revoke" button present (if active)
- [ ] Revoke confirmation shown
- [ ] "Back" button works

**Issues Found:** ******\_\_\_******

---

## 6. Integration Tests

### Activity Logging Middleware

Verify automatic activity logging:

```bash
# Make authenticated request
curl -X PUT "http://localhost:3000/api/v1/platform/profile" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"first_name": "Updated"}'

# Check activity was logged
curl -X GET "http://localhost:3000/api/v1/platform/profile/activity?limit=1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

- [ ] Activity created automatically
- [ ] Action is `profile.updated`
- [ ] User ID matches
- [ ] IP address captured
- [ ] Metadata includes changed fields

### Error Logging Integration

```bash
# Trigger an error (invalid request)
curl -X POST "http://localhost:3000/api/error-logs" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"level": "invalid_level"}'

# Check if error was logged
curl -X GET "http://localhost:3000/api/error-logs?type=ValidationError&limit=1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

- [ ] Validation error logged
- [ ] Error includes request details

### API Key Authentication Flow

```bash
# Create API key
API_KEY_RESPONSE=$(curl -s -X POST "http://localhost:3000/api/v1/platform/api-keys" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","permissions":["users:read"]}')

API_KEY=$(echo $API_KEY_RESPONSE | jq -r '.data.key')

# Use API key to make request
curl -X GET "http://localhost:3000/api/users" \
  -H "X-API-Key: $API_KEY"

# Check usage was tracked
KEY_ID=$(echo $API_KEY_RESPONSE | jq -r '.data.keyData.id')
curl -X GET "http://localhost:3000/api/v1/platform/api-keys/$KEY_ID" \
  -H "Authorization: Bearer $JWT_TOKEN"
```

- [ ] API key authentication works
- [ ] Usage count incremented
- [ ] Last used timestamp updated
- [ ] Activity logged for API key usage

### Department Validation

```bash
# Try to update profile with invalid department
curl -X PUT "http://localhost:3000/api/v1/platform/profile" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"department_id": "00000000-0000-0000-0000-000000000000"}'
```

- [ ] Returns 400 Bad Request
- [ ] Error message indicates invalid department

**Issues Found:** ******\_\_\_******

---

## 7. Performance Tests

### Response Time

Measure API response times:

```bash
# Error logs list (should be <500ms with cache)
time curl -X GET "http://localhost:3000/api/error-logs?limit=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Activity logs list (should be <500ms)
time curl -X GET "http://localhost:3000/api/activity-logs?limit=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Profile endpoint (should be <200ms)
time curl -X GET "http://localhost:3000/api/v1/platform/profile" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

- [ ] Error logs list < 500ms
- [ ] Activity logs list < 500ms
- [ ] Profile < 200ms
- [ ] Stats endpoints < 300ms (with cache)

### Cache Verification

```bash
# First request (cache miss)
time curl -s "http://localhost:3000/api/error-logs/stats" \
  -H "Authorization: Bearer $TOKEN" > /dev/null

# Second request (cache hit - should be faster)
time curl -s "http://localhost:3000/api/error-logs/stats" \
  -H "Authorization: Bearer $TOKEN" > /dev/null
```

- [ ] Second request significantly faster
- [ ] Redis keys created (check with `redis-cli KEYS error-logs:*`)

### Pagination Performance

```bash
# Large result set
time curl -X GET "http://localhost:3000/api/activity-logs?limit=100" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

- [ ] Response time reasonable (<1s for 100 items)
- [ ] Pagination metadata correct

**Issues Found:** ******\_\_\_******

---

## 8. Security Tests

### Authentication Tests

```bash
# No token
curl -X GET "http://localhost:3000/api/error-logs"

# Invalid token
curl -X GET "http://localhost:3000/api/error-logs" \
  -H "Authorization: Bearer invalid_token"

# Expired token
curl -X GET "http://localhost:3000/api/error-logs" \
  -H "Authorization: Bearer EXPIRED_TOKEN"
```

- [ ] No token returns 401 Unauthorized
- [ ] Invalid token returns 401 Unauthorized
- [ ] Expired token returns 401 Unauthorized

### Authorization Tests

```bash
# User without monitoring:write tries to delete
curl -X DELETE "http://localhost:3000/api/error-logs/UUID" \
  -H "Authorization: Bearer USER_WITHOUT_PERMISSION"
```

- [ ] Returns 403 Forbidden
- [ ] Error message indicates lack of permission

### API Key Security

```bash
# Revoked key
curl -X GET "http://localhost:3000/api/users" \
  -H "X-API-Key: REVOKED_KEY"

# Expired key
curl -X GET "http://localhost:3000/api/users" \
  -H "X-API-Key: EXPIRED_KEY"
```

- [ ] Revoked key returns 401/403
- [ ] Expired key returns 401/403
- [ ] Error messages don't leak sensitive info

### SQL Injection Protection

```bash
# Try SQL injection in search
curl -X GET "http://localhost:3000/api/error-logs?search=' OR '1'='1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

- [ ] Query handled safely
- [ ] No database error returned
- [ ] No unauthorized data returned

### File Upload Security

```bash
# Try uploading non-image file
curl -X POST "http://localhost:3000/api/v1/platform/profile/avatar" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "avatar=@malicious.exe"

# Try uploading oversized file
curl -X POST "http://localhost:3000/api/v1/platform/profile/avatar" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "avatar=@large-file.jpg"  # >5MB
```

- [ ] Non-image rejected with 400
- [ ] Oversized file rejected with 400
- [ ] Error messages appropriate

**Issues Found:** ******\_\_\_******

---

## 9. Error Handling

### 404 Errors

```bash
# Non-existent endpoint
curl -X GET "http://localhost:3000/api/nonexistent" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Non-existent resource
curl -X GET "http://localhost:3000/api/error-logs/00000000-0000-0000-0000-000000000000" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

- [ ] Returns 404 Not Found
- [ ] Response includes error message
- [ ] Response format matches API standard

### 400 Validation Errors

```bash
# Invalid UUID format
curl -X GET "http://localhost:3000/api/error-logs/invalid-uuid" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Invalid request body
curl -X POST "http://localhost:3000/api/error-logs" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"level": "invalid"}'
```

- [ ] Returns 400 Bad Request
- [ ] Error message describes validation issue
- [ ] Response includes field details

### 500 Server Errors

```bash
# Check server error handling (may need to trigger manually)
# Monitor logs for any unhandled exceptions
```

- [ ] 500 errors logged to error_logs table
- [ ] Error details captured (stack trace)
- [ ] User receives generic error message (no stack trace exposed)

**Issues Found:** ******\_\_\_******

---

## 10. Monitoring & Logging

### Application Logs

```bash
# Check application logs
tail -f /var/log/aegisx/api.log

# Look for:
# - Startup messages
# - Plugin loading messages
# - No error messages
# - Request logs (if enabled)
```

- [ ] Application starts without errors
- [ ] All plugins load successfully
- [ ] No unexpected errors in logs
- [ ] Log level appropriate for environment

### Error Logs Database

```sql
-- Check for recent errors
SELECT level, message, created_at
FROM error_logs
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC
LIMIT 10;
```

- [ ] No critical errors
- [ ] Expected errors only (if any)

### Activity Logs Database

```sql
-- Check activity logging is working
SELECT action, COUNT(*) as count
FROM user_activity_logs
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY action
ORDER BY count DESC;
```

- [ ] Activities being logged
- [ ] Common actions present (login, logout, updates)

**Issues Found:** ******\_\_\_******

---

## 11. Cleanup & Maintenance

### Automated Cleanup

```bash
# Test cleanup endpoints manually
curl -X DELETE "http://localhost:3000/api/error-logs/cleanup?days=1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

curl -X DELETE "http://localhost:3000/api/activity-logs/cleanup?days=1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

- [ ] Cleanup executes without errors
- [ ] Returns count of deleted records
- [ ] Old records removed from database

### Scheduled Jobs

Check cron jobs are configured:

```bash
crontab -l
```

- [ ] Error log cleanup job scheduled
- [ ] Activity log cleanup job scheduled
- [ ] Jobs use correct retention periods

**Issues Found:** ******\_\_\_******

---

## 12. Documentation Verification

### API Documentation

- [ ] Error Logs API documented
- [ ] Activity Logs API documented
- [ ] Profile API documented
- [ ] API Keys API documented
- [ ] Examples provided for all endpoints
- [ ] Permission requirements documented

### Deployment Documentation

- [ ] Deployment guide complete
- [ ] Environment variables documented
- [ ] Migration steps documented
- [ ] Rollback procedure documented

### User Documentation

- [ ] User guide for profile management
- [ ] User guide for API key generation
- [ ] Administrator guide for monitoring dashboards
- [ ] Audit log access guide for compliance

**Issues Found:** ******\_\_\_******

---

## 13. Final Verification

### Pre-Production Checklist

- [ ] All tests passed
- [ ] No critical issues found
- [ ] All issues documented and assigned
- [ ] Performance acceptable
- [ ] Security verified
- [ ] Monitoring configured
- [ ] Backups confirmed
- [ ] Rollback plan ready
- [ ] Team notified
- [ ] Support prepared

### Production Readiness

- [ ] Load testing completed (if applicable)
- [ ] Disaster recovery plan in place
- [ ] Incident response procedures documented
- [ ] On-call engineer assigned
- [ ] Monitoring dashboards created
- [ ] Alert thresholds configured

---

## Summary

**Total Checks:** **\_**
**Passed:** **\_**
**Failed:** **\_**
**Issues Found:** **\_**

### Critical Issues

1. ***
2. ***
3. ***

### Non-Critical Issues

1. ***
2. ***
3. ***

### Recommendations

1. ***
2. ***
3. ***

---

## Sign-Off

**Verified By:** ******\_\_\_******
**Date:** ******\_\_\_******
**Signature:** ******\_\_\_******

**Approved for Production:** [ ] Yes [ ] No

**Notes:**

---

---

---

---

**Last Updated:** 2025-12-16
**Version:** 1.0.0
