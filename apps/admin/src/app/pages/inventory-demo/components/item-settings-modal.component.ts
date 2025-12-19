import {
  Component,
  inject,
  signal,
  computed,
  Injector,
  runInInjectionContext,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { AxDrawerComponent, AxBadgeComponent } from '@aegisx/ui';

interface BudgetRequestItem {
  id: string;
  name: string;
  category: string;
  planedQuantity: number;
  plannedPrice: number;
  quantityControlType: 'NONE' | 'SOFT' | 'HARD';
  priceControlType: 'NONE' | 'SOFT' | 'HARD';
  quantityVariancePercent: number;
  priceVariancePercent: number;
}

interface ImpactPreviewItem {
  quantity: number;
  icon: string;
  label: string;
  status: 'allowed' | 'blocked' | 'warning';
}

interface RecommendedSetting {
  category: string;
  quantityControl: 'NONE' | 'SOFT' | 'HARD';
  priceControl: 'NONE' | 'SOFT' | 'HARD';
  quantityVariance: number;
  priceVariance: number;
  reason: string;
  reasonTh: string;
}

@Component({
  selector: 'ax-item-settings-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatTabsModule,
    AxDrawerComponent,
    AxBadgeComponent,
  ],
  template: `
    <ax-drawer [open]="isOpen()" [title]="'Item Budget Control Settings'">
      <div class="modal-content">
        <!-- Form Section -->
        <div class="form-section">
          <h3 class="section-title">Configure Control Settings</h3>

          @if (settingsForm) {
            <form [formGroup]="settingsForm" class="control-form">
              <!-- Quantity Control -->
              <div class="form-group">
                <label for="quantity-control">Quantity Control Type</label>
                <mat-select
                  id="quantity-control"
                  formControlName="quantityControlType"
                  class="form-select"
                >
                  @for (option of controlTypes; track option.value) {
                    <mat-option [value]="option.value">
                      <span class="option-badge">{{ option.icon }}</span>
                      {{ option.label }}
                    </mat-option>
                  }
                </mat-select>
              </div>

              <!-- Quantity Variance -->
              @if (settingsForm.get('quantityControlType')?.value !== 'NONE') {
                <div class="form-group">
                  <label for="quantity-variance">Variance (%)</label>
                  <mat-form-field appearance="outline">
                    <mat-label>0-100%</mat-label>
                    <input
                      id="quantity-variance"
                      matInput
                      type="number"
                      formControlName="quantityVariancePercent"
                      min="0"
                      max="100"
                    />
                  </mat-form-field>
                </div>
              }

              <!-- Divider -->
              <div class="divider"></div>

              <!-- Price Control -->
              <div class="form-group">
                <label for="price-control">Price Control Type</label>
                <mat-select
                  id="price-control"
                  formControlName="priceControlType"
                  class="form-select"
                >
                  @for (option of controlTypes; track option.value) {
                    <mat-option [value]="option.value">
                      <span class="option-badge">{{ option.icon }}</span>
                      {{ option.label }}
                    </mat-option>
                  }
                </mat-select>
              </div>

              <!-- Price Variance -->
              @if (settingsForm.get('priceControlType')?.value !== 'NONE') {
                <div class="form-group">
                  <label for="price-variance">Variance (%)</label>
                  <mat-form-field appearance="outline">
                    <mat-label>0-100%</mat-label>
                    <input
                      id="price-variance"
                      matInput
                      type="number"
                      formControlName="priceVariancePercent"
                      min="0"
                      max="100"
                    />
                  </mat-form-field>
                </div>
              }
            </form>
          }
        </div>

        <!-- Impact Preview Section (Task 3.3) -->
        <div class="impact-preview-section">
          <h3 class="section-title">
            <mat-icon class="section-icon">insights</mat-icon>
            Impact Preview (ผลกระทบจากการตั้งค่า)
          </h3>

          <div class="preview-container">
            <!-- Quantity Impact -->
            <div class="preview-group">
              <h4 class="preview-subtitle">Quantity Control Impact</h4>
              <div class="impact-examples">
                @for (item of quantityImpactPreview(); track item.label) {
                  <div class="impact-item" [class]="item.status">
                    <span class="impact-icon">{{ item.icon }}</span>
                    <div class="impact-info">
                      <span class="impact-quantity">
                        {{ item.quantity }} units
                      </span>
                      <span class="impact-label">{{ item.label }}</span>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Price Impact -->
            <div class="preview-group">
              <h4 class="preview-subtitle">Price Control Impact</h4>
              <div class="impact-examples">
                @for (item of priceImpactPreview(); track item.label) {
                  <div class="impact-item" [class]="item.status">
                    <span class="impact-icon">{{ item.icon }}</span>
                    <div class="impact-info">
                      <span class="impact-quantity">
                        THB {{ item.quantity | number: '1.2-2' }}
                      </span>
                      <span class="impact-label">{{ item.label }}</span>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Summary Text -->
          <div class="preview-summary">
            <p class="summary-text">
              @switch (controlTypeDescription()) {
                @case ('none') {
                  ✅ <strong>No Control</strong> - Items can be purchased
                  without restrictions
                }
                @case ('soft') {
                  ⚠️ <strong>Soft Control</strong> - Warnings will be shown when
                  exceeding tolerance, but purchase can proceed with
                  justification
                }
                @case ('hard') {
                  🔴 <strong>Hard Control</strong> - Purchase will be blocked if
                  exceeding tolerance limits
                }
              }
            </p>
          </div>
        </div>

        <!-- Recommended Settings Section (Task 3.4) -->
        <div class="recommendations-section">
          <h3 class="section-title">
            <mat-icon class="section-icon">lightbulb</mat-icon>
            Recommended Settings (แนะนำ)
          </h3>

          <div class="recommendations-table-container">
            <table class="recommendations-table">
              <thead>
                <tr>
                  <th>Drug Category / ประเภทยา</th>
                  <th>Quantity / ปริมาณ</th>
                  <th>Price / ราคา</th>
                  <th>Reason / เหตุผล</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                @for (
                  rec of recommendedSettings;
                  track rec.category;
                  let last = $last
                ) {
                  <tr [class.last-row]="last">
                    <td class="category-cell">
                      <strong>{{ rec.category }}</strong>
                    </td>
                    <td class="control-cell">
                      <ax-badge
                        [content]="
                          rec.quantityControl +
                          ' ±' +
                          rec.quantityVariance +
                          '%'
                        "
                        [type]="getBadgeVariant(rec.quantityControl)"
                        size="sm"
                      />
                    </td>
                    <td class="control-cell">
                      <ax-badge
                        [content]="
                          rec.priceControl + ' ±' + rec.priceVariance + '%'
                        "
                        [type]="getBadgeVariant(rec.priceControl)"
                        size="sm"
                      />
                    </td>
                    <td class="reason-cell">
                      <span class="reason-primary">{{ rec.reasonTh }}</span>
                      <span class="reason-secondary">{{ rec.reason }}</span>
                    </td>
                    <td class="action-cell">
                      <button
                        mat-icon-button
                        (click)="applyRecommendedSettings(rec)"
                        matTooltip="Apply these settings"
                        class="apply-btn"
                      >
                        <mat-icon>check_circle</mat-icon>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <p class="recommendations-hint">
            Click the checkmark button to apply recommended settings for that
            drug category
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="modal-actions">
          <button mat-stroked-button (click)="onCancel()" class="cancel-btn">
            Cancel
          </button>
          <button
            mat-flat-button
            color="primary"
            (click)="onSave()"
            [disabled]="!settingsForm?.valid"
            class="save-btn"
          >
            Save Settings
          </button>
        </div>
      </div>
    </ax-drawer>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .modal-content {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        padding: 1.5rem;
      }

      .section-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1rem;
        font-weight: 600;
        color: var(--ax-text-heading);
        margin: 0 0 1rem 0;
      }

      .section-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
        color: var(--ax-brand-default);
      }

      /* Form Section */
      .form-section {
        border-bottom: 1px solid var(--ax-border-muted);
        padding-bottom: 1.5rem;
      }

      .control-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .form-group label {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--ax-text-primary);
      }

      .form-select {
        padding: 0.75rem;
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-md);
        background: white;
        font-size: 0.875rem;

        &:focus {
          outline: 2px solid var(--ax-brand-default);
          outline-offset: -1px;
        }
      }

      mat-form-field {
        width: 100%;
      }

      .option-badge {
        margin-right: 0.5rem;
        font-size: 1rem;
      }

      .divider {
        height: 1px;
        background: var(--ax-border-muted);
        margin: 0.5rem 0;
      }

      /* Impact Preview Section (Task 3.3) */
      .impact-preview-section {
        border-bottom: 1px solid var(--ax-border-muted);
        padding-bottom: 1.5rem;
      }

      .preview-container {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .preview-group {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .preview-subtitle {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--ax-text-secondary);
        margin: 0;
      }

      .impact-examples {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .impact-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem;
        border-radius: var(--ax-radius-md);
        border-left: 3px solid;

        &.allowed {
          background: var(--ax-success-faint);
          border-color: var(--ax-success-default);
        }

        &.warning {
          background: var(--ax-warning-faint);
          border-color: var(--ax-warning-default);
        }

        &.blocked {
          background: var(--ax-error-faint);
          border-color: var(--ax-error-default);
        }
      }

      .impact-icon {
        font-size: 1.25rem;
        min-width: 24px;
        text-align: center;
      }

      .impact-info {
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
      }

      .impact-quantity {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--ax-text-heading);
      }

      .impact-label {
        font-size: 0.75rem;
        color: var(--ax-text-secondary);
      }

      .preview-summary {
        background: var(--ax-background-subtle);
        border-radius: var(--ax-radius-md);
        padding: 1rem;
      }

      .summary-text {
        font-size: 0.875rem;
        color: var(--ax-text-primary);
        margin: 0;
        line-height: 1.5;
      }

      /* Recommendations Section (Task 3.4) */
      .recommendations-section {
        border-bottom: 1px solid var(--ax-border-muted);
        padding-bottom: 1.5rem;
      }

      .recommendations-table-container {
        overflow-x: auto;
        border: 1px solid var(--ax-border-muted);
        border-radius: var(--ax-radius-md);
      }

      .recommendations-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.875rem;

        thead {
          background: var(--ax-background-subtle);
          border-bottom: 2px solid var(--ax-border-muted);
        }

        th {
          padding: 0.75rem;
          text-align: left;
          font-weight: 600;
          color: var(--ax-text-heading);
          white-space: nowrap;
        }

        td {
          padding: 0.75rem;
          border-bottom: 1px solid var(--ax-border-muted);

          &:last-child {
            text-align: center;
          }
        }

        tr.last-row td {
          border-bottom: none;
        }

        tbody tr:hover {
          background: var(--ax-background-subtle);
        }
      }

      .category-cell {
        min-width: 150px;
      }

      .control-cell {
        text-align: center;
      }

      .reason-cell {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        min-width: 180px;
      }

      .reason-primary {
        font-weight: 500;
        color: var(--ax-text-heading);
      }

      .reason-secondary {
        font-size: 0.75rem;
        color: var(--ax-text-secondary);
      }

      .action-cell {
        min-width: 50px;
      }

      .apply-btn {
        color: var(--ax-success-default);
        transition: all 0.2s ease;

        &:hover {
          transform: scale(1.1);
          color: var(--ax-success-700);
        }
      }

      .recommendations-hint {
        font-size: 0.75rem;
        color: var(--ax-text-secondary);
        margin-top: 0.75rem;
        margin-bottom: 0;
      }

      /* Action Buttons */
      .modal-actions {
        display: flex;
        gap: 0.75rem;
        justify-content: flex-end;
        padding-top: 1rem;
        border-top: 1px solid var(--ax-border-muted);
      }

      .cancel-btn {
        min-width: 100px;
      }

      .save-btn {
        min-width: 120px;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .modal-content {
          gap: 1.5rem;
          padding: 1rem;
        }

        .recommendations-table {
          font-size: 0.75rem;

          th,
          td {
            padding: 0.5rem;
          }
        }

        .category-cell {
          min-width: 100px;
        }

        .reason-cell {
          min-width: 120px;
        }
      }
    `,
  ],
})
export class ItemSettingsModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private injector = inject(Injector);

  // State signals
  isOpen = signal(false);
  selectedItem = signal<BudgetRequestItem | null>(null);
  settingsForm: FormGroup | null = null;

  // Control type options
  controlTypes = [
    { value: 'NONE', label: 'No Control', icon: '⚪' },
    { value: 'SOFT', label: 'Soft Control (Warning)', icon: '🟡' },
    { value: 'HARD', label: 'Hard Control (Block)', icon: '🔴' },
  ];

  // Recommended settings (Task 3.4)
  recommendedSettings: RecommendedSetting[] = [
    {
      category: 'ED - Essential (บัญชียาหลัก)',
      quantityControl: 'HARD',
      priceControl: 'SOFT',
      quantityVariance: 5,
      priceVariance: 10,
      reason: 'Strict control for essential drugs',
      reasonTh: 'ควบคุมเข้มงวด',
    },
    {
      category: 'NED - Non-Essential (นอกบัญชี)',
      quantityControl: 'SOFT',
      priceControl: 'SOFT',
      quantityVariance: 15,
      priceVariance: 20,
      reason: 'Flexible control for general medicines',
      reasonTh: 'ยืดหยุ่นได้',
    },
    {
      category: 'NDMS - Controlled (ยาควบคุม)',
      quantityControl: 'HARD',
      priceControl: 'HARD',
      quantityVariance: 0,
      priceVariance: 0,
      reason: 'Strict per contract',
      reasonTh: 'ตามสัญญา',
    },
    {
      category: 'Vitamins/Supplements (วิตามิน)',
      quantityControl: 'NONE',
      priceControl: 'NONE',
      quantityVariance: 0,
      priceVariance: 0,
      reason: 'No control needed',
      reasonTh: 'ไม่จำเป็น',
    },
    {
      category: 'High-Value Items (>100 THB/unit)',
      quantityControl: 'HARD',
      priceControl: 'SOFT',
      quantityVariance: 5,
      priceVariance: 10,
      reason: 'Cost control for expensive items',
      reasonTh: 'ควบคุมต้นทุน',
    },
  ];

  // Computed signals for impact preview (Task 3.3)
  quantityImpactPreview = computed(() => {
    const form = this.settingsForm;
    if (!form) return [];

    const item = this.selectedItem();
    if (!item) return [];

    const controlType = form.get('quantityControlType')?.value;
    const variance = form.get('quantityVariancePercent')?.value || 10;
    const basedQuantity = item.planedQuantity;

    const allowed = Math.round(basedQuantity);
    const withinTolerance = Math.round(basedQuantity * (1 + variance / 100));
    const exceedHardLimit = Math.round(basedQuantity * 1.3); // 30% over

    const results: ImpactPreviewItem[] = [];

    if (controlType === 'NONE') {
      results.push({
        quantity: basedQuantity,
        icon: '✅',
        label: `Any quantity allowed (${basedQuantity} units as example)`,
        status: 'allowed',
      });
    } else if (controlType === 'SOFT') {
      results.push({
        quantity: withinTolerance,
        icon: '✅',
        label: `Allowed: Up to ±${variance}% (${allowed} - ${withinTolerance} units)`,
        status: 'allowed',
      });
      results.push({
        quantity: exceedHardLimit,
        icon: '⚠️',
        label: `Warning: ${exceedHardLimit} units exceeds ±${variance}% (30% over)`,
        status: 'warning',
      });
    } else if (controlType === 'HARD') {
      results.push({
        quantity: withinTolerance,
        icon: '✅',
        label: `Allowed: ±${variance}% (${allowed} - ${withinTolerance} units)`,
        status: 'allowed',
      });
      results.push({
        quantity: exceedHardLimit,
        icon: '🔴',
        label: `Blocked: ${exceedHardLimit} units exceeds limit`,
        status: 'blocked',
      });
    }

    return results;
  });

  priceImpactPreview = computed(() => {
    const form = this.settingsForm;
    if (!form) return [];

    const item = this.selectedItem();
    if (!item) return [];

    const controlType = form.get('priceControlType')?.value;
    const variance = form.get('priceVariancePercent')?.value || 15;
    const basePrice = item.plannedPrice;

    const allowed = basePrice;
    const withinTolerance = basePrice * (1 + variance / 100);
    const exceedHardLimit = basePrice * 1.3; // 30% over

    const results: ImpactPreviewItem[] = [];

    if (controlType === 'NONE') {
      results.push({
        quantity: basePrice,
        icon: '✅',
        label: `Any price allowed (THB ${basePrice.toFixed(2)} as example)`,
        status: 'allowed',
      });
    } else if (controlType === 'SOFT') {
      results.push({
        quantity: withinTolerance,
        icon: '✅',
        label: `Allowed: ±${variance}% (THB ${allowed.toFixed(2)} - ${withinTolerance.toFixed(2)})`,
        status: 'allowed',
      });
      results.push({
        quantity: exceedHardLimit,
        icon: '⚠️',
        label: `Warning: THB ${exceedHardLimit.toFixed(2)} exceeds ±${variance}%`,
        status: 'warning',
      });
    } else if (controlType === 'HARD') {
      results.push({
        quantity: withinTolerance,
        icon: '✅',
        label: `Allowed: ±${variance}% (THB ${allowed.toFixed(2)} - ${withinTolerance.toFixed(2)})`,
        status: 'allowed',
      });
      results.push({
        quantity: exceedHardLimit,
        icon: '🔴',
        label: `Blocked: THB ${exceedHardLimit.toFixed(2)} exceeds limit`,
        status: 'blocked',
      });
    }

    return results;
  });

  controlTypeDescription = computed(() => {
    const form = this.settingsForm;
    if (!form) return 'none';

    const qtyControl = form.get('quantityControlType')?.value;
    const priceControl = form.get('priceControlType')?.value;

    if (qtyControl === 'HARD' || priceControl === 'HARD') {
      return 'hard';
    } else if (qtyControl === 'SOFT' || priceControl === 'SOFT') {
      return 'soft';
    }
    return 'none';
  });

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.settingsForm = this.fb.group({
      quantityControlType: ['SOFT', Validators.required],
      quantityVariancePercent: [
        10,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      priceControlType: ['SOFT', Validators.required],
      priceVariancePercent: [
        15,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
    });
  }

  open(item: BudgetRequestItem): void {
    this.selectedItem.set(item);
    if (this.settingsForm) {
      this.settingsForm.patchValue({
        quantityControlType: item.quantityControlType,
        quantityVariancePercent: item.quantityVariancePercent,
        priceControlType: item.priceControlType,
        priceVariancePercent: item.priceVariancePercent,
      });
    }
    this.isOpen.set(true);
  }

  getBadgeVariant(controlType: string): 'success' | 'warn' | 'danger' | 'info' {
    switch (controlType) {
      case 'HARD':
        return 'danger';
      case 'SOFT':
        return 'warn';
      case 'NONE':
        return 'info';
      default:
        return 'info';
    }
  }

  applyRecommendedSettings(recommendation: RecommendedSetting): void {
    if (this.settingsForm) {
      this.settingsForm.patchValue({
        quantityControlType: recommendation.quantityControl,
        quantityVariancePercent: recommendation.quantityVariance,
        priceControlType: recommendation.priceControl,
        priceVariancePercent: recommendation.priceVariance,
      });
    }
  }

  onSave(): void {
    if (this.settingsForm?.valid) {
      const formValue = this.settingsForm.value;
      const item = this.selectedItem();

      if (item) {
        const updatedItem: BudgetRequestItem = {
          ...item,
          quantityControlType: formValue.quantityControlType,
          quantityVariancePercent: formValue.quantityVariancePercent,
          priceControlType: formValue.priceControlType,
          priceVariancePercent: formValue.priceVariancePercent,
        };

        console.log('Saving item settings:', updatedItem);
        // TODO: Call API to save settings
        // this.budgetService.updateItemSettings(updatedItem).subscribe(...)

        this.isOpen.set(false);
      }
    }
  }

  onCancel(): void {
    this.isOpen.set(false);
  }
}
