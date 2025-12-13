# Log Task Completion

บันทึก task ที่เสร็จลง session log พร้อม token tracking

## Arguments

- $ARGUMENTS = task info (เช่น "1.1 done 45k" หรือ "APT-001 done 45000 tokens")

## Instructions

1. Parse arguments:
   - Task ID: ตัวแรก
   - Status: done/failed/partial
   - Tokens: ตัวเลข (รองรับ 45k = 45000)

2. คำนวณ cost:

   ```
   Haiku: cost = tokens * 0.0000022 ≈ tokens / 450000
   Sonnet: cost = tokens * 0.000012 ≈ tokens / 83000
   ```

3. Update session log (`docs/sessions/.current/*.log`):
   - เพิ่ม row ใน Tasks Completed table:
     ```
     | {TIME} | {TASK_ID} | {DESCRIPTION} | {TOKENS} | ${COST} | ✅ |
     ```
   - เพิ่ม files ใน Files Created/Modified
   - Update Total Tokens

4. ถ้า task มาจาก spec-workflow:
   - ใช้ `log-implementation` บันทึก artifacts
   - Update tasks.md: เปลี่ยน `[-]` เป็น `[x]`

5. แสดงสรุป:
   ```
   ✅ Task {ID} logged
   Tokens: {X} | Cost: ${Y}
   Session total: {Z} tokens (${W})
   ```

## Quick Format

```
/log-task 1.1 done 45k
/log-task APT-001 done 85000
/log-task 2.3 failed 30k - validation error
```
