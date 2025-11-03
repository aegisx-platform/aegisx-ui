---
title: Attachment System - Developer Guide
---

<div v-pre>

# Attachment System - Developer Guide

> **Technical guide for integrating the attachment system into your modules**

## Table of Contents

1. [Quick Integration](#quick-integration)
2. [Three Usage Patterns](#three-usage-patterns)
3. [Backend Configuration](#backend-configuration)
4. [Frontend Integration](#frontend-integration)
5. [API Reference](#api-reference)
6. [Real-World Examples](#real-world-examples)
7. [Best Practices](#best-practices)

---

## Quick Integration

### Step 1: Add Entity Configuration

```typescript
// apps/api/src/core/attachments/attachment-config.ts

export const ATTACHMENT_CONFIGS: Record<string, AttachmentConfig> = {
  'your-entity': {
    entityType: 'your-entity',
    allowedTypes: ['document', 'image'],
    maxFiles: 5,
    allowedMimeTypes: ['image/*', 'application/pdf'],
    maxFileSize: 5 * 1024 * 1024, // 5MB
    requireAuth: true,
    cascadeDelete: true,
    metadata: {
      required: ['entityId'],
      optional: ['notes', 'category'],
    },
    description: 'Your entity attachments',
  },
};
```

### Step 2: Use in Frontend

```typescript
// your-component.ts
<app-entity-attachments
  entityType="your-entity"
  [entityId]="entityId()"
  [layout]="'list'"
/>
```

Done! The system handles everything else.

---

## Three Usage Patterns

### Pattern 1: Multiple Files (Default) ⭐ Recommended

**Use when:** Entity needs multiple attachments (products, patients, orders)

**Backend Configuration:**

```typescript
'product': {
  entityType: 'product',
  allowedTypes: ['image', 'manual', 'certificate'],
  maxFiles: 10, // Multiple files allowed
  allowedMimeTypes: ['image/*', 'application/pdf'],
  maxFileSize: 5 * 1024 * 1024,
  requireAuth: true,
  cascadeDelete: true,
  description: 'Product images and documents',
}
```

**Frontend Usage:**

```typescript
@Component({
  selector: 'app-product-detail',
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Product Attachments</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <app-entity-attachments entityType="product" [entityId]="productId()" [defaultAttachmentType]="'image'" [layout]="'grid'" [enableReorder]="true" [showUpload]="true" />
      </mat-card-content>
    </mat-card>
  `,
})
export class ProductDetailComponent {
  productId = signal('product-uuid');
}
```

**Benefits:**

- ✅ Full history tracking
- ✅ Flexible metadata
- ✅ Drag-drop reordering
- ✅ Built-in validation
- ✅ No extra code needed

---

### Pattern 2: Single File (maxFiles = 1)

**Use when:** Entity has exactly ONE attachment (profile picture, company logo)

**Backend Configuration:**

```typescript
'user-profile': {
  entityType: 'user-profile',
  allowedTypes: ['profile-picture'],
  maxFiles: 1, // 🔥 Limit to one file
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  maxFileSize: 2 * 1024 * 1024, // 2MB
  requireAuth: true,
  cascadeDelete: true,
  metadata: {
    optional: ['cropData', 'uploadedBy'],
  },
  description: 'User profile picture (single image)',
}
```

**Frontend Usage - Same Component!**

```typescript
@Component({
  selector: 'app-profile-settings',
  template: `
    <div class="profile-section">
      <h3>Profile Picture</h3>

      <!-- 🎯 Same component, automatically enforces maxFiles=1 -->
      <app-entity-attachments entityType="user-profile" [entityId]="userId()" [defaultAttachmentType]="'profile-picture'" [layout]="'grid'" [enableReorder]="false" />

      <p class="hint">Upload one profile picture (max 2MB)</p>
    </div>
  `,
})
export class ProfileSettingsComponent {
  private authService = inject(AuthService);
  userId = computed(() => this.authService.currentUser()?.id || '');
}
```

**How Backend Enforces Single File:**

```typescript
// attachment.service.ts (automatic enforcement)
async attachFile(request) {
  const config = this.getEntityConfig(entityType);
  const currentCount = await this.repository.countByEntity(entityType, entityId);

  // 🛡️ Automatic validation
  if (config.maxFiles && currentCount >= config.maxFiles) {
    throw new Error(
      `Maximum files (${config.maxFiles}) reached for entity "${entityType}"`
    );
  }

  // If maxFiles=1 and uploading new file, delete old one first
  if (config.maxFiles === 1 && currentCount > 0) {
    await this.repository.deleteByEntity(entityType, entityId);
  }

  return this.repository.create(data);
}
```

**Benefits:**

- ✅ Still use generic attachment system
- ✅ History tracking (optional)
- ✅ Metadata support
- ✅ Automatic "replace old file" behavior
- ✅ No custom UI needed

---

### Pattern 3: Direct Reference (Performance)

**Use when:**

- Need maximum query performance
- ONE-to-ONE relationship guaranteed
- Don't need history tracking
- Simple use case (e.g., invoice PDF)

**Database Schema:**

```sql
-- Add direct FK column to your entity table
ALTER TABLE users
ADD COLUMN profile_image_id UUID REFERENCES uploaded_files(id) ON DELETE SET NULL;

CREATE INDEX idx_users_profile_image ON users(profile_image_id);
```

**Backend Service:**

```typescript
// apps/api/src/core/users/users.service.ts

export class UsersService {
  async updateProfileImage(userId: string, fileId: string) {
    // 1. Validate file exists
    const file = await this.knex('uploaded_files').where('id', fileId).first();

    if (!file) {
      throw new Error('File not found');
    }

    // 2. Get old image (for cleanup)
    const user = await this.knex('users').where('id', userId).select('profile_image_id').first();

    const oldImageId = user?.profile_image_id;

    // 3. Update user with new image
    await this.knex('users').where('id', userId).update({
      profile_image_id: fileId,
      updated_at: new Date(),
    });

    // 4. (Optional) Delete old image file
    if (oldImageId && oldImageId !== fileId) {
      await this.fileUploadService.deleteFile(oldImageId);
    }

    return { success: true };
  }

  async getUserWithProfileImage(userId: string) {
    // Fast query - single join, no polymorphic lookup
    return this.knex('users').select('users.*', 'uploaded_files.original_name as profile_image_name', 'uploaded_files.storage_path as profile_image_path', 'uploaded_files.mime_type as profile_image_type').leftJoin('uploaded_files', 'users.profile_image_id', 'uploaded_files.id').where('users.id', userId).first();
  }

  async removeProfileImage(userId: string) {
    const user = await this.knex('users').where('id', userId).select('profile_image_id').first();

    if (user?.profile_image_id) {
      // Delete file from storage
      await this.fileUploadService.deleteFile(user.profile_image_id);

      // Remove reference
      await this.knex('users').where('id', userId).update({ profile_image_id: null });
    }
  }
}
```

**Frontend Component (Custom):**

```typescript
@Component({
  selector: 'app-profile-image-upload',
  template: `
    <div class="profile-upload">
      @if (currentImage()) {
        <div class="current-image">
          <img [src]="currentImage()!.url" alt="Profile" />
          <button mat-icon-button (click)="removeImage()">
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      } @else {
        <div class="empty-state">
          <mat-icon>account_circle</mat-icon>
          <p>No profile image</p>
        </div>
      }

      <input #fileInput type="file" accept="image/*" (change)="onFileSelected($event)" hidden />

      <button mat-raised-button color="primary" (click)="fileInput.click()">
        <mat-icon>upload</mat-icon>
        {{ currentImage() ? 'Change Image' : 'Upload Image' }}
      </button>
    </div>
  `,
  styles: [
    `
      .profile-upload {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
      }

      .current-image {
        position: relative;

        img {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          object-fit: cover;
        }

        button {
          position: absolute;
          top: 0;
          right: 0;
        }
      }

      .empty-state {
        text-align: center;
        color: #666;

        mat-icon {
          font-size: 100px;
          width: 100px;
          height: 100px;
        }
      }
    `,
  ],
})
export class ProfileImageUploadComponent {
  private uploadService = inject(UploadService);
  private userService = inject(UserService);
  private authService = inject(AuthService);

  currentImage = signal<{ id: string; url: string } | null>(null);
  uploading = signal(false);

  async onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.uploading.set(true);

    try {
      // 1. Upload file first
      const uploadedFile = await this.uploadService.uploadSingle(file, {
        category: 'profiles',
      });

      // 2. Update user profile
      const userId = this.authService.currentUser()!.id;
      await this.userService.updateProfileImage(userId, uploadedFile.id);

      // 3. Update UI
      this.currentImage.set({
        id: uploadedFile.id,
        url: uploadedFile.url,
      });

      // 4. Show success message
      this.snackBar.open('Profile image updated', 'Close', { duration: 3000 });
    } catch (error) {
      console.error('Upload failed:', error);
      this.snackBar.open('Failed to upload image', 'Close', { duration: 3000 });
    } finally {
      this.uploading.set(false);
    }
  }

  async removeImage() {
    const confirmed = await this.dialog.confirm({
      title: 'Remove Profile Image',
      message: 'Are you sure you want to remove your profile image?',
    });

    if (confirmed) {
      const userId = this.authService.currentUser()!.id;
      await this.userService.removeProfileImage(userId);
      this.currentImage.set(null);
    }
  }
}
```

**Benefits:**

- ✅ Maximum performance (no polymorphic joins)
- ✅ Simple queries
- ✅ Direct relationship
- ✅ Easy to understand

**Drawbacks:**

- ❌ No history tracking
- ❌ Limited metadata
- ❌ Custom UI required
- ❌ Manual cleanup logic

---

## Comparison Matrix

| Feature          | Pattern 1: Multiple Files  | Pattern 2: Single File | Pattern 3: Direct Reference |
| ---------------- | -------------------------- | ---------------------- | --------------------------- |
| **Use Case**     | Products, Patients, Orders | Profile Picture, Logo  | Invoice PDF, Current Image  |
| **Max Files**    | 1-999                      | Exactly 1              | Exactly 1                   |
| **Performance**  | ⭐⭐⭐ (join)              | ⭐⭐⭐ (join)          | ⭐⭐⭐⭐⭐ (direct)         |
| **History**      | ✅ Full history            | ✅ Optional history    | ❌ No history               |
| **Metadata**     | ✅ Flexible JSONB          | ✅ Flexible JSONB      | ❌ Limited                  |
| **Validation**   | ✅ Automatic               | ✅ Automatic           | ❌ Manual                   |
| **UI Component** | ✅ Generic                 | ✅ Generic             | ❌ Custom                   |
| **Code Amount**  | ✅ Minimal                 | ✅ Minimal             | ❌ More code                |
| **Complexity**   | ⭐ Simple                  | ⭐ Simple              | ⭐⭐ Medium                 |

---

## Recommendation

### Use Pattern 1 or 2 (Attachment System) when:

- ✅ You want zero boilerplate
- ✅ You need history tracking
- ✅ You want flexible metadata
- ✅ You might change file limits later
- ✅ Performance is not critical (still fast!)

### Use Pattern 3 (Direct Reference) when:

- ✅ Performance is CRITICAL (high-traffic queries)
- ✅ ONE-to-ONE relationship is guaranteed forever
- ✅ You don't need history or metadata
- ✅ You're willing to write custom code

**For 90% of cases, use Pattern 1 or 2 (Attachment System).** It's simpler, more maintainable, and future-proof.

---

## Complete Examples

See [EXAMPLES.md](./EXAMPLES.md) for:

- Receiving module with delivery notes
- Patient records with X-rays
- Product catalog with images
- User profile with single picture
- Invoice system with PDF

---

## Migration Guide

### Migrating from Direct Reference to Attachment System

```typescript
// Old schema
users: {
  profile_image_id: uuid;
}

// Migration script
async function migrate() {
  const users = await knex('users').whereNotNull('profile_image_id');

  for (const user of users) {
    await knex('attachments').insert({
      id: uuid(),
      entity_type: 'user-profile',
      entity_id: user.id,
      file_id: user.profile_image_id,
      attachment_type: 'profile-picture',
      display_order: 0,
      created_at: new Date(),
    });
  }

  // Keep old column for gradual migration
  // Drop later: ALTER TABLE users DROP COLUMN profile_image_id;
}
```

---

## Testing

```typescript
// Backend test
describe('Attachment System', () => {
  it('should enforce maxFiles limit', async () => {
    // Upload 1st file - should succeed
    await attachmentService.attachFile({
      entityType: 'user-profile',
      entityId: userId,
      fileId: file1Id,
    });

    // Upload 2nd file - should fail (maxFiles=1)
    await expect(
      attachmentService.attachFile({
        entityType: 'user-profile',
        entityId: userId,
        fileId: file2Id,
      }),
    ).rejects.toThrow('Maximum files (1) reached');
  });
});
```

---

## Support

For questions or issues:

1. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. Review [API_REFERENCE.md](./API_REFERENCE.md)
3. See [EXAMPLES.md](./EXAMPLES.md) for working code

---

**Next:** Check [EXAMPLES.md](./EXAMPLES.md) for complete real-world implementations

</div>
