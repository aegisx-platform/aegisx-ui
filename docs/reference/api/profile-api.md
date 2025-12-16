# User Profile API Reference

## Overview

The User Profile API allows users to manage their profile information, preferences, avatar, and view their activity history.

**Base URL:** `/api/v1/platform/profile`
**Authentication:** Required (JWT Bearer Token)
**Permissions:** No special permissions required (users can only access their own profile)

---

## Table of Contents

- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Get Profile](#get-profile)
  - [Update Profile](#update-profile)
  - [Upload Avatar](#upload-avatar)
  - [Delete Avatar](#delete-avatar)
  - [Get Preferences](#get-preferences)
  - [Update Preferences](#update-preferences)
  - [Get User Activity](#get-user-activity)
- [Data Models](#data-models)
- [Examples](#examples)

---

## Authentication

All endpoints require JWT authentication:

```http
Authorization: Bearer <your-jwt-token>
```

The API automatically extracts the user ID from the JWT token, ensuring users can only access and modify their own profile.

---

## Endpoints

### Get Profile

Retrieve the authenticated user's profile information.

**Endpoint:** `GET /api/v1/platform/profile`
**Permission:** Authenticated users

#### Response

```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "john.doe@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "department_id": "456e7890-e89b-12d3-a456-426614174111",
    "department_name": "Information Technology",
    "avatar_url": "https://example.com/avatars/user-123.webp",
    "theme": "light",
    "language": "en",
    "notifications": {
      "email": true,
      "push": true,
      "sms": false
    },
    "created_at": "2025-01-15T08:00:00Z",
    "updated_at": "2025-12-16T10:30:00Z",
    "last_login_at": "2025-12-16T09:00:00Z"
  }
}
```

#### cURL Example

```bash
curl -X GET "http://localhost:3000/api/v1/platform/profile" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Update Profile

Update the authenticated user's profile information.

**Endpoint:** `PUT /api/v1/platform/profile`
**Permission:** Authenticated users

#### Request Body

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "department_id": "456e7890-e89b-12d3-a456-426614174111"
}
```

#### Request Body Schema

| Field           | Type   | Required | Description                                  |
| --------------- | ------ | -------- | -------------------------------------------- |
| `first_name`    | string | No       | User's first name                            |
| `last_name`     | string | No       | User's last name                             |
| `department_id` | string | No       | Department UUID (validated against database) |

**Note:** Email cannot be changed via this endpoint. Contact an administrator to update email.

#### Response

```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "john.doe@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "department_id": "456e7890-e89b-12d3-a456-426614174111",
    "department_name": "Information Technology",
    "updated_at": "2025-12-16T11:00:00Z"
  }
}
```

#### Validation Rules

- **first_name**: 2-50 characters
- **last_name**: 2-50 characters
- **department_id**: Must be a valid UUID and exist in the departments table

#### Error Responses

**Invalid Department:**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_DEPARTMENT",
    "message": "Department not found or inactive",
    "details": {
      "field": "department_id",
      "value": "456e7890-e89b-12d3-a456-426614174111"
    }
  }
}
```

#### cURL Example

```bash
curl -X PUT "http://localhost:3000/api/v1/platform/profile" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "department_id": "456e7890-e89b-12d3-a456-426614174111"
  }'
```

---

### Upload Avatar

Upload or update the user's profile avatar.

**Endpoint:** `POST /api/v1/platform/profile/avatar`
**Permission:** Authenticated users
**Content-Type:** `multipart/form-data`

#### Request Body (Multipart)

| Field    | Type | Required | Description                       |
| -------- | ---- | -------- | --------------------------------- |
| `avatar` | file | Yes      | Image file (JPEG, PNG, GIF, WebP) |

#### File Requirements

- **Max Size:** 5 MB
- **Supported Formats:** JPEG, PNG, GIF, WebP
- **Processing:** Image is automatically resized to 200x200px and converted to WebP format
- **Old Avatar:** Automatically deleted when uploading new one

#### Response

```json
{
  "success": true,
  "data": {
    "avatar_url": "https://example.com/avatars/user-123-1702728000.webp",
    "message": "Avatar uploaded successfully"
  }
}
```

#### Error Responses

**Invalid File Type:**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_FILE_TYPE",
    "message": "Only image files are allowed (JPEG, PNG, GIF, WebP)"
  }
}
```

**File Too Large:**

```json
{
  "success": false,
  "error": {
    "code": "FILE_TOO_LARGE",
    "message": "File size exceeds maximum allowed size of 5MB"
  }
}
```

#### cURL Example

```bash
curl -X POST "http://localhost:3000/api/v1/platform/profile/avatar" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "avatar=@/path/to/photo.jpg"
```

---

### Delete Avatar

Remove the user's profile avatar.

**Endpoint:** `DELETE /api/v1/platform/profile/avatar`
**Permission:** Authenticated users

#### Response

```json
{
  "success": true,
  "message": "Avatar deleted successfully"
}
```

#### cURL Example

```bash
curl -X DELETE "http://localhost:3000/api/v1/platform/profile/avatar" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Get Preferences

Retrieve the authenticated user's preferences.

**Endpoint:** `GET /api/v1/platform/profile/preferences`
**Permission:** Authenticated users

#### Response

```json
{
  "success": true,
  "data": {
    "theme": "light",
    "language": "en",
    "notifications": {
      "email": true,
      "push": true,
      "sms": false
    }
  }
}
```

#### cURL Example

```bash
curl -X GET "http://localhost:3000/api/v1/platform/profile/preferences" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Update Preferences

Update the authenticated user's preferences.

**Endpoint:** `PUT /api/v1/platform/profile/preferences`
**Permission:** Authenticated users

#### Request Body

```json
{
  "theme": "dark",
  "language": "th",
  "notifications": {
    "email": true,
    "push": false,
    "sms": false
  }
}
```

#### Request Body Schema

| Field           | Type   | Required | Description                          |
| --------------- | ------ | -------- | ------------------------------------ |
| `theme`         | string | No       | UI theme: `light`, `dark`, or `auto` |
| `language`      | string | No       | Language code: `en` or `th`          |
| `notifications` | object | No       | Notification preferences (see below) |

**Notifications Object:**

| Field   | Type    | Required | Description                |
| ------- | ------- | -------- | -------------------------- |
| `email` | boolean | No       | Enable email notifications |
| `push`  | boolean | No       | Enable push notifications  |
| `sms`   | boolean | No       | Enable SMS notifications   |

#### Response

```json
{
  "success": true,
  "data": {
    "theme": "dark",
    "language": "th",
    "notifications": {
      "email": true,
      "push": false,
      "sms": false
    },
    "updated_at": "2025-12-16T11:30:00Z"
  }
}
```

#### cURL Example

```bash
curl -X PUT "http://localhost:3000/api/v1/platform/profile/preferences" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "theme": "dark",
    "language": "th",
    "notifications": {
      "email": true,
      "push": false,
      "sms": false
    }
  }'
```

---

### Get User Activity

Retrieve the authenticated user's recent activity logs.

**Endpoint:** `GET /api/v1/platform/profile/activity`
**Permission:** Authenticated users

#### Query Parameters

| Parameter   | Type     | Required | Default | Description                                   |
| ----------- | -------- | -------- | ------- | --------------------------------------------- |
| `page`      | integer  | No       | 1       | Page number for pagination                    |
| `limit`     | integer  | No       | 20      | Number of items per page (max: 100)           |
| `action`    | string   | No       | -       | Filter by action type                         |
| `startDate` | datetime | No       | -       | Filter activities after this date (ISO 8601)  |
| `endDate`   | datetime | No       | -       | Filter activities before this date (ISO 8601) |

#### Response

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "660e8400-e29b-41d4-a716-446655440000",
        "action": "user.login",
        "description": "User logged in successfully",
        "ip_address": "192.168.1.100",
        "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
        "metadata": {
          "loginMethod": "password",
          "deviceType": "desktop"
        },
        "created_at": "2025-12-16T09:00:00Z"
      },
      {
        "id": "770e8400-e29b-41d4-a716-446655440111",
        "action": "profile.updated",
        "description": "Profile information updated",
        "ip_address": "192.168.1.100",
        "metadata": {
          "changedFields": ["department_id"]
        },
        "created_at": "2025-12-16T08:30:00Z"
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
curl -X GET "http://localhost:3000/api/v1/platform/profile/activity?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Data Models

### Profile

```typescript
interface Profile {
  id: string; // UUID
  email: string;
  first_name: string;
  last_name: string;
  department_id: string | null; // UUID
  department_name: string | null;
  avatar_url: string | null;
  theme: 'light' | 'dark' | 'auto';
  language: 'en' | 'th';
  notifications: NotificationPreferences;
  created_at: string; // ISO 8601 datetime
  updated_at: string; // ISO 8601 datetime
  last_login_at: string | null; // ISO 8601 datetime
}
```

### NotificationPreferences

```typescript
interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
}
```

### Preferences

```typescript
interface Preferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'en' | 'th';
  notifications: NotificationPreferences;
}
```

### UserActivity

```typescript
interface UserActivity {
  id: string; // UUID
  action: string;
  description: string;
  ip_address: string | null;
  user_agent: string | null;
  metadata: Record<string, any> | null;
  created_at: string; // ISO 8601 datetime
}
```

---

## Examples

### Example 1: Complete Profile Update Flow

```typescript
// TypeScript/Node.js example
class ProfileManager {
  private baseUrl = 'http://localhost:3000/api/v1/platform/profile';
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private async request(method: string, path: string, data?: any) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    return response.json();
  }

  async getProfile() {
    return this.request('GET', '');
  }

  async updateProfile(updates: { first_name?: string; last_name?: string; department_id?: string }) {
    return this.request('PUT', '', updates);
  }

  async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch(`${this.baseUrl}/avatar`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });

    return response.json();
  }

  async deleteAvatar() {
    return this.request('DELETE', '/avatar');
  }

  async getPreferences() {
    return this.request('GET', '/preferences');
  }

  async updatePreferences(preferences: {
    theme?: 'light' | 'dark' | 'auto';
    language?: 'en' | 'th';
    notifications?: {
      email?: boolean;
      push?: boolean;
      sms?: boolean;
    };
  }) {
    return this.request('PUT', '/preferences', preferences);
  }

  async getActivity(page = 1, limit = 20) {
    return this.request('GET', `/activity?page=${page}&limit=${limit}`);
  }
}

// Usage
const profile = new ProfileManager('YOUR_JWT_TOKEN');

// Get current profile
const currentProfile = await profile.getProfile();
console.log('Current profile:', currentProfile.data);

// Update profile info
await profile.updateProfile({
  first_name: 'John',
  last_name: 'Doe',
  department_id: '456e7890-e89b-12d3-a456-426614174111',
});

// Update preferences
await profile.updatePreferences({
  theme: 'dark',
  language: 'en',
  notifications: {
    email: true,
    push: false,
  },
});

// Upload avatar
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];
await profile.uploadAvatar(file);

// Get activity history
const activity = await profile.getActivity(1, 50);
console.log('Recent activity:', activity.data.items);
```

### Example 2: Avatar Upload with Preview

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Avatar Upload</title>
    <style>
      .avatar-preview {
        width: 200px;
        height: 200px;
        border-radius: 50%;
        object-fit: cover;
        margin: 20px;
      }
    </style>
  </head>
  <body>
    <h1>Upload Profile Avatar</h1>

    <img id="preview" class="avatar-preview" src="/placeholder-avatar.png" alt="Avatar preview" />

    <input type="file" id="avatar" accept="image/*" />
    <button onclick="uploadAvatar()">Upload</button>
    <button onclick="deleteAvatar()">Delete</button>

    <script>
      const JWT_TOKEN = 'YOUR_JWT_TOKEN';
      const API_URL = 'http://localhost:3000/api/v1/platform/profile';

      // Preview selected image
      document.getElementById('avatar').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            document.getElementById('preview').src = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      });

      async function uploadAvatar() {
        const fileInput = document.getElementById('avatar');
        const file = fileInput.files[0];

        if (!file) {
          alert('Please select an image');
          return;
        }

        const formData = new FormData();
        formData.append('avatar', file);

        try {
          const response = await fetch(`${API_URL}/avatar`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${JWT_TOKEN}`,
            },
            body: formData,
          });

          const data = await response.json();

          if (data.success) {
            alert('Avatar uploaded successfully!');
            document.getElementById('preview').src = data.data.avatar_url;
          } else {
            alert(`Error: ${data.error.message}`);
          }
        } catch (error) {
          alert(`Upload failed: ${error.message}`);
        }
      }

      async function deleteAvatar() {
        if (!confirm('Are you sure you want to delete your avatar?')) {
          return;
        }

        try {
          const response = await fetch(`${API_URL}/avatar`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${JWT_TOKEN}`,
            },
          });

          const data = await response.json();

          if (data.success) {
            alert('Avatar deleted successfully!');
            document.getElementById('preview').src = '/placeholder-avatar.png';
          } else {
            alert(`Error: ${data.error.message}`);
          }
        } catch (error) {
          alert(`Delete failed: ${error.message}`);
        }
      }
    </script>
  </body>
</html>
```

### Example 3: Theme Switcher

```typescript
// React component example
import React, { useState, useEffect } from 'react';

interface ProfileManagerProps {
  token: string;
}

const ThemeSwitcher: React.FC<ProfileManagerProps> = ({ token }) => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    const response = await fetch('http://localhost:3000/api/v1/platform/profile/preferences', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (data.success) {
      setTheme(data.data.theme);
      applyTheme(data.data.theme);
    }
  };

  const updateTheme = async (newTheme: 'light' | 'dark' | 'auto') => {
    setLoading(true);

    const response = await fetch('http://localhost:3000/api/v1/platform/profile/preferences', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ theme: newTheme })
    });

    const data = await response.json();
    if (data.success) {
      setTheme(newTheme);
      applyTheme(newTheme);
    }

    setLoading(false);
  };

  const applyTheme = (theme: string) => {
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  };

  return (
    <div className="theme-switcher">
      <h3>Theme Preference</h3>
      <div className="theme-options">
        {['light', 'dark', 'auto'].map((t) => (
          <button
            key={t}
            className={theme === t ? 'active' : ''}
            onClick={() => updateTheme(t as any)}
            disabled={loading}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
```

### Example 4: Activity Timeline Display

```typescript
// Vue 3 component example
<template>
  <div class="activity-timeline">
    <h2>Recent Activity</h2>

    <div v-if="loading" class="loading">Loading...</div>

    <div v-else class="timeline">
      <div
        v-for="activity in activities"
        :key="activity.id"
        class="timeline-item"
      >
        <div class="timeline-icon">
          <i :class="getActionIcon(activity.action)"></i>
        </div>
        <div class="timeline-content">
          <h4>{{ activity.description }}</h4>
          <p class="metadata">
            <span>{{ formatDate(activity.created_at) }}</span>
            <span v-if="activity.ip_address">IP: {{ activity.ip_address }}</span>
          </p>
          <div v-if="activity.metadata" class="details">
            <pre>{{ JSON.stringify(activity.metadata, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>

    <button @click="loadMore" v-if="hasMore" :disabled="loading">
      Load More
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const props = defineProps<{
  token: string;
}>();

const activities = ref([]);
const loading = ref(false);
const page = ref(1);
const hasMore = ref(true);

const fetchActivity = async () => {
  loading.value = true;

  const response = await fetch(
    `http://localhost:3000/api/v1/platform/profile/activity?page=${page.value}&limit=20`,
    {
      headers: {
        'Authorization': `Bearer ${props.token}`
      }
    }
  );

  const data = await response.json();
  if (data.success) {
    activities.value.push(...data.data.items);
    hasMore.value = page.value < data.data.pagination.totalPages;
  }

  loading.value = false;
};

const loadMore = () => {
  page.value++;
  fetchActivity();
};

const getActionIcon = (action: string) => {
  const iconMap = {
    'user.login': 'fa fa-sign-in',
    'user.logout': 'fa fa-sign-out',
    'profile.updated': 'fa fa-edit',
    'avatar.uploaded': 'fa fa-image',
    'preferences.updated': 'fa fa-cog'
  };
  return iconMap[action] || 'fa fa-circle';
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};

onMounted(() => {
  fetchActivity();
});
</script>
```

---

## Rate Limits

| Endpoint Type | Limit        | Window   |
| ------------- | ------------ | -------- |
| Read (GET)    | 100 requests | 1 minute |
| Update (PUT)  | 20 requests  | 1 minute |
| Avatar Upload | 5 requests   | 1 hour   |

---

## Error Codes

| Status Code | Error Code              | Description                             |
| ----------- | ----------------------- | --------------------------------------- |
| 400         | `VALIDATION_ERROR`      | Invalid request parameters              |
| 400         | `INVALID_DEPARTMENT`    | Department not found or inactive        |
| 400         | `INVALID_FILE_TYPE`     | Unsupported file format                 |
| 400         | `FILE_TOO_LARGE`        | File exceeds maximum size               |
| 401         | `UNAUTHORIZED`          | Missing or invalid authentication token |
| 429         | `RATE_LIMIT_EXCEEDED`   | Too many requests                       |
| 500         | `INTERNAL_SERVER_ERROR` | Server error                            |

---

## Changelog

### v1.0.0 (2025-12-16)

- Initial API release
- Profile management endpoints
- Avatar upload/delete
- Preferences management
- Activity history

---

## Support

For issues or questions:

- GitHub Issues: https://github.com/aegisx-platform/aegisx-starter/issues
- Documentation: https://aegisx-platform.github.io/aegisx-starter-1/
- Email: support@aegisx.io
