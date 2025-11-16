/**
 * AegisX UI - Forms Module
 *
 * NgModule for form components (for apps not using standalone)
 */

import { NgModule } from '@angular/core';
import { AxButtonComponent } from './button';
import { AxInputComponent } from './input';
import { AxSelectComponent } from './select';
import { AxCheckboxComponent } from './checkbox';
import { AxRadioGroupComponent } from './radio';

// TODO: Import remaining form components
// etc...

const COMPONENTS = [
  AxButtonComponent,
  AxInputComponent,
  AxSelectComponent,
  AxCheckboxComponent,
  AxRadioGroupComponent,
  // TODO: Add remaining components
];

@NgModule({
  imports: COMPONENTS,
  exports: COMPONENTS,
})
export class AegisxFormsModule {}

// Re-export for convenience
export {
  AxButtonComponent,
  AxInputComponent,
  AxSelectComponent,
  AxCheckboxComponent,
  AxRadioGroupComponent,
};
