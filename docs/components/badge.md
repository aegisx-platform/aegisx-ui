# Badge Component Documentation

## Overview

The Badge component (`AxBadgeComponent`) is a versatile UI element for displaying status, labels, priorities, and metadata with customizable styling. It's inspired by Tremor design patterns and fully integrated with Angular Material and AegisX design tokens.

## Features

- **Multiple Variants**: outlined, soft, outlined-strong
- **Semantic Types**: success, error, warning, info, neutral
- **Three Sizes**: sm, md, lg
- **Border Radius Control**: none, sm, md, lg, full
- **Indicators**: Dots (circles) and squares
- **Icons**: Material icon support
- **Counters**: Numeric badges
- **Removable**: Tag-style badges with close button
- **Fully Themeable**: Uses AegisX design tokens

## Installation

The Badge component is part of the `@aegisx/ui` library:

```typescript
import { AxBadgeComponent } from '@aegisx/ui';

@Component({
  // ...
  imports: [AxBadgeComponent]
})
```

## Basic Usage

### Simple Badge

```html
<ax-badge type="success">Active</ax-badge>
<ax-badge type="error">Error</ax-badge>
<ax-badge type="warning">Warning</ax-badge>
<ax-badge type="info">Info</ax-badge>
<ax-badge type="neutral">Neutral</ax-badge>
```

### Variants

```html
<!-- Outlined (default) - Lightweight, border only -->
<ax-badge variant="outlined" type="success">Active</ax-badge>

<!-- Soft - Filled background -->
<ax-badge variant="soft" type="success">Active</ax-badge>

<!-- Outlined Strong - Thick border -->
<ax-badge variant="outlined-strong" type="success">Active</ax-badge>
```

### Sizes

```html
<ax-badge size="sm">Small</ax-badge> <ax-badge size="md">Medium</ax-badge>
<!-- Default -->
<ax-badge size="lg">Large</ax-badge>
```

### Border Radius

```html
<ax-badge rounded="none">Sharp</ax-badge> <ax-badge rounded="sm">Default</ax-badge>
<!-- Default: 6px -->
<ax-badge rounded="md">Medium</ax-badge>
<!-- 8px -->
<ax-badge rounded="lg">Large</ax-badge>
<!-- 12px -->
<ax-badge rounded="full">Pill</ax-badge>
<!-- Fully rounded -->
```

## Advanced Features

### With Icons

```html
<ax-badge variant="soft" type="success" icon="trending_up">+9.3%</ax-badge> <ax-badge variant="soft" type="error" icon="trending_down">-1.9%</ax-badge>
```

### With Dots (Status Indicators)

```html
<ax-badge variant="soft" type="success" [dot]="true">Online</ax-badge>
<ax-badge variant="soft" type="warning" [dot]="true">Away</ax-badge>
<ax-badge variant="soft" type="error" [dot]="true">Busy</ax-badge>
```

### With Squares

```html
<ax-badge variant="outlined" type="success" [square]="true">Active</ax-badge> <ax-badge variant="outlined" type="error" [square]="true">Failed</ax-badge>
```

### Priority Badges

Priority badges use neutral borders with colored indicators only:

```html
<!-- Outlined + Dot = Neutral border, colored dot -->
<ax-badge variant="outlined" type="error" [dot]="true">Emergency</ax-badge>
<ax-badge variant="outlined" type="warning" [dot]="true">High</ax-badge>
<ax-badge variant="outlined" type="neutral" [dot]="true">Medium</ax-badge>
<ax-badge variant="outlined" type="success" [dot]="true">Low</ax-badge>
```

### Counter Badges

```html
<ax-badge variant="outlined" type="info" [counter]="12">Messages</ax-badge>
<ax-badge variant="outlined" type="error" [counter]="5">Errors</ax-badge>
<ax-badge variant="outlined" type="warning" [counter]="99">Updates</ax-badge>
```

### Removable Badges (Tags)

```html
<ax-badge variant="soft" type="info" [removable]="true" (remove)="onRemove()"> TypeScript </ax-badge>
```

## API Reference

### Inputs

| Property    | Type                                                       | Default     | Description                   |
| ----------- | ---------------------------------------------------------- | ----------- | ----------------------------- |
| `variant`   | `'outlined' \| 'soft' \| 'outlined-strong'`                | `'soft'`    | Badge style variant           |
| `type`      | `'success' \| 'error' \| 'warning' \| 'info' \| 'neutral'` | `'neutral'` | Semantic type/color           |
| `size`      | `'sm' \| 'md' \| 'lg'`                                     | `'md'`      | Badge size                    |
| `rounded`   | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'`                 | `'sm'`      | Border radius size            |
| `icon`      | `string`                                                   | `undefined` | Material icon name            |
| `dot`       | `boolean`                                                  | `false`     | Show colored dot indicator    |
| `square`    | `boolean`                                                  | `false`     | Show colored square indicator |
| `removable` | `boolean`                                                  | `false`     | Show remove/close button      |
| `counter`   | `number`                                                   | `undefined` | Show counter value            |

### Outputs

| Event    | Type   | Description                           |
| -------- | ------ | ------------------------------------- |
| `remove` | `void` | Emitted when remove button is clicked |

## Common Use Cases

### Status Indicators

```html
<ax-badge variant="outlined" type="success">Active</ax-badge>
<ax-badge variant="outlined" type="warning">Pending</ax-badge>
<ax-badge variant="outlined" type="error">Failed</ax-badge>
```

### Priority Levels

```html
<!-- With dots -->
<ax-badge variant="outlined" type="error" [dot]="true">Emergency</ax-badge>
<ax-badge variant="outlined" type="warning" [dot]="true">High</ax-badge>
<ax-badge variant="outlined" type="neutral" [dot]="true">Medium</ax-badge>
<ax-badge variant="outlined" type="success" [dot]="true">Low</ax-badge>

<!-- With squares -->
<ax-badge variant="outlined" type="error" [square]="true">P0</ax-badge>
<ax-badge variant="outlined" type="warning" [square]="true">P1</ax-badge>
<ax-badge variant="outlined" type="neutral" [square]="true">P2</ax-badge>
<ax-badge variant="outlined" type="success" [square]="true">P3</ax-badge>
```

### Metric Badges

```html
<ax-badge variant="soft" type="success" icon="trending_up">+9.3%</ax-badge>
<ax-badge variant="soft" type="error" icon="trending_down">-1.9%</ax-badge>
<ax-badge variant="soft" type="neutral" icon="remove">0.0%</ax-badge>
```

### Notification Counts

```html
<ax-badge variant="outlined" type="error" [counter]="5">Errors</ax-badge>
<ax-badge variant="outlined" type="info" [counter]="12">Messages</ax-badge>
<ax-badge variant="outlined" type="warning" [counter]="99">Updates</ax-badge>
```

### Tags/Filters

```html
<ax-badge variant="soft" type="info" [removable]="true" (remove)="removeTag('typescript')"> TypeScript </ax-badge>

<ax-badge variant="soft" type="success" [removable]="true" (remove)="removeTag('angular')"> Angular </ax-badge>
```

### Email Status (Real-World Example)

```html
<!-- Based on screenshot provided -->
<ax-badge variant="outlined" type="success" rounded="full" [dot]="true"> Closed </ax-badge>
<ax-badge variant="outlined" type="neutral" rounded="md" [dot]="true"> Drafted </ax-badge>
<ax-badge variant="outlined" type="info" rounded="md" [dot]="true"> Sent </ax-badge>
```

## Best Practices

### ✅ Do

- Use **outlined** variant for most use cases - it's lighter and less distracting
- Use **Emergency** (red) sparingly - only for critical issues
- Use **dots** for status/priority, **icons** for trends/actions
- Be consistent across your application - pick one style and stick with it
- Use smaller sizes (`sm`) in tables and dense layouts
- Combine with timestamps or assignees for complete context

### ❌ Don't

- Don't use too many Emergency badges - it dilutes their impact
- Don't mix dots and squares in the same view - choose one style
- Don't use soft variant everywhere - save it for emphasis
- Don't forget to update priority when status changes
- Don't use dot AND square together - choose one indicator type
- Don't use icon AND dot together - creates visual clutter

## Styling & Theming

The Badge component uses AegisX design tokens for consistent theming:

```scss
// Colors
--ax-success-default, --ax-success-faint, --ax-success-emphasis
--ax-error-default, --ax-error-faint, --ax-error-emphasis
--ax-warning-default, --ax-warning-faint, --ax-warning-emphasis
--ax-info-default, --ax-info-faint, --ax-info-emphasis

// Spacing
--ax-spacing-2xs, --ax-spacing-sm, --ax-spacing-md, --ax-spacing-lg

// Border radius
--ax-radius-sm (6px), --ax-radius-md (8px), --ax-radius-lg (12px)

// Typography
--ax-text-xs, --ax-font-normal
```

## Accessibility

- Badge text should be descriptive and concise (1-2 words)
- Use semantic colors that convey meaning (green = success, red = error)
- Ensure sufficient color contrast for readability
- Don't rely solely on color to convey information

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Angular 17+
- Angular Material 17+

## Examples & Demo

Visit the live demo page at `/badges` to see all badge variations in action:

- Basic badges
- Variants (outlined, soft, outlined-strong)
- Sizes (sm, md, lg)
- Border radius options (none, sm, md, lg, full)
- Priority badges
- Feature matrix
- Real-world examples

## TypeScript Types

```typescript
export type BadgeVariant = 'outlined' | 'soft' | 'outlined-strong';
export type BadgeType = 'success' | 'error' | 'warning' | 'info' | 'neutral';
export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgeRounded = 'none' | 'sm' | 'md' | 'lg' | 'full';
```

## Component Source

Location: `libs/aegisx-ui/src/lib/components/data-display/badge/`

Files:

- `badge.component.ts` - Component logic
- `badge.component.html` - Template
- `badge.component.scss` - Styles

## Related Components

- **Chip** - Material chip component for selections
- **Tag** - Alternative tag component
- **Label** - Simple text labels

## Changelog

### v1.1.0 (Latest)

- ✨ Added `rounded` property with 5 border radius options
- ✨ Added `square` indicator type
- 🎨 Changed default font-weight to normal (lighter appearance)
- 🎨 Added priority badge styling (neutral border, colored indicators)

### v1.0.0

- 🎉 Initial release
- Basic badge variants and types
- Icon and dot support
- Counter and removable features
