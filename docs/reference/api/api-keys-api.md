# API Keys API Reference

## Overview

The API Keys API enables programmatic access to the platform through secure, scoped API keys. Each key can be configured with specific permissions and expiration dates for granular access control.

**Base URL:** `/api/v1/platform/api-keys`
**Authentication:** Required (JWT Bearer Token)
**Permissions:** `api-keys:manage` for all endpoints

---

## Table of Contents

- [Authentication](#authentication)
- [Security Considerations](#security-considerations)
- [Endpoints](#endpoints)
  - [List API Keys](#list-api-keys)
  - [Create API Key](#create-api-key)
  - [Get API Key Details](#get-api-key-details)
  - [Update API Key](#update-api-key)
  - [Revoke API Key](#revoke-api-key)
  - [Get API Key Usage](#get-api-key-usage)
- [Using API Keys](#using-api-keys)
- [Data Models](#data-models)
- [Examples](#examples)

---

## Authentication

### JWT Authentication (for Management)

All management endpoints require JWT authentication:

```http
Authorization: Bearer <your-jwt-token>
```

### API Key Authentication (for API Requests)

To use an API key for making API requests:

```http
X-API-Key: pk_live_<your-api-key>
```

---

## Security Considerations

### Key Security Best Practices

1. **Store keys securely**: Never commit API keys to version control
2. **Use environment variables**: Store keys in `.env` files or secret managers
3. **Rotate regularly**: Generate new keys periodically
4. **Revoke unused keys**: Remove keys that are no longer needed
5. **Minimum permissions**: Grant only necessary permissions
6. **Monitor usage**: Track API key usage for anomalies

### Key Format

API keys follow the format: `pk_live_<random_base64_string>`

- `pk`: Prefix indicating "private key"
- `live`: Environment indicator
- Only the prefix is stored for identification; full key is shown once at creation

---

## Endpoints

### List API Keys

Retrieve all API keys for the authenticated user.

**Endpoint:** `GET /api/v1/platform/api-keys`
**Permission:** `api-keys:manage`

#### Query Parameters

| Parameter | Type    | Required | Default | Description                                 |
| --------- | ------- | -------- | ------- | ------------------------------------------- |
| `page`    | integer | No       | 1       | Page number for pagination                  |
| `limit`   | integer | No       | 20      | Number of items per page (max: 100)         |
| `status`  | string  | No       | -       | Filter by status (active, expired, revoked) |

#### Response

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "770e8400-e29b-41d4-a716-446655440000",
        "name": "Production API Key",
        "key_prefix": "pk_live_abc123",
        "permissions": ["users:read", "orders:read", "orders:write"],
        "last_used_at": "2025-12-16T10:30:00Z",
        "usage_count": 1543,
        "expires_at": "2026-12-16T00:00:00Z",
        "revoked": false,
        "created_at": "2025-12-16T08:00:00Z",
        "updated_at": "2025-12-16T10:30:00Z"
      },
      {
        "id": "880e8400-e29b-41d4-a716-446655440111",
        "name": "Development Key",
        "key_prefix": "pk_live_xyz789",
        "permissions": ["*:read"],
        "last_used_at": null,
        "usage_count": 0,
        "expires_at": null,
        "revoked": false,
        "created_at": "2025-12-15T14:20:00Z",
        "updated_at": "2025-12-15T14:20:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalItems": 2,
      "totalPages": 1
    }
  }
}
```

#### cURL Example

```bash
curl -X GET "http://localhost:3000/api/v1/platform/api-keys" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Create API Key

Generate a new API key with specified permissions and expiration.

**Endpoint:** `POST /api/v1/platform/api-keys`
**Permission:** `api-keys:manage`

#### Request Body

```json
{
  "name": "Production API Key",
  "permissions": ["users:read", "orders:read", "orders:write"],
  "expires_at": "2026-12-16T00:00:00Z"
}
```

#### Request Body Schema

| Field         | Type     | Required | Description                                          |
| ------------- | -------- | -------- | ---------------------------------------------------- |
| `name`        | string   | Yes      | Descriptive name for the API key                     |
| `permissions` | string[] | Yes      | Array of permission strings (e.g., "users:read")     |
| `expires_at`  | datetime | No       | Key expiration date (ISO 8601), null = never expires |

#### Response

```json
{
  "success": true,
  "data": {
    "key": "pk_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6",
    "keyData": {
      "id": "770e8400-e29b-41d4-a716-446655440000",
      "name": "Production API Key",
      "key_prefix": "pk_live_a1b2c3",
      "permissions": ["users:read", "orders:read", "orders:write"],
      "expires_at": "2026-12-16T00:00:00Z",
      "created_at": "2025-12-16T08:00:00Z"
    }
  },
  "warning": "⚠️ Save this API key immediately. It will not be shown again!"
}
```

**Important:** The full API key is returned only once. Store it securely immediately.

#### cURL Example

```bash
curl -X POST "http://localhost:3000/api/v1/platform/api-keys" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production API Key",
    "permissions": ["users:read", "orders:write"],
    "expires_at": "2026-12-16T00:00:00Z"
  }'
```

---

### Get API Key Details

Retrieve detailed information about a specific API key.

**Endpoint:** `GET /api/v1/platform/api-keys/:id`
**Permission:** `api-keys:manage`

#### Path Parameters

| Parameter | Type   | Required | Description  |
| --------- | ------ | -------- | ------------ |
| `id`      | string | Yes      | API key UUID |

#### Response

```json
{
  "success": true,
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440000",
    "name": "Production API Key",
    "key_prefix": "pk_live_abc123",
    "permissions": ["users:read", "orders:read", "orders:write"],
    "last_used_at": "2025-12-16T10:30:00Z",
    "usage_count": 1543,
    "expires_at": "2026-12-16T00:00:00Z",
    "revoked": false,
    "revoked_at": null,
    "created_at": "2025-12-16T08:00:00Z",
    "updated_at": "2025-12-16T10:30:00Z"
  }
}
```

#### cURL Example

```bash
curl -X GET "http://localhost:3000/api/v1/platform/api-keys/770e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Update API Key

Update an existing API key's name or permissions. Cannot update revoked keys.

**Endpoint:** `PUT /api/v1/platform/api-keys/:id`
**Permission:** `api-keys:manage`

#### Path Parameters

| Parameter | Type   | Required | Description  |
| --------- | ------ | -------- | ------------ |
| `id`      | string | Yes      | API key UUID |

#### Request Body

```json
{
  "name": "Updated Production Key",
  "permissions": ["users:read", "orders:read"]
}
```

#### Request Body Schema

| Field         | Type     | Required | Description               |
| ------------- | -------- | -------- | ------------------------- |
| `name`        | string   | No       | New name for the API key  |
| `permissions` | string[] | No       | Updated permissions array |

#### Response

```json
{
  "success": true,
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440000",
    "name": "Updated Production Key",
    "key_prefix": "pk_live_abc123",
    "permissions": ["users:read", "orders:read"],
    "updated_at": "2025-12-16T11:00:00Z"
  }
}
```

#### cURL Example

```bash
curl -X PUT "http://localhost:3000/api/v1/platform/api-keys/770e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Production Key",
    "permissions": ["users:read", "orders:read"]
  }'
```

---

### Revoke API Key

Permanently revoke an API key. This action cannot be undone.

**Endpoint:** `DELETE /api/v1/platform/api-keys/:id`
**Permission:** `api-keys:manage`

#### Path Parameters

| Parameter | Type   | Required | Description  |
| --------- | ------ | -------- | ------------ |
| `id`      | string | Yes      | API key UUID |

#### Response

```json
{
  "success": true,
  "message": "API key revoked successfully",
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440000",
    "revoked": true,
    "revoked_at": "2025-12-16T11:30:00Z"
  }
}
```

#### cURL Example

```bash
curl -X DELETE "http://localhost:3000/api/v1/platform/api-keys/770e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Get API Key Usage

Retrieve usage statistics for a specific API key.

**Endpoint:** `GET /api/v1/platform/api-keys/:id/usage`
**Permission:** `api-keys:manage`

#### Path Parameters

| Parameter | Type   | Required | Description  |
| --------- | ------ | -------- | ------------ |
| `id`      | string | Yes      | API key UUID |

#### Query Parameters

| Parameter   | Type     | Required | Default | Description                            |
| ----------- | -------- | -------- | ------- | -------------------------------------- |
| `startDate` | datetime | No       | -       | Usage data from this date (ISO 8601)   |
| `endDate`   | datetime | No       | -       | Usage data until this date (ISO 8601)  |
| `groupBy`   | string   | No       | day     | Group usage by: hour, day, week, month |

#### Response

```json
{
  "success": true,
  "data": {
    "totalRequests": 1543,
    "periodStart": "2025-12-01T00:00:00Z",
    "periodEnd": "2025-12-16T23:59:59Z",
    "usageByDate": [
      { "date": "2025-12-15", "requests": 234 },
      { "date": "2025-12-16", "requests": 189 }
    ],
    "usageByEndpoint": [
      { "endpoint": "/api/users", "method": "GET", "requests": 456 },
      { "endpoint": "/api/orders", "method": "POST", "requests": 234 }
    ],
    "lastUsed": {
      "endpoint": "/api/orders/123",
      "method": "GET",
      "timestamp": "2025-12-16T10:30:00Z",
      "statusCode": 200
    }
  }
}
```

#### cURL Example

```bash
curl -X GET "http://localhost:3000/api/v1/platform/api-keys/770e8400-e29b-41d4-a716-446655440000/usage?startDate=2025-12-01T00:00:00Z" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Using API Keys

### Making Authenticated Requests

Use the `X-API-Key` header to authenticate requests:

```bash
curl -X GET "http://localhost:3000/api/users" \
  -H "X-API-Key: pk_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6"
```

### Permission Format

Permissions follow the format: `<resource>:<action>`

**Common Permissions:**

| Permission       | Description                    |
| ---------------- | ------------------------------ |
| `users:read`     | Read user data                 |
| `users:write`    | Create/update users            |
| `orders:read`    | Read order data                |
| `orders:write`   | Create/update orders           |
| `products:read`  | Read product catalog           |
| `products:write` | Manage products                |
| `*:read`         | Read all resources             |
| `*:*`            | Full access (use with caution) |

### Rate Limiting

API keys are subject to rate limiting:

| Tier       | Requests per Hour | Requests per Day |
| ---------- | ----------------- | ---------------- |
| Default    | 1,000             | 10,000           |
| Premium    | 10,000            | 100,000          |
| Enterprise | Unlimited         | Unlimited        |

---

## Data Models

### ApiKey

```typescript
interface ApiKey {
  id: string; // UUID
  user_id: string; // UUID
  name: string;
  key_prefix: string; // First 10 chars of key for display
  permissions: string[]; // Array of permission strings
  last_used_at: string | null; // ISO 8601 datetime
  usage_count: number;
  expires_at: string | null; // ISO 8601 datetime
  revoked: boolean;
  revoked_at: string | null; // ISO 8601 datetime
  created_at: string; // ISO 8601 datetime
  updated_at: string; // ISO 8601 datetime
}
```

### ApiKeyUsage

```typescript
interface ApiKeyUsage {
  totalRequests: number;
  periodStart: string; // ISO 8601 datetime
  periodEnd: string; // ISO 8601 datetime
  usageByDate: Array<{
    date: string;
    requests: number;
  }>;
  usageByEndpoint: Array<{
    endpoint: string;
    method: string;
    requests: number;
  }>;
  lastUsed: {
    endpoint: string;
    method: string;
    timestamp: string; // ISO 8601 datetime
    statusCode: number;
  } | null;
}
```

---

## Examples

### Example 1: Complete API Key Lifecycle

```bash
#!/bin/bash

# Step 1: Create API key
echo "Creating API key..."
RESPONSE=$(curl -s -X POST "http://localhost:3000/api/v1/platform/api-keys" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production Key",
    "permissions": ["users:read", "orders:write"],
    "expires_at": "2026-12-31T23:59:59Z"
  }')

# Extract the API key (save immediately!)
API_KEY=$(echo $RESPONSE | jq -r '.data.key')
KEY_ID=$(echo $RESPONSE | jq -r '.data.keyData.id')
echo "✅ API Key created: $API_KEY"
echo "Save this key immediately!"

# Step 2: Test the API key
echo -e "\nTesting API key..."
curl -X GET "http://localhost:3000/api/users" \
  -H "X-API-Key: $API_KEY"

# Step 3: Check usage
echo -e "\nChecking usage..."
curl -X GET "http://localhost:3000/api/v1/platform/api-keys/$KEY_ID/usage" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  | jq '.data'

# Step 4: Revoke when done
echo -e "\nRevoking key..."
curl -X DELETE "http://localhost:3000/api/v1/platform/api-keys/$KEY_ID" \
  -H "Authorization: Bearer $JWT_TOKEN"
```

### Example 2: Managing Multiple API Keys

```typescript
// TypeScript/Node.js example
class ApiKeyManager {
  private baseUrl = 'http://localhost:3000/api/v1/platform/api-keys';
  private jwtToken: string;

  constructor(jwtToken: string) {
    this.jwtToken = jwtToken;
  }

  async createKey(name: string, permissions: string[], expiresAt?: string) {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.jwtToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, permissions, expires_at: expiresAt }),
    });

    const data = await response.json();

    if (data.success) {
      console.log(`✅ Created key: ${name}`);
      console.log(`⚠️  KEY (save now): ${data.data.key}`);
      return data.data;
    } else {
      throw new Error(`Failed to create key: ${data.error.message}`);
    }
  }

  async listKeys() {
    const response = await fetch(this.baseUrl, {
      headers: {
        Authorization: `Bearer ${this.jwtToken}`,
      },
    });

    const data = await response.json();
    return data.data.items;
  }

  async revokeKey(keyId: string) {
    const response = await fetch(`${this.baseUrl}/${keyId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.jwtToken}`,
      },
    });

    const data = await response.json();
    return data.success;
  }

  async cleanupExpiredKeys() {
    const keys = await this.listKeys();
    const now = new Date();

    for (const key of keys) {
      if (key.expires_at && new Date(key.expires_at) < now) {
        console.log(`Revoking expired key: ${key.name}`);
        await this.revokeKey(key.id);
      }
    }
  }
}

// Usage
const manager = new ApiKeyManager('YOUR_JWT_TOKEN');

// Create production key
const prodKey = await manager.createKey('Production API', ['users:read', 'orders:write'], '2026-12-31T23:59:59Z');

// Create development key (no expiration)
const devKey = await manager.createKey('Development API', ['*:read']);

// List all keys
const allKeys = await manager.listKeys();
console.log(`Total keys: ${allKeys.length}`);

// Cleanup expired keys
await manager.cleanupExpiredKeys();
```

### Example 3: Monitoring API Key Usage

```bash
#!/bin/bash
# monitor-api-keys.sh - Run daily to monitor API key usage

echo "📊 API Key Usage Report - $(date)"
echo "================================"

# Get all keys
KEYS=$(curl -s "http://localhost:3000/api/v1/platform/api-keys" \
  -H "Authorization: Bearer $JWT_TOKEN")

# Loop through each key
echo "$KEYS" | jq -r '.data.items[] | @base64' | while read key; do
  _jq() {
    echo ${key} | base64 --decode | jq -r ${1}
  }

  KEY_ID=$(_jq '.id')
  KEY_NAME=$(_jq '.name')
  USAGE_COUNT=$(_jq '.usage_count')
  LAST_USED=$(_jq '.last_used_at')

  echo ""
  echo "🔑 $KEY_NAME"
  echo "   ID: $KEY_ID"
  echo "   Total Requests: $USAGE_COUNT"
  echo "   Last Used: ${LAST_USED:-'Never'}"

  # Get detailed usage
  USAGE=$(curl -s "http://localhost:3000/api/v1/platform/api-keys/$KEY_ID/usage?startDate=$(date -d '7 days ago' +%Y-%m-%dT00:00:00Z)" \
    -H "Authorization: Bearer $JWT_TOKEN")

  WEEKLY_REQUESTS=$(echo $USAGE | jq '.data.totalRequests')
  echo "   Last 7 Days: $WEEKLY_REQUESTS requests"

  # Check if approaching rate limit
  if [ "$WEEKLY_REQUESTS" -gt 9000 ]; then
    echo "   ⚠️  WARNING: Approaching rate limit!"
  fi
done
```

### Example 4: Secure API Key Storage

```typescript
// Secure storage patterns for API keys

// 1. Environment Variables
process.env.API_KEY = 'pk_live_...';

// 2. .env File (NEVER commit!)
// .env
API_KEY=pk_live_a1b2c3d4...
DATABASE_URL=postgresql://...

// 3. Secret Manager (AWS Secrets Manager, Google Secret Manager, etc.)
import { SecretsManager } from '@aws-sdk/client-secrets-manager';

class SecureKeyStorage {
  private secretsManager = new SecretsManager({ region: 'us-east-1' });

  async getApiKey(keyName: string): Promise<string> {
    const secret = await this.secretsManager.getSecretValue({
      SecretId: keyName
    });

    return JSON.parse(secret.SecretString!).apiKey;
  }

  async rotateApiKey(keyName: string, newKey: string): Promise<void> {
    await this.secretsManager.updateSecret({
      SecretId: keyName,
      SecretString: JSON.stringify({ apiKey: newKey })
    });
  }
}

// 4. Key Rotation Strategy
class ApiKeyRotator {
  private manager: ApiKeyManager;
  private storage: SecureKeyStorage;

  async rotateKey(oldKeyId: string, keyName: string) {
    // Create new key
    const newKey = await this.manager.createKey(
      keyName,
      ['users:read', 'orders:write'],
      this.getExpirationDate(90) // 90 days
    );

    // Store new key securely
    await this.storage.rotateApiKey(keyName, newKey.key);

    // Revoke old key after grace period
    setTimeout(async () => {
      await this.manager.revokeKey(oldKeyId);
      console.log(`✅ Old key revoked: ${keyName}`);
    }, 7 * 24 * 60 * 60 * 1000); // 7 days grace period
  }

  private getExpirationDate(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString();
  }
}
```

---

## Security Best Practices

### 1. Key Creation

- Use descriptive names to identify key purpose
- Grant minimum necessary permissions
- Set expiration dates for all keys
- Document where each key is used

### 2. Key Storage

- Store in environment variables or secret managers
- Never hardcode in source code
- Never commit to version control
- Encrypt at rest and in transit

### 3. Key Usage

- Use HTTPS for all API requests
- Implement retry logic with exponential backoff
- Handle rate limiting gracefully
- Monitor usage patterns for anomalies

### 4. Key Rotation

- Rotate keys every 90 days
- Implement automatic rotation for production keys
- Maintain grace period when rotating
- Document rotation procedures

### 5. Incident Response

- Have revocation procedures ready
- Monitor for unauthorized usage
- Log all API key activities
- Set up alerts for suspicious patterns

---

## Rate Limits

| Endpoint Type     | Limit        | Window   |
| ----------------- | ------------ | -------- |
| Create Key        | 5 requests   | 1 hour   |
| List Keys         | 100 requests | 1 minute |
| Get/Update/Revoke | 50 requests  | 1 minute |
| Usage Stats       | 50 requests  | 1 minute |

**API Key Requests:** Limited based on tier (see [Using API Keys](#using-api-keys))

---

## Error Codes

| Status Code | Error Code              | Description                       |
| ----------- | ----------------------- | --------------------------------- |
| 400         | `INVALID_PERMISSIONS`   | Invalid permission format         |
| 401         | `UNAUTHORIZED`          | Missing or invalid authentication |
| 403         | `FORBIDDEN`             | Insufficient permissions          |
| 403         | `KEY_REVOKED`           | API key has been revoked          |
| 403         | `KEY_EXPIRED`           | API key has expired               |
| 404         | `KEY_NOT_FOUND`         | API key not found                 |
| 429         | `RATE_LIMIT_EXCEEDED`   | Too many requests                 |
| 500         | `INTERNAL_SERVER_ERROR` | Server error                      |

---

## Changelog

### v1.0.0 (2025-12-16)

- Initial API release
- Core CRUD operations
- Usage tracking
- Permission-based access control

---

## Support

For issues or questions:

- GitHub Issues: https://github.com/aegisx-platform/aegisx-starter/issues
- Documentation: https://aegisx-platform.github.io/aegisx-starter-1/
- Email: support@aegisx.io
