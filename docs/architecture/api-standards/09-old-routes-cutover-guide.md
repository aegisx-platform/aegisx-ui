# Old Routes Cutover Guide (Task 8.5)

## Overview

This guide provides step-by-step instructions for **disabling old routes** after the sunset period, completing the migration to the new layer-based API architecture.

**What This Does:**

- Sets `ENABLE_OLD_ROUTES=false` to disable route aliasing
- Forces all API consumers to use new routes (`/api/v1/{layer}/{resource}`)
- Removes HTTP 307 redirect overhead (improves performance)
- Final step before removing old code (Task 8.6)

**Risk Level:** **HIGH** - Can break clients that haven't migrated

---

## Prerequisites

### 1. Task 8.4 Completion Verification

Before proceeding, verify that Task 8.4 (monitoring and client outreach) is complete:

```bash
# Check migration progress from Task 8.4
# Expected: <5% of requests using deprecated routes
# Expected: All CRITICAL clients migrated (status: MIGRATED)
# Expected: HIGH priority clients migrated or have migration plan
```

**Go/No-Go Criteria:**

- ✅ Deprecated route usage < 5% of total API traffic
- ✅ All CRITICAL clients confirmed migrated
- ✅ All HIGH priority clients migrated OR have accepted sunset date
- ✅ Sunset date passed (default: 2 weeks after Task 8.3)
- ✅ Migration guide published and accessible
- ✅ Support team prepared for cutover day

**If ANY criteria not met:** STOP and extend sunset period.

### 2. System Health Verification

```bash
# Verify production is healthy before cutover
# 1. API server running
curl -s http://localhost:3000/api/v1/core/monitoring/health | jq

# Expected: {"status":"healthy","uptime":...}

# 2. Error rate normal (<1% in last 24 hours)
# Check: Grafana error rate dashboard

# 3. No ongoing incidents
# Check: PagerDuty, incident tracking system

# 4. Database healthy
# Check: Connection pool, slow query log
```

**If system unhealthy:** STOP and fix issues first.

### 3. Rollback Plan Ready

**Critical:** Must have tested rollback procedure before cutover.

```bash
# Rollback is simple: re-enable old routes
# Test this BEFORE cutover day:

# 1. In staging environment, disable old routes
export ENABLE_OLD_ROUTES=false
# Restart API server

# 2. Verify new routes work, old routes return 404
curl -s http://localhost:3000/api/users | jq
# Expected: 404 Not Found

curl -s http://localhost:3000/api/v1/platform/users | jq
# Expected: 200 OK

# 3. Re-enable old routes (rollback test)
export ENABLE_OLD_ROUTES=true
# Restart API server

# 4. Verify old routes work again
curl -s http://localhost:3000/api/users | jq
# Expected: 307 redirect to /api/v1/platform/users
```

**Rollback Time:** ~30 seconds (environment variable change + health check)

---

## Cutover Architecture

### Before Cutover (Migration Mode)

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────┐
│  Fastify API Server         │
│  ENABLE_NEW_ROUTES=true     │
│  ENABLE_OLD_ROUTES=true ✅  │ ← Both enabled
└──────┬──────────────────────┘
       │
       ├─────────────┬─────────────┐
       │             │             │
       ▼             ▼             ▼
   Old Routes   New Routes   Route Aliasing
   (via alias)  (direct)      Plugin ✅
   /api/users   /api/v1/...   (HTTP 307)
```

**Behavior:**

- Old routes (`/api/users`) → HTTP 307 redirect → New routes (`/api/v1/platform/users`)
- New routes work directly (no redirect)
- Both route sets active simultaneously

### After Cutover (New Routes Only)

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────┐
│  Fastify API Server         │
│  ENABLE_NEW_ROUTES=true     │
│  ENABLE_OLD_ROUTES=false ❌ │ ← Old routes disabled
└──────┬──────────────────────┘
       │
       ├─────────────┬─────────────┐
       │             │             │
       ▼             ▼             ▼
   Old Routes   New Routes   Route Aliasing
   (404 error)  (direct)      Plugin ❌ (skipped)
   /api/users   /api/v1/...
```

**Behavior:**

- Old routes (`/api/users`) → **404 Not Found**
- New routes continue working (no change)
- Route aliasing plugin skipped (no overhead)

**Performance Impact:**

- ✅ Eliminates HTTP 307 redirect overhead (~2-10ms per request)
- ✅ Reduces route matching overhead (fewer registered routes)
- ✅ Cleaner logs (no deprecation warnings)

---

## Cutover Steps

### Phase 1: Final Verification (30 minutes before cutover)

**1.1. Check Migration Metrics**

```bash
# Review deprecated route usage from last 7 days
# Expected: Declining trend, <5% current usage

# Check client migration status
# Expected: All CRITICAL and HIGH clients migrated
```

**1.2. Notify Stakeholders**

Send notification 30 minutes before cutover:

```
Subject: Old API Routes Cutover - Starting in 30 Minutes

Team,

We will disable old API routes (/api/*) in 30 minutes at [TIME].

Expected Impact: Minimal (all critical clients migrated)
Affected Routes: /api/users, /api/auth, /api/inventory, etc.
New Routes: /api/v1/platform/*, /api/v1/core/*, /api/v1/domains/*

Migration Guide: https://docs.aegisx.com/api/migration-guide

Rollback: Available within 30 seconds if issues detected

Monitoring: [Link to Grafana dashboard]

Thanks,
DevOps Team
```

**1.3. Prepare Monitoring**

Open monitoring dashboards:

- Grafana: Error rate dashboard
- Grafana: API latency dashboard (P50, P95, P99)
- Grafana: Request count dashboard
- Log aggregator: Real-time error logs
- PagerDuty: Alert dashboard

### Phase 2: Cutover Execution (15 minutes)

**2.1. Set Environment Variable**

```bash
# SSH to production server OR update deployment config

# Method 1: Environment file (recommended)
echo "ENABLE_OLD_ROUTES=false" >> /path/to/production/.env

# Method 2: Kubernetes ConfigMap
kubectl edit configmap api-config -n production
# Add: ENABLE_OLD_ROUTES: "false"

# Method 3: Docker environment
# Update docker-compose.yml or deployment manifest
```

**2.2. Restart API Server**

```bash
# Kubernetes (rolling restart, zero downtime)
kubectl rollout restart deployment api-server -n production
kubectl rollout status deployment api-server -n production

# Docker Compose
docker-compose restart api

# PM2
pm2 restart api-server

# Systemd
sudo systemctl restart api-server
```

**2.3. Verify Cutover**

```bash
# Wait 30 seconds for restart to complete
sleep 30

# Test 1: Old route should return 404
curl -i http://production-api.example.com/api/users

# Expected output:
# HTTP/1.1 404 Not Found
# {"statusCode":404,"error":"Not Found","message":"Route GET:/api/users not found"}

# Test 2: New route should work
curl -i http://production-api.example.com/api/v1/platform/users

# Expected output:
# HTTP/1.1 200 OK
# {"data":[...users...]}

# Test 3: Check server logs for confirmation
kubectl logs -f deployment/api-server -n production | grep "route-alias"

# Expected output:
# Route aliasing plugin: Old routes not enabled, skipping alias registration
# (This confirms the plugin is disabled)
```

### Phase 3: Monitoring Phase (First 2 Hours)

**3.1. Immediate Monitoring (First 10 Minutes)**

Watch for immediate issues:

```bash
# Real-time error monitoring
kubectl logs -f deployment/api-server -n production --tail=100 | grep -i error

# Watch for 404 errors on old routes
# Expected: Some 404s from unmigrated clients (acceptable if <5% of traffic)
# CRITICAL: NO 500 errors, NO authentication failures, NO database errors
```

**Critical Thresholds (First 10 Minutes):**

- ❌ Error rate increases >5% → **ROLLBACK IMMEDIATELY**
- ❌ Authentication failures increase →**ROLLBACK IMMEDIATELY**
- ❌ Database connection errors → **ROLLBACK IMMEDIATELY**
- ⚠️ 404 rate 5-10% → Monitor closely, prepare rollback
- ✅ 404 rate <5% → Expected, continue monitoring

**3.2. Short-Term Monitoring (10 Minutes - 2 Hours)**

```bash
# Check metrics every 15 minutes:

# 1. Error rate (should remain stable or decrease)
# Grafana: API Error Rate dashboard
# Expected: ≤1% error rate (same as baseline)

# 2. 404 rate (track unmigrated clients)
# Grafana: HTTP Status Codes panel
# Expected: Small spike, then decline as clients update

# 3. Latency (should improve slightly)
# Grafana: API Latency dashboard
# Expected: P95 latency -2 to -10ms (redirect overhead removed)

# 4. Request volume (should remain stable)
# Grafana: Request Count dashboard
# Expected: No significant drop (would indicate broken clients)
```

**Alert Thresholds (10 Min - 2 Hours):**

- ❌ Request volume drops >20% → **ROLLBACK** (clients broken)
- ❌ Error rate >3% → **ROLLBACK** (unexpected errors)
- ⚠️ 404 rate >10% → Contact unmigrated clients urgently
- ⚠️ Support tickets increase → Investigate client issues
- ✅ All metrics stable → Cutover successful

### Phase 4: Post-Cutover Actions

**4.1. Update Documentation**

```markdown
# In migration guide, add banner:

⚠️ OLD ROUTES DISABLED (2025-12-XX)

Old routes (/api/\*) have been disabled. All requests must use new routes:

- Core: /api/v1/core/\*
- Platform: /api/v1/platform/\*
- Domains: /api/v1/domains/\*

Requests to old routes will return 404 Not Found.
```

**4.2. Notify Remaining Clients**

For clients still using old routes (detected via 404s):

```
Subject: URGENT: Old API Routes Disabled - Action Required

[Client Name],

We have disabled old API routes (/api/*) as planned.

Your application is currently receiving 404 errors because it's using old routes.

IMMEDIATE ACTION REQUIRED:
1. Update API base URL from /api to /api/v1/{layer}
2. Refer to migration guide: https://docs.aegisx.com/api/migration-guide
3. Contact support if you need assistance

Current Error Rate: [X] requests/minute failing

Migration Guide: https://docs.aegisx.com/api/migration-guide
Support: support@example.com

Apologies for any inconvenience.
```

**4.3. Performance Validation**

After 2 hours, validate performance improvements:

```bash
# Compare P95 latency before vs after cutover
# Expected improvement: 2-10ms (redirect overhead removed)

# Query Prometheus metrics:
# Before cutover (last 24 hours):
avg(http_request_duration_ms{route=~"/api/.*"}) - (now - 86400, now - 7200)

# After cutover (last 2 hours):
avg(http_request_duration_ms{route=~"/api/v1/.*"}) - (now - 7200, now)

# Calculate difference
```

**Expected Results:**

- ✅ P95 latency reduced by 2-10ms
- ✅ Request count stable (no client breakage)
- ✅ Error rate ≤1% (same as baseline)
- ✅ 404 rate declining (clients updating)

---

## Rollback Procedure

### When to Rollback

**IMMEDIATE ROLLBACK if:**

- ❌ Error rate increases >5%
- ❌ Request volume drops >20%
- ❌ Authentication system failures
- ❌ Database connection errors
- ❌ Critical client reports complete service outage

**CONSIDER ROLLBACK if:**

- ⚠️ 404 rate >10% (many unmigrated clients)
- ⚠️ Multiple support tickets about API access
- ⚠️ Critical client requests extension

### Rollback Steps (30 Seconds)

**Step 1: Re-enable Old Routes**

```bash
# Update environment variable
export ENABLE_OLD_ROUTES=true

# Or update config file
echo "ENABLE_OLD_ROUTES=true" >> /path/to/production/.env

# Kubernetes
kubectl set env deployment/api-server ENABLE_OLD_ROUTES=true -n production
```

**Step 2: Restart API Server**

```bash
# Kubernetes (rolling restart)
kubectl rollout restart deployment api-server -n production

# Wait for rollout to complete
kubectl rollout status deployment api-server -n production
```

**Step 3: Verify Rollback**

```bash
# Test: Old routes should work (with 307 redirect)
curl -i http://production-api.example.com/api/users

# Expected:
# HTTP/1.1 307 Temporary Redirect
# Location: /api/v1/platform/users

# Check logs
kubectl logs deployment/api-server -n production | grep "route-alias"

# Expected:
# Route aliasing plugin: Registering XX route aliases for backward compatibility
```

**Step 4: Notify Stakeholders**

```
Subject: Old API Routes Re-enabled (Rollback)

Team,

We've rolled back the old routes cutover due to [REASON].

Current Status: Old routes (/api/*) are working again via HTTP 307 redirects
Impact: Clients experiencing 404 errors should now be working
Next Steps:
  1. Investigate [ISSUE]
  2. Extend sunset period
  3. Reach out to remaining clients
  4. Reschedule cutover

New Cutover Date: TBD (will notify 1 week in advance)
```

---

## Monitoring Strategy

### Grafana Dashboard Configuration

**Panel 1: API Error Rate (Critical)**

```promql
# Query
sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100

# Alert Threshold
> 3% for 5 minutes → Page DevOps team
```

**Panel 2: 404 Rate (Old Routes)**

```promql
# Query
sum(rate(http_requests_total{status="404", route=~"/api/[^v].*"}[5m]))

# Alert Threshold
> 100 requests/minute → Warning (unmigrated clients)
> 500 requests/minute → Critical (consider rollback)
```

**Panel 3: Request Count by Route Prefix**

```promql
# Query
sum by (route_prefix) (rate(http_requests_total[5m]))

# Visualize:
- /api/* (should drop to 0 after cutover)
- /api/v1/* (should remain stable)
```

**Panel 4: P95 Latency Improvement**

```promql
# Query (Before - After)
histogram_quantile(0.95, rate(http_request_duration_ms_bucket[5m]))

# Expected: -2 to -10ms after cutover
```

**Panel 5: Critical Clients Health**

```promql
# Query (by client identifier)
sum by (client_id) (rate(http_requests_total{status=~"4..|5.."}[5m]))

# Alert if critical client error rate > 1%
```

### Alert Rules

**Alert 1: High Error Rate After Cutover**

```yaml
alert: HighErrorRateAfterCutover
expr: sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) > 0.03
for: 5m
severity: critical
annotations:
  summary: 'Error rate increased to {{ $value }}% after old routes cutover'
  action: 'Consider immediate rollback if >5%'
```

**Alert 2: High 404 Rate (Unmigrated Clients)**

```yaml
alert: HighOldRoute404Rate
expr: sum(rate(http_requests_total{status="404", route=~"/api/[^v].*"}[5m])) > 500
for: 10m
severity: warning
annotations:
  summary: 'Many clients ({{ $value }} req/min) still using old routes'
  action: 'Reach out to unmigrated clients urgently'
```

**Alert 3: Request Volume Drop**

```yaml
alert: RequestVolumeDrop
expr: sum(rate(http_requests_total[5m])) < (sum(rate(http_requests_total[1h] offset 1h)) * 0.8)
for: 5m
severity: critical
annotations:
  summary: 'Request volume dropped {{ $value }}% after cutover'
  action: 'ROLLBACK IMMEDIATELY - clients may be broken'
```

---

## Troubleshooting

### Issue 1: High 404 Rate After Cutover

**Symptoms:**

- Many 404 errors in logs
- Clients reporting "Route not found"
- 404 rate >10%

**Diagnosis:**

```bash
# Identify which routes are getting 404s
kubectl logs deployment/api-server -n production | grep "404" | grep "/api/" | awk '{print $X}' | sort | uniq -c | sort -rn

# Example output:
# 1500 /api/users
# 800 /api/inventory/drugs
# 200 /api/auth/login

# This shows which clients haven't migrated
```

**Resolution:**

1. **If 404 rate <10%:** Continue with cutover, contact unmigrated clients
2. **If 404 rate 10-20%:** Contact clients urgently, prepare rollback
3. **If 404 rate >20%:** **ROLLBACK IMMEDIATELY** (too many unmigrated clients)

**Client Communication Template:**

```
Subject: URGENT: API Route Update Required

[Client Name],

Your application is receiving 404 errors ({{ COUNT }} errors/minute) because old API routes have been disabled.

Immediate Action Required:
1. Update your API base URL
   OLD: http://api.example.com/api/users
   NEW: http://api.example.com/api/v1/platform/users

2. Route Mapping:
   /api/users → /api/v1/platform/users
   /api/auth → /api/v1/core/auth
   /api/inventory → /api/v1/domains/inventory

3. Migration Guide: https://docs.aegisx.com/api/migration-guide

Need Help? Contact support@example.com (Priority Support Available)
```

### Issue 2: Authentication Failures After Cutover

**Symptoms:**

- 401 Unauthorized errors
- "Invalid token" errors
- Users unable to log in

**Diagnosis:**

```bash
# Check auth-related errors
kubectl logs deployment/api-server -n production | grep -i "auth" | grep -i "error"

# Check if old auth routes are being called
kubectl logs deployment/api-server -n production | grep "404" | grep "/api/auth"

# If clients are calling /api/auth (old route), they'll get 404
# If they're calling /api/v1/core/auth but still getting 401, different issue
```

**Resolution:**

```bash
# If issue is old auth routes (404):
# → Clients need to update to /api/v1/core/auth

# If issue is authentication logic:
# → Check auth module logs for actual errors
kubectl logs deployment/api-server -n production | grep "auth.service"

# If widespread authentication failures:
# → ROLLBACK IMMEDIATELY (critical system)
```

### Issue 3: Request Volume Drop After Cutover

**Symptoms:**

- Total API request count drops significantly (>20%)
- Suspiciously quiet traffic

**Diagnosis:**

```bash
# Compare request count before vs after
# Before (last hour before cutover):
sum(rate(http_requests_total[1h] offset 2h))

# After (current hour):
sum(rate(http_requests_total[1h]))

# If drop >20%, clients are broken (not reaching new routes)
```

**Resolution:**

```bash
# IMMEDIATE ROLLBACK
# Request volume drop indicates clients can't reach API at all

# After rollback, investigate:
# 1. Which clients dropped off?
# 2. Are they getting 404s or connection errors?
# 3. Do they need migration assistance?
```

### Issue 4: Performance Degradation After Cutover

**Symptoms:**

- P95 latency increased (not decreased as expected)
- Slow response times
- Timeout errors

**Diagnosis:**

```bash
# This is unexpected - removing redirects should IMPROVE performance
# Check for other issues:

# 1. Database connection pool exhausted?
kubectl logs deployment/api-server -n production | grep "connection pool"

# 2. Sudden traffic spike?
# Check Grafana request count - did traffic increase?

# 3. Downstream service issues?
# Check dependencies (database, Redis, external APIs)

# 4. New routes hitting slower code paths?
# Compare latency by route:
histogram_quantile(0.95, rate(http_request_duration_ms_bucket[5m]))
```

**Resolution:**

```bash
# If performance degradation is severe (P95 >500ms):
# → Investigate root cause (likely NOT related to cutover)

# If minor degradation (P95 +10-20ms):
# → Monitor for 1 hour, may be temporary spike

# If caused by new route code paths:
# → Performance bug in new routes (investigate and fix)
```

---

## Success Criteria

### Immediate Success (First 10 Minutes)

- ✅ Old routes return 404 Not Found
- ✅ New routes return 200 OK (unchanged behavior)
- ✅ Error rate ≤1% (same as baseline)
- ✅ No authentication failures
- ✅ No database errors
- ✅ Server logs show: "Old routes not enabled, skipping alias registration"

### Short-Term Success (First 2 Hours)

- ✅ Error rate stable (≤1%)
- ✅ Request volume stable (±10% of baseline)
- ✅ P95 latency reduced by 2-10ms (redirect overhead removed)
- ✅ 404 rate declining (clients updating)
- ✅ Critical clients unaffected (0 support tickets)
- ✅ No rollback required

### Long-Term Success (First 7 Days)

- ✅ 404 rate <1% (most clients migrated or stopped using API)
- ✅ Performance improvement sustained (P95 latency -2 to -10ms)
- ✅ No degradation in any metrics
- ✅ Support tickets resolved (client migration assistance complete)
- ✅ System stable and ready for Task 8.6 (code cleanup)

---

## Next Steps

After successful cutover and 7-day stability period:

**Task 8.6: Remove Old Code and Route Aliasing**

- Delete old module directories (`apps/api/src/core/users`, etc.)
- Remove route aliasing plugin (`apps/api/src/config/route-aliases.ts`)
- Clean up plugin loader (remove dual registration logic)
- Update documentation (remove migration references)

**Estimated Timeline:**

- Cutover Day: 2 hours active monitoring
- Monitoring Period: 7 days
- Task 8.6 Start: Day 8 (if all success criteria met)

---

## Reference

- Task 8.1: Production deployment guide (feature flags)
- Task 8.2: Migration mode activation guide
- Task 8.3: Deprecation headers implementation
- Task 8.4: Monitoring and client tracking guide
- Migration Guide: https://docs.aegisx.com/api/migration-guide
- Grafana Dashboards: [Link to dashboards]
- Rollback Procedure: See "Rollback Procedure" section above

---

**Document Version:** 1.0
**Created:** 2025-12-15
**Last Updated:** 2025-12-15
**Task:** 8.5 - Disable old routes after sunset period
**Status:** Ready for execution
