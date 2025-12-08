# AegisX Design Tokens Usage Guide

> **Complete reference for using AegisX Design System tokens correctly**
>
> Last Updated: 2025-01-14

---

## 📚 Table of Contents

1. [Overview](#overview)
2. [Text Color Hierarchy](#text-color-hierarchy)
3. [Background Colors](#background-colors)
4. [Border Colors](#border-colors)
5. [Brand/Primary Colors](#brandprimary-colors)
6. [Semantic Colors](#semantic-colors)
7. [Spacing Scale](#spacing-scale)
8. [Typography Scale](#typography-scale)
9. [Shadows & Elevation](#shadows--elevation)
10. [Border Radius](#border-radius)
11. [Z-Index Layering](#z-index-layering)
12. [Transitions & Motion](#transitions--motion)
13. [Accessibility](#accessibility)
14. [Migration from Legacy Names](#migration-from-legacy-names)
15. [Quick Reference](#quick-reference)

---

## Overview

AegisX Design System provides **100+ CSS custom properties (tokens)** that ensure visual consistency across the application. All tokens are **theme-aware** and automatically adapt when switching between light/dark modes.

### Token Categories

| Category             | Count | Theme-aware       |
| -------------------- | ----- | ----------------- |
| Text Colors          | 6     | ✅                |
| Background Colors    | 4     | ✅                |
| Border Colors        | 3     | ✅                |
| Brand Colors         | 6     | ✅                |
| Success/Warning/Info | 18    | ✅                |
| Spacing              | 8     | ❌ (same in both) |
| Typography           | 20    | ❌                |
| Shadows              | 3     | ✅                |
| Z-Index              | 7     | ❌                |
| Transitions          | 4     | ❌                |

---

## Text Color Hierarchy

Use **semantic names** based on content hierarchy, not appearance.

### Available Tokens

```scss
--ax-text-heading      // H1, H2, H3 headings (#1f2937 light, #f3f4f6 dark)
--ax-text-primary      // Body text, paragraphs (#374151 light, #d1d5db dark)
--ax-text-secondary    // Descriptions, subtitles (#6b7280 light, #9ca3af dark)
--ax-text-subtle       // Hints, placeholders (#9ca3af light, #6b7280 dark)
--ax-text-disabled     // Disabled states (#d1d5db light, #4b5563 dark)
--ax-text-inverted     // Text on colored backgrounds (#ffffff light, #111827 dark)
```

### When to Use Each

| Token                 | Use Case                     | Examples                                 |
| --------------------- | ---------------------------- | ---------------------------------------- |
| `--ax-text-heading`   | Page titles, section headers | `<h1>`, `<h2>`, `.docs-title`            |
| `--ax-text-primary`   | Main content text            | `<p>`, body copy, table cells            |
| `--ax-text-secondary` | Supporting text              | Descriptions, captions, `.docs-subtitle` |
| `--ax-text-subtle`    | Low-priority text            | Timestamps, helper text, placeholders    |
| `--ax-text-disabled`  | Inactive elements            | Disabled buttons, inactive tabs          |
| `--ax-text-inverted`  | High-contrast text           | White text on brand color buttons        |

### Code Examples

```html
<!-- ✅ CORRECT: Semantic usage -->
<h1 class="docs-title">Dashboard</h1>
<p class="docs-subtitle">Welcome back! Here's what's happening today.</p>

<!-- ❌ WRONG: Inline styles -->
<h1 style="color: var(--ax-text-strong)">Dashboard</h1>
<p style="color: var(--ax-text-body)">Welcome back!</p>
```

```scss
// ✅ CORRECT: Use in CSS
.page-title {
  color: var(--ax-text-heading);
  font-size: var(--ax-text-3xl);
  font-weight: var(--ax-font-bold);
}

.page-description {
  color: var(--ax-text-secondary);
  font-size: var(--ax-text-base);
}
```

---

## Background Colors

Four levels of background intensity for creating visual hierarchy.

### Available Tokens

```scss
--ax-background-default   // Main content area (#ffffff light, #111827 dark)
--ax-background-subtle    // Cards, panels (#f3f4f6 light, #1f2937 dark)
--ax-background-muted     // Hover states, secondary (#f9fafb light, #131a2b dark)
--ax-background-emphasis  // Active/selected (#374151 light, #d1d5db dark)
```

### Visual Hierarchy

```
Lightest → Darkest (Light Theme)
#ffffff → #f9fafb → #f3f4f6 → #374151

Darkest → Lightest (Dark Theme)
#111827 → #131a2b → #1f2937 → #d1d5db
```

### When to Use Each

| Token                      | Use Case           | Examples                               |
| -------------------------- | ------------------ | -------------------------------------- |
| `--ax-background-default`  | Main content       | Page background, main containers       |
| `--ax-background-subtle`   | Elevated content   | Cards, panels, mat-card                |
| `--ax-background-muted`    | Interactive states | Hover backgrounds, example boxes       |
| `--ax-background-emphasis` | Active states      | Selected rows, active navigation items |

### Code Examples

```scss
// Card with subtle background
.card {
  background: var(--ax-background-subtle);
  border: 1px solid var(--ax-border-default);
  border-radius: var(--ax-radius-lg);
}

// Hover state
.list-item {
  &:hover {
    background: var(--ax-background-muted);
  }

  &.active {
    background: var(--ax-background-emphasis);
    color: var(--ax-text-inverted);
  }
}
```

---

## Border Colors

Three levels of border visibility for different emphasis.

### Available Tokens

```scss
--ax-border-muted      // Subtle dividers (#f3f4f6 light, #1f2937 dark)
--ax-border-default    // Standard borders (#e5e7eb light, #374151 dark)
--ax-border-emphasis   // Strong borders (#d1d5db light, #4b5563 dark)
```

### When to Use Each

| Token                  | Use Case                           |
| ---------------------- | ---------------------------------- |
| `--ax-border-muted`    | Subtle dividers, table rows        |
| `--ax-border-default`  | Card borders, input borders        |
| `--ax-border-emphasis` | Focus states, important boundaries |

---

## Brand/Primary Colors

Six-level scale for brand color usage with Tremor-inspired naming.

### Available Tokens

```scss
--ax-brand-faint      // Lightest (#e8eaf6 light, #1a237e dark)
--ax-brand-muted      // Light (#9fa8da light, #283593 dark)
--ax-brand-subtle     // Medium-light (#5c6bc0 light, #3949ab dark)
--ax-brand-default    // Main brand color (#3f51b5 light, #5c6bc0 dark)
--ax-brand-emphasis   // Strong (#303f9f light, #9fa8da dark)
--ax-brand-inverted   // Contrast (#ffffff light, #1a237e dark)
```

### Visual Scale (Light Theme)

```
Lightest ────────────────────────► Darkest
faint   muted   subtle   default   emphasis   inverted
#e8eaf6 #9fa8da #5c6bc0  #3f51b5  #303f9f   #ffffff
```

### When to Use Each

```scss
// Primary action button
.btn-primary {
  background: var(--ax-brand-default);
  color: var(--ax-brand-inverted);

  &:hover {
    background: var(--ax-brand-emphasis);
  }
}

// Brand accent backgrounds
.info-box {
  background: var(--ax-brand-faint);
  border-left: 4px solid var(--ax-brand-default);
}

// Brand links
.brand-link {
  color: var(--ax-brand-default);

  &:hover {
    color: var(--ax-brand-emphasis);
  }
}
```

---

## Semantic Colors

Success, Warning, and Info colors follow the same 6-level scale as Brand colors.

### Success Colors (Green)

```scss
--ax-success-faint      // Backgrounds (#d1fae5)
--ax-success-muted      // Subtle highlights (#6ee7b7)
--ax-success-subtle     // Light text (#34d399)
--ax-success-default    // Main success color (#10b981)
--ax-success-emphasis   // Strong success (#059669)
--ax-success-inverted   // Contrast text (#ffffff)
```

### Warning Colors (Amber)

```scss
--ax-warning-faint      // Backgrounds (#fef3c7)
--ax-warning-muted      // Subtle highlights (#fcd34d)
--ax-warning-subtle     // Light text (#fbbf24)
--ax-warning-default    // Main warning color (#f59e0b)
--ax-warning-emphasis   // Strong warning (#d97706)
--ax-warning-inverted   // Contrast text (#ffffff)
```

### Info Colors (Blue)

```scss
--ax-info-faint         // Backgrounds (#dbeafe)
--ax-info-muted         // Subtle highlights (#93c5fd)
--ax-info-subtle        // Light text (#60a5fa)
--ax-info-default       // Main info color (#3b82f6)
--ax-info-emphasis      // Strong info (#2563eb)
--ax-info-inverted      // Contrast text (#ffffff)
```

### Usage Patterns

```scss
// Success badge
.badge-success {
  background: var(--ax-success-faint);
  color: var(--ax-success-emphasis);
  border: 1px solid var(--ax-success-muted);
}

// Warning alert
.alert-warning {
  background: var(--ax-warning-faint);
  border-left: 4px solid var(--ax-warning-default);
  color: var(--ax-text-primary);
}

// Info notification
.notification-info {
  background: var(--ax-info-default);
  color: var(--ax-info-inverted);
}
```

---

## Spacing Scale

8-point grid system (4px base unit) for consistent spacing.

### Available Tokens

```scss
--ax-spacing-xs    // 4px   - Tight spacing
--ax-spacing-sm    // 8px   - Small spacing
--ax-spacing-md    // 16px  - Medium spacing (base)
--ax-spacing-lg    // 24px  - Large spacing
--ax-spacing-xl    // 32px  - Extra large
--ax-spacing-2xl   // 40px  - 2x extra large
--ax-spacing-3xl   // 48px  - 3x extra large
--ax-spacing-4xl   // 64px  - 4x extra large
```

### Usage Guidelines

```scss
// Component spacing
.card {
  padding: var(--ax-spacing-lg); // 24px
  margin-bottom: var(--ax-spacing-md); // 16px
}

// Form field gaps
.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--ax-spacing-sm); // 8px between fields
}

// Section spacing
.section {
  margin-bottom: var(--ax-spacing-3xl); // 48px
}
```

---

## Typography Scale

Font sizes, weights, and line heights for consistent typography.

### Font Sizes (Tailwind-compatible)

```scss
--ax-text-xs     // 12px - Tiny labels
--ax-text-sm     // 14px - Small text
--ax-text-base   // 16px - Body text
--ax-text-lg     // 18px - Large body
--ax-text-xl     // 20px - Small headings
--ax-text-2xl    // 24px - Medium headings
--ax-text-3xl    // 30px - Large headings
--ax-text-4xl    // 36px - Page titles
```

### Font Weights

```scss
--ax-font-normal     // 400 - Body text
--ax-font-medium     // 500 - Emphasized text
--ax-font-semibold   // 600 - Subheadings
--ax-font-bold       // 700 - Headings
```

### Line Heights

```scss
--ax-leading-tight     // 1.25 - Headings
--ax-leading-normal    // 1.5  - Body text
--ax-leading-relaxed   // 1.75 - Long-form content
```

### Typography Patterns

```scss
// Page title
.docs-title {
  font-size: var(--ax-text-3xl);
  font-weight: var(--ax-font-bold);
  line-height: var(--ax-leading-tight);
  color: var(--ax-text-heading);
}

// Section heading
.section-header h2 {
  font-size: var(--ax-text-2xl);
  font-weight: var(--ax-font-semibold);
  color: var(--ax-text-heading);
}

// Body text
.body-text {
  font-size: var(--ax-text-base);
  font-weight: var(--ax-font-normal);
  line-height: var(--ax-leading-normal);
  color: var(--ax-text-primary);
}
```

---

## Shadows & Elevation

Three shadow levels for Tremor-style minimal elevation.

### Available Tokens

```scss
--ax-shadow-sm   // Subtle shadow for cards
--ax-shadow-md   // Medium shadow for hover states
--ax-shadow-lg   // Strong shadow for modals
```

### Shadow Values (Light Theme)

```css
--ax-shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--ax-shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--ax-shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
```

### Usage

```scss
// Card with subtle shadow
.card {
  box-shadow: var(--ax-shadow-sm);

  &:hover {
    box-shadow: var(--ax-shadow-md);
  }
}

// Modal with strong shadow
.modal {
  box-shadow: var(--ax-shadow-lg);
}
```

---

## Border Radius

Six radius values for consistent corner rounding.

### Available Tokens

```scss
--ax-radius-sm    // 4px   - Small elements (badges)
--ax-radius-md    // 6px   - Standard elements (buttons, inputs)
--ax-radius-lg    // 8px   - Large elements (cards)
--ax-radius-xl    // 12px  - Extra large cards
--ax-radius-2xl   // 16px  - Modals, dialogs
--ax-radius-full  // 9999px - Fully rounded (pills, avatars)
```

### Usage Patterns

```scss
// Button
.btn {
  border-radius: var(--ax-radius-md);
}

// Card
.card {
  border-radius: var(--ax-radius-lg);
}

// Badge
.badge {
  border-radius: var(--ax-radius-full);
}

// Avatar
.avatar {
  border-radius: var(--ax-radius-full);
}
```

---

## Z-Index Layering

Consistent z-index scale for UI layering.

### Available Tokens

```scss
--ax-z-base      // 0    - Normal flow
--ax-z-dropdown  // 1000 - Dropdowns, menus
--ax-z-sticky    // 1100 - Sticky headers
--ax-z-fixed     // 1200 - Fixed positioning
--ax-z-overlay   // 1300 - Backdrops
--ax-z-modal     // 1400 - Modals, dialogs
--ax-z-toast     // 1500 - Toasts, notifications
```

### Layering Hierarchy

```
Toast (1500)       ← Highest (always visible)
  ↓
Modal (1400)
  ↓
Overlay (1300)
  ↓
Fixed (1200)
  ↓
Sticky (1100)
  ↓
Dropdown (1000)
  ↓
Base (0)           ← Normal flow
```

---

## Transitions & Motion

Four transition speeds for consistent animations.

### Available Tokens

```scss
--ax-transition-fast    // 150ms ease - Quick interactions
--ax-transition-base    // 200ms ease - Standard transitions
--ax-transition-slow    // 300ms ease - Deliberate animations
--ax-transition-slower  // 400ms ease - Complex animations
```

### Usage

```scss
// Button hover
.btn {
  transition: background-color var(--ax-transition-fast);

  &:hover {
    background-color: var(--ax-brand-emphasis);
  }
}

// Dropdown menu
.dropdown-menu {
  transition:
    opacity var(--ax-transition-base),
    transform var(--ax-transition-base);
}

// Page transitions
.page-transition {
  transition: all var(--ax-transition-slow);
}
```

---

## Accessibility

WCAG-compliant accessibility tokens.

### Available Tokens

```scss
--ax-a11y-focus-indicator-thickness  // 2px  - Focus ring width
--ax-a11y-focus-indicator-offset     // 2px  - Focus ring offset
--ax-a11y-touch-target-min           // 48px - Minimum touch size
--ax-a11y-text-min-contrast          // 4.5  - WCAG AA ratio
--ax-a11y-text-enhanced-contrast     // 7.0  - WCAG AAA ratio
```

### Usage

```scss
// Focus ring
.btn:focus-visible {
  outline: var(--ax-a11y-focus-indicator-thickness) solid var(--ax-brand-default);
  outline-offset: var(--ax-a11y-focus-indicator-offset);
}

// Touch target
.touch-button {
  min-height: var(--ax-a11y-touch-target-min);
  min-width: var(--ax-a11y-touch-target-min);
}
```

---

## Migration from Legacy Names

### Deprecated Tokens (Still Supported)

These tokens still work but are **deprecated**. Migrate to new names:

| ❌ Old (Deprecated)  | ✅ New (Recommended)  | Usage         |
| -------------------- | --------------------- | ------------- |
| `--ax-text-strong`   | `--ax-text-heading`   | Headings only |
| `--ax-text-emphasis` | `--ax-text-primary`   | Body text     |
| `--ax-text-body`     | `--ax-text-secondary` | Descriptions  |

### Migration Example

```scss
// ❌ OLD (Still works, but deprecated)
.page-title {
  color: var(--ax-text-strong);
}

.page-description {
  color: var(--ax-text-body);
}

// ✅ NEW (Recommended)
.page-title {
  color: var(--ax-text-heading);
}

.page-description {
  color: var(--ax-text-secondary);
}
```

---

## Quick Reference

### Common Patterns Cheat Sheet

```scss
/* ============================================
   PAGE HEADER
   ============================================ */
.docs-header {
  margin-bottom: var(--ax-spacing-lg);
}

.docs-title {
  font-size: var(--ax-text-3xl);
  font-weight: var(--ax-font-bold);
  color: var(--ax-text-heading);
  margin: 0;
}

.docs-subtitle {
  font-size: var(--ax-text-lg);
  color: var(--ax-text-secondary);
  line-height: var(--ax-leading-normal);
}

/* ============================================
   CARD
   ============================================ */
.card {
  background: var(--ax-background-subtle);
  border: 1px solid var(--ax-border-default);
  border-radius: var(--ax-radius-lg);
  padding: var(--ax-spacing-lg);
  box-shadow: var(--ax-shadow-sm);

  &:hover {
    box-shadow: var(--ax-shadow-md);
  }
}

/* ============================================
   BUTTON
   ============================================ */
.btn-primary {
  background: var(--ax-brand-default);
  color: var(--ax-brand-inverted);
  border-radius: var(--ax-radius-md);
  padding: var(--ax-spacing-sm) var(--ax-spacing-md);
  transition: background-color var(--ax-transition-fast);

  &:hover {
    background: var(--ax-brand-emphasis);
  }

  &:focus-visible {
    outline: var(--ax-a11y-focus-indicator-thickness) solid var(--ax-brand-default);
    outline-offset: var(--ax-a11y-focus-indicator-offset);
  }
}

/* ============================================
   FORM FIELD
   ============================================ */
.form-field {
  margin-bottom: var(--ax-spacing-md);
}

.form-label {
  font-size: var(--ax-text-sm);
  font-weight: var(--ax-font-medium);
  color: var(--ax-text-primary);
  margin-bottom: var(--ax-spacing-xs);
}

.form-input {
  border: 1px solid var(--ax-border-default);
  border-radius: var(--ax-radius-md);
  padding: var(--ax-spacing-sm);
  font-size: var(--ax-text-base);

  &:focus {
    border-color: var(--ax-brand-default);
    outline: none;
  }

  &::placeholder {
    color: var(--ax-text-subtle);
  }
}

/* ============================================
   ALERT
   ============================================ */
.alert-success {
  background: var(--ax-success-faint);
  border-left: 4px solid var(--ax-success-default);
  padding: var(--ax-spacing-md);
  border-radius: var(--ax-radius-md);
  color: var(--ax-text-primary);
}

.alert-warning {
  background: var(--ax-warning-faint);
  border-left: 4px solid var(--ax-warning-default);
  padding: var(--ax-spacing-md);
  border-radius: var(--ax-radius-md);
  color: var(--ax-text-primary);
}

.alert-info {
  background: var(--ax-info-faint);
  border-left: 4px solid var(--ax-info-default);
  padding: var(--ax-spacing-md);
  border-radius: var(--ax-radius-md);
  color: var(--ax-text-primary);
}
```

---

## Best Practices

### ✅ DO

- Use semantic token names (`--ax-text-heading` not `--ax-text-strong`)
- Use utility classes instead of inline styles
- Stick to the spacing scale (don't use arbitrary values)
- Test in both light and dark themes
- Use `--ax-text-primary` for body text, not `heading`

### ❌ DON'T

- Hardcode colors (`#374151` instead of `var(--ax-text-primary)`)
- Use inline styles for token values
- Mix legacy and new token names
- Create custom spacing values outside the scale
- Use heading tokens for body text

---

## Resources

- **Token File**: `/libs/aegisx-ui/src/lib/styles/themes/_aegisx-tokens.scss`
- **Theme Service**: `/apps/admin/src/app/services/tremor-theme.service.ts`
- **Documentation Patterns**: `/apps/admin/src/styles/documentation-patterns.scss`
- **Material Design 3**: https://m3.material.io/
- **Tremor Design**: https://tremor.so/

---

**Questions?** Check the token file for complete definitions and theme-specific values.
