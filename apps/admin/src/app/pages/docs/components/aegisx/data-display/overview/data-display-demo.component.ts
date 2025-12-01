import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import {
  AxFieldDisplayComponent,
  AxDescriptionListComponent,
} from '@aegisx/ui';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
} from '../../../../../../components/docs';

@Component({
  selector: 'app-data-display-demo',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    AxFieldDisplayComponent,
    AxDescriptionListComponent,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
  ],
  templateUrl: './data-display-demo.component.html',
  styleUrls: ['./data-display-demo.component.scss'],
})
export class DataDisplayDemoComponent {
  userProfile = {
    fullName: 'Sathit Seethaphon',
    email: 'sathit@example.com',
    phone: '0991234567',
    website: 'https://example.com',
    role: 'Administrator',
    department: 'Engineering',
    joinDate: new Date('2024-01-15'),
    salary: 85000,
    performanceScore: 92.5,
    isActive: true,
  };

  orderData = {
    id: 'ORD-2024-001',
    customer: 'John Doe',
    email: 'john@example.com',
    phone: '0881234567',
    orderDate: new Date('2024-11-01'),
    deliveryDate: new Date('2024-11-10'),
    status: 'Delivered',
    subtotal: 1250.0,
    tax: 87.5,
    shipping: 50.0,
    total: 1387.5,
    itemCount: 3,
  };

  // Code examples
  basicTextCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<ax-field-display
  label="Full Name"
  [value]="userProfile.fullName"
></ax-field-display>

<ax-field-display
  label="Role"
  [value]="userProfile.role"
></ax-field-display>`,
    },
  ];

  typeFormattingCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<ax-field-display
  label="Join Date"
  [value]="userProfile.joinDate"
  type="date"
></ax-field-display>

<ax-field-display
  label="Salary"
  [value]="userProfile.salary"
  type="currency"
  [formatOptions]="{ currency: 'THB', decimals: 2 }"
></ax-field-display>

<ax-field-display
  label="Performance Score"
  [value]="userProfile.performanceScore"
  type="percentage"
></ax-field-display>

<ax-field-display
  label="Active Status"
  [value]="userProfile.isActive"
  type="boolean"
></ax-field-display>`,
    },
  ];

  clickableLinksCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<ax-field-display
  label="Email"
  [value]="userProfile.email"
  type="email"
></ax-field-display>

<ax-field-display
  label="Phone"
  [value]="userProfile.phone"
  type="phone"
></ax-field-display>

<ax-field-display
  label="Website"
  [value]="userProfile.website"
  type="url"
></ax-field-display>`,
    },
  ];

  sizesCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<ax-field-display label="Small" [value]="name" size="sm"></ax-field-display>
<ax-field-display label="Medium (Default)" [value]="name" size="md"></ax-field-display>
<ax-field-display label="Large" [value]="name" size="lg"></ax-field-display>`,
    },
  ];

  horizontalLayoutCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<ax-description-list>
  <ax-field-display label="Full Name" [value]="userProfile.fullName"></ax-field-display>
  <ax-field-display label="Email" [value]="userProfile.email" type="email"></ax-field-display>
  <ax-field-display label="Department" [value]="userProfile.department"></ax-field-display>
  <ax-field-display label="Join Date" [value]="userProfile.joinDate" type="date"></ax-field-display>
</ax-description-list>`,
    },
  ];

  gridLayoutCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<ax-description-list layout="grid" [columns]="2">
  <ax-field-display label="Full Name" [value]="userProfile.fullName"></ax-field-display>
  <ax-field-display label="Email" [value]="userProfile.email" type="email"></ax-field-display>
  <ax-field-display label="Phone" [value]="userProfile.phone" type="phone"></ax-field-display>
  <ax-field-display label="Department" [value]="userProfile.department"></ax-field-display>
</ax-description-list>`,
    },
  ];

  withDividersCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<ax-description-list [divider]="true">
  <ax-field-display label="Order ID" [value]="orderData.id"></ax-field-display>
  <ax-field-display label="Customer" [value]="orderData.customer"></ax-field-display>
  <ax-field-display label="Status" [value]="orderData.status"></ax-field-display>
  <ax-field-display label="Total" [value]="orderData.total" type="currency"></ax-field-display>
</ax-description-list>`,
    },
  ];
}
