# Dashboard Panel Toolkit

## Overview

The dashboard toolkit is a set of five components that together reproduce the
"Manage.City-style" dark-hero dashboard pattern, all built from `@aegisx/ui`
primitives (`ax-card`, `ax-badge`, `ax-avatar`) and Chart.js.

| Component                      | Selector                  | Purpose                                                                            |
| ------------------------------ | ------------------------- | ---------------------------------------------------------------------------------- |
| `AxDashboardPanelComponent`    | `ax-dashboard-panel`      | Dark-gradient wrapper with optional `[axNav]` top slot + 2-column body             |
| `AxHeroMetricCardComponent`    | `ax-hero-metric-card`     | Blue-gradient hero card (big number + CTA + optional wave chart)                   |
| `AxBarChartAreaComponent`      | `ax-bar-chart-area`       | Paired bar chart on a dark surface (Chart.js 4)                                    |
| `AxMiniAreaChartCardComponent` | `ax-mini-area-chart-card` | White card with value + delta badge + inline SVG area chart                        |
| `AxActivityListCardComponent`  | `ax-activity-list-card`   | Generic dashboard activity list (avatar / primary / amount / status / date / menu) |

All five are standalone, OnPush, and ship from `@aegisx/ui`.

## `ax-dashboard-panel`

Dark-gradient wrapper that hosts a dashboard's hero region: an optional nav
bar at the top + a two-column body (hero card + chart by default).

```html
<ax-dashboard-panel>
  <ax-nav-topbar axNav theme="dark" />

  <ax-hero-metric-card
    label="Total revenue"
    [value]="'$356.7K'"
    pill="+12.4%"
    ctaLabel="View report"
    [stats]="[
      { label: 'Active users', value: '28,452' },
      { label: 'Conversion',   value: '4.3%'  }
    ]"
    [waveData]="[30, 45, 52, 48, 60, 75, 68, 80, 92]"
    waveLabel="Last 9 weeks"
  />

  <ax-bar-chart-area
    title="General processes"
    [periods]="[
      { id: 'W', label: 'W' },
      { id: 'M', label: 'M' },
      { id: 'Y', label: 'Y' }
    ]"
    activePeriod="M"
    [labels]="['Jan','Feb','Mar','Apr','May','Jun']"
    [primary]="[120, 180, 160, 240, 210, 280]"
    [secondary]="[90, 130, 150, 170, 160, 220]"
    primaryLegend="Inbound"
    secondaryLegend="Outbound"
  />
</ax-dashboard-panel>
```

### Inputs / slots

| Slot      | Directive                          | Description                                                                                              |
| --------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `[axNav]` | `AxDashboardPanelNavSlotDirective` | Optional top nav bar. Hidden when no projection matches. Typically `<ax-nav-topbar axNav theme="dark">`. |
| default   | —                                  | Panel body. Expected to contain two direct children (hero + chart); the grid handles placement.          |

The panel is always dark by design — light mode does not flip it. Override
via tokens:

```scss
--ax-dashboard-panel-bg           // linear-gradient(...)
--ax-dashboard-panel-radius       // 20px
--ax-dashboard-panel-padding      // 22px 28px 28px
--ax-dashboard-panel-body-ratio   // 1.4fr 1fr
--ax-dashboard-panel-body-gap     // 24px
--ax-dashboard-accent             // #3b82f6 (used by chart + wave)
--ax-dashboard-accent-soft        // #93c5fd
```

## `ax-hero-metric-card`

Blue-gradient hero card with a primary metric, optional pill chip, CTA
button, right-aligned secondary stats, and an optional SVG wave chart at
the bottom.

### Inputs

| Input       | Type                                     | Default     | Description                                          |
| ----------- | ---------------------------------------- | ----------- | ---------------------------------------------------- |
| `label`     | `string`                                 | `''`        | Small label above value.                             |
| `value`     | `string \| number`                       | `''`        | Big hero value.                                      |
| `pill`      | `string \| undefined`                    | `undefined` | Optional pill chip beside value.                     |
| `ctaLabel`  | `string \| undefined`                    | `undefined` | CTA button text. Hidden if missing.                  |
| `stats`     | `readonly HeroMetricStat[] \| undefined` | `undefined` | Right-aligned `{ label, value }` rows.               |
| `waveData`  | `readonly number[] \| undefined`         | `undefined` | Y values for the bottom SVG wave. Hidden if missing. |
| `waveLabel` | `string \| undefined`                    | `undefined` | Caption above the wave (e.g. "Last 9 weeks").        |

### Outputs

| Output     | Type                 | Description                           |
| ---------- | -------------------- | ------------------------------------- |
| `ctaClick` | `EventEmitter<void>` | Emits when the CTA button is clicked. |

## `ax-bar-chart-area`

Title + period selector + paired bar chart designed to sit directly on a
dark surface. Uses `ng2-charts` / Chart.js 4. Reads
`--ax-dashboard-accent` and `--ax-dashboard-accent-soft` at construction
(Chart.js can't parse `var(...)`).

### Inputs

| Input             | Type                             | Default       | Description                     |
| ----------------- | -------------------------------- | ------------- | ------------------------------- |
| `title`           | `string`                         | `''`          | Section title.                  |
| `periods`         | `readonly BarChartPeriod[]`      | `[W/M/Y]`     | Period toggles.                 |
| `activePeriod`    | `string`                         | `'M'`         | Initial period id.              |
| `labels`          | `readonly string[]`              | `[]`          | X-axis labels.                  |
| `primary`         | `readonly number[]`              | `[]`          | Primary series values.          |
| `secondary`       | `readonly number[] \| undefined` | `undefined`   | Secondary series (paired bars). |
| `primaryLegend`   | `string`                         | `'Primary'`   | Legend label.                   |
| `secondaryLegend` | `string`                         | `'Secondary'` | Legend label.                   |

### Outputs

| Output         | Type                   | Description                             |
| -------------- | ---------------------- | --------------------------------------- |
| `periodChange` | `EventEmitter<string>` | Emits the new period id on user toggle. |

## `ax-mini-area-chart-card`

White card composed from `<ax-card>` + `<ax-badge>`, with a hero number, an
optional delta chip, and an inline SVG area chart.

### Inputs

| Input     | Type                         | Default     | Description                                                                          |
| --------- | ---------------------------- | ----------- | ------------------------------------------------------------------------------------ |
| `title`   | `string`                     | `''`        | Small header above the number.                                                       |
| `value`   | `string \| number`           | `''`        | Hero number.                                                                         |
| `delta`   | `MiniAreaDelta \| undefined` | `undefined` | `{ label, direction: 'up' \| 'down' \| 'flat' }`. Drives badge color + leading icon. |
| `data`    | `readonly number[]`          | `[]`        | Y values for the area chart. Chart hides if empty.                                   |
| `xLabels` | `readonly string[]`          | `[]`        | Optional x labels (not rendered by default but available for future variants).       |
| `flat`    | `boolean`                    | `false`     | Pass-through to wrapping `ax-card` — drops the shadow.                               |

## `ax-activity-list-card`

Generic dashboard activity list — header (title + optional filter) and row
grid (avatar, primary/secondary, amount, status pill, date, trailing menu).
Composes `ax-card`, `ax-avatar`, and `ax-badge`.

### Inputs

| Input               | Type                          | Default                                 | Description                                          |
| ------------------- | ----------------------------- | --------------------------------------- | ---------------------------------------------------- |
| `title`             | `string`                      | `''`                                    | Section title.                                       |
| `items`             | `readonly ActivityListItem[]` | `[]`                                    | Row data.                                            |
| `headerFilterLabel` | `string \| undefined`         | `undefined`                             | Label for a header filter button. Hidden if missing. |
| `columns`           | `ActivityListColumns`         | `{ amount, status, date, menu }` all on | Per-column visibility.                               |
| `flat`              | `boolean`                     | `false`                                 | Pass-through to wrapping `ax-card`.                  |

`ActivityListItem`:

```ts
interface ActivityListItem {
  id: string;
  avatar: { name: string; color?: AvatarColor };
  primary: string;
  secondary?: string;
  amount?: string;
  status?: { label: string; tone: 'success' | 'warning' | 'danger' | 'info' | 'neutral' };
  date?: string;
}
```

### Outputs

| Output          | Type                             | Description                                       |
| --------------- | -------------------------------- | ------------------------------------------------- |
| `itemClick`     | `EventEmitter<ActivityListItem>` | Emitted when a row is clicked.                    |
| `itemMenuClick` | `EventEmitter<ActivityListItem>` | Emitted when the trailing menu icon is clicked.   |
| `filterClick`   | `EventEmitter<void>`             | Emitted when the header filter button is clicked. |

## Example: Full Dashboard Row

```html
<ax-dashboard-panel>
  <ax-nav-topbar axNav theme="dark" />
  <ax-hero-metric-card … />
  <ax-bar-chart-area … />
</ax-dashboard-panel>

<div class="grid grid-cols-3 gap-4 mt-6">
  <ax-mini-area-chart-card title="Revenue" [value]="'$45.2K'" [delta]="{ label: '+12%', direction: 'up' }" [data]="revenueSpark()" />

  <ax-mini-area-chart-card title="New users" [value]="'1,284'" [delta]="{ label: '-3%', direction: 'down' }" [data]="userSpark()" />

  <ax-mini-area-chart-card title="Active rate" [value]="'68%'" [data]="activeSpark()" />
</div>

<ax-activity-list-card class="mt-6 block" title="Latest transactions" headerFilterLabel="This week" [items]="transactions()" />
```

## Imports

All from `@aegisx/ui`:

```ts
import {
  AxDashboardPanelComponent,
  AxDashboardPanelNavSlotDirective, // [axNav] marker
  AxHeroMetricCardComponent,
  AxBarChartAreaComponent,
  AxMiniAreaChartCardComponent,
  AxActivityListCardComponent,
} from '@aegisx/ui';

import type { HeroMetricStat, BarChartPeriod, MiniAreaDelta, ActivityListItem, ActivityListColumns, ActivityListStatusTone } from '@aegisx/ui';
```

## Design Tokens

Shared across the toolkit:

```
--ax-dashboard-accent          // accent hex used by wave + chart
--ax-dashboard-accent-soft     // soft variant for secondary series
--ax-dashboard-panel-*         // panel-specific overrides (see above)
```

All other colors flow from the component-level tokens (`--ax-card-bg`,
`--ax-badge-*`, etc.) and inherit theme changes automatically.

## Related

- **[`ax-stat-card`](../data-display/stat-card.md)** — reach for this for
  smaller KPI tiles below the hero panel.
- **[`ax-nav-shell`](../navigation/nav-shell.md)** — enterprise shell that
  can host a dashboard page inside its main slot.
