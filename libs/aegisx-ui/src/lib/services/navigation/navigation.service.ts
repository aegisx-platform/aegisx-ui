import { Injectable, computed, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  AxNavigationItem,
  AxNavigation,
} from '../../types/ax-navigation.types';
import { cloneDeep } from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class AxNavigationService {
  // Private writable signals
  private _navigation = signal<AxNavigation>({
    default: [],
    compact: [],
    horizontal: [],
    mobile: [],
  });
  private _currentNavigationItem = signal<AxNavigationItem | null>(null);

  // Public readonly signals
  readonly navigation = this._navigation.asReadonly();
  readonly currentNavigationItem = this._currentNavigationItem.asReadonly();

  // Computed signals
  readonly defaultNavigation = computed(() => this.navigation().default);
  readonly compactNavigation = computed(() => this.navigation().compact);
  readonly horizontalNavigation = computed(
    () => this.navigation().horizontal || [],
  );
  readonly mobileNavigation = computed(() => this.navigation().mobile || []);

  // Computed flat navigation for searching
  readonly flatNavigation = computed(() => {
    const navigation = this.navigation();
    return this._flattenNavigation(navigation.default);
  });

  // Computed breadcrumbs
  readonly breadcrumbs = computed(() => {
    const currentItem = this.currentNavigationItem();
    if (!currentItem) {
      return [];
    }
    return this._generateBreadcrumbs(currentItem);
  });

  private _httpClient = inject(HttpClient);

  /**
   * Get navigation data from the server
   */
  get(): Observable<AxNavigation> {
    return this._httpClient
      .get<AxNavigation>('/api/navigation')
      .pipe(tap((navigation: AxNavigation) => this.setNavigation(navigation)));
  }

  /**
   * Set the navigation
   */
  setNavigation(navigation: AxNavigation): void {
    this._navigation.set(cloneDeep(navigation));
  }

  /**
   * Update navigation item
   */
  updateNavigationItem(id: string, item: Partial<AxNavigationItem>): void {
    this._navigation.update((navigation) => {
      const updatedNavigation = cloneDeep(navigation);

      // Update in all navigation types
      ['default', 'compact', 'horizontal', 'mobile'].forEach((type) => {
        const navItems = updatedNavigation[type as keyof AxNavigation];
        if (navItems) {
          this._updateItemInNavigation(
            navItems as AxNavigationItem[],
            id,
            item,
          );
        }
      });

      return updatedNavigation;
    });
  }

  /**
   * Set current navigation item
   */
  setCurrentNavigationItem(item: AxNavigationItem | null): void {
    this._currentNavigationItem.set(item);
  }

  /**
   * Get navigation item by id
   */
  getNavigationItem(id: string): AxNavigationItem | null {
    const flatNavigation = this.flatNavigation();
    return flatNavigation.find((item) => item.id === id) || null;
  }

  /**
   * Get navigation item by link
   */
  getNavigationItemByLink(link: string): AxNavigationItem | null {
    const flatNavigation = this.flatNavigation();
    return flatNavigation.find((item) => item.link === link) || null;
  }

  /**
   * Toggle navigation item
   */
  toggleNavigationItem(id: string): void {
    const item = this.getNavigationItem(id);
    if (item && item.type === 'collapsable') {
      this.updateNavigationItem(id, {
        expanded: !item.expanded,
      });
    }
  }

  /**
   * Helper: Update item in navigation array
   */
  private _updateItemInNavigation(
    items: AxNavigationItem[],
    id: string,
    updates: Partial<AxNavigationItem>,
  ): boolean {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item.id === id) {
        items[i] = { ...item, ...updates };
        return true;
      }

      if (item.children && item.children.length > 0) {
        const found = this._updateItemInNavigation(item.children, id, updates);
        if (found) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Helper: Flatten navigation
   */
  private _flattenNavigation(items: AxNavigationItem[]): AxNavigationItem[] {
    const flat: AxNavigationItem[] = [];

    const addToFlat = (item: AxNavigationItem) => {
      flat.push(item);

      if (item.children && item.children.length > 0) {
        item.children.forEach((child) => addToFlat(child));
      }
    };

    items.forEach((item) => addToFlat(item));

    return flat;
  }

  /**
   * Helper: Generate breadcrumbs
   */
  private _generateBreadcrumbs(item: AxNavigationItem): AxNavigationItem[] {
    // Find the path to the item
    const findPath = (
      items: AxNavigationItem[],
      targetId: string,
      path: AxNavigationItem[] = [],
    ): AxNavigationItem[] | null => {
      for (const navItem of items) {
        const currentPath = [...path, navItem];

        if (navItem.id === targetId) {
          return currentPath;
        }

        if (navItem.children && navItem.children.length > 0) {
          const foundPath = findPath(navItem.children, targetId, currentPath);
          if (foundPath) {
            return foundPath;
          }
        }
      }

      return null;
    };

    const navigation = this.navigation();
    const path = findPath(navigation.default, item.id);

    return path || [];
  }
}
