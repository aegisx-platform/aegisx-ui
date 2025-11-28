import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * Introduction Page - Overview of AegisX Design System
 * Location: docs/getting-started/introduction
 */
@Component({
  selector: 'ax-introduction-doc',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="intro-page">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-bg">
          <div class="gradient-orb orb-1"></div>
          <div class="gradient-orb orb-2"></div>
          <div class="gradient-orb orb-3"></div>
          <div class="grid-pattern"></div>
        </div>

        <div class="hero-main">
          <div class="hero-content">
            <div class="hero-badge">
              <mat-icon>auto_awesome</mat-icon>
              <span>AegisX Design System</span>
            </div>

            <h1 class="hero-title">
              Build Beautiful Apps
              <br />
              <span class="gradient-text">with AegisX</span>
            </h1>

            <p class="hero-description">
              A comprehensive Design System for Angular with Material Design 3,
              120+ design tokens, and 50+ production-ready components. Built for
              enterprise applications.
            </p>

            <div class="hero-actions">
              <a
                mat-flat-button
                color="primary"
                routerLink="/docs/getting-started/installation"
                class="primary-btn"
              >
                <mat-icon>rocket_launch</mat-icon>
                Get Started
              </a>
              <a
                mat-stroked-button
                routerLink="/docs/foundations/overview"
                class="secondary-btn"
              >
                <mat-icon>palette</mat-icon>
                Explore Foundations
              </a>
            </div>
          </div>

          <!-- Code Preview -->
          <div class="code-preview">
            <div class="code-header">
              <div class="window-dots">
                <span class="dot dot-red"></span>
                <span class="dot dot-yellow"></span>
                <span class="dot dot-green"></span>
              </div>
              <span class="file-name">app.component.ts</span>
            </div>
            <div class="code-content">
              <pre><code><span class="kw">import</span> {{ '{' }} AxCardComponent, AxBadgeComponent {{ '}' }} <span class="kw">from</span> <span class="str">'&#64;aegisx/ui'</span>;

<span class="dec">&#64;Component</span>({{ '{' }}
  <span class="prop">standalone</span>: <span class="bool">true</span>,
  <span class="prop">imports</span>: [AxCardComponent, AxBadgeComponent],
  <span class="prop">template</span>: <span class="str">\`
    &lt;ax-card&gt;
      &lt;ax-badge variant="success"&gt;Active&lt;/ax-badge&gt;
      &lt;h3&gt;Dashboard Card&lt;/h3&gt;
      &lt;p&gt;A beautifully styled card component&lt;/p&gt;
      &lt;button mat-flat-button color="primary"&gt;
        View Details
      &lt;/button&gt;
    &lt;/ax-card&gt;
  \`</span>
{{ '}' }})
<span class="kw">export class</span> <span class="cls">MyComponent</span> {{ '{' }}{{ '}' }}</code></pre>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="stats">
        @for (stat of stats; track stat.label) {
          <div class="stat-item">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        }
      </section>

      <!-- Component Showcase Section -->
      <section class="showcase">
        <div class="section-header">
          <h2>Component Showcase</h2>
          <p>A glimpse of what you can build with AegisX</p>
        </div>

        <div class="showcase-grid">
          <!-- KPI Cards -->
          <div class="showcase-item showcase-kpi">
            <div class="kpi-card">
              <div class="kpi-header">
                <span class="kpi-label">Total Revenue</span>
                <div class="kpi-badge kpi-badge-success">
                  <mat-icon>trending_up</mat-icon>
                  +12.5%
                </div>
              </div>
              <div class="kpi-value">$48,352</div>
              <div class="kpi-chart">
                <svg viewBox="0 0 100 30" class="sparkline">
                  <polyline
                    points="0,25 15,20 30,22 45,15 60,18 75,8 100,5"
                    fill="none"
                    stroke="url(#gradient1)"
                    stroke-width="2"
                  />
                  <defs>
                    <linearGradient
                      id="gradient1"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" style="stop-color:#6366f1" />
                      <stop offset="100%" style="stop-color:#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <div class="kpi-card">
              <div class="kpi-header">
                <span class="kpi-label">Active Users</span>
                <div class="kpi-badge kpi-badge-info">
                  <mat-icon>people</mat-icon>
                  Live
                </div>
              </div>
              <div class="kpi-value">2,847</div>
              <div class="kpi-progress">
                <div class="kpi-progress-bar" style="width: 78%"></div>
              </div>
              <div class="kpi-footer">78% of target</div>
            </div>
          </div>

          <!-- Card with Actions -->
          <div class="showcase-item showcase-card">
            <div class="demo-card">
              <div class="demo-card-header">
                <div class="demo-avatar">
                  <mat-icon>person</mat-icon>
                </div>
                <div class="demo-card-title">
                  <h4>Sarah Johnson</h4>
                  <span>Product Designer</span>
                </div>
                <div class="demo-badge demo-badge-success">Active</div>
              </div>
              <p class="demo-card-content">
                Leading the design system initiative and creating beautiful,
                accessible components for enterprise applications.
              </p>
              <div class="demo-card-footer">
                <button class="demo-btn demo-btn-outline">
                  <mat-icon>mail</mat-icon>
                  Message
                </button>
                <button class="demo-btn demo-btn-primary">View Profile</button>
              </div>
            </div>
          </div>

          <!-- Buttons & Badges -->
          <div class="showcase-item showcase-buttons">
            <div class="showcase-label">Buttons</div>
            <div class="button-row">
              <button class="demo-btn demo-btn-primary">Primary</button>
              <button class="demo-btn demo-btn-secondary">Secondary</button>
              <button class="demo-btn demo-btn-outline">Outline</button>
            </div>
            <div class="showcase-label">Badges</div>
            <div class="badge-row">
              <span class="demo-badge demo-badge-default">Default</span>
              <span class="demo-badge demo-badge-success">Success</span>
              <span class="demo-badge demo-badge-warning">Warning</span>
              <span class="demo-badge demo-badge-danger">Danger</span>
              <span class="demo-badge demo-badge-info">Info</span>
            </div>
          </div>

          <!-- Alert Messages -->
          <div class="showcase-item showcase-alerts">
            <div class="demo-alert demo-alert-success">
              <mat-icon>check_circle</mat-icon>
              <div class="demo-alert-content">
                <strong>Success!</strong> Your changes have been saved.
              </div>
            </div>
            <div class="demo-alert demo-alert-info">
              <mat-icon>info</mat-icon>
              <div class="demo-alert-content">
                <strong>Info:</strong> New features available in v2.0
              </div>
            </div>
            <div class="demo-alert demo-alert-warning">
              <mat-icon>warning</mat-icon>
              <div class="demo-alert-content">
                <strong>Warning:</strong> Please review your settings.
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features">
        <div class="section-header">
          <h2>Why Choose AegisX?</h2>
          <p>Everything you need to build modern Angular applications</p>
        </div>

        <div class="features-grid">
          @for (feature of features; track feature.title) {
            <a [routerLink]="feature.link" class="feature-card">
              <div class="feature-icon" [style.background]="feature.gradient">
                <mat-icon>{{ feature.icon }}</mat-icon>
              </div>
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
              <span class="feature-link">
                Learn more
                <mat-icon>arrow_forward</mat-icon>
              </span>
            </a>
          }
        </div>
      </section>

      <!-- Quick Start Section -->
      <section class="quick-start">
        <div class="section-header">
          <h2>Get Started in 3 Steps</h2>
          <p>From zero to beautiful UI in minutes</p>
        </div>

        <div class="steps-grid">
          <!-- Step 1: Install -->
          <div class="step-card">
            <div class="step-number">1</div>
            <h3>Install</h3>
            <p>Add AegisX to your Angular project</p>
            <div class="step-code-block">
              <span class="step-code">pnpm add &#64;aegisx/ui</span>
            </div>
          </div>
          <!-- Step 2: Configure -->
          <div class="step-card">
            <div class="step-number">2</div>
            <h3>Configure</h3>
            <p>Import theme and design tokens</p>
            <div class="step-code-block">
              <span class="step-code">&#64;import 'aegisx-light.css';</span>
            </div>
          </div>
          <!-- Step 3: Build -->
          <div class="step-card">
            <div class="step-number">3</div>
            <h3>Build</h3>
            <p>Start building with ready-to-use components</p>
            <div class="step-code-block">
              <span class="step-code"
                >&lt;ax-card&gt;Hello AegisX!&lt;/ax-card&gt;</span
              >
            </div>
          </div>
        </div>

        <div class="steps-action">
          <a
            mat-flat-button
            color="primary"
            routerLink="/docs/getting-started/installation"
          >
            View Full Installation Guide
            <mat-icon>arrow_forward</mat-icon>
          </a>
        </div>
      </section>

      <!-- Categories Section -->
      <section class="categories">
        <div class="section-header">
          <h2>Explore Components</h2>
          <p>Organized by functionality for easy discovery</p>
        </div>

        <div class="categories-grid">
          @for (category of categories; track category.title) {
            <a [routerLink]="category.link" class="category-card">
              <div class="category-icon" [style.background]="category.gradient">
                <mat-icon>{{ category.icon }}</mat-icon>
              </div>
              <div class="category-content">
                <h4>{{ category.title }}</h4>
                <span class="category-count">{{ category.count }}</span>
              </div>
              <mat-icon class="category-arrow">chevron_right</mat-icon>
            </a>
          }
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta">
        <div class="cta-bg">
          <div class="cta-orb cta-orb-1"></div>
          <div class="cta-orb cta-orb-2"></div>
        </div>
        <div class="cta-content">
          <h2>Ready to Build Something Amazing?</h2>
          <p>
            Start creating beautiful, consistent applications with AegisX Design
            System today.
          </p>
          <div class="cta-actions">
            <a
              mat-flat-button
              routerLink="/docs/getting-started/installation"
              class="cta-primary"
            >
              <mat-icon>rocket_launch</mat-icon>
              Start Building
            </a>
            <a
              mat-stroked-button
              routerLink="/docs/components/aegisx/overview"
              class="cta-secondary"
            >
              <mat-icon>widgets</mat-icon>
              Browse Components
            </a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .intro-page {
        min-height: 100vh;
      }
      .hero {
        position: relative;
        padding: 4rem 2rem;
        min-height: 90vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }
      .hero-bg {
        position: absolute;
        inset: 0;
        overflow: hidden;
      }
      .gradient-orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(80px);
        opacity: 0.5;
      }
      .orb-1 {
        width: 600px;
        height: 600px;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        top: -200px;
        right: -100px;
        animation: float 8s ease-in-out infinite;
      }
      .orb-2 {
        width: 400px;
        height: 400px;
        background: linear-gradient(135deg, #06b6d4, #3b82f6);
        bottom: -100px;
        left: -100px;
        animation: float 10s ease-in-out infinite reverse;
      }
      .orb-3 {
        width: 300px;
        height: 300px;
        background: linear-gradient(135deg, #f472b6, #ec4899);
        top: 50%;
        left: 30%;
        transform: translate(-50%, -50%);
        animation: float 12s ease-in-out infinite;
      }
      .grid-pattern {
        position: absolute;
        inset: 0;
        background-image:
          linear-gradient(var(--ax-border-subtle) 1px, transparent 1px),
          linear-gradient(90deg, var(--ax-border-subtle) 1px, transparent 1px);
        background-size: 40px 40px;
        opacity: 0.5;
      }
      @keyframes float {
        0%,
        100% {
          transform: translateY(0) scale(1);
        }
        50% {
          transform: translateY(-30px) scale(1.05);
        }
      }
      .hero-main {
        position: relative;
        z-index: 1;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
        align-items: center;
        max-width: 1200px;
        width: 100%;
      }
      .hero-content {
        text-align: left;
      }
      .hero-badge {
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
      .hero-badge mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
      .hero-title {
        font-size: clamp(2.5rem, 5vw, 3.5rem);
        font-weight: 800;
        line-height: 1.1;
        margin: 0 0 1.5rem;
        color: var(--ax-text-heading);
      }
      .gradient-text {
        background: linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .hero-description {
        font-size: 1.125rem;
        line-height: 1.7;
        color: var(--ax-text-secondary);
        margin: 0 0 2rem;
        max-width: 500px;
      }
      .hero-actions {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }
      .hero-actions a {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }
      .primary-btn {
        padding: 0 1.5rem;
        height: 48px;
        font-size: 1rem;
      }
      .secondary-btn {
        height: 48px;
        padding: 0 1.5rem;
      }
      .code-preview {
        background: #1e1e2e;
        border-radius: 16px;
        overflow: hidden;
        box-shadow:
          0 25px 50px -12px rgba(0, 0, 0, 0.25),
          0 0 0 1px rgba(255, 255, 255, 0.05);
        animation: fadeInUp 0.8s ease-out;
      }
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .code-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        background: #181825;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      }
      .window-dots {
        display: flex;
        gap: 8px;
      }
      .dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
      }
      .dot-red {
        background: #ff5f56;
      }
      .dot-yellow {
        background: #ffbd2e;
      }
      .dot-green {
        background: #27c93f;
      }
      .file-name {
        color: #6c7086;
        font-size: 13px;
        font-family: 'SF Mono', 'Fira Code', monospace;
      }
      .code-content {
        padding: 24px;
        overflow-x: auto;
      }
      .code-content pre {
        margin: 0;
        font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
        font-size: 14px;
        line-height: 1.7;
        color: #cdd6f4;
      }
      .code-content code {
        font-family: inherit;
      }
      .code-content .kw {
        color: #cba6f7;
      }
      .code-content .str {
        color: #a6e3a1;
      }
      .code-content .dec {
        color: #f9e2af;
      }
      .code-content .prop {
        color: #89b4fa;
      }
      .code-content .cls {
        color: #89dceb;
      }
      .code-content .bool {
        color: #fab387;
      }
      .stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 2rem;
        padding: 3rem 2rem;
        background: var(--ax-background-subtle);
        border-top: 1px solid var(--ax-border-default);
        border-bottom: 1px solid var(--ax-border-default);
      }
      .stat-item {
        text-align: center;
      }
      .stat-value {
        font-size: 2.5rem;
        font-weight: 700;
        color: #6366f1;
        line-height: 1;
      }
      .stat-label {
        font-size: 0.875rem;
        color: var(--ax-text-secondary);
        margin-top: 0.5rem;
      }
      .showcase {
        padding: 4rem 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }
      .showcase-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
      }
      .showcase-item {
        background: var(--ax-background-default);
        border: 1px solid var(--ax-border-default);
        border-radius: 16px;
        padding: 1.5rem;
        transition: all 0.3s ease;
      }
      .showcase-item:hover {
        border-color: var(--ax-brand-muted);
        box-shadow: var(--ax-shadow-lg);
      }
      .showcase-label {
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--ax-text-secondary);
        margin-bottom: 0.75rem;
      }
      .showcase-kpi {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .kpi-card {
        background: var(--ax-background-subtle);
        border-radius: 12px;
        padding: 1.25rem;
      }
      .kpi-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
      }
      .kpi-label {
        font-size: 0.875rem;
        color: var(--ax-text-secondary);
      }
      .kpi-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.25rem 0.5rem;
        border-radius: 100px;
        font-size: 0.75rem;
        font-weight: 600;
      }
      .kpi-badge mat-icon {
        font-size: 14px;
        width: 14px;
        height: 14px;
      }
      .kpi-badge-success {
        background: rgba(16, 185, 129, 0.1);
        color: #10b981;
      }
      .kpi-badge-info {
        background: rgba(59, 130, 246, 0.1);
        color: #3b82f6;
      }
      .kpi-value {
        font-size: 2rem;
        font-weight: 700;
        color: var(--ax-text-heading);
        line-height: 1;
        margin-bottom: 0.75rem;
      }
      .kpi-chart {
        height: 30px;
      }
      .sparkline {
        width: 100%;
        height: 100%;
      }
      .kpi-progress {
        height: 6px;
        background: var(--ax-border-default);
        border-radius: 3px;
        overflow: hidden;
        margin-bottom: 0.5rem;
      }
      .kpi-progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #6366f1, #8b5cf6);
        border-radius: 3px;
      }
      .kpi-footer {
        font-size: 0.75rem;
        color: var(--ax-text-secondary);
      }
      .demo-card {
        background: var(--ax-background-subtle);
        border-radius: 12px;
        padding: 1.25rem;
      }
      .demo-card-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1rem;
      }
      .demo-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .demo-avatar mat-icon {
        color: white;
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
      .demo-card-title {
        flex: 1;
      }
      .demo-card-title h4 {
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
        color: var(--ax-text-heading);
      }
      .demo-card-title span {
        font-size: 0.8125rem;
        color: var(--ax-text-secondary);
      }
      .demo-card-content {
        font-size: 0.875rem;
        color: var(--ax-text-secondary);
        line-height: 1.6;
        margin: 0 0 1rem;
      }
      .demo-card-footer {
        display: flex;
        gap: 0.75rem;
      }
      .demo-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        font-size: 0.875rem;
        font-weight: 500;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .demo-btn mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
      .demo-btn-primary {
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
      }
      .demo-btn-primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
      }
      .demo-btn-secondary {
        background: var(--ax-background-subtle);
        color: var(--ax-text-default);
        border: 1px solid var(--ax-border-default);
      }
      .demo-btn-outline {
        background: transparent;
        color: #6366f1;
        border: 1px solid #6366f1;
      }
      .button-row,
      .badge-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1.25rem;
      }
      .badge-row {
        margin-bottom: 0;
      }
      .demo-badge {
        display: inline-flex;
        align-items: center;
        padding: 0.25rem 0.75rem;
        border-radius: 100px;
        font-size: 0.75rem;
        font-weight: 600;
      }
      .demo-badge-default {
        background: var(--ax-background-subtle);
        color: var(--ax-text-default);
      }
      .demo-badge-success {
        background: rgba(16, 185, 129, 0.1);
        color: #10b981;
      }
      .demo-badge-warning {
        background: rgba(245, 158, 11, 0.1);
        color: #f59e0b;
      }
      .demo-badge-danger {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
      }
      .demo-badge-info {
        background: rgba(59, 130, 246, 0.1);
        color: #3b82f6;
      }
      .showcase-alerts {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .demo-alert {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 0.875rem 1rem;
        border-radius: 8px;
        font-size: 0.875rem;
      }
      .demo-alert mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
        flex-shrink: 0;
      }
      .demo-alert-content {
        line-height: 1.4;
      }
      .demo-alert-content strong {
        font-weight: 600;
      }
      .demo-alert-success {
        background: rgba(16, 185, 129, 0.1);
        color: #10b981;
      }
      .demo-alert-info {
        background: rgba(59, 130, 246, 0.1);
        color: #3b82f6;
      }
      .demo-alert-warning {
        background: rgba(245, 158, 11, 0.1);
        color: #f59e0b;
      }
      .section-header {
        text-align: center;
        margin-bottom: 3rem;
      }
      .section-header h2 {
        font-size: 2rem;
        font-weight: 700;
        color: var(--ax-text-heading);
        margin: 0 0 0.5rem;
      }
      .section-header p {
        font-size: 1.125rem;
        color: var(--ax-text-secondary);
        margin: 0;
      }
      .features {
        padding: 4rem 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }
      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
      }
      .feature-card {
        display: flex;
        flex-direction: column;
        padding: 1.5rem;
        background: var(--ax-background-default);
        border: 1px solid var(--ax-border-default);
        border-radius: 16px;
        text-decoration: none;
        transition: all 0.2s ease;
      }
      .feature-card:hover {
        border-color: var(--ax-brand-default);
        transform: translateY(-4px);
        box-shadow: var(--ax-shadow-lg);
      }
      .feature-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1rem;
      }
      .feature-icon mat-icon {
        color: white;
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
      .feature-card h3 {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--ax-text-heading);
        margin: 0 0 0.5rem;
      }
      .feature-card p {
        font-size: 0.875rem;
        color: var(--ax-text-secondary);
        margin: 0;
        line-height: 1.6;
        flex: 1;
      }
      .feature-link {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        margin-top: 1rem;
        font-size: 0.875rem;
        font-weight: 500;
        color: #6366f1;
      }
      .feature-link mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
        transition: transform 0.2s ease;
      }
      .feature-card:hover .feature-link mat-icon {
        transform: translateX(4px);
      }
      .quick-start {
        padding: 4rem 2rem;
        background: var(--ax-background-subtle);
        border-top: 1px solid var(--ax-border-default);
      }
      .steps-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
        max-width: 1000px;
        margin: 0 auto 2rem;
      }
      .step-card {
        position: relative;
        padding: 1.5rem;
        background: var(--ax-background-default);
        border: 1px solid var(--ax-border-default);
        border-radius: 16px;
        text-align: center;
      }
      .step-number {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
        font-size: 1.25rem;
        font-weight: 700;
        border-radius: 50%;
        margin-bottom: 1rem;
      }
      .step-card h3 {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--ax-text-heading);
        margin: 0 0 0.5rem;
      }
      .step-card p {
        font-size: 0.875rem;
        color: var(--ax-text-secondary);
        margin: 0 0 1rem;
      }
      .step-code-block {
        padding: 0.75rem 1rem;
        background: #1e1e2e;
        border-radius: 8px;
      }
      .step-code {
        font-family: 'SF Mono', 'Fira Code', monospace;
        font-size: 0.8125rem;
        color: #a6e3a1;
      }
      .steps-action {
        text-align: center;
      }
      .steps-action a {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }
      .categories {
        padding: 4rem 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }
      .categories-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1rem;
      }
      .category-card {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem 1.25rem;
        background: var(--ax-background-default);
        border: 1px solid var(--ax-border-default);
        border-radius: 12px;
        text-decoration: none;
        transition: all 0.2s ease;
      }
      .category-card:hover {
        border-color: var(--ax-brand-muted);
        background: var(--ax-background-subtle);
      }
      .category-icon {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .category-icon mat-icon {
        color: white;
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
      .category-content {
        flex: 1;
      }
      .category-content h4 {
        font-size: 0.9375rem;
        font-weight: 600;
        color: var(--ax-text-heading);
        margin: 0;
      }
      .category-count {
        font-size: 0.8125rem;
        color: var(--ax-text-secondary);
      }
      .category-arrow {
        color: var(--ax-text-subtle);
        font-size: 20px;
        width: 20px;
        height: 20px;
        transition: transform 0.2s ease;
      }
      .category-card:hover .category-arrow {
        transform: translateX(4px);
        color: var(--ax-brand-default);
      }
      .cta {
        position: relative;
        padding: 4rem 2rem;
        margin: 0 2rem 2rem;
        border-radius: 24px;
        overflow: hidden;
        text-align: center;
      }
      .cta-bg {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          135deg,
          rgba(99, 102, 241, 0.1),
          rgba(6, 182, 212, 0.1)
        );
      }
      .cta-orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(60px);
        opacity: 0.3;
      }
      .cta-orb-1 {
        width: 300px;
        height: 300px;
        background: #6366f1;
        top: -100px;
        left: -50px;
      }
      .cta-orb-2 {
        width: 250px;
        height: 250px;
        background: #06b6d4;
        bottom: -100px;
        right: -50px;
      }
      .cta-content {
        position: relative;
        z-index: 1;
        max-width: 600px;
        margin: 0 auto;
      }
      .cta h2 {
        font-size: 2rem;
        font-weight: 700;
        color: var(--ax-text-heading);
        margin: 0 0 1rem;
      }
      .cta p {
        font-size: 1.125rem;
        color: var(--ax-text-secondary);
        margin: 0 0 2rem;
      }
      .cta-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
      }
      .cta-actions a {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }
      .cta-primary {
        background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
        color: white !important;
      }
      @media (max-width: 900px) {
        .hero-main {
          grid-template-columns: 1fr;
          text-align: center;
        }
        .hero-content {
          text-align: center;
        }
        .hero-description {
          max-width: none;
        }
        .hero-actions {
          justify-content: center;
        }
        .code-preview {
          max-width: 500px;
          margin: 0 auto;
        }
        .showcase-grid {
          grid-template-columns: 1fr;
        }
      }
      @media (max-width: 600px) {
        .hero {
          min-height: auto;
          padding: 3rem 1rem;
        }
        .hero-title {
          font-size: 2rem;
        }
        .code-preview {
          display: none;
        }
        .steps-grid {
          grid-template-columns: 1fr;
        }
        .cta {
          margin: 0 1rem 1rem;
          padding: 3rem 1.5rem;
        }
      }
    `,
  ],
})
export class IntroductionDocComponent {
  stats = [
    { value: '50+', label: 'Components' },
    { value: '120+', label: 'Design Tokens' },
    { value: 'MD3', label: 'Material Design' },
    { value: 'A11y', label: 'WCAG 2.1 AA' },
  ];

  features = [
    {
      icon: 'palette',
      title: 'Design Tokens',
      description:
        'CSS Custom Properties for colors, spacing, typography, shadows, and more. Fully customizable and theme-ready.',
      link: '/docs/foundations/design-tokens',
      gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    },
    {
      icon: 'layers',
      title: 'Material Components',
      description:
        'Angular Material components with MD3 styling, customized to match AegisX design language.',
      link: '/docs/material/overview',
      gradient: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
    },
    {
      icon: 'extension',
      title: 'AegisX Components',
      description:
        'Custom components for dashboards, data visualization, and enterprise applications.',
      link: '/docs/components/aegisx/overview',
      gradient: 'linear-gradient(135deg, #10b981, #34d399)',
    },
    {
      icon: 'dark_mode',
      title: 'Dark Mode Ready',
      description:
        'Seamless light and dark theme support with automatic color adjustments.',
      link: '/docs/foundations/colors',
      gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
    },
  ];

  categories = [
    {
      icon: 'view_agenda',
      title: 'Data Display',
      count: '12 components',
      link: '/docs/components/aegisx/data-display/card',
      gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    },
    {
      icon: 'edit_note',
      title: 'Forms & Input',
      count: '15 components',
      link: '/docs/patterns/form-sizes',
      gradient: 'linear-gradient(135deg, #10b981, #34d399)',
    },
    {
      icon: 'menu',
      title: 'Navigation',
      count: '8 components',
      link: '/docs/components/aegisx/navigation/breadcrumb',
      gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
    },
    {
      icon: 'notifications',
      title: 'Feedback',
      count: '6 components',
      link: '/docs/components/aegisx/feedback/alert',
      gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    },
    {
      icon: 'bar_chart',
      title: 'Charts',
      count: '5 variants',
      link: '/docs/components/aegisx/charts/sparkline',
      gradient: 'linear-gradient(135deg, #ec4899, #f472b6)',
    },
    {
      icon: 'dashboard',
      title: 'Layouts',
      count: '4 templates',
      link: '/docs/patterns/form-layouts',
      gradient: 'linear-gradient(135deg, #06b6d4, #22d3ee)',
    },
  ];
}
