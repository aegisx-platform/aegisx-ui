# PDF Templates UI Improvement - Requirements

## Overview

ปรับปรุงหน้าจัดการ PDF Templates ให้มี UI/UX ที่ทันสมัย ใช้ aegisx-ui components, Angular Material และ TailwindCSS อย่างเต็มประสิทธิภาพ

## Current Issues

### 1. File Structure Problems

- Component file เดียว 2,208 บรรทัด (template 798 + styles 600 + logic 810)
- Inline template และ inline styles ทำให้ maintain ยาก
- ไม่มี syntax highlighting เต็มที่
- Code review ทำได้ยาก

### 2. UI/UX Issues

- ตารางแสดงข้อมูลมากเกินไป แม้จะบอกว่า "simplified"
- Summary dashboard ใช้ custom Material cards แทน aegisx-ui components
- Empty state พื้นฐานเกินไป ไม่มี multiple CTAs
- Layout ไม่ responsive เท่าที่ควร
- ไม่รองรับ dark mode อย่างสมบูรณ์

### 3. Component Usage

- ❌ ไม่ใช้ `ax-kpi-card` สำหรับ KPI metrics
- ❌ ไม่ใช้ `ax-card` สำหรับ card layouts
- ❌ ไม่ใช้ `ax-badge` สำหรับ status indicators
- ❌ ไม่ใช้ `ax-field-display` สำหรับแสดง fields
- ❌ ไม่ใช้ `ax-empty-state` สำหรับ empty states

### 4. CSS Issues

- ใช้ inline CSS มากกว่า 600 บรรทัด
- ไม่ใช้ TailwindCSS utilities อย่างเต็มที่
- Responsive breakpoints เขียนเอง แทนใช้ Tailwind
- Dark mode support ไม่สมบูรณ์

## Requirements

### FR1: File Structure Refactoring

- **FR1.1**: แยก template เป็น `.component.html` file
- **FR1.2**: แยก styles เป็น `.component.scss` file
- **FR1.3**: Component TS file ควรมีแค่ logic (~400 lines)
- **FR1.4**: พิจารณาสร้าง sub-components สำหรับส่วนที่ซับซ้อน

### FR2: Dashboard Improvements

- **FR2.1**: ใช้ `ax-kpi-card` สำหรับแสดง statistics
- **FR2.2**: KPI cards ต้อง clickable สำหรับ quick filters
- **FR2.3**: มี hover effects และ transitions
- **FR2.4**: Responsive grid (1 col mobile, 2 cols tablet, 4 cols desktop)
- **FR2.5**: แสดง:
  - Total Templates
  - Active Templates (clickable → filter active)
  - Template Starters (clickable → filter starters)
  - Total Usage Count

### FR3: List View Improvements

- **FR3.1**: เปลี่ยนจาก table เป็น **card grid view** (default)
- **FR3.2**: ใช้ `ax-card` สำหรับแต่ละ template
- **FR3.3**: ใช้ `ax-badge` สำหรับ status indicators (Active/Inactive, Starter, Default)
- **FR3.4**: ใช้ `ax-field-display` สำหรับแสดงข้อมูลใน card
- **FR3.5**: เพิ่ม **view toggle** (grid/table) - default = grid
- **FR3.6**: Card ต้องแสดง:
  - Display name (header)
  - Name (subtitle, font-mono)
  - Status badges (Active, Starter, Default)
  - Category, Type
  - Usage count (ถ้ามี)
  - Created date
  - Action buttons (Preview, Edit, Duplicate, Delete)
- **FR3.7**: Responsive grid:
  - Mobile: 1 column
  - Tablet: 2 columns
  - Desktop: 3 columns

### FR4: Search & Filters Enhancement

- **FR4.1**: Search bar ใหม่พร้อม clear button
- **FR4.2**: Quick filter buttons (All, Active, Starters)
- **FR4.3**: Advanced filters แบบ collapsible (mat-expansion-panel)
- **FR4.4**: Active filter chips ใช้ `ax-badge` พร้อม remove button
- **FR4.5**: Filter count badge บน "Advanced Filters" header
- **FR4.6**: Responsive layout (stack บน mobile, inline บน desktop)

### FR5: Empty State Enhancement

- **FR5.1**: ใช้ `ax-empty-state` component
- **FR5.2**: มี 2 CTAs:
  - "Create New Template" (primary)
  - "Browse Starter Templates" (secondary)
- **FR5.3**: Icon: "description"
- **FR5.4**: Title: "No Templates Found"
- **FR5.5**: Message: "Get started by creating your first PDF template or choose from our starter templates."

### FR6: TailwindCSS Integration

- **FR6.1**: แทนที่ custom CSS ด้วย Tailwind utilities
- **FR6.2**: ใช้ Tailwind responsive breakpoints (sm, md, lg, xl)
- **FR6.3**: ใช้ Tailwind spacing utilities (p-_, m-_, gap-\*)
- **FR6.4**: ใช้ Tailwind flexbox/grid utilities
- **FR6.5**: Dark mode support ด้วย `dark:` prefix
- **FR6.6**: ลดจำนวน custom CSS ให้เหลือเฉพาะที่จำเป็น

### FR7: Error States & Loading

- **FR7.1**: Permission error banner ใช้ Tailwind + modern alert design
- **FR7.2**: Loading state ใช้ Material spinner + Tailwind layout
- **FR7.3**: Error state ใช้ Tailwind alert design

### FR8: Responsive Design

- **FR8.1**: Mobile-first approach
- **FR8.2**: Breakpoints:
  - Mobile: < 640px (1 column)
  - Tablet: 640px - 1024px (2 columns)
  - Desktop: > 1024px (3-4 columns)
- **FR8.3**: Stack buttons vertically บน mobile
- **FR8.4**: Collapsible sections บน mobile

### FR9: Dark Mode Support

- **FR9.1**: ทุก component รองรับ dark mode
- **FR9.2**: ใช้ Tailwind `dark:` utilities
- **FR9.3**: Test ทั้ง light และ dark themes

### FR10: Accessibility

- **FR10.1**: Keyboard navigation ทำงานได้สมบูรณ์
- **FR10.2**: Screen reader support
- **FR10.3**: ARIA labels ครบถ้วน
- **FR10.4**: Focus indicators ชัดเจน

## Non-Functional Requirements

### NFR1: Performance

- Component load time ไม่เกิน 1 วินาที
- Smooth transitions และ animations (60fps)
- Lazy loading สำหรับ large lists

### NFR2: Code Quality

- ลดจำนวนบรรทัดโค้ดลง 40-50%
- No inline styles/templates
- TypeScript strict mode
- ESLint ไม่มี errors

### NFR3: Maintainability

- แยก concerns ชัดเจน (HTML, SCSS, TS)
- Reusable sub-components
- ชื่อตัวแปรและฟังก์ชันอธิบายตัวเอง
- Comments สำหรับส่วนที่ซับซ้อน

### NFR4: Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Success Criteria

1. ✅ Component file ลดลงจาก 2,208 → ~1,200 บรรทัด (45% reduction)
2. ✅ ใช้ aegisx-ui components ในทุกที่ที่เหมาะสม
3. ✅ Responsive ทำงานได้ดีบนทุก breakpoints
4. ✅ Dark mode ทำงานได้สมบูรณ์
5. ✅ ESLint ไม่มี errors
6. ✅ Accessibility score > 90% (Lighthouse)
7. ✅ Performance score > 90% (Lighthouse)
8. ✅ User feedback: UI ดูสวยและใช้งานง่ายขึ้น

## Out of Scope

- ❌ Backend API changes
- ❌ Database schema changes
- ❌ Template editor improvements (separate feature)
- ❌ PDF preview improvements (separate feature)
- ❌ Bulk operations logic changes
- ❌ Authentication/authorization changes

## Dependencies

- aegisx-ui library (must be up to date)
- Angular Material (current version)
- TailwindCSS (current configuration)
- TypeScript (current version)

## Risks & Mitigation

| Risk                                  | Impact | Mitigation                                |
| ------------------------------------- | ------ | ----------------------------------------- |
| Breaking existing functionality       | High   | Comprehensive testing before merge        |
| aegisx-ui components missing features | Medium | Fallback to Material components           |
| Performance issues with card view     | Medium | Implement virtual scrolling if needed     |
| Dark mode inconsistencies             | Low    | Use Tailwind dark: utilities consistently |

## Timeline Estimate

- File refactoring: 1-2 hours
- Dashboard improvements: 2-3 hours
- List view (card grid): 2-3 hours
- Search & filters: 1-2 hours
- TailwindCSS integration: 1-2 hours
- Testing & fixes: 2-3 hours

**Total**: 9-15 hours (1.5-2 days)

## Approval

- [ ] Product Owner
- [ ] Tech Lead
- [ ] UI/UX Designer
- [ ] Developer

---

**Created**: 2025-12-19
**Status**: Draft
**Priority**: High
**Assigned**: TBD
