# Dialog Fullscreen Button Component

## Overview

The **Dialog Fullscreen Button** (`ax-dialog-fullscreen-button`) is a drop-in icon button for `mat-dialog-title` headers that toggles an open Material dialog between its default size and full-viewport coverage. It leverages the `.dialog-fullscreen` class defined in `aegisx-ui`'s `_dialog-shared.scss` and handles the CDK overlay-pane walk, state signal, and localStorage persistence so individual dialogs don't have to re-implement the same ~20 lines each.

### When to Use

- **Large data-dense dialogs** — stockcards, PR/PO create/edit forms, report viewers — where users often want to compare with another tab or focus on the form
- **Mobile-heavy workflows** — touch keyboards leave very little vertical space; fullscreen gives breathing room
- **Persistent preference** — the user expands once and expects every subsequent open to remember their choice

### UX Best Practices

1. **Pair with a close button** — always place the fullscreen toggle next to `mat-dialog-close`, fullscreen first, close last
2. **Thai defaults, override for English** — default tooltips are Thai (`"เต็มหน้าจอ"` / `"ย่อหน้าต่าง"`); pass `expandLabel` / `collapseLabel` for English or other UI
3. **Use a stable `persistKey`** — one key per dialog type (`"pr-dialog-fullscreen"`, `"stockcard-dialog-fullscreen"`) so preferences don't collide
4. **Set `defaultOpen`** for dialogs that are *usually* fullscreen (stockcard, PDF viewer) — users expect them wide from the first open
5. **Don't use on small confirmation dialogs** — the extra button clutter outweighs the value; `ax-confirm-dialog` never needs fullscreen

## Installation & Import

```typescript
import { AxDialogFullscreenButtonComponent } from '@aegisx/ui';

@Component({
  selector: 'app-my-dialog',
  standalone: true,
  imports: [MatDialogModule, AxDialogFullscreenButtonComponent],
  template: `...`,
})
export class MyDialogComponent {}
```

The component relies on the `.dialog-fullscreen` CSS class from `_dialog-shared.scss`. Make sure the project's global stylesheet imports the shared dialog styles:

```scss
// apps/web/src/styles.scss
@use '../../../libs/aegisx-ui/src/lib/styles/components/dialog-shared';
```

The aegisx light and dark themes import this automatically, so if the app already uses `aegisx-light.scss` / `aegisx-dark.scss` no extra wiring is needed.

## Basic Usage

### Minimal — session-only toggle

```html
<h2 mat-dialog-title class="ax-header ax-header-info">
  <div class="ax-icon-info"><mat-icon>add_circle</mat-icon></div>
  <div class="header-text">
    <div class="ax-title">Create Record</div>
    <div class="ax-subtitle">Fill in the details below</div>
  </div>

  <ax-dialog-fullscreen-button />

  <button mat-icon-button mat-dialog-close>
    <mat-icon>close</mat-icon>
  </button>
</h2>
```

No persistence, fullscreen starts off — one click fills the viewport until the dialog closes.

### Persisted across sessions

```html
<ax-dialog-fullscreen-button persistKey="pr-dialog-fullscreen" />
```

The user's choice is written to `localStorage["ax:dialog-fullscreen:pr-dialog-fullscreen"]` and restored the next time the dialog opens.

### Default fullscreen (e.g. stockcard)

```html
<ax-dialog-fullscreen-button
  persistKey="stockcard-dialog-fullscreen"
  defaultOpen
/>
```

First-time users land in fullscreen; after they toggle, `persistKey` remembers.

### English UI

```html
<ax-dialog-fullscreen-button
  persistKey="report-viewer"
  expandLabel="Full screen"
  collapseLabel="Exit full screen"
/>
```

### Per-user persistence (shared workstations)

Bake the user id into the key so two users on the same browser don't share toggles:

```html
<ax-dialog-fullscreen-button
  [persistKey]="'pr-dialog-fullscreen:' + userId()"
/>
```

### Custom persistence (UserPreferenceService, backend, etc.)

Skip `persistKey` and react to `(fullscreenChange)`:

```html
<ax-dialog-fullscreen-button
  [defaultOpen]="userPref.get('pr-fullscreen') === 'true'"
  (fullscreenChange)="userPref.set('pr-fullscreen', String($event))"
/>
```

## API

### Inputs

| Input           | Type               | Default             | Description                                                                                                               |
| --------------- | ------------------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `persistKey`    | `string \| undefined` | `undefined`         | localStorage key (without prefix). When set the toggle survives reloads. Actual storage key is `ax:dialog-fullscreen:<persistKey>`. |
| `defaultOpen`   | `boolean`          | `false`             | Initial state when no persisted value exists for `persistKey` (or when `persistKey` is omitted).                         |
| `expandLabel`   | `string`           | `'เต็มหน้าจอ'`       | Tooltip shown while the dialog is not fullscreen.                                                                         |
| `collapseLabel` | `string`           | `'ย่อหน้าต่าง'`      | Tooltip shown while the dialog is fullscreen.                                                                             |

### Outputs

| Output              | Type              | When it fires                                                                                            |
| ------------------- | ----------------- | -------------------------------------------------------------------------------------------------------- |
| `fullscreenChange`  | `boolean`         | Every time the state flips — both on user click and on the initial apply when `defaultOpen` / persisted. |

### Storage Keys

When `persistKey` is set, the component reads/writes `localStorage`:

```
ax:dialog-fullscreen:<persistKey> → "true" | "false"
```

The prefix avoids clashing with other `localStorage` keys in the app. You can clear all dialog fullscreen preferences with:

```js
Object.keys(localStorage)
  .filter((k) => k.startsWith('ax:dialog-fullscreen:'))
  .forEach((k) => localStorage.removeItem(k));
```

## How It Works

1. On click the component toggles its internal `isFullscreen` signal.
2. It walks up the DOM from its host element via `.closest('.cdk-overlay-pane')` to find the outer CDK overlay pane of the hosting dialog.
3. It adds or removes the `dialog-fullscreen` class on that pane.
4. `_dialog-shared.scss` provides the CSS that the class triggers — CSS variables reset the Material dialog size, the surface grows to `100vw × 100vh`, and the inner `.dialog-content` wrapper (a common AegisX convention) drops its `max-width` / `max-height` caps so the form fills the surface.
5. If `persistKey` is present, the new state is written to `localStorage`.
6. `fullscreenChange` is emitted on every apply.

On `ngAfterViewInit` the component reads the persisted value (or falls back to `defaultOpen`) and applies it immediately so the dialog opens in the user's preferred size.

## Integration Notes

### Works With

- **Angular Material Dialog** (`MatDialog` / `MatDialogModule`) — any dialog opened via `dialog.open(...)` is automatically hosted in a `.cdk-overlay-pane`, which is what the button targets.
- **AegisX `ax-header` title bar** — the button fits naturally to the right of `header-text`, before the close button.

### Known Constraints

- **Standalone overlays only** — if the component is ever used outside a Material/CDK overlay (e.g. inline on a page), `closest('.cdk-overlay-pane')` returns `null` and the toggle becomes a no-op. The tooltip and icon still flip, but nothing else happens. This is intentional — the component is scoped to dialogs.
- **SSR / non-browser** — guarded with `isPlatformBrowser`; on the server the button renders in its default state and skips the DOM walk / `localStorage` call.
- **Dialog content caps** — custom dialogs that use their own inner wrapper classes (not `.dialog-content`) won't automatically yield in fullscreen. Add a `:host-context(.dialog-fullscreen)` override in the dialog's component styles, or rename the wrapper to `.dialog-content` to inherit the global reset.

## Example: Complete Dialog

```typescript
import { Component, inject } from '@angular/core';
import {
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AxDialogFullscreenButtonComponent } from '@aegisx/ui';

@Component({
  selector: 'app-report-viewer-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    AxDialogFullscreenButtonComponent,
  ],
  template: `
    <h2 mat-dialog-title class="ax-header ax-header-neutral">
      <div class="ax-icon-neutral">
        <mat-icon>description</mat-icon>
      </div>
      <div class="header-text">
        <div class="ax-title">Monthly Report — 2026-04</div>
        <div class="ax-subtitle">Rendered just now</div>
      </div>

      <ax-dialog-fullscreen-button
        persistKey="report-viewer-fullscreen"
        defaultOpen
      />

      <button mat-icon-button mat-dialog-close matTooltip="Close">
        <mat-icon>close</mat-icon>
      </button>
    </h2>

    <mat-dialog-content class="dialog-content">
      <!-- long report body scrolls inside in fullscreen mode -->
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
})
export class ReportViewerDialogComponent {
  private dialogRef = inject(MatDialogRef<ReportViewerDialogComponent>);
}
```

## Real Consumers in AegisX

- `purchase-request-dialog.component.ts` — persistKey `pr-dialog-fullscreen`
- `purchase-order-dialog.component.ts` — persistKey `po-dialog-fullscreen`
- `stockcard-dialog.component.ts` — persistKey `stockcard-dialog-fullscreen`, `defaultOpen`

## Related Components

- **`ax-confirm-dialog`** — small confirmation dialogs; no fullscreen needed
- **`ax-dialog-service`** (if present) — programmatic dialog opening wrapper

## Troubleshooting

**The button renders but clicking does nothing.**
The overlay pane walk failed. Check the dialog is opened via `MatDialog.open()` (so it's inside `.cdk-overlay-pane`) and that your app imports `dialog-shared` SCSS globally.

**The right ~10% of the surface is blank in fullscreen.**
Your inner wrapper has `max-width: 90vw`. Either rename the wrapper to `.dialog-content` (inherits the global reset) or add a `:host-context(.dialog-fullscreen) .my-wrapper { max-width: none !important; }` rule.

**The preference doesn't persist across tabs.**
`localStorage` is per-origin, so multiple tabs share the value but a `storage` event is not fired in the writing tab. If two tabs open the same dialog type simultaneously, each reads the persisted value at open time — subsequent toggles in one tab won't live-update the other tab's open dialog.
