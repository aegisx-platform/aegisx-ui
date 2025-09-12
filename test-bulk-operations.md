# Test Bulk Operations API

## Test Plan for Bulk Operations

### Prerequisites

1. API server running on localhost:3333
2. Valid admin JWT token
3. Test users in database

### Test Cases

#### 1. Bulk Activate Users

```bash
curl -X POST http://localhost:3333/api/users/bulk/activate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "userIds": ["user-id-1", "user-id-2", "user-id-3"]
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "totalRequested": 3,
    "successCount": 2,
    "failureCount": 1,
    "results": [
      { "userId": "user-id-1", "success": true },
      { "userId": "user-id-2", "success": true },
      { "userId": "user-id-3", "success": false, "error": { "code": "USER_ALREADY_ACTIVE", "message": "User is already active" } }
    ],
    "summary": {
      "message": "Bulk activate completed with 2 successes and 1 failure",
      "hasFailures": true
    }
  }
}
```

#### 2. Bulk Deactivate Users

```bash
curl -X POST http://localhost:3333/api/users/bulk/deactivate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "userIds": ["user-id-1", "user-id-2"]
  }'
```

#### 3. Bulk Delete Users

```bash
curl -X POST http://localhost:3333/api/users/bulk/delete \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "userIds": ["user-id-1", "user-id-2"]
  }'
```

#### 4. Bulk Change User Roles

```bash
curl -X POST http://localhost:3333/api/users/bulk/role-change \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "userIds": ["user-id-1", "user-id-2"],
    "roleId": "role-uuid-here"
  }'
```

### Error Test Cases

#### 1. Unauthorized Access (No Token)

```bash
curl -X POST http://localhost:3333/api/users/bulk/activate \
  -H "Content-Type: application/json" \
  -d '{
    "userIds": ["user-id-1"]
  }'
```

Expected: 401 Unauthorized

#### 2. Non-Admin User

```bash
# Test with regular user token
curl -X POST http://localhost:3333/api/users/bulk/activate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer USER_JWT_TOKEN" \
  -d '{
    "userIds": ["user-id-1"]
  }'
```

Expected: 403 Forbidden

#### 3. Self-Protection Test

```bash
# Try to deactivate own account
curl -X POST http://localhost:3333/api/users/bulk/deactivate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -d '{
    "userIds": ["admin-user-id"]
  }'
```

Expected: Partial failure with CANNOT_DEACTIVATE_SELF error

#### 4. Invalid User IDs

```bash
curl -X POST http://localhost:3333/api/users/bulk/activate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "userIds": ["non-existent-id", "invalid-uuid"]
  }'
```

Expected: Partial failure with USER_NOT_FOUND errors

#### 5. Empty User Array

```bash
curl -X POST http://localhost:3333/api/users/bulk/activate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "userIds": []
  }'
```

Expected: 400 Validation Error

#### 6. Too Many Users (Over 100 limit)

```bash
curl -X POST http://localhost:3333/api/users/bulk/activate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "userIds": ['$(for i in {1..101}; do echo "\"user-$i\""; done | paste -sd,)']
  }'
```

Expected: 400 Validation Error

### Performance Tests

#### Test with Maximum Users (100)

```bash
curl -X POST http://localhost:3333/api/users/bulk/activate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "userIds": ['$(for i in {1..100}; do echo "\"user-$i\""; done | paste -sd,)']
  }'
```

### Security Tests

#### SQL Injection Attempt

```bash
curl -X POST http://localhost:3333/api/users/bulk/activate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "userIds": ["1; DROP TABLE users; --", "normal-uuid"]
  }'
```

Expected: Proper error handling, no SQL injection

### Test Results Template

| Test Case                      | Expected          | Actual | Status | Notes |
| ------------------------------ | ----------------- | ------ | ------ | ----- |
| Bulk Activate - Valid Users    | Success           |        | ❌/✅  |       |
| Bulk Activate - Already Active | Partial Failure   |        | ❌/✅  |       |
| Bulk Deactivate - Valid Users  | Success           |        | ❌/✅  |       |
| Bulk Delete - Valid Users      | Success           |        | ❌/✅  |       |
| Bulk Role Change - Valid       | Success           |        | ❌/✅  |       |
| Unauthorized Access            | 401               |        | ❌/✅  |       |
| Non-Admin Access               | 403               |        | ❌/✅  |       |
| Self-Protection                | Partial Failure   |        | ❌/✅  |       |
| Invalid User IDs               | Partial Failure   |        | ❌/✅  |       |
| Empty Array                    | 400               |        | ❌/✅  |       |
| Too Many Users                 | 400               |        | ❌/✅  |       |
| Performance (100 users)        | Success within 5s |        | ❌/✅  |       |
| SQL Injection                  | Proper error      |        | ❌/✅  |       |

## Manual Testing Steps

1. **Setup Environment**
   - Start API server: `nx serve api`
   - Start database: `docker-compose up -d postgres`
   - Run migrations: `npm run db:migrate`
   - Seed test data: `npm run db:seed`

2. **Get JWT Token**

   ```bash
   curl -X POST http://localhost:3333/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "admin@aegisx.local", "password": "Admin123!"}'
   ```

   Copy the JWT token from response.

3. **Run Test Cases**
   - Execute each test case above
   - Record results in the template
   - Verify error handling and business rules

4. **Verify Database Changes**
   - Check that users were actually activated/deactivated/deleted
   - Verify role changes in database
   - Confirm soft delete implementation

## Automation Script

Create a script to automate testing:

```bash
#!/bin/bash
# test-bulk-operations.sh

API_BASE="http://localhost:3333"
TOKEN="YOUR_JWT_TOKEN_HERE"

echo "Testing Bulk Operations API..."

# Test 1: Bulk Activate
echo "Test 1: Bulk Activate Users"
curl -X POST "$API_BASE/api/users/bulk/activate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"userIds":["test-user-1","test-user-2"]}' \
  | jq .

# Add more tests...
```

## Integration with Frontend

After API testing is complete, the frontend should implement:

1. Multi-select checkboxes in user list
2. Bulk action buttons (Activate, Deactivate, Delete, Change Role)
3. Progress indicators for bulk operations
4. Result display with success/failure counts
5. Error handling for partial failures

## Next Steps

1. ✅ Complete API implementation
2. 🔄 Manual API testing with curl/Postman
3. 🔄 Frontend bulk operations UI
4. 🔄 Integration testing
5. 🔄 Performance testing with large datasets
6. 🔄 Unit tests for service methods
7. 🔄 E2E tests with Playwright
