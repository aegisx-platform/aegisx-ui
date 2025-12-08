import { GridsterConfig } from 'angular-gridster2';

/**
 * Grid type - determines how items are sized
 */
export type AxGridType =
  | 'fit'
  | 'scrollVertical'
  | 'scrollHorizontal'
  | 'fixed'
  | 'verticalFixed'
  | 'horizontalFixed';

/**
 * When to display grid lines
 */
export type AxDisplayGrid = 'always' | 'onDrag&Resize' | 'none';

/**
 * Compact type for auto-arranging items
 */
export type AxCompactType =
  | 'none'
  | 'compactUp'
  | 'compactLeft'
  | 'compactUp&Left'
  | 'compactLeft&Up'
  | 'compactRight'
  | 'compactUp&Right'
  | 'compactRight&Up'
  | 'compactDown'
  | 'compactDown&Left'
  | 'compactLeft&Down'
  | 'compactDown&Right'
  | 'compactRight&Down';

/**
 * Base interface for items that can be used with AxGridsterComponent.
 * Your item type should extend this interface.
 */
export interface AxGridsterItemBase {
  /** Unique identifier for the item */
  id: string | number;
  /** Grid column position (0-based) */
  x: number;
  /** Grid row position (0-based) */
  y: number;
  /** Number of columns the item spans */
  cols: number;
  /** Number of rows the item spans */
  rows: number;
  /** Minimum columns allowed when resizing */
  minItemCols?: number;
  /** Minimum rows allowed when resizing */
  minItemRows?: number;
  /** Maximum columns allowed when resizing */
  maxItemCols?: number;
  /** Maximum rows allowed when resizing */
  maxItemRows?: number;
  /** Whether this specific item can be dragged (overrides grid setting) */
  dragEnabled?: boolean;
  /** Whether this specific item can be resized (overrides grid setting) */
  resizeEnabled?: boolean;
}

/**
 * Preset configurations for common use cases
 */
export type AxGridsterPreset =
  | 'dashboard'
  | 'launcher'
  | 'widget'
  | 'kanban'
  | 'custom';

/**
 * Grid settings that can be customized via the component
 */
export interface AxGridsterSettings {
  /** Grid type determines how items are sized */
  gridType: AxGridType;
  /** Number of columns in the grid */
  columns: number;
  /** Margin between grid items in pixels */
  margin: number;
  /** Minimum number of rows */
  minRows: number;
  /** Maximum number of rows */
  maxRows: number;
  /** When to display grid lines */
  displayGrid: AxDisplayGrid;
  /** Whether items push others when moved */
  pushItems: boolean;
  /** Whether items can swap positions */
  swap: boolean;
  /** Compact type for auto-arranging items */
  compactType: AxCompactType;
  /** Fixed row height (for fixed grid types) */
  fixedRowHeight?: number;
  /** Fixed column width (for fixed grid types) */
  fixedColWidth?: number;
}

/**
 * Event emitted when an item's position or size changes
 */
export interface AxGridsterItemChange<T extends AxGridsterItemBase> {
  /** The item that changed */
  item: T;
  /** Type of change */
  type: 'position' | 'size' | 'both';
  /** Previous values before the change */
  previous: {
    x: number;
    y: number;
    cols: number;
    rows: number;
  };
}

/**
 * Event emitted when layout changes (any item moves or resizes)
 */
export interface AxGridsterLayoutChange<T extends AxGridsterItemBase> {
  /** All items in their current state */
  items: T[];
  /** Items that were changed in this operation */
  changedItems: T[];
}

/**
 * Preset configurations
 */
export const GRIDSTER_PRESETS: Record<
  Exclude<AxGridsterPreset, 'custom'>,
  AxGridsterSettings
> = {
  dashboard: {
    gridType: 'fit',
    columns: 12,
    margin: 16,
    minRows: 6,
    maxRows: 100,
    displayGrid: 'onDrag&Resize',
    pushItems: true,
    swap: false,
    compactType: 'none',
  },
  launcher: {
    gridType: 'fit',
    columns: 6,
    margin: 12,
    minRows: 4,
    maxRows: 20,
    displayGrid: 'onDrag&Resize',
    pushItems: true,
    swap: true,
    compactType: 'compactUp&Left',
  },
  widget: {
    gridType: 'scrollVertical',
    columns: 8,
    margin: 8,
    minRows: 1,
    maxRows: 100,
    displayGrid: 'onDrag&Resize',
    pushItems: true,
    swap: false,
    compactType: 'compactUp',
  },
  kanban: {
    gridType: 'scrollHorizontal',
    columns: 100,
    margin: 16,
    minRows: 1,
    maxRows: 1,
    displayGrid: 'none',
    pushItems: true,
    swap: false,
    compactType: 'compactLeft',
    fixedColWidth: 320,
  },
};

/**
 * Creates GridsterConfig from AxGridsterSettings
 */
export function createGridsterConfig(
  settings: AxGridsterSettings,
  editMode: boolean,
): GridsterConfig {
  const config: GridsterConfig = {
    gridType: settings.gridType,
    displayGrid: editMode ? 'always' : settings.displayGrid,
    minCols: settings.columns,
    maxCols: settings.columns,
    minRows: settings.minRows,
    maxRows: settings.maxRows,
    margin: settings.margin,
    pushItems: settings.pushItems,
    swap: settings.swap,
    compactType: settings.compactType,
    draggable: {
      enabled: editMode,
    },
    resizable: {
      enabled: editMode,
    },
  };

  if (settings.fixedRowHeight) {
    config.fixedRowHeight = settings.fixedRowHeight;
  }
  if (settings.fixedColWidth) {
    config.fixedColWidth = settings.fixedColWidth;
  }

  return config;
}
