# Core Departments - Troubleshooting Guide

> **Diagnosis and resolution of common issues**

**Version:** 1.0.0
**Last Updated:** 2025-12-14
**Audience:** Support Team, System Administrators, Developers

---

## Table of Contents

- [Quick Diagnosis](#quick-diagnosis)
- [API Issues](#api-issues)
- [Data Issues](#data-issues)
- [Performance Issues](#performance-issues)
- [Import Issues](#import-issues)
- [Database Issues](#database-issues)
- [Authorization Issues](#authorization-issues)
- [Advanced Debugging](#advanced-debugging)

---

## Quick Diagnosis

### Problem: Feature Not Working

**Step 1: Check Status**

```bash
# Is API running?
curl http://localhost:3000/api/health

# Is database connected?
curl http://localhost:3000/api/system/status

# Check department endpoint
curl http://localhost:3000/api/departments \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Step 2: Check Permissions**

```bash
# Do you have required permission?
# Check token claims (see Authorization Issues)

# Example: Cannot read departments?
# Need: departments:read permission
```

**Step 3: Check Logs**

```bash
# Look for errors in API logs
tail -f logs/api.log | grep -i department

# Check database logs
tail -f logs/postgres.log | grep -i department
```

**Step 4: Check Network**

```bash
# Can you reach API?
ping localhost:3000

# Is firewall blocking?
netstat -an | grep 3000
```

---

## API Issues

### Problem: 401 Unauthorized

**Symptoms:**

```json
{
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "Missing or invalid authentication"
}
```

**Diagnosis:**

```bash
# 1. Check token exists
echo $AUTHORIZATION_HEADER

# 2. Verify token format
# Should be: Bearer eyJhbGciOi...

# 3. Test with missing token
curl http://localhost:3000/api/departments
# → Should return 401

# 4. Test with valid token
curl http://localhost:3000/api/departments \
  -H "Authorization: Bearer VALID_TOKEN"
# → Should return 200
```

**Solutions:**

| Cause                   | Solution                                  |
| ----------------------- | ----------------------------------------- |
| No Authorization header | Add header: `Authorization: Bearer TOKEN` |
| Invalid token format    | Must be `Bearer ` prefix + token          |
| Expired token           | Request new token from auth service       |
| Wrong token             | Verify using correct account              |
| Token not in request    | Check curl/client code sending header     |

**Example Fix:**

```bash
# Wrong
curl http://localhost:3000/api/departments

# Correct
curl http://localhost:3000/api/departments \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### Problem: 403 Forbidden

**Symptoms:**

```json
{
  "statusCode": 403,
  "error": "Forbidden",
  "message": "Insufficient permissions"
}
```

**Diagnosis:**

```bash
# 1. Check what permission is required
# Look at route definition: fastify.verifyPermission('departments', 'read')
# → Needs: departments:read

# 2. Check your permissions
# Go to: Admin > User Management > Your User > Permissions
# Look for: departments:read, departments:create, etc.

# 3. Verify in JWT token (for developers)
# Decode token at jwt.io
# Look for: permissions array or role
```

**Solutions:**

| Endpoint                | Required Permission | How to Fix                           |
| ----------------------- | ------------------- | ------------------------------------ |
| GET /departments        | departments:read    | Ask admin to grant read permission   |
| POST /departments       | departments:create  | Ask admin to grant create permission |
| PUT /departments/:id    | departments:update  | Ask admin to grant update permission |
| DELETE /departments/:id | departments:delete  | Ask admin to grant delete permission |

**How to Request Permission:**

1. Contact system administrator
2. Provide: your username, required permission
3. Admin adds permission in User Management
4. You relogin to get new token
5. Try again

**For Admins:**

```sql
-- Check user permissions
SELECT * FROM user_permissions
WHERE user_id = 'USER_ID'
AND permission LIKE 'departments:%';

-- Add permission
INSERT INTO user_permissions (user_id, permission)
VALUES ('USER_ID', 'departments:read');
```

---

### Problem: 404 Not Found

**Symptoms:**

```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "Department with ID 999 not found"
}
```

**Diagnosis:**

```bash
# 1. Verify department exists
curl http://localhost:3000/api/departments | grep '"id"'

# 2. Check the ID you're using
# GET /api/departments/999
# Does ID 999 exist?

# 3. List all departments
curl http://localhost:3000/api/departments?limit=1000
# Look for the department you want
```

**Solutions:**

```bash
# Wrong: Using non-existent ID
curl http://localhost:3000/api/departments/999
# → Returns 404

# Correct: Find real ID first
curl http://localhost:3000/api/departments \
  | jq '.data[] | select(.dept_code=="ICU") | .id'
# Returns: 5

# Then use correct ID
curl http://localhost:3000/api/departments/5
# → Returns 200
```

---

### Problem: 400 Bad Request

**Symptoms:**

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Request body validation failed",
  "validation": [{ "field": "dept_code", "message": "Required field" }]
}
```

**Diagnosis:**

```bash
# 1. Check request body
# Are all required fields present?
# Required: dept_code, dept_name

# 2. Check field types
# dept_code: string (not number)
# parent_id: integer (not string)
# is_active: boolean (not string)

# 3. Check field length
# dept_code: max 10 characters
# dept_name: max 100 characters

# 4. Check format
# dept_code: must match pattern ^[A-Z0-9_-]+$
# (no lowercase, spaces, or special chars)
```

**Solutions:**

```bash
# Wrong: Missing required field
curl -X POST http://localhost:3000/api/departments \
  -H "Content-Type: application/json" \
  -d '{
    "dept_name": "Missing code"
  }'
# → Returns 400: dept_code is required

# Correct: Include all required fields
curl -X POST http://localhost:3000/api/departments \
  -H "Content-Type: application/json" \
  -d '{
    "dept_code": "ICU",
    "dept_name": "Intensive Care Unit"
  }'
# → Returns 201: Created

# Wrong: Invalid format
curl -X POST http://localhost:3000/api/departments \
  -H "Content-Type: application/json" \
  -d '{
    "dept_code": "icu",
    "dept_name": "ICU"
  }'
# → Returns 400: Code must be uppercase

# Correct: Use valid format
curl -X POST http://localhost:3000/api/departments \
  -H "Content-Type: application/json" \
  -d '{
    "dept_code": "ICU",
    "dept_name": "ICU"
  }'
# → Returns 201: Created
```

---

### Problem: 409 Conflict (Duplicate Code)

**Symptoms:**

```json
{
  "statusCode": 409,
  "error": "Conflict",
  "code": "DEPARTMENTS_CODE_EXISTS",
  "message": "Department code already exists"
}
```

**Diagnosis:**

```bash
# 1. Check if code exists
curl http://localhost:3000/api/departments \
  | jq '.data[] | select(.dept_code=="NURSING")'

# If found → Code is in use

# 2. Find by code
curl http://localhost:3000/api/departments?dept_code=NURSING
```

**Solutions:**

```
Option 1: Use different code
  Instead of: NURSING
  Use: NURSING-NEW, NURSING-TEMP, etc.

Option 2: Delete existing department (if it's test/old data)
  DELETE /api/departments/{id}
  → Only if no children or users assigned

Option 3: Check case-sensitivity
  Maybe: "NURSING" vs "nursing"
  Codes are case-sensitive (must be uppercase)
```

---

### Problem: 422 Unprocessable Entity

**Symptoms:**

```json
{
  "statusCode": 422,
  "code": "DEPARTMENTS_INVALID_PARENT",
  "message": "Invalid parent department",
  "details": { "parentId": 999 }
}
```

**Common 422 Errors:**

| Error Code                   | Cause                           | Solution                |
| ---------------------------- | ------------------------------- | ----------------------- |
| `INVALID_PARENT`             | Parent department doesn't exist | Verify parent_id exists |
| `CIRCULAR_HIERARCHY`         | Would create circle (A→B→C→A)   | Choose different parent |
| `CANNOT_DELETE_HAS_CHILDREN` | Has child departments           | Reassign children first |
| `CANNOT_DELETE_HAS_USERS`    | Has assigned users              | Reassign users first    |

**Diagnosis & Fix:**

```bash
# Error: INVALID_PARENT
# Cause: parent_id=999 doesn't exist

# Solution:
# 1. Get valid parent IDs
curl http://localhost:3000/api/departments | jq '.data[].id'

# 2. Use valid parent
curl -X POST http://localhost:3000/api/departments \
  -H "Content-Type: application/json" \
  -d '{
    "dept_code": "ICU",
    "dept_name": "ICU",
    "parent_id": 1
  }'
```

---

### Problem: 500 Internal Server Error

**Symptoms:**

```
500 Internal Server Error
```

**Diagnosis:**

```bash
# 1. Check server logs
tail -f logs/api.log

# 2. Check for stack trace
# Should show exact error and line number

# 3. Try to reproduce
# Make the exact same request that failed

# 4. Check dependencies
# - Is database connected?
# - Are services running?
```

**Solutions:**

1. **Restart API server**

   ```bash
   pnpm run dev:api
   # Should show if errors on startup
   ```

2. **Check database connection**

   ```bash
   # Can you connect to database?
   psql postgresql://user:pass@localhost/aegisx
   SELECT * FROM departments LIMIT 1;
   ```

3. **Check logs for clues**

   ```bash
   grep ERROR logs/api.log
   grep stack logs/api.log
   ```

4. **Contact support with logs**
   - Share full error from logs
   - Include exact API call made
   - Include timestamp when error occurred

---

## Data Issues

### Problem: Department Doesn't Appear

**Symptoms:**

- Department exists in database
- But doesn't appear in UI/API list
- Can't find it when searching

**Diagnosis:**

```bash
# 1. Check in database
psql postgresql://user:pass@localhost/aegisx

SELECT * FROM departments WHERE dept_code = 'ICU';

# 2. Check if active
SELECT id, dept_code, is_active FROM departments WHERE dept_code = 'ICU';

# 3. Check if deleted (soft delete)
SELECT id, dept_code, deleted_at FROM departments WHERE dept_code = 'ICU';

# 4. Try API directly
curl "http://localhost:3000/api/departments?search=ICU"
```

**Solutions:**

| Cause                      | Solution                                            |
| -------------------------- | --------------------------------------------------- |
| Department is inactive     | Activate: PUT /departments/{id} with is_active=true |
| Department is soft-deleted | Restore from backup or re-create                    |
| Filters hiding it          | Clear search/filters                                |
| Still processing import    | Wait for import to complete                         |
| Browser cache              | Clear cache and refresh (Ctrl+Shift+Del)            |

**Example:**

```bash
# Department exists but is_active=false
# Solution: Activate it
curl -X PUT http://localhost:3000/api/departments/1 \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"is_active": true}'

# Now it appears in dropdown lists and searches
```

---

### Problem: Circular Hierarchy Error

**Symptoms:**

```
Cannot create circular hierarchy in departments
```

**Diagnosis:**

```bash
# Understanding the problem:
# Department A has parent B
# Department B has parent C
# Try to set A's parent to C
# Result: A → C → B → A (circle!)

# Check current hierarchy
curl http://localhost:3000/api/departments/hierarchy
```

**Visual Example:**

```
Before:
A (has parent B)
  └─ B (has parent C)
      └─ C (has no parent)

Try to do: Make A's parent = C
  Result: A → C → B → A ❌ CIRCLE!
```

**Solutions:**

```bash
# Solution 1: Don't create the circle
# OK: A's parent = C
# Wrong: A's parent = B (already is)
# Wrong: A's parent = A (self)

# Solution 2: Move different department
# Instead of: Move A under C
# Try: Move C under A

# Solution 3: Move to unrelated parent
# Instead of: A → existing descendent
# Use: A → unrelated department
```

---

### Problem: Wrong Hierarchy Structure

**Symptoms:**

- Department hierarchy is incorrect
- Parents/children relationships wrong
- Tree structure doesn't match org chart

**Diagnosis:**

```bash
# 1. View current hierarchy
curl http://localhost:3000/api/departments/hierarchy | jq '.'

# 2. Compare with expected
# Expected:
# HOSPITAL
#   ├─ NURSING
#   └─ MEDICAL
#
# Actual:
# HOSPITAL
# NURSING
# MEDICAL
# (All at root level)

# 3. Check parent_id values
curl http://localhost:3000/api/departments | jq '.data[] | {id, dept_code, parent_id}'
```

**Solutions:**

```bash
# Fix 1: Update parent_id for departments
# NURSING has parent_id=NULL (should be HOSPITAL's id)

# Get HOSPITAL id
HOSPITAL_ID=$(curl http://localhost:3000/api/departments \
  | jq '.data[] | select(.dept_code=="HOSPITAL") | .id')

# Update NURSING to have HOSPITAL as parent
curl -X PUT http://localhost:3000/api/departments/NURSING_ID \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"parent_id\": $HOSPITAL_ID}"

# Fix 2: Bulk update via import
# Use System Init to re-import correct structure
```

---

## Performance Issues

### Problem: API Slow

**Symptoms:**

- Department list takes 5+ seconds
- Dropdown list takes 3+ seconds
- Hierarchy view times out

**Diagnosis:**

```bash
# 1. Check response time
time curl http://localhost:3000/api/departments \
  -H "Authorization: Bearer TOKEN"

# 2. Check database directly
psql postgresql://user:pass@localhost/aegisx

EXPLAIN ANALYZE SELECT * FROM departments;

# 3. Check server resources
free -h        # Memory
df -h          # Disk
top -b -n 1    # CPU
```

**Quick Solutions:**

```bash
# 1. Reduce limit
# Instead of: ?limit=1000
# Use: ?limit=20 (paginate)

curl "http://localhost:3000/api/departments?page=1&limit=20"

# 2. Search instead of list all
# Instead of: Get all, then search
# Use: API search parameter

curl "http://localhost:3000/api/departments?search=nursing"

# 3. Cache dropdown
# Cache is 5 minutes by default
# First call: slower (builds cache)
# Next 4 min: cached (fast)
```

**Advanced Debugging:**

```bash
# Enable query logging
# In development mode, API logs all queries

# Example output:
# Query: SELECT * FROM departments LIMIT 20 OFFSET 0
# Duration: 45ms

# Check if using indexes
EXPLAIN SELECT * FROM departments WHERE parent_id = 1;
# Should show: Index Scan (not Seq Scan)
```

---

### Problem: High Database CPU

**Symptoms:**

- Database CPU at 100%
- API slow
- Other services affected

**Diagnosis:**

```bash
# 1. Check running queries
psql postgresql://user:pass@localhost/aegisx

SELECT pid, usename, query, query_start
FROM pg_stat_activity
WHERE query LIKE '%departments%';

# 2. Check table size
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE tablename = 'departments';

# 3. Check missing indexes
SELECT * FROM pg_stat_user_indexes
WHERE relname = 'departments';
```

**Solutions:**

```sql
-- Add missing indexes
CREATE INDEX idx_departments_parent ON departments(parent_id);
CREATE INDEX idx_departments_active ON departments(is_active);

-- Analyze table (update statistics)
ANALYZE departments;

-- Vacuum to reclaim space
VACUUM ANALYZE departments;
```

---

## Import Issues

### Problem: Import Validation Fails

**Symptoms:**

```
Import validation shows errors
Cannot execute import
```

**Diagnosis:**

```bash
# 1. Check error details
# Error message shows: row #, field name, specific error

# Example:
# Row 5, Code: DUPLICATE_CODE
# Row 12, Parent: INVALID_REFERENCE

# 2. Review CSV file
# Check the problematic rows

# 3. Validate data types
# Code: must be string A-Z0-9_-
# Name: must be string 1-100 chars
# Parent: must reference existing code
```

**Common Errors:**

| Error             | Cause                       | Fix                        |
| ----------------- | --------------------------- | -------------------------- |
| DUPLICATE_CODE    | Code already exists         | Use different code         |
| REQUIRED_FIELD    | Missing required column     | Add dept_code or dept_name |
| INVALID_FORMAT    | Code has invalid characters | Use only A-Z 0-9 - \_      |
| INVALID_REFERENCE | Parent code doesn't exist   | Verify parent code         |

**Fix & Retry:**

```bash
# 1. Fix CSV file
# Edit rows with errors

# 2. Re-upload
# Upload corrected file

# 3. Validate again
# Check for errors

# 4. If all pass
# Click Execute to import
```

---

### Problem: Import Succeeds But Data Wrong

**Symptoms:**

- Import shows success
- But data in database is incorrect
- Hierarchy wrong, values wrong, etc.

**Diagnosis:**

```bash
# 1. Check imported data
curl http://localhost:3000/api/departments | head -20

# 2. Compare with import file
# What you sent vs what's stored

# 3. Check import batch ID
curl http://localhost:3000/api/departments | \
  jq '.data[] | select(.import_batch_id != null)'
```

**Solutions:**

```bash
# Option 1: Rollback and re-import
# Delete all records from this import
POST /api/admin/system-init/sessions/{sessionId}/rollback

# Option 2: Manual fixes
# GET /api/departments
# Find the problematic records
# PUT /api/departments/{id} to fix values

# Option 3: Delete and re-import
# DELETE /api/departments/{id}
# Re-upload correct file
```

---

## Database Issues

### Problem: Database Connection Error

**Symptoms:**

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Diagnosis:**

```bash
# 1. Is PostgreSQL running?
psql postgresql://user:pass@localhost/aegisx

# If not:
# Ubuntu/Debian: sudo systemctl start postgresql
# macOS: brew services start postgresql
# Docker: docker-compose up postgres

# 2. Check connection string
echo $DATABASE_URL

# Should be: postgresql://user:pass@localhost:5432/aegisx

# 3. Check port
netstat -an | grep 5432

# Should show: LISTEN on port 5432
```

**Solutions:**

```bash
# 1. Start PostgreSQL
sudo systemctl start postgresql

# 2. Check credentials
# .env.local should have correct DATABASE_URL

# 3. Create database if missing
createdb aegisx_dev

# 4. Run migrations
pnpm run db:migrate

# 5. Restart API
pnpm run dev:api
```

---

### Problem: Migration Failed

**Symptoms:**

- `pnpm run db:migrate` fails
- Error about departments table
- Cannot create departments

**Diagnosis:**

```bash
# 1. Check migration status
psql postgresql://user:pass@localhost/aegisx
SELECT * FROM knex_migrations ORDER BY batch DESC;

# 2. Check if table exists
\dt departments

# 3. Check errors
-- See migration logs
```

**Solutions:**

```bash
# 1. Rollback last migration
pnpm run db:rollback

# 2. Fix migration file
# Edit: apps/api/src/database/migrations/20251214060000_create_departments.ts

# 3. Re-run migration
pnpm run db:migrate

# 4. Verify
psql postgresql://user:pass@localhost/aegisx
SELECT * FROM departments LIMIT 1;
```

---

### Problem: Departments Table Not Created

**Symptoms:**

- Create department fails
- Error: table "departments" does not exist

**Diagnosis:**

```bash
# 1. Check table exists
psql postgresql://user:pass@localhost/aegisx
\dt departments

# If not listed: table doesn't exist

# 2. Check migrations run
SELECT * FROM knex_migrations
WHERE name LIKE '%departments%';

# If not in list: migration didn't run
```

**Solutions:**

```bash
# 1. Check migration file exists
ls -la apps/api/src/database/migrations/ | grep departments

# Should show:
# 20251214060000_create_departments.ts

# 2. Run migrations
pnpm run db:migrate

# 3. Verify
psql postgresql://user:pass@localhost/aegisx
\dt departments

# Should show table

# 4. Check columns
\d departments
```

---

## Authorization Issues

### Problem: Cannot Decode JWT Token

**Symptoms:**

```
Error: Invalid token
Error decoding JWT
```

**Diagnosis:**

```bash
# 1. Check token format
echo $AUTHORIZATION_HEADER

# Should be: "Bearer eyJhbGciOi..."
# Must have "Bearer " prefix

# 2. Decode token (online at jwt.io)
# Paste token (without "Bearer")

# 3. Check expiration
# Look for "exp" claim
# Should be future timestamp
```

**Solutions:**

```bash
# Fix 1: Use correct format
# Wrong: Authorization: Token xyz
# Correct: Authorization: Bearer xyz

# Fix 2: Request new token
# Old token expired
# Login again to get fresh token

# Fix 3: Check token signature
# Token may be tampered
# Request new token
```

---

### Problem: Permission Denied

**Symptoms:**

```
Error: Missing required permission 'departments:read'
```

**Diagnosis:**

```bash
# 1. Decode JWT token
# Paste at jwt.io (without "Bearer" prefix)

# 2. Check permissions claim
# Look for: "permissions": ["departments:read", ...]

# 3. Verify in database
psql postgresql://user:pass@localhost/aegisx
SELECT * FROM user_permissions WHERE user_id = 'YOUR_ID';

# Should include: departments:read
```

**Solutions:**

```bash
# As user: Ask admin for permission
# Contact: System Administrator
# Request: departments:read (and others needed)
# Wait for: Permission to be added
# Then: Logout and login again

# As admin: Grant permission
psql postgresql://user:pass@localhost/aegisx

INSERT INTO user_permissions (user_id, permission)
VALUES ('USER_ID', 'departments:read');

-- Then user must logout/login to get new token
```

---

## Advanced Debugging

### Enable Debug Logging

**Backend:**

```typescript
// In service method
console.log('DEBUG:', { operation: 'create', data });

// With Pino logger
request.log.debug({ body }, 'Request received');

// Environment variable
NODE_DEBUG=knex pnpm run dev:api
```

**Frontend:**

```javascript
// In browser console
localStorage.debug = 'app:*';
// Restart browser
```

### Database Query Analysis

```bash
# Analyze slow query
EXPLAIN ANALYZE
SELECT * FROM departments
WHERE parent_id = 1
ORDER BY dept_code;

# Look for:
# Seq Scan = slow (full table scan)
# Index Scan = fast (uses index)

# Add index if needed
CREATE INDEX idx_departments_parent ON departments(parent_id);
```

### API Request Debugging

```bash
# Verbose curl with all headers
curl -v http://localhost:3000/api/departments \
  -H "Authorization: Bearer TOKEN"

# Shows:
# > GET /api/departments HTTP/1.1
# > Authorization: Bearer ...
# < HTTP/1.1 200 OK
# < Content-Type: application/json
# < ...

# JSON pretty-print
curl http://localhost:3000/api/departments \
  -H "Authorization: Bearer TOKEN" | jq '.'
```

### WebSocket Debugging

```javascript
// In browser console
// Monitor WebSocket messages
const socket = io('http://localhost:3000');

socket.on('departments:created', (dept) => {
  console.log('New department:', dept);
});

socket.on('departments:updated', (dept) => {
  console.log('Updated department:', dept);
});

socket.on('departments:deleted', (id) => {
  console.log('Deleted department:', id);
});
```

---

## Getting Help

### Support Resources

1. **Documentation**
   - [API_REFERENCE.md](./API_REFERENCE.md) - All endpoints
   - [USER_GUIDE.md](./USER_GUIDE.md) - User instructions
   - [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) - Developer info

2. **Team Slack**
   - Channel: `#core-systems`
   - Tag: `@core-team`
   - Include: Error message + steps to reproduce

3. **GitHub Issues**
   - Report bugs: Create issue with logs
   - Request features: Describe use case
   - Include: Version, environment, error details

### Information to Include

When asking for help, provide:

```
1. Error message (exact text)
2. Steps to reproduce
3. Environment:
   - Node version
   - API version
   - Database type/version
4. Logs (last 50 lines)
5. Request/response (if API issue)
6. Expected vs actual behavior
```

### Escalation Path

```
L1: Self-service troubleshooting
    ↓ (Use this guide)
L2: Team Slack discussion
    ↓ (#core-systems channel)
L3: GitHub issue
    ↓ (For persistent issues)
L4: On-call engineer
    ↓ (For production emergencies)
L5: Engineering lead
    ↓ (For architectural decisions)
```

---

## Quick Reference

### Common Commands

```bash
# Check API health
curl http://localhost:3000/api/health

# List departments
curl http://localhost:3000/api/departments \
  -H "Authorization: Bearer TOKEN"

# Create department
curl -X POST http://localhost:3000/api/departments \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"dept_code":"ICU","dept_name":"ICU"}'

# Get logs
tail -f logs/api.log

# Check database
psql postgresql://user:pass@localhost/aegisx
SELECT COUNT(*) FROM departments;

# Restart services
pnpm run dev:api          # Restart API
docker-compose restart db # Restart database
```

### Error Code Reference

| Code | Meaning          | Action              |
| ---- | ---------------- | ------------------- |
| 401  | Unauthorized     | Add token header    |
| 403  | Forbidden        | Request permission  |
| 404  | Not found        | Check ID exists     |
| 400  | Bad request      | Fix request body    |
| 409  | Conflict         | Use different value |
| 422  | Validation error | Fix data            |
| 500  | Server error     | Check logs          |

---

For more information, see:

- [API_REFERENCE.md](./API_REFERENCE.md) - Complete API docs
- [SYSTEM_INIT_INTEGRATION.md](./SYSTEM_INIT_INTEGRATION.md) - Import troubleshooting
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical details
