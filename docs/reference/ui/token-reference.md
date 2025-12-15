---
title: 'Token Reference'
description: 'Design token reference for AegisX UI'
category: reference
tags: [ui, tokens, design-system]
---

# AegisX UI Token Reference

**Version:** 2.0.0
**Last Updated:** 2025-01-20

Complete catalog of all design tokens available in the AegisX UI library.

## Material Design 3 Tokens

These tokens are provided by Angular Material and automatically adjust based on the selected theme (light/dark).

### System Color Tokens

#### Primary Colors

```scss
--mat-sys-primary                // Primary brand color
--mat-sys-on-primary             // Text/icons on primary
--mat-sys-primary-container      // Container using primary color
--mat-sys-on-primary-container   // Text/icons on primary container
```

#### Surface Colors

```scss
--mat-sys-surface                // Default surface background
--mat-sys-on-surface             // Primary text on surface
--mat-sys-surface-variant        // Alternative surface shade
--mat-sys-on-surface-variant     // Secondary text on surface
--mat-sys-surface-container      // Elevated surface
--mat-sys-surface-container-low  // Subtle elevated surface
--mat-sys-surface-container-high // Prominent elevated surface
```

#### Semantic Colors

```scss
--mat-sys-error                  // Error state color
--mat-sys-on-error               // Text/icons on error
--mat-sys-error-container        // Error container background
--mat-sys-on-error-container     // Text/icons on error container
```

#### Border/Outline Colors

```scss
--mat-sys-outline                // Default border/divider
--mat-sys-outline-variant        // Subtle border/divider
```

#### Background Colors

```scss
--mat-sys-background             // Page background
--mat-sys-on-background          // Text on page background
```

### Elevation Tokens

```scss
--mat-sys-level0                 // No elevation (flat)
--mat-sys-level1                 // Subtle elevation
--mat-sys-level2                 // Low elevation
--mat-sys-level3                 // Medium elevation
--mat-sys-level4                 // High elevation
--mat-sys-level5                 // Maximum elevation
```

## Material Component Tokens

Component-specific tokens that can be set to customize Material components.

### Dialog Tokens

```scss
// Container
--mdc-dialog-container-min-width
--mdc-dialog-container-max-width
--mdc-dialog-container-shape

// Padding (format: top left/right bottom)
--mat-dialog-headline-padding
--mat-dialog-supporting-text-padding
--mat-dialog-actions-padding

// Alignment
--mat-dialog-actions-alignment       // start | center | end

// Color & elevation (usually don't override)
--mdc-dialog-container-color
--mdc-dialog-container-elevation-shadow
```

**Example:**

```scss
.mat-mdc-dialog-container {
  --mdc-dialog-container-min-width: 400px;
  --mdc-dialog-container-max-width: 900px;
  --mdc-dialog-container-shape: 12px;
  --mat-dialog-headline-padding: 16px 24px 16px;
  --mat-dialog-supporting-text-padding: 24px;
  --mat-dialog-actions-padding: 16px 24px 16px;
  --mat-dialog-actions-alignment: end;
}
```

### Button Tokens

Configure via `mat.button-overrides()` mixin:

```scss
@include mat.button-overrides(
  (
    // Shape
    filled-container-shape,
    outlined-container-shape,
    text-container-shape,
    // Colors
    filled-container-color,
    outlined-outline-color,
    // Typography
    label-text-size,
    label-text-weight
  )
);
```

**Available tokens:** See [Material Button Theming](https://material.angular.io/components/button/api#theming)

### Card Tokens

Configure via `mat.card-overrides()` mixin:

```scss
@include mat.card-overrides(
  (
    // Elevated variant
    elevated-container-color,
    elevated-container-shape,
    elevated-container-elevation,
    // Outlined variant
    outlined-outline-color,
    outlined-outline-width,
    outlined-container-shape,
    // Filled variant (M3)
    filled-container-color
  )
);
```

**Available tokens:** See [Material Card Theming](https://material.angular.io/components/card/api#theming)

### Form Field Tokens

Configure via `mat.form-field-overrides()` mixin:

```scss
@include mat.form-field-overrides(
  (
    // Container
    container-height,
    container-vertical-padding,
    // Label
    outlined-label-text-populated-size,

    // Outline
    outline-color,
    outline-width
  )
);
```

**Available tokens:** See [Material Form Field Theming](https://material.angular.io/components/form-field/api#theming)

### Table Tokens

Configure via `mat.table-overrides()` mixin:

```scss
@include mat.table-overrides(
  (
    // Container
    background-color,

    // Header
    header-headline-color,
    header-headline-weight,
    // Rows
    row-item-label-text-color,
    row-item-outline-color,
    row-item-outline-width
  )
);
```

### Chip Tokens

Configure via `mat.chips-overrides()` mixin:

```scss
@include mat.chips-overrides(
  (
    // Container
    elevated-container-color,
    elevated-container-shape,
    elevated-container-elevation,
    // Outlined variant
    outlined-outline-color,
    outlined-outline-width
  )
);
```

### Menu Tokens

Configure via `mat.menu-overrides()` mixin:

```scss
@include mat.menu-overrides((container-color, container-shape, container-elevation-shadow, item-label-text-color, item-hover-state-layer-color));
```

### Tabs Tokens

Configure via `mat.tabs-overrides()` mixin:

```scss
@include mat.tabs-overrides(
  (
    // Inactive tabs
    inactive-label-text-color,
    inactive-ripple-color,
    // Active tab
    active-label-text-color,
    active-ripple-color,
    active-indicator-color,
    active-indicator-height,
    active-indicator-shape
  )
);
```

## Reference Links

- **Material Design 3:** [m3.material.io](https://m3.material.io/)
- **Angular Material Theming:** [material.angular.io/guide/theming](https://material.angular.io/guide/theming)
- **Material Component APIs:** Check each component's API tab for available tokens
- **AegisX Theme System:** [THEME_SYSTEM_STANDARD.md](./THEME_SYSTEM_STANDARD.md)
