# Runtime Configuration for Angular Apps

วิธีตั้งค่า environment variables ให้ Angular app ใน Docker container โดยไม่ต้อง rebuild image

## Overview

Angular เป็น static site ที่ถูก compile ตอน build time ทำให้ไม่สามารถเปลี่ยน config ได้หลัง build เสร็จ วิธีแก้คือใช้ **Runtime Configuration** ที่โหลด config จากไฟล์ JSON ตอน app start

## How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                        BUILD TIME                                │
│  Angular App ──▶ ng build ──▶ dist/assets/config.json           │
│                               (default values)                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     CONTAINER START                              │
│  docker run -e API_URL=https://api.prod.com ...                 │
│                              │                                   │
│  docker-entrypoint.sh:                                          │
│  1. Read ENV variables                                          │
│  2. Generate /usr/share/nginx/html/assets/config.json           │
│  3. Start nginx                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BROWSER RUNTIME                             │
│  Angular APP_INITIALIZER:                                       │
│  1. HTTP GET /assets/config.json                                │
│  2. Store config in RuntimeConfigService                        │
│  3. App components use config.apiUrl                            │
└─────────────────────────────────────────────────────────────────┘
```

## Environment Variables

| Variable           | Default        | Description               |
| ------------------ | -------------- | ------------------------- |
| `API_URL`          | `/api`         | Backend API base URL      |
| `APP_NAME`         | `AegisX Admin` | Application display name  |
| `APP_VERSION`      | `1.0.0`        | Application version       |
| `ENABLE_ANALYTICS` | `false`        | Enable analytics tracking |
| `ENABLE_DEBUG`     | `false`        | Enable debug logging      |

## Usage

### Running with Docker

```bash
# Development
docker run -d \
  -e API_URL=http://localhost:3333 \
  -e ENABLE_DEBUG=true \
  -p 8080:8080 \
  ghcr.io/aegisx-platform/aegisx-starter-admin:staging

# Staging
docker run -d \
  -e API_URL=https://api.staging.aegisx.dev \
  -e APP_NAME="AegisX Staging" \
  -p 8080:8080 \
  ghcr.io/aegisx-platform/aegisx-starter-admin:staging

# Production
docker run -d \
  -e API_URL=https://api.aegisx.dev \
  -e APP_NAME="AegisX Admin" \
  -e ENABLE_ANALYTICS=true \
  -p 8080:8080 \
  ghcr.io/aegisx-platform/aegisx-starter-admin:latest
```

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aegisx-admin
spec:
  template:
    spec:
      containers:
        - name: admin
          image: ghcr.io/aegisx-platform/aegisx-starter-admin:latest
          env:
            - name: API_URL
              value: 'https://api.aegisx.dev'
            - name: APP_NAME
              value: 'AegisX Admin'
            - name: ENABLE_ANALYTICS
              value: 'true'
```

### Using ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: admin-config
data:
  API_URL: 'https://api.aegisx.dev'
  APP_NAME: 'AegisX Admin'
  ENABLE_ANALYTICS: 'true'
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aegisx-admin
spec:
  template:
    spec:
      containers:
        - name: admin
          image: ghcr.io/aegisx-platform/aegisx-starter-admin:latest
          envFrom:
            - configMapRef:
                name: admin-config
```

## Using in Angular Components

### Inject RuntimeConfigService

```typescript
import { Component } from '@angular/core';
import { RuntimeConfigService } from './core/services/runtime-config.service';

@Component({
  selector: 'app-my-component',
  template: `
    <h1>{{ config.appName }}</h1>
    <p>API: {{ config.apiUrl }}</p>
  `,
})
export class MyComponent {
  constructor(public config: RuntimeConfigService) {}
}
```

### Use in HTTP Service

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RuntimeConfigService } from './core/services/runtime-config.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(
    private http: HttpClient,
    private config: RuntimeConfigService,
  ) {}

  getUsers() {
    return this.http.get(`${this.config.apiUrl}/users`);
  }

  getProducts() {
    return this.http.get(`${this.config.apiUrl}/products`);
  }
}
```

### Check Feature Flags

```typescript
import { Component } from '@angular/core';
import { RuntimeConfigService } from './core/services/runtime-config.service';

@Component({...})
export class AnalyticsComponent {
  constructor(private config: RuntimeConfigService) {
    if (this.config.isFeatureEnabled('enableAnalytics')) {
      this.initAnalytics();
    }
  }
}
```

## File Structure

```
apps/admin/
├── docker-entrypoint.sh              # Generates config.json from ENV
├── Dockerfile                        # Uses entrypoint
├── src/
│   ├── assets/
│   │   └── config.json               # Default config (overwritten at runtime)
│   └── app/
│       ├── app.config.ts             # APP_INITIALIZER loads config
│       └── core/
│           └── services/
│               ├── index.ts
│               └── runtime-config.service.ts
```

## Adding New Config Options

### 1. Update config.json

```json
{
  "apiUrl": "/api",
  "appName": "AegisX Admin",
  "version": "1.0.0",
  "features": {
    "enableAnalytics": false,
    "enableDebug": false,
    "newFeature": false
  },
  "newOption": "default-value"
}
```

### 2. Update RuntimeConfig interface

```typescript
// runtime-config.service.ts
export interface RuntimeConfig {
  apiUrl: string;
  appName: string;
  version: string;
  features: {
    enableAnalytics: boolean;
    enableDebug: boolean;
    newFeature: boolean; // Add new feature flag
  };
  newOption: string; // Add new option
}
```

### 3. Update docker-entrypoint.sh

```bash
#!/bin/sh
# Add new environment variable
NEW_OPTION="${NEW_OPTION:-default-value}"
NEW_FEATURE="${NEW_FEATURE:-false}"

cat > "$CONFIG_FILE" << EOF
{
  "apiUrl": "${API_URL}",
  "appName": "${APP_NAME}",
  "version": "${APP_VERSION}",
  "features": {
    "enableAnalytics": ${ENABLE_ANALYTICS},
    "enableDebug": ${ENABLE_DEBUG},
    "newFeature": ${NEW_FEATURE}
  },
  "newOption": "${NEW_OPTION}"
}
EOF
```

## Troubleshooting

### Config not loading

1. Check if `/assets/config.json` exists in container:

   ```bash
   docker exec <container> cat /usr/share/nginx/html/assets/config.json
   ```

2. Check browser network tab for `/assets/config.json` request

3. Verify APP_INITIALIZER is registered in `app.config.ts`

### Environment variables not applied

1. Check entrypoint script ran:

   ```bash
   docker logs <container> | head -20
   ```

2. Verify ENV passed correctly:
   ```bash
   docker exec <container> env | grep API_URL
   ```

### Default values used instead of ENV

Ensure boolean values are lowercase without quotes:

```bash
# Correct
-e ENABLE_DEBUG=true

# Wrong
-e ENABLE_DEBUG="true"
-e ENABLE_DEBUG=TRUE
```

## Benefits

| Before (Rebuild Required)       | After (Runtime Config)             |
| ------------------------------- | ---------------------------------- |
| Change API URL → rebuild image  | Change API URL → restart container |
| Different image per environment | Same image for all environments    |
| CI/CD pipeline required         | Just update ENV vars               |
| Slow deployment                 | Instant deployment                 |

## Related Documentation

- [Kubernetes Deployment](./deployment.md)
- [Docker Guide](./monorepo-docker-guide.md)
- [CI/CD Setup](./ci-cd-setup.md)
