# AGENTS.md — Rules for AI assistants working in `@aegisx/ui`

> Read this **before** writing any component or page that imports `@aegisx/ui`.
> Pair with [`llms.txt`](./llms.txt) (component map) and
> [`docs/TOKEN_REFERENCE.md`](./docs/TOKEN_REFERENCE.md) (token list).

---

## 1. Component selection — decision tree

```
Need a UI element?
  │
  ├─ Is it in `@aegisx/ui`?           → use the ax-* component
  │     (check llms.txt component map; open docs/components/<category>/<name>.md)
  │
  ├─ Is it a primitive Angular Material covers?  → use mat-*
  │     (text input, select, checkbox, radio, slider, toggle, dialog, snackbar,
  │      tooltip, tabs, expansion-panel, table primitives — Material first)
  │
  ├─ Can you compose it from existing ax-* + mat-*?  → compose it
  │     (do not invent new primitives just because a layout is novel)
  │
  └─ Truly novel?                      → ask the human first
        (never invent design tokens, never inline hex, never duplicate Material)
```

**Forbidden shortcuts:**

- ❌ Wrapping a `<div>` to mimic `ax-card` because you forgot the import.
- ❌ Reaching for a generic Tailwind component recipe from training data.
- ❌ Inventing a "new" component when a slight variant already exists
  (`ax-stat-card` has 24 variants — try them before building).

---

## 2. Standalone component template (copy this)

```typescript
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AxCardComponent, AxFormSectionComponent } from '@aegisx/ui';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-some-feature',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AxCardComponent, AxFormSectionComponent, MatButtonModule],
  template: `
    <ax-card>
      <ax-form-section title="Details">
        @if (loading()) {
          <ax-skeleton-card />
        } @else {
          @for (item of items(); track item.id) {
            <div class="flex items-center gap-3 p-3">
              <span>{{ item.label }}</span>
            </div>
          }
        }
      </ax-form-section>

      <button mat-flat-button color="primary" (click)="save()">บันทึก</button>
    </ax-card>
  `,
})
export class SomeFeatureComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly api = inject(MyApiService);

  readonly loading = signal(false);
  readonly items = signal<Item[]>([]);
  readonly hasItems = computed(() => this.items().length > 0);

  save(): void {
    this.loading.set(true);
    this.api
      .save()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.loading.set(false),
        error: () => this.loading.set(false),
      });
  }
}
```

**Non-negotiables in every component:**

- `standalone: true` (NgModule not allowed for new components)
- `ChangeDetectionStrategy.OnPush`
- `inject()` for all DI (no constructor parameters)
- Signals (`signal`, `computed`, `linkedSignal`, `resource`) for state
- Native control flow (`@if` / `@for` / `@switch`) — never `*ngIf` / `*ngFor`
- `takeUntilDestroyed(destroyRef)` for teardown — never `Subject` + `takeUntil`

---

## 3. Token-only styling

Every semantic value (color, border, shadow, radius, font-size,
font-weight, transition) must come from a token.

```scss
/* ✅ Correct */
.my-card {
  background: var(--mat-sys-surface-container);  /* or --ax-bg-surface */
  color: var(--mat-sys-on-surface);              /* or --ax-text-heading */
  border: 1px solid var(--mat-sys-outline-variant);
  border-radius: var(--ax-radius-lg);
  box-shadow: var(--ax-shadow-sm);
  padding: var(--ax-spacing-md);
}

/* ❌ Forbidden */
.my-card {
  background: #ffffff;                       /* hardcoded */
  border: 1px solid #e4e4e7;                 /* hardcoded */
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);    /* hardcoded */
  border-radius: 12px;                       /* hardcoded */
}

/* ❌ Forbidden — manual dark mode */
:host-context(.dark) .my-card { background: #1c1b1f; }
@media (prefers-color-scheme: dark) { … }
```

Tokens flip light/dark automatically when `data-theme` changes on `<html>`.
Components must not know which mode is active.

**Component-level overrides:** target the `--ax-*` semantic wrappers
(e.g. `--ax-button-primary-bg`, `--ax-nav-topbar-item-active-bg`) — never
override Material's `--mdc-*` directly.

---

## 4. Tailwind rules (layout only)

```html
<!-- ✅ allowed: layout glue -->
<div class="flex items-center justify-between gap-4 p-4">
  <ax-card>...</ax-card>
  <button mat-flat-button color="primary">Save</button>
</div>

<!-- ❌ forbidden: appearance via Tailwind on Material/ax components -->
<button class="px-4 py-2 bg-blue-500 text-white rounded shadow-sm hover:bg-blue-600">Save</button>

<!-- ✅ correct equivalent -->
<button mat-flat-button color="primary">Save</button>
```

| Tailwind use                     | Allowed?                      |
| -------------------------------- | ----------------------------- |
| `flex`, `grid`                   | ✅ layout                     |
| `gap-*`, `p-*`, `m-*`, `space-*` | ✅ spacing                    |
| `w-*`, `h-*`, `max-w-*`          | ✅ sizing                     |
| `sm: md: lg:`                    | ✅ responsive                 |
| `hidden`, `block`                | ✅ display                    |
| `bg-*`, `text-*` (color)         | ❌ use component / token      |
| `rounded-*`, `shadow-*`          | ❌ use token                  |
| `font-*`, `text-xs/sm/lg/xl`     | ❌ use token                  |
| `hover:*`, `dark:*`              | ❌ use token / Material state |
| `transition-*`, `animate-*`      | ❌ use animation triggers     |

---

## 5. Common pitfalls (real bugs we've shipped)

### 5.1 `ax-loading-button` only when async

Use `ax-loading-button` only on buttons that have a `[loading]` signal
bound to actual async state. Plain confirm buttons stay as Material:

```html
<!-- ✅ async submit -->
<ax-loading-button [loading]="saving()" (axClick)="save()">บันทึก</ax-loading-button>

<!-- ❌ over-using on a sync close button -->
<ax-loading-button (axClick)="close()">ปิด</ax-loading-button>

<!-- ✅ correct -->
<button mat-button (click)="close()">ปิด</button>
```

### 5.2 `axDialog.confirm()` returns Observable

```typescript
// ❌ wrong — await on Observable resolves immediately to the Observable
const ok = await this.dialog.confirm({ ... });

// ✅ correct
const ok = await firstValueFrom(this.dialog.confirm({ ... }));
```

### 5.3 Signal circular dependency

Never bind a child output back into the same input the parent passes down.
Causes `NG0103`.

```typescript
// ❌ child emits selectedId; parent assigns to selectedId signal that flows
//    back into the child's [selectedId] input → loop
@Output() selectedIdChange = output<string>();
@Input() selectedId = input<string>();

// ✅ rename emit OR use linkedSignal that the parent owns; do not
//    feed the same value back without a guard.
```

### 5.4 `@if` inside `mat-button`

`@if` adds/removes nodes — when used inside a `mat-button` it breaks
ripple/density. Toggle visibility with `[class.invisible]` or pull the
conditional outside the button content.

```html
<!-- ❌ -->
<button mat-flat-button>@if (saving()) { <mat-spinner diameter="16" /> } Save</button>

<!-- ✅ -->
<button mat-flat-button>
  <span class="inline-flex items-center gap-2">
    <mat-spinner diameter="16" [class.invisible]="!saving()" />
    <span>Save</span>
  </span>
</button>
```

### 5.5 `space-y-*` does not work with `@if` / `@for`

Tailwind's `space-y-*` relies on adjacent-sibling selectors.
`@if`/`@for` insert anchor comments that break the chain — use `mb-*` or
`gap-*` on a flex/grid parent instead.

### 5.6 Dropdown/select for FK fields

Foreign-key fields in forms must be dropdowns (`mat-select`) or
autocompletes — never raw ID inputs. Users do not know IDs.

```html
<!-- ❌ -->
<mat-form-field><mat-label>Budget ID</mat-label><input matInput [(ngModel)]="budgetId" /></mat-form-field>

<!-- ✅ -->
<mat-form-field>
  <mat-label>Budget</mat-label>
  <mat-select [(ngModel)]="budgetId">
    @for (b of budgets(); track b.id) {
    <mat-option [value]="b.id">{{ b.code }} — {{ b.name }}</mat-option>
    }
  </mat-select>
</mat-form-field>
```

### 5.7 Stats / KPI cards must come from a server endpoint

Do not derive `total`, `available`, `recentWeek` from a paged list —
the page only has 25 rows. Call a dedicated `/stats` endpoint and bind
its result to the KPI cards.

---

## 6. Page scaffold convention

Every new page should start from `ax-page-shell`:

```html
<ax-page-shell>
  <ax-page-header [title]="title" [breadcrumbs]="crumbs">
    <ng-container actions>
      <button mat-flat-button color="primary">New</button>
    </ng-container>
  </ax-page-header>

  <ax-form-section title="Filters">
    <!-- filter row -->
  </ax-form-section>

  <ax-card>
    <!-- main table / list / detail -->
  </ax-card>
</ax-page-shell>
```

Switch the outer layout (sidebar / enterprise / docs) by changing one
line in your shell config — pages stay identical.

---

## 7. Accessibility minimums

- ARIA labels on icon-only buttons (`aria-label="…"` or `attr.aria-label`)
- ARIA labels on `<nav>`, sidebar toggles, user menu triggers
- Use Material's built-in keyboard navigation — do not rebuild it
- Provide focus styles via tokens (do not remove `:focus-visible` outlines)

---

## 8. When something looks "missing"

The library is **101 components**. If you cannot find what you need:

1. Search `docs/components/<category>/` for the markdown page.
2. Grep `libs/aegisx-ui/src/lib/components/` for `selector:` lines.
3. Check the variants of a near-match (`ax-stat-card` has 24 variants;
   `ax-card` has 4 appearances).

Do **not** assume a missing component is "not yet implemented" and
write a custom one. **Ask first.** Vapor docs (component pages with no
source) have happened before — if a `docs/components/...md` file
references a component you cannot find in source, treat the doc as
stale and confirm with the human before proceeding.
