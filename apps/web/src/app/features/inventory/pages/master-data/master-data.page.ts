import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  AxLauncherComponent,
  LauncherApp,
  LauncherAppClickEvent,
} from '@aegisx/ui';
import { SECTION_ITEMS } from './master-data.config';

/**
 * Master Data Section Page
 *
 * Displays modules for the Master Data section.
 * Uses ax-launcher component for card-based navigation.
 */
@Component({
  selector: 'app-master-data',
  standalone: true,
  imports: [CommonModule, AxLauncherComponent],
  template: `
    <div class="section-container">
      <!-- Launcher Grid -->
      <ax-launcher
        [apps]="sectionItems"
        title="Master Data"
        subtitle="Select a module to manage"
        (appClick)="onModuleSelect($event)"
      />
    </div>
  `,
  styles: [
    `
      .section-container {
        padding: var(--ax-spacing-lg, 24px);
        max-width: 1400px;
        margin: 0 auto;
      }
    `,
  ],
})
export class MasterDataPage {
  private readonly router = inject(Router);

  readonly sectionItems: LauncherApp[] = SECTION_ITEMS;

  /**
   * Handle module selection from launcher
   */
  onModuleSelect(event: LauncherAppClickEvent): void {
    const app = event.app;
    if (app.route) {
      if (event.newTab) {
        window.open(app.route, '_blank');
      } else {
        this.router.navigate([app.route]);
      }
    } else if (app.externalUrl) {
      window.open(app.externalUrl, '_blank');
    }
  }
}
