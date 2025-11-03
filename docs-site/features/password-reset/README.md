# Password Reset System

> **Secure token-based password recovery with email verification**

## 📋 Overview

The Password Reset System provides a secure, user-friendly way for users to recover their accounts when they forget their passwords. The system uses cryptographically secure random tokens sent via email, with multiple security layers to prevent abuse and unauthorized access.

### Key Features

- **Secure Token Generation** - 64-character random tokens (32 bytes) with cryptographic security
- **Time-Limited Tokens** - Automatic expiration after 1 hour
- **One-Time Use** - Tokens can only be used once to prevent replay attacks
- **Session Invalidation** - All user sessions are terminated after password reset
- **Rate Limiting** - Protection against brute force and abuse attempts
- **Email Verification** - Password reset links sent via email
- **IP Tracking** - Security audit trail with IP address logging
- **No Email Enumeration** - Security-first messaging doesn't reveal if email exists

### Security Features

| Feature                  | Implementation                     | Purpose                                     |
| ------------------------ | ---------------------------------- | ------------------------------------------- |
| **Token Length**         | 64 hex characters (32 bytes)       | Cryptographically secure, prevents guessing |
| **Expiration**           | 1 hour                             | Limits time window for potential attacks    |
| **One-Time Use**         | Token marked as used after reset   | Prevents token replay attacks               |
| **Session Invalidation** | All sessions deleted               | Forces re-authentication with new password  |
| **Rate Limiting**        | 3 requests/hour, 5 attempts/minute | Prevents brute force and abuse              |
| **IP Tracking**          | IP address logged                  | Security audit trail                        |
| **No Enumeration**       | Same response for all emails       | Prevents user discovery                     |

## 🚀 Quick Start

### For End Users

1. **Request Password Reset:**

   ```
   Navigate to: /auth/forgot-password
   Enter your email address
   Check your email for reset link
   ```

2. **Reset Your Password:**
   ```
   Click the link in email
   Enter new password (minimum 8 characters)
   Confirm password reset
   Login with new credentials
   ```

### For Developers

**Test Password Reset Flow:**

```bash
# 1. Request password reset
curl -X POST http://localhost:3333/api/auth/request-password-reset \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'

# Response:
# {
#   "success": true,
#   "data": {
#     "message": "If an account with that email exists, a password reset link has been sent."
#   }
# }

# 2. Check email for token (or get from database in dev)
# Token format: 64 hex characters

# 3. Verify token (optional)
curl -X POST http://localhost:3333/api/auth/verify-reset-token \
  -H "Content-Type: application/json" \
  -d '{"token": "YOUR_TOKEN_HERE"}'

# 4. Reset password
curl -X POST http://localhost:3333/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_TOKEN_HERE",
    "newPassword": "NewSecurePassword123!"
  }'
```

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Password Reset Flow                      │
└─────────────────────────────────────────────────────────────┘

1. User Request
   │
   ├─> POST /api/auth/request-password-reset
   │   └─> PasswordResetService.requestPasswordReset()
   │       ├─> Generate secure token (32 bytes)
   │       ├─> Store in password_reset_tokens table
   │       ├─> Send email with reset link
   │       └─> Return success (no email enumeration)
   │
2. Token Verification (Optional)
   │
   ├─> POST /api/auth/verify-reset-token
   │   └─> PasswordResetService.verifyResetToken()
   │       ├─> Check token exists
   │       ├─> Check not used
   │       ├─> Check not expired
   │       └─> Return validation result
   │
3. Password Reset
   │
   └─> POST /api/auth/reset-password
       └─> PasswordResetService.resetPassword()
           ├─> Verify token (same checks as #2)
           ├─> Hash new password (bcrypt)
           ├─> Update user password
           ├─> Mark token as used
           ├─> Delete all user sessions
           └─> Return success
```

## 🔐 Rate Limiting

| Endpoint                  | Limit      | Window   | Purpose             |
| ------------------------- | ---------- | -------- | ------------------- |
| `/request-password-reset` | 3 requests | 1 hour   | Prevent spam/abuse  |
| `/reset-password`         | 5 attempts | 1 minute | Prevent brute force |
| `/verify-reset-token`     | No limit   | -        | Read-only operation |

**IP-Based Rate Limiting:**

- Requests tracked by IP address
- Limits apply per IP, not per user
- Automatic reset after time window expires

## 📁 Database Schema

**Table: `password_reset_tokens`**

```sql
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL,
  used BOOLEAN DEFAULT false,
  used_at TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_tokens_email ON password_reset_tokens(email);
```

## 📚 Documentation

- **[User Guide](./USER_GUIDE.md)** - Step-by-step instructions for end users
- **[Developer Guide](./DEVELOPER_GUIDE.md)** - Technical implementation details
- **[API Reference](./API_REFERENCE.md)** - Complete API documentation
- **[Architecture](./ARCHITECTURE.md)** - System design and security decisions
- **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** - Production deployment procedures
- **[Troubleshooting](./TROUBLESHOOTING.md)** - Common issues and solutions
- **[Documentation Index](./DOCUMENTATION_INDEX.md)** - Complete navigation guide

## 🔗 Related Features

- **[Authentication](../authentication/)** - JWT-based authentication system
- **[Email Service](../email/)** - Email sending functionality
- **[User Management](../users/)** - User account management

## 🎯 Use Cases

### 1. User Forgot Password

```
User forgets password → Requests reset → Receives email →
Clicks link → Enters new password → Successfully resets
```

### 2. Expired Token

```
User receives email → Waits >1 hour → Clicks link →
Token expired → Requests new reset link
```

### 3. Rate Limit Protection

```
Attacker tries to spam → Exceeds 3 requests/hour →
System blocks further requests → Returns 429 error
```

## ⚙️ Configuration

**Environment Variables:**

```bash
# Email configuration (required for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@example.com

# Application URLs (for email links)
API_URL=http://localhost:3333
WEB_URL=http://localhost:4200
```

**Service Configuration:**

```typescript
// Token settings (configured in service)
TOKEN_LENGTH = 32 bytes (64 hex characters)
EXPIRATION_HOURS = 1 hour

// Rate limiting (configured in routes)
REQUEST_LIMIT = 3 requests per hour
RESET_LIMIT = 5 attempts per minute
```

## 📈 Monitoring

**Key Metrics to Track:**

- Password reset requests per day
- Success/failure rate
- Token expiration rate
- Average time between request and reset
- Rate limit hits
- Invalid token attempts

**Database Cleanup:**

```typescript
// Automatic cleanup of expired tokens
PasswordResetService.cleanupExpiredTokens();
// Run periodically (e.g., daily cron job)
```

## 🚨 Security Considerations

### ✅ DO

- ✅ Use HTTPS in production
- ✅ Monitor for suspicious patterns
- ✅ Set up proper email SPF/DKIM
- ✅ Log all password reset attempts
- ✅ Notify users of password changes
- ✅ Clean up expired tokens regularly

### ❌ DON'T

- ❌ Reveal if email exists in system
- ❌ Allow unlimited reset requests
- ❌ Reuse tokens
- ❌ Store tokens in plain text (always in database)
- ❌ Skip session invalidation
- ❌ Use short or predictable tokens

## 📝 Change Log

### v1.0.0 (2025-11-01) - Initial Release

- ✅ Secure token generation with crypto.randomBytes()
- ✅ Email-based password reset flow
- ✅ Rate limiting protection
- ✅ Session invalidation on password change
- ✅ IP tracking for security audit
- ✅ One-time use tokens
- ✅ 1-hour token expiration
- ✅ No email enumeration protection

## 👥 Support

**For Issues:**

- Check [Troubleshooting Guide](./TROUBLESHOOTING.md) first
- Review [API Reference](./API_REFERENCE.md) for correct usage
- Contact development team if issue persists

**For Feature Requests:**

- Submit via project issue tracker
- Include use case and justification
- Consider security implications

---

**Last Updated:** 2025-11-01 (Session 56)
**Status:** ✅ Production Ready
**Version:** 1.0.0
