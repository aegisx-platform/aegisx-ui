import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  DocHeaderComponent,
  CodeTabsComponent,
} from '../../../../components/docs';

@Component({
  selector: 'app-typography-showcase',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    DocHeaderComponent,
    CodeTabsComponent,
  ],
  templateUrl: './typography-showcase.component.html',
  styleUrl: './typography-showcase.component.scss',
})
export class TypographyShowcaseComponent {
  sampleCode = `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

const user = {
  name: 'Alice',
  age: 30,
  email: 'alice@example.com'
};

console.log(greet(user.name));`;

  tableData = [
    { element: 'H1', size: '36px', weight: '700', lineHeight: '1.2' },
    { element: 'H2', size: '30px', weight: '600', lineHeight: '1.3' },
    { element: 'H3', size: '24px', weight: '600', lineHeight: '1.4' },
    { element: 'H4', size: '20px', weight: '600', lineHeight: '1.5' },
    { element: 'Body', size: '15px', weight: '400', lineHeight: '1.7' },
    { element: 'Small', size: '14px', weight: '500', lineHeight: '1.6' },
  ];

  // Code examples for tabs
  usageExampleCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<!-- สำหรับ documentation ทั่วไป -->
<article class="ax-prose">
  <h1>Page Title</h1>
  <p>Your long-form content here...</p>
</article>

<!-- สำหรับ documentation ที่มี Material components -->
<article class="ax-prose-docs">
  <h2>Component Documentation</h2>
  <p>Description...</p>

  <mat-card>
    <mat-card-content>
      Example component here
    </mat-card-content>
  </mat-card>
</article>`,
    },
  ];

  noteExampleCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<div class="ax-prose-note info">
  <strong>Info:</strong> Your informational message here
</div>

<div class="ax-prose-note warning">
  <strong>Warning:</strong> Your warning message here
</div>`,
    },
  ];
}
