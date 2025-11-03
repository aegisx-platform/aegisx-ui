# Password Reset - User Guide

> **Step-by-step instructions for resetting your password safely**

## 📋 Table of Contents

- [Introduction](#introduction)
- [Before You Start](#before-you-start)
- [How to Reset Your Password](#how-to-reset-your-password)
- [What to Expect](#what-to-expect)
- [Common Scenarios](#common-scenarios)
- [Security Best Practices](#security-best-practices)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)

## 🎯 Introduction

This guide will help you reset your password if you've forgotten it or want to change it for security reasons. The password reset process is designed to be secure and easy to use.

**What You'll Need:**

- Access to the email address associated with your account
- Ability to receive and click email links
- A new password (minimum 8 characters)

**Time Required:** 2-5 minutes

## ✅ Before You Start

### Check These First

1. **Email Access** - Make sure you can receive emails at the address registered with your account
2. **Password Requirements** - Your new password must be at least 8 characters long
3. **Browser** - Use a modern browser (Chrome, Firefox, Safari, Edge)
4. **Internet Connection** - Ensure you have a stable internet connection

### Important Notes

- ⏱️ Reset links expire after **1 hour** for security
- 🔒 Each reset link can only be used **once**
- 📧 Check your spam folder if you don't see the email
- 🔐 All your active sessions will be logged out after reset

## 🔄 How to Reset Your Password

### Step 1: Request Password Reset

1. **Go to the Login Page**

   ```
   Navigate to: https://yourapp.com/login
   ```

2. **Click "Forgot Password?"**
   - Look for the link below the login form
   - Usually says "Forgot Password?" or "Reset Password"

3. **Enter Your Email**

   ```
   Enter: your-email@example.com
   Click: "Send Reset Link"
   ```

4. **Check Confirmation Message**

   ```
   You should see:
   "If an account with that email exists, a password reset link has been sent."
   ```

   **Note:** This message appears regardless of whether the email exists in our system (for security reasons).

### Step 2: Check Your Email

1. **Open Your Email Inbox**
   - Check the email address you entered
   - Look for an email from: `noreply@yourapp.com`
   - Subject: "Password Reset Request"

2. **If You Don't See the Email:**
   - ✅ Check your **spam/junk** folder
   - ✅ Wait 1-2 minutes (emails may be delayed)
   - ✅ Check you entered the correct email
   - ✅ Request a new link if >5 minutes have passed

3. **Email Contents:**

   ```
   Subject: Password Reset Request
   From: noreply@yourapp.com

   Hello,

   You requested to reset your password. Click the link below to proceed:

   https://yourapp.com/reset-password?token=abc123...

   This link will expire in 1 hour.

   If you didn't request this, please ignore this email.
   ```

### Step 3: Click the Reset Link

1. **Click the Link in Email**
   - Click the blue "Reset Password" button or link
   - This will open a new browser tab/window

2. **Verify the Page**
   - Check the URL starts with your app's domain
   - Look for the lock icon (🔒) indicating HTTPS
   - Page title should say "Reset Password"

### Step 4: Enter New Password

1. **Fill in the Form**

   ```
   New Password: ********** (minimum 8 characters)
   Confirm Password: ********** (must match)
   ```

2. **Password Requirements:**
   - ✅ Minimum 8 characters
   - ✅ Recommended: Mix of letters, numbers, and symbols
   - ✅ Recommended: Not a previously used password
   - ✅ Recommended: Not easily guessable

3. **Click "Reset Password"**
   - The system will validate your password
   - You'll see a success or error message

### Step 5: Login with New Password

1. **Success Message:**

   ```
   ✅ Password has been reset successfully
   You can now login with your new password
   ```

2. **Go to Login Page:**
   - You'll be redirected automatically, or
   - Click "Go to Login" button

3. **Login:**

   ```
   Email: your-email@example.com
   Password: [your new password]
   ```

4. **Important:** All your previous sessions have been logged out for security.

## 📊 What to Expect

### Timeline

| Step | Action             | Time    | Notes                        |
| ---- | ------------------ | ------- | ---------------------------- |
| 1    | Request reset      | Instant | Confirmation message appears |
| 2    | Email delivery     | 1-2 min | Check spam if not received   |
| 3    | Click link         | Instant | Must be within 1 hour        |
| 4    | Enter new password | ~1 min  | Must meet requirements       |
| 5    | Login              | Instant | Use new credentials          |

### Email Template

**What the password reset email looks like:**

```
┌────────────────────────────────────────────────┐
│  [Company Logo]                                 │
│                                                 │
│  Password Reset Request                         │
│                                                 │
│  Hello [Your Name],                            │
│                                                 │
│  We received a request to reset your password. │
│  Click the button below to create a new one:   │
│                                                 │
│  ┌──────────────────────┐                      │
│  │  Reset My Password   │                      │
│  └──────────────────────┘                      │
│                                                 │
│  Or copy this link to your browser:            │
│  https://yourapp.com/reset-password?token=...  │
│                                                 │
│  This link expires in: 1 hour                  │
│                                                 │
│  If you didn't request this, ignore this email.│
│  Your password won't change until you click    │
│  the link above and create a new one.          │
│                                                 │
│  Thanks,                                        │
│  The [YourApp] Team                            │
└────────────────────────────────────────────────┘
```

## 🔍 Common Scenarios

### Scenario 1: "I Didn't Receive the Email"

**Possible Causes:**

1. Email in spam/junk folder
2. Email address not in system
3. Temporary email delivery delay
4. Email filters blocking the message

**Solutions:**

```
Step 1: Check Spam Folder
├─> Open your spam/junk folder
├─> Look for email from noreply@yourapp.com
└─> Mark as "Not Spam" if found

Step 2: Verify Email Address
├─> Make sure you entered the correct email
├─> Try your alternate email if you have one
└─> Contact support if unsure which email you used

Step 3: Wait and Retry
├─> Wait 5 minutes
├─> Request a new reset link
└─> Check spam folder again

Step 4: Check Email Filters
├─> Check email client settings
├─> Ensure no filters block noreply@yourapp.com
└─> Add sender to safe senders list
```

### Scenario 2: "The Link Expired"

**Error Message:**

```
Reset token has expired. Please request a new one.
```

**Solution:**

```
1. Go back to the login page
2. Click "Forgot Password?" again
3. Enter your email
4. Check email for new link
5. Complete reset within 1 hour
```

**Why Links Expire:**

- Security measure to prevent old links from working
- Default expiration: 1 hour after email is sent
- Each new request generates a fresh link

### Scenario 3: "Token Already Used"

**Error Message:**

```
Reset token has already been used
```

**This Means:**

- You or someone already used this link
- Password may have been reset already
- Token cannot be reused (security feature)

**Solutions:**

```
Option 1: Try Logging In
├─> Go to login page
├─> Use your email
└─> Try recently reset password

Option 2: Request New Reset
├─> If login fails, request new reset
├─> Follow normal reset process
└─> Use new link immediately
```

### Scenario 4: "Too Many Requests"

**Error Message:**

```
Too many password reset requests. Please try again later.
```

**Rate Limits:**

- Maximum 3 reset requests per hour (per IP address)
- Maximum 5 reset attempts per minute (per IP address)

**Solution:**

```
1. Wait for the time window to reset:
   - For request limit: Wait 1 hour
   - For reset limit: Wait 1 minute

2. If you requested multiple times:
   - Check your email for most recent link
   - Use only the latest reset link
   - Previous links are automatically invalidated
```

### Scenario 5: "I'm on Mobile"

**Mobile-Specific Tips:**

```
1. Email App:
   ✅ DO: Tap the link in your email app
   ✅ DO: Allow link to open in browser
   ❌ DON'T: Screenshot the link (won't be clickable)

2. Password Manager:
   ✅ DO: Use your password manager to generate strong password
   ✅ DO: Save new password immediately
   ❌ DON'T: Forget to save new password

3. Auto-Fill:
   ✅ DO: Allow browser to remember new password
   ✅ DO: Update saved password in keychain
   ❌ DON'T: Rely only on memory
```

## 🔐 Security Best Practices

### Creating a Strong Password

**✅ DO:**

- ✅ Use at least 12 characters (minimum is 8)
- ✅ Mix uppercase and lowercase letters
- ✅ Include numbers and symbols
- ✅ Use a password manager
- ✅ Make it unique (don't reuse passwords)

**❌ DON'T:**

- ❌ Use common words or phrases
- ❌ Use personal information (birthday, name)
- ❌ Use the same password as other sites
- ❌ Share your password with anyone
- ❌ Write it down in plain text

**Good Password Examples:**

```
✅ P@ssw0rd2024!MyApp
✅ Tr0pic@l-Sunset#92
✅ B1ue$ky&Mountains47

❌ password123
❌ 12345678
❌ yourname2024
```

### After Resetting

**Immediate Actions:**

1. **Update Saved Passwords**

   ```
   - Update in browser's password manager
   - Update in mobile password manager
   - Update in any password management apps
   ```

2. **Clear Old Sessions**

   ```
   - System automatically logs out all devices
   - You need to login again on all devices
   - This is a security feature
   ```

3. **Verify Account Security**
   ```
   - Check recent login activity
   - Review connected applications
   - Enable two-factor authentication (if available)
   ```

### Protecting Your Account

**Ongoing Security:**

- 🔒 **Never share** your password reset link
- 📧 **Always verify** email sender before clicking links
- 🔍 **Check the URL** before entering your password
- 🚫 **Don't use public Wi-Fi** for sensitive operations
- 🔐 **Enable 2FA** when available

## 🆘 Troubleshooting

### Problem: Can't Receive Reset Email

**Quick Diagnostics:**

```bash
1. Check Spam Folder ✅
   └─> Moved from spam?
       └─> Mark as "Not Spam"

2. Verify Email Address ✅
   └─> Correct email?
       └─> Try alternate email
       └─> Contact support

3. Check Email Server ✅
   └─> Email working?
       └─> Test with different sender
       └─> Check email client settings

4. Firewall/Filters ✅
   └─> Emails blocked?
       └─> Add to whitelist
       └─> Disable filters temporarily
```

### Problem: Link Not Working

**Symptoms:**

- Link doesn't open
- Page shows error
- "Invalid token" message

**Solutions:**

```
1. Copy/Paste Full URL
   - Don't click truncated link
   - Copy entire URL from email
   - Paste in browser address bar

2. Check Link Format
   - Should start with: https://yourapp.com
   - Should include: ?token=...
   - Should be one continuous line

3. Request New Link
   - If link broken, request new one
   - Use new link immediately
   - Don't save old links
```

### Problem: Password Not Accepted

**Error Messages:**

```
❌ "Password must be at least 8 characters"
   Solution: Use longer password

❌ "Passwords do not match"
   Solution: Retype carefully in both fields

❌ "Password too weak"
   Solution: Add mix of characters, numbers, symbols
```

## ❓ FAQ

### General Questions

**Q: How long does the reset link last?**

- A: 1 hour from when the email is sent

**Q: Can I use the link multiple times?**

- A: No, each link can only be used once for security

**Q: What happens to my logged-in devices?**

- A: All sessions are logged out automatically. You need to login again with the new password.

**Q: Will I lose any data?**

- A: No, resetting your password doesn't affect your account data, only your credentials.

### Security Questions

**Q: Is it safe to reset my password over email?**

- A: Yes, the links are secure and expire quickly. Always verify the sender and URL.

**Q: What if I didn't request a password reset?**

- A: Simply ignore the email. Your password won't change unless you click the link and complete the process.

**Q: Can someone else reset my password?**

- A: They would need access to your email account, which is why email security is important.

### Technical Questions

**Q: Why do I get "too many requests"?**

- A: Rate limiting prevents abuse. Wait an hour and try again, or use your most recent email.

**Q: What if the page won't load?**

- A: Check your internet connection, try a different browser, or copy the link to a new tab.

**Q: Can I reset password from mobile?**

- A: Yes, the process works the same on mobile devices.

## 📞 Need Help?

**Still Having Issues?**

1. **Check Troubleshooting Guide**
   - See [Troubleshooting](./TROUBLESHOOTING.md) for detailed solutions

2. **Contact Support**
   - Email: support@yourapp.com
   - Include: Your email address (not password)
   - Describe: What step you're stuck on

3. **Live Chat**
   - Available: Mon-Fri, 9 AM - 5 PM
   - Response time: Usually within 1 hour

---

**Document Version:** 1.0.0
**Last Updated:** 2025-11-01
**Related:** [API Reference](./API_REFERENCE.md) | [Developer Guide](./DEVELOPER_GUIDE.md)
