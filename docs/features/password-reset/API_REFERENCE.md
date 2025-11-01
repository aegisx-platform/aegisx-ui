# Password Reset - API Reference

> **Complete API documentation for password reset endpoints**

## 📋 Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Rate Limiting](#rate-limiting)
- [Endpoints](#endpoints)
- [Request/Response Examples](#requestresponse-examples)
- [Error Codes](#error-codes)
- [Testing](#testing)

## 🎯 Overview

### Base URL

```
Development: http://localhost:3333/api
Production:  https://api.yourapp.com/api
```

### Content Type

```
Content-Type: application/json
Accept: application/json
```

### Response Format

All responses follow the standard API response format:

```typescript
{
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Array<{
      field: string;
      message: string;
      code: string;
    }>;
    statusCode: number;
  };
  meta: {
    timestamp: string;
    version: string;
    requestId: string;
    environment: 'development' | 'staging' | 'production';
  };
}
```

## 🔐 Authentication

### Public Endpoints

All password reset endpoints are **public** (no authentication required):

- `POST /auth/request-password-reset`
- `POST /auth/verify-reset-token`
- `POST /auth/reset-password`

**Why Public?**

- Users who forgot passwords can't authenticate
- Security enforced through time-limited tokens
- Rate limiting prevents abuse

## ⏱️ Rate Limiting

### Limits

| Endpoint                            | Limit      | Window   | Key        |
| ----------------------------------- | ---------- | -------- | ---------- |
| `POST /auth/request-password-reset` | 3 requests | 1 hour   | IP address |
| `POST /auth/verify-reset-token`     | No limit   | -        | -          |
| `POST /auth/reset-password`         | 5 attempts | 1 minute | IP address |

### Rate Limit Headers

```http
X-RateLimit-Limit: 3
X-RateLimit-Remaining: 2
X-RateLimit-Reset: 1699012800
```

### Rate Limit Error

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{
  "statusCode": 429,
  "error": "Too Many Requests",
  "message": "Rate limit exceeded, retry in 3600 seconds"
}
```

## 🔌 Endpoints

### 1. Request Password Reset

**Endpoint:** `POST /auth/request-password-reset`

**Description:** Send password reset email to user's registered email address.

**Rate Limit:** 3 requests per hour per IP

**Request:**

```typescript
{
  email: string; // Email address
}
```

**Success Response (200 OK):**

```typescript
{
  success: true,
  data: {
    message: "If an account with that email exists, a password reset link has been sent."
  },
  message: "If an account with that email exists, a password reset link has been sent.",
  meta: {
    timestamp: "2025-11-01T10:30:00.000Z",
    version: "v1",
    requestId: "req-abc123",
    environment: "production"
  }
}
```

**Security Note:** Response is always success (200 OK) regardless of whether email exists. This prevents email enumeration attacks.

**Validation Rules:**

- `email` must be valid email format
- `email` is required

**Example:**

```bash
curl -X POST http://localhost:3333/api/auth/request-password-reset \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

---

### 2. Verify Reset Token

**Endpoint:** `POST /auth/verify-reset-token`

**Description:** Verify if a password reset token is valid and not expired.

**Rate Limit:** None (read-only operation)

**Request:**

```typescript
{
  token: string; // Password reset token from email
}
```

**Success Response (200 OK):**

```typescript
{
  success: true,
  data: {
    message: "Reset token is valid",
    valid: true
  },
  message: "Reset token is valid",
  meta: {
    timestamp: "2025-11-01T10:35:00.000Z",
    version: "v1",
    requestId: "req-def456",
    environment: "production"
  }
}
```

**Error Response (400 Bad Request):**

```typescript
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Reset token has expired. Please request a new one.",
    details: [{
      field: "token",
      message: "Reset token has expired. Please request a new one.",
      code: "INVALID_TOKEN"
    }],
    statusCode: 400
  },
  meta: {
    timestamp: "2025-11-01T10:35:00.000Z",
    version: "v1",
    requestId: "req-def456",
    environment: "production"
  }
}
```

**Validation Rules:**

- `token` is required
- `token` minimum length: 1

**Possible Error Messages:**

- "Invalid reset token"
- "Reset token has already been used"
- "Reset token has expired. Please request a new one."

**Example:**

```bash
curl -X POST http://localhost:3333/api/auth/verify-reset-token \
  -H "Content-Type: application/json" \
  -d '{
    "token": "abc123def456..."
  }'
```

---

### 3. Reset Password

**Endpoint:** `POST /auth/reset-password`

**Description:** Reset user password using valid token.

**Rate Limit:** 5 attempts per minute per IP

**Request:**

```typescript
{
  token: string; // Password reset token from email
  newPassword: string; // New password (minimum 8 characters)
}
```

**Success Response (200 OK):**

```typescript
{
  success: true,
  data: {
    message: "Password has been reset successfully"
  },
  message: "Password has been reset successfully",
  meta: {
    timestamp: "2025-11-01T10:40:00.000Z",
    version: "v1",
    requestId: "req-ghi789",
    environment: "production"
  }
}
```

**Error Response (400 Bad Request):**

```typescript
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Reset token has expired. Please request a new one.",
    details: [{
      field: "token",
      message: "Reset token has expired. Please request a new one.",
      code: "PASSWORD_RESET_FAILED"
    }],
    statusCode: 400
  },
  meta: {
    timestamp: "2025-11-01T10:40:00.000Z",
    version: "v1",
    requestId: "req-ghi789",
    environment: "production"
  }
}
```

**Validation Rules:**

- `token` is required
- `token` minimum length: 1
- `newPassword` is required
- `newPassword` minimum length: 8 characters

**Side Effects:**

1. User password is updated (hashed with bcrypt)
2. Token is marked as used
3. **All user sessions are deleted** (user logged out everywhere)
4. IP address is logged for audit

**Example:**

```bash
curl -X POST http://localhost:3333/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "abc123def456...",
    "newPassword": "NewSecurePassword123!"
  }'
```

---

## 📝 Request/Response Examples

### Complete Flow Example

**1. Request Password Reset:**

```bash
# Request
POST /api/auth/request-password-reset
Content-Type: application/json

{
  "email": "john.doe@example.com"
}

# Response (200 OK)
{
  "success": true,
  "data": {
    "message": "If an account with that email exists, a password reset link has been sent."
  },
  "message": "If an account with that email exists, a password reset link has been sent.",
  "meta": {
    "timestamp": "2025-11-01T10:30:00.000Z",
    "version": "v1",
    "requestId": "req-abc123",
    "environment": "production"
  }
}
```

**2. User Clicks Link (Gets Token):**

Email contains link:

```
https://yourapp.com/reset-password?token=abc123def456...
```

Frontend extracts token from URL query parameter.

**3. Verify Token (Optional):**

```bash
# Request
POST /api/auth/verify-reset-token
Content-Type: application/json

{
  "token": "abc123def456..."
}

# Response (200 OK)
{
  "success": true,
  "data": {
    "message": "Reset token is valid",
    "valid": true
  },
  "message": "Reset token is valid",
  "meta": {
    "timestamp": "2025-11-01T10:35:00.000Z",
    "version": "v1",
    "requestId": "req-def456",
    "environment": "production"
  }
}
```

**4. Reset Password:**

```bash
# Request
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "abc123def456...",
  "newPassword": "NewSecurePassword123!"
}

# Response (200 OK)
{
  "success": true,
  "data": {
    "message": "Password has been reset successfully"
  },
  "message": "Password has been reset successfully",
  "meta": {
    "timestamp": "2025-11-01T10:40:00.000Z",
    "version": "v1",
    "requestId": "req-ghi789",
    "environment": "production"
  }
}
```

**5. Login with New Password:**

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "NewSecurePassword123!"
}
```

---

## ⚠️ Error Codes

### Validation Errors (400)

| Error Code         | Field         | Message                                | Cause               |
| ------------------ | ------------- | -------------------------------------- | ------------------- |
| `VALIDATION_ERROR` | `email`       | Email is required                      | Missing email field |
| `VALIDATION_ERROR` | `email`       | Invalid email format                   | Invalid email       |
| `VALIDATION_ERROR` | `token`       | Token is required                      | Missing token       |
| `VALIDATION_ERROR` | `token`       | Invalid reset token                    | Token doesn't exist |
| `VALIDATION_ERROR` | `token`       | Reset token has already been used      | Token reuse attempt |
| `VALIDATION_ERROR` | `token`       | Reset token has expired                | Token >1 hour old   |
| `VALIDATION_ERROR` | `newPassword` | Password is required                   | Missing password    |
| `VALIDATION_ERROR` | `newPassword` | Password must be at least 8 characters | Password too short  |

### Rate Limit Errors (429)

```json
{
  "statusCode": 429,
  "error": "Too Many Requests",
  "message": "Rate limit exceeded, retry in 3600 seconds"
}
```

**When It Happens:**

- More than 3 reset requests in 1 hour (per IP)
- More than 5 reset attempts in 1 minute (per IP)

**Solution:**

- Wait for time window to reset
- Use most recent reset link from email

### Server Errors (500)

```json
{
  "statusCode": 500,
  "error": "Internal Server Error",
  "message": "An error occurred"
}
```

**Common Causes:**

- Database connection issues
- Email service unavailable
- Server misconfiguration

---

## 🧪 Testing

### Manual Testing with cURL

**1. Request Reset:**

```bash
curl -v -X POST http://localhost:3333/api/auth/request-password-reset \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

**2. Get Token from Database (Development):**

```bash
# Using psql
psql -U postgres -d aegisx_db -c \
  "SELECT token FROM password_reset_tokens WHERE email='test@example.com' ORDER BY created_at DESC LIMIT 1"
```

**3. Verify Token:**

```bash
TOKEN="your-token-here"

curl -v -X POST http://localhost:3333/api/auth/verify-reset-token \
  -H "Content-Type: application/json" \
  -d "{\"token\": \"$TOKEN\"}"
```

**4. Reset Password:**

```bash
curl -v -X POST http://localhost:3333/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d "{\"token\": \"$TOKEN\", \"newPassword\": \"NewPassword123!\"}"
```

### Testing Rate Limiting

**Test Request Limit (3/hour):**

```bash
# Make 4 requests quickly
for i in {1..4}; do
  echo "Request $i:"
  curl -X POST http://localhost:3333/api/auth/request-password-reset \
    -H "Content-Type: application/json" \
    -d '{"email": "test@example.com"}'
  echo -e "\n---"
done

# 4th request should return 429
```

**Test Reset Limit (5/minute):**

```bash
# Get a valid token first
TOKEN="your-token-here"

# Make 6 reset attempts quickly
for i in {1..6}; do
  echo "Attempt $i:"
  curl -X POST http://localhost:3333/api/auth/reset-password \
    -H "Content-Type: application/json" \
    -d "{\"token\": \"$TOKEN\", \"newPassword\": \"Password$i!\"}"
  echo -e "\n---"
done

# 6th attempt should return 429
```

### Testing with Postman

**Collection Structure:**

```
Password Reset
├─ 1. Request Reset
├─ 2. Verify Token
└─ 3. Reset Password

Variables:
- {{baseUrl}}: http://localhost:3333/api
- {{email}}: test@example.com
- {{token}}: (set after step 1)
```

**Pre-request Scripts:**

```javascript
// Store token from response
pm.test('Store token', function () {
  var jsonData = pm.response.json();
  pm.environment.set('token', jsonData.data.token);
});
```

### Integration Test Example

```typescript
describe('Password Reset API', () => {
  it('should complete full reset flow', async () => {
    // 1. Request reset
    const requestResponse = await request(app.server).post('/api/auth/request-password-reset').send({ email: 'test@example.com' }).expect(200);

    expect(requestResponse.body.success).toBe(true);

    // 2. Get token from database
    const tokenRecord = await db('password_reset_tokens').where({ email: 'test@example.com' }).orderBy('created_at', 'desc').first();

    expect(tokenRecord).toBeDefined();

    // 3. Verify token
    const verifyResponse = await request(app.server).post('/api/auth/verify-reset-token').send({ token: tokenRecord.token }).expect(200);

    expect(verifyResponse.body.data.valid).toBe(true);

    // 4. Reset password
    const resetResponse = await request(app.server)
      .post('/api/auth/reset-password')
      .send({
        token: tokenRecord.token,
        newPassword: 'NewPassword123!',
      })
      .expect(200);

    expect(resetResponse.body.success).toBe(true);

    // 5. Verify sessions deleted
    const sessions = await db('user_sessions').where({ user_id: tokenRecord.user_id });

    expect(sessions.length).toBe(0);

    // 6. Login with new password
    const loginResponse = await request(app.server)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'NewPassword123!',
      })
      .expect(200);

    expect(loginResponse.body.success).toBe(true);
  });
});
```

---

## 📚 OpenAPI Specification

**Location:** `http://localhost:3333/documentation`

**Swagger UI:** Browse interactive API documentation

**Schema Export:**

```bash
# Get OpenAPI JSON
curl http://localhost:3333/documentation/json > openapi.json

# Get OpenAPI YAML
curl http://localhost:3333/documentation/yaml > openapi.yaml
```

---

**Document Version:** 1.0.0
**Last Updated:** 2025-11-01
**Related:** [Developer Guide](./DEVELOPER_GUIDE.md) | [Troubleshooting](./TROUBLESHOOTING.md)
