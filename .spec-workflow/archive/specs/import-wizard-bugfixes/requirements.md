# Requirements Document: Import Wizard Bug Fixes

## Introduction

This specification addresses critical bugs in the System Initialization Import Wizard feature that prevent users from successfully importing data. The bugs affect file size display, Excel template download, validation step navigation, and unimplemented UI buttons.

## Alignment with Product Vision

The Import Wizard is a core feature of the System Initialization module that enables administrators to bulk import master data (departments, locations, etc.) into the system. These bug fixes are essential to ensure a smooth user experience and successful data migration.

## Requirements

### Requirement 1: File Size Display Fix

**User Story:** As an administrator, I want to see the correct file size of my uploaded file, so that I can verify I've selected the right file.

#### Acceptance Criteria

1. WHEN a file smaller than 1KB is uploaded THEN the system SHALL display size in bytes (e.g., "512 B")
2. WHEN a file between 1KB and 1MB is uploaded THEN the system SHALL display size in KB (e.g., "256.50 KB")
3. WHEN a file between 1MB and 1GB is uploaded THEN the system SHALL display size in MB (e.g., "2.35 MB")
4. WHEN a file larger than 1GB is uploaded THEN the system SHALL display size in GB (e.g., "1.25 GB")

**Bug Location:** `apps/web/src/app/features/system-init/components/import-wizard/import-wizard.dialog.ts` (lines 117-135)

**Root Cause:** The `fileInfo` computed signal always divides by 1MB and uses `.toFixed(2)`, causing small files to show "0.00 MB"

---

### Requirement 2: Excel Template Download Fix

**User Story:** As an administrator, I want to download Excel (.xlsx) templates, so that I can prepare data for import using my preferred spreadsheet application.

#### Acceptance Criteria

1. WHEN user clicks "Download Excel Template" button THEN the system SHALL generate and download a valid .xlsx file
2. IF the Excel file generation fails THEN the system SHALL display an appropriate error message
3. WHEN template is downloaded THEN the file SHALL contain correct headers and example data

**Bug Location:** `apps/api/src/core/import/base/base-import.service.ts` (line 205)

**Root Cause:** The `generateExcelTemplate()` method returns `workbook.xlsx.writeBuffer() as Promise<Buffer>` without `await`, causing async handling issues

---

### Requirement 3: Validation Step Navigation Fix

**User Story:** As an administrator, I want to proceed through the import wizard validation step, so that I can import my data after validation passes.

#### Acceptance Criteria

1. WHEN user clicks "Next" from Step 2 (Upload) THEN the system SHALL wait for validation to complete before showing Step 3 results
2. IF validation succeeds with no errors THEN the system SHALL enable the "Next" button to proceed to Step 4
3. IF validation succeeds with warnings only THEN the system SHALL enable the "Next" button with canProceed=true
4. IF validation fails with errors THEN the system SHALL disable the "Next" button and show error messages
5. WHEN validation is in progress THEN the system SHALL show a loading indicator

**Bug Location:** `apps/web/src/app/features/system-init/components/import-wizard/import-wizard.dialog.ts` (lines 417-428)

**Root Cause:** The `nextStep()` method calls `validateFile()` (async) but doesn't await it, then immediately increments the step. User sees "Ready to validate" because `validationResult()` is null while validation runs in background.

---

### Requirement 4: Import History & Settings Buttons

**User Story:** As an administrator, I want the Import History and Settings buttons to work, so that I can view past imports and configure import settings.

#### Acceptance Criteria

1. WHEN user clicks "Import History" button THEN the system SHALL either:
   - Navigate to Import History page showing past imports, OR
   - Show button as disabled with "Coming Soon" tooltip
2. WHEN user clicks "Settings" button THEN the system SHALL either:
   - Open Settings dialog for import configuration, OR
   - Show button as disabled with "Coming Soon" tooltip

**Bug Location:** `apps/web/src/app/features/system-init/pages/system-init-dashboard/system-init-dashboard.page.html` (lines 22-30)

**Root Cause:** Buttons exist in HTML but have no click handlers or routing implemented

---

## Non-Functional Requirements

### Code Architecture and Modularity

- **Single Responsibility Principle**: Each fix should be isolated to its specific file
- **Modular Design**: Reuse existing patterns (e.g., `ValidationResultsComponent.formattedFileSize` for dynamic units)
- **Dependency Management**: No new dependencies required
- **Clear Interfaces**: Maintain existing API contracts

### Performance

- File size calculation should be O(1) - no impact on performance
- Excel generation should complete within 5 seconds for typical templates
- Validation navigation should feel instant to users (show loading state)

### Security

- No security changes required for these bug fixes
- Maintain existing file size and type validation

### Reliability

- All fixes must include proper error handling
- Async operations must be properly awaited
- Failed operations should show user-friendly error messages

### Usability

- File size display should be human-readable with appropriate units
- Loading states should be clearly visible during async operations
- Disabled buttons should have tooltips explaining why they're disabled
