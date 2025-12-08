# AegisX CLI - License System Roadmap

> แผนพัฒนาระบบ License สำหรับ @aegisx/cli

---

## Current Status: Phase 1 (Development)

**ระบบปัจจุบัน: Offline MD5 Checksum**

```
License Format: AEGISX-[TIER]-[SERIAL]-[CHECKSUM]
Example: AEGISX-PRO-A7X9K2M4-5C
```

### How It Works Now

1. Serial = 8 random characters (A-Z, 0-9)
2. Checksum = MD5(serial).substring(0,2).toUpperCase()
3. Validation = offline, no server required

### Limitations (Known Issues)

- Anyone who knows the algorithm can generate valid keys
- No machine binding (same key works everywhere)
- No revocation capability
- Cannot track usage or prevent sharing

**Status**: OK for development/beta testing, NOT for production sale

---

## Phase 2: Signed License Keys (Recommended for Launch)

**เป้าหมาย**: ป้องกันการ generate key เอง โดยไม่ต้องมี server online ตลอด

### Architecture

```
┌─────────────────┐         ┌──────────────────┐
│  Admin Tool     │         │  AegisX CLI      │
│  (Your Machine) │         │  (User Machine)  │
├─────────────────┤         ├──────────────────┤
│ Private Key     │──sign──>│ Public Key       │
│ Generate Keys   │         │ Verify Only      │
└─────────────────┘         └──────────────────┘
```

### New License Format

```
AEGISX-PRO-A7X9K2M4.eyJzZXJpYWwiOiJBN1g5SzJNNCIsInRpZXIiOiJQUk8ifQ==.MEUCIQDx...
       │      │              │                                      │
     Tier   Serial        Base64 Payload                      RSA Signature
```

### Implementation

**1. Generate RSA Key Pair (One Time)**

```bash
# Generate private key (KEEP SECRET!)
openssl genrsa -out private.pem 2048

# Extract public key (embed in CLI)
openssl rsa -in private.pem -pubout -out public.pem
```

**2. Admin Tool - Generate License**

```javascript
// tools/generate-license.js (NOT published)
const crypto = require('crypto');
const privateKey = fs.readFileSync('./private.pem');

function generateSignedLicense(tier, email, expiresAt) {
  const payload = {
    tier,
    email,
    serial: generateSerial(),
    issuedAt: new Date().toISOString(),
    expiresAt,
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64');

  const sign = crypto.createSign('SHA256');
  sign.update(payloadBase64);
  const signature = sign.sign(privateKey, 'base64');

  return `AEGISX-${tier}-${payload.serial}.${payloadBase64}.${signature}`;
}
```

**3. CLI - Verify License**

```javascript
// lib/license/validator.js (published in CLI)
const crypto = require('crypto');

// Public key embedded in CLI (safe to distribute)
const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...
-----END PUBLIC KEY-----`;

function verifySignedLicense(key) {
  const parts = key.split('.');
  if (parts.length !== 3) return { valid: false };

  const [header, payloadBase64, signature] = parts;

  // Verify signature with public key
  const verify = crypto.createVerify('SHA256');
  verify.update(payloadBase64);

  if (!verify.verify(PUBLIC_KEY, signature, 'base64')) {
    return { valid: false, error: 'Invalid signature' };
  }

  // Decode payload
  const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString());

  // Check expiration
  if (payload.expiresAt && new Date(payload.expiresAt) < new Date()) {
    return { valid: false, error: 'License expired' };
  }

  return { valid: true, ...payload };
}
```

### Benefits

- ✅ Cannot generate keys without private key
- ✅ Works offline
- ✅ Can include expiration date
- ✅ Can include customer email for tracking
- ✅ No server infrastructure needed

### Limitations

- ❌ Cannot revoke issued keys
- ❌ Cannot limit to specific machines
- ❌ Keys can still be shared

---

## Phase 3: Online Validation + Machine Binding (Full Protection)

**เป้าหมาย**: ป้องกัน key sharing และสามารถ revoke ได้

### Architecture

```
┌──────────────┐     ┌─────────────────┐     ┌──────────────┐
│  Gumroad     │────>│  License API    │<────│  AegisX CLI  │
│  (Purchase)  │     │  (api.aegisx.dev)│     │  (Validate)  │
└──────────────┘     └─────────────────┘     └──────────────┘
                            │
                     ┌──────┴──────┐
                     │  Database   │
                     │  (Licenses) │
                     └─────────────┘
```

### API Endpoints

```
POST /api/license/activate
  - Input: { key, machineId, machineInfo }
  - Output: { success, license, token }
  - Limit: 3 machines per PRO, 10 per TEAM, unlimited ENT

POST /api/license/validate
  - Input: { key, machineId }
  - Output: { valid, license, features }
  - Cache: 24 hours (work offline for a day)

POST /api/license/deactivate
  - Input: { key, machineId }
  - Output: { success }

POST /api/license/revoke (Admin)
  - Input: { key }
  - Output: { success }
```

### Machine ID Generation

```javascript
const { machineIdSync } = require('node-machine-id');
const os = require('os');

function getMachineFingerprint() {
  return {
    machineId: machineIdSync(true),
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
  };
}
```

### Offline Caching

```javascript
// Cache valid license for 24 hours
const CACHE_FILE = path.join(os.homedir(), '.aegisx-license-cache');

function cacheValidation(license) {
  const cache = {
    license,
    validatedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache));
}

function checkCache() {
  if (!fs.existsSync(CACHE_FILE)) return null;

  const cache = JSON.parse(fs.readFileSync(CACHE_FILE));
  if (new Date(cache.expiresAt) < new Date()) return null;

  return cache.license;
}
```

### Benefits

- ✅ Full revocation capability
- ✅ Machine binding (limit activations)
- ✅ Usage tracking and analytics
- ✅ Prevent key sharing
- ✅ Still works offline (24h cache)

### Infrastructure Needed

- License API server (Cloudflare Workers recommended)
- Database (Cloudflare D1 or PostgreSQL)
- Webhook from Gumroad for auto license creation

---

## Migration Path

### From Phase 1 to Phase 2

1. Generate RSA key pair
2. Update validator.js to check signature
3. Existing MD5 keys: Add grace period or migrate

### From Phase 2 to Phase 3

1. Deploy License API
2. Update CLI to call API
3. Add machine ID support
4. Existing signed keys: Continue to work offline

---

## Recommended Timeline

| Phase   | When                | Effort   | Notes                          |
| ------- | ------------------- | -------- | ------------------------------ |
| Phase 1 | Now                 | Done     | OK for beta/dev                |
| Phase 2 | Before public sale  | 1-2 days | Recommended minimum for launch |
| Phase 3 | After 50+ customers | 1 week   | When piracy becomes concern    |

---

## Tools to Create

### For Phase 2

```
tools/
├── generate-keypair.js     # One-time RSA key generation
├── generate-license.js     # Create signed license for customer
└── verify-license.js       # Test license validation
```

### For Phase 3

```
api.aegisx.dev/
├── /license/activate       # Activate on machine
├── /license/validate       # Check license
├── /license/deactivate     # Release machine slot
└── /admin/licenses         # Admin dashboard
```

---

## Notes

**ทำไมไม่ทำ Phase 3 เลย?**

1. **Complexity**: ต้องมี server, database, uptime
2. **Cost**: Server + domain + SSL
3. **Time**: ใช้เวลาพัฒนานาน
4. **Overkill**: ถ้ายังไม่มีลูกค้าเยอะ piracy ไม่ใช่ปัญหา

**แนะนำ**: เริ่มด้วย Phase 2 (Signed Keys) ตอน launch ถ้ามีคนซื้อเยอะแล้วค่อยทำ Phase 3

---

**Document Version**: 1.0.0
**Created**: 2025-12-03
**Status**: Planning
