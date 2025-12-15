# SMTP Configuration Guide - Email Testing for Authentication

> **For testing authentication features: email verification, password reset, etc.**

## 📋 Overview

AegisX uses **Nodemailer** for sending emails. You need to configure SMTP settings to enable email functionality.

**Authentication features requiring email:**

- ✅ User Registration → Email Verification
- ✅ Password Reset → Reset Link via Email
- ✅ Resend Verification Email
- ✅ Account Security Notifications

---

## 🚀 Quick Start (Recommended: Mailtrap)

**For testing/development, use Mailtrap (free, no real emails sent)**

### Step 1: Create Mailtrap Account

1. Go to https://mailtrap.io
2. Sign up for free account
3. Create an inbox (or use default "Demo Inbox")

### Step 2: Get SMTP Credentials

1. Click on your inbox
2. Go to "SMTP Settings" tab
3. Select "Nodemailer" from dropdown
4. Copy the credentials

### Step 3: Update `.env.local`

```bash
# Open .env.local (or create if doesn't exist)
nano .env.local

# Add these lines (replace with your Mailtrap credentials):
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_SECURE=false
SMTP_USER=your_mailtrap_username
SMTP_PASSWORD=your_mailtrap_password
FROM_EMAIL=noreply@aegisx.local

# Legacy env vars (for backward compatibility)
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_mailtrap_username
EMAIL_PASSWORD=your_mailtrap_password
EMAIL_FROM=noreply@aegisx.local
```

### Step 4: Restart API Server

```bash
# Stop current server (Ctrl+C)
# Start again
pnpm run dev:api
```

### Step 5: Test Email Sending

**Register a new user:**

```bash
# 1. Go to http://localhost:4200/register
# 2. Fill in the form
# 3. Submit

# 4. Check Mailtrap inbox for verification email
# 5. Click the verification link
```

---

## 🔧 Configuration Options

### Option 1: Mailtrap (Recommended for Development) ⭐⭐⭐⭐⭐

**Pros:**

- ✅ Free tier: 500 emails/month, 100/day
- ✅ No real emails sent (safe for testing)
- ✅ Email inspector (view HTML, spam score, headers)
- ✅ No domain verification needed
- ✅ Instant setup

**Cons:**

- ❌ Not for production (emails are caught)

**Configuration:**

```bash
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_SECURE=false
SMTP_USER=<get_from_mailtrap>
SMTP_PASSWORD=<get_from_mailtrap>
FROM_EMAIL=noreply@aegisx.local
```

**Get Credentials:**

- Website: https://mailtrap.io
- Dashboard → Inboxes → Select Inbox → SMTP Settings

---

### Option 2: Gmail (Easy, but has limitations) ⭐⭐⭐

**Pros:**

- ✅ Free (if you have Gmail account)
- ✅ Real emails sent
- ✅ Reliable delivery

**Cons:**

- ⚠️ Requires "App Password" (2-step verification must be enabled)
- ⚠️ Daily sending limit: 500 emails/day
- ⚠️ Less secure than dedicated SMTP services

**Configuration:**

**Step 1: Enable 2-Step Verification**

1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification

**Step 2: Create App Password**

1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Other (Custom name)"
3. Enter "AegisX Platform"
4. Copy the 16-character password

**Step 3: Update `.env.local`**

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your.email@gmail.com
SMTP_PASSWORD=<16-character-app-password>
FROM_EMAIL=your.email@gmail.com
```

**Important Notes:**

- Use App Password, NOT your regular Gmail password
- Emails will come from your Gmail address
- Gmail may block login if suspicious activity detected

---

### Option 3: SendGrid (Production-Ready) ⭐⭐⭐⭐⭐

**Pros:**

- ✅ Free tier: 100 emails/day forever
- ✅ Production-ready
- ✅ High deliverability
- ✅ Advanced analytics
- ✅ Template support

**Cons:**

- ⚠️ Requires domain verification for better deliverability
- ⚠️ More complex setup

**Configuration:**

**Step 1: Create SendGrid Account**

1. Go to https://sendgrid.com
2. Sign up for free account

**Step 2: Create API Key**

1. Go to Settings → API Keys
2. Click "Create API Key"
3. Name: "AegisX Platform"
4. Permissions: "Full Access" or "Mail Send"
5. Copy the API key

**Step 3: Verify Sender Email**

1. Go to Settings → Sender Authentication
2. Click "Verify a Single Sender"
3. Fill in your details
4. Check your email and verify

**Step 4: Update `.env.local`**

```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=<your-sendgrid-api-key>
FROM_EMAIL=<your-verified-email@example.com>
```

**Important:**

- `SMTP_USER` must be exactly `apikey` (not your username)
- `SMTP_PASSWORD` is your SendGrid API key
- `FROM_EMAIL` must be verified in SendGrid

---

### Option 4: AWS SES (Enterprise Scale) ⭐⭐⭐⭐⭐

**Pros:**

- ✅ Extremely cheap: $0.10 per 1,000 emails
- ✅ High volume support
- ✅ Enterprise reliability
- ✅ AWS integration

**Cons:**

- ⚠️ Requires AWS account
- ⚠️ Initially in sandbox mode (limited)
- ⚠️ Domain verification required
- ⚠️ More complex setup

**Configuration:**

**Step 1: Setup AWS SES**

1. Go to AWS Console → SES
2. Verify your email address
3. Create SMTP credentials
4. Request production access (if needed)

**Step 2: Update `.env.local`**

```bash
SMTP_HOST=email-smtp.<region>.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=<your-aws-ses-smtp-username>
SMTP_PASSWORD=<your-aws-ses-smtp-password>
FROM_EMAIL=<your-verified-email@example.com>
```

**Regions:**

- us-east-1: `email-smtp.us-east-1.amazonaws.com`
- eu-west-1: `email-smtp.eu-west-1.amazonaws.com`
- ap-southeast-1: `email-smtp.ap-southeast-1.amazonaws.com`

---

### Option 5: Mailgun (Alternative) ⭐⭐⭐⭐

**Pros:**

- ✅ Free tier: 5,000 emails/month
- ✅ Good deliverability
- ✅ Simple API

**Cons:**

- ⚠️ Requires domain verification
- ⚠️ Credit card required (even for free tier)

**Configuration:**

```bash
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=<your-mailgun-username>
SMTP_PASSWORD=<your-mailgun-password>
FROM_EMAIL=<your-verified-email@example.com>
```

---

## 🧪 Testing SMTP Configuration

### Method 1: Test via API Endpoint (Coming Soon)

```bash
# POST /api/test/send-email
curl -X POST http://localhost:3333/api/test/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "your-email@example.com",
    "subject": "Test Email",
    "text": "This is a test email from AegisX"
  }'
```

### Method 2: Test via Registration

1. Start API server: `pnpm run dev:api`
2. Start Web app: `pnpm run dev:web`
3. Go to http://localhost:4200/register
4. Register with your email
5. Check your inbox (or Mailtrap) for verification email

### Method 3: Test via Password Reset

1. Go to http://localhost:4200/forgot-password
2. Enter registered email
3. Check inbox for password reset email
4. Click reset link
5. Set new password

---

## 🔍 Troubleshooting

### Problem: No emails received

**Check 1: SMTP credentials configured?**

```bash
# Check if SMTP_USER and SMTP_PASSWORD are set
cat .env.local | grep SMTP

# Should show:
# SMTP_USER=...
# SMTP_PASSWORD=...
```

**Check 2: API server restarted?**

```bash
# Restart API server after changing .env.local
pnpm run dev:api
```

**Check 3: Console logs**

```bash
# API server logs should show:
[EMAIL_SERVICE] SMTP credentials found, initializing...
```

If you see:

```bash
[EMAIL_SERVICE] No SMTP credentials, using console logging
```

→ SMTP is NOT configured. Check `.env.local`

---

### Problem: Authentication Error

**Error:** `Invalid login: 535 Authentication failed`

**Solutions:**

**For Gmail:**

- ✅ Use App Password (not regular password)
- ✅ Enable 2-Step Verification
- ✅ Check "Less secure app access" is OFF (use App Password instead)

**For SendGrid:**

- ✅ SMTP_USER must be exactly `apikey`
- ✅ SMTP_PASSWORD is your API key (starts with SG.xxx)
- ✅ Verify sender email in SendGrid dashboard

**For Mailtrap:**

- ✅ Copy credentials from Mailtrap dashboard
- ✅ Use correct inbox credentials

---

### Problem: Connection Timeout

**Error:** `Connection timeout`

**Solutions:**

- ✅ Check SMTP_HOST is correct
- ✅ Check SMTP_PORT (usually 587 or 2525)
- ✅ Check firewall/network settings
- ✅ Try SMTP_SECURE=false instead of true

---

### Problem: Emails go to Spam

**Solutions:**

- ✅ Verify your domain (SPF, DKIM records)
- ✅ Use reputable SMTP service (SendGrid, AWS SES)
- ✅ Use authenticated sender email
- ✅ Include unsubscribe link
- ✅ Don't use spammy words in subject

---

## 📝 Environment Variables Reference

### Required Variables

| Variable        | Description                            | Example                |
| --------------- | -------------------------------------- | ---------------------- |
| `SMTP_HOST`     | SMTP server hostname                   | `smtp.mailtrap.io`     |
| `SMTP_PORT`     | SMTP server port                       | `2525` or `587`        |
| `SMTP_SECURE`   | Use TLS? (true for 465, false for 587) | `false`                |
| `SMTP_USER`     | SMTP username                          | `your-username`        |
| `SMTP_PASSWORD` | SMTP password                          | `your-password`        |
| `FROM_EMAIL`    | Default sender email                   | `noreply@aegisx.local` |

### Optional Variables (Legacy)

| Variable         | Description           | Note                       |
| ---------------- | --------------------- | -------------------------- |
| `EMAIL_HOST`     | Same as SMTP_HOST     | For backward compatibility |
| `EMAIL_PORT`     | Same as SMTP_PORT     | For backward compatibility |
| `EMAIL_USER`     | Same as SMTP_USER     | For backward compatibility |
| `EMAIL_PASSWORD` | Same as SMTP_PASSWORD | For backward compatibility |
| `EMAIL_FROM`     | Same as FROM_EMAIL    | For backward compatibility |

---

## 🔐 Security Best Practices

### 1. Never Commit SMTP Credentials

```bash
# .env.local should be in .gitignore (already done)
# NEVER commit .env.local to git

# Check .gitignore:
cat .gitignore | grep "\.env"

# Should show:
# .env.local
# .env.*.local
```

### 2. Use Environment-Specific Configuration

```bash
# Development (.env.local)
SMTP_HOST=smtp.mailtrap.io

# Staging (.env.staging)
SMTP_HOST=smtp.sendgrid.net

# Production (.env.production)
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
```

### 3. Rotate Credentials Regularly

- Change SMTP passwords every 90 days
- Regenerate API keys periodically
- Monitor for unauthorized usage

### 4. Use App Passwords (Gmail)

- NEVER use your main Gmail password
- Use App-specific passwords
- Revoke if compromised

---

## 📚 Testing Checklist

Use this checklist to ensure email functionality works:

### Registration Flow

- [ ] Register new user
- [ ] Verification email received
- [ ] Email contains correct verification link
- [ ] Click verification link
- [ ] Account marked as verified
- [ ] Can login after verification

### Password Reset Flow

- [ ] Click "Forgot Password"
- [ ] Enter email address
- [ ] Password reset email received
- [ ] Email contains reset link
- [ ] Click reset link
- [ ] Reset form appears
- [ ] Set new password
- [ ] Can login with new password
- [ ] Old password no longer works

### Resend Verification

- [ ] Login to unverified account
- [ ] Request resend verification
- [ ] New verification email received
- [ ] Old verification link invalid
- [ ] New link works

### Email Content

- [ ] Subject is clear
- [ ] HTML email renders correctly
- [ ] Plain text fallback exists
- [ ] Links are clickable
- [ ] No broken images
- [ ] Proper branding (if applicable)

---

## 🚀 Quick Setup Commands

### Copy & Paste Configuration

**For Mailtrap (Development):**

```bash
# Edit .env.local
cat >> .env.local << 'EOF'

# SMTP Configuration (Mailtrap)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_SECURE=false
SMTP_USER=your_username
SMTP_PASSWORD=your_password
FROM_EMAIL=noreply@aegisx.local
EOF

# Edit the file and replace your_username and your_password
nano .env.local

# Restart API
pnpm run dev:api
```

**For Gmail (Quick Test):**

```bash
# Edit .env.local
cat >> .env.local << 'EOF'

# SMTP Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your.email@gmail.com
SMTP_PASSWORD=your_app_password
FROM_EMAIL=your.email@gmail.com
EOF

# Edit the file and replace with your credentials
nano .env.local

# Restart API
pnpm run dev:api
```

---

## 💡 Recommendations

### For Different Environments

| Environment           | Recommended Service     | Why?                            |
| --------------------- | ----------------------- | ------------------------------- |
| **Local Development** | Mailtrap                | Free, safe, no real emails sent |
| **Team Development**  | Mailtrap (shared inbox) | Collaboration, email inspection |
| **Staging**           | SendGrid or AWS SES     | Production-like testing         |
| **Production**        | AWS SES or SendGrid     | Reliability, scalability, cost  |
| **Quick Test**        | Gmail                   | Already have account, instant   |

### Email Volume Tiers

| Monthly Volume  | Recommended Service     | Cost            |
| --------------- | ----------------------- | --------------- |
| < 500 emails    | Mailtrap (dev) or Gmail | Free            |
| < 5,000 emails  | SendGrid Free Tier      | Free            |
| < 50,000 emails | SendGrid Essentials     | $19.95/month    |
| > 50,000 emails | AWS SES                 | $0.10 per 1,000 |

---

## 📖 Additional Resources

**Mailtrap:**

- Website: https://mailtrap.io
- Docs: https://mailtrap.io/docs

**SendGrid:**

- Website: https://sendgrid.com
- Docs: https://docs.sendgrid.com

**AWS SES:**

- Website: https://aws.amazon.com/ses
- Docs: https://docs.aws.amazon.com/ses

**Gmail App Passwords:**

- Guide: https://support.google.com/accounts/answer/185833

**Nodemailer:**

- Website: https://nodemailer.com
- Docs: https://nodemailer.com/about/

---

## ❓ FAQ

**Q: Do I need SMTP for local development?**
A: No, if SMTP is not configured, emails will be logged to console. But you won't be able to test verification links.

**Q: Which SMTP service should I use?**
A: For testing: Mailtrap. For production: AWS SES or SendGrid.

**Q: Can I use free Gmail for production?**
A: Not recommended. Gmail has sending limits and may block automated emails.

**Q: How do I test without sending real emails?**
A: Use Mailtrap. It catches all emails without delivering them.

**Q: What if I don't configure SMTP?**
A: Email functionality won't work, but the app will run. Emails will be logged to console only.

**Q: How do I know if SMTP is working?**
A: Check API logs. Should see "[EMAIL_SERVICE] SMTP credentials found" message.

---

## 🎯 Next Steps

After configuring SMTP:

1. ✅ Test registration flow
2. ✅ Test password reset flow
3. ✅ Test email verification
4. ✅ Check email deliverability
5. ✅ Configure production SMTP (when deploying)

---

**Need Help?**

- Check troubleshooting section above
- Review API server logs
- Test with Mailtrap first (simplest)
- Ensure .env.local is loaded (restart API)

**Related Documentation:**

- [Authentication System](../features/authentication/)
- [Email Service](../api/email-service.md)
- [Environment Configuration](./environment-setup.md)
