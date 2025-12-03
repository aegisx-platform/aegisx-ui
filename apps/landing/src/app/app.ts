import { Component } from '@angular/core';
import {
  HeroComponent,
  FeaturesComponent,
  PricingComponent,
  CtaComponent,
} from './sections';

@Component({
  imports: [HeroComponent, FeaturesComponent, PricingComponent, CtaComponent],
  selector: 'ax-root',
  template: `
    <main class="landing">
      <ax-hero />
      <ax-features />
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
