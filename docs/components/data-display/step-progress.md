# Step Progress Component

## Overview

`ax-step-progress` is a compact horizontal step-progress timeline — a sequence
of markers (dots / icons) connected by lines, each carrying a status, label
and optional timestamp + actor. Designed for inline use in **data-table rows**
as well as larger **detail-page headers**.

```
● ─── ● ─── ○ ─── ○
Draft  Sub.  App.  Recv.
```

### Key features

- **Three sizes** — `sm` (table rows, 16px markers), `md` (default, 24px),
  `lg` (detail headers, 32px with inline timestamps).
- **Five step states** — `completed` / `current` / `upcoming` / `cancelled` /
  `error` drive marker color, border, and connector styling.
- **Three overflow modes** — `none` (default, natural width), `scroll`
  (horizontal scroll if it overflows), `collapse` (first + current + last +
  neighbours; hidden run rendered as `…+N` bubble with tooltip of hidden
  labels).
- **Icon fallback** — each step takes a Material icon name; falls back to its
  numeric index if `icon` is omitted.
- **Keyboard navigation** — set `[clickable]="true"` → markers become
  focusable, `(stepClick)` fires on Enter/Space/click.
- **ARIA group semantics** — host renders with `role="group"` and per-marker
  `aria-label="Step 2 of 4, Submitted, completed"`.
- **Tokens-only styling** — works in light + dark themes via `--ax-*`
  variables. No hard-coded hex.
- **OnPush**, standalone.

### Import

```ts
import { AxStepProgressComponent } from '@aegisx/ui';
import type { StepProgressItem } from '@aegisx/ui';
```

## Basic usage

### Small inline (table row)

```html
<ax-step-progress [steps]="steps" size="sm" overflow="collapse" [maxVisible]="5" />
```

```ts
readonly steps: StepProgressItem[] = [
  { code: 'draft',     label: 'Draft',     status: 'completed', timestamp: '2026-04-20T09:12:00Z', actor: 'สมชาย ใจดี' },
  { code: 'submitted', label: 'Submitted', status: 'completed', timestamp: '2026-04-20T14:30:00Z', actor: 'คุณสุดา' },
  { code: 'approved',  label: 'Approved',  status: 'current' },
  { code: 'received',  label: 'Received',  status: 'upcoming' },
];
```

### Detail-page header (lg)

```html
<ax-step-progress [steps]="prSteps" size="lg" ariaLabel="Purchase request workflow" />
```

At `size="lg"` each step renders the timestamp under the label; actor is
included in the tooltip.

### Clickable + keyboard

```html
<ax-step-progress [steps]="steps" [clickable]="true" (stepClick)="onStepSelected($event)" />
```

```ts
onStepSelected(step: StepProgressItem): void {
  // step.code, step.status, step.data all available
  console.log('selected', step.code, step.data);
}
```

## Overflow modes

### `none` (default)

Renders every step. Use when you know the list is short (≤ 5) or the
container has generous width (detail headers).

### `scroll`

If total width exceeds the container, scrolls horizontally. Use in side
panels or narrow drawers where trimming would hide context.

### `collapse`

Renders first + current + last + up to `maxVisible - 3` neighbours of the
current step; the hidden run becomes `…+N` bubble. The bubble's tooltip
lists every hidden label. Connectors on both sides of the bubble inherit
their style from the next **real step**, not a hard-coded `upcoming` state —
so the line does not lie about workflow progress.

```html
<ax-step-progress [steps]="longSteps" overflow="collapse" [maxVisible]="5" />
```

With `maxVisible=5` and 9 total steps where the 6th is `current`, you will
see: `step 1 · … · step 5 · step 6 (current) · step 9`.

## API

### Inputs

| Input        | Type                                | Default           | Description                                                |
| ------------ | ----------------------------------- | ----------------- | ---------------------------------------------------------- |
| `steps`      | `StepProgressItem[]` **(required)** | —                 | Ordered list of steps.                                     |
| `size`       | `'sm' \| 'md' \| 'lg'`              | `'sm'`            | Visual density.                                            |
| `overflow`   | `'none' \| 'scroll' \| 'collapse'`  | `'none'`          | Overflow strategy.                                         |
| `maxVisible` | `number`                            | `5`               | Max markers when `overflow='collapse'`. Ignored otherwise. |
| `clickable`  | `boolean`                           | `false`           | Markers focusable + emit `(stepClick)` on activate.        |
| `ariaLabel`  | `string`                            | `'Step progress'` | Host `aria-label`.                                         |

### Outputs

| Output      | Payload            | Fires when                                                                 |
| ----------- | ------------------ | -------------------------------------------------------------------------- |
| `stepClick` | `StepProgressItem` | A marker is activated (click / Enter / Space), `clickable` must be `true`. |

### `StepProgressItem`

```ts
interface StepProgressItem {
  /** Unique key (trackBy, aria identifiers). */
  code: string;
  /** Human-readable step name. Tooltip content + visible label at md/lg. */
  label: string;
  /** Material icon name. Falls back to numeric index when undefined. */
  icon?: string;
  /** Step state — drives color and connector style. */
  status: 'completed' | 'current' | 'upcoming' | 'cancelled' | 'error';
  /** ISO-8601 timestamp. Rendered under label at size=lg. */
  timestamp?: string;
  /** Completed-by (tooltip only). */
  actor?: string;
  /** Free-form passthrough — emitted by (stepClick). */
  data?: unknown;
}
```

## Design notes

### Status colour mapping (via `--ax-*` tokens)

| Status      | Marker                                     | Connector                         |
| ----------- | ------------------------------------------ | --------------------------------- |
| `completed` | filled, `--ax-color-success`               | solid, success                    |
| `current`   | filled, `--ax-color-primary`, subtle pulse | solid up to current, dashed after |
| `upcoming`  | outlined, `--ax-border-muted`              | dashed, muted                     |
| `cancelled` | filled, `--ax-text-subtle`, strikethrough  | dashed, subtle                    |
| `error`     | filled, `--ax-color-error`                 | solid, error                      |

Every colour resolves through tokens → dark-mode flip happens for free.

### Connector after an overflow bubble

The line after a `…+N` bubble inherits from the step **following** the bubble
(skipping the ellipsis node). This prevents the bug where a collapsed run of
completed steps produced an upcoming-style dashed line between them — a
visual lie about workflow state.

### Tooltip composition

- Always: label
- If `status === 'completed'` and `actor`: adds `โดย <actor>`
- If `status === 'completed'` and `timestamp`: adds locale-formatted date
  (`th-TH`)

## Related components

- [ax-timeline](./data-display.md) — vertical multi-entry timeline for
  activity feeds.
- [ax-badge](./data-display.md) — status pill, often paired with
  step-progress to show the _current_ state in a single cell.

## Changelog

- **0.5.2 (2026-04-24)** — initial release.
  - Fix: collapsed connector now inherits from the next real step instead of
    hard-coding `upcoming`.
