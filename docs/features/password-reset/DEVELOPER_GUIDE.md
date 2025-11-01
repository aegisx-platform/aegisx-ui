# Password Reset - Developer Guide

> **Technical implementation guide for developers**

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Implementation Details](#implementation-details)
- [Integration Guide](#integration-guide)
- [Code Examples](#code-examples)
- [Testing](#testing)
- [Best Practices](#best-practices)
- [Performance Considerations](#performance-considerations)

## 🎯 Overview

### Tech Stack

| Component         | Technology           | Purpose                  |
| ----------------- | -------------------- | ------------------------ |
| **Backend**       | Fastify + TypeScript | REST API endpoints       |
| **Database**      | PostgreSQL           | Token storage            |
| **Validation**    | TypeBox              | Request/response schemas |
| **Email**         | EmailService         | Send reset emails        |
| **Security**      | crypto.randomBytes() | Token generation         |
| **Hashing**       | bcrypt               | Password hashing         |
| **Rate Limiting** | Fastify              | Abuse prevention         |

### File Structure

```
apps/api/src/core/auth/
├── services/
│   └── password-reset.service.ts     # Core business logic (277 lines)
├── auth.controller.ts                 # HTTP handlers (modified)
├── auth.routes.ts                     # Route definitions (modified)
├── auth.schemas.ts                    # TypeBox schemas (modified)
└── auth.types.ts                      # TypeScript types (modified)

apps/api/src/database/migrations/
└── 20251101140000_create_password_reset_tokens_table.ts

apps/api/src/core/email/
└── email.service.ts                   # Email sending
```

## 🏗️ Architecture

### System Flow

```typescript
┌─────────────────────────────────────────────────────────────────┐
│                    Password Reset Architecture                   │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Frontend   │────────▶│     API      │────────▶│   Database   │
│  (Angular)   │         │  (Fastify)   │         │ (PostgreSQL) │
└──────────────┘         └──────────────┘         └──────────────┘
                               │
                               │ Email
                               ▼
                         ┌──────────────┐
                         │ Email Service│
                         │    (SMTP)    │
                         └──────────────┘

Component Interactions:
1. User → Frontend → POST /api/auth/request-password-reset
2. API → PasswordResetService.requestPasswordReset()
3. Service → Generate token → Store in DB
4. Service → EmailService → Send email to user
5. User → Clicks link → POST /api/auth/reset-password
6. API → Verify token → Update password → Invalidate sessions
```

### Database Schema

```sql
-- Password Reset Tokens Table
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User reference
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Token data
  token VARCHAR(255) NOT NULL UNIQUE,        -- 64 hex chars
  email VARCHAR(255) NOT NULL,                -- For audit

  -- State tracking
  used BOOLEAN DEFAULT false,
  used_at TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,              -- 1 hour from creation

  -- Security audit
  ip_address VARCHAR(45),                     -- IPv4 or IPv6

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_tokens_email ON password_reset_tokens(email);
```

## 💻 Implementation Details

### 1. PasswordResetService

**Key Methods:**

```typescript
export class PasswordResetService {
  private readonly TOKEN_LENGTH = 32; // 32 bytes = 64 hex chars
  private readonly EXPIRATION_HOURS = 1; // 1 hour expiration

  constructor(
    private readonly fastify: FastifyInstance,
    private readonly db: Knex,
  ) {
    this.emailService = new EmailService(fastify);
  }

  /**
   * Create reset token and send email
   * Returns same response regardless of email existence (security)
   */
  async requestPasswordReset(email: string): Promise<ResetResult> {
    // Find user by email
    const user = await this.db('users').where('email', email).whereNull('deleted_at').first();

    if (!user) {
      // Security: generate fake token to prevent timing attacks
      const fakeToken = randomBytes(this.TOKEN_LENGTH).toString('hex');
      return {
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
      };
    }

    // Generate secure random token
    const token = randomBytes(this.TOKEN_LENGTH).toString('hex');

    // Calculate expiration
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + this.EXPIRATION_HOURS);

    // Delete existing unused tokens for this user
    await this.db('password_reset_tokens').where('user_id', user.id).where('used', false).del();

    // Store new token
    await this.db('password_reset_tokens').insert({
      id: this.db.raw('gen_random_uuid()'),
      user_id: user.id,
      token,
      email,
      used: false,
      expires_at: expiresAt,
    });

    // Send email
    await this.emailService.sendPasswordResetEmail(email, token, user.name);

    return {
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
    };
  }

  /**
   * Verify token is valid and not expired
   */
  async verifyResetToken(token: string): Promise<ResetResult & { userId?: string }> {
    const resetRecord = await this.db('password_reset_tokens').where('token', token).first();

    if (!resetRecord) {
      return { success: false, message: 'Invalid reset token' };
    }

    if (resetRecord.used) {
      return { success: false, message: 'Reset token has already been used' };
    }

    if (new Date() > new Date(resetRecord.expires_at)) {
      return { success: false, message: 'Reset token has expired. Please request a new one.' };
    }

    return {
      success: true,
      message: 'Reset token is valid',
      userId: resetRecord.user_id,
    };
  }

  /**
   * Reset password using valid token
   */
  async resetPassword(token: string, newPassword: string, ipAddress?: string): Promise<ResetResult> {
    // Verify token
    const verification = await this.verifyResetToken(token);
    if (!verification.success || !verification.userId) {
      return { success: false, message: verification.message };
    }

    try {
      // Hash new password
      const hashedPassword = await hash(newPassword, 10);

      // Use transaction for atomicity
      await this.db.transaction(async (trx) => {
        // Update user password
        await trx('users').where('id', verification.userId).update({
          password: hashedPassword,
          updated_at: trx.fn.now(),
        });

        // Mark token as used
        await trx('password_reset_tokens')
          .where('token', token)
          .update({
            used: true,
            used_at: trx.fn.now(),
            ip_address: ipAddress || null,
            updated_at: trx.fn.now(),
          });

        // CRITICAL: Invalidate all existing sessions
        await trx('user_sessions').where('user_id', verification.userId).del();
      });

      return {
        success: true,
        message: 'Password has been reset successfully',
      };
    } catch (error) {
      this.fastify.log.error({ msg: 'Failed to reset password', error });
      return {
        success: false,
        message: 'Failed to reset password. Please try again.',
      };
    }
  }

  /**
   * Cleanup expired tokens (run periodically)
   */
  async cleanupExpiredTokens(): Promise<number> {
    const deletedCount = await this.db('password_reset_tokens').where('used', false).where('expires_at', '<', this.db.fn.now()).del();

    this.fastify.log.info({
      msg: 'Cleaned up expired password reset tokens',
      deletedCount,
    });

    return deletedCount;
  }
}
```

### 2. API Routes

**routes Configuration:**

```typescript
// apps/api/src/core/auth/auth.routes.ts

// Request password reset (rate limited: 3/hour)
typedFastify.route({
  method: 'POST',
  url: '/auth/request-password-reset',
  config: {
    rateLimit: {
      max: 3, // 3 requests
      timeWindow: '1 hour', // per hour
      keyGenerator: (req) => req.ip || 'unknown',
    },
  },
  schema: {
    tags: ['Authentication'],
    summary: 'Request password reset',
    description: 'Send password reset email to user',
    body: SchemaRefs.module('auth', 'requestPasswordResetRequest'),
    response: {
      200: SchemaRefs.module('auth', 'requestPasswordResetResponse'),
    },
  },
  handler: authController.requestPasswordReset,
});

// Verify reset token
typedFastify.route({
  method: 'POST',
  url: '/auth/verify-reset-token',
  schema: {
    tags: ['Authentication'],
    summary: 'Verify password reset token',
    body: SchemaRefs.module('auth', 'verifyResetTokenRequest'),
    response: {
      200: SchemaRefs.module('auth', 'verifyResetTokenResponse'),
      400: SchemaRefs.ValidationError,
    },
  },
  handler: authController.verifyResetToken,
});

// Reset password (rate limited: 5/minute)
typedFastify.route({
  method: 'POST',
  url: '/auth/reset-password',
  config: {
    rateLimit: {
      max: 5, // 5 attempts
      timeWindow: '1 minute', // per minute
    },
  },
  schema: {
    tags: ['Authentication'],
    summary: 'Reset password',
    body: SchemaRefs.module('auth', 'resetPasswordRequest'),
    response: {
      200: SchemaRefs.module('auth', 'resetPasswordResponse'),
      400: SchemaRefs.ValidationError,
    },
  },
  handler: authController.resetPassword,
});
```

### 3. TypeBox Schemas

```typescript
// Request schemas
export const RequestPasswordResetRequestSchema = Type.Object({
  email: Type.String({
    format: 'email',
    description: 'Email address for password reset',
  }),
});

export const VerifyResetTokenRequestSchema = Type.Object({
  token: Type.String({
    minLength: 1,
    description: 'Password reset token from email',
  }),
});

export const ResetPasswordRequestSchema = Type.Object({
  token: Type.String({
    minLength: 1,
    description: 'Password reset token from email',
  }),
  newPassword: Type.String({
    minLength: 8,
    description: 'New password (minimum 8 characters)',
  }),
});

// Response schemas
export const RequestPasswordResetResponseSchema = ApiSuccessResponseSchema(
  Type.Object({
    message: Type.String({
      description: 'Success message (always returns success for security)',
    }),
  }),
);

export const VerifyResetTokenResponseSchema = ApiSuccessResponseSchema(
  Type.Object({
    message: Type.String({
      description: 'Token validation message',
    }),
    valid: Type.Boolean({
      description: 'Whether token is valid',
    }),
  }),
);

export const ResetPasswordResponseSchema = ApiSuccessResponseSchema(
  Type.Object({
    message: Type.String({
      description: 'Password reset success message',
    }),
  }),
);
```

## 🔌 Integration Guide

### Backend Integration

**1. Initialize Service:**

```typescript
// In auth.service.ts or app initialization
import { PasswordResetService } from './services/password-reset.service';

const passwordResetService = new PasswordResetService(fastify, db);

// Make available via fastify instance
fastify.decorate('passwordResetService', passwordResetService);
```

**2. Use in Controllers:**

```typescript
// auth.controller.ts
export const authController = {
  async requestPasswordReset(request: FastifyRequest, reply: FastifyReply) {
    const { email } = request.body as RequestPasswordResetRequest;

    const result = await request.server.authService.requestPasswordReset(email);

    return reply.send({
      success: true,
      data: { message: result.message },
      message: result.message,
      meta: {
        timestamp: new Date().toISOString(),
        version: 'v1',
        requestId: request.id,
      },
    });
  },

  async resetPassword(request: FastifyRequest, reply: FastifyReply) {
    const { token, newPassword } = request.body as ResetPasswordRequest;
    const ipAddress = request.ip;

    const result = await request.server.authService.resetPassword(token, newPassword, ipAddress);

    if (!result.success) {
      return reply.code(400).send({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: result.message,
          details: [
            {
              field: 'token',
              message: result.message,
              code: 'PASSWORD_RESET_FAILED',
            },
          ],
          statusCode: 400,
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: 'v1',
          requestId: request.id,
        },
      });
    }

    return reply.send({
      success: true,
      data: { message: result.message },
      message: result.message,
      meta: {
        timestamp: new Date().toISOString(),
        version: 'v1',
        requestId: request.id,
      },
    });
  },
};
```

### Frontend Integration

**1. Request Reset (TypeScript/Angular):**

```typescript
// password-reset.service.ts
@Injectable({ providedIn: 'root' })
export class PasswordResetService {
  constructor(private http: HttpClient) {}

  requestReset(email: string): Observable<ApiResponse<{ message: string }>> {
    return this.http.post<ApiResponse<{ message: string }>>(`${environment.apiUrl}/api/auth/request-password-reset`, { email });
  }

  verifyToken(token: string): Observable<ApiResponse<{ valid: boolean; message: string }>> {
    return this.http.post<ApiResponse<{ valid: boolean; message: string }>>(`${environment.apiUrl}/api/auth/verify-reset-token`, { token });
  }

  resetPassword(token: string, newPassword: string): Observable<ApiResponse<{ message: string }>> {
    return this.http.post<ApiResponse<{ message: string }>>(`${environment.apiUrl}/api/auth/reset-password`, { token, newPassword });
  }
}

// Component usage
export class ForgotPasswordComponent {
  requestReset(email: string) {
    this.passwordResetService.requestReset(email).subscribe({
      next: (response) => {
        // Show success message
        this.showMessage(response.data.message);
      },
      error: (error) => {
        // Handle error
        this.showError(error.message);
      },
    });
  }
}

export class ResetPasswordComponent implements OnInit {
  private token = '';

  ngOnInit() {
    // Get token from URL query params
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'] || '';
      if (this.token) {
        this.verifyToken();
      }
    });
  }

  verifyToken() {
    this.passwordResetService.verifyToken(this.token).subscribe({
      next: (response) => {
        if (response.data.valid) {
          this.showResetForm = true;
        } else {
          this.showError(response.data.message);
        }
      },
      error: () => {
        this.showError('Invalid or expired reset link');
      },
    });
  }

  resetPassword(newPassword: string) {
    this.passwordResetService.resetPassword(this.token, newPassword).subscribe({
      next: (response) => {
        this.showSuccess(response.data.message);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.showError(error.message);
      },
    });
  }
}
```

**2. Form Components (Angular Material):**

```html
<!-- forgot-password.component.html -->
<mat-card>
  <mat-card-header>
    <mat-card-title>Forgot Password</mat-card-title>
  </mat-card-header>

  <mat-card-content>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Email</mat-label>
        <input matInput type="email" formControlName="email" required />
        <mat-error *ngIf="form.get('email')?.hasError('email')"> Please enter a valid email address </mat-error>
      </mat-form-field>

      <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading">Send Reset Link</button>
    </form>
  </mat-card-content>
</mat-card>

<!-- reset-password.component.html -->
<mat-card>
  <mat-card-header>
    <mat-card-title>Reset Password</mat-card-title>
  </mat-card-header>

  <mat-card-content>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>New Password</mat-label>
        <input matInput type="password" formControlName="newPassword" required />
        <mat-error *ngIf="form.get('newPassword')?.hasError('minlength')"> Password must be at least 8 characters </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Confirm Password</mat-label>
        <input matInput type="password" formControlName="confirmPassword" required />
        <mat-error *ngIf="form.hasError('passwordMismatch')"> Passwords do not match </mat-error>
      </mat-form-field>

      <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading">Reset Password</button>
    </form>
  </mat-card-content>
</mat-card>
```

## 🧪 Testing

### Unit Tests

```typescript
// password-reset.service.spec.ts
describe('PasswordResetService', () => {
  let service: PasswordResetService;
  let mockDb: jest.Mocked<Knex>;
  let mockEmailService: jest.Mocked<EmailService>;

  beforeEach(() => {
    mockDb = createMockKnex();
    service = new PasswordResetService(mockFastify, mockDb);
  });

  describe('requestPasswordReset', () => {
    it('should create token for valid email', async () => {
      mockDb('users').mockResolvedValue([{ id: 'user-id', email: 'test@example.com' }]);

      const result = await service.requestPasswordReset('test@example.com');

      expect(result.success).toBe(true);
      expect(mockDb('password_reset_tokens').insert).toHaveBeenCalled();
    });

    it('should return success for non-existent email (security)', async () => {
      mockDb('users').mockResolvedValue([]);

      const result = await service.requestPasswordReset('nonexistent@example.com');

      expect(result.success).toBe(true);
      expect(result.message).toContain('If an account with that email exists');
    });
  });

  describe('verifyResetToken', () => {
    it('should validate non-expired unused token', async () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 1);

      mockDb('password_reset_tokens').mockResolvedValue([
        {
          token: 'valid-token',
          used: false,
          expires_at: futureDate,
          user_id: 'user-id',
        },
      ]);

      const result = await service.verifyResetToken('valid-token');

      expect(result.success).toBe(true);
      expect(result.userId).toBe('user-id');
    });

    it('should reject expired token', async () => {
      const pastDate = new Date();
      pastDate.setHours(pastDate.getHours() - 1);

      mockDb('password_reset_tokens').mockResolvedValue([
        {
          token: 'expired-token',
          used: false,
          expires_at: pastDate,
        },
      ]);

      const result = await service.verifyResetToken('expired-token');

      expect(result.success).toBe(false);
      expect(result.message).toContain('expired');
    });

    it('should reject used token', async () => {
      mockDb('password_reset_tokens').mockResolvedValue([
        {
          token: 'used-token',
          used: true,
          expires_at: new Date(),
        },
      ]);

      const result = await service.verifyResetToken('used-token');

      expect(result.success).toBe(false);
      expect(result.message).toContain('already been used');
    });
  });

  describe('resetPassword', () => {
    it('should update password and invalidate sessions', async () => {
      // Setup valid token
      mockDb('password_reset_tokens').mockResolvedValue([
        {
          token: 'valid-token',
          used: false,
          expires_at: new Date(Date.now() + 3600000),
          user_id: 'user-id',
        },
      ]);

      const result = await service.resetPassword('valid-token', 'NewPassword123!');

      expect(result.success).toBe(true);
      expect(mockDb('users').update).toHaveBeenCalled();
      expect(mockDb('user_sessions').del).toHaveBeenCalled();
    });
  });
});
```

### Integration Tests

```typescript
// auth.routes.spec.ts
describe('Password Reset Routes', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildTestApp();
  });

  describe('POST /api/auth/request-password-reset', () => {
    it('should return 200 for valid request', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/request-password-reset',
        payload: { email: 'test@example.com' },
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().success).toBe(true);
    });

    it('should respect rate limiting', async () => {
      // Make 4 requests (limit is 3)
      for (let i = 0; i < 4; i++) {
        const response = await app.inject({
          method: 'POST',
          url: '/api/auth/request-password-reset',
          payload: { email: 'test@example.com' },
        });

        if (i < 3) {
          expect(response.statusCode).toBe(200);
        } else {
          expect(response.statusCode).toBe(429);
        }
      }
    });
  });

  describe('POST /api/auth/reset-password', () => {
    it('should reset password with valid token', async () => {
      // Create token
      const token = await createTestResetToken('test@example.com');

      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/reset-password',
        payload: {
          token,
          newPassword: 'NewPassword123!',
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().success).toBe(true);
    });

    it('should reject invalid token', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/reset-password',
        payload: {
          token: 'invalid-token',
          newPassword: 'NewPassword123!',
        },
      });

      expect(response.statusCode).toBe(400);
      expect(response.json().success).toBe(false);
    });
  });
});
```

## ✅ Best Practices

### Security

**1. Token Generation:**

```typescript
// ✅ GOOD: Cryptographically secure
import { randomBytes } from 'crypto';
const token = randomBytes(32).toString('hex');

// ❌ BAD: Predictable
const token = Math.random().toString(36);
```

**2. Email Enumeration Prevention:**

```typescript
// ✅ GOOD: Same response for all cases
if (!user) {
  const fakeToken = randomBytes(32).toString('hex');
  return {
    success: true,
    message: 'If an account with that email exists, a password reset link has been sent.',
  };
}

// ❌ BAD: Reveals if email exists
if (!user) {
  return { success: false, message: 'Email not found' };
}
```

**3. Session Invalidation:**

```typescript
// ✅ GOOD: Delete all sessions
await trx('user_sessions').where('user_id', userId).del();

// ❌ BAD: Keep old sessions active
// (Missing this step is a security vulnerability)
```

### Performance

**1. Database Indexes:**

```sql
-- Essential indexes
CREATE INDEX idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
```

**2. Cleanup Old Tokens:**

```typescript
// Run periodically (e.g., daily cron job)
await passwordResetService.cleanupExpiredTokens();
```

### Error Handling

**1. Graceful Degradation:**

```typescript
try {
  await emailService.sendPasswordResetEmail(email, token);
} catch (error) {
  fastify.log.error({ msg: 'Failed to send email', error });
  // Still return success to user (don't reveal email issues)
  return { success: true, message: '...' };
}
```

**2. Transaction Rollback:**

```typescript
await db.transaction(async (trx) => {
  await trx('users').update({ password });
  await trx('password_reset_tokens').update({ used: true });
  await trx('user_sessions').del();
  // All or nothing - rollback on any error
});
```

## 📊 Performance Considerations

### Database Queries

**Optimization:**

- Token lookup: ~1ms (indexed)
- User lookup: ~1ms (indexed on email)
- Session deletion: ~5ms (indexed on user_id)
- Total: ~10-15ms

**Connection Pooling:**

```typescript
// Knex configuration
pool: {
  min: 2,
  max: 10,
}
```

### Rate Limiting Impact

**Memory Usage:**

- Per IP tracking: ~100 bytes
- 1000 concurrent IPs: ~100KB
- Negligible impact

**Performance:**

- Rate limit check: <1ms
- No database queries for rate limiting

### Email Service

**Async Processing:**

```typescript
// Don't await email sending (fire and forget)
emailService.sendPasswordResetEmail(email, token).catch((error) => fastify.log.error({ msg: 'Email failed', error }));

return { success: true, message: '...' };
```

---

**Document Version:** 1.0.0
**Last Updated:** 2025-11-01
**Related:** [Architecture](./ARCHITECTURE.md) | [API Reference](./API_REFERENCE.md)
