# Monitoring & Audit Modules Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the Monitoring & Audit system, including Error Logs, Activity Logs, User Profile, and API Keys modules.

**Estimated Deployment Time:** 30-45 minutes
**Requires:** Database access, Redis access, deployment permissions

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Database Migrations](#database-migrations)
3. [Environment Variables](#environment-variables)
4. [Backend Deployment](#backend-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [Verification Steps](#verification-steps)
7. [Post-Deployment Tasks](#post-deployment-tasks)
8. [Rollback Procedures](#rollback-procedures)
9. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

### Before You Begin

Ensure the following items are completed before deployment:

- [ ] All builds pass: `pnpm run build`
- [ ] All unit tests pass: `nx test api && nx test web`
- [ ] Integration tests pass: `nx test api-e2e`
- [ ] E2E tests pass: `nx test web-e2e`
- [ ] No TypeScript errors: `nx run-many --target=lint --all`
- [ ] Database backup completed
- [ ] Redis is available and configured
- [ ] Environment variables documented
- [ ] Deployment approval obtained

### Required Access

- [ ] Database administrator credentials
- [ ] Redis connection details
- [ ] API server deployment access
- [ ] Frontend deployment access (CDN/hosting)
- [ ] Permissions management access (RBAC)

### Documentation Review

- [ ] API documentation reviewed
- [ ] Migration scripts reviewed
- [ ] Permission mappings documented
- [ ] Rollback plan prepared

---

## Database Migrations

### Step 1: Backup Database

**CRITICAL:** Always backup before running migrations.

```bash
# PostgreSQL backup
pg_dump -U postgres -d aegisx_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Or using Docker
docker exec -it aegisx-postgres pg_dump -U postgres aegisx_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Step 2: Review Pending Migrations

Check which migrations will run:

```bash
cd apps/api

# Check migration status
pnpm run db:status

# Expected output should show:
# - XXX_create_api_keys_table.ts (pending)
# - Any other pending migrations
```

### Step 3: Run Migrations

Execute database migrations:

```bash
# Run all pending migrations
pnpm run db:migrate

# Verify migrations completed
pnpm run db:status
```

### Step 4: Verify Tables

Confirm all required tables exist:

```bash
# Connect to database
psql -U postgres -d aegisx_db

# Check for required tables
\dt

# Should include:
# - api_keys
# - error_logs (may already exist)
# - user_activity_logs (may already exist)
# - users (should already exist)
```

### Step 5: Verify Table Structure

```sql
-- Verify api_keys table
\d api_keys

-- Expected columns:
-- - id (uuid, primary key)
-- - user_id (uuid, foreign key)
-- - name (varchar)
-- - key_hash (varchar)
-- - key_prefix (varchar)
-- - permissions (text[])
-- - last_used_at (timestamp)
-- - usage_count (integer)
-- - expires_at (timestamp)
-- - revoked (boolean)
-- - revoked_at (timestamp)
-- - created_at (timestamp)
-- - updated_at (timestamp)

-- Check indexes
\di api_keys*

-- Expected indexes:
-- - api_keys_pkey (primary key)
-- - api_keys_user_id_idx
-- - api_keys_key_hash_idx
-- - api_keys_revoked_idx

-- Verify foreign key constraints
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'api_keys'
    AND tc.constraint_type = 'FOREIGN KEY';

-- Should show api_keys.user_id -> users.id
```

---

## Environment Variables

### Required Environment Variables

Add or verify these environment variables in your deployment environment:

```bash
# .env.production

# Database
DATABASE_URL=postgresql://user:password@host:5432/database
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# Redis
REDIS_HOST=redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
REDIS_DB=0

# Application
NODE_ENV=production
API_PORT=3000
API_HOST=0.0.0.0

# JWT
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d

# File Upload
FILE_UPLOAD_DIR=/var/uploads
FILE_UPLOAD_MAX_SIZE=5242880  # 5MB
FILE_AVATAR_SIZE=200

# Rate Limiting
RATE_LIMIT_MAX=1000
RATE_LIMIT_WINDOW=3600000  # 1 hour in ms

# API Keys
API_KEY_BCRYPT_ROUNDS=12

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=/var/log/aegisx/api.log

# Activity Logging
ACTIVITY_LOGGING_ENABLED=true
ACTIVITY_LOG_RETENTION_DAYS=90

# Error Logging
ERROR_LOG_RETENTION_DAYS=30
ERROR_LOG_CACHE_TTL=300  # 5 minutes
```

### Environment-Specific Configurations

**Development:**

```bash
ACTIVITY_LOGGING_ENABLED=true
ERROR_LOG_RETENTION_DAYS=7
LOG_LEVEL=debug
```

**Staging:**

```bash
ACTIVITY_LOGGING_ENABLED=true
ERROR_LOG_RETENTION_DAYS=30
LOG_LEVEL=info
```

**Production:**

```bash
ACTIVITY_LOGGING_ENABLED=true
ERROR_LOG_RETENTION_DAYS=90
LOG_LEVEL=warn
```

---

## Backend Deployment

### Step 1: Build Backend

```bash
# Build API application
nx build api

# Verify build output
ls -la dist/apps/api

# Expected output:
# - main.js
# - package.json
# - node_modules/ (if bundled)
```

### Step 2: Verify Plugin Registration

Check that all modules are properly registered:

```bash
# Review plugin loader
cat apps/api/src/bootstrap/plugin.loader.ts

# Verify these plugins are registered:
# Core Layer:
# - error-logs.plugin
# - activity-logs.plugin
# - file-audit.plugin
# - login-attempts.plugin

# Platform Layer:
# - user-profile.plugin
# - api-keys.plugin
```

### Step 3: Test Backend Locally

Before deploying, test the build locally:

```bash
# Start the built application
NODE_ENV=production node dist/apps/api/main.js

# In another terminal, test health endpoint
curl http://localhost:3000/api/health

# Expected response:
# {
#   "status": "ok",
#   "timestamp": "2025-12-16T12:00:00.000Z",
#   "uptime": 1.234,
#   "environment": "production"
# }
```

### Step 4: Test Module Endpoints

```bash
# Test error logs endpoint
curl -X GET http://localhost:3000/api/error-logs \
  -H "Authorization: Bearer YOUR_TEST_TOKEN"

# Test activity logs endpoint
curl -X GET http://localhost:3000/api/activity-logs \
  -H "Authorization: Bearer YOUR_TEST_TOKEN"

# Test profile endpoint
curl -X GET http://localhost:3000/api/v1/platform/profile \
  -H "Authorization: Bearer YOUR_TEST_TOKEN"

# Test API keys endpoint
curl -X GET http://localhost:3000/api/v1/platform/api-keys \
  -H "Authorization: Bearer YOUR_TEST_TOKEN"
```

### Step 5: Deploy to Server

Deploy using your preferred method:

**Docker Deployment:**

```bash
# Build Docker image
docker build -t aegisx-api:monitoring-audit -f apps/api/Dockerfile .

# Tag for registry
docker tag aegisx-api:monitoring-audit registry.example.com/aegisx-api:latest

# Push to registry
docker push registry.example.com/aegisx-api:latest

# Deploy (example with Docker Compose)
docker-compose up -d api
```

**PM2 Deployment:**

```bash
# Copy build to server
scp -r dist/apps/api user@server:/opt/aegisx/

# On server, start with PM2
pm2 start dist/apps/api/main.js --name aegisx-api

# Save PM2 configuration
pm2 save
```

**Kubernetes Deployment:**

```bash
# Apply deployment
kubectl apply -f k8s/api-deployment.yaml

# Check rollout status
kubectl rollout status deployment/aegisx-api

# Verify pods are running
kubectl get pods -l app=aegisx-api
```

---

## Frontend Deployment

### Step 1: Build Frontend

```bash
# Build web application
nx build web --configuration=production

# Verify build output
ls -la dist/apps/web

# Expected output:
# - index.html
# - main.[hash].js
# - styles.[hash].css
# - assets/
```

### Step 2: Update API Base URL

Ensure frontend points to correct API:

```typescript
// apps/web/src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.example.com', // Update this!
  wsUrl: 'wss://api.example.com',
};
```

### Step 3: Test Frontend Build Locally

```bash
# Serve the production build
npx http-server dist/apps/web -p 4200

# Open browser to http://localhost:4200
# Verify all pages load correctly:
# - Login page
# - Dashboard
# - Error Logs page
# - Activity Logs page
# - Profile page
# - API Keys page
```

### Step 4: Deploy to CDN/Hosting

**AWS S3 + CloudFront:**

```bash
# Sync to S3
aws s3 sync dist/apps/web s3://your-bucket-name/ --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

**Netlify:**

```bash
# Deploy with Netlify CLI
netlify deploy --prod --dir=dist/apps/web
```

**Vercel:**

```bash
# Deploy with Vercel CLI
vercel --prod --cwd dist/apps/web
```

**Nginx (Self-hosted):**

```bash
# Copy build to web root
sudo cp -r dist/apps/web/* /var/www/aegisx/

# Configure Nginx
sudo nano /etc/nginx/sites-available/aegisx

# Add configuration:
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/aegisx;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Reload Nginx
sudo nginx -t
sudo systemctl reload nginx
```

---

## Verification Steps

### Backend Verification

```bash
#!/bin/bash
# verify-backend.sh

API_URL="http://localhost:3000"
TOKEN="YOUR_TEST_TOKEN"

echo "🔍 Verifying Backend Deployment..."

# 1. Health check
echo -n "✓ Health endpoint: "
curl -s $API_URL/api/health | jq -r '.status'

# 2. Error Logs endpoint
echo -n "✓ Error Logs: "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $TOKEN" \
  $API_URL/api/error-logs)
[ "$STATUS" = "200" ] && echo "OK" || echo "FAILED ($STATUS)"

# 3. Activity Logs endpoint
echo -n "✓ Activity Logs: "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $TOKEN" \
  $API_URL/api/activity-logs)
[ "$STATUS" = "200" ] && echo "OK" || echo "FAILED ($STATUS)"

# 4. Profile endpoint
echo -n "✓ Profile: "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $TOKEN" \
  $API_URL/api/v1/platform/profile)
[ "$STATUS" = "200" ] && echo "OK" || echo "FAILED ($STATUS)"

# 5. API Keys endpoint
echo -n "✓ API Keys: "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $TOKEN" \
  $API_URL/api/v1/platform/api-keys)
[ "$STATUS" = "200" ] && echo "OK" || echo "FAILED ($STATUS)"

echo ""
echo "✅ Backend verification complete!"
```

### Frontend Verification

Open browser and verify:

- [ ] **Login Page** - Can login successfully
- [ ] **Dashboard** - Loads without errors
- [ ] **Navigation** - New menu items appear:
  - Monitoring → Error Logs
  - Monitoring → Activity Logs
  - Profile (in user menu)
  - API Keys (in settings or user menu)
- [ ] **Error Logs Page**:
  - [ ] List displays error logs
  - [ ] Filters work (level, type, date)
  - [ ] Statistics cards show data
  - [ ] Export button works
  - [ ] Can navigate to detail page
- [ ] **Activity Logs Page**:
  - [ ] Timeline displays activities
  - [ ] Filters work (action, severity, user)
  - [ ] Can toggle between timeline and table view
  - [ ] Export button works
- [ ] **Profile Page**:
  - [ ] All 4 tabs work (Info, Avatar, Preferences, Activity)
  - [ ] Can update profile information
  - [ ] Department selector populated
  - [ ] Avatar upload works
  - [ ] Theme switcher changes UI immediately
  - [ ] Recent activity displays
- [ ] **API Keys Page**:
  - [ ] List displays user's API keys
  - [ ] Create wizard works (4 steps)
  - [ ] API key shown once with copy button
  - [ ] Can view key details
  - [ ] Usage chart displays
  - [ ] Revoke button works with confirmation

### Database Verification

```sql
-- Check tables exist
SELECT tablename FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('api_keys', 'error_logs', 'user_activity_logs');

-- Check data can be inserted
INSERT INTO api_keys (
  user_id, name, key_hash, key_prefix,
  permissions, revoked
) VALUES (
  'your-user-uuid',
  'Test Key',
  '$2b$12$...',  -- bcrypt hash
  'pk_test_abc',
  ARRAY['users:read'],
  false
);

-- Verify insert worked
SELECT id, name, key_prefix FROM api_keys WHERE name = 'Test Key';

-- Clean up test data
DELETE FROM api_keys WHERE name = 'Test Key';
```

---

## Post-Deployment Tasks

### 1. Seed Initial Permissions

Run permission seeding script:

```bash
# apps/api/src/database/seeds/permissions.seed.ts should include:

# Monitoring permissions:
# - monitoring:read
# - monitoring:write

# Audit permissions:
# - audit:read
# - audit:admin

# API Keys permissions:
# - api-keys:manage

# Assign to appropriate roles (e.g., Admin role gets all)
pnpm run db:seed:permissions
```

### 2. Configure Log Retention

Set up automated cleanup jobs:

```bash
# Add to crontab
crontab -e

# Add these lines:
# Cleanup old error logs (daily at 2 AM)
0 2 * * * curl -X DELETE http://localhost:3000/api/error-logs/cleanup?days=30 -H "Authorization: Bearer $ADMIN_TOKEN"

# Cleanup old activity logs (daily at 3 AM)
0 3 * * * curl -X DELETE http://localhost:3000/api/activity-logs/cleanup?days=90 -H "Authorization: Bearer $ADMIN_TOKEN"
```

### 3. Setup Monitoring Alerts

Configure monitoring for:

- Error log spike detection
- Critical activity detection
- API key usage anomalies
- Avatar upload failures

Example with Grafana/Prometheus:

```yaml
# prometheus-alerts.yml
groups:
  - name: monitoring-audit
    rules:
      - alert: HighErrorRate
        expr: rate(error_logs_total[5m]) > 10
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: 'High error rate detected'
          description: 'Error logs are increasing rapidly'

      - alert: CriticalActivity
        expr: activity_logs_critical_total > 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: 'Critical activity detected'
          description: 'Critical severity activity logged'
```

### 4. Update Documentation

- [ ] Update internal documentation with new features
- [ ] Share API documentation with development team
- [ ] Update user guides with profile and API key management
- [ ] Document permission requirements for new features

### 5. User Training

- [ ] Train administrators on monitoring dashboards
- [ ] Train developers on API key generation and usage
- [ ] Train compliance team on audit log access
- [ ] Provide user guides for profile management

---

## Rollback Procedures

### If Issues Are Detected

**Step 1: Stop New Deployments**

```bash
# If using Docker
docker-compose stop api web

# If using PM2
pm2 stop aegisx-api

# If using Kubernetes
kubectl rollout pause deployment/aegisx-api
```

**Step 2: Rollback Database Migrations**

```bash
# Check current migration version
pnpm run db:status

# Rollback last migration
pnpm run db:rollback

# Verify rollback
pnpm run db:status
```

**Step 3: Restore Previous Application Version**

```bash
# Docker
docker-compose up -d api --force-recreate

# PM2
pm2 start aegisx-api-previous

# Kubernetes
kubectl rollout undo deployment/aegisx-api
```

**Step 4: Restore Database from Backup (if needed)**

```bash
# Stop application first!
pm2 stop aegisx-api

# Restore from backup
psql -U postgres -d aegisx_db < backup_20251216_120000.sql

# Restart application
pm2 start aegisx-api
```

**Step 5: Verify System is Stable**

```bash
# Run verification script
./verify-backend.sh

# Check logs for errors
tail -f /var/log/aegisx/api.log

# Monitor for 15-30 minutes
```

---

## Troubleshooting

### Issue: Migrations Fail

**Symptoms:**

- Migration command returns error
- Tables not created

**Solution:**

```bash
# Check database connection
psql -U postgres -d aegisx_db -c "SELECT version();"

# Check migration lock
SELECT * FROM knex_migrations_lock;

# If locked, forcefully unlock (use with caution!)
DELETE FROM knex_migrations_lock WHERE is_locked = 1;

# Retry migration
pnpm run db:migrate
```

### Issue: Plugins Not Loading

**Symptoms:**

- 404 errors on new endpoints
- Server logs show plugin errors

**Solution:**

```bash
# Check plugin registration in plugin.loader.ts
grep -A 5 "error-logs" apps/api/src/bootstrap/plugin.loader.ts

# Verify plugin files exist
ls -la apps/api/src/layers/core/audit/error-logs/
ls -la apps/api/src/layers/platform/api-keys/

# Check server logs for specific error
tail -n 100 /var/log/aegisx/api.log | grep -i "error\|plugin"

# Restart server
pm2 restart aegisx-api
```

### Issue: Frontend Pages Not Loading

**Symptoms:**

- Blank pages
- 404 on lazy-loaded routes
- Console errors

**Solution:**

```bash
# Check if files were deployed
ls -la /var/www/aegisx/

# Check for TypeScript errors
nx lint web

# Rebuild and redeploy
nx build web --configuration=production
# Deploy again...

# Check browser console for specific errors
# - Check Network tab for failed requests
# - Check Console tab for JavaScript errors
```

### Issue: Authentication Fails

**Symptoms:**

- 401 Unauthorized on all endpoints
- JWT validation errors

**Solution:**

```bash
# Verify JWT secret is set
echo $JWT_SECRET

# Check token expiration
# Use jwt.io to decode and inspect token

# Generate new token for testing
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Test with new token
curl -X GET http://localhost:3000/api/v1/platform/profile \
  -H "Authorization: Bearer NEW_TOKEN"
```

### Issue: Redis Connection Errors

**Symptoms:**

- Cache errors in logs
- Stats endpoints slow/failing
- Activity logging not working

**Solution:**

```bash
# Check Redis is running
redis-cli ping
# Should return: PONG

# Check Redis connection from API
redis-cli -h $REDIS_HOST -p $REDIS_PORT -a $REDIS_PASSWORD ping

# Clear Redis cache if corrupted
redis-cli FLUSHDB

# Restart API to reconnect
pm2 restart aegisx-api
```

### Issue: File Upload Fails (Avatar)

**Symptoms:**

- Avatar upload returns error
- 500 error on avatar endpoint

**Solution:**

```bash
# Check upload directory exists and is writable
ls -la /var/uploads/avatars/
chmod 755 /var/uploads/avatars/

# Check disk space
df -h

# Check file size limits
# In nginx.conf:
# client_max_body_size 10M;

# Check environment variable
echo $FILE_UPLOAD_MAX_SIZE  # Should be 5242880 (5MB)

# Test with small file first
curl -X POST http://localhost:3000/api/v1/platform/profile/avatar \
  -H "Authorization: Bearer $TOKEN" \
  -F "avatar=@small-image.jpg"
```

---

## Performance Optimization

### Database Indexes

Ensure these indexes exist for optimal query performance:

```sql
-- Error logs indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_error_logs_level
ON error_logs(level);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_error_logs_created_at
ON error_logs(created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_error_logs_user_id
ON error_logs(user_id) WHERE user_id IS NOT NULL;

-- Activity logs indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_activity_logs_action
ON user_activity_logs(action);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_activity_logs_severity
ON user_activity_logs(severity);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_activity_logs_user_id
ON user_activity_logs(user_id) WHERE user_id IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_activity_logs_created_at
ON user_activity_logs(created_at DESC);

-- API keys indexes (should already exist from migration)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_api_keys_user_id
ON api_keys(user_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_api_keys_key_hash
ON api_keys(key_hash);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_api_keys_revoked
ON api_keys(revoked) WHERE revoked = false;
```

### Redis Caching

Verify caching is working:

```bash
# Monitor Redis keys
redis-cli --scan --pattern "error-logs:*"
redis-cli --scan --pattern "activity-logs:*"

# Check cache hit rate
redis-cli INFO stats | grep hits
```

### Application Performance

```bash
# Monitor memory usage
pm2 monit

# Check for memory leaks
pm2 logs --lines 1000 | grep -i "memory\|heap"

# Monitor response times
tail -f /var/log/nginx/access.log | awk '{print $10}'
```

---

## Security Checklist

Post-deployment security verification:

- [ ] **HTTPS** - All endpoints use HTTPS in production
- [ ] **CORS** - CORS properly configured for frontend domain
- [ ] **Rate Limiting** - Rate limits enforced on all endpoints
- [ ] **Authentication** - JWT validation working correctly
- [ ] **Permissions** - RBAC permissions properly enforced
- [ ] **API Keys** - API keys hashed with bcrypt (never plain text)
- [ ] **File Upload** - File type and size validation working
- [ ] **SQL Injection** - Prepared statements used (via Knex)
- [ ] **XSS Protection** - Input sanitization in place
- [ ] **Secrets** - No secrets in code or version control
- [ ] **Logs** - No sensitive data logged (passwords, keys, etc.)

---

## Success Criteria

Deployment is considered successful when:

✅ All database migrations completed without errors
✅ All backend endpoints return expected responses
✅ All frontend pages load and function correctly
✅ No errors in application logs for 1 hour
✅ Performance metrics within acceptable range
✅ Monitoring alerts configured and working
✅ Security checklist items verified
✅ Rollback procedure tested and documented
✅ Team trained on new features
✅ Documentation updated

---

## Support Contacts

**For deployment issues:**

- DevOps Team: devops@example.com
- Backend Team: backend@example.com
- Frontend Team: frontend@example.com

**For urgent issues:**

- On-call Engineer: +1-xxx-xxx-xxxx
- Slack: #aegisx-deployments

---

## Deployment Log

Document your deployment:

```
Deployment Date: 2025-12-16
Deployed By: [Your Name]
Environment: Production
Version: v1.0.0
Database Version: 20251216_monitoring_audit

Pre-Deployment:
✅ Builds passed
✅ Tests passed
✅ Database backed up
✅ Approval obtained

Deployment Steps:
✅ Migrations run successfully
✅ Backend deployed
✅ Frontend deployed
✅ Verification completed

Issues Encountered:
[None / List any issues and resolutions]

Post-Deployment:
✅ Monitoring configured
✅ Alerts set up
✅ Team notified
✅ Documentation updated

Sign-off:
Deployed By: ________________  Date: __________
Verified By: ________________  Date: __________
```

---

**Last Updated:** 2025-12-16
**Version:** 1.0.0
