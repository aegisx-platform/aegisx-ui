# Stat Group Component

## Overview

`ax-stat-group` is a thin labeled wrapper around a cluster of
[`ax-stat-card`](./stat-card.md) tiles. It renders a small uppercase section
label (with an optional leading Material icon) above any content you project
— typically a grid or stack of stat cards.

Use it when a dashboard row splits into logical groupings ("ขาเข้า /
ขาออก", "Customers / Revenue / Churn") and the grouping itself needs a
header to be legible.

### Key Features

- **Signal-based inputs** (`input()`) — only re-renders when label/icon change
- **Content-projected body** — drop any grid/stack of cards or components
- **Design-token styled** — reads `--ax-text-secondary`, `--ax-text-subtle`,
  no hard-coded colors, flips automatically in dark mode
- **OnPush change detection**
- **Zero required inputs** — both `label` and `icon` are optional

### Import

```ts
import { AxStatGroupComponent } from '@aegisx/ui';
```

## API

### Inputs

| Input   | Type     | Default | Description                                   |
| ------- | -------- | ------- | --------------------------------------------- |
| `label` | `string` | `''`    | Uppercase section label (e.g. `"ขาเข้า"`).    |
| `icon`  | `string` | `''`    | Optional Material icon rendered beside label. |

When both `label` and `icon` are empty, the header is suppressed entirely and
the group renders as a plain vertical stack.

### Content Projection

A single default slot — place anything inside: a grid, a row, or a vertical
stack of cards.

## Usage

### Vertical stack (default)

```html
<ax-stat-group label="ขาเข้า" icon="call_received">
  <ax-stat-card variant="hero" icon="receipt_long" color="info" [value]="142" label="ใบรับวันนี้" />
  <ax-stat-card variant="hero" icon="inventory_2" color="success" [value]="89" label="GRN เสร็จสิ้น" />
</ax-stat-group>
```

### Inner 2×2 grid

```html
<ax-stat-group label="ใบเบิก · จ่ายออก" icon="move_to_inbox">
  <div class="grid grid-cols-2 gap-2">
    <ax-stat-card icon="pending_actions" color="warning" [value]="12" label="รออนุมัติ" />
    <ax-stat-card icon="check_circle" color="success" [value]="84" label="อนุมัติแล้ว" />
    <ax-stat-card icon="close" color="error" [value]="3" label="ถูกปฏิเสธ" />
    <ax-stat-card icon="archive" color="info" [value]="210" label="จบงาน" />
  </div>
</ax-stat-group>
```

### Groups across a dashboard row

```html
<div class="grid grid-cols-3 gap-6">
  <ax-stat-group label="Customers" icon="group">…</ax-stat-group>
  <ax-stat-group label="Revenue" icon="payments">…</ax-stat-group>
  <ax-stat-group label="Churn" icon="trending_down">…</ax-stat-group>
</div>
```

## Anatomy

```
┌─ ax-stat-group ────────────────────────┐
│  ▪ icon   LABEL (11 px, uppercase)     │ ← header (optional)
│ ─────────────────────────────────────  │
│  <your content here>                   │ ← body (ng-content)
└────────────────────────────────────────┘
```

## Design Tokens

```
--ax-text-secondary   // label color
--ax-text-subtle      // icon color
```

No custom colors, no elevation — the group is intentionally quiet so the
cards it wraps remain the focus.

## Related

- **[`ax-stat-card`](./stat-card.md)** — the primary content of a group
