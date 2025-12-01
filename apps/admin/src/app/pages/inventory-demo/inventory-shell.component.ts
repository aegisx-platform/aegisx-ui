import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AxEnterpriseLayoutComponent, AxNavigationItem } from '@aegisx/ui';

@Component({
  selector: 'ax-inventory-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    AxEnterpriseLayoutComponent,
  ],
  template: `
    <ax-enterprise-layout
      [appName]="'Inventory Management'"
      [navigation]="navigation"
      [showFooter]="true"
      [headerTheme]="'dark'"
      [contentBackground]="'gray'"
      (logoutClicked)="onLogout()"
    >
      <!-- Header Actions -->
      <ng-template #headerActions>
        <button mat-icon-button matTooltip="Notifications">
          <mat-icon>notifications</mat-icon>
        </button>
        <button mat-icon-button matTooltip="Settings">
          <mat-icon>settings</mat-icon>
        </button>
      </ng-template>

      <!-- Router Outlet for Child Pages -->
      <router-outlet></router-outlet>

      <!-- Footer Content -->
      <ng-template #footerContent>
        <span>Inventory Management System - AegisX Platform</span>
        <span class="footer-version">v1.0.0</span>
      </ng-template>
    </ax-enterprise-layout>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100vh;
      }

      .footer-version {
        font-size: 0.75rem;
        color: var(--ax-text-subtle);
      }
    `,
  ],
})
export class InventoryShellComponent {
  navigation: AxNavigationItem[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      link: '/inventory-demo',
      icon: 'dashboard',
      exactMatch: true,
    },
    {
      id: 'stock',
      title: 'Stock',
      link: '/inventory-demo/stock',
      icon: 'inventory_2',
    },
    {
      id: 'purchase',
      title: 'Purchase',
      link: '/inventory-demo/purchase',
      icon: 'shopping_cart',
    },
    {
      id: 'suppliers',
      title: 'Suppliers',
      link: '/inventory-demo/suppliers',
      icon: 'business',
    },
    {
      id: 'reports',
      title: 'Reports',
      link: '/inventory-demo/reports',
      icon: 'assessment',
    },
  ];

  onLogout(): void {
    console.log('Logout clicked');
  }
}
