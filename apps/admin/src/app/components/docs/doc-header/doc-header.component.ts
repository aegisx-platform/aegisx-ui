import { Component, Input, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AxBreadcrumbComponent } from '@aegisx/ui';
import { BreadcrumbItem, ComponentStatus } from '../../../types/docs.types';

/**
 * Documentation Header Component
 *
 * Unified header for all documentation pages:
 * - Component docs: with import statement, status badge, version
 * - Guide/prose pages: simplified header without code-related elements
 *
 * Features:
 * - Breadcrumb navigation (with optional icon)
 * - Title and description
 * - Status badge (stable/beta/experimental/deprecated)
 * - Quick import statement with copy button
 * - Quick links for navigation
 *
 * Variants:
 * - 'component': Full header with import, status, version (default)
 * - 'page': Simplified header for prose/guide pages
 */
@Component({
  selector: 'ax-doc-header',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSnackBarModule,
    AxBreadcrumbComponent,
  ],
  template: `
    <header class="doc-header" [class.doc-header--page]="variant === 'page'">
      <!-- Breadcrumb -->
      @if (breadcrumbs.length > 0) {
        <nav class="doc-header__breadcrumb">
          @if (icon) {
            <mat-icon class="doc-header__breadcrumb-icon">{{ icon }}</mat-icon>
          }
          @for (item of breadcrumbs; track item.label; let last = $last) {
            @if (item.link && !last) {
              <a [routerLink]="item.link" class="doc-header__breadcrumb-link">
                {{ item.label }}
              </a>
              <mat-icon class="doc-header__breadcrumb-separator"
                >chevron_right</mat-icon
              >
            } @else {
              <span class="doc-header__breadcrumb-current">{{
                item.label
              }}</span>
            }
          }
        </nav>
      }

      <!-- Title Row -->
      <div class="doc-header__title-row">
        <h1 class="doc-header__title">{{ title }}</h1>
        @if (showStatus && status) {
          <span class="doc-header__badge doc-header__badge--{{ status }}">
            {{ getStatusLabel(status) }}
          </span>
        }
        @if (showVersion && version) {
          <span class="doc-header__version">{{ version }}</span>
        }
      </div>

      <!-- Description -->
      @if (description) {
        <p class="doc-header__description">{{ description }}</p>
      }

      <!-- Import Statement (only for component variant) -->
      @if (showImport && importName) {
        <div class="doc-header__import">
          <code class="doc-header__import-code">
            import {{ '{' }} {{ importName }} {{ '}' }} from '{{ importPath }}';
          </code>
          <button
            mat-icon-button
            class="doc-header__copy-btn"
            matTooltip="Copy import"
            (click)="copyImport()"
          >
            <mat-icon>content_copy</mat-icon>
          </button>
        </div>
      }

      <!-- Quick Links (only for component variant) -->
      @if (showQuickLinks) {
        <nav class="doc-header__quick-links">
          <span class="doc-header__quick-links-label">Jump to:</span>
          <a href="#examples" class="doc-header__quick-link">Examples</a>
          <a href="#api" class="doc-header__quick-link">API</a>
          @if (showTokens) {
            <a href="#tokens" class="doc-header__quick-link">Tokens</a>
          }
          <a href="#guidelines" class="doc-header__quick-link">Guidelines</a>
        </nav>
      }
    </header>
  `,
  // Styles are provided by @aegisx/ui theme styles (_docs.scss)
})
export class DocHeaderComponent {
  private readonly clipboard = inject(Clipboard);
  private readonly snackBar = inject(MatSnackBar);

  // Content
  @Input() title = '';
  @Input() description = '';
  @Input() breadcrumbs: BreadcrumbItem[] = [];

  // Variant: 'component' (default) or 'page' (for prose/guide pages)
  @Input() variant: 'component' | 'page' = 'component';

  // Optional icon for breadcrumb (e.g., 'rocket_launch' for Getting Started)
  @Input() icon?: string;

  // Component metadata
  @Input() status?: ComponentStatus;
  @Input() version?: string;
  @Input() importPath = '@aegisx/ui';
  @Input() importName = '';

  // Visibility controls
  @Input() showImport = true;
  @Input() showStatus = true;
  @Input() showVersion = true;
  @Input() showQuickLinks = true;
  @Input() showTokens = true;

  getStatusLabel(status: ComponentStatus): string {
    const labels: Record<ComponentStatus, string> = {
      stable: 'Stable',
      beta: 'Beta',
      experimental: 'Experimental',
      deprecated: 'Deprecated',
    };
    return labels[status];
  }

  copyImport(): void {
    const importStatement = `import { ${this.importName} } from '${this.importPath}';`;
    this.clipboard.copy(importStatement);
    this.snackBar.open('Import copied to clipboard', 'Close', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
