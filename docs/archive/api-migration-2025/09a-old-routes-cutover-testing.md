# Old Routes Cutover - Testing Guide

## Overview

This guide provides **practical testing scenarios** to validate the old routes cutover before and during production deployment.

**Test Environment Setup:**

- Staging environment (required)
- Local development environment (optional, for faster iteration)
- Production environment (final cutover)

---

## Test Scenario 1: Migration Mode (Both Routes Active)

**Configuration:**

```bash
ENABLE_NEW_ROUTES=true
ENABLE_OLD_ROUTES=true  # Default (or unset)
```

**Expected Behavior:**

- ✅ Old routes (`/api/users`) → HTTP 307 redirect → New routes (`/api/v1/platform/users`)
- ✅ New routes work directly (no redirect)
- ✅ Deprecation headers present on old routes
- ✅ Both route sets functional

### Test Cases

**TC1.1: Old Route Redirects with GET**

```bash
# Test
curl -v http://localhost:3000/api/users

# Expected Response
< HTTP/1.1 307 Temporary Redirect
< Location: /api/v1/platform/users
< Deprecation: true
< Sunset: 2025-12-29T00:00:00Z
< X-API-Deprecated: true
< X-API-Migration-Guide: https://docs.aegisx.com/api/migration-guide

# Client should auto-follow redirect and get:
< HTTP/1.1 200 OK
{
  "data": [...users...]
}
```

**TC1.2: Old Route Redirects with POST (Body Preserved)**

```bash
# Test
curl -v -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'

# Expected Response
< HTTP/1.1 307 Temporary Redirect
< Location: /api/v1/platform/users
< Deprecation: true

# Client auto-follows redirect with same method and body:
< HTTP/1.1 201 Created
{
  "data": {
    "id": "uuid",
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

**TC1.3: New Route Works Directly (No Redirect)**

```bash
# Test
curl -v http://localhost:3000/api/v1/platform/users

# Expected Response (no redirect)
< HTTP/1.1 200 OK
< Content-Type: application/json
{
  "data": [...users...]
}

# Should NOT have deprecation headers
```

**TC1.4: Deprecation Headers Present**

```bash
# Test
curl -v http://localhost:3000/api/auth/login 2>&1 | grep -E "Deprecation|Sunset|X-API"

# Expected Output
< Deprecation: true
< Sunset: 2025-12-29T00:00:00Z
< X-API-Deprecated: true
< X-API-Sunset: 2025-12-29T00:00:00Z
< X-API-Migration-Guide: https://docs.aegisx.com/api/migration-guide
```

**TC1.5: Server Logs Show Aliasing Active**

```bash
# Test
kubectl logs deployment/api-server -n staging | grep "route-alias"

# Expected Output
Route aliasing plugin: Registering 13 route aliases for backward compatibility
Route aliasing plugin: Old routes are DEPRECATED and will be removed on 2025-12-29...
Route aliasing plugin: Successfully registered 13 route aliases
```

---

## Test Scenario 2: Cutover Complete (Old Routes Disabled)

**Configuration:**

```bash
ENABLE_NEW_ROUTES=true
ENABLE_OLD_ROUTES=false  # ← Cutover configuration
```

**Expected Behavior:**

- ❌ Old routes (`/api/users`) → **404 Not Found** (no redirect)
- ✅ New routes work normally
- ✅ Route aliasing plugin skipped (no overhead)

### Test Cases

**TC2.1: Old Route Returns 404**

```bash
# Test
curl -v http://localhost:3000/api/users

# Expected Response
< HTTP/1.1 404 Not Found
< Content-Type: application/json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "Route GET:/api/users not found"
}

# Should NOT have Deprecation headers (route doesn't exist)
```

**TC2.2: All Old Routes Return 404**

```bash
# Test all old route prefixes
for route in /api/users /api/auth /api/departments /api/settings /api/inventory /api/admin; do
  echo "Testing $route..."
  curl -s -o /dev/null -w "%{http_code}" http://localhost:3000$route
  echo ""
done

# Expected Output (all 404)
Testing /api/users...
404
Testing /api/auth...
404
Testing /api/departments...
404
Testing /api/settings...
404
Testing /api/inventory...
404
Testing /api/admin...
404
```

**TC2.3: New Routes Still Work**

```bash
# Test new routes still functional
curl -s http://localhost:3000/api/v1/platform/users | jq '.data | length'
# Expected: Number of users (e.g., 10)

curl -s http://localhost:3000/api/v1/core/auth/me \
  -H "Authorization: Bearer $TOKEN" | jq '.data.email'
# Expected: User email

curl -s http://localhost:3000/api/v1/domains/inventory/drugs | jq '.data | length'
# Expected: Number of drugs
```

**TC2.4: Server Logs Show Aliasing Disabled**

```bash
# Test
kubectl logs deployment/api-server -n staging --tail=200 | grep "route-alias"

# Expected Output
Route aliasing plugin: Old routes disabled (cutover complete), skipping alias registration
Old API routes (/api/*) will return 404 Not Found. All clients must use new routes (/api/v1/*)
```

**TC2.5: No Redirect Overhead (Performance Improvement)**

```bash
# Measure P95 latency before and after cutover

# Before (with ENABLE_OLD_ROUTES=true):
# Use Apache Bench or similar tool
ab -n 1000 -c 10 http://localhost:3000/api/users
# Record P95 latency from "Time per request" line

# After (with ENABLE_OLD_ROUTES=false):
ab -n 1000 -c 10 http://localhost:3000/api/v1/platform/users
# Record P95 latency

# Expected: 2-10ms improvement (redirect overhead removed)
```

---

## Test Scenario 3: Error Cases

### TC3.1: Invalid Configuration (Both Disabled)

**Configuration:**

```bash
ENABLE_NEW_ROUTES=false
ENABLE_OLD_ROUTES=false
```

**Expected Behavior:**

- ❌ Server should log warning (no routes will work)
- Or: Config validation prevents this state

```bash
# Test
ENABLE_NEW_ROUTES=false ENABLE_OLD_ROUTES=false npm start

# Expected: Warning or error
# (Implementation note: Current code doesn't validate this, just silently skips aliasing)
# Recommended: Add validation in server.ts startup
```

### TC3.2: Rollback from Cutover

**Initial State:**

```bash
ENABLE_NEW_ROUTES=true
ENABLE_OLD_ROUTES=false  # Old routes disabled
```

**Rollback Action:**

```bash
# Re-enable old routes
export ENABLE_OLD_ROUTES=true
# Restart server
kubectl rollout restart deployment/api-server -n staging
```

**Test:**

```bash
# Wait 30 seconds for restart
sleep 30

# Old routes should work again (with 307 redirect)
curl -v http://localhost:3000/api/users

# Expected Response
< HTTP/1.1 307 Temporary Redirect
< Location: /api/v1/platform/users
```

**Rollback Time:** ~30 seconds (measured from restart command to functional old routes)

---

## Test Scenario 4: Critical User Flows

Test complete end-to-end user journeys to ensure no breakage.

### TC4.1: User Authentication Flow

```bash
# Using OLD routes (should fail after cutover)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Before cutover: 307 redirect → 200 OK with token
# After cutover: 404 Not Found

# Using NEW routes (should always work)
curl -X POST http://localhost:3000/api/v1/core/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Expected: 200 OK with token (before and after cutover)
```

### TC4.2: CRUD Operations

```bash
TOKEN="<jwt-token-from-login>"

# CREATE (POST)
curl -X POST http://localhost:3000/api/v1/platform/departments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Department"}'
# Expected: 201 Created

# READ (GET)
curl http://localhost:3000/api/v1/platform/departments \
  -H "Authorization: Bearer $TOKEN"
# Expected: 200 OK with departments list

# UPDATE (PUT)
DEPT_ID="<department-id>"
curl -X PUT http://localhost:3000/api/v1/platform/departments/$DEPT_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Department"}'
# Expected: 200 OK

# DELETE
curl -X DELETE http://localhost:3000/api/v1/platform/departments/$DEPT_ID \
  -H "Authorization: Bearer $TOKEN"
# Expected: 200 OK or 204 No Content
```

### TC4.3: File Upload/Download

```bash
TOKEN="<jwt-token>"

# Upload file
curl -X POST http://localhost:3000/api/v1/platform/file-upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@test-file.pdf"
# Expected: 200 OK with file metadata

# Download file
FILE_ID="<file-id-from-upload>"
curl http://localhost:3000/api/v1/platform/file-upload/$FILE_ID/download \
  -H "Authorization: Bearer $TOKEN" \
  -o downloaded-file.pdf
# Expected: 200 OK, file downloaded successfully
```

---

## Staging Environment Testing Checklist

Before production cutover, complete this checklist in staging:

### Pre-Cutover (Migration Mode)

- [ ] **TC1.1-1.5:** All migration mode tests pass
- [ ] **TC4.1-4.3:** All critical user flows work via old and new routes
- [ ] **Performance:** Baseline metrics established (error rate, latency, throughput)
- [ ] **Monitoring:** Grafana dashboards configured and displaying data
- [ ] **Logs:** Deprecation warnings appearing in logs for old route usage

### Cutover Execution

- [ ] **TC2.1-2.5:** All cutover complete tests pass
- [ ] **404 Validation:** Old routes return 404 (not 307)
- [ ] **New Routes:** All new routes work normally
- [ ] **Logs:** "Old routes disabled" message in server logs
- [ ] **Performance:** Latency improvement measured (2-10ms expected)

### Post-Cutover

- [ ] **TC3.2:** Rollback tested and successful (30-second recovery)
- [ ] **Error Rate:** ≤1% (same as baseline)
- [ ] **Request Volume:** Stable (±10% of baseline)
- [ ] **Critical Flows:** All TC4 tests pass via new routes only
- [ ] **Support:** No critical support tickets

### Sign-Off

- [ ] **QA Lead:** All tests passed
- [ ] **DevOps Lead:** Monitoring configured, rollback tested
- [ ] **Product Owner:** Migration guide published, clients notified
- [ ] **Engineering Manager:** Ready for production cutover

---

## Production Testing Protocol

### Immediate Post-Cutover (First 10 Minutes)

**Automated Smoke Tests:**

```bash
# Run this script immediately after production cutover
#!/bin/bash

API_BASE="https://api.production.example.com"
TOKEN="<admin-jwt-token>"

echo "=== Production Cutover Smoke Tests ==="

# Test 1: Old routes return 404
echo "Test 1: Old routes return 404..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $API_BASE/api/users)
if [ "$STATUS" = "404" ]; then
  echo "✅ PASS: Old routes disabled"
else
  echo "❌ FAIL: Expected 404, got $STATUS - ROLLBACK!"
  exit 1
fi

# Test 2: New routes work
echo "Test 2: New routes functional..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $TOKEN" \
  $API_BASE/api/v1/platform/users)
if [ "$STATUS" = "200" ]; then
  echo "✅ PASS: New routes working"
else
  echo "❌ FAIL: New routes broken - ROLLBACK!"
  exit 1
fi

# Test 3: Authentication works
echo "Test 3: Authentication..."
RESPONSE=$(curl -s -X POST $API_BASE/api/v1/core/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"<password>"}')
if echo "$RESPONSE" | grep -q "token"; then
  echo "✅ PASS: Authentication working"
else
  echo "❌ FAIL: Authentication broken - ROLLBACK!"
  exit 1
fi

# Test 4: Database connectivity
echo "Test 4: Database..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $TOKEN" \
  $API_BASE/api/v1/platform/departments)
if [ "$STATUS" = "200" ]; then
  echo "✅ PASS: Database queries working"
else
  echo "❌ FAIL: Database issues - ROLLBACK!"
  exit 1
fi

echo "=== All Smoke Tests Passed ==="
```

### Continuous Monitoring (First 2 Hours)

**Metrics to Watch:**

```bash
# Run every 5 minutes for first 2 hours

# 1. Error rate (should be ≤1%)
curl -s "$PROMETHEUS_URL/api/v1/query?query=rate(http_requests_total{status=~\"5..\"}[5m])/rate(http_requests_total[5m])*100" | jq

# 2. 404 rate (unmigrated clients)
curl -s "$PROMETHEUS_URL/api/v1/query?query=rate(http_requests_total{status=\"404\",route=~\"/api/[^v].*\"}[5m])" | jq

# 3. Request volume (should be stable)
curl -s "$PROMETHEUS_URL/api/v1/query?query=rate(http_requests_total[5m])" | jq

# 4. P95 latency (should improve)
curl -s "$PROMETHEUS_URL/api/v1/query?query=histogram_quantile(0.95,rate(http_request_duration_ms_bucket[5m]))" | jq
```

**Alert Thresholds:**

- ❌ Error rate >3% → **ROLLBACK**
- ❌ Request volume drops >20% → **ROLLBACK**
- ⚠️ 404 rate >10% → Contact unmigrated clients
- ✅ All metrics normal → Continue monitoring

---

## Troubleshooting Common Issues

### Issue 1: Server Won't Start After Setting ENABLE_OLD_ROUTES=false

**Diagnosis:**

```bash
# Check server logs
kubectl logs deployment/api-server -n production --tail=100

# Look for:
# - Plugin loading errors
# - Configuration validation errors
# - Dependency injection failures
```

**Solution:**

- Verify environment variable is set correctly: `ENABLE_OLD_ROUTES=false` (not `ENABLE_OLD_ROUTES="false"` with quotes in some environments)
- Check config loading logic
- If issue persists: Rollback to `ENABLE_OLD_ROUTES=true`

### Issue 2: New Routes Return 404

**Diagnosis:**

```bash
# This indicates new routes were never registered (major issue)

# Check plugin loading:
kubectl logs deployment/api-server -n production | grep "layer"

# Expected output:
# Loading Core layer...
# Loading Platform layer...
# Loading Domains layer...
```

**Solution:**

- **ROLLBACK IMMEDIATELY** - this is a critical error
- Investigate plugin loading failure
- Verify layer-based plugins are registered correctly

### Issue 3: Some Old Routes Still Work (307 Redirect)

**Diagnosis:**

```bash
# This means route aliasing is still active

# Check environment variable
kubectl exec deployment/api-server -n production -- env | grep ENABLE_OLD_ROUTES

# Expected: ENABLE_OLD_ROUTES=false
# If different: Environment variable not applied correctly
```

**Solution:**

```bash
# Update environment variable and restart
kubectl set env deployment/api-server ENABLE_OLD_ROUTES=false -n production
kubectl rollout restart deployment/api-server -n production
```

---

## Success Metrics

### Immediate Success (10 Minutes)

| Metric           | Target | Actual   | Status |
| ---------------- | ------ | -------- | ------ |
| Error rate       | ≤1%    | \_\_\_ % | ☐      |
| Old routes (404) | 100%   | \_\_\_ % | ☐      |
| New routes (200) | >99%   | \_\_\_ % | ☐      |
| Auth failures    | 0      | \_\_\_   | ☐      |
| Database errors  | 0      | \_\_\_   | ☐      |

### Short-Term Success (2 Hours)

| Metric                  | Target        | Actual    | Status |
| ----------------------- | ------------- | --------- | ------ |
| Error rate              | ≤1%           | \_\_\_ %  | ☐      |
| Request volume          | ±10% baseline | \_\_\_ %  | ☐      |
| P95 latency improvement | -2 to -10ms   | \_\_\_ ms | ☐      |
| 404 rate (old routes)   | Declining     | \_\_\_ %  | ☐      |
| Support tickets         | 0 critical    | \_\_\_    | ☐      |

### Long-Term Success (7 Days)

| Metric                  | Target    | Actual   | Status |
| ----------------------- | --------- | -------- | ------ |
| 404 rate                | <1%       | \_\_\_ % | ☐      |
| Error rate              | ≤1%       | \_\_\_ % | ☐      |
| Performance improvement | Sustained | \_\_\_   | ☐      |
| Client migration        | >95%      | \_\_\_ % | ☐      |

---

## Reference

- **Cutover Guide:** `docs/architecture/api-standards/09-old-routes-cutover-guide.md`
- **Route Aliases Plugin:** `apps/api/src/config/route-aliases.ts`
- **Plugin Loader:** `apps/api/src/bootstrap/plugin.loader.ts`
- **Task 8.5:** Disable old routes after sunset period

---

**Document Version:** 1.0
**Created:** 2025-12-15
**Status:** Ready for use
