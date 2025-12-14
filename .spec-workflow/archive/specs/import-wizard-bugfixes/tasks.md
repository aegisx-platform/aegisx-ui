# Tasks Document: Import Wizard Bug Fixes

## Summary

4 bug fixes for the System Initialization Import Wizard

---

- [x] 1. Fix file size display to use dynamic units
  - File: `apps/web/src/app/features/system-init/components/import-wizard/import-wizard.dialog.ts`
  - File: `apps/web/src/app/features/system-init/components/import-wizard/import-wizard.dialog.html`
  - Update `fileInfo` computed signal to calculate dynamic units (B, KB, MB, GB)
  - Remove hardcoded " MB" suffix from HTML template
  - Purpose: Display correct file size for small files (currently shows "0.00 MB")
  - _Leverage: ValidationResultsComponent.formattedFileSize pattern_
  - _Requirements: 1.1, 1.2, 1.3, 1.4_
  - _Prompt: Implement the task for spec import-wizard-bugfixes, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Angular Frontend Developer | Task: Fix the fileInfo computed signal in import-wizard.dialog.ts to use dynamic unit selection (B, KB, MB, GB) instead of always showing MB. Also update import-wizard.dialog.html to remove the hardcoded " MB" suffix. Reference ValidationResultsComponent.formattedFileSize for the pattern. | Restrictions: Do not change the return type structure of fileInfo, only change how size is calculated and displayed | \_Leverage: apps/web/src/app/features/system-init/components/validation-results/validation-results.component.ts formattedFileSize getter | Success: Small files (<1KB) show as "X.XX B", medium files show as "X.XX KB", large files show as "X.XX MB". Test with departments_template.csv. | Instructions: First mark this task as in-progress in tasks.md by changing [ ] to [-], implement the fix, use log-implementation tool to record what was done, then mark as complete [x]_

---

- [x] 2. Fix Excel template download async handling
  - File: `apps/api/src/core/import/base/base-import.service.ts`
  - Add `await` to `workbook.xlsx.writeBuffer()` call on line 205
  - Change type assertion from `Promise<Buffer>` to `Buffer`
  - Purpose: Fix Excel template download failing silently
  - _Leverage: Other services using ExcelJS properly (budget-requests.service.ts)_
  - _Requirements: 2.1, 2.2, 2.3_
  - _Prompt: Implement the task for spec import-wizard-bugfixes, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Node.js Backend Developer | Task: Fix the generateExcelTemplate method in base-import.service.ts line 205. Change `return workbook.xlsx.writeBuffer() as Promise<Buffer>` to properly await the buffer: `const buffer = await workbook.xlsx.writeBuffer(); return buffer as Buffer;` | Restrictions: Only modify line 205 and surrounding code if needed, do not change other parts of the file | \_Leverage: apps/api/src/modules/inventory/budget/budgetRequests/budget-requests.service.ts for proper ExcelJS pattern | Success: Clicking "Download Excel Template" in Import Wizard successfully downloads a valid .xlsx file | Instructions: First mark this task as in-progress in tasks.md by changing [ ] to [-], implement the fix, use log-implementation tool to record what was done, then mark as complete [x]_

---

- [x] 3. Fix validation step navigation async flow
  - File: `apps/web/src/app/features/system-init/components/import-wizard/import-wizard.dialog.ts`
  - Make `nextStep()` method async
  - Add `await` before `validateFile()` call
  - Add check after validation to only proceed if `canProceedToNextStep()` is true
  - Purpose: Fix "Ready to validate" stuck state - user cannot proceed after validation
  - _Leverage: Existing validateFile() method which is already async_
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  - _Prompt: Implement the task for spec import-wizard-bugfixes, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Angular Frontend Developer | Task: Fix the nextStep() method in import-wizard.dialog.ts (lines 417-428). Make it async and await the validateFile() call. After validation, check if canProceedToNextStep() returns true before incrementing the step. This ensures the validation completes before transitioning to the results view. | Restrictions: Do not change the logic of canProceedToNextStep() or validateFile(), only fix the async flow in nextStep() | \_Leverage: The existing async validateFile() method in the same file | Success: User can successfully validate a file and proceed to Step 4 when validation passes. Test with /Users/sathitseethaphon/Downloads/departments_template.csv | Instructions: First mark this task as in-progress in tasks.md by changing [ ] to [-], implement the fix, use log-implementation tool to record what was done, then mark as complete [x]_

---

- [x] 4. Disable Import History & Settings buttons with tooltip
  - File: `apps/web/src/app/features/system-init/pages/system-init-dashboard/system-init-dashboard.page.html`
  - File: `apps/web/src/app/features/system-init/pages/system-init-dashboard/system-init-dashboard.page.ts`
  - Add `[disabled]="true"` and `matTooltip="Coming Soon"` to both buttons
  - Ensure `MatTooltipModule` is imported in the component
  - Purpose: Indicate to users that these features are not yet implemented
  - _Leverage: MatTooltipModule from Angular Material_
  - _Requirements: 4.1, 4.2_
  - _Prompt: Implement the task for spec import-wizard-bugfixes, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Angular Frontend Developer | Task: Update Import History and Settings buttons in system-init-dashboard.page.html (lines 22-30) to be disabled with a "Coming Soon" tooltip. Add [disabled]="true" and matTooltip="Coming Soon" attributes. Verify MatTooltipModule is imported in the component file. | Restrictions: Do not create new pages or dialogs, just disable the existing buttons | \_Leverage: MatTooltipModule already available in Angular Material | Success: Both buttons appear disabled (grayed out) and show "Coming Soon" tooltip on hover | Instructions: First mark this task as in-progress in tasks.md by changing [ ] to [-], implement the fix, use log-implementation tool to record what was done, then mark as complete [x]_

---

## Testing Checklist

After all tasks complete:

1. Upload small file (<1KB) - verify size shows "X.XX B" or "X.XX KB"
2. Download Excel template - verify .xlsx file downloads
3. Upload CSV and validate - verify Next button works after validation
4. Hover on History/Settings buttons - verify "Coming Soon" tooltip
