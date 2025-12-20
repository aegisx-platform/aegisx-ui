import { Component, computed, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

/**
 * Control type for budget items
 */
type ControlType = 'NONE' | 'SOFT' | 'HARD';

/**
 * Budget item status based on usage percentage
 */
type ItemStatus = 'normal' | 'warning' | 'exceeded';

/**
 * Budget item with control settings and usage tracking
 */
interface BudgetItemStatus {
  item_id: number;
  drug_code?: string;
  drug_name: string;
  generic_name?: string;
  control_type: ControlType;
  quantity_control_type: ControlType;
  price_control_type: ControlType;
  quantity_variance_percent: number;
  price_variance_percent: number;
  planned_quantity: number;
  purchased_quantity: number;
  remaining_quantity: number;
  quantity_usage_percent: number;
  planned_amount: number;
  used_amount: number;
  remaining_amount: number;
  amount_usage_percent: number;
  status: ItemStatus;
  related_pr_ids: number[];
}

/**
 * Summary statistics for budget dashboard
 */
interface BudgetSummary {
  total_items: number;
  normal_items: number;
  warning_items: number;
  exceeded_items: number;
  total_planned_amount: number;
  total_used_amount: number;
  total_remaining_amount: number;
  overall_usage_percent: number;
}

/**
 * Complete budget status response from API
 */
interface BudgetItemsStatusResponse {
  budget_request_id: number;
  fiscal_year: number;
  current_quarter: number;
  items: BudgetItemStatus[];
  summary: BudgetSummary;
}

/**
 * Budget Dashboard Component
 *
 * Displays comprehensive budget status overview with:
 * - Summary cards (total budget, used, remaining, usage %)
 * - Control type breakdown (HARD/SOFT/NONE item counts)
 * - Status breakdown (normal/warning/exceeded item counts)
 * - Filterable item table with dual progress bars
 * - Color-coded status indicators
 *
 * @example
 * ```html
 * <app-budget-dashboard [budgetRequestId]="123" />
 * ```
 */
@Component({
  selector: 'app-budget-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatTooltipModule,
  ],
  templateUrl: './budget-dashboard.component.html',
  styleUrls: ['./budget-dashboard.component.scss'],
})
export class BudgetDashboardComponent {
  private readonly http = inject(HttpClient);

  // === INPUTS ===
  readonly budgetRequestId = input.required<number>();

  // === SIGNALS ===
  readonly controlTypeFilter = signal<ControlType | null>(null);
  readonly statusFilter = signal<ItemStatus | null>(null);
  readonly searchQuery = signal<string>('');
  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);

  // === DATA SIGNALS ===
  readonly budgetData = toSignal(
    this.http.get<{ success: boolean; data: BudgetItemsStatusResponse }>(
      `/api/inventory/budget/budget-requests/${this.budgetRequestId()}/items-status`,
    ),
    { initialValue: null },
  );

  readonly allItems = computed<BudgetItemStatus[]>(() => {
    const data = this.budgetData();
    if (!data || !data.success) return [];
    return data.data.items;
  });

  readonly summary = computed<BudgetSummary | null>(() => {
    const data = this.budgetData();
    if (!data || !data.success) return null;
    return data.data.summary;
  });

  readonly fiscalYear = computed<number>(() => {
    const data = this.budgetData();
    return data?.data?.fiscal_year || 0;
  });

  readonly currentQuarter = computed<number>(() => {
    const data = this.budgetData();
    return data?.data?.current_quarter || 0;
  });

  // === COMPUTED SIGNALS ===
  readonly filteredItems = computed<BudgetItemStatus[]>(() => {
    let items = this.allItems();

    const controlType = this.controlTypeFilter();
    if (controlType) {
      items = items.filter((item) => item.control_type === controlType);
    }

    const status = this.statusFilter();
    if (status) {
      items = items.filter((item) => item.status === status);
    }

    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      items = items.filter(
        (item) =>
          item.drug_name.toLowerCase().includes(query) ||
          (item.drug_code && item.drug_code.toLowerCase().includes(query)) ||
          (item.generic_name &&
            item.generic_name.toLowerCase().includes(query)),
      );
    }

    return items;
  });

  readonly controlTypeBreakdown = computed(() => {
    const items = this.allItems();
    return {
      HARD: items.filter((i) => i.control_type === 'HARD').length,
      SOFT: items.filter((i) => i.control_type === 'SOFT').length,
      NONE: items.filter((i) => i.control_type === 'NONE').length,
    };
  });

  readonly statusBreakdown = computed(() => {
    const items = this.allItems();
    return {
      normal: items.filter((i) => i.status === 'normal').length,
      warning: items.filter((i) => i.status === 'warning').length,
      exceeded: items.filter((i) => i.status === 'exceeded').length,
    };
  });

  // === METHODS ===
  getControlTypeColor(controlType: ControlType): string {
    return controlType === 'HARD'
      ? 'warn'
      : controlType === 'SOFT'
        ? 'accent'
        : 'primary';
  }

  getStatusColor(status: ItemStatus): string {
    return status === 'exceeded'
      ? 'warn'
      : status === 'warning'
        ? 'accent'
        : 'primary';
  }

  getProgressColor(usagePercent: number): string {
    if (usagePercent >= 100) return '#ef4444';
    else if (usagePercent >= 80) return '#f59e0b';
    else return '#10b981';
  }

  formatNumber(value: number): string {
    return value.toLocaleString('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  formatCurrency(value: number): string {
    return `฿${this.formatNumber(value)}`;
  }

  formatPercent(value: number): string {
    return `${value.toFixed(2)}%`;
  }

  resetFilters(): void {
    this.controlTypeFilter.set(null);
    this.statusFilter.set(null);
    this.searchQuery.set('');
  }

  exportToCSV(): void {
    // TODO: Implement CSV export
    console.log('Export to CSV:', this.filteredItems());
  }

  viewRelatedPR(prId: number): void {
    // TODO: Navigate to PR detail
    console.log('View PR:', prId);
  }
}
