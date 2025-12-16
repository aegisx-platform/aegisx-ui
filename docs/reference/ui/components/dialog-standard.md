# Dialog Size Standard

**Version:** 1.0.0
**Last Updated:** 2025-01-25
**Status:** Official AegisX Standard

---

## Overview

This document defines the official dialog size standards for the AegisX Design System. All dialogs must use one of these predefined sizes for consistency across the application.

## Standard Dialog Sizes

### Small (`dialog-sm`) - 600px

**Use Cases:**

- Simple confirmations and alerts
- Short forms (1-3 fields)
- Quick actions and notifications
- Delete confirmations
- Yes/No questions

**Configuration:**

```typescript
this.dialog.open(MyComponent, {
  panelClass: 'dialog-sm',
});
```

**Responsive Behavior:**

- Desktop: 600px max-width
- Tablet/Mobile: 95vw

---

### Medium (`dialog-md`) - 800px

**Use Cases:**

- Standard forms (4-8 fields)
- User profile editors
- Content preview dialogs
- Settings panels
- Single-section forms

**Configuration:**

```typescript
this.dialog.open(MyComponent, {
  panelClass: 'dialog-md',
});
```

**Responsive Behavior:**

- Desktop: 800px max-width
- Tablet/Mobile: 95vw

---

### Large (`dialog-lg`) - 1000px

**Use Cases:**

- Complex forms with multiple sections
- Multi-column layouts
- Rich text editors
- Split-view interfaces
- Advanced filtering options

**Configuration:**

```typescript
this.dialog.open(MyComponent, {
  panelClass: 'dialog-lg',
});
```

**Responsive Behavior:**

- Desktop: 1000px max-width
- Tablet/Mobile: 95vw

---

### Extra Large (`dialog-xl`) - 1200px

**Use Cases:**

- Data tables and grids
- Dashboard configurations
- Advanced settings panels
- Report builders
- Side-by-side comparisons

**Configuration:**

```typescript
this.dialog.open(MyComponent, {
  panelClass: 'dialog-xl',
});
```

**Responsive Behavior:**

- Desktop: 1200px max-width
- Tablet/Mobile: 95vw

---

### Fullscreen (`dialog-fullscreen`) - 100vw × 100vh

**Use Cases:**

- Mobile-first workflows
- Multi-step wizards (3+ steps)
- Complex data entry requiring full focus
- Touch-optimized interfaces
- Video players or image editors
- Mobile apps

**Configuration:**

```typescript
this.dialog.open(MyComponent, {
  panelClass: 'dialog-fullscreen',
  disableClose: true, // Recommended: force explicit close
});
```

**Features:**

- No border radius (square corners)
- Full viewport coverage
- No backdrop (background covered)
- Recommended with `disableClose: true`

**Responsive Behavior:**

- All devices: 100vw × 100vh

---

## Size Selection Decision Tree

```
┌─────────────────────────────────────────┐
│ Is it a simple confirmation?            │
│ (Yes/No, Delete, etc.)                  │
└────────┬────────────────────────────────┘
         │ YES → dialog-sm (600px)
         │
         NO
         │
┌────────▼────────────────────────────────┐
│ Does it have 1-8 form fields?           │
└────────┬────────────────────────────────┘
         │ YES → dialog-md (800px)
         │
         NO
         │
┌────────▼────────────────────────────────┐
│ Does it need multiple sections?         │
│ (Tabs, Accordions, Split View)          │
└────────┬────────────────────────────────┘
         │ YES → dialog-lg (1000px)
         │
         NO
         │
┌────────▼────────────────────────────────┐
│ Does it contain data tables/grids?      │
└────────┬────────────────────────────────┘
         │ YES → dialog-xl (1200px)
         │
         NO
         │
┌────────▼────────────────────────────────┐
│ Is it a mobile workflow or wizard?      │
│ (Multi-step, Touch-first)               │
└────────┬────────────────────────────────┘
         │ YES → dialog-fullscreen
         │
         NO → Consider redesigning UX
```

---

## Implementation Guidelines

### DO ✅

- **Always use predefined sizes** - Never set custom widths
- **Use panelClass only** - Don't mix with width config
- **Consider mobile first** - Test on small screens
- **Use fullscreen for wizards** - Better UX on mobile
- **Match size to content** - Don't over-size simple dialogs

### DON'T ❌

- **Never set width directly** in dialog config

  ```typescript
  // ❌ WRONG
  this.dialog.open(Component, { width: '750px' });

  // ✅ CORRECT
  this.dialog.open(Component, { panelClass: 'dialog-md' });
  ```

- **Never create custom size classes** without approval
- **Never use maxWidth config** - Use panelClass instead
- **Don't use fullscreen for simple forms** - Overkill
- **Don't ignore responsive behavior** - Always test

---

## Technical Implementation

### CSS Variables (Internal)

```scss
// Default container settings
.mat-mdc-dialog-container {
  --mdc-dialog-container-min-width: 400px;
  --mdc-dialog-container-max-width: 900px; // Default max
}

// Size variant overrides
.dialog-sm {
  --mdc-dialog-container-min-width: 400px;
  --mdc-dialog-container-max-width: 600px;
  width: 95vw;
  max-width: 600px;
}

.dialog-md {
  --mdc-dialog-container-min-width: 600px;
  --mdc-dialog-container-max-width: 800px;
  width: 95vw;
  max-width: 800px;
}

.dialog-lg {
  --mdc-dialog-container-min-width: 800px;
  --mdc-dialog-container-max-width: 1000px;
  width: 95vw;
  max-width: 1000px;
}

.dialog-xl {
  --mdc-dialog-container-min-width: 1000px;
  --mdc-dialog-container-max-width: 1200px;
  width: 95vw;
  max-width: 1200px;
}

.dialog-fullscreen {
  --mdc-dialog-container-min-width: 100vw;
  --mdc-dialog-container-max-width: 100vw;
  width: 100vw;
  max-width: 100vw;
  height: 100vh;
  max-height: 100vh;
  margin: 0;
  border-radius: 0;
}
```

---

## Examples

### Example 1: Delete Confirmation (Small)

```typescript
openDeleteConfirmation(): void {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    panelClass: 'dialog-sm',
    data: {
      title: 'Delete Item',
      message: 'Are you sure you want to delete this item?',
      confirmText: 'Delete',
      isDangerous: true,
    }
  });
}
```

### Example 2: User Profile Form (Medium)

```typescript
openEditProfile(): void {
  const dialogRef = this.dialog.open(EditProfileDialogComponent, {
    panelClass: 'dialog-md',
    disableClose: true,
    data: { userId: this.currentUser.id }
  });
}
```

### Example 3: Advanced Settings (Large)

```typescript
openAdvancedSettings(): void {
  const dialogRef = this.dialog.open(SettingsDialogComponent, {
    panelClass: 'dialog-lg',
    data: { section: 'advanced' }
  });
}
```

### Example 4: Data Table (Extra Large)

```typescript
openDataTable(): void {
  const dialogRef = this.dialog.open(DataTableDialogComponent, {
    panelClass: 'dialog-xl',
    data: { tableId: 'users' }
  });
}
```

### Example 5: Multi-Step Wizard (Fullscreen)

```typescript
openOnboardingWizard(): void {
  const dialogRef = this.dialog.open(OnboardingWizardComponent, {
    panelClass: 'dialog-fullscreen',
    disableClose: true, // Force completion
    data: { step: 1 }
  });
}
```

---

## Migration from Custom Sizes

If you have existing dialogs with custom widths, migrate them using this mapping:

| Old Width   | New Standard        | Notes                 |
| ----------- | ------------------- | --------------------- |
| < 600px     | `dialog-sm`         | Minimum size enforced |
| 600-800px   | `dialog-md`         | Most common           |
| 800-1000px  | `dialog-lg`         | Complex forms         |
| 1000-1200px | `dialog-xl`         | Tables/dashboards     |
| > 1200px    | `dialog-fullscreen` | Consider UX redesign  |

---

## Accessibility Notes

- **Fullscreen dialogs** must have visible close button
- **All dialogs** should support ESC key dismissal (unless disableClose)
- **Focus trap** is automatic for all sizes
- **Keyboard navigation** works identically across all sizes
- **Screen readers** announce dialog title correctly

---

## Performance Considerations

- **Fullscreen dialogs** load more content - use lazy loading
- **Extra large dialogs** with tables - implement virtual scrolling
- **All sizes** - avoid heavy animations on open/close
- **Mobile** - fullscreen is more performant than scaled-down large dialogs

---

## Technical Implementation Details

### Sticky Footer Solution

Actions are positioned at the bottom of dialogs using the following CSS technique:

```scss
.mat-mdc-dialog-container {
  display: flex !important;
  flex-direction: column !important;
}

.mat-mdc-dialog-actions {
  margin-top: auto !important; // Pushes actions to bottom
}
```

This ensures actions remain at the bottom regardless of content length, without requiring fixed heights.

### CSS Variables Used

The dialog system uses both `--mat-dialog-*` and `--mdc-dialog-*` CSS variables:

- `--mat-dialog-container-min-width` / `--mat-dialog-container-max-width` - Applied at overlay pane level
- `--mdc-dialog-container-min-width` / `--mdc-dialog-container-max-width` - Applied at container level
- Both are required for proper sizing across all Material components

---

## Related Documentation

- [Dialog Component Usage](./dialog.md)
- [Material Dialog API](https://material.angular.io/components/dialog/api)
- [AegisX Dialog Service](../../libs/aegisx-ui/src/lib/services/ax-dialog.service.ts)
- [Dialog Shared Styles](../../libs/aegisx-ui/src/lib/styles/components/_dialog-shared.scss)
- [Live Demo](http://localhost:4250/aegisx-ui/dialogs) - Interactive examples of all dialog sizes

---

**Questions or Feedback?**

If you need a dialog size not covered by this standard, please discuss with the design team before implementing custom sizes.
