---
title: API Playground
description: Interactive API documentation and testing
---

<script setup lang="ts">
import { ApiReference } from '@scalar/api-reference'
import '@scalar/api-reference/dist/style.css'

// Configuration for Scalar API Reference
const configuration = {
  spec: {
    // In development: use local API
    // In production: update this URL to your deployed API
    url: 'http://localhost:3333/api/docs/json'
  },
  // Proxy URL to avoid CORS issues in production
  // proxy: 'https://proxy.scalar.com',
}
</script>

# API Playground

Interactive API documentation powered by [Scalar](https://scalar.com). Test API endpoints directly from your browser.

## Live API Endpoints

The playground below connects to your local backend API (http://localhost:3333) by default.

::: warning Development Mode
Make sure your API server is running:

```bash
pnpm run dev:api
```

:::

<ClientOnly>
  <ApiReference :configuration="configuration" />
</ClientOnly>

## Production Configuration

For production deployment, update the `spec.url` in this page to point to your deployed API:

```typescript
const configuration = {
  spec: {
    url: 'https://your-api-domain.com/api/docs/json',
  },
};
```

## Alternative: Static OpenAPI Spec

You can also download the OpenAPI specification and include it as a static file:

```bash
# Download OpenAPI spec
curl http://localhost:3333/api/docs/json > docs-site/.vitepress/public/openapi.json

# Then update configuration:
const configuration = {
  spec: {
    url: '/aegisx-starter/openapi.json'  // Static file
  }
}
```

## Features

- **Interactive Testing**: Try API endpoints with real data
- **Authentication**: Test with JWT tokens and API keys
- **Schema Validation**: See request/response schemas
- **Code Examples**: Auto-generated code in multiple languages
- **Dark Mode**: Automatically matches your theme preference

## Related Documentation

- **[API Response Standard](./api-response-standard)** - Response format documentation
- **[TypeBox Schema Standard](./typebox-schema-standard)** - Schema validation patterns
- **[Authentication Guide](../features/authentication/)** - How to authenticate API requests
- **[RBAC Documentation](../features/rbac/)** - Role-based access control
