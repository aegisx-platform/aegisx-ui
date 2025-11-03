# Config-Driven Attachment System

> **Universal file attachment system for ANY entity type in your application**

## Overview

The Attachment System is a **config-driven, polymorphic file attachment solution** that allows you to attach files to any entity (patients, products, orders, equipment, etc.) without writing new code - just add configuration.

### Key Features

- ✅ **Config-Driven** - Add new entity types via configuration only
- ✅ **Polymorphic Design** - Single `attachments` table for all entities
- ✅ **Type-Safe** - Full TypeScript + TypeBox validation
- ✅ **RESTful API** - 13 independent endpoints with OpenAPI docs
- ✅ **Generic Components** - Reusable UI widgets for upload/display
- ✅ **Flexible Patterns** - Support for multiple files, single file, or direct reference
- ✅ **Pre-Configured** - 8 entity types ready out of the box

### Pre-Configured Entity Types

**Inventory Management:**

- `receiving` - Delivery notes, invoices
- `product` - Product images, manuals
- `equipment` - Certificates, maintenance docs
- `inventory` - Stock documents

**Hospital Information System (HIS):**

- `patient` - X-rays, medical records
- `appointment` - Appointment documents
- `prescription` - Prescription images
- `medical-record` - Medical documents

## Quick Start

### 1. Backend Configuration

Add your entity type to `attachment-config.ts`:

```typescript
export const ATTACHMENT_CONFIGS: Record<string, AttachmentConfig> = {
  'user-profile': {
    entityType: 'user-profile',
    allowedTypes: ['profile-picture'],
    maxFiles: 1, // Single file only
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSize: 2 * 1024 * 1024, // 2MB
    requireAuth: true,
    cascadeDelete: true,
    description: 'User profile picture',
  },
};
```

### 2. Frontend Usage

```typescript
@Component({
  template: ` <app-entity-attachments entityType="user-profile" [entityId]="userId()" [defaultAttachmentType]="'profile-picture'" [layout]="'grid'" /> `,
})
export class UserProfileComponent {
  userId = signal('current-user-id');
}
```

That's it! The system handles:

- ✅ File upload with validation
- ✅ File display with thumbnails
- ✅ Download/View/Delete actions
- ✅ Drag-and-drop reordering
- ✅ Metadata storage

## Architecture

### Database Schema

```
attachments (polymorphic table)
├── id (uuid, PK)
├── entity_type (string) ───────┐
├── entity_id (uuid) ────────────┤ Polymorphic relationship
├── file_id (uuid, FK) ──────────┤ → Any entity type
├── attachment_type (string)     │
├── display_order (integer)      │
├── metadata (jsonb)             │
└── created_at/updated_at       ─┘

uploaded_files
├── id (uuid, PK)
├── original_name (string)
├── stored_name (string)
├── mime_type (string)
└── file_size (integer)
```

### System Components

**Backend:**

- `attachment.controller.ts` - HTTP request handlers
- `attachment.service.ts` - Business logic + validation
- `attachment.repository.ts` - Database operations
- `attachment.routes.ts` - RESTful API endpoints
- `attachment-config.ts` - Entity type configurations

**Frontend:**

- `EntityAttachmentsComponent` - Smart container component
- `AttachmentListComponent` - List/Grid display
- `AttachmentItemComponent` - Single file item
- `UploadWidgetComponent` - File upload UI
- `AttachmentService` - HTTP client wrapper

## Use Cases

### 1. Multiple Files (Default Pattern)

**Example: Product Images**

```typescript
// Config: Allow multiple images
maxFiles: 10,
allowedTypes: ['image', 'manual'],

// Usage
<app-entity-attachments
  entityType="product"
  [entityId]="productId()"
  [layout]="'grid'"
/>
```

### 2. Single File (maxFiles = 1)

**Example: User Profile Picture**

```typescript
// Config: Limit to one file
maxFiles: 1,
allowedTypes: ['profile-picture'],

// Usage - Same component!
<app-entity-attachments
  entityType="user-profile"
  [entityId]="userId()"
/>
```

### 3. Direct Reference (Alternative Pattern)

**Example: Current Profile Image**

For performance-critical scenarios, use direct file reference:

```typescript
// Schema
users: {
  profile_image_id: uuid | null, // Direct FK to uploaded_files
}

// Service
async updateProfileImage(userId: string, fileId: string) {
  await this.knex('users')
    .where('id', userId)
    .update({ profile_image_id: fileId });
}
```

See [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) for detailed patterns.

## API Endpoints

```
POST   /api/attachments                         - Attach file
POST   /api/attachments/bulk                    - Bulk attach
GET    /api/attachments/:entityType/:entityId   - List attachments
GET    /api/attachments/:entityType/:entityId/count - Count
PUT    /api/attachments/:entityType/:entityId/reorder - Reorder
GET    /api/attachments/:attachmentId           - Get one
PATCH  /api/attachments/:attachmentId           - Update
DELETE /api/attachments/:attachmentId           - Delete
GET    /api/attachments/config/:entityType      - Get config
GET    /api/attachments/stats                   - Statistics
DELETE /api/attachments/entity/:entityType/:entityId - Cleanup
GET    /api/attachments/by-file/:fileId         - List by file
GET    /api/attachments/by-file/:fileId/count   - Count by file
```

## Documentation

- **[USER_GUIDE.md](./USER_GUIDE.md)** - End-user guide for using attachments
- **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** - Integration guide with code examples
- **[API_REFERENCE.md](./API_REFERENCE.md)** - Complete API documentation
- **[CONFIGURATION_GUIDE.md](./CONFIGURATION_GUIDE.md)** - Entity configuration reference
- **[EXAMPLES.md](./EXAMPLES.md)** - Real-world implementation examples

## Benefits

### For Developers

- ✅ **Zero Boilerplate** - No new tables, services, or controllers needed
- ✅ **Type-Safe** - Full TypeScript coverage with validation
- ✅ **Flexible** - Works with any entity type
- ✅ **Maintainable** - Single codebase for all attachments
- ✅ **Tested** - Core system verified and production-ready

### For Users

- ✅ **Intuitive UI** - Drag-drop upload and reordering
- ✅ **Fast** - Optimistic updates and lazy loading
- ✅ **Accessible** - Keyboard navigation and screen reader support
- ✅ **Responsive** - Works on mobile and desktop

### For Business

- ✅ **Scalable** - Single table handles millions of attachments
- ✅ **Auditable** - Full history and metadata tracking
- ✅ **Secure** - Per-entity type access control
- ✅ **Cost-Effective** - Reusable across all modules

## Technical Specifications

- **Language**: TypeScript (100%)
- **Backend**: Fastify 4+ with TypeBox validation
- **Frontend**: Angular 19+ with Signals
- **Database**: PostgreSQL 15+
- **Storage**: Local/S3/MinIO compatible
- **Total Lines**: ~4,500 lines of production code
- **Test Coverage**: Backend unit tests, E2E tests

## Migration from Old System

If you have existing file attachment tables:

1. **Create migration** to move data to `attachments` table
2. **Update references** to use new API endpoints
3. **Replace UI** with `EntityAttachmentsComponent`
4. **Test thoroughly** with production data
5. **Drop old tables** after verification

See migration guide in [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md#migration-guide).

## Support & Troubleshooting

### Common Issues

**1. File not attaching**

- Check entity type exists in `attachment-config.ts`
- Verify file meets MIME type and size limits
- Confirm authentication if `requireAuth: true`

**2. Component not showing files**

- Verify `entityId` is set correctly
- Check API endpoint returns data (Network tab)
- Ensure attachment types match configuration

**3. Upload failing**

- Check file size limits (`maxFileSize` in config)
- Verify MIME type is allowed (`allowedMimeTypes`)
- Check `maxFiles` limit not exceeded

For more issues, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md).

## Version History

- **v1.0.0** (2025-10-28) - Initial release
  - Config-driven attachment system
  - 8 pre-configured entity types
  - Full CRUD API with 13 endpoints
  - Generic Angular components
  - Complete TypeScript type safety

## License

Part of AegisX Platform - Enterprise Monorepo Application

---

**Next Steps:**

1. Read [USER_GUIDE.md](./USER_GUIDE.md) for end-user features
2. Read [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) for integration
3. Check [EXAMPLES.md](./EXAMPLES.md) for real-world use cases
