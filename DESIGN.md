---
name: AegisX UI
version: 0.5.x
default-theme: aegisx-light
themes: [aegisx-light, aegisx-dark, verus-light, verus-dark]
status: living-document
purpose: agent-facing canonical descriptor
---

# AegisX UI — DESIGN.md

> **For AI agents (and humans) working on aegisx-starter:** this is the
> _one_ file you read before touching any UI. It points at sources of
> truth (it does NOT replace them) and lists the rules that get
> violated most often.
>
> Inspired by [google-labs-code/design.md](https://github.com/google-labs-code/design.md)
> — adapted to the AegisX context: SCSS tokens stay the runtime ground
> truth, this file is the agent-readable index + rule book.

---

## Sources of truth (read these as needed)

| What                        | Where                                                                                  |
| --------------------------- | -------------------------------------------------------------------------------------- |
| Raw token values            | `libs/aegisx-ui/src/lib/styles/themes/_aegisx-tokens.scss` (light + dark Sass maps)    |
| Theme application           | `libs/aegisx-ui/src/lib/styles/themes/aegisx-light.scss`, `aegisx-dark.scss`           |
| Material × AegisX bridging  | `libs/aegisx-ui/src/lib/styles/themes/_material-overrides.scss`                        |
| Long-form token reference   | `libs/aegisx-ui/docs/TOKEN_REFERENCE.md`                                               |
| Theming guide               | `libs/aegisx-ui/docs/THEMING_GUIDE.md`                                                 |
| Per-component API           | `libs/aegisx-ui/docs/components/<category>/<component>.md`                             |
| Layout playbook (page widths) | `docs/design-system/layout-playbook.md`                                              |
| Tailwind allow-list         | `.claude/rules/ui-component-usage.md` (allow / forbidden table)                        |
| Quality gates               | `scripts/quality/run-all.sh` (pipe imports, demo widths, hardcoded hex, sync)          |

If anything in this file disagrees with the SCSS source, **the SCSS
source wins** — fix this file.

---

## 1. Overview

AegisX UI is the design-system library for the AegisX platform —
enterprise hospital / inventory / clinic SaaS apps built on
Angular + Angular Material + Tailwind. The aesthetic is "Clean
Clinical SaaS": calm, neutral surfaces; reserved colour use; high
information density; WCAG-AA contrast; dark mode is a first-class
peer of light mode (not an afterthought).

**Component scope:** ~100 `ax-*` components built on top of Angular
Material primitives. Selectors enumerated in §7.

**Theme scope:** 4 themes total — `aegisx-light` (default),
`aegisx-dark`, `verus-light`, `verus-dark`. All themes flip via
the same `--ax-*` token contract, never via a `.dark` class on
elements. See §6.

---

## 2. Tokens

**Two token systems coexist** — pick the right one:

| When you need…                                 | Use                          | Example                                    |
| ---------------------------------------------- | ---------------------------- | ------------------------------------------ |
| Primary / secondary / tertiary brand           | `--mat-sys-*`                | `var(--mat-sys-primary)`                   |
| Surface / background / on-surface text         | `--mat-sys-*`                | `var(--mat-sys-surface-container)`         |
| Material elevation / corner radius             | `--mat-sys-*`                | `var(--mat-sys-level1)`, `corner-medium`   |
| Spacing scale                                  | `--ax-spacing-*`             | `var(--ax-spacing-md)` (16px)              |
| Success / Warning / Error / Info / Cyan / Purple | `--ax-{semantic}-*`        | `var(--ax-success-default)`                |
| Text hierarchy (heading / body / subtle)       | `--ax-text-*`                | `var(--ax-text-heading)`                   |
| Borders                                        | `--ax-border-*`              | `var(--ax-border-default)`                 |
| Background scale (muted / subtle / emphasis)   | `--ax-background-*`          | `var(--ax-background-subtle)`              |
| Z-index layering                               | `--ax-z-*`                   | `var(--ax-z-dropdown)`                     |
| Transitions                                    | `--ax-duration-*`, `--ax-easing-*` | `var(--ax-duration-fast)`            |
| Component-specific custom tokens               | `--ax-{component}-*`         | `var(--ax-dashboard-panel-bg)`             |

**Total `--ax-*` tokens:** 280+ — full table in `TOKEN_REFERENCE.md`.

**Reference syntax:** use `var(--ax-X)` directly in SCSS / inline
styles. Do **not** invent a foreign reference syntax (`{colors.x}`
etc.). What you write is what runs.

### Complete token family inventory

Every `--ax-*` family in `_aegisx-tokens.scss`. If a family is here,
it exists; if not, it doesn't (or someone forgot to update this
file — `check-design-md-sync.sh` blocks that).

**Colour scales** (each has `-faint / -muted / -subtle / -default / -emphasis / -inverted`):

| Family               | Purpose                                       |
| -------------------- | --------------------------------------------- |
| `--ax-success-*`     | success states (Material has none)            |
| `--ax-warning-*`     | warning states                                |
| `--ax-error-*`       | error / danger (also has `-border`, etc.)     |
| `--ax-info-*`        | informational                                 |
| `--ax-cyan-*`        | completion / output metrics                   |
| `--ax-purple-*`      | prompt / input metrics                        |
| `--ax-indigo-*`      | alternative purple                            |
| `--ax-pink-*`        | accent metrics                                |
| `--ax-primary-*`     | brand-tinted scale (pairs with Material primary) |
| `--ax-gray-*`        | grayscale ramp (when Material surface tokens don't fit) |

**Surfaces / structure:**

| Family               | Purpose                                       |
| -------------------- | --------------------------------------------- |
| `--ax-background-*`  | `muted / subtle / default / emphasis / code`  |
| `--ax-text-*`        | `disabled / subtle / secondary / primary / heading / inverted` |
| `--ax-border-*`      | `muted / default / emphasis`                  |
| `--ax-shadow-*`      | `sm / md / lg` (fallback to Material elevation) |
| `--ax-elevation-*`   | layer-specific elevation tokens               |
| `--ax-radius-*`      | corner radius scale (when Material corner doesn't fit) |

**Spacing & motion:**

| Family               | Purpose                                       |
| -------------------- | --------------------------------------------- |
| `--ax-spacing-*`     | `2xs / xs / sm / md / lg / xl / 2xl / 3xl / 4xl` (see scale above) |
| `--ax-duration-*`    | `fast / base / slow` transition durations     |
| `--ax-easing-*`      | named easing curves                           |
| `--ax-transition-*`  | composed shorthand transitions                |
| `--ax-motion-*`      | motion presets (enter/exit/etc.)              |

**Typography:**

| Family               | Purpose                                       |
| -------------------- | --------------------------------------------- |
| `--ax-font-*`        | font-family stacks (Latin + Thai)             |
| `--ax-type-*`        | type-scale tokens (size/weight)               |
| `--ax-leading-*`     | line-height scale                             |
| `--ax-line-*`        | line decoration tokens (height, style)        |

**Interactive states:**

| Family               | Purpose                                       |
| -------------------- | --------------------------------------------- |
| `--ax-state-*`       | composed state colours                        |
| `--ax-hover-*`       | hover overlay tokens                          |
| `--ax-active-*`      | active/pressed overlay                        |
| `--ax-opacity-*`     | named opacity (disabled, hover, etc.)         |

**Layering:**

| Family               | Purpose                                       |
| -------------------- | --------------------------------------------- |
| `--ax-z-*`           | z-index scale (`dropdown / sticky / modal / toast`) |

**Component-specific** (only when Material/semantic tokens are not enough):

| Family               | Purpose                                       |
| -------------------- | --------------------------------------------- |
| `--ax-dashboard-*`   | dashboard panels, hero, nav                   |
| `--ax-form-*`        | form-control specific overrides               |
| `--ax-navigation-*`  | nav-shell colours                             |
| `--ax-brand-*`       | brand surface tokens (logo bg, etc.)          |

**Spacing scale (commit to memory):**

| Token             | px  | Use                       |
| ----------------- | --- | ------------------------- |
| `--ax-spacing-2xs`| 2   | hairline                  |
| `--ax-spacing-xs` | 4   | icon ↔ icon               |
| `--ax-spacing-sm` | 8   | icon ↔ text, tight gap    |
| `--ax-spacing-md` | 16  | default card padding      |
| `--ax-spacing-lg` | 24  | section gap               |
| `--ax-spacing-xl` | 32  | page section              |
| `--ax-spacing-2xl`| 40  |                           |
| `--ax-spacing-3xl`| 48  |                           |
| `--ax-spacing-4xl`| 64  | hero spacing              |

---

## 3. Typography

Material handles the typography scale (`--mat-sys-display-*`,
`--mat-sys-headline-*`, `--mat-sys-title-*`, `--mat-sys-body-*`,
`--mat-sys-label-*`). For colour use `--ax-text-*` (see §2). For
fonts, AegisX defaults to **IBM Plex Sans** (Latin) + **IBM Plex
Sans Thai** (Thai). Don't hardcode font-family — Material's tokens
already point at the right family.

Section/page headings: use `<ax-page-header>` / `<ax-card-header>`
not raw `<h1>`/`<h2>` with custom styling.

---

## 4. Layout & Spacing

### Page widths (playbook §3 — enforced by `check-ui-widths.sh`)

| Pattern        | Max-width  | Example                       |
| -------------- | ---------- | ----------------------------- |
| List / table   | 1440px     | drug list, PR list            |
| Dashboard      | 1200px     | landing dashboards            |
| Detail / form  | 1080px     | drug edit, PO detail          |
| Settings       | 896px      | profile, settings panes       |
| Fluid          | no cap     | kiosk, full-bleed displays    |

Set the page width on the **page component's `:host`**, not on
`<ax-page-shell>`. The shell itself is `max-width: 100%` and only
provides breadcrumb + header + content slots — it does not own a
`[width]` Input. The page declares its own width:

```scss
:host {
  display: block;
  max-width: 1080px; /* or 1440 / 1200 / 896 — see table above */
  margin: 0 auto;
}
```

`check-ui-widths.sh` currently enforces these widths on the
`playbook-demo` reference patterns (P1a–P14), not on every app page.

### Tailwind: layout glue only

Allowed: `flex`, `grid`, `gap-*`, `p-*`, `m-*`, `space-*`, `w-*`,
`h-*`, `max-w-*`, `hidden`, `block`, `inline-flex`, `relative`,
`absolute`, `sticky`, `top/left/z-*`, `overflow-*`, breakpoints
(`sm: md: lg: xl:`).

Forbidden (use components / tokens instead): `bg-*`, `text-{color}`,
`border-{color}`, `rounded-{size}`, `shadow-*`, `text-{size}`,
`font-{weight}`, `tracking-*`, `transition-*`, `animate-*`,
`hover:bg-*`, `hover:text-*`, `bg-opacity-*`. Full list in
`.claude/rules/ui-component-usage.md`.

---

## 5. Elevation

Use `--mat-sys-level0` … `--mat-sys-level5` for shadows. Never
hand-roll `box-shadow: 0 1px 2px rgba(0,0,0,0.05)` — it won't flip
in dark mode and won't match Material density.

For non-Material custom surfaces: `--ax-shadow-sm`, `--ax-shadow-md`,
`--ax-shadow-lg` exist as fallbacks.

---

## 6. Theme Behavior — light/dark via tokens ★ critical ★

This is the single biggest source of regression in this repo. Read
twice.

### How it works

- `<html>` carries a `data-theme="aegisx-light|aegisx-dark|..."`
  attribute (managed by `<ax-theme-switcher>`, persisted in
  localStorage).
- Each theme file (`aegisx-light.scss`, `aegisx-dark.scss`)
  redefines the **same** `--ax-*` variable names with theme-specific
  values.
- Components read `var(--ax-X)` only — they never know which theme
  is active.

### Rules

```
NEVER: use a `.dark` class on any element to swap colours
NEVER: take an `[isDarkMode]` Input on a component
NEVER: read `prefers-color-scheme` directly in TS or CSS to pick colours
NEVER: hardcode hex / rgb / hsl outside `themes/**` and `vendors/**`
NEVER: write `dark:bg-zinc-900` or any Tailwind `dark:*` modifier
ALWAYS: use `var(--ax-X)` or `var(--mat-sys-X)` for every semantic colour
ALWAYS: let the theme attribute on <html> drive the flip
ALWAYS: test light AND dark before claiming a UI change is done
```

### Why these rules exist

Past sessions added `.dark` overrides + `[isDarkMode]` Inputs +
hardcoded `#fff`. Result: every theme switch broke a different
component, and dark mode shipped with white-on-white form fields.
Single token contract is the only thing that scales across 4 themes
× 100 components.

### Concrete examples

❌ Wrong:

```scss
.card { background: #fff; }
.card.dark { background: #1c1b1f; }
```

```html
<div class="bg-white dark:bg-zinc-900">…</div>
```

```ts
@Input() isDarkMode = false;
```

✅ Right:

```scss
.card {
  background: var(--mat-sys-surface-container);
  color: var(--mat-sys-on-surface);
}
```

```html
<ax-card>…</ax-card>
```

```ts
// nothing — components are theme-agnostic
```

---

## 7. Components — when to use what

This section is the decision tree for picking a component, not an
API reference. For full inputs / outputs read the `.ts` source or
`libs/aegisx-ui/docs/components/<category>/<name>.md`.

### Decision priority

```
1. ax-* (this library)         ← FIRST: search aegisx_components_search query="..."
2. mat-* (Angular Material)    ← SECOND: when no ax-* fits
3. compose ax + mat            ← THIRD: build by composition
4. ask user                    ← LAST RESORT before custom from scratch
```

### Frequently misused — read the `.ts` before using

| Component                       | Common mistake                                                  | Fix                                                                                                            |
| ------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `<ax-page-shell>`               | Assuming a `[width]` Input exists                               | The shell only takes `[breadcrumb]` + `[headerBorder]`. Set width on the **page's `:host`** — see §4.          |
| `<ax-step-progress>`            | Passing colours via Input                                       | No colour Input exists. Colours come from `--ax-*` tokens; only `steps`, `size`, `overflow`, `maxVisible`, `clickable`, `ariaLabel` are inputs |
| `.ax-data-table` (SCSS class)   | Treating it as a component (`<ax-data-table>`)                  | It's a **global SCSS class** in `styles/components/_data-table.scss`, not a component. Apply on a wrapper around `<table mat-table>`. |
| `<ax-stat-card>` (25 variants)  | Picking variant by guessing                                     | Match variant to KPI semantic — full union list in `stat-card.types.ts`                                        |
| `<ax-loading-button>`           | Used on every button, even sync ones                            | Only when `[loading]` is bound to async work                                                                   |
| `<ax-dialog-fullscreen-button>` | Reimplemented per-dialog                                        | Reuse — already exists for PO / PR side dialogs. Optional `persistKey` saves state to `localStorage`.          |

### Categories (for `aegisx_components_search`)

`auth`, `calendar`, `card`, `code-tabs`, `data-display`, `dialogs`,
`drawer`, `empty-state`, `error-state`, `feedback`, `file-upload`,
`forms`, `gridster`, `integrations`, `launcher`, `layout`,
`loading-button`, `loading-state`, `navigation`, `skeleton`,
`theme-builder`, `theme-switcher`.

---

## 8. Anti-patterns — concrete forbidden code

Every entry is a real bug from past sessions. The grep gates in
`scripts/quality/` block the obvious ones; the rest are on you.

### 8.1 Hardcoded colour outside `themes/**`

```scss
/* ❌ blocks pre-push via check-no-hardcoded-hex.sh */
.kpi-icon { background: #10b981; }

/* ✅ */
.kpi-icon { background: var(--ax-success-default); }
```

### 8.2 `.dark` class or Tailwind `dark:*`

```html
<!-- ❌ doesn't flip via theme attribute -->
<div class="bg-white dark:bg-zinc-900">…</div>

<!-- ✅ -->
<div [style.background]="'var(--mat-sys-surface)'">…</div>
```

### 8.3 `[isDarkMode]` Input

```ts
// ❌ couples the component to theme awareness
@Input() isDarkMode = false;

// ✅ — theme is global, components read tokens
// (delete the input entirely)
```

### 8.4 Tailwind colour / shadow / radius / typography utilities

```html
<!-- ❌ -->
<button class="bg-blue-500 text-white rounded-lg shadow-md text-xl font-bold">
  Save
</button>

<!-- ✅ -->
<button mat-flat-button color="primary">Save</button>
```

### 8.5 `@if` inside `<button mat-*>` for spinner toggle

```html
<!-- ❌ width jumps when spinner appears -->
<button mat-flat-button>
  @if (saving()) { <mat-spinner [diameter]="20" /> }
  Save
</button>

<!-- ✅ keep spinner in DOM, toggle visibility -->
<button mat-flat-button>
  <div class="flex items-center justify-center gap-2">
    <mat-spinner [diameter]="20" [class.invisible]="!saving()" />
    <span>Save</span>
  </div>
</button>
```

### 8.6 `Subject` + `takeUntil` for teardown

```ts
// ❌ legacy pattern
private destroy$ = new Subject<void>();
ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }
this.api.x().pipe(takeUntil(this.destroy$));

// ✅
private destroyRef = inject(DestroyRef);
this.api.x().pipe(takeUntilDestroyed(this.destroyRef));
```

### 8.7 `CommonModule` in layout / shell components

```ts
// ❌ pulls every directive — bloats bundle, slows change detection
imports: [CommonModule]

// ✅ import just what you use
imports: [NgTemplateOutlet, NgIf]  // standalone primitives only
```

### 8.8 `*ngIf` / `*ngFor`

```html
<!-- ❌ legacy structural directives -->
<div *ngIf="show">…</div>
<div *ngFor="let x of list">…</div>

<!-- ✅ Angular 17+ control flow -->
@if (show) { <div>…</div> }
@for (x of list; track x.id) { <div>…</div> }
```

### 8.9 Setting `max-width` on inner page divs

```html
<!-- ❌ inner-div max-width fights ax-page-shell's gap stack -->
<ax-page-shell>
  <div class="max-w-[1440px] mx-auto">…</div>
</ax-page-shell>
```

```scss
/* ✅ width belongs on the page component's :host (see §4) */
:host {
  display: block;
  max-width: 1440px;
  margin: 0 auto;
}
```

```html
<ax-page-shell [breadcrumb]="breadcrumb">…</ax-page-shell>
```

---

## Quality gates that enforce this file

| Script                                | Enforces section                |
| ------------------------------------- | ------------------------------- |
| `scripts/quality/check-pipe-imports.sh` | §7 (component imports)        |
| `scripts/quality/check-ui-widths.sh`    | §4 (page widths)              |
| `scripts/quality/check-no-hardcoded-hex.sh` | §6 / §8.1 (hex outside themes) |
| `scripts/quality/check-design-md-sync.sh` (planned) | §2 (token list drift) |

Pre-push hook runs `run-all.sh`. To bypass: `SKIP_HOOKS=1 git push`
— and declare the reason in the commit / PR.

---

## How to update this file

1. Real bug from a session → add a §8 anti-pattern with concrete
   wrong/right code.
2. New token category in `_aegisx-tokens.scss` → update §2 table.
3. New theme → update frontmatter `themes:` list.
4. Component renamed / removed → update §7 categories.
5. Playbook width changes → update §4 table.

Keep this file **short enough to read in one sitting** (~400 lines
total). If a section grows, move detail to its source-of-truth file
and link instead of duplicating.
