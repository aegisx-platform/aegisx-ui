# Start Work Session

เริ่ม work session ใหม่พร้อม token tracking

## Arguments

- $ARGUMENTS = session name และ tasks (เช่น "apt-1030 tasks 1.1,1.2" หรือ "apt-1030 spec appointment-booking")

## Instructions

1. Parse arguments:
   - Session name: ส่วนแรก (เช่น apt-1030)
   - Tasks: หลัง "tasks" หรือ task IDs จาก spec

2. สร้างไฟล์ `docs/sessions/.current/{SESSION_NAME}.log`:

```markdown
# Session Log: {SESSION_NAME}

# Date: {TODAY YYYY-MM-DD}

# Started: {TIME HH:MM}

# Model: {current model}

## Planned Tasks

- [ ] {task list}

## Tasks Completed

| Time | Task ID | Description | Tokens | Cost | Status |
| ---- | ------- | ----------- | ------ | ---- | ------ |

## Files Created/Modified

(จะ update ระหว่างทำงาน)

## Issues Encountered

(จะ update ถ้ามี)

## Session End: (pending)

## Total Tokens: 0

## Total Cost: $0.00
```

3. ถ้ามี spec name:
   - อ่าน tasks จาก `.spec-workflow/specs/{spec-name}/tasks.md`
   - แสดง tasks ที่ยังไม่เสร็จ

4. แจ้งว่า session พร้อมแล้ว พร้อมแสดง tasks ที่จะทำ

## Rules

- ห้าม update PROGRESS.md ระหว่างวัน (ทำตอน EOD)
- บันทึกทุก task ลง session log
- Track tokens ทุกครั้ง

## Cost Reference (Haiku)

| Tokens | Cost  |
| ------ | ----- |
| 50k    | $0.11 |
| 100k   | $0.22 |
| 200k   | $0.44 |
