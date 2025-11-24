import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CodePreviewComponent } from '../../components/code-preview/code-preview.component';
import { AxBadgeComponent } from '@aegisx/ui';

interface BadgeExample {
  label: string;
  icon?: string;
  variant: 'success' | 'error' | 'warning' | 'info' | 'neutral';
  removable?: boolean;
}

@Component({
  selector: 'app-badges-demo',
  standalone: true,
  imports: [
    CommonModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    CodePreviewComponent,
    AxBadgeComponent,
  ],
  templateUrl: './badges-demo.component.html',
  styleUrl: './badges-demo.component.scss',
})
export class BadgesDemoComponent {
  // Status Badges
  statusBadges = [
    { label: 'Active', variant: 'success' as const },
    { label: 'Pending', variant: 'warning' as const },
    { label: 'Error', variant: 'error' as const },
    { label: 'Info', variant: 'info' as const },
    { label: 'Disabled', variant: 'neutral' as const },
  ];

  // Badges with Icons
  iconBadges = [
    { label: '+9.3%', icon: 'trending_up', variant: 'success' as const },
    { label: '-1.9%', icon: 'trending_down', variant: 'error' as const },
    { label: '+5.1%', icon: 'arrow_upward', variant: 'success' as const },
    { label: '0.6%', icon: 'arrow_forward', variant: 'neutral' as const },
  ];

  // Removable Badges (Tags)
  removableTags: BadgeExample[] = [
    { label: 'TypeScript', variant: 'info', removable: true },
    { label: 'Angular', variant: 'error', removable: true },
    { label: 'Material', variant: 'success', removable: true },
    { label: 'TailwindCSS', variant: 'info', removable: true },
  ];

  // Badge Dot Variants
  dotBadges = [
    { label: 'Online', variant: 'success' as const },
    { label: 'Away', variant: 'warning' as const },
    { label: 'Busy', variant: 'error' as const },
    { label: 'Offline', variant: 'neutral' as const },
  ];

  // Priority Badges
  priorityBadges = [
    { label: 'Emergency', variant: 'error' as const, icon: 'priority_high' },
    { label: 'High', variant: 'warning' as const, icon: 'keyboard_arrow_up' },
    { label: 'Medium', variant: 'neutral' as const, icon: 'remove' },
    { label: 'Low', variant: 'success' as const, icon: 'keyboard_arrow_down' },
  ];

  // Counter Badges
  counterBadges = [
    { label: 'Messages', count: 12, variant: 'info' as const },
    { label: 'Notifications', count: 5, variant: 'error' as const },
    { label: 'Updates', count: 99, variant: 'warning' as const },
  ];

  /**
   * Remove tag from removable tags array
   */
  removeTag(badge: BadgeExample): void {
    const index = this.removableTags.indexOf(badge);
    if (index >= 0) {
      this.removableTags.splice(index, 1);
    }
  }

  /**
   * Scroll to a specific section
   */
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Code Examples
  basicBadgeCode = `<!-- Basic Badge - Outlined Style -->
<ax-badge variant="outlined" type="success">Active</ax-badge>
<ax-badge variant="outlined" type="warning">Pending</ax-badge>
<ax-badge variant="outlined" type="error">Error</ax-badge>
<ax-badge variant="outlined" type="info">Info</ax-badge>
<ax-badge variant="outlined" type="neutral">Disabled</ax-badge>`;

  softBadgeCode = `<!-- Soft/Filled Style -->
<ax-badge variant="soft" type="success">Active</ax-badge>
<ax-badge variant="soft" type="warning">Pending</ax-badge>
<ax-badge variant="soft" type="error">Error</ax-badge>
<ax-badge variant="soft" type="info">Info</ax-badge>
<ax-badge variant="soft" type="neutral">Disabled</ax-badge>`;

  outlinedBadgeCode = `<!-- Outlined Strong Border -->
<ax-badge variant="outlined-strong" type="success">Active</ax-badge>
<ax-badge variant="outlined-strong" type="warning">Pending</ax-badge>
<ax-badge variant="outlined-strong" type="error">Error</ax-badge>
<ax-badge variant="outlined-strong" type="info">Info</ax-badge>
<ax-badge variant="outlined-strong" type="neutral">Disabled</ax-badge>`;

  iconBadgeCode = `<!-- Badge with Icon -->
<ax-badge variant="soft" type="success" icon="trending_up">+9.3%</ax-badge>
<ax-badge variant="soft" type="error" icon="trending_down">-1.9%</ax-badge>
<ax-badge variant="soft" type="success" icon="arrow_upward">+5.1%</ax-badge>
<ax-badge variant="soft" type="neutral" icon="arrow_forward">0.6%</ax-badge>`;

  dotBadgeCode = `<!-- Badge with Dot -->
<ax-badge variant="soft" type="success" [dot]="true">Online</ax-badge>
<ax-badge variant="soft" type="warning" [dot]="true">Away</ax-badge>
<ax-badge variant="soft" type="error" [dot]="true">Busy</ax-badge>
<ax-badge variant="soft" type="neutral" [dot]="true">Offline</ax-badge>`;

  // Priority Badge Code Examples - Complete Use Cases
  priorityDotCode = `<!-- Priority with Dots (Circle) - Most Common -->
<ax-badge variant="outlined" type="error" [dot]="true">Emergency</ax-badge>
<ax-badge variant="outlined" type="warning" [dot]="true">High</ax-badge>
<ax-badge variant="outlined" type="neutral" [dot]="true">Medium</ax-badge>
<ax-badge variant="outlined" type="success" [dot]="true">Low</ax-badge>`;

  prioritySquareCode = `<!-- Priority with Squares - Alternative Style -->
<ax-badge variant="outlined" type="error" [square]="true">Emergency</ax-badge>
<ax-badge variant="outlined" type="warning" [square]="true">High</ax-badge>
<ax-badge variant="outlined" type="neutral" [square]="true">Medium</ax-badge>
<ax-badge variant="outlined" type="success" [square]="true">Low</ax-badge>`;

  prioritySoftCode = `<!-- Soft/Filled Background Style -->
<ax-badge variant="soft" type="error" [dot]="true">Emergency</ax-badge>
<ax-badge variant="soft" type="warning" [dot]="true">High</ax-badge>
<ax-badge variant="soft" type="neutral" [dot]="true">Medium</ax-badge>
<ax-badge variant="soft" type="success" [dot]="true">Low</ax-badge>`;

  priorityIconCode = `<!-- Priority with Icons (No Dots/Squares) -->
<ax-badge variant="outlined" type="error" icon="priority_high">Emergency</ax-badge>
<ax-badge variant="outlined" type="warning" icon="keyboard_arrow_up">High</ax-badge>
<ax-badge variant="outlined" type="neutral" icon="remove">Medium</ax-badge>
<ax-badge variant="outlined" type="success" icon="keyboard_arrow_down">Low</ax-badge>`;

  prioritySizeCode = `<!-- Small Size - For Compact UI -->
<ax-badge variant="outlined" type="error" [dot]="true" size="sm">Emergency</ax-badge>

<!-- Medium Size - Default -->
<ax-badge variant="outlined" type="warning" [dot]="true" size="md">High</ax-badge>

<!-- Large Size - For Emphasis -->
<ax-badge variant="outlined" type="success" [dot]="true" size="lg">Low</ax-badge>`;

  removableBadgeCode = `<!-- Removable Badge -->
<ax-badge variant="soft" type="info" [removable]="true" (remove)="onRemove()">
  TypeScript
</ax-badge>
<ax-badge variant="soft" type="error" [removable]="true" (remove)="onRemove()">
  Angular
</ax-badge>`;

  counterBadgeCode = `<!-- Counter Badge -->
<ax-badge variant="outlined" type="info" [counter]="12">Messages</ax-badge>
<ax-badge variant="outlined" type="error" [counter]="5">Notifications</ax-badge>
<ax-badge variant="outlined" type="warning" [counter]="99">Updates</ax-badge>`;

  sizeBadgeCode = `<!-- Badge Sizes - Simple -->
<ax-badge variant="soft" type="info" size="sm">Small</ax-badge>
<ax-badge variant="soft" type="info" size="md">Medium</ax-badge>
<ax-badge variant="soft" type="info" size="lg">Large</ax-badge>

<!-- Badge Sizes - With Icons -->
<ax-badge variant="outlined" type="success" size="sm" icon="check">Small</ax-badge>
<ax-badge variant="outlined" type="success" size="md" icon="check">Medium</ax-badge>
<ax-badge variant="outlined" type="success" size="lg" icon="check">Large</ax-badge>`;

  // Complete Feature Matrix Code
  softSquareCode = `<!-- Soft Variant with Square Indicators -->
<ax-badge variant="soft" type="error" [square]="true">Emergency</ax-badge>
<ax-badge variant="soft" type="warning" [square]="true">High</ax-badge>
<ax-badge variant="soft" type="neutral" [square]="true">Medium</ax-badge>
<ax-badge variant="soft" type="success" [square]="true">Low</ax-badge>`;

  outlinedStrongCode = `<!-- Outlined Strong (Thick Border) -->
<ax-badge variant="outlined-strong" type="success">Active</ax-badge>
<ax-badge variant="outlined-strong" type="warning">Pending</ax-badge>
<ax-badge variant="outlined-strong" type="error">Error</ax-badge>

<!-- With Dots -->
<ax-badge variant="outlined-strong" type="success" [dot]="true">Active</ax-badge>
<ax-badge variant="outlined-strong" type="warning" [dot]="true">Pending</ax-badge>

<!-- With Icons -->
<ax-badge variant="outlined-strong" type="success" icon="check">Verified</ax-badge>
<ax-badge variant="outlined-strong" type="error" icon="warning">Alert</ax-badge>`;

  counterVariantsCode = `<!-- Counter with Different Variants -->
<!-- Outlined -->
<ax-badge variant="outlined" type="info" [counter]="12">Messages</ax-badge>
<ax-badge variant="outlined" type="error" [counter]="5">Errors</ax-badge>

<!-- Soft -->
<ax-badge variant="soft" type="info" [counter]="12">Messages</ax-badge>
<ax-badge variant="soft" type="error" [counter]="5">Errors</ax-badge>

<!-- Outlined Strong -->
<ax-badge variant="outlined-strong" type="warning" [counter]="99">Updates</ax-badge>`;

  combinationMatrixCode = `<!-- All Feature Combinations -->

<!-- 1. Basic (No extras) -->
<ax-badge variant="outlined" type="success">Simple</ax-badge>

<!-- 2. With Icon -->
<ax-badge variant="outlined" type="success" icon="check">With Icon</ax-badge>

<!-- 3. With Dot -->
<ax-badge variant="outlined" type="success" [dot]="true">With Dot</ax-badge>

<!-- 4. With Square -->
<ax-badge variant="outlined" type="success" [square]="true">With Square</ax-badge>

<!-- 5. With Counter -->
<ax-badge variant="outlined" type="success" [counter]="5">With Counter</ax-badge>

<!-- 6. Removable -->
<ax-badge variant="soft" type="info" [removable]="true">Removable</ax-badge>

<!-- 7. Different Sizes -->
<ax-badge variant="soft" type="info" size="sm">Small</ax-badge>
<ax-badge variant="soft" type="info" size="md">Medium</ax-badge>
<ax-badge variant="soft" type="info" size="lg">Large</ax-badge>

<!-- 8. Combined Features -->
<ax-badge variant="soft" type="success" icon="check" size="lg">Large with Icon</ax-badge>
<ax-badge variant="outlined" type="warning" [dot]="true" size="sm">Small with Dot</ax-badge>
<ax-badge variant="outlined-strong" type="error" [square]="true">Strong with Square</ax-badge>`;
}
