# Metadata Grid Component

## Overview

`ax-metadata-grid` renders a semantic `<dl>` (definition list) as an
auto-fit grid. Use it for record headers, detail panes, and anywhere a
compact label/value block replaces a table.

```
┌─────────────────────────────────────────────────────┐
│ LABEL A             LABEL B             LABEL C     │
│ Value A             Value B             Value C     │
│                                                     │
│ LABEL D             LABEL E             LABEL F     │
│ Value D             Value E             Value F     │
└─────────────────────────────────────────────────────┘
```

### Key Features

- **Auto-fit columns** — wraps from N to 1 based on `minColWidth`.
- **Semantic HTML** — `<dl>/<dt>/<dd>` for screen readers.
- **Null-safe** — `null`/`undefined` values render as `—`.
- **Density control** — `comfortable` (default) or `compact`.
- **Design-token styled**, OnPush, standalone.

### Import

```ts
import { AxMetadataGridComponent } from '@aegisx/ui';
```

## Basic Usage

```html
<ax-metadata-grid
  [items]="[
    { label: 'ผู้ขาย',  value: item.vendor },
    { label: 'ยอดรวม',  value: item.amount },
    { label: 'วันที่',   value: item.receivedAt }
  ]"
/>
```

### Inside a record detail pane

```html
<section class="rounded-xl border border-zinc-200 bg-white p-6">
  <header class="flex items-start justify-between mb-6">
    <div>
      <div class="text-xs font-mono text-zinc-500">{{ item.code }}</div>
      <h2 class="text-xl font-semibold">{{ item.name }}</h2>
    </div>
    <button mat-stroked-button>
      <mat-icon>edit</mat-icon>
      แก้ไข
    </button>
  </header>

  <ax-metadata-grid
    [items]="[
      { label: 'SKU',     value: item.sku },
      { label: 'Lot',     value: item.lot },
      { label: 'Expiry',  value: item.expiryDate },
      { label: 'Qty',     value: item.qty },
      { label: 'Unit',    value: item.unit },
      { label: 'Status',  value: item.status }
    ]"
  />
</section>
```

### Compact density

```html
<ax-metadata-grid density="compact" [minColWidth]="140" [items]="shortList" />
```

## API

### Inputs

| Input         | Type                          | Default         | Description                                                  |
| ------------- | ----------------------------- | --------------- | ------------------------------------------------------------ |
| `items`       | `readonly MetadataGridItem[]` | `[]`            | Rows to render.                                              |
| `density`     | `'comfortable' \| 'compact'`  | `'comfortable'` | Tightens row gap + shrinks value font in `compact`.          |
| `minColWidth` | `number` (px)                 | `200`           | Min column width for the `auto-fit` grid. Lower = more cols. |

### Types

```ts
interface MetadataGridItem {
  label: string;
  value: string | number | null | undefined;
}
```

## Design Tokens

```
--ax-text-heading      // value
--ax-text-secondary    // label
```

All row separation is via `gap`; no borders or backgrounds. Place the
grid inside a card/section container for visual chrome.

## Accessibility

- Native `<dl>` / `<dt>` / `<dd>` — screen readers announce label→value pairs.
- `—` placeholder for `null`/`undefined` has `aria-hidden` not applied
  intentionally; it reads as "em dash" which signals "no value."
- No interactivity — pair with `ax-list-item` or buttons when you need
  actions per row.

## Related

- [`ax-list-item`](./list-item.md) — clickable list entry with code +
  title + meta.
- [`ax-field-display`](./field-display.md) — single read-only field
  when a grid is overkill.
- [`ax-description-list`](./description-list.md) — vertical stacked
  definition list.
