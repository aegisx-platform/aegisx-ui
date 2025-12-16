# User Profile Management - API Contracts

## 📋 API Overview

**Base URL**: `/api/profile`  
**Authentication**: JWT Bearer Token Required  
**Content Type**: `application/json`

## 🛠️ Endpoints

### 1. Get User Profile

**GET** `/api/profile`

**Authentication:** Required

#### Request Example

```bash
curl -X GET http://localhost:3333/api/profile \
  -H "Authorization: Bearer <jwt_token>"
```

#### Response Schema

```typescript
{
  success: boolean;
  data: UserProfile;
  message?: string;
}
```

#### Response Example (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "bio": "Software developer and tech enthusiast",
    "avatar": "http://localhost:4200/api/uploads/avatars/user-uuid/avatar.jpg",
    "role": "user",
    "status": "active",
    "emailVerified": true,
    "createdAt": "2025-09-13T10:30:00Z",
    "updatedAt": "2025-09-13T10:30:00Z",
    "preferences": {
      "theme": "dark",
      "scheme": "dark",
      "layout": "compact",
      "language": "en",
      "timezone": "UTC",
      "dateFormat": "MM/DD/YYYY",
      "timeFormat": "24h",
      "notifications": {
        "email": true,
        "push": false,
        "desktop": true,
        "sound": false
      },
      "navigation": {
        "collapsed": false,
        "type": "default",
        "position": "left"
      }
    }
  }
}
```

#### Error Responses

**401 Unauthorized** - Missing or invalid JWT token:

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required",
    "statusCode": 401
  }
}
```

**400 Bad Request** - Invalid request:

```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Invalid request format",
    "statusCode": 400
  }
}
```

**500 Internal Server Error** - Server error:

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Internal server error",
    "statusCode": 500
  }
}
```

### 2. Update User Profile

**PUT** `/api/profile`

**Authentication:** Required

#### Request Schema

```typescript
{
  firstName?: string;
  lastName?: string;
  username?: string;
  bio?: string;
}
```

#### Request Example

```bash
curl -X PUT http://localhost:3333/api/profile \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Smith",
    "bio": "Updated bio information"
  }'
```

#### Response Example (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Smith",
    "bio": "Updated bio information",
    "avatar": "http://localhost:4200/api/uploads/avatars/user-uuid/avatar.jpg",
    "role": "user",
    "status": "active",
    "emailVerified": true,
    "createdAt": "2025-09-13T10:30:00Z",
    "updatedAt": "2025-12-16T16:00:00Z",
    "preferences": {}
  }
}
```

#### Error Responses

**400 Bad Request** - Validation error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "firstName": ["Must be at most 50 characters"]
    },
    "statusCode": 400
  }
}
```

**401 Unauthorized** - Missing or invalid JWT token:

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required",
    "statusCode": 401
  }
}
```

**422 Unprocessable Entity** - Business rule violation (e.g., username already taken):

```json
{
  "success": false,
  "error": {
    "code": "USERNAME_ALREADY_EXISTS",
    "message": "Username is already taken",
    "statusCode": 422
  }
}
```

**500 Internal Server Error** - Server error:

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Internal server error",
    "statusCode": 500
  }
}
```

### 3. Change Password

**POST** `/api/profile/password`

**Authentication:** Required

#### Request Schema

```typescript
{
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
```

#### Request Example

```bash
curl -X POST http://localhost:3333/api/profile/password \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "oldPassword123",
    "newPassword": "newPassword456",
    "confirmPassword": "newPassword456"
  }'
```

#### Response Example (200 OK)

```json
{
  "success": true,
  "data": {
    "message": "Password changed successfully",
    "changedAt": "2025-12-16T16:00:00Z"
  }
}
```

#### Error Responses

**400 Bad Request** - Current password incorrect:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CURRENT_PASSWORD",
    "message": "Current password is incorrect",
    "statusCode": 400
  }
}
```

**401 Unauthorized** - Missing or invalid JWT token:

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required",
    "statusCode": 401
  }
}
```

**422 Unprocessable Entity** - Passwords do not match:

```json
{
  "success": false,
  "error": {
    "code": "PASSWORDS_DO_NOT_MATCH",
    "message": "New password and confirm password do not match",
    "statusCode": 422
  }
}
```

**422 Unprocessable Entity** - Password validation error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Password validation failed",
    "details": {
      "newPassword": ["Password must be at least 8 characters long"],
      "confirmPassword": ["Password must be at least 8 characters long"]
    },
    "statusCode": 422
  }
}
```

**500 Internal Server Error** - Server error:

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Internal server error",
    "statusCode": 500
  }
}
```

#### TypeBox Schema

```typescript
export const ChangePasswordSchema = Type.Object({
  currentPassword: Type.String({ minLength: 1 }),
  newPassword: Type.String({ minLength: 8, maxLength: 128 }),
  confirmPassword: Type.String({ minLength: 8, maxLength: 128 }),
});
```

### 4. Upload Avatar

**POST** `/api/profile/avatar`

**Authentication:** Required

**Content-Type:** `multipart/form-data`

#### Request

- **Body**: Form data with `avatar` file field
- **Max file size**: 5MB
- **Supported formats**: JPG, PNG, WebP

#### Request Example

```bash
curl -X POST http://localhost:3333/api/profile/avatar \
  -H "Authorization: Bearer <jwt_token>" \
  -F "avatar=@/path/to/image.jpg"
```

#### Response Example (200 OK)

```json
{
  "success": true,
  "data": {
    "avatar": "http://localhost:4200/api/uploads/avatars/user-uuid/avatar.jpg",
    "thumbnails": {
      "small": "http://localhost:4200/api/uploads/avatars/user-uuid/avatar-small.jpg",
      "medium": "http://localhost:4200/api/uploads/avatars/user-uuid/avatar-medium.jpg",
      "large": "http://localhost:4200/api/uploads/avatars/user-uuid/avatar-large.jpg"
    }
  },
  "message": "Avatar uploaded successfully"
}
```

#### Error Responses

**400 Bad Request** - Invalid file format or size:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_FILE",
    "message": "File must be JPG, PNG, or WebP and not exceed 5MB",
    "statusCode": 400
  }
}
```

**401 Unauthorized** - Missing or invalid JWT token:

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required",
    "statusCode": 401
  }
}
```

**422 Unprocessable Entity** - File upload validation failed:

```json
{
  "success": false,
  "error": {
    "code": "UPLOAD_ERROR",
    "message": "Failed to process avatar",
    "statusCode": 422
  }
}
```

**500 Internal Server Error** - Server error:

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Internal server error",
    "statusCode": 500
  }
}
```

### 5. Delete Avatar

**DELETE** `/api/profile/avatar`

**Authentication:** Required

#### Request Example

```bash
curl -X DELETE http://localhost:3333/api/profile/avatar \
  -H "Authorization: Bearer <jwt_token>"
```

#### Response Example (200 OK)

```json
{
  "success": true,
  "data": {
    "message": "Avatar deleted successfully"
  }
}
```

#### Error Responses

**401 Unauthorized** - Missing or invalid JWT token:

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required",
    "statusCode": 401
  }
}
```

**400 Bad Request** - No avatar to delete:

```json
{
  "success": false,
  "error": {
    "code": "NO_AVATAR",
    "message": "No avatar found to delete",
    "statusCode": 400
  }
}
```

**422 Unprocessable Entity** - Deletion failed:

```json
{
  "success": false,
  "error": {
    "code": "DELETION_ERROR",
    "message": "Failed to delete avatar",
    "statusCode": 422
  }
}
```

**500 Internal Server Error** - Server error:

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Internal server error",
    "statusCode": 500
  }
}
```

### 6. Get User Preferences

**GET** `/api/profile/preferences`

**Authentication:** Required

#### Request Example

```bash
curl -X GET http://localhost:3333/api/profile/preferences \
  -H "Authorization: Bearer <jwt_token>"
```

#### Response Example (200 OK)

```json
{
  "success": true,
  "data": {
    "theme": "dark",
    "scheme": "dark",
    "layout": "compact",
    "language": "en",
    "timezone": "UTC",
    "dateFormat": "MM/DD/YYYY",
    "timeFormat": "24h",
    "notifications": {
      "email": true,
      "push": false,
      "desktop": true,
      "sound": false
    },
    "navigation": {
      "collapsed": false,
      "type": "default",
      "position": "left"
    }
  }
}
```

#### Error Responses

**401 Unauthorized** - Missing or invalid JWT token:

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required",
    "statusCode": 401
  }
}
```

**400 Bad Request** - Invalid request:

```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Invalid request format",
    "statusCode": 400
  }
}
```

**500 Internal Server Error** - Server error:

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Internal server error",
    "statusCode": 500
  }
}
```

### 7. Update User Preferences

**PUT** `/api/profile/preferences`

**Authentication:** Required

#### Request Schema

```typescript
{
  theme?: 'default' | 'dark' | 'light' | 'auto';
  scheme?: 'light' | 'dark' | 'auto';
  layout?: 'classic' | 'compact' | 'enterprise' | 'empty';
  language?: string;
  timezone?: string;
  dateFormat?: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  timeFormat?: '12h' | '24h';
  notifications?: {
    email?: boolean;
    push?: boolean;
    desktop?: boolean;
    sound?: boolean;
  };
  navigation?: {
    collapsed?: boolean;
    type?: 'default' | 'compact' | 'horizontal';
    position?: 'left' | 'right' | 'top';
  };
}
```

#### Request Example

```bash
curl -X PUT http://localhost:3333/api/profile/preferences \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "theme": "light",
    "layout": "classic",
    "timeFormat": "12h"
  }'
```

#### Response Example (200 OK)

```json
{
  "success": true,
  "data": {
    "theme": "light",
    "scheme": "light",
    "layout": "classic",
    "language": "en",
    "timezone": "UTC",
    "dateFormat": "MM/DD/YYYY",
    "timeFormat": "12h",
    "notifications": {
      "email": true,
      "push": false,
      "desktop": true,
      "sound": false
    },
    "navigation": {
      "collapsed": false,
      "type": "default",
      "position": "left"
    }
  }
}
```

#### Error Responses

**400 Bad Request** - Validation error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid preference values",
    "details": {
      "theme": ["Invalid theme value"]
    },
    "statusCode": 400
  }
}
```

**401 Unauthorized** - Missing or invalid JWT token:

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required",
    "statusCode": 401
  }
}
```

**422 Unprocessable Entity** - Business rule violation:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_PREFERENCES",
    "message": "Failed to update preferences",
    "statusCode": 422
  }
}
```

**500 Internal Server Error** - Server error:

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Internal server error",
    "statusCode": 500
  }
}
```

### 8. Get User Activity Logs

**GET** `/api/profile/activity`

**Authentication:** Required

#### Query Parameters

- `page` (integer, optional): Page number for pagination (default: 1)
- `limit` (integer, optional): Number of items per page (default: 20)

#### Request Example

```bash
curl -X GET "http://localhost:3333/api/profile/activity?page=1&limit=20" \
  -H "Authorization: Bearer <jwt_token>"
```

#### Response Example (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id": "log-uuid-1",
      "action": "login",
      "ipAddress": "192.168.1.100",
      "userAgent": "Mozilla/5.0...",
      "timestamp": "2025-12-16T15:30:00Z"
    },
    {
      "id": "log-uuid-2",
      "action": "profile_update",
      "ipAddress": "192.168.1.100",
      "userAgent": "Mozilla/5.0...",
      "timestamp": "2025-12-16T14:15:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 42,
    "totalPages": 3
  }
}
```

#### Error Responses

**401 Unauthorized** - Missing or invalid JWT token:

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required",
    "statusCode": 401
  }
}
```

**400 Bad Request** - Invalid pagination parameters:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_PAGINATION",
    "message": "Invalid page or limit value",
    "statusCode": 400
  }
}
```

**500 Internal Server Error** - Server error:

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Internal server error",
    "statusCode": 500
  }
}
```

### 9. Delete User Account

**DELETE** `/api/profile`

**Authentication:** Required

#### Request Example

```bash
curl -X DELETE http://localhost:3333/api/profile \
  -H "Authorization: Bearer <jwt_token>"
```

#### Response Example (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "message": "Account deleted successfully"
  }
}
```

#### Error Responses

**401 Unauthorized** - Missing or invalid JWT token:

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required",
    "statusCode": 401
  }
}
```

**400 Bad Request** - Invalid deletion request:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Cannot delete account at this time",
    "statusCode": 400
  }
}
```

**422 Unprocessable Entity** - Account has active sessions or pending operations:

```json
{
  "success": false,
  "error": {
    "code": "ACCOUNT_NOT_DELETABLE",
    "message": "Account cannot be deleted due to active sessions",
    "statusCode": 422
  }
}
```

**500 Internal Server Error** - Server error:

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Internal server error",
    "statusCode": 500
  }
}
```

## 📊 Data Models

### UserProfile Model

```typescript
interface UserProfile {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
  role: string;
  status: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  preferences?: UserPreferences;
}
```

### UserPreferences Model

```typescript
interface UserPreferences {
  theme: 'default' | 'dark' | 'light' | 'auto';
  scheme: 'light' | 'dark' | 'auto';
  layout: 'classic' | 'compact' | 'enterprise' | 'empty';
  language: string;
  timezone: string;
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
    sound: boolean;
  };
  navigation: {
    collapsed: boolean;
    type: 'default' | 'compact' | 'horizontal';
    position: 'left' | 'right' | 'top';
  };
}
```

## ❌ Error Responses

### Error Schema

```typescript
{
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

### Common Error Codes

- `400` Bad Request - Invalid request data
- `401` Unauthorized - Missing or invalid JWT token
- `403` Forbidden - Insufficient permissions
- `422` Validation Error - Request validation failed
- `500` Internal Server Error - Server error

### Error Examples

#### Validation Error (422)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Password validation failed",
    "details": {
      "newPassword": ["Password must be at least 8 characters long"],
      "confirmPassword": ["Passwords do not match"]
    }
  }
}
```

#### Unauthorized Error (401)

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

## 🔐 Authentication & Authorization

### Authentication

All endpoints require JWT Bearer token in Authorization header:

```http
Authorization: Bearer <jwt_token>
```

### File Upload Requirements

- **Avatar Upload**:
  - Max file size: 5MB
  - Supported formats: JPG, PNG, WebP
  - Files are automatically resized and optimized
  - Multiple thumbnail sizes generated

## 📝 TypeBox Schemas

### Profile Update Schema

```typescript
export const UpdateProfileSchema = Type.Object({
  firstName: Type.Optional(Type.String({ minLength: 1, maxLength: 50 })),
  lastName: Type.Optional(Type.String({ minLength: 1, maxLength: 50 })),
  username: Type.Optional(Type.String({ minLength: 3, maxLength: 30 })),
  bio: Type.Optional(Type.String({ maxLength: 500 })),
});
```

### Password Change Schema

```typescript
export const ChangePasswordSchema = Type.Object({
  currentPassword: Type.String({ minLength: 1 }),
  newPassword: Type.String({ minLength: 8 }),
  confirmPassword: Type.String({ minLength: 8 }),
});
```

### Preferences Update Schema

```typescript
export const UpdatePreferencesSchema = Type.Object({
  theme: Type.Optional(Type.Union([Type.Literal('default'), Type.Literal('dark'), Type.Literal('light'), Type.Literal('auto')])),
  scheme: Type.Optional(Type.Union([Type.Literal('light'), Type.Literal('dark'), Type.Literal('auto')])),
  layout: Type.Optional(Type.Union([Type.Literal('classic'), Type.Literal('compact'), Type.Literal('enterprise'), Type.Literal('empty')])),
  language: Type.Optional(Type.String()),
  timezone: Type.Optional(Type.String()),
  dateFormat: Type.Optional(Type.Union([Type.Literal('MM/DD/YYYY'), Type.Literal('DD/MM/YYYY'), Type.Literal('YYYY-MM-DD')])),
  timeFormat: Type.Optional(Type.Union([Type.Literal('12h'), Type.Literal('24h')])),
  notifications: Type.Optional(
    Type.Object({
      email: Type.Optional(Type.Boolean()),
      push: Type.Optional(Type.Boolean()),
      desktop: Type.Optional(Type.Boolean()),
      sound: Type.Optional(Type.Boolean()),
    }),
  ),
  navigation: Type.Optional(
    Type.Object({
      collapsed: Type.Optional(Type.Boolean()),
      type: Type.Optional(Type.Union([Type.Literal('default'), Type.Literal('compact'), Type.Literal('horizontal')])),
      position: Type.Optional(Type.Union([Type.Literal('left'), Type.Literal('right'), Type.Literal('top')])),
    }),
  ),
});
```

## 🧪 Test Cases

### Unit Test Cases

1. **GET /api/profile**
   - Returns user profile with preferences
   - Returns 401 for invalid token
   - Handles missing user data

2. **PUT /api/profile**
   - Updates profile successfully
   - Validates input fields
   - Returns validation errors
   - Handles username conflicts

3. **POST /api/profile/password**
   - Changes password successfully
   - Validates current password
   - Validates new password strength
   - Confirms password match

4. **POST /api/profile/avatar**
   - Uploads avatar successfully
   - Validates file type and size
   - Generates thumbnails
   - Handles upload errors

5. **PUT /api/profile/preferences**
   - Updates preferences successfully
   - Validates preference values
   - Handles partial updates

### Integration Test Cases

1. **Complete profile management workflow**
2. **File upload and avatar management**
3. **Password security and validation**
4. **Preferences persistence and retrieval**
5. **Error handling across all endpoints**

## 📋 Implementation Status

### Backend Implementation

- [x] Database migrations ✅ Completed
- [x] TypeBox schemas defined ✅ Completed
- [x] Repository layer implemented ✅ Completed
- [x] Service layer implemented ✅ Completed
- [x] Controller layer implemented ✅ Completed
- [x] Route registration ✅ Completed
- [x] Validation middleware ✅ Completed
- [x] Error handling ✅ Completed
- [x] Unit tests written ✅ Completed
- [x] Integration tests written ✅ Completed

### Frontend Implementation

- [x] Service interfaces defined ✅ Completed
- [x] HTTP client implementation ✅ Completed
- [x] Type definitions created ✅ Completed
- [x] Error handling implemented ✅ Completed
- [x] Loading states managed ✅ Completed
- [x] Response transformation ✅ Completed
- [x] Component tests written ✅ Completed

### Documentation

- [x] API documentation complete ✅ Completed
- [x] TypeBox schema specs ✅ Completed
- [x] Examples provided ✅ Completed
- [x] Error scenarios documented ✅ Completed
