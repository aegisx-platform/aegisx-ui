# Data Table — `.ax-data-table`

Global style hook that turns any Angular Material `mat-table` into the
**AegisX Hospital Platform** canonical data table: muted header, 14px
body, comfortable padding, subtle card chrome, built-in paginator
styling.

Any consumer app in the platform that imports the AegisX styles entry
gets this look for free — this is how the 100+ apps on the platform
stay visually consistent.

## Import

```scss
// app styles.scss — one-line import
@use '@aegisx/ui/styles/components/data-table';
```

During monorepo development (not yet published version):

```scss
@use '../../../libs/aegisx-ui/src/lib/styles/components/data-table';
```

The rule lives in `libs/aegisx-ui/src/lib/styles/components/_data-table.scss`.

## Anatomy

```
┌────────────────────────────────────────────────────────────┐  ← mat-card outlined
│  [bulk action ribbon — shown on row selection]            │     radius 12px
│────────────────────────────────────────────────────────────│     shadow-xs
│  SELECT  CODE          NAME            STATUS    ACTIONS   │  ← 44px header row
│  ────────────────────────────────────────────────────────  │     muted bg
│  ☐  PR-2026-042  Drug X · …   Pending             ⋮       │  ← 14px body
│  ☐  PR-2026-041  Drug Y · …   Approved            ⋮       │     14/20 padding
│  …                                                         │     muted hover
│────────────────────────────────────────────────────────────│
│  Rows per page: 25 ▾   1–25 of 142   < >                  │  ← paginator
└────────────────────────────────────────────────────────────┘     border-top
```

## Required HTML structure

```html
<mat-card appearance="outlined" class="overflow-hidden ax-data-table relative">
  <!-- Optional: bulk action ribbon (visible when rows are selected) -->
  @if (selection.hasValue()) {
  <div class="bg-[var(--ax-info-surface)] border-b border-[var(--ax-info-border)] px-4 py-2 flex items-center justify-between">
    <span class="text-sm font-medium text-[var(--ax-info-default)]"> Selected {{ selection.selected.length }} item(s) </span>
    <button mat-flat-button color="warn" (click)="bulkDelete()">
      <mat-icon>delete</mat-icon>
      Delete selected
    </button>
  </div>
  }

  <!-- Table container (horizontal scroll on narrow screens) -->
  <div class="overflow-x-auto">
    <table mat-table [dataSource]="dataSource" matSort class="w-full">
      <ng-container matColumnDef="code">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Code</th>
        <td mat-cell *matCellDef="let row">{{ row.code }}</td>
      </ng-container>

      <!-- …other columns… -->

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns" class="ax-data-row"></tr>
    </table>
  </div>

  <!-- Paginator -->
  <mat-paginator [length]="total()" [pageSize]="25" [pageSizeOptions]="[25, 50, 100]" showFirstLastButtons></mat-paginator>
</mat-card>
```

**The three non-negotiable hooks:**

1. **`<mat-card appearance="outlined">`** — gives the card chrome
   (radius + border + shadow).
2. **`class="ax-data-table"`** — triggers the global style.
3. **`class="overflow-hidden"`** — clips the card content to the 12px
   radius (so the table's bottom-left / bottom-right corners follow
   the card shape).

`class="relative"` is optional — add it only if the card needs to host
absolute-positioned children (e.g. loading overlay).

## Tokens used

| Token                     | Role                        |
| ------------------------- | --------------------------- |
| `--ax-background-default` | Card + table body bg        |
| `--ax-background-muted`   | Header row + row hover bg   |
| `--ax-border-default`     | Card border + row borders   |
| `--ax-shadow-xs`          | Card shadow                 |
| `--ax-text-default`       | Body cell text              |
| `--ax-text-secondary`     | Header cell + paginator     |
| `--ax-text-subtle`        | Sort arrow                  |
| `--ax-text-disabled`      | Disabled paginator icon     |
| `--ax-border-emphasis`    | Checkbox border (unchecked) |
| `--ax-primary`            | Checkbox fill (checked)     |

All tokens flip automatically in light / dark mode — no extra work
needed.

## Density

Current default = **comfortable** (44px header, 14px 20px body cells,
14px text). If your page needs higher density (e.g. a 50-row
dispensing log), scope a local override:

```scss
:host ::ng-deep .ax-data-table {
  .mat-mdc-cell {
    padding: 10px 20px; /* was 14px */
  }
  .mat-mdc-header-row {
    height: 40px; /* was 44px */
  }
}
```

Never change these defaults in the library — platform consistency
outranks single-page density.

## Loading / empty states

The class doesn't own loading or empty states — those are still
per-component. Recommended:

- `<ax-loading-state overlay="true" />` inside the mat-card while
  refreshing.
- `<ax-empty-state />` inside the card body when `dataSource.data`
  is empty.

## Consumers

Use this class in any list page. Current production consumers in
`aegisx-starter`:

- `/inventory/budget/budget-requests/list`
- `/inventory/budget/budget-request-comments/list`
- `/platform/master-data/provinces|districts|subdistricts|departments|hospitals`
- `/inventory/main-warehouse/receipts`
- `/system/api-keys`
- …and the new `/playbook-demo/*` reference demos.

## Changelog

- **0.5.3 (2026-04-24)** — initial release as a library-global style.
  Extracted from `budget-requests-list.component.scss` (Untitled UI
  style) so every consumer app in the hospital platform gets the same
  data-table look from one source.
