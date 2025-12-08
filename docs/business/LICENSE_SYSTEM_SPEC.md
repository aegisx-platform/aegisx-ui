# AegisX CLI License System Specification

> Technical specification for the @aegisx/cli license validation system

**Version:** 1.0.0
**Status:** Phase 1 (Development)
**Last Updated:** 2025-12-03

---

## Table of Contents

1. [Overview](#overview)
2. [License Key Format](#license-key-format)
3. [License Tiers](#license-tiers)
4. [Validation Flow](#validation-flow)
5. [Storage & Retrieval](#storage--retrieval)
6. [CLI Commands](#cli-commands)
7. [Error Messages](#error-messages)
8. [Feature Gating](#feature-gating)
9. [Security Considerations](#security-considerations)
10. [Future Phases](#future-phases)

---

## Overview

### Business Model

```
┌─────────────────────────────────────────────────────────────┐
│                    AegisX Open Core Model                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   FREE (Open Source)          PAID (Commercial)             │
│   ┌─────────────────┐        ┌─────────────────┐           │
│   │  @aegisx/ui     │        │  @aegisx/cli    │           │
│   │  Angular UI Kit │        │  CRUD Generator │           │
│   │  MIT License    │        │  License Key    │           │
│   └─────────────────┘        └─────────────────┘           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                         User Machine                         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌─────────────┐     ┌─────────────────────────────────┐   │
│   │   aegisx    │────▶│     License Validator           │   │
│   │   CLI       │     │  lib/license/validator.js       │   │
│   └─────────────┘     └─────────────────────────────────┘   │
│                                    │                         │
│                                    ▼                         │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                License Sources                       │   │
│   │  1. Environment: AEGISX_LICENSE_KEY                 │   │
│   │  2. File: ~/.aegisx-license                         │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## License Key Format

### Structure

```
AEGISX-[TIER]-[SERIAL]-[CHECKSUM]
```

| Segment  | Length    | Description                        | Example                       |
| -------- | --------- | ---------------------------------- | ----------------------------- |
| Prefix   | 6 chars   | Always "AEGISX"                    | `AEGISX`                      |
| Tier     | 3-5 chars | License tier code                  | `PRO`, `TEAM`, `ENT`, `TRIAL` |
| Serial   | 8 chars   | Alphanumeric serial                | `A7X9K2M4`                    |
| Checksum | 2 chars   | MD5 hash of serial (first 2 chars) | `5C`                          |

### Examples

| Tier         | Example Key                | Description         |
| ------------ | -------------------------- | ------------------- |
| Professional | `AEGISX-PRO-A7X9K2M4-5C`   | Single developer    |
| Team         | `AEGISX-TEAM-B8Y0L3N5-9D`  | Up to 10 developers |
| Enterprise   | `AEGISX-ENT-C9Z1M4P6-3E`   | Unlimited           |
| Trial        | `AEGISX-TRIAL-D0A2N5Q7-7F` | 14-day trial        |

### Checksum Algorithm (Phase 1)

```javascript
const crypto = require('crypto');

function calculateChecksum(serial) {
  const hash = crypto.createHash('md5').update(serial).digest('hex');
  return hash.substring(0, 2).toUpperCase();
}

// Example:
// serial = "A7X9K2M4"
// MD5("A7X9K2M4") = "5c8e..."
// checksum = "5C"
```

---

## License Tiers

### Tier Definitions

```javascript
const TIERS = {
  PRO: {
    name: 'Professional',
    developers: 1,
    features: ['generate', 'shell', 'templates', 'config'],
    price: '$49 one-time',
    updates: '1 year',
  },
  TEAM: {
    name: 'Team',
    developers: 10,
    features: ['generate', 'shell', 'templates', 'config', 'priority-support'],
    price: '$199/year',
    updates: 'Continuous',
  },
  ENT: {
    name: 'Enterprise',
    developers: -1, // unlimited
    features: ['generate', 'shell', 'templates', 'config', 'priority-support', 'custom-templates'],
    price: 'Contact sales',
    updates: 'Continuous + SLA',
  },
  TRIAL: {
    name: 'Trial',
    developers: 1,
    features: ['generate', 'shell'], // limited features
    expiresInDays: 14,
    price: 'Free',
  },
};
```

### Feature Matrix

| Feature                 | Trial        | Pro       | Team       | Enterprise |
| ----------------------- | ------------ | --------- | ---------- | ---------- |
| `generate` (backend)    | ✅           | ✅        | ✅         | ✅         |
| `generate` (frontend)   | ✅           | ✅        | ✅         | ✅         |
| `shell` (interactive)   | ✅           | ✅        | ✅         | ✅         |
| `templates` (customize) | ❌           | ✅        | ✅         | ✅         |
| `config` (settings)     | ❌           | ✅        | ✅         | ✅         |
| `priority-support`      | ❌           | ❌        | ✅         | ✅         |
| `custom-templates`      | ❌           | ❌        | ❌         | ✅         |
| **Duration**            | 14 days      | Perpetual | 1 year     | Custom     |
| **Updates**             | During trial | 1 year    | Continuous | SLA        |

---

## Validation Flow

### Generate Command Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    aegisx generate products                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      validateLicense()                          │
│  1. Read key from ENV or file                                   │
│  2. Parse key format                                            │
│  3. Validate checksum                                           │
│  4. Check tier existence                                        │
│  5. Check trial expiration (if TRIAL)                          │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
        ┌──────────┐                    ┌──────────┐
        │  VALID   │                    │ INVALID  │
        └──────────┘                    └──────────┘
              │                               │
              ▼                               ▼
┌─────────────────────────┐    ┌─────────────────────────────────┐
│   checkFeature()        │    │  Display Error                  │
│   Is 'generate' allowed │    │  - No license found             │
│   for this tier?        │    │  - Invalid format               │
└─────────────────────────┘    │  - Trial expired                │
              │                 │  - Feature not available        │
              ▼                 │                                 │
        ┌──────────┐           │  Show activation options:       │
        │ ALLOWED  │           │  aegisx activate <key>          │
        └──────────┘           │  aegisx trial                   │
              │                 └─────────────────────────────────┘
              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Proceed with generation                      │
└─────────────────────────────────────────────────────────────────┘
```

### Validation Functions

```javascript
// Main validation entry point
async function validateLicense() {
  const key = readStoredLicense();

  if (!key) {
    return {
      valid: false,
      error: 'No license key found',
      message: 'Please activate your license with: aegisx activate <key>',
    };
  }

  const info = getLicenseInfo(key);

  if (!info.valid) {
    return info;
  }

  // Check trial expiration
  if (info.tier === 'TRIAL' && info.expiresAt) {
    if (new Date(info.expiresAt) < new Date()) {
      return {
        valid: false,
        error: 'Trial license expired',
        message: 'Please purchase a license at https://aegisx.dev',
      };
    }
  }

  return info;
}

// Feature check
async function checkFeature(featureName) {
  const license = await validateLicense();

  if (!license.valid) {
    return { allowed: false, ...license };
  }

  if (license.features.includes(featureName)) {
    return { allowed: true, license };
  }

  return {
    allowed: false,
    error: `Feature '${featureName}' not available in ${license.tierName} license`,
    message: 'Upgrade to Team or Enterprise for this feature',
  };
}
```

---

## Storage & Retrieval

### Priority Order

```
1. Environment Variable: AEGISX_LICENSE_KEY (highest priority)
2. License File: ~/.aegisx-license
```

### File Format

```
~/.aegisx-license
```

Contents (plain text):

```
AEGISX-PRO-A7X9K2M4-5C
```

### Storage Functions

```javascript
const LICENSE_FILE = path.join(os.homedir(), '.aegisx-license');
const LICENSE_ENV = 'AEGISX_LICENSE_KEY';

function readStoredLicense() {
  // 1. Check environment variable first
  if (process.env[LICENSE_ENV]) {
    return process.env[LICENSE_ENV];
  }

  // 2. Check license file
  try {
    if (fs.existsSync(LICENSE_FILE)) {
      return fs.readFileSync(LICENSE_FILE, 'utf8').trim();
    }
  } catch (error) {
    // Ignore read errors
  }

  return null;
}

function storeLicense(key) {
  try {
    fs.writeFileSync(LICENSE_FILE, key.trim(), 'utf8');
    return true;
  } catch (error) {
    return false;
  }
}

function removeLicense() {
  try {
    if (fs.existsSync(LICENSE_FILE)) {
      fs.unlinkSync(LICENSE_FILE);
    }
    return true;
  } catch (error) {
    return false;
  }
}
```

---

## CLI Commands

### License Management Commands

| Command                 | Description         | Example                                  |
| ----------------------- | ------------------- | ---------------------------------------- |
| `aegisx activate <key>` | Activate license    | `aegisx activate AEGISX-PRO-A7X9K2M4-5C` |
| `aegisx trial`          | Start 14-day trial  | `aegisx trial`                           |
| `aegisx license`        | Show license status | `aegisx license`                         |
| `aegisx deactivate`     | Remove license      | `aegisx deactivate`                      |

### Command Outputs

#### aegisx activate

```bash
$ aegisx activate AEGISX-PRO-A7X9K2M4-5C

✅ License activated successfully!
   Tier: Professional
   Developers: 1
   Features: generate, shell, templates, config
```

#### aegisx trial

```bash
$ aegisx trial

🎉 Trial Started!
   14-day trial activated
   Available features: generate, shell

   Purchase at: https://aegisx.dev
```

#### aegisx license

```bash
$ aegisx license

🔐 License Status: Active
   Tier: Professional
   Developers: 1
   Features: generate, shell, templates, config
```

#### aegisx deactivate

```bash
$ aegisx deactivate

✅ License removed successfully
```

---

## Error Messages

### Error Types

| Error Code            | Message                      | Cause                        | Solution                                  |
| --------------------- | ---------------------------- | ---------------------------- | ----------------------------------------- |
| `NO_LICENSE`          | No license key found         | No key in ENV or file        | `aegisx activate <key>` or `aegisx trial` |
| `INVALID_FORMAT`      | Invalid license key format   | Key doesn't match pattern    | Check key format                          |
| `INVALID_CHECKSUM`    | Invalid license key checksum | Checksum mismatch            | Verify key is correct                     |
| `INVALID_TIER`        | Unknown license tier         | Tier code not recognized     | Contact support                           |
| `TRIAL_EXPIRED`       | Trial license expired        | 14 days passed               | Purchase license                          |
| `FEATURE_UNAVAILABLE` | Feature not available        | Tier doesn't include feature | Upgrade tier                              |

### Error Display Format

```bash
$ aegisx generate products

❌ License validation failed

   Error: No license key found

   To continue, please:
   • Activate license:  aegisx activate <key>
   • Start free trial:  aegisx trial
   • Purchase at:       https://aegisx.dev
```

---

## Feature Gating

### Protected Commands

| Command           | Required Feature | Tiers                 |
| ----------------- | ---------------- | --------------------- |
| `aegisx generate` | `generate`       | All                   |
| `aegisx shell`    | `shell`          | All                   |
| `aegisx config`   | `config`         | Pro, Team, Enterprise |

### Implementation

```javascript
// In generate command
.action(async (tableName, options) => {
  // Step 1: Validate license
  const license = await validateLicense();
  if (!license.valid) {
    console.log(chalk.red('❌ License validation failed'));
    console.log(chalk.yellow(`   ${license.error}`));
    process.exit(1);
  }

  // Step 2: Check feature availability
  const featureCheck = await checkFeature('generate');
  if (!featureCheck.allowed) {
    console.log(chalk.red(`❌ ${featureCheck.error}`));
    console.log(chalk.yellow(`   ${featureCheck.message}`));
    process.exit(1);
  }

  // Step 3: Proceed with generation
  // ...
});
```

---

## Security Considerations

### Current Phase (Development)

| Aspect         | Implementation  | Security Level       |
| -------------- | --------------- | -------------------- |
| Key Generation | MD5 checksum    | ⚠️ Low (predictable) |
| Key Storage    | Plain text file | ⚠️ Low               |
| Validation     | Local only      | ⚠️ Bypassable        |
| Anti-tampering | None            | ⚠️ Vulnerable        |

### Known Vulnerabilities (Phase 1)

1. **Key Generation**: Anyone can generate valid keys using the checksum algorithm
2. **No Server Verification**: Keys are validated locally only
3. **No Machine Binding**: Same key works on any machine
4. **Plain Text Storage**: License file is readable

### Acceptable for Development Phase Because:

- Product is in beta/development
- Building customer base first
- Full security will be added before production launch
- Honest customers will pay anyway

---

## Future Phases

### Phase 2: RSA Signed Keys (Pre-Launch)

```
Current:  AEGISX-PRO-A7X9K2M4-5C
Future:   AEGISX-PRO-A7X9K2M4-[RSA_SIGNATURE]

- Server signs keys with private key
- CLI validates with embedded public key
- Cannot forge without private key
```

### Phase 3: Online Validation (Scale)

```
┌─────────┐     ┌──────────────────┐     ┌─────────────┐
│   CLI   │────▶│  License Server  │────▶│  Database   │
└─────────┘     └──────────────────┘     └─────────────┘

Features:
- Real-time validation
- Usage analytics
- Remote deactivation
- Machine binding
- Subscription management
```

### Phase 3 Features

| Feature                 | Description                     |
| ----------------------- | ------------------------------- |
| Machine Binding         | License tied to hardware ID     |
| Usage Tracking          | Monitor generations per license |
| Remote Deactivation     | Disable stolen keys             |
| Subscription Management | Auto-renewal, cancellation      |
| Team Management         | Add/remove developers           |

---

## Implementation Checklist

### Phase 1 (Current) ✅

- [x] License key format design
- [x] Checksum validation
- [x] License file storage
- [x] Environment variable support
- [x] CLI commands (activate, trial, license, deactivate)
- [x] Feature gating
- [x] Error messages
- [x] Documentation

### Phase 2 (Pre-Launch) 📝

- [ ] RSA key pair generation
- [ ] Signed key format
- [ ] Public key embedding
- [ ] Signature validation
- [ ] Key generation tool (admin)

### Phase 3 (Scale) 📝

- [ ] License server API
- [ ] Database schema
- [ ] Machine fingerprinting
- [ ] Online validation
- [ ] Admin dashboard
- [ ] Usage analytics

---

## Appendix

### Test Keys (Development Only)

```bash
# Professional
AEGISX-PRO-TESTKEY1-XX

# Team
AEGISX-TEAM-TESTKEY2-XX

# Trial (auto-generated)
aegisx trial
```

### Environment Setup

```bash
# Set license via environment (CI/CD)
export AEGISX_LICENSE_KEY="AEGISX-PRO-A7X9K2M4-5C"

# Or via file
echo "AEGISX-PRO-A7X9K2M4-5C" > ~/.aegisx-license
```

---

**Document Version:** 1.0.0
**Created:** 2025-12-03
**Author:** AegisX Team
