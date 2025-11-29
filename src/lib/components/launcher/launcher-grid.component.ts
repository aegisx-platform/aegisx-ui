import {
  Component,
  computed,
  input,
  output,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { AxLauncherCardComponent } from './launcher-card.component';
import {
  LauncherApp,
  LauncherAppClickEvent,
  LauncherGridConfig,
} from './launcher.types';

/**
 * Draggable Bento Grid for Launcher Cards
 *
 * @example
 * ```html
 * <ax-launcher-grid
 *   [apps]="apps"
 *   [draggable]="true"
 *   [columns]="4"
 *   (orderChange)="onOrderChange($event)"
 *   (appClick)="onAppClick($event)"
 * />
 * ```
 */
@Component({
  selector: 'ax-launcher-grid',
  standalone: true,
  imports: [CommonModule, CdkDropList, CdkDrag, AxLauncherCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      cdkDropList
      cdkDropListOrientation="mixed"
      [cdkDropListDisabled]="!draggable()"
      [cdkDropListData]="internalApps()"
      (cdkDropListDropped)="onDrop($event)"
      class="launcher-grid"
      [class.launcher-grid--draggable]="draggable()"
      [style.--grid-columns]="columns()"
      [style.--grid-gap]="gap() + 'px'"
      [style.--grid-row-height]="rowHeight() + 'px'"
    >
      @for (app of internalApps(); track app.id) {
        <div
          cdkDrag
          [cdkDragDisabled]="!draggable()"
          class="launcher-grid__item"
          [class.col-span-2]="app.gridSpan?.cols === 2"
          [class.col-span-3]="app.gridSpan?.cols === 3"
          [class.col-span-4]="app.gridSpan?.cols === 4"
          [class.row-span-2]="app.gridSpan?.rows === 2"
          [class.row-span-3]="app.gridSpan?.rows === 3"
          [class.row-span-4]="app.gridSpan?.rows === 4"
        >
          <!-- Drag Handle (optional) -->
          @if (draggable() && showDragHandle()) {
            <div class="launcher-grid__drag-handle" cdkDragHandle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <circle cx="9" cy="5" r="1.5" />
                <circle cx="15" cy="5" r="1.5" />
                <circle cx="9" cy="12" r="1.5" />
                <circle cx="15" cy="12" r="1.5" />
                <circle cx="9" cy="19" r="1.5" />
                <circle cx="15" cy="19" r="1.5" />
              </svg>
            </div>
          }

          <ax-launcher-card
            [app]="app"
            [isFavorite]="favoriteApps().includes(app.id)"
            [isPinned]="pinnedApps().includes(app.id)"
            (cardClick)="onCardClick($event)"
            (favoriteToggle)="onFavoriteToggle($event)"
            (pinToggle)="onPinToggle($event)"
          />

          <!-- Drag Placeholder -->
          <div class="launcher-grid__placeholder" *cdkDragPlaceholder></div>
        </div>
      }
    </div>
  `,
  styles: `
    .launcher-grid {
      display: grid;
      grid-template-columns: repeat(var(--grid-columns, 4), 1fr);
      grid-auto-rows: minmax(var(--grid-row-height, 140px), auto);
      gap: var(--grid-gap, 16px);
      width: 100%;
    }

    .launcher-grid--draggable {
      .launcher-grid__item {
        cursor: grab;

        &:active {
          cursor: grabbing;
        }
      }
    }

    .launcher-grid__item {
      position: relative;
      transition: transform 0.2s ease;

      ax-launcher-card {
        width: 100%;
        height: 100%;
        display: block;
      }

      /* Override card fixed width in grid context */
      ::ng-deep .launcher-card {
        width: 100%;
        height: 100%;
      }
    }

    /* CDK Drag States */
    .launcher-grid__item.cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    .launcher-grid__item.cdk-drag-dragging {
      z-index: 1000;

      ::ng-deep .launcher-card {
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        transform: rotate(3deg) scale(1.02);
      }
    }

    /* Drag Handle */
    .launcher-grid__drag-handle {
      position: absolute;
      top: 8px;
      right: 8px;
      z-index: 10;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 6px;
      color: #6b7280;
      opacity: 0;
      transition: opacity 0.15s ease;
      cursor: grab;

      &:active {
        cursor: grabbing;
      }
    }

    .launcher-grid__item:hover .launcher-grid__drag-handle {
      opacity: 1;
    }

    /* Dark mode drag handle */
    :host-context(.dark),
    .dark {
      .launcher-grid__drag-handle {
        background: rgba(31, 41, 55, 0.9);
        color: #9ca3af;
      }
    }

    /* Placeholder while dragging */
    .launcher-grid__placeholder {
      background: var(--ax-background-subtle, #f3f4f6);
      border: 2px dashed var(--ax-border, #d1d5db);
      border-radius: var(--ax-radius-xl, 16px);
      min-height: 140px;
      width: 100%;
      height: 100%;
    }

    :host-context(.dark) .launcher-grid__placeholder,
    .dark .launcher-grid__placeholder {
      background: rgba(55, 65, 81, 0.3);
      border-color: rgba(75, 85, 99, 0.5);
    }

    /* Grid span classes */
    .col-span-2 {
      grid-column: span 2;
    }
    .col-span-3 {
      grid-column: span 3;
    }
    .col-span-4 {
      grid-column: span 4;
    }

    .row-span-2 {
      grid-row: span 2;
    }
    .row-span-3 {
      grid-row: span 3;
    }
    .row-span-4 {
      grid-row: span 4;
    }

    /* CDK Drop List Animation */
    .cdk-drop-list-dragging .launcher-grid__item:not(.cdk-drag-placeholder) {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
  `,
})
export class AxLauncherGridComponent {
  // Inputs
  apps = input.required<LauncherApp[]>();
  draggable = input<boolean>(true);
  columns = input<number>(4);
  gap = input<number>(16);
  rowHeight = input<number>(140);
  showDragHandle = input<boolean>(false);
  favoriteApps = input<string[]>([]);
  pinnedApps = input<string[]>([]);
  config = input<LauncherGridConfig>({});

  // Outputs
  orderChange = output<LauncherApp[]>();
  appClick = output<LauncherAppClickEvent>();
  favoriteToggle = output<LauncherApp>();
  pinToggle = output<LauncherApp>();

  // Internal state
  private _internalApps = signal<LauncherApp[]>([]);

  // Computed
  internalApps = computed(() => {
    const apps = this.apps();
    // Initialize internal state if empty or apps changed
    if (
      this._internalApps().length === 0 ||
      this._internalApps().length !== apps.length
    ) {
      this._internalApps.set([...apps]);
    }
    return this._internalApps();
  });

  // Methods
  onDrop(event: CdkDragDrop<LauncherApp[]>): void {
    if (event.previousIndex !== event.currentIndex) {
      const apps = [...this._internalApps()];
      moveItemInArray(apps, event.previousIndex, event.currentIndex);
      this._internalApps.set(apps);
      this.orderChange.emit(apps);
    }
  }

  onCardClick(event: LauncherAppClickEvent): void {
    this.appClick.emit(event);
  }

  onFavoriteToggle(app: LauncherApp): void {
    this.favoriteToggle.emit(app);
  }

  onPinToggle(app: LauncherApp): void {
    this.pinToggle.emit(app);
  }

  /** Update apps from external source */
  updateApps(apps: LauncherApp[]): void {
    this._internalApps.set([...apps]);
  }

  /** Reset to original order */
  resetOrder(): void {
    this._internalApps.set([...this.apps()]);
  }
}
