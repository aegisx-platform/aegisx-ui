# User Profile Management - API Contracts

## 📋 API Overview

**Base URL**: `/api/profile`  
**Authentication**: JWT Bearer Token Required  
**Content Type**: `application/json`

## 🛠️ Endpoints

### 1. Get User Profile

```http
GET /api/profile
```

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

#### Response Example

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

### 2. Update User Profile

```http
PUT /api/profile
```

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

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "bio": "Updated bio information"
}
```

#### Response Schema

```typescript
{
  success: boolean;
  data: UserProfile;
  message?: string;
}
```

### 3. Change Password

```http
POST /api/profile/password
```

#### Request Schema

```typescript
{
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
```

#### Request Example

```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456",
  "confirmPassword": "newPassword456"
}
```

#### Response Schema

```typescript
{
  success: boolean;
  data: {
    message: string;
  };
}
```

### 4. Upload Avatar

```http
POST /api/profile/avatar
```

#### Request
- **Content-Type**: `multipart/form-data`
- **Body**: Form data with `avatar` file field

#### Request Example

```bash
curl -X POST http://localhost:3333/api/profile/avatar \
  -H "Authorization: Bearer <jwt_token>" \
  -F "avatar=@/path/to/image.jpg"
```

#### Response Schema

```typescript
{
  success: boolean;
  data: {
    avatar: string;
    thumbnails: {
      small: string;
      medium: string;
      large: string;
    };
  };
  message?: string;
}
```

#### Response Example

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

### 5. Delete Avatar

```http
DELETE /api/profile/avatar
```

#### Response Schema

```typescript
{
  success: boolean;
  data: {
    message: string;
  };
}
```

### 6. Get User Preferences

```http
GET /api/profile/preferences
```

#### Response Schema

```typescript
{
  success: boolean;
  data: UserPreferences;
}
```

### 7. Update User Preferences

```http
PUT /api/profile/preferences
```

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
  theme: Type.Optional(Type.Union([
    Type.Literal('default'),
    Type.Literal('dark'),
    Type.Literal('light'),
    Type.Literal('auto')
  ])),
  scheme: Type.Optional(Type.Union([
    Type.Literal('light'),
    Type.Literal('dark'),
    Type.Literal('auto')
  ])),
  layout: Type.Optional(Type.Union([
    Type.Literal('classic'),
    Type.Literal('compact'),
    Type.Literal('enterprise'),
    Type.Literal('empty')
  ])),
  language: Type.Optional(Type.String()),
  timezone: Type.Optional(Type.String()),
  dateFormat: Type.Optional(Type.Union([
    Type.Literal('MM/DD/YYYY'),
    Type.Literal('DD/MM/YYYY'),
    Type.Literal('YYYY-MM-DD')
  ])),
  timeFormat: Type.Optional(Type.Union([
    Type.Literal('12h'),
    Type.Literal('24h')
  ])),
  notifications: Type.Optional(Type.Object({
    email: Type.Optional(Type.Boolean()),
    push: Type.Optional(Type.Boolean()),
    desktop: Type.Optional(Type.Boolean()),
    sound: Type.Optional(Type.Boolean()),
  })),
  navigation: Type.Optional(Type.Object({
    collapsed: Type.Optional(Type.Boolean()),
    type: Type.Optional(Type.Union([
      Type.Literal('default'),
      Type.Literal('compact'),
      Type.Literal('horizontal')
    ])),
    position: Type.Optional(Type.Union([
      Type.Literal('left'),
      Type.Literal('right'),
      Type.Literal('top')
    ])),
  })),
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