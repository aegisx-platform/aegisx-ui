# Spec + Session Workflow Guide

> ระบบ Spec-Driven Development พร้อม Token Cost Tracking

## Overview

ระบบนี้รวม 2 workflows เข้าด้วยกัน:

| Workflow             | หน้าที่                                        | เมื่อไหร่       |
| -------------------- | ---------------------------------------------- | --------------- |
| **Spec Workflow**    | วางแผน feature (Requirements → Design → Tasks) | ก่อนเริ่มทำ     |
| **Session Workflow** | Track งาน + tokens + cost                      | ระหว่างทำ + EOD |

```
┌─────────────────────────────────────────────────────────────────┐
│                    SPEC WORKFLOW (Planning)                      │
│                                                                  │
│  "สร้าง spec สำหรับ user-auth"                                   │
│       ↓                                                          │
│  Requirements → Design → Tasks (approve ใน Dashboard)           │
│       ↓                                                          │
│  .spec-workflow/specs/user-auth/tasks.md                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                SESSION WORKFLOW (Execution + Tracking)           │
│                                                                  │
│  /start-session auth-1030 spec user-auth                        │
│       ↓                                                          │
│  /do-task user-auth 1.1  →  45k tokens  →  log-implementation   │
│  /do-task user-auth 1.2  →  32k tokens  →  log-implementation   │
│       ↓                                                          │
│  /eod  →  Daily Summary  →  Total: 77k tokens ($0.17)           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
project/
├── .spec-workflow/                 # Spec Workflow (MCP)
│   ├── specs/
│   │   └── {spec-name}/
│   │       ├── requirements.md     # ความต้องการ
│   │       ├── design.md           # การออกแบบ
│   │       ├── tasks.md            # รายการ tasks
│   │       └── Implementation Logs/ # Knowledge base
│   └── templates/
│
├── .claude/commands/               # Slash Commands
│   ├── start-session.md
│   ├── log-task.md
│   ├── do-task.md
│   ├── session-status.md
│   ├── cost.md
│   └── eod.md
│
└── docs/
    ├── sessions/
    │   ├── .current/               # Active session logs
    │   ├── daily/                  # Daily summaries
    │   └── archive/                # Archived logs
    └── PROGRESS.md                 # Overall tracking
```

---

## Daily Workflow

### 🌅 Morning: Planning (ถ้าต้องการ feature ใหม่)

```bash
# ใช้ Sonnet สำหรับ planning (คิดเยอะ)
claude

> "สร้าง spec สำหรับ appointment-booking"
```

**Flow:**

1. Claude สร้าง `requirements.md` → **กด Approve ใน Dashboard**
2. Claude สร้าง `design.md` → **กด Approve ใน Dashboard**
3. Claude สร้าง `tasks.md` → **กด Approve ใน Dashboard**
4. พร้อม implement!

**Dashboard:** http://localhost:5000

---

### 🔨 Daytime: Execution

```bash
# ใช้ Haiku สำหรับ execution (ถูกกว่า 12x)
claude --model haiku

# 1. เริ่ม session
> /start-session apt-1030 spec appointment-booking

# 2. ทำ task
> /do-task appointment-booking 1.1

# 3. ดูสถานะ
> /session-status

# 4. ดู cost
> /cost
```

---

### 🌆 Evening: EOD Summary

```bash
claude --model haiku

> /eod
```

**Output:**

- สร้าง `docs/sessions/daily/YYYY-MM-DD.md`
- Update `docs/PROGRESS.md`
- Archive session logs
- แสดง total cost

---

## Commands Reference

### Session Management

| Command           | Description        | Example                                            |
| ----------------- | ------------------ | -------------------------------------------------- |
| `/start-session`  | เริ่ม session ใหม่ | `/start-session apt-1030 spec appointment-booking` |
| `/session-status` | ดูสถานะ sessions   | `/session-status`                                  |
| `/eod`            | สรุปสิ้นวัน        | `/eod`                                             |

### Task Management

| Command     | Description          | Example                            |
| ----------- | -------------------- | ---------------------------------- |
| `/do-task`  | ทำ task จาก spec     | `/do-task appointment-booking 1.1` |
| `/log-task` | บันทึก task (manual) | `/log-task 1.1 done 45k`           |

### Cost Tracking

| Command    | Description               | Example    |
| ---------- | ------------------------- | ---------- |
| `/cost`    | ดู cost summary           | `/cost`    |
| `/context` | ดู token usage (built-in) | `/context` |

---

## Spec Workflow Tools (MCP)

| Tool                  | Description                  |
| --------------------- | ---------------------------- |
| `spec-workflow-guide` | ดูคู่มือ workflow            |
| `spec-status`         | ดูความคืบหน้า specs          |
| `approvals`           | จัดการ approval              |
| `log-implementation`  | บันทึก artifacts หลังทำ task |

---

## Model Selection

| งาน                | Model      | เหตุผล               | Cost/100k |
| ------------------ | ---------- | -------------------- | --------- |
| สร้าง spec ใหม่    | **Sonnet** | ต้องคิด design       | $1.20     |
| Implement ตาม spec | **Haiku**  | มี spec แล้ว         | $0.22     |
| Bug fix ง่ายๆ      | **Haiku**  | ไม่ซับซ้อน           | $0.22     |
| Refactor ใหญ่      | **Sonnet** | ต้องคิด architecture | $1.20     |
| EOD Summary        | **Haiku**  | งาน routine          | $0.22     |

**Haiku ถูกกว่า Sonnet ~12 เท่า**

---

## Cost Reference

### Haiku Pricing

```
Input:  $0.25 / 1M tokens
Output: $1.25 / 1M tokens
Average: ~$0.0000022 per token
```

### Quick Reference

| Tokens | Haiku | Sonnet | Opus   |
| ------ | ----- | ------ | ------ |
| 30k    | $0.07 | $0.36  | $1.80  |
| 50k    | $0.11 | $0.60  | $3.00  |
| 100k   | $0.22 | $1.20  | $6.00  |
| 200k   | $0.44 | $2.40  | $12.00 |

### Daily Budget

- แนะนำ: **$2-5/วัน** (~70-175 บาท)
- Weekly: $10-25
- Monthly: $40-100

---

## Task Status Markers

ใน `tasks.md`:

| Marker  | Status      | Meaning     |
| ------- | ----------- | ----------- |
| `- [ ]` | Pending     | ยังไม่เริ่ม |
| `- [-]` | In Progress | กำลังทำ     |
| `- [x]` | Completed   | เสร็จแล้ว   |

---

## Parallel Sessions

### ✅ Safe - คนละ Module

```bash
# Terminal 1
claude --model haiku
> /start-session apt-1030 spec appointment-booking

# Terminal 2 (parallel)
claude --model haiku
> /start-session pat-1030 spec patient-search
```

### 🚫 Avoid - Module เดียวกัน

```bash
# ❌ ทั้งสองทำ appointments พร้อมกัน = conflict risk
Terminal 1: appointment-booking task 1.1
Terminal 2: appointment-booking task 1.2
```

### Checklist ก่อนเปิด Parallel

- [ ] Tasks อยู่คนละ module?
- [ ] ไม่มี shared service files?
- [ ] ไม่มี migration dependencies?
- [ ] แต่ละ session มี log แยก?

---

## Recovery (เริ่มวันใหม่)

```bash
claude --model haiku

# ดู summary วันก่อน
> "อ่าน docs/sessions/daily/ ล่าสุด"

# หรือดู spec status
> spec-status

# เริ่มทำงานต่อ
> /start-session apt-0930 spec appointment-booking
```

---

## Knowledge System

**ใช้ Implementation Logs ของ spec-workflow:**

```
.spec-workflow/specs/{spec-name}/Implementation Logs/
├── task-1.1_timestamp.md    # บันทึก APIs, components, functions
├── task-1.2_timestamp.md
└── ...
```

**ค้นหา knowledge:**

```bash
grep -r "apiEndpoints" .spec-workflow/specs/*/Implementation\ Logs/
grep -r "components" .spec-workflow/specs/*/Implementation\ Logs/
```

---

## Example: Full Day

```bash
# ═══════════════════════════════════════════════════════════════
# 🌅 09:00 - Planning (Sonnet)
# ═══════════════════════════════════════════════════════════════
claude
> "สร้าง spec สำหรับ invoice-management"
# [Approve Requirements ใน Dashboard]
# [Approve Design ใน Dashboard]
# [Approve Tasks ใน Dashboard]

# ═══════════════════════════════════════════════════════════════
# 🔨 10:00 - Execution (Haiku)
# ═══════════════════════════════════════════════════════════════
claude --model haiku

> /start-session inv-1000 spec invoice-management
# Session inv-1000 created
# Tasks: 1.1, 1.2, 1.3, 1.4, 1.5

> /do-task invoice-management 1.1
# ✅ Task 1.1 completed (42k tokens, $0.09)

> /do-task invoice-management 1.2
# ✅ Task 1.2 completed (38k tokens, $0.08)

> /session-status
# Session: inv-1000
# Tasks: 2/5 done
# Tokens: 80k
# Cost: $0.17

# ═══════════════════════════════════════════════════════════════
# 🍜 12:00 - Lunch Break
# ═══════════════════════════════════════════════════════════════

# ═══════════════════════════════════════════════════════════════
# 🔨 13:00 - Continue (Haiku)
# ═══════════════════════════════════════════════════════════════
claude --model haiku

> /start-session inv-1300 spec invoice-management
# Continue from task 1.3

> /do-task invoice-management 1.3
> /do-task invoice-management 1.4
> /do-task invoice-management 1.5

> /cost
# Today's total: 195k tokens, $0.43

# ═══════════════════════════════════════════════════════════════
# 🌆 17:00 - EOD (Haiku)
# ═══════════════════════════════════════════════════════════════
> /eod
# 📊 EOD Summary: 2025-01-13
# ├── Sessions: 2
# ├── Tasks: 5
# ├── Tokens: 195,000
# └── Cost: $0.43
# ✅ Daily summary created
# ✅ Session logs archived
```

---

## Troubleshooting

### Dashboard ไม่ขึ้น

```bash
# เปิด dashboard แยก
npx -y @pimzino/spec-workflow-mcp@latest --dashboard
# เข้า http://localhost:5000
```

### Approval ค้าง

```bash
# ใช้ MCP tool ตรวจสอบ
> approvals action:status
```

### Session log หาย

```bash
# ดูใน archive
ls docs/sessions/archive/
```

### ลืม log tokens

```bash
# Manual log
> /log-task 1.1 done 45k
```

---

## Files Reference

| File                                          | Purpose                  |
| --------------------------------------------- | ------------------------ |
| `docs/PROGRESS.md`                            | Overall project progress |
| `docs/sessions/.current/*.log`                | Active session logs      |
| `docs/sessions/daily/*.md`                    | Daily summaries          |
| `.spec-workflow/specs/*/tasks.md`             | Task lists per spec      |
| `.spec-workflow/specs/*/Implementation Logs/` | Knowledge base           |

---

## Quick Start Checklist

- [ ] Spec workflow dashboard running (`http://localhost:5000`)
- [ ] Understand model selection (Sonnet=planning, Haiku=execution)
- [ ] Know the commands (`/start-session`, `/do-task`, `/eod`)
- [ ] Check `docs/PROGRESS.md` for current state
- [ ] Run `/eod` before ending the day
