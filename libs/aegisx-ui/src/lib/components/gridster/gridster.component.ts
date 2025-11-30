import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  TemplateRef,
  ContentChild,
  signal,
  computed,
  effect,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GridsterComponent as Gridster,
  GridsterItemComponent,
  GridsterConfig,
  GridsterItem,
} from 'angular-gridster2';
import {
  AxGridsterItemBase,
  AxGridsterPreset,
  AxGridsterSettings,
  AxGridsterItemChange,
  AxGridsterLayoutChange,
  GRIDSTER_PRESETS,
  createGridsterConfig,
} from './gridster.types';

/**
 * AegisX Gridster Component
 *
 * A reusable drag-and-drop grid layout component built on angular-gridster2.
 * Supports any content type via ng-template content projection.
 *
 * @example
 * ```html
 * <!-- Basic usage with custom template -->
 * <ax-gridster
 *   [items]="dashboardItems"
 *   [editMode]="isEditing"
 *   (layoutChange)="onLayoutChange($event)"
 * >
 *   <ng-template #itemTemplate let-item let-editMode="editMode">
 *     <my-custom-card [data]="item" [isEditing]="editMode"></my-custom-card>
 *   </ng-template>
 * </ax-gridster>
 *
 * <!-- With preset configuration -->
 * <ax-gridster
 *   [items]="widgetItems"
 *   preset="widget"
 *   [editMode]="isEditing"
 * >
 *   <ng-template #itemTemplate let-item>
 *     <app-widget [config]="item"></app-widget>
 *   </ng-template>
 * </ax-gridster>
 *
 * <!-- With custom settings -->
 * <ax-gridster
 *   [items]="launcherItems"
 *   [settings]="customSettings"
 *   [editMode]="isEditing"
 * >
 *   <ng-template #itemTemplate let-item>
 *     <ax-launcher-card [app]="item"></ax-launcher-card>
 *   </ng-template>
 * </ax-gridster>
 * ```
 */
@Component({
  selector: 'ax-gridster',
  standalone: true,
  imports: [CommonModule, Gridster, GridsterItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ax-gridster-container" [class.ax-gridster-edit-mode]="editMode">
      <gridster [options]="gridsterOptions()">
        @for (item of items; track trackByFn(item)) {
          <gridster-item [item]="item">
            @if (itemTemplateRef) {
              <ng-container
                *ngTemplateOutlet="
                  itemTemplateRef;
                  context: {
                    $implicit: item,
                    editMode: editMode,
                    index: $index,
                  }
                "
              ></ng-container>
            } @else {
              <!-- Default fallback if no template provided -->
              <div class="ax-gridster-default-item">
                <span>Item {{ item.id }}</span>
              </div>
            }
          </gridster-item>
        }
      </gridster>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }

      .ax-gridster-container {
        width: 100%;
        height: 100%;
        position: relative;
      }

      gridster {
        background: var(--ax-background-subtle, #f4f4f5);
        border-radius: var(--ax-radius-lg, 12px);
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }

      /* Make gridster-items transparent to show content properly */
      ::ng-deep gridster-item {
        background: transparent !important;
        overflow: visible !important;

        /* Ensure content fills the item */
        > * {
          display: block;
          width: 100%;
          height: 100%;
        }
      }

      /* Default item style when no template provided */
      .ax-gridster-default-item {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        background: var(--ax-background-default, #ffffff);
        border: 1px solid var(--ax-border-default, #e4e4e7);
        border-radius: var(--ax-radius-md, 8px);
        color: var(--ax-text-secondary, #71717a);
        font-size: 0.875rem;
      }

      /* Edit mode indicator */
      .ax-gridster-edit-mode gridster {
        background: var(
          --ax-gridster-edit-bg,
          linear-gradient(45deg, #f4f4f5 25%, transparent 25%),
          linear-gradient(-45deg, #f4f4f5 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #f4f4f5 75%),
          linear-gradient(-45deg, transparent 75%, #f4f4f5 75%)
        );
        background-size: 20px 20px;
        background-position:
          0 0,
          0 10px,
          10px -10px,
          -10px 0px;
      }

      /* Resize handles styling */
      ::ng-deep .gridster-item-resizable-handler {
        position: absolute;
        z-index: 100;
      }

      ::ng-deep .gridster-item-resizable-handler.handle-s,
      ::ng-deep .gridster-item-resizable-handler.handle-n {
        cursor: ns-resize;
      }

      ::ng-deep .gridster-item-resizable-handler.handle-e,
      ::ng-deep .gridster-item-resizable-handler.handle-w {
        cursor: ew-resize;
      }

      ::ng-deep .gridster-item-resizable-handler.handle-se,
      ::ng-deep .gridster-item-resizable-handler.handle-nw {
        cursor: nwse-resize;
      }

      ::ng-deep .gridster-item-resizable-handler.handle-ne,
      ::ng-deep .gridster-item-resizable-handler.handle-sw {
        cursor: nesw-resize;
      }
    `,
  ],
})
export class AxGridsterComponent<T extends AxGridsterItemBase>
  implements OnInit, OnDestroy
{
  /**
   * Array of items to display in the grid.
   * Each item must extend AxGridsterItemBase.
   */
  @Input() items: T[] = [];

  /**
   * Whether edit mode is enabled (allows drag & resize)
   * @default false
   */
  @Input()
  set editMode(value: boolean) {
    this._editMode.set(value);
  }
  get editMode(): boolean {
    return this._editMode();
  }

  /**
   * Preset configuration to use
   * @default 'dashboard'
   */
  @Input() preset: AxGridsterPreset = 'dashboard';

  /**
   * Custom settings (overrides preset)
   */
  @Input()
  set settings(value: Partial<AxGridsterSettings> | undefined) {
    this._customSettings.set(value);
  }

  /**
   * Track function for ngFor
   */
  @Input() trackByFn: (item: T) => string | number = (item) => item.id;

  /**
   * Emits when edit mode changes
   */
  @Output() editModeChange = new EventEmitter<boolean>();

  /**
   * Emits when any item's position or size changes
   */
  @Output() itemChange = new EventEmitter<AxGridsterItemChange<T>>();

  /**
   * Emits when layout changes (after drag/resize completes)
   */
  @Output() layoutChange = new EventEmitter<AxGridsterLayoutChange<T>>();

  /**
   * Template for rendering each grid item.
   * Template context provides: $implicit (item), editMode, index
   */
  @ContentChild('itemTemplate') itemTemplateRef?: TemplateRef<{
    $implicit: T;
    editMode: boolean;
    index: number;
  }>;

  /** Internal edit mode signal */
  private _editMode = signal(false);

  /** Custom settings signal */
  private _customSettings = signal<Partial<AxGridsterSettings> | undefined>(
    undefined,
  );

  /** Merged settings (preset + custom) */
  private mergedSettings = computed<AxGridsterSettings>(() => {
    const presetSettings =
      this.preset === 'custom'
        ? GRIDSTER_PRESETS['dashboard']
        : GRIDSTER_PRESETS[this.preset];
    const custom = this._customSettings();
    return custom ? { ...presetSettings, ...custom } : presetSettings;
  });

  /** Gridster configuration object */
  gridsterOptions = computed<GridsterConfig>(() => {
    const settings = this.mergedSettings();
    const config = createGridsterConfig(settings, this._editMode());

    // Add callbacks for item changes
    config.itemChangeCallback = (item: GridsterItem) => {
      this.onItemChange(item as T);
    };

    config.itemResizeCallback = (item: GridsterItem) => {
      this.onItemResize(item as T);
    };

    return config;
  });

  /** Store for tracking previous positions */
  private previousPositions = new Map<
    string | number,
    { x: number; y: number; cols: number; rows: number }
  >();

  constructor() {
    // Effect to track edit mode changes
    effect(() => {
      const isEdit = this._editMode();
      this.editModeChange.emit(isEdit);
    });
  }

  ngOnInit(): void {
    // Store initial positions
    this.storePositions();
  }

  ngOnDestroy(): void {
    this.previousPositions.clear();
  }

  /**
   * Toggle edit mode programmatically
   */
  toggleEditMode(): void {
    this._editMode.update((v) => !v);
  }

  /**
   * Enable edit mode
   */
  enableEditMode(): void {
    this._editMode.set(true);
  }

  /**
   * Disable edit mode
   */
  disableEditMode(): void {
    this._editMode.set(false);
  }

  /**
   * Apply new settings
   */
  applySettings(settings: Partial<AxGridsterSettings>): void {
    this._customSettings.update((current) => ({
      ...current,
      ...settings,
    }));
  }

  /**
   * Reset to preset defaults
   */
  resetSettings(): void {
    this._customSettings.set(undefined);
  }

  /**
   * Get current layout data (useful for saving)
   */
  getLayoutData(): Array<{
    id: string | number;
    x: number;
    y: number;
    cols: number;
    rows: number;
  }> {
    return this.items.map((item) => ({
      id: item.id,
      x: item.x,
      y: item.y,
      cols: item.cols,
      rows: item.rows,
    }));
  }

  private storePositions(): void {
    this.items.forEach((item) => {
      this.previousPositions.set(item.id, {
        x: item.x,
        y: item.y,
        cols: item.cols,
        rows: item.rows,
      });
    });
  }

  private onItemChange(item: T): void {
    const prev = this.previousPositions.get(item.id);
    if (!prev) return;

    const positionChanged = prev.x !== item.x || prev.y !== item.y;
    const sizeChanged = prev.cols !== item.cols || prev.rows !== item.rows;

    if (positionChanged || sizeChanged) {
      const changeType: 'position' | 'size' | 'both' =
        positionChanged && sizeChanged
          ? 'both'
          : positionChanged
            ? 'position'
            : 'size';

      this.itemChange.emit({
        item,
        type: changeType,
        previous: { ...prev },
      });

      // Update stored position
      this.previousPositions.set(item.id, {
        x: item.x,
        y: item.y,
        cols: item.cols,
        rows: item.rows,
      });

      // Emit layout change
      this.emitLayoutChange([item]);
    }
  }

  private onItemResize(item: T): void {
    // Same as onItemChange but explicitly for resize
    this.onItemChange(item);
  }

  private emitLayoutChange(changedItems: T[]): void {
    this.layoutChange.emit({
      items: [...this.items],
      changedItems,
    });
  }
}
