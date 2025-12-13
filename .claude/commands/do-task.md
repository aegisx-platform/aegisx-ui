# Do Task from Spec

ทำ task จาก spec-workflow พร้อม token tracking

## Arguments

- $ARGUMENTS = spec name และ task ID (เช่น "appointment-booking 1.1")

## Instructions

1. Parse arguments:
   - Spec name: ส่วนแรก
   - Task ID: ส่วนที่สอง

2. อ่านไฟล์:
   - `.spec-workflow/specs/{spec-name}/tasks.md` - หา task
   - `.spec-workflow/specs/{spec-name}/design.md` - context
   - `.spec-workflow/specs/{spec-name}/Implementation Logs/` - ค้นหา existing code

3. **CRITICAL: ก่อน implement ต้องค้นหา Implementation Logs**

   ```bash
   grep -r "apiEndpoints\|components\|functions" .spec-workflow/specs/{spec-name}/Implementation\ Logs/
   ```

   เพื่อหา code ที่มีอยู่แล้ว ป้องกันการเขียนซ้ำ

4. Mark task in progress:
   - Edit tasks.md: เปลี่ยน `[ ]` เป็น `[-]`

5. Implement ตาม task description:
   - อ่าน `_Prompt` field ใน task
   - ทำตาม instructions

6. เมื่อเสร็จ:
   - ใช้ `log-implementation` บันทึก artifacts
   - Update session log ด้วย tokens
   - Edit tasks.md: เปลี่ยน `[-]` เป็น `[x]`

7. แสดงสรุป:
   ```
   ✅ Task {spec}/{task_id} completed
   Files: {list}
   Tokens: {X} | Cost: ${Y}
   ```

## Model Recommendation

- ใช้ **Haiku** สำหรับ tasks ทั่วไป (ถูกกว่า 12x)
- ใช้ **Sonnet** ถ้า task ซับซ้อนมาก

## Example

```
/do-task appointment-booking 1.1
/do-task patient-search 2.3
```
