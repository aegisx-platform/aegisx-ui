import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  AxCardComponent,
  AxBadgeComponent,
  AxFieldDisplayComponent,
} from '@aegisx/ui';
import { PdfTemplate } from '../../types/pdf-templates.types';

@Component({
  selector: 'app-template-card',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
    AxCardComponent,
    AxBadgeComponent,
    AxFieldDisplayComponent,
  ],
  templateUrl: './template-card.component.html',
  styleUrls: ['./template-card.component.scss'],
})
export class TemplateCardComponent {
  @Input() template!: PdfTemplate;
  @Input() selected = false;
  @Input() disabled = false;

  @Output() preview = new EventEmitter<PdfTemplate>();
  @Output() edit = new EventEmitter<PdfTemplate>();
  @Output() duplicate = new EventEmitter<PdfTemplate>();
  @Output() delete = new EventEmitter<PdfTemplate>();
  @Output() selectionChange = new EventEmitter<void>();
}
