# List Item Component

## Overview

`ax-list-item` is a compact 3-line row — `code + title + meta` — used in
master-detail list panes, hub sections, settings groups, and anywhere a
clickable list entry is needed. Extracted from the L6 split-view
archetype in `/layouts-demo`.

```
┌─────────────────────────────────────────────────────┐
│ [leading]  CODE  TITLE                 [trailing]   │
│            meta · meta · meta                       │
└─────────────────────────────────────────────────────┘
```

### Key Features

- **Stateful** — `active` flag paints the accent highlight; `(clicked)`
  emits on tap/enter/space.
- **Flexible meta** — pass a `string` (auto-split on `·`) or a
  `string[]`. Separators rendered by the component.
- **Leading / trailing slots** — drop icons, avatars, or badges via
  `<... slot="leading">` / `<... slot="trailing">`.
- **Density control** — `comfortable` (default) or `compact`.
- **Design-token styled** — inherits dark/light automatically.
- **OnPush**, standalone, `role="button"` with keyboard support.

### Import

```ts
import { AxListItemComponent } from '@aegisx/ui';
```

## Basic Usage

```html
<ax-list-item code="R-2026-042" title="ตรวจรับยาอมทรอกซ์" meta="บริษัท XYZ · ฿125,000" [active]="selectedId() === item.id" (clicked)="selectedId.set(item.id)"> </ax-list-item>
```

### With trailing badge

```html
<ax-list-item code="PR-2026-011" title="ใบขอซื้อยาแผนกฉุกเฉิน" [meta]="['คุณสมชาย', '฿45,200', '14:23']">
  <ax-badge color="warning" variant="soft" slot="trailing"> รออนุมัติ </ax-badge>
</ax-list-item>
```

### With leading avatar

```html
<ax-list-item title="Dr. Somchai Jantaraprapas" meta="Cardiology · On call">
  <ax-avatar initials="SJ" slot="leading" />
  <ax-badge color="success" variant="soft" slot="trailing"> Online </ax-badge>
</ax-list-item>
```

### List of items in a bordered card

```html
<div class="rounded-lg border border-zinc-200 bg-white overflow-hidden">
  @for (item of items(); track item.id) {
  <ax-list-item [code]="item.code" [title]="item.name" [meta]="[item.vendor, item.amount]" [active]="selectedId() === item.id" (clicked)="selectedId.set(item.id)"> </ax-list-item>
  }
</div>
```

> Tip: `ax-list-item` auto-removes its bottom border on `:last-child`, so
> wrapping in any container without separators will still look clean.

## API

### Inputs

| Input     | Type                          | Default         | Description                                                                  |
| --------- | ----------------------------- | --------------- | ---------------------------------------------------------------------------- |
| `code`    | `string`                      | `''`            | Short mono-spaced code shown before the title (e.g. `PR-2026-011`).          |
| `title`   | `string`                      | `''`            | Primary label.                                                               |
| `meta`    | `string \| readonly string[]` | `[]`            | Secondary metadata. `string` is auto-split on `·`. Separators auto-rendered. |
| `active`  | `boolean`                     | `false`         | Selected/highlighted state.                                                  |
| `density` | `'comfortable' \| 'compact'`  | `'comfortable'` | Tightens padding + gap in `compact`.                                         |

### Outputs

| Output    | Type                 | Description            |
| --------- | -------------------- | ---------------------- |
| `clicked` | `EventEmitter<void>` | Click / Enter / Space. |

### Content Slots

| Slot              | Description                                    |
| ----------------- | ---------------------------------------------- |
| `[slot=leading]`  | Rendered before the code/title (icon, avatar). |
| `[slot=trailing]` | Rendered after the body (badge, chevron).      |

## Design Tokens

```
--ax-text-default      // body
--ax-text-heading      // title
--ax-text-secondary    // code, meta
--ax-text-subtle       // meta separator
--ax-border-subtle     // row divider
--ax-background-muted  // hover
--ax-brand-faint       // active bg
--ax-primary           // active text, focus ring
```

## Accessibility

- Renders as `<button>` so keyboard / screen readers treat it as one.
- `aria-pressed` binds to `active` for toggle semantics.
- Focus ring uses the primary token — visible in both light and dark.

## Related

- [`ax-timeline`](./timeline.md) — vertical activity feed (item list with
  a time rail).
- [`ax-activity-list-card`](./activity-list-card.md) — richer list card
  with avatar + amount + status + date columns.
- [`ax-metadata-grid`](./metadata-grid.md) — companion for the detail
  pane's label/value block.
