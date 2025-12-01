import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DocHeaderComponent } from '../../../../components/docs';

@Component({
  selector: 'ax-foundations-overview',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    DocHeaderComponent,
  ],
  template: `
    <div class="foundations-page">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero__background">
          <div class="hero__orb hero__orb--1"></div>
          <div class="hero__orb hero__orb--2"></div>
          <div class="hero__orb hero__orb--3"></div>
          <div class="hero__grid"></div>
        </div>
        <div class="hero__content">
          <div class="hero__badge">
            <mat-icon>auto_awesome</mat-icon>
            <span>Design System Core</span>
          </div>
          <h1 class="hero__title">
            Design
            <span class="gradient-text">Foundations</span>
          </h1>
          <p class="hero__description">
            โครงสร้างพื้นฐานของ AegisX Design System ประกอบด้วย Design Tokens
            กว่า 120 รายการที่กำหนดสี, ตัวอักษร, ระยะห่าง และองค์ประกอบหลักของ
            UI
          </p>
          <div class="hero__actions">
            <a
              routerLink="/docs/foundations/design-tokens"
              class="hero__btn hero__btn--primary"
            >
              <mat-icon>data_object</mat-icon>
              Explore Tokens
            </a>
            <a
              routerLink="/docs/foundations/colors"
              class="hero__btn hero__btn--secondary"
            >
              <mat-icon>palette</mat-icon>
              View Colors
            </a>
          </div>
        </div>
      </section>

      <!-- Quick Stats - moved up for better flow -->
      <section class="stats">
        @for (stat of stats; track stat.label) {
          <div class="stats__item">
            <span class="stats__number">{{ stat.value }}</span>
            <span class="stats__label">{{ stat.label }}</span>
          </div>
        }
      </section>

      <!-- Bento Grid -->
      <section class="bento">
        <!-- Large: Design Tokens -->
        <a
          routerLink="/docs/foundations/design-tokens"
          class="bento__card bento__card--large bento__card--tokens"
        >
          <div class="bento__card-content">
            <div class="card-icon">
              <mat-icon>data_object</mat-icon>
            </div>
            <h2>Design Tokens</h2>
            <p>
              CSS Custom Properties ที่เป็นหัวใจของระบบ ครอบคลุมทุก visual
              property
            </p>
            <span class="bento__badge">120+ tokens</span>
          </div>
          <div class="bento__token-preview">
            <div class="token-header">
              <div class="token-dots">
                <span class="dot dot--red"></span>
                <span class="dot dot--yellow"></span>
                <span class="dot dot--green"></span>
              </div>
              <span class="token-filename">tokens.css</span>
            </div>
            <div class="token-code">
              <div class="token-line">
                <span class="token-prop">--ax-brand-default</span>
                <span class="token-colon">:</span>
                <span
                  class="token-swatch"
                  style="background: var(--ax-brand-default)"
                ></span>
              </div>
              <div class="token-line">
                <span class="token-prop">--ax-spacing-lg</span>
                <span class="token-colon">:</span>
                <span class="token-val">1rem</span>
              </div>
              <div class="token-line">
                <span class="token-prop">--ax-radius-lg</span>
                <span class="token-colon">:</span>
                <span class="token-val">0.75rem</span>
              </div>
              <div class="token-line">
                <span class="token-prop">--ax-shadow-md</span>
                <span class="token-colon">:</span>
                <span class="token-val">0 4px 6px...</span>
              </div>
            </div>
          </div>
        </a>

        <!-- Medium: Colors -->
        <a
          routerLink="/docs/foundations/colors"
          class="bento__card bento__card--medium bento__card--colors"
        >
          <div class="card-icon card-icon--colors">
            <mat-icon>palette</mat-icon>
          </div>
          <h3>Colors</h3>
          <p>Semantic color system</p>
          <div class="color-grid">
            <div class="color-row">
              <span
                class="swatch swatch--brand"
                style="background: var(--ax-brand-default)"
              ></span>
              <span
                class="swatch swatch--brand-light"
                style="background: var(--ax-brand-muted)"
              ></span>
            </div>
            <div class="color-row">
              <span
                class="swatch swatch--success"
                style="background: var(--ax-success-default)"
              ></span>
              <span
                class="swatch swatch--warning"
                style="background: var(--ax-warning-default)"
              ></span>
              <span
                class="swatch swatch--error"
                style="background: var(--ax-error-default)"
              ></span>
            </div>
          </div>
          <span class="card-link">
            View palette
            <mat-icon>arrow_forward</mat-icon>
          </span>
        </a>

        <!-- Medium: Typography -->
        <a
          routerLink="/docs/foundations/typography"
          class="bento__card bento__card--medium bento__card--typography"
        >
          <div class="card-icon card-icon--typography">
            <mat-icon>text_fields</mat-icon>
          </div>
          <h3>Typography</h3>
          <p>Type scale & families</p>
          <div class="type-showcase">
            <div class="type-row">
              <span class="type-sample type-sample--display">Display</span>
              <span class="type-size">3rem</span>
            </div>
            <div class="type-row">
              <span class="type-sample type-sample--headline">Headline</span>
              <span class="type-size">1.5rem</span>
            </div>
            <div class="type-row">
              <span class="type-sample type-sample--body">Body text</span>
              <span class="type-size">1rem</span>
            </div>
          </div>
          <span class="card-link">
            View scale
            <mat-icon>arrow_forward</mat-icon>
          </span>
        </a>

        <!-- Small: Spacing -->
        <a
          routerLink="/docs/foundations/spacing"
          class="bento__card bento__card--small bento__card--spacing"
        >
          <div class="card-icon card-icon--spacing">
            <mat-icon>space_bar</mat-icon>
          </div>
          <h3>Spacing</h3>
          <div class="spacing-visual">
            <div class="spacing-bars">
              <span class="space-bar" style="width: 8px"></span>
              <span class="space-bar" style="width: 16px"></span>
              <span class="space-bar" style="width: 24px"></span>
              <span class="space-bar" style="width: 32px"></span>
              <span class="space-bar" style="width: 48px"></span>
            </div>
          </div>
        </a>

        <!-- Small: Shadows -->
        <a
          routerLink="/docs/foundations/shadows"
          class="bento__card bento__card--small bento__card--shadows"
        >
          <div class="card-icon card-icon--shadows">
            <mat-icon>layers</mat-icon>
          </div>
          <h3>Shadows</h3>
          <div class="shadow-preview">
            <span class="shadow-card shadow-card--sm">sm</span>
            <span class="shadow-card shadow-card--md">md</span>
            <span class="shadow-card shadow-card--lg">lg</span>
          </div>
        </a>

        <!-- Small: Motion -->
        <a
          routerLink="/docs/foundations/motion"
          class="bento__card bento__card--small bento__card--motion"
        >
          <div class="card-icon card-icon--motion">
            <mat-icon>animation</mat-icon>
          </div>
          <h3>Motion</h3>
          <div class="motion-demo">
            <div class="motion-track">
              <span class="motion-dot"></span>
            </div>
          </div>
        </a>
      </section>

      <!-- Design Philosophy -->
      <section class="philosophy">
        <div class="section-header">
          <h2>Design Philosophy</h2>
          <p>หลักการออกแบบที่ขับเคลื่อน AegisX Design System</p>
        </div>
        <div class="philosophy__grid">
          @for (principle of principles; track principle.title) {
            <div class="philosophy__card">
              <div
                class="philosophy__icon-wrap"
                [style.background]="principle.gradient"
              >
                <mat-icon>{{ principle.icon }}</mat-icon>
              </div>
              <h4>{{ principle.title }}</h4>
              <p>{{ principle.description }}</p>
            </div>
          }
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .foundations-page {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
      }
      .hero {
        position: relative;
        padding: 3rem 2rem;
        margin-bottom: 2rem;
        border-radius: 24px;
        overflow: hidden;
      }
      .hero__background {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }
      .hero__orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(80px);
        opacity: 0.5;
      }
      .hero__orb--1 {
        width: 300px;
        height: 300px;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        top: -100px;
        right: -50px;
        animation: float 8s ease-in-out infinite;
      }
      .hero__orb--2 {
        width: 200px;
        height: 200px;
        background: linear-gradient(135deg, #06b6d4, #3b82f6);
        bottom: -80px;
        left: 10%;
        animation: float 10s ease-in-out infinite reverse;
      }
      .hero__orb--3 {
        width: 150px;
        height: 150px;
        background: linear-gradient(135deg, #10b981, #34d399);
        top: 40%;
        right: 25%;
        animation: float 12s ease-in-out infinite;
      }
      .hero__grid {
        position: absolute;
        inset: 0;
        background-image:
          linear-gradient(var(--ax-border-subtle) 1px, transparent 1px),
          linear-gradient(90deg, var(--ax-border-subtle) 1px, transparent 1px);
        background-size: 40px 40px;
        opacity: 0.4;
      }
      @keyframes float {
        0%,
        100% {
          transform: translateY(0) scale(1);
        }
        50% {
          transform: translateY(-20px) scale(1.05);
        }
      }
      .hero__content {
        position: relative;
        z-index: 1;
        max-width: 600px;
      }
      .hero__badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: rgba(99, 102, 241, 0.1);
        border: 1px solid rgba(99, 102, 241, 0.2);
        border-radius: 100px;
        font-size: 0.875rem;
        font-weight: 500;
        color: #6366f1;
        margin-bottom: 1.5rem;
      }
      .hero__badge mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
      .hero__title {
        font-size: clamp(2rem, 5vw, 3rem);
        font-weight: 800;
        color: var(--ax-text-heading);
        margin: 0 0 1rem;
        line-height: 1.1;
      }
      .gradient-text {
        display: block;
        background: linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .hero__description {
        font-size: 1.125rem;
        color: var(--ax-text-secondary);
        margin: 0 0 1.5rem;
        line-height: 1.7;
      }
      .hero__actions {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }
      .hero__btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        border-radius: 12px;
        font-size: 0.9375rem;
        font-weight: 500;
        text-decoration: none;
        transition: all 0.2s ease;
      }
      .hero__btn mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
      .hero__btn--primary {
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
      }
      .hero__btn--primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
      }
      .hero__btn--secondary {
        background: var(--ax-background-default);
        color: var(--ax-text-heading);
        border: 1px solid var(--ax-border-default);
      }
      .hero__btn--secondary:hover {
        border-color: #6366f1;
        background: rgba(99, 102, 241, 0.05);
      }
      .stats {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1.5rem;
        padding: 1.5rem;
        margin-bottom: 2rem;
        background: var(--ax-background-subtle);
        border-radius: 16px;
        border: 1px solid var(--ax-border-default);
      }
      .stats__item {
        text-align: center;
        padding: 1rem;
      }
      .stats__number {
        font-size: 2.5rem;
        font-weight: 800;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        line-height: 1;
        display: block;
      }
      .stats__label {
        font-size: 0.875rem;
        color: var(--ax-text-secondary);
        margin-top: 0.5rem;
        display: block;
      }
      .bento {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 1rem;
        margin-bottom: 2rem;
      }
      .bento__card {
        display: flex;
        flex-direction: column;
        padding: 1.5rem;
        background: var(--ax-background-default);
        border: 1px solid var(--ax-border-default);
        border-radius: 16px;
        text-decoration: none;
        transition: all 0.2s ease;
        overflow: hidden;
      }
      .bento__card:hover {
        border-color: #6366f1;
        box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.1);
        transform: translateY(-4px);
      }
      .bento__card h2,
      .bento__card h3 {
        color: var(--ax-text-heading);
        margin: 0.5rem 0 0.25rem;
      }
      .bento__card h2 {
        font-size: 1.5rem;
        font-weight: 700;
      }
      .bento__card h3 {
        font-size: 1rem;
        font-weight: 600;
      }
      .bento__card p {
        color: var(--ax-text-secondary);
        font-size: 0.875rem;
        margin: 0;
        line-height: 1.5;
      }
      .card-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
      }
      .card-icon mat-icon {
        color: white;
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
      .card-icon--colors {
        background: linear-gradient(135deg, #ec4899, #f472b6);
      }
      .card-icon--typography {
        background: linear-gradient(135deg, #06b6d4, #22d3ee);
      }
      .card-icon--spacing {
        background: linear-gradient(135deg, #10b981, #34d399);
      }
      .card-icon--shadows {
        background: linear-gradient(135deg, #f59e0b, #fbbf24);
      }
      .card-icon--motion {
        background: linear-gradient(135deg, #8b5cf6, #a78bfa);
      }
      .bento__card--large {
        grid-column: span 4;
        grid-row: span 2;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
      }
      .bento__card-content {
        display: flex;
        flex-direction: column;
      }
      .bento__badge {
        display: inline-block;
        margin-top: auto;
        padding: 0.375rem 0.75rem;
        background: rgba(99, 102, 241, 0.1);
        color: #6366f1;
        font-size: 0.75rem;
        font-weight: 600;
        border-radius: 100px;
        align-self: flex-start;
      }
      .bento__token-preview {
        background: #1e1e2e;
        border-radius: 12px;
        overflow: hidden;
      }
      .token-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        background: #181825;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      }
      .token-dots {
        display: flex;
        gap: 8px;
      }
      .dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
      }
      .dot--red {
        background: #ff5f56;
      }
      .dot--yellow {
        background: #ffbd2e;
      }
      .dot--green {
        background: #27c93f;
      }
      .token-filename {
        color: #6c7086;
        font-size: 12px;
        font-family: 'SF Mono', monospace;
      }
      .token-code {
        padding: 16px;
        font-family: 'SF Mono', 'Fira Code', monospace;
        font-size: 13px;
      }
      .token-line {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 4px 0;
      }
      .token-prop {
        color: #89b4fa;
      }
      .token-colon {
        color: #6c7086;
      }
      .token-val {
        color: #a6e3a1;
      }
      .token-swatch {
        width: 16px;
        height: 16px;
        border-radius: 4px;
      }
      .bento__card--medium {
        grid-column: span 2;
      }
      .bento__card--small {
        grid-column: span 2;
      }
      .color-grid {
        margin-top: auto;
        padding-top: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .color-row {
        display: flex;
        gap: 0.5rem;
      }
      .swatch {
        height: 32px;
        border-radius: 8px;
        flex: 1;
        transition: transform 0.2s ease;
      }
      .bento__card--colors:hover .swatch {
        transform: scale(1.05);
      }
      .card-link {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        margin-top: auto;
        padding-top: 1rem;
        font-size: 0.875rem;
        font-weight: 500;
        color: #6366f1;
      }
      .card-link mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
        transition: transform 0.2s ease;
      }
      .bento__card:hover .card-link mat-icon {
        transform: translateX(4px);
      }
      .type-showcase {
        margin-top: auto;
        padding-top: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
      }
      .type-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .type-sample {
        color: var(--ax-text-heading);
        font-weight: 600;
      }
      .type-sample--display {
        font-size: 1.25rem;
      }
      .type-sample--headline {
        font-size: 1rem;
      }
      .type-sample--body {
        font-size: 0.875rem;
      }
      .type-size {
        font-size: 0.75rem;
        color: var(--ax-text-subtle);
        font-family: monospace;
      }
      .spacing-visual {
        margin-top: auto;
        padding-top: 1rem;
      }
      .spacing-bars {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .space-bar {
        height: 8px;
        background: linear-gradient(90deg, #6366f1, #8b5cf6);
        border-radius: 4px;
        transition: transform 0.2s ease;
      }
      .bento__card--spacing:hover .space-bar {
        transform: scaleX(1.05);
        transform-origin: left;
      }
      .shadow-preview {
        display: flex;
        gap: 0.75rem;
        margin-top: auto;
        padding-top: 1rem;
      }
      .shadow-card {
        width: 40px;
        height: 40px;
        background: var(--ax-background-default);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.625rem;
        color: var(--ax-text-subtle);
        font-weight: 500;
        transition: transform 0.2s ease;
      }
      .shadow-card--sm {
        box-shadow: var(--ax-shadow-sm);
      }
      .shadow-card--md {
        box-shadow: var(--ax-shadow-md);
      }
      .shadow-card--lg {
        box-shadow: var(--ax-shadow-lg);
      }
      .bento__card--shadows:hover .shadow-card {
        transform: translateY(-4px);
      }
      .motion-demo {
        margin-top: auto;
        padding-top: 1rem;
      }
      .motion-track {
        height: 8px;
        background: var(--ax-background-subtle);
        border-radius: 4px;
        position: relative;
        overflow: hidden;
      }
      .motion-dot {
        position: absolute;
        width: 16px;
        height: 16px;
        background: linear-gradient(135deg, #8b5cf6, #a78bfa);
        border-radius: 50%;
        top: 50%;
        transform: translateY(-50%);
        animation: slide 2s ease-in-out infinite;
      }
      @keyframes slide {
        0%,
        100% {
          left: 0;
        }
        50% {
          left: calc(100% - 16px);
        }
      }
      .section-header {
        text-align: center;
        margin-bottom: 2rem;
      }
      .section-header h2 {
        font-size: 1.75rem;
        font-weight: 700;
        color: var(--ax-text-heading);
        margin: 0 0 0.5rem;
      }
      .section-header p {
        font-size: 1rem;
        color: var(--ax-text-secondary);
        margin: 0;
      }
      .philosophy {
        margin-bottom: 3rem;
      }
      .philosophy__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1rem;
      }
      .philosophy__card {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 2rem 1.5rem;
        background: var(--ax-background-default);
        border: 1px solid var(--ax-border-default);
        border-radius: 16px;
        transition: all 0.2s ease;
      }
      .philosophy__card:hover {
        border-color: var(--ax-brand-muted);
        transform: translateY(-4px);
        box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.1);
      }
      .philosophy__icon-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 56px;
        height: 56px;
        border-radius: 16px;
        margin-bottom: 1rem;
      }
      .philosophy__icon-wrap mat-icon {
        color: white;
        font-size: 28px;
        width: 28px;
        height: 28px;
      }
      .philosophy__card h4 {
        font-size: 1rem;
        font-weight: 600;
        color: var(--ax-text-heading);
        margin: 0 0 0.5rem;
      }
      .philosophy__card p {
        font-size: 0.875rem;
        color: var(--ax-text-secondary);
        margin: 0;
        line-height: 1.6;
      }
      @media (max-width: 900px) {
        .bento {
          grid-template-columns: repeat(2, 1fr);
        }
        .bento__card--large {
          grid-column: span 2;
          grid-row: span 1;
          grid-template-columns: 1fr;
        }
        .bento__card--medium,
        .bento__card--small {
          grid-column: span 1;
        }
        .stats {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      @media (max-width: 600px) {
        .bento__card--medium,
        .bento__card--small {
          grid-column: span 2;
        }
        .hero {
          padding: 2rem 1.5rem;
        }
        .hero__actions {
          flex-direction: column;
        }
        .stats {
          grid-template-columns: 1fr 1fr;
        }
      }
    `,
  ],
})
export class FoundationsOverviewComponent {
  stats = [
    { value: '120+', label: 'Design Tokens' },
    { value: '5', label: 'Semantic Colors' },
    { value: '8', label: 'Spacing Scale' },
    { value: '2', label: 'Theme Modes' },
  ];

  principles = [
    {
      icon: 'layers',
      title: 'Layered Architecture',
      description: 'Primitive → Semantic → Component สำหรับความยืดหยุ่นสูงสุด',
      gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    },
    {
      icon: 'dark_mode',
      title: 'Theme-Aware',
      description: 'Tokens ปรับตาม Light/Dark mode อัตโนมัติ',
      gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
    },
    {
      icon: 'tune',
      title: 'Customizable',
      description: 'Override token ใดๆ ได้ที่ root เพื่อปรับ brand',
      gradient: 'linear-gradient(135deg, #10b981, #34d399)',
    },
    {
      icon: 'bolt',
      title: 'Performance',
      description: 'CSS Custom Properties สลับ theme ทันที',
      gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    },
  ];
}
