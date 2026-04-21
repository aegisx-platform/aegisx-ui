# Stat Card Component

## Overview

The `ax-stat-card` is the primary KPI / stat block in `@aegisx/ui`. It packs a
single statistic — value + label — with an icon and optional data payload
(sparkline, ring, bar chart, threshold scale, donut, etc.) into one compact,
clickable tile suitable for list headers, dashboards, and summary rows.

A single component covers **24 layout variants**, driven by the `variant`
input plus a small set of variant-specific payload inputs.

### Key Features

- **24 Variants** — from the dense `compact` tile to rich visual payloads
  (sparkline, ring, gauge, donut, threshold, heatmap, metric-grid, journey,
  ranking, category-browser, etc.)
- **Clickable filter mode** — `[active]` + `(clicked)` for list-page filters
- **Value-as-data defaults** — `valueColor="neutral"` + `iconColor="accent"`
  so the number reads as data while the icon still scans by color
- **Optional progress bar** — set `[progress]` (0–100) on any variant
- **OnPush change detection** + full design-token / dark-mode support via
  `--ax-*` variables
- **Null-safe value** — `[value]` accepts `string | number | null | undefined`
  so Angular's `number`/`currency`/`percent` pipes plug in directly

### Import

```ts
import { AxStatCardComponent } from '@aegisx/ui';
```

Standalone — add to a component's `imports` array.

## Basic Usage

```html
<!-- Display-only KPI -->
<ax-stat-card icon="medication" color="info" [value]="1250 | number" label="ทั้งหมด" subtitle="1,250 รายการ" [clickable]="false" />

<!-- Clickable filter card -->
<ax-stat-card icon="check_circle" color="success" [value]="980" label="ใช้งาน" subtitle="78%" [active]="filter() === 'active'" (clicked)="filter.set('active')" />
```

## Variants at a Glance

| Variant            | Data payload                             | Typical use                                 |
| ------------------ | ---------------------------------------- | ------------------------------------------- |
| `compact`          | — (default)                              | List-header filter tiles                    |
| `icon-leading`     | 48 px icon on the left                   | Workflow status cards scanned by icon first |
| `hero`             | Oversized value + inline delta           | Dashboard header KPI                        |
| `trend`            | Sparkline line chart                     | Daily/weekly movement                       |
| `trend-corner`     | Corner sparkline (60×24, 50 % opacity)   | Manage.City-style KPI tiles                 |
| `ring`             | Circular progress (left) + value (right) | Budget / quota / goal progress              |
| `comparison`       | Actual-vs-target horizontal bar          | Target progress                             |
| `breakdown`        | Breakdown chips                          | Total + constituent parts                   |
| `bars`             | 7-bar mini chart                         | Daily rhythm                                |
| `status`           | Live status dot + last-updated line      | Service / stock health                      |
| `gauge`            | Semi-circle arc                          | Single-metric gauge                         |
| `stacked-bar`      | Multi-segment horizontal bar + legend    | Composition of one metric                   |
| `billboard`        | Oversized value + meta line              | Landing hero                                |
| `dual-metric`      | 2 rows + top split-bar                   | Ratios (pass/fail, visitor/buyer)           |
| `inline-bars`      | Delta chip + horizontal bars             | Compact delta KPIs                          |
| `compare-period`   | Current vs baseline period boxes         | Period comparison                           |
| `threshold`        | Value marker on a min/max scale          | Reorder-point, capacity                     |
| `progress-steps`   | Named pipeline steps                     | Multi-step process progress                 |
| `heatmap`          | 2-D heatmap grid                         | Activity over time-of-day / weekday         |
| `metric-grid`      | 2×2 mini-metrics                         | Quick overview with 4 sub-KPIs              |
| `ranking`          | Top-N list                               | Top products / users                        |
| `journey`          | Current → projected state                | Roadmap / forecast                          |
| `donut-legend`     | 360° donut + legend                      | Share of total                              |
| `gauge-split`      | 180° split gauge + legend                | Share of total (half donut)                 |
| `category-browser` | Prev/next categories with bars           | Browsing categories in limited space        |

## API

### Inputs — Common

| Input           | Type                                    | Default     | Description                                                                |
| --------------- | --------------------------------------- | ----------- | -------------------------------------------------------------------------- |
| `icon`          | `string`                                | `''`        | Material icon name.                                                        |
| `color`         | `StatCardColor`                         | `'info'`    | Semantic color — drives icon bg, active border, and accent tints.          |
| `variant`       | `StatCardVariant`                       | `'compact'` | Layout variant (see table above).                                          |
| `value`         | `string \| number \| null \| undefined` | `''`        | Main stat value. Accepts `null`/`undefined` so Angular pipes pass through. |
| `label`         | `string`                                | `''`        | Card label.                                                                |
| `subtitle`      | `string`                                | `''`        | Optional subtitle (or delta text in `hero`/`inline-bars`).                 |
| `valueColor`    | `'accent' \| 'neutral'`                 | `'neutral'` | Whether the value text inherits the semantic color or stays neutral.       |
| `iconColor`     | `'accent' \| 'neutral'`                 | `'accent'`  | Whether the icon badge follows the semantic color.                         |
| `active`        | `boolean`                               | `false`     | Active/selected state (shows accent border).                               |
| `clickable`     | `boolean`                               | `true`      | Whether the card is interactive (cursor, `role=button`, keyboard).         |
| `progress`      | `number`                                | `undefined` | 0–100. Renders a thin bottom progress bar. Leave `undefined` to hide.      |
| `progressColor` | `StatCardColor`                         | `color`     | Override for the progress bar color.                                       |

> **Note on defaults (breaking change in 0.5.0)** — `valueColor` flipped from
> `accent` → `neutral` to match the Untitled UI / enterprise-SaaS look.
> The small icon badge (`iconColor = 'accent'`) carries the scan hint, while
> the number reads as data. Pages that relied on tinted values must opt back
> in with `valueColor="accent"`.

### Inputs — Variant-specific

| Input               | Type                                   | Used by                       |
| ------------------- | -------------------------------------- | ----------------------------- |
| `trendData`         | `readonly number[]`                    | `trend`, `trend-corner`       |
| `target`            | `number`                               | `comparison`                  |
| `targetLabel`       | `string`                               | `comparison`                  |
| `breakdown`         | `StatCardBreakdownItem[]`              | `breakdown`                   |
| `barData`           | `readonly number[]`                    | `bars`                        |
| `barLabels`         | `readonly string[]`                    | `bars`                        |
| `status`            | `'healthy' \| 'warning' \| 'critical'` | `status`                      |
| `lastUpdated`       | `string`                               | `status`                      |
| `progressLabel`     | `string`                               | `ring`                        |
| `segments`          | `StatCardSegment[]`                    | `stacked-bar`                 |
| `metrics`           | `StatCardMetric[]`                     | `dual-metric`                 |
| `meta`              | `string`                               | `billboard`                   |
| `deltaDirection`    | `'up' \| 'down' \| 'flat'`             | `hero`, `inline-bars`         |
| `periods`           | `StatCardPeriod[]`                     | `compare-period`              |
| `min`, `max`        | `number`                               | `threshold`                   |
| `thresholds`        | `StatCardThreshold[]`                  | `threshold`                   |
| `steps`             | `StatCardStep[]`                       | `progress-steps`              |
| `heatmapData`       | `readonly (readonly number[])[]`       | `heatmap`                     |
| `heatmapRowLabels`  | `readonly string[]`                    | `heatmap`                     |
| `heatmapColLabels`  | `readonly string[]`                    | `heatmap`                     |
| `cells`             | `StatCardGridCell[]`                   | `metric-grid`                 |
| `ranking`           | `StatCardRankItem[]`                   | `ranking`                     |
| `projectedValue`    | `string \| number`                     | `journey`                     |
| `projectedLabel`    | `string`                               | `journey`                     |
| `projectedSubtitle` | `string`                               | `journey`                     |
| `donutSegments`     | `StatCardDonutSegment[]`               | `donut-legend`, `gauge-split` |
| `centerValue`       | `string \| number`                     | `donut-legend`, `gauge-split` |
| `centerLabel`       | `string`                               | `donut-legend`, `gauge-split` |
| `categories`        | `StatCardCategory[]`                   | `category-browser`            |

### Outputs

| Output    | Payload | Description                                                                                            |
| --------- | ------- | ------------------------------------------------------------------------------------------------------ |
| `clicked` | `void`  | Emitted when the card is clicked or activated via enter/space (fires only when `clickable` is `true`). |

### Types

All variant payload types are exported from `@aegisx/ui`:

```ts
import type { StatCardColor, StatCardValueColor, StatCardVariant, StatCardStatus, StatCardBreakdownItem, StatCardSegment, StatCardMetric, StatCardPeriod, StatCardThreshold, StatCardStep, StatCardStepState, StatCardGridCell, StatCardRankItem, StatCardDonutSegment, StatCardCategory } from '@aegisx/ui';
```

## Examples

### Compact (default) — list-header filter row

```html
<div class="grid grid-cols-4 gap-3">
  <ax-stat-card icon="medication" color="info" [value]="1250" label="ทั้งหมด" subtitle="1,250 รายการ" [active]="filter() === 'all'" (clicked)="filter.set('all')" />

  <ax-stat-card icon="check_circle" color="success" [value]="980" label="ใช้งาน" subtitle="78%" [active]="filter() === 'active'" (clicked)="filter.set('active')" />

  <ax-stat-card icon="inventory" color="warning" [value]="23450" label="คงคลัง" subtitle="TAB (47%)" [clickable]="false" />

  <ax-stat-card icon="warning" color="error" [value]="27" label="ใกล้หมดอายุ" [active]="filter() === 'expiring'" (clicked)="filter.set('expiring')" />
</div>
```

### Hero — dashboard header KPI

```html
<ax-stat-card variant="hero" icon="trending_up" color="success" [value]="'฿3.2M' " label="รายได้เดือนนี้" subtitle="+12% vs last month" deltaDirection="up" />
```

### Trend — sparkline

```html
<ax-stat-card variant="trend" icon="receipt_long" color="info" [value]="142" label="ใบรับวันนี้" subtitle="7 วันย้อนหลัง" [trendData]="[90, 110, 104, 130, 120, 155, 142]" />
```

### Ring — progress toward a goal

```html
<ax-stat-card variant="ring" icon="savings" color="warning" [value]="'64%'" label="งบประมาณใช้ไปแล้ว" progressLabel="฿3.2M / ฿5M" [progress]="64" />
```

### Comparison — actual vs target

```html
<ax-stat-card variant="comparison" icon="track_changes" color="info" [value]="1850000" label="ยอดขาย" [target]="2500000" targetLabel="฿2.5M" />
```

### Bars — 7-day rhythm

```html
<ax-stat-card variant="bars" icon="calendar_month" color="primary" [value]="512" label="ยอดต่อวัน" [barData]="[88, 142, 95, 160, 110, 85, 512]" [barLabels]="['M','T','W','T','F','S','S']" />
```

### Status — live indicator + freshness

```html
<ax-stat-card variant="status" icon="dns" color="success" [value]="'99.98%'" label="Uptime" status="healthy" lastUpdated="อัพเดท 2 นาทีที่แล้ว" />
```

### Breakdown — total + constituent parts

```html
<ax-stat-card
  variant="breakdown"
  icon="assignment"
  color="info"
  [value]="427"
  label="ใบเบิกทั้งหมด"
  [breakdown]="[
    { label: 'Pending', value: 42, color: 'warning' },
    { label: 'Approved', value: 310, color: 'success' },
    { label: 'Rejected', value: 75, color: 'error' }
  ]"
/>
```

### Threshold — value marker on a scale

```html
<ax-stat-card
  variant="threshold"
  icon="warehouse"
  color="warning"
  [value]="120"
  label="Stock on hand"
  [min]="0"
  [max]="500"
  [thresholds]="[
    { label: 'Reorder', value: 100, color: 'warning' },
    { label: 'Target',  value: 300, color: 'success' },
    { label: 'Max',     value: 500, color: 'info' }
  ]"
/>
```

### Progress steps — named pipeline

```html
<ax-stat-card
  variant="progress-steps"
  icon="inventory_2"
  color="primary"
  [value]="128"
  label="Receiving pipeline"
  [steps]="[
    { label: 'Draft',   count: 12, state: 'done' },
    { label: 'Inspect', count: 18, state: 'active' },
    { label: 'Accept',  count: 98, state: 'pending' }
  ]"
/>
```

### Dual-metric — 2-way ratio

```html
<ax-stat-card
  variant="dual-metric"
  icon="analytics"
  color="info"
  label="Conversion"
  [metrics]="[
    { label: 'Visitors', value: 12400, delta: '+3.2%', deltaDirection: 'up',   color: 'info' },
    { label: 'Buyers',   value:   934, delta: '+8.1%', deltaDirection: 'up',   color: 'success' }
  ]"
/>
```

### Donut-legend — share of total

```html
<ax-stat-card
  variant="donut-legend"
  icon="pie_chart"
  color="primary"
  centerLabel="Total"
  [centerValue]="'2,257'"
  [donutSegments]="[
    { label: 'Premium',  value:  830, percent: 37, color: 'primary' },
    { label: 'Standard', value:  920, percent: 41, color: 'info' },
    { label: 'Trial',    value:  507, percent: 22, color: 'warning' }
  ]"
/>
```

### With progress bar on any variant

```html
<!-- Works on every variant — opt in with [progress] -->
<ax-stat-card variant="hero" icon="request_page" color="warning" [value]="'฿3.2M'" label="งบเบิกจ่ายไปแล้ว" [progress]="64" progressColor="warning" />
```

### Using Angular pipes on value

```html
<!-- number / currency / percent pipes return string | null — value accepts null -->
<ax-stat-card icon="payments" color="success" [value]="revenue() | currency:'THB':'symbol-narrow':'1.0-0'" label="รายได้" />
```

## Accessibility

- When `clickable` is `true`, the card renders with `role="button"` and
  `tabindex="0"`.
- Both **Enter** and **Space** trigger `clicked`. Space's default scroll
  behaviour is suppressed on `keydown`.
- Use distinct `label` / `subtitle` text — don't rely on color alone to
  convey meaning (color does inform semantic mood via the icon badge).

## Design Tokens

The component reads exclusively from `--ax-*` tokens, so dark mode toggles
automatically via the theme system. No `.dark` class or `isDarkMode` input
is required. Key tokens:

```
--ax-bg-surface            / --ax-bg-subtle
--ax-border-default        / --ax-border-subtle
--ax-text-heading          / --ax-text-secondary / --ax-text-subtle
--ax-color-{primary|info|success|warning|error}-{50|100|500|600}
```

See `TOKEN_REFERENCE.md` for the full list.

## Related

- **[`ax-stat-group`](./stat-group.md)** — wraps a cluster of stat cards
  with a small uppercase section label.
- **[`ax-kpi-card`](../../ax-kpi-card-component.md)** — Tremor-inspired
  KPI card with Simple/Badge/Compact/Accent variants. Simpler API, fewer
  variants — reach for `ax-stat-card` when you need a visual data payload.
