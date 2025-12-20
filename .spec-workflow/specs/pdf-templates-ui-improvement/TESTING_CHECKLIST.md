# PDF Templates UI Improvement - Testing Checklist

**Date**: 2025-12-19
**Phase**: 7 - Manual Testing & Refinement
**Tester**: ******\_******

---

## 🎯 Testing Environment Setup

### Prerequisites

- [ ] Dev server running: `pnpm run dev:web`
- [ ] API server running: `pnpm run dev:api`
- [ ] Database seeded with test data
- [ ] Browser DevTools open (F12)
- [ ] Logged in with appropriate permissions

### Test Browsers

- [ ] Chrome/Edge (Primary)
- [ ] Firefox
- [ ] Safari (if on macOS)

---

## 📋 Feature Testing

### 1. Page Load & Initial State

- [ ] Page loads without console errors
- [ ] Loading spinner appears briefly (if data loading)
- [ ] Breadcrumbs display correctly: Home > PDF Templates
- [ ] Page title displays: "PDF Templates"

### 2. Dashboard / KPI Cards

**Location**: Top of page

- [ ] **Total Templates** card displays correct count
- [ ] **Active Templates** card displays correct count
- [ ] **Starter Templates** card displays correct count
- [ ] **Inactive** card displays correct count
- [ ] All cards are clickable (should filter list)
- [ ] Card click filters the list correctly
- [ ] Cards show loading state when data refreshing

### 3. View Mode Toggle

**Location**: Below KPI cards

- [ ] Grid view button exists
- [ ] Table view button exists
- [ ] Grid view is default/selected
- [ ] Clicking "Table" switches to table view
- [ ] Clicking "Grid" switches back to grid view
- [ ] Selection state preserved when switching views
- [ ] Visual feedback on active view button

### 4. Card Grid View (Default)

**When**: Grid view is active

#### Template Cards Display:

- [ ] Cards display in responsive grid
- [ ] Desktop: 3-4 columns
- [ ] Tablet: 2 columns
- [ ] Mobile: 1 column
- [ ] Each card shows:
  - [ ] Checkbox (left)
  - [ ] Template name
  - [ ] File code
  - [ ] Status badge (Active/Inactive)
  - [ ] Starter badge (if applicable)
  - [ ] Default badge (if is_default)
  - [ ] Usage count
  - [ ] Last updated date
  - [ ] Actions menu (⋮)

#### Card Interactions:

- [ ] Hover effect on card
- [ ] Checkbox toggles selection
- [ ] Click anywhere on card (except checkbox/menu) opens preview
- [ ] Actions menu (⋮) opens correctly
- [ ] Actions menu shows: Preview, Edit, Duplicate, Delete
- [ ] Delete action shows in red color

#### Badges:

- [ ] Status badge color correct (green=active, red=inactive)
- [ ] Starter badge shows warning color
- [ ] Default badge shows info color
- [ ] Badge sizes appropriate

### 5. Table View (Fallback)

**When**: Table view is active

- [ ] Table displays all templates
- [ ] Columns: Checkbox, Name, Code, Status, Actions
- [ ] Sorting works on sortable columns
- [ ] Row hover effect
- [ ] Checkbox toggles selection
- [ ] Actions menu works

### 6. Bulk Selection & Actions

**When**: One or more items selected

- [ ] Bulk actions bar appears
- [ ] Shows selection count: "X selected"
- [ ] Bulk Delete button enabled
- [ ] Bulk Delete button shows warning color
- [ ] Clicking Bulk Delete shows confirmation dialog
- [ ] Confirming delete removes selected items
- [ ] Selection cleared after successful delete
- [ ] Error handling if delete fails

### 7. Search Functionality

**Location**: Search bar at top

- [ ] Search input field visible
- [ ] Placeholder text: "Search templates..."
- [ ] Typing updates search input (no auto-search)
- [ ] Search button triggers search
- [ ] Clear button clears search
- [ ] Search results display correctly
- [ ] "No results" shows if no matches
- [ ] Pagination resets to page 1 on search

### 8. Pagination

**Location**: Bottom of list

- [ ] Pagination controls visible when items > page size
- [ ] Page size options: 10, 25, 50, 100
- [ ] Current page indicator correct
- [ ] "Previous" button disabled on first page
- [ ] "Next" button disabled on last page
- [ ] Clicking page numbers navigates correctly
- [ ] Total count displayed correctly
- [ ] "X - Y of Z" range displayed correctly

### 9. Empty State

**When**: No templates exist

- [ ] Empty state component displays
- [ ] Icon shows (description icon)
- [ ] Title: "No Templates Found"
- [ ] Message text clear and helpful
- [ ] "Create New Template" button visible
- [ ] "Browse Starter Templates" button visible
- [ ] Both buttons functional
- [ ] Layout responsive (stacks on mobile)

### 10. Permission Error State

**When**: User lacks permissions

- [ ] Error banner displays at top
- [ ] Red left border visible
- [ ] Lock icon displayed
- [ ] Title: "Access Denied"
- [ ] Error message clear
- [ ] Close button dismisses banner
- [ ] Additional message for 403 errors

### 11. Loading State

**When**: Data is loading

- [ ] Loading spinner displays
- [ ] Centered on page
- [ ] "Loading templates..." text visible
- [ ] Spinner size appropriate (60px diameter)
- [ ] Primary color theme

### 12. Template Actions

#### Create New Template:

- [ ] "Add Template" button visible (top right)
- [ ] Clicking opens create dialog
- [ ] Dialog form displays correctly
- [ ] Cancel button closes dialog
- [ ] Save creates template
- [ ] List refreshes after creation
- [ ] Success message displays

#### Preview Template:

- [ ] Clicking card opens preview dialog
- [ ] Preview shows template details
- [ ] All fields displayed correctly
- [ ] Close button works
- [ ] "Edit" button in preview opens edit dialog

#### Edit Template:

- [ ] Edit menu item opens edit dialog
- [ ] Form pre-filled with current data
- [ ] All fields editable
- [ ] Cancel discards changes
- [ ] Save updates template
- [ ] List refreshes after update
- [ ] Success message displays

#### Duplicate Template:

- [ ] Duplicate menu item works
- [ ] Creates copy with "(Copy)" suffix
- [ ] List refreshes showing duplicate
- [ ] Success message displays

#### Delete Template:

- [ ] Delete menu item opens confirmation
- [ ] Confirmation shows template name
- [ ] Cancel aborts deletion
- [ ] Confirm deletes template
- [ ] List refreshes after deletion
- [ ] Success message displays
- [ ] Error handling if delete fails

---

## 📱 Responsive Design Testing

### Desktop (1440px+)

- [ ] Grid: 4 columns
- [ ] All elements properly spaced
- [ ] No horizontal scroll
- [ ] Actions visible without truncation

### Laptop (1280px)

- [ ] Grid: 3-4 columns
- [ ] Layout adjusts gracefully
- [ ] No content overflow

### Tablet (768px - 1024px)

- [ ] Grid: 2 columns
- [ ] Touch targets large enough (44px min)
- [ ] Buttons stack if needed
- [ ] Search bar full width

### Mobile (375px - 414px)

- [ ] Grid: 1 column (stacked)
- [ ] Cards full width
- [ ] Buttons stack vertically
- [ ] Empty state buttons stack
- [ ] Pagination controls responsive
- [ ] No horizontal scroll
- [ ] Text readable without zoom

---

## 🌓 Dark Mode Testing

### Activation

- [ ] Enable dark mode in system/browser
- [ ] Page reflects dark mode immediately
- [ ] No flash of light mode

### Color Contrast

- [ ] All text readable against background
- [ ] Primary: text-gray-900 → dark:text-gray-100
- [ ] Secondary: text-gray-600 → dark:text-gray-400
- [ ] Error banner: proper red variants
- [ ] Cards: light background → dark background
- [ ] Borders visible but subtle

### Components

- [ ] KPI cards adapt colors
- [ ] Template cards adapt colors
- [ ] Badges maintain proper contrast
- [ ] Buttons maintain contrast
- [ ] Error banner: bg-red-50 → dark:bg-red-900/20
- [ ] Loading text readable
- [ ] Empty state readable
- [ ] Bulk actions border visible

### Interactive States

- [ ] Hover states visible in dark mode
- [ ] Focus states visible
- [ ] Selection states clear
- [ ] Disabled states distinguishable

---

## ⚡ Performance Testing

### Page Load

- [ ] Initial page load < 2 seconds
- [ ] Time to Interactive < 3 seconds
- [ ] No layout shift (CLS)
- [ ] Smooth animations

### Data Operations

- [ ] Search response < 500ms
- [ ] Pagination instant
- [ ] Create/Edit/Delete < 1 second
- [ ] Bulk operations reasonable

### Browser Console

- [ ] No errors in console
- [ ] No warnings (except known issues)
- [ ] No memory leaks (check DevTools Memory)

---

## ♿ Accessibility Testing

### Keyboard Navigation

- [ ] Tab through all interactive elements
- [ ] Tab order logical
- [ ] Focus indicators visible
- [ ] Enter/Space activates buttons
- [ ] Escape closes dialogs
- [ ] Arrow keys navigate menus

### Screen Reader

- [ ] Page title announced
- [ ] Headings hierarchical (h1 → h2 → h3)
- [ ] Buttons have accessible labels
- [ ] Form inputs have labels
- [ ] Error messages announced
- [ ] Status changes announced

### ARIA

- [ ] Buttons have `role="button"` if needed
- [ ] Dialogs have `role="dialog"`
- [ ] Loading state has `aria-live`
- [ ] Form errors have `aria-invalid`

### Color Contrast

- [ ] WCAG AA compliance (4.5:1 for text)
- [ ] Check with DevTools Lighthouse

---

## 🌐 Browser Compatibility

### Chrome/Edge

- [ ] All features work
- [ ] No console errors
- [ ] Smooth animations

### Firefox

- [ ] All features work
- [ ] No console errors
- [ ] CSS renders correctly

### Safari (macOS/iOS)

- [ ] All features work
- [ ] No console errors
- [ ] Flexbox/Grid works
- [ ] Touch events work (iOS)

---

## 🐛 Bug Tracking

### Issues Found

| #   | Severity | Issue | Steps to Reproduce | Status |
| --- | -------- | ----- | ------------------ | ------ |
| 1   |          |       |                    |        |
| 2   |          |       |                    |        |
| 3   |          |       |                    |        |

**Severity Levels**:

- 🔴 **Critical**: Blocks core functionality
- 🟡 **High**: Major impact, workaround exists
- 🟢 **Medium**: Minor impact
- 🔵 **Low**: Cosmetic, nice-to-have

---

## ✅ Sign-Off

### Pre-Production Checklist

- [ ] All critical/high bugs fixed
- [ ] All features tested and working
- [ ] Responsive design verified
- [ ] Dark mode working
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Accessibility verified
- [ ] Cross-browser tested

### Tester Sign-Off

**Name**: ******\_******
**Date**: ******\_******
**Status**: ⬜ PASS / ⬜ FAIL
**Notes**:

---

## 📝 Testing Notes

### Environment

- Browser: ******\_******
- OS: ******\_******
- Screen Resolution: ******\_******
- Date/Time: ******\_******

### Additional Observations
