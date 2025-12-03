import { Component } from '@angular/core';
import {
  HeroComponent,
  TechStackComponent,
  FeaturesComponent,
  ThemeBuilderShowcaseComponent,
  PricingComponent,
  CtaComponent,
} from './sections';

@Component({
  standalone: true,
  imports: [
    HeroComponent,
    TechStackComponent,
    FeaturesComponent,
    ThemeBuilderShowcaseComponent,
    PricingComponent,
    CtaComponent,
  ],
  selector: 'ax-root',
  template: `
    <main class="landing">
      <ax-hero />
      <ax-tech-stack />
      <ax-features />
      <ax-theme-builder-showcase />
      <ax-pricing />
      <ax-cta />
    </main>
  `,
  styles: [
    `
      .landing {
        min-height: 100vh;
        background: #0a0a1a;
      }
    `,
  ],
})
export class App {}
