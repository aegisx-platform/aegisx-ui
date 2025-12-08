# AegisX UI - CSS Token Patterns

> **Purpose**: This document maps Tailwind classes to aegisx-ui CSS tokens. Use this when writing component styles or migrating from Tailwind to design tokens.

## Token Source Files

```
libs/aegisx-ui/src/lib/styles/themes/_aegisx-tokens.scss  # Main token definitions
libs/aegisx-ui/src/lib/theme/styles/_tokens.scss          # Theme-specific tokens
libs/aegisx-ui/src/lib/styles/components/_dialog-shared.scss  # Dialog component tokens
```

## Color Tokens

### Background Colors

| Tailwind            | AegisX Token                   | Usage              |
| ------------------- | ------------------------------ | ------------------ |
| `bg-white`          | `var(--ax-background-default)` | Default background |
| `bg-gray-50`        | `var(--ax-background-subtle)`  | Subtle background  |
| `bg-gray-100`       | `var(--ax-background-muted)`   | Muted background   |
| `hover:bg-gray-100` | `var(--ax-background-hover)`   | Hover state        |
| `bg-slate-50`       | `var(--ax-background-surface)` | Card surfaces      |

### Text Colors

| Tailwind        | AegisX Token               | Usage          |
| --------------- | -------------------------- | -------------- |
| `text-gray-900` | `var(--ax-text-heading)`   | Headings       |
| `text-gray-700` | `var(--ax-text-primary)`   | Primary text   |
| `text-gray-600` | `var(--ax-text-secondary)` | Secondary text |
| `text-gray-500` | `var(--ax-text-subtle)`    | Subtle text    |
| `text-gray-400` | `var(--ax-text-disabled)`  | Disabled text  |

### Border Colors

| Tailwind          | AegisX Token                | Usage             |
| ----------------- | --------------------------- | ----------------- |
| `border-gray-200` | `var(--ax-border-default)`  | Default border    |
| `border-gray-100` | `var(--ax-border-subtle)`   | Subtle border     |
| `border-gray-300` | `var(--ax-border-emphasis)` | Emphasized border |

### Semantic Colors

#### Primary

| Tailwind           | AegisX Token                 |
| ------------------ | ---------------------------- |
| `bg-primary-50`    | `var(--ax-primary-faint)`    |
| `bg-primary-100`   | `var(--ax-primary-subtle)`   |
| `text-primary-600` | `var(--ax-primary-default)`  |
| `text-primary-700` | `var(--ax-primary-emphasis)` |

#### Error/Danger

| Tailwind         | AegisX Token               |
| ---------------- | -------------------------- |
| `bg-red-50`      | `var(--ax-error-faint)`    |
| `bg-red-100`     | `var(--ax-error-subtle)`   |
| `border-red-200` | `var(--ax-error-muted)`    |
| `text-red-600`   | `var(--ax-error-default)`  |
| `text-red-700`   | `var(--ax-error-emphasis)` |

#### Warning

| Tailwind            | AegisX Token                 |
| ------------------- | ---------------------------- |
| `bg-yellow-50`      | `var(--ax-warning-faint)`    |
| `bg-yellow-100`     | `var(--ax-warning-subtle)`   |
| `border-yellow-200` | `var(--ax-warning-muted)`    |
| `text-yellow-600`   | `var(--ax-warning-default)`  |
| `text-yellow-700`   | `var(--ax-warning-emphasis)` |

#### Success

| Tailwind           | AegisX Token                 |
| ------------------ | ---------------------------- |
| `bg-green-50`      | `var(--ax-success-faint)`    |
| `bg-green-100`     | `var(--ax-success-subtle)`   |
| `border-green-200` | `var(--ax-success-muted)`    |
| `text-green-600`   | `var(--ax-success-default)`  |
| `text-green-700`   | `var(--ax-success-emphasis)` |

#### Info

| Tailwind          | AegisX Token              |
| ----------------- | ------------------------- |
| `bg-blue-50`      | `var(--ax-info-faint)`    |
| `bg-blue-100`     | `var(--ax-info-subtle)`   |
| `border-blue-200` | `var(--ax-info-muted)`    |
| `text-blue-600`   | `var(--ax-info-default)`  |
| `text-blue-700`   | `var(--ax-info-emphasis)` |

## Spacing Tokens

| Tailwind       | AegisX Token            | Value |
| -------------- | ----------------------- | ----- |
| `p-1`, `m-1`   | `var(--ax-spacing-xs)`  | 4px   |
| `p-2`, `m-2`   | `var(--ax-spacing-sm)`  | 8px   |
| `p-3`, `m-3`   | `var(--ax-spacing-md)`  | 12px  |
| `p-4`, `m-4`   | `var(--ax-spacing-lg)`  | 16px  |
| `p-5`, `m-5`   | `var(--ax-spacing-xl)`  | 20px  |
| `p-6`, `m-6`   | `var(--ax-spacing-2xl)` | 24px  |
| `p-8`, `m-8`   | `var(--ax-spacing-3xl)` | 32px  |
| `p-10`, `m-10` | `var(--ax-spacing-4xl)` | 40px  |
| `p-12`, `m-12` | `var(--ax-spacing-5xl)` | 48px  |

## Border Radius Tokens

| Tailwind       | AegisX Token            | Value  |
| -------------- | ----------------------- | ------ |
| `rounded-sm`   | `var(--ax-radius-sm)`   | 4px    |
| `rounded`      | `var(--ax-radius-md)`   | 6px    |
| `rounded-md`   | `var(--ax-radius-md)`   | 6px    |
| `rounded-lg`   | `var(--ax-radius-lg)`   | 8px    |
| `rounded-xl`   | `var(--ax-radius-xl)`   | 12px   |
| `rounded-2xl`  | `var(--ax-radius-2xl)`  | 16px   |
| `rounded-full` | `var(--ax-radius-full)` | 9999px |

## Shadow Tokens

| Tailwind    | AegisX Token          |
| ----------- | --------------------- |
| `shadow-sm` | `var(--ax-shadow-sm)` |
| `shadow`    | `var(--ax-shadow-md)` |
| `shadow-md` | `var(--ax-shadow-md)` |
| `shadow-lg` | `var(--ax-shadow-lg)` |
| `shadow-xl` | `var(--ax-shadow-xl)` |

## Typography Tokens

### Font Size

| Tailwind    | AegisX Token          |
| ----------- | --------------------- |
| `text-xs`   | `var(--ax-text-xs)`   |
| `text-sm`   | `var(--ax-text-sm)`   |
| `text-base` | `var(--ax-text-base)` |
| `text-lg`   | `var(--ax-text-lg)`   |
| `text-xl`   | `var(--ax-text-xl)`   |
| `text-2xl`  | `var(--ax-text-2xl)`  |

### Font Weight

| Tailwind        | AegisX Token              |
| --------------- | ------------------------- |
| `font-normal`   | `var(--ax-font-normal)`   |
| `font-medium`   | `var(--ax-font-medium)`   |
| `font-semibold` | `var(--ax-font-semibold)` |
| `font-bold`     | `var(--ax-font-bold)`     |

### Line Height

| Tailwind          | AegisX Token                |
| ----------------- | --------------------------- |
| `leading-tight`   | `var(--ax-leading-tight)`   |
| `leading-normal`  | `var(--ax-leading-normal)`  |
| `leading-relaxed` | `var(--ax-leading-relaxed)` |

## Transition Tokens

| Tailwind       | AegisX Token                |
| -------------- | --------------------------- |
| `transition`   | `var(--ax-transition-base)` |
| `duration-150` | `var(--ax-transition-fast)` |
| `duration-200` | `var(--ax-transition-base)` |
| `duration-300` | `var(--ax-transition-slow)` |

## Migration Examples

### Before (Tailwind @apply)

```scss
.ax-card {
  @apply bg-white rounded-lg border border-gray-200 shadow-sm;
  @apply hover:shadow-md transition-shadow duration-200;
}

.ax-card-title {
  @apply text-lg font-semibold text-gray-900;
}
```

### After (CSS Tokens)

```scss
.ax-card {
  background-color: var(--ax-background-default);
  border-radius: var(--ax-radius-lg);
  border: 1px solid var(--ax-border-default);
  box-shadow: var(--ax-shadow-sm);
  transition: box-shadow var(--ax-transition-base);

  &:hover {
    box-shadow: var(--ax-shadow-md);
  }
}

.ax-card-title {
  font-size: var(--ax-text-lg);
  font-weight: var(--ax-font-semibold);
  color: var(--ax-text-heading);
}
```

## Dialog CSS Classes

These are pre-defined classes from `_dialog-shared.scss`:

### Header Classes

```scss
.ax-header              // Base header layout
.ax-header-gradient     // Default gradient (blue)
.ax-header-gradient-info    // Blue gradient
.ax-header-gradient-warning // Yellow gradient
.ax-header-gradient-success // Green gradient
.ax-header-gradient-error   // Red gradient
.ax-header-gradient-neutral // Gray gradient
```

### Icon Wrapper Classes

```scss
.ax-icon-info     // Blue icon with gradient background
.ax-icon-warning  // Yellow icon with gradient background
.ax-icon-success  // Green icon with gradient background
.ax-icon-error    // Red icon with gradient background
.ax-icon-neutral  // Gray icon with gradient background
```

### Text Classes

```scss
.ax-title     // Dialog title text
.ax-subtitle  // Dialog subtitle text
```

### Form Section Classes

```scss
.ax-dialog-section          // Section container
.ax-dialog-section-title    // Section heading
.ax-dialog-section-content  // Section body
.ax-dialog-section-metadata // Read-only metadata section
```

### Field Display Classes (for view dialogs)

```scss
.ax-dialog-field-row    // Row container for label + value
.ax-dialog-field-label  // Field label
.ax-dialog-field-value  // Field value
```

## Benefits of Using Tokens

1. **Dark Mode Support** - Tokens automatically adjust for dark theme
2. **Consistency** - All components use the same values
3. **Easy Updates** - Change token value once, updates everywhere
4. **No Tailwind Dependency** - Component CSS is self-contained
5. **Better Performance** - No Tailwind processing in component styles

---

_Last Updated: Session 73 - CSS Token Migration_
