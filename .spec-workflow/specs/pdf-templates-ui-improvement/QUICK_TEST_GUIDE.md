# PDF Templates UI - Quick Testing Guide

**ทดสอบด่วน 15 นาที** ✅

---

## 🚀 Setup (1 นาที)

1. **เปิด Browser**: Chrome/Edge (แนะนำ)
2. **เข้า App**: http://localhost:4249
3. **Login**: ด้วย account ที่มีสิทธิ์ดู PDF Templates
4. **เปิด DevTools**: กด F12 (ดู Console errors)
5. **Navigate**: ไปหน้า PDF Templates

---

## ✅ Core Features (5 นาที)

### 1. หน้าโหลดได้ (30 วินาที)

- [ ] หน้าโหลดไม่มี error ใน console
- [ ] Loading spinner แสดง (ถ้ามี)
- [ ] KPI cards แสดงตัวเลข 4 cards
- [ ] Template cards แสดงใน grid

### 2. View Mode Toggle (30 วินาที)

- [ ] มีปุ่ม Grid/Table view
- [ ] Grid view เป็น default
- [ ] กดสลับเป็น Table view ได้
- [ ] กดกลับเป็น Grid view ได้

### 3. Template Cards (1 นาที)

ใน **Grid View**:

- [ ] แต่ละ card แสดง:
  - Checkbox
  - ชื่อ template
  - File code
  - Status badge (Active/Inactive)
  - Menu icon (⋮)
- [ ] Hover card มี effect
- [ ] Click card เปิด preview dialog

### 4. KPI Cards Filtering (1 นาที)

- [ ] Click "Total Templates" → แสดงทั้งหมด
- [ ] Click "Active Templates" → filter เฉพาะ Active
- [ ] Click "Starter Templates" → filter เฉพาะ Starters
- [ ] Click "Inactive" → filter เฉพาะ Inactive

### 5. Bulk Selection (1 นาที)

- [ ] เลือก checkbox ของ card ได้
- [ ] Bulk action bar ขึ้นเมื่อเลือก
- [ ] แสดง "X selected"
- [ ] ปุ่ม Delete แสดง
- [ ] Click Delete → confirmation dialog ขึ้น

### 6. Actions Menu (1 นาที)

Click menu (⋮) ของ template card:

- [ ] เมนูขึ้น: Preview, Edit, Duplicate, Delete
- [ ] Delete แสดงเป็นสีแดง
- [ ] Click แต่ละ menu item เปิด dialog ถูกต้อง

---

## 🌓 Dark Mode (3 นาที)

### 1. เปิด Dark Mode

**macOS**: System Preferences → Appearance → Dark
**Windows**: Settings → Personalization → Colors → Dark
**Browser**: DevTools → Rendering → Emulate dark mode

### 2. ตรวจสอบ (2 นาที)

- [ ] Background เป็นสีเข้ม
- [ ] Text อ่านได้ชัดเจน (contrast ดี)
- [ ] Cards พื้นหลังเข้ม
- [ ] Borders มองเห็นได้
- [ ] KPI cards สีเข้ม
- [ ] Badges สีชัดเจน
- [ ] Hover states เห็นชัด

### 3. Permission Error Banner (ถ้ามี)

- [ ] Error banner สีแดง มองเห็นชัด
- [ ] Text อ่านได้ใน dark mode

---

## 📱 Responsive (3 นาที)

### Desktop (30 วินาที)

- [ ] Grid: 3-4 columns
- [ ] ทุกอย่างแสดงครบ

### Tablet (1 นาที)

**Resize browser** → 768px width:

- [ ] Grid: 2 columns
- [ ] Buttons ยังคลิกได้
- [ ] ไม่มี horizontal scroll

### Mobile (1.5 นาที)

**Resize browser** → 375px width:

- [ ] Grid: 1 column (stacked)
- [ ] Cards full width
- [ ] Empty state buttons stack vertically
- [ ] Text อ่านได้ไม่ต้อง zoom
- [ ] ไม่มี horizontal scroll
- [ ] Touch targets ใหญ่พอ (ปุ่ม)

---

## 🎨 Empty/Error States (2 นาที)

### Empty State (1 นาที)

**ถ้าไม่มี templates**:

- [ ] แสดง ax-empty-state component
- [ ] Icon: description
- [ ] Title: "No Templates Found"
- [ ] Message ชัดเจน
- [ ] มีปุ่ม 2 ปุ่ม:
  - "Create New Template"
  - "Browse Starter Templates"

### Loading State (30 วินาที)

**Refresh หน้า**:

- [ ] Loading spinner แสดง
- [ ] Text: "Loading templates..."
- [ ] สี primary

### Permission Error (30 วินาที)

**ถ้าไม่มีสิทธิ์**:

- [ ] Error banner แสดงด้านบน
- [ ] สีแดง, border ซ้าย
- [ ] Lock icon
- [ ] Title: "Access Denied"
- [ ] มีปุ่ม X ปิดได้

---

## ✅ Pass/Fail Criteria

### ✅ PASS ถ้า:

- ไม่มี Console Errors
- Features ทั้งหมดทำงาน
- Dark mode ทำงานถูก
- Responsive ทุก breakpoint
- Empty/Error states แสดงถูก

### ❌ FAIL ถ้า:

- มี Console Errors
- Features ไม่ทำงาน
- Dark mode สีผิด/อ่านไม่ได้
- Horizontal scroll ใน mobile
- Empty state ไม่แสดง

---

## 🐛 พบ Bug?

**บันทึก**:

1. Severity: 🔴 Critical / 🟡 High / 🟢 Medium / 🔵 Low
2. Steps to reproduce
3. Screenshot
4. Console errors (ถ้ามี)

**Report ที่**: TESTING_CHECKLIST.md (Bug Tracking section)

---

## 📝 Test Summary

**Tester**: ******\_\_******
**Date**: ******\_\_******
**Result**: ⬜ PASS / ⬜ FAIL

**Issues Found**: ****\_\_\_****

**Notes**:
