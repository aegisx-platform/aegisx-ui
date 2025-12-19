/**
 * Example: How to use the ItemSettingsModalComponent
 *
 * This component implements Tasks 3.1, 3.3, and 3.4 of the Item-Level Budget Control feature.
 * It provides a drawer modal for configuring budget control settings per budget request item.
 *
 * Features:
 * - Task 3.1: Item settings form with control type dropdowns and variance inputs
 * - Task 3.3: Real-time impact preview showing example scenarios
 * - Task 3.4: Recommended settings table by drug category
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemSettingsModalComponent } from './item-settings-modal.component';

@Component({
  selector: 'app-budget-items-example',
  standalone: true,
  imports: [ItemSettingsModalComponent],
  template: `
    <!-- Usage Example -->
    <button (click)="openItemSettings()">Edit Item Settings</button>

    <!-- Modal Component -->
    <ax-item-settings-modal #itemSettingsModal></ax-item-settings-modal>
  `,
})
export class BudgetItemsExampleComponent {
  @ViewChild('itemSettingsModal')
  itemSettingsModal!: ItemSettingsModalComponent;

  // Example budget request item
  sampleItem = {
    id: '1',
    name: 'Paracetamol 500mg',
    category: 'ED - Essential (บัญชียาหลัก)',
    planedQuantity: 2500,
    plannedPrice: 2.5,
    quantityControlType: 'SOFT' as const,
    priceControlType: 'SOFT' as const,
    quantityVariancePercent: 10,
    priceVariancePercent: 15,
  };

  openItemSettings(): void {
    this.itemSettingsModal.open(this.sampleItem);
  }
}

/**
 * IMPLEMENTATION DETAILS
 *
 * Task 3.1: Item Settings Modal Component
 * - Uses Angular 17+ standalone component API
 * - ReactiveFormsModule for form management
 * - Validates variance percentages (0-100)
 *
 * Task 3.3: Real-Time Impact Preview
 * - Uses computed() signals to derive preview data
 * - Shows example scenarios: Allowed, Warning, Blocked
 * - Updates instantly when form values change
 * - Calculates based on current form settings
 *
 * Task 3.4: Recommended Settings Table
 * - Static recommendations for 5 drug categories:
 *   1. ED - Essential (ยาหลัก) → HARD qty, SOFT price
 *   2. NED - Non-Essential (นอกบัญชี) → SOFT qty, SOFT price
 *   3. NDMS - Controlled (ยาควบคุม) → HARD qty, HARD price
 *   4. Vitamins/Supplements → NONE qty, NONE price
 *   5. High-Value Items (>100 THB/unit) → HARD qty, SOFT price
 * - Click "Apply" to fill form with recommended values
 * - Includes Thai explanations for each category
 *
 * CONTROL TYPES
 * - NONE (⚪): No validation, any quantity/price allowed
 * - SOFT (🟡): Warnings shown, can proceed with justification
 * - HARD (🔴): Purchase blocked if exceeding tolerance
 *
 * API INTEGRATION
 * In the real implementation, replace the console.log in onSave():
 *
 *   onSave(): void {
 *     if (this.settingsForm?.valid) {
 *       const formValue = this.settingsForm.value;
 *       const item = this.selectedItem();
 *       if (item) {
 *         this.budgetService.updateItemSettings(item.id, formValue)
 *           .subscribe(() => {
 *             this.toastService.success('Settings saved');
 *             this.isOpen.set(false);
 *           });
 *       }
 *     }
 *   }
 *
 * STYLING
 * - Uses CSS custom properties for theming
 * - Responsive layout with mobile support
 * - AegisX UI component styling integrated
 * - Color-coded badges for control types
 *
 * ACCESSIBILITY
 * - Form labels properly associated with inputs
 * - ARIA attributes for modal
 * - Keyboard navigation support
 * - Semantic HTML structure
 */
