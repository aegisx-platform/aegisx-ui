import { Injectable, inject } from '@angular/core';
import {
  BaseRealtimeStateManager,
  BaseEntity,
  ConflictInfo,
} from '../../../shared/business/services/base-realtime-state-manager';
import { TestProductService } from './test-products.service';
import { TestProduct } from '../types/test-products.types';

/**
 * Real-time State Manager for TestProduct
 *
 * Features:
 * - Automatic WebSocket synchronization
 * - Optimistic updates
 * - Conflict detection and resolution
 * - Offline support with pending operations queue
 *
 * Usage:
 * ```typescript
 * class MyComponent {
 *   private stateManager = inject(TestProductStateManager);
 *
 *   // Subscribe to real-time state
 *   testProductsList = this.stateManager.localState;
 *
 *   // Create with optimistic update
 *   async create() {
 *     await this.stateManager.optimisticCreate(data);
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class TestProductStateManager extends BaseRealtimeStateManager<TestProduct> {
  private testProductsService = inject(TestProductService);

  constructor() {
    super({
      feature: 'test-products',
      entity: 'test-product',
      enableOptimisticUpdates: true,
      enableConflictDetection: true,
      debounceMs: 300,
      retryAttempts: 3,
    });

    // Initialize after all dependencies are ready
    this.initializeStateManager();

    console.log(
      '🎯 TestProductStateManager initialized with real-time features',
    );
  }

  /**
   * Fetch testproducts from server
   * Called during sync operations
   */
  protected async fetchFromServer(): Promise<TestProduct[]> {
    console.log('📡 Fetching testproducts from server...');

    try {
      await this.testProductsService.loadTestProductList({
        limit: 1000,
        page: 1,
      });

      const items = this.testProductsService.testProductsList();
      console.log(`✅ Fetched ${items.length} testproducts from server`);

      return items;
    } catch (error) {
      console.error('❌ Failed to fetch testproducts:', error);
      throw error;
    }
  }

  /**
   * Create testproduct on server
   * Called after optimistic create to persist to server
   */
  protected async serverCreate(
    data: Omit<TestProduct, 'id'>,
  ): Promise<TestProduct> {
    console.log('🚀 Creating testproduct on server:', data);

    try {
      const result = await this.testProductsService.createTestProduct(data);
      if (!result) {
        throw new Error('Failed to create testproduct: Server returned null');
      }
      console.log('✅ TestProduct created on server:', result);

      return result;
    } catch (error) {
      console.error('❌ Failed to create testproduct:', error);
      throw error;
    }
  }

  /**
   * Update testproduct on server
   * Called after optimistic update to persist to server
   */
  protected async serverUpdate(
    id: string | number,
    changes: Partial<TestProduct>,
  ): Promise<TestProduct> {
    console.log('🔄 Updating testproduct on server:', { id, changes });

    try {
      const result = await this.testProductsService.updateTestProduct(
        String(id),
        changes,
      );
      if (!result) {
        throw new Error('Failed to update testproduct: Server returned null');
      }
      console.log('✅ TestProduct updated on server:', result);

      return result;
    } catch (error) {
      console.error('❌ Failed to update testproduct:', error);
      throw error;
    }
  }

  /**
   * Delete testproduct from server
   * Called after optimistic delete to persist to server
   */
  protected async serverDelete(id: string | number): Promise<void> {
    console.log('🗑️ Deleting testproduct from server:', id);

    try {
      await this.testProductsService.deleteTestProduct(String(id));
      console.log('✅ TestProduct deleted from server');
    } catch (error) {
      console.error('❌ Failed to delete testproduct:', error);
      throw error;
    }
  }

  /**
   * Extract entity ID for conflict detection
   */
  protected extractEntityId(entity: any): string | number {
    return entity.id;
  }

  /**
   * Lifecycle hook: Called when WebSocket connection is established
   */
  protected override onRealtimeConnected(): void {
    console.log('✅ TestProduct real-time connection established');
    // Sync with server when connection is restored
    this.syncWithServer().catch((error) => {
      console.error('Failed to sync after reconnection:', error);
    });
  }

  /**
   * Lifecycle hook: Called when WebSocket connection is lost
   */
  protected override onRealtimeDisconnected(): void {
    console.warn(
      '⚠️ TestProduct real-time connection lost - operating in offline mode',
    );
  }

  /**
   * Lifecycle hook: Called when bulk operation starts
   */
  protected override onBulkOperationStarted(data: {
    operationId: string;
    total: number;
    operation: string;
  }): void {
    console.log('📦 Bulk operation started:', data);
  }

  /**
   * Lifecycle hook: Called during bulk operation progress
   */
  protected override onBulkOperationProgress(data: {
    operationId: string;
    progress: any;
  }): void {
    console.log('📊 Bulk operation progress:', data);
  }

  /**
   * Lifecycle hook: Called when bulk operation completes
   */
  protected override onBulkOperationCompleted(data: {
    operationId: string;
    results: any;
  }): void {
    console.log('✅ Bulk operation completed:', data);
    // Refresh local state after bulk operations
    this.syncWithServer().catch((error) => {
      console.error('Failed to sync after bulk operation:', error);
    });
  }

  /**
   * Lifecycle hook: Called when conflict is detected
   */
  protected override onConflictDetected(
    entityId: string | number,
    conflict: ConflictInfo,
  ): void {
    console.warn('🚨 Conflict detected for testproduct:', entityId, conflict);

    // Default strategy: Accept server version
    // Override this method to implement custom conflict resolution
    this.resolveConflict(entityId, 'accept_server');
  }

  /**
   * Lifecycle hook: Called when entity is locked by another user
   */
  protected override onEntityLocked(
    entityId: string | number,
    userId: string,
    lockType?: string,
  ): void {
    console.log('🔒 TestProduct locked:', { entityId, userId, lockType });
  }

  /**
   * Lifecycle hook: Called when entity is unlocked
   */
  protected override onEntityUnlocked(
    entityId: string | number,
    userId: string,
  ): void {
    console.log('🔓 TestProduct unlocked:', { entityId, userId });
  }

  /**
   * Public API: Initialize real-time features
   * Call this from your component's constructor or ngOnInit
   */
  public async initialize(): Promise<void> {
    console.log('🚀 Initializing TestProduct real-time features...');

    try {
      await this.syncWithServer();
      console.log('✅ TestProduct state manager ready');
    } catch (error) {
      console.error(
        '❌ Failed to initialize TestProduct state manager:',
        error,
      );
      throw error;
    }
  }

  /**
   * Public API: Force refresh from server
   * Useful for manual refresh buttons
   */
  public async refresh(): Promise<void> {
    console.log('🔄 Refreshing testproducts...');
    await this.syncWithServer();
  }

  /**
   * Public API: Get sync statistics
   */
  public getSyncStats() {
    return {
      localCount: this.localState().length,
      serverCount: this.serverState().length,
      conflictCount: this.conflicts().size,
      pendingOperations: this.pendingOperations().length,
      lastSync: this.lastSync(),
      syncStatus: this.syncStatus(),
      isConnected: this.isConnected(),
    };
  }
}
