# 🌐 DNS Setup Guide - Complete Subdomain List

## 📋 Quick Summary

คุณต้องเพิ่ม **11 DNS records** ใน Cloudflare ครับ

## 🎯 วิธีที่แนะนำ: CNAME to Cluster

### Step 1: สร้าง A Record สำหรับ cluster (1 record)

```
Type: A
Name: cluster
Value: 43.228.125.9
Proxy: ✅ Enabled (Orange cloud)
TTL: Auto
```

### Step 2: สร้าง CNAME Records (10 records)

#### Production (5 records)

| Type  | Name     | Target             | Proxy |
| ----- | -------- | ------------------ | ----- |
| CNAME | @ (root) | cluster.aegisx.dev | ✅    |
| CNAME | app      | cluster.aegisx.dev | ✅    |
| CNAME | api      | cluster.aegisx.dev | ✅    |
| CNAME | ui       | cluster.aegisx.dev | ✅    |
| CNAME | cli      | cluster.aegisx.dev | ✅    |

#### Staging (5 records)

| Type  | Name        | Target             | Proxy |
| ----- | ----------- | ------------------ | ----- |
| CNAME | staging     | cluster.aegisx.dev | ✅    |
| CNAME | staging-app | cluster.aegisx.dev | ✅    |
| CNAME | staging-api | cluster.aegisx.dev | ✅    |
| CNAME | staging-ui  | cluster.aegisx.dev | ✅    |
| CNAME | staging-cli | cluster.aegisx.dev | ✅    |

## 📊 Domain Mapping

### Production URLs

| Domain           | App     | Purpose           |
| ---------------- | ------- | ----------------- |
| `aegisx.dev`     | landing | Marketing website |
| `app.aegisx.dev` | web     | Main application  |
| `api.aegisx.dev` | api     | API endpoint      |
| `ui.aegisx.dev`  | admin   | Admin panel/docs  |
| `cli.aegisx.dev` | landing | CLI product page  |

### Staging URLs

| Domain                   | App     | Purpose           |
| ------------------------ | ------- | ----------------- |
| `staging.aegisx.dev`     | landing | Staging marketing |
| `staging-app.aegisx.dev` | web     | Staging app       |
| `staging-api.aegisx.dev` | api     | Staging API       |
| `staging-ui.aegisx.dev`  | admin   | Staging admin     |
| `staging-cli.aegisx.dev` | landing | Staging CLI page  |

## ✅ Checklist

### ใน Cloudflare Dashboard:

1. ไป DNS tab
2. เพิ่ม A record สำหรับ `cluster` → `43.228.125.9` (proxy enabled)
3. เพิ่ม CNAME records 10 ตัวตามตารางด้านบน (proxy enabled)
4. รอ DNS propagate (1-5 นาที)

### Verify DNS:

```bash
# Check ว่า DNS ทำงานแล้ว
dig aegisx.dev +short
dig app.aegisx.dev +short
dig api.aegisx.dev +short
dig ui.aegisx.dev +short
dig cli.aegisx.dev +short
dig staging.aegisx.dev +short
dig staging-app.aegisx.dev +short
dig staging-api.aegisx.dev +short
dig staging-ui.aegisx.dev +short
dig staging-cli.aegisx.dev +short

# ทุกตัวควรได้ Cloudflare IP (เพราะ proxied)
```

## 💡 ข้อดีของวิธีนี้

1. **เปลี่ยน server ครั้งเดียว** - แก้แค่ `cluster.aegisx.dev` ตัวอื่นตามอัตโนมัติ
2. **จัดการง่าย** - ไม่ต้องจำ IP ทุกตัว
3. **Migration ง่าย** - ย้าย cluster ใหม่แก้ที่เดียว

## 🚨 Important

- **ต้อง enable Proxy (orange cloud)** ทุก record เพื่อใช้ Cloudflare SSL
- **SSL/TLS Mode** ตั้งเป็น "Full" ใน SSL/TLS → Overview
- **Always Use HTTPS** ควรเปิดใน SSL/TLS → Edge Certificates

---

**Total DNS Records: 11**

- 1 A record (cluster)
- 10 CNAME records (5 production + 5 staging)
