import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../components/docs';
import { ComponentToken } from '../../../../types/docs.types';

@Component({
  selector: 'app-material-card-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatChipsModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="material-card-doc">
      <!-- Header -->
      <ax-doc-header
        title="Card"
        description="Cards are surfaces that display content and actions on a single topic. They should be easy to scan for relevant and actionable information."
        [status]="'stable'"
        [version]="'19.0'"
        [breadcrumbs]="[
          { label: 'Docs', link: '/docs' },
          { label: 'Material', link: '/docs/material/overview' },
        ]"
      >
        <div class="material-card-doc__header-links">
          <a
            href="https://material.angular.dev/components/card/overview"
            target="_blank"
            rel="noopener"
            class="material-card-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Angular Material Docs
          </a>
          <a
            href="https://m3.material.io/components/cards/overview"
            target="_blank"
            rel="noopener"
            class="material-card-doc__external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Material Design 3
          </a>
        </div>
      </ax-doc-header>

      <!-- Tabs -->
      <mat-tab-group class="material-card-doc__tabs" animationDuration="200ms">
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="material-card-doc__section">
            <h2 class="material-card-doc__section-title">Card Types</h2>
            <p class="material-card-doc__section-description">
              Material Design 3 defines three card types, each with a distinct
              visual style suitable for different use cases.
            </p>

            <!-- Three Card Types Grid -->
            <div class="card-types-grid">
              <!-- Elevated Card -->
              <div class="card-type-demo">
                <mat-card class="demo-card">
                  <mat-card-header>
                    <mat-card-title>Elevated</mat-card-title>
                    <mat-card-subtitle>Default appearance</mat-card-subtitle>
                  </mat-card-header>
                  <mat-card-content>
                    <p>
                      Uses shadow for depth and separation from the background.
                    </p>
                  </mat-card-content>
                </mat-card>
                <div class="card-type-label">
                  <code>appearance="raised"</code>
                  <span class="default-badge">Default</span>
                </div>
              </div>

              <!-- Filled Card -->
              <div class="card-type-demo">
                <mat-card appearance="filled" class="demo-card">
                  <mat-card-header>
                    <mat-card-title>Filled</mat-card-title>
                    <mat-card-subtitle>Subtle background</mat-card-subtitle>
                  </mat-card-header>
                  <mat-card-content>
                    <p>Uses a fill color to distinguish from the surface.</p>
                  </mat-card-content>
                </mat-card>
                <div class="card-type-label">
                  <code>appearance="filled"</code>
                </div>
              </div>

              <!-- Outlined Card -->
              <div class="card-type-demo">
                <mat-card appearance="outlined" class="demo-card">
                  <mat-card-header>
                    <mat-card-title>Outlined</mat-card-title>
                    <mat-card-subtitle>Border only</mat-card-subtitle>
                  </mat-card-header>
                  <mat-card-content>
                    <p>Uses a stroke/border for visual separation.</p>
                  </mat-card-content>
                </mat-card>
                <div class="card-type-label">
                  <code>appearance="outlined"</code>
                </div>
              </div>
            </div>

            <h2 class="material-card-doc__section-title">Card Anatomy</h2>
            <p class="material-card-doc__section-description">
              Cards are composed of several optional building blocks.
            </p>

            <ax-live-preview title="Complete card anatomy">
              <mat-card class="anatomy-card">
                <mat-card-header>
                  <div mat-card-avatar class="avatar-purple"></div>
                  <mat-card-title>Card Title</mat-card-title>
                  <mat-card-subtitle>Card Subtitle</mat-card-subtitle>
                </mat-card-header>
                <img
                  mat-card-image
                  src="https://picsum.photos/seed/card/400/200"
                  alt="Card image"
                />
                <mat-card-content>
                  <p>
                    This is the card content area. It can contain any type of
                    content including text, images, lists, and other components.
                  </p>
                </mat-card-content>
                <mat-divider></mat-divider>
                <mat-card-actions>
                  <button mat-button>Cancel</button>
                  <button mat-button color="primary">Save</button>
                </mat-card-actions>
              </mat-card>
            </ax-live-preview>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="material-card-doc__section">
            <h2 class="material-card-doc__section-title">
              Real-World Examples
            </h2>

            <!-- Product Card -->
            <h3 class="material-card-doc__subsection-title">Product Card</h3>
            <ax-live-preview title="E-commerce product card">
              <mat-card class="product-card">
                <img
                  mat-card-image
                  src="https://picsum.photos/seed/product/400/250"
                  alt="Product"
                />
                <mat-card-content>
                  <div class="product-category">Electronics</div>
                  <h3 class="product-title">Wireless Headphones</h3>
                  <p class="product-description">
                    Premium noise-canceling wireless headphones with 30-hour
                    battery life.
                  </p>
                  <div class="product-price">
                    <span class="price-current">$199.99</span>
                    <span class="price-original">$249.99</span>
                  </div>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-button>
                    <mat-icon>favorite_border</mat-icon>
                    Wishlist
                  </button>
                  <button mat-flat-button color="primary">
                    <mat-icon>shopping_cart</mat-icon>
                    Add to Cart
                  </button>
                </mat-card-actions>
              </mat-card>
            </ax-live-preview>
            <ax-code-tabs [tabs]="productCardCode" />

            <!-- Profile Card -->
            <h3 class="material-card-doc__subsection-title">Profile Card</h3>
            <ax-live-preview title="User profile card">
              <mat-card class="profile-card">
                <div class="profile-cover"></div>
                <mat-card-content>
                  <div class="profile-avatar">
                    <img src="https://i.pravatar.cc/120?img=12" alt="Avatar" />
                  </div>
                  <div class="profile-info">
                    <h3>Sarah Johnson</h3>
                    <p class="profile-role">Senior Product Designer</p>
                    <p class="profile-location">
                      <mat-icon>location_on</mat-icon>
                      San Francisco, CA
                    </p>
                  </div>
                  <div class="profile-stats">
                    <div class="stat">
                      <span class="stat-value">1,234</span>
                      <span class="stat-label">Followers</span>
                    </div>
                    <div class="stat">
                      <span class="stat-value">567</span>
                      <span class="stat-label">Following</span>
                    </div>
                    <div class="stat">
                      <span class="stat-value">89</span>
                      <span class="stat-label">Projects</span>
                    </div>
                  </div>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-stroked-button>Message</button>
                  <button mat-flat-button color="primary">Follow</button>
                </mat-card-actions>
              </mat-card>
            </ax-live-preview>
            <ax-code-tabs [tabs]="profileCardCode" />

            <!-- Article Card -->
            <h3 class="material-card-doc__subsection-title">Article Card</h3>
            <ax-live-preview title="Blog article card">
              <mat-card appearance="outlined" class="article-card">
                <mat-card-header>
                  <div mat-card-avatar class="avatar-blue"></div>
                  <mat-card-title>Design Systems at Scale</mat-card-title>
                  <mat-card-subtitle>
                    <mat-icon>schedule</mat-icon>
                    5 min read · Dec 3, 2024
                  </mat-card-subtitle>
                </mat-card-header>
                <img
                  mat-card-image
                  src="https://picsum.photos/seed/article/400/200"
                  alt="Article"
                />
                <mat-card-content>
                  <p>
                    Learn how to build and maintain design systems that scale
                    across multiple products and teams while maintaining
                    consistency.
                  </p>
                  <mat-chip-set>
                    <mat-chip>Design</mat-chip>
                    <mat-chip>Systems</mat-chip>
                    <mat-chip>UI/UX</mat-chip>
                  </mat-chip-set>
                </mat-card-content>
                <mat-card-actions align="end">
                  <button mat-icon-button>
                    <mat-icon>bookmark_border</mat-icon>
                  </button>
                  <button mat-icon-button>
                    <mat-icon>share</mat-icon>
                  </button>
                  <button mat-button color="primary">Read More</button>
                </mat-card-actions>
              </mat-card>
            </ax-live-preview>
            <ax-code-tabs [tabs]="articleCardCode" />

            <!-- Stats/KPI Card -->
            <h3 class="material-card-doc__subsection-title">Stats Card</h3>
            <ax-live-preview title="Dashboard KPI cards">
              <div class="stats-grid">
                <mat-card appearance="filled" class="stats-card">
                  <mat-card-content>
                    <div class="stats-icon stats-icon--blue">
                      <mat-icon>people</mat-icon>
                    </div>
                    <div class="stats-info">
                      <span class="stats-value">12,543</span>
                      <span class="stats-label">Total Users</span>
                    </div>
                    <div class="stats-trend stats-trend--up">
                      <mat-icon>trending_up</mat-icon>
                      +12.5%
                    </div>
                  </mat-card-content>
                </mat-card>

                <mat-card appearance="filled" class="stats-card">
                  <mat-card-content>
                    <div class="stats-icon stats-icon--green">
                      <mat-icon>attach_money</mat-icon>
                    </div>
                    <div class="stats-info">
                      <span class="stats-value">$48,234</span>
                      <span class="stats-label">Revenue</span>
                    </div>
                    <div class="stats-trend stats-trend--up">
                      <mat-icon>trending_up</mat-icon>
                      +8.2%
                    </div>
                  </mat-card-content>
                </mat-card>

                <mat-card appearance="filled" class="stats-card">
                  <mat-card-content>
                    <div class="stats-icon stats-icon--orange">
                      <mat-icon>shopping_cart</mat-icon>
                    </div>
                    <div class="stats-info">
                      <span class="stats-value">1,893</span>
                      <span class="stats-label">Orders</span>
                    </div>
                    <div class="stats-trend stats-trend--down">
                      <mat-icon>trending_down</mat-icon>
                      -3.1%
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
            </ax-live-preview>
            <ax-code-tabs [tabs]="statsCardCode" />

            <!-- Interactive Card -->
            <h3 class="material-card-doc__subsection-title">
              Interactive Card
            </h3>
            <ax-live-preview title="Clickable card with hover effects">
              <div class="interactive-cards">
                <mat-card class="interactive-card" tabindex="0">
                  <mat-card-content>
                    <mat-icon class="feature-icon">folder</mat-icon>
                    <h4>Documents</h4>
                    <p>23 files</p>
                  </mat-card-content>
                </mat-card>

                <mat-card class="interactive-card" tabindex="0">
                  <mat-card-content>
                    <mat-icon class="feature-icon">photo_library</mat-icon>
                    <h4>Photos</h4>
                    <p>1,204 items</p>
                  </mat-card-content>
                </mat-card>

                <mat-card class="interactive-card" tabindex="0">
                  <mat-card-content>
                    <mat-icon class="feature-icon">music_note</mat-icon>
                    <h4>Music</h4>
                    <p>456 tracks</p>
                  </mat-card-content>
                </mat-card>
              </div>
            </ax-live-preview>
            <ax-code-tabs [tabs]="interactiveCardCode" />

            <!-- Card with Media Actions -->
            <h3 class="material-card-doc__subsection-title">
              Media Card with Actions
            </h3>
            <ax-live-preview title="Video/media card with controls">
              <mat-card class="media-card">
                <div class="media-thumbnail">
                  <img
                    src="https://picsum.photos/seed/video/400/225"
                    alt="Video thumbnail"
                  />
                  <div class="media-overlay">
                    <button mat-fab color="primary" class="play-button">
                      <mat-icon>play_arrow</mat-icon>
                    </button>
                    <span class="media-duration">12:34</span>
                  </div>
                </div>
                <mat-card-content>
                  <h3 class="media-title">Introduction to Angular Material</h3>
                  <p class="media-meta">
                    <span>Angular Team</span>
                    <span>•</span>
                    <span>125K views</span>
                    <span>•</span>
                    <span>2 weeks ago</span>
                  </p>
                </mat-card-content>
              </mat-card>
            </ax-live-preview>
            <ax-code-tabs [tabs]="mediaCardCode" />

            <!-- Horizontal Card -->
            <h3 class="material-card-doc__subsection-title">Horizontal Card</h3>
            <ax-live-preview title="Horizontal layout card">
              <mat-card appearance="outlined" class="horizontal-card">
                <div class="horizontal-card__image">
                  <img
                    src="https://picsum.photos/seed/horizontal/200/200"
                    alt="Item"
                  />
                </div>
                <div class="horizontal-card__content">
                  <mat-card-header>
                    <mat-card-title>Premium Workshop</mat-card-title>
                    <mat-card-subtitle>Online Course</mat-card-subtitle>
                  </mat-card-header>
                  <mat-card-content>
                    <p>
                      Master advanced techniques with hands-on projects and
                      expert guidance.
                    </p>
                    <div class="course-meta">
                      <span><mat-icon>schedule</mat-icon> 8 hours</span>
                      <span
                        ><mat-icon>signal_cellular_alt</mat-icon>
                        Intermediate</span
                      >
                    </div>
                  </mat-card-content>
                  <mat-card-actions>
                    <button mat-flat-button color="primary">Enroll Now</button>
                    <button mat-button>Preview</button>
                  </mat-card-actions>
                </div>
              </mat-card>
            </ax-live-preview>
            <ax-code-tabs [tabs]="horizontalCardCode" />

            <!-- Loading Card -->
            <h3 class="material-card-doc__subsection-title">Loading State</h3>
            <ax-live-preview title="Card with loading indicator">
              <div class="loading-cards">
                <mat-card class="loading-card">
                  <mat-progress-bar mode="indeterminate"></mat-progress-bar>
                  <mat-card-content>
                    <div class="skeleton skeleton-image"></div>
                    <div class="skeleton skeleton-title"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div
                      class="skeleton skeleton-text skeleton-text--short"
                    ></div>
                  </mat-card-content>
                </mat-card>

                <mat-card class="loading-card loading-card--spinner">
                  <mat-card-content>
                    <mat-spinner diameter="40"></mat-spinner>
                    <p>Loading content...</p>
                  </mat-card-content>
                </mat-card>
              </div>
            </ax-live-preview>
            <ax-code-tabs [tabs]="loadingCardCode" />
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="material-card-doc__section">
            <h2 class="material-card-doc__section-title">API Reference</h2>

            <mat-card appearance="outlined" class="material-card-doc__api-card">
              <mat-card-header>
                <mat-card-title>Selectors</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table class="material-card-doc__api-table">
                  <thead>
                    <tr>
                      <th>Selector</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>mat-card</code></td>
                      <td>Main card container element</td>
                    </tr>
                    <tr>
                      <td><code>mat-card-header</code></td>
                      <td>
                        Header section containing avatar, title, and subtitle
                      </td>
                    </tr>
                    <tr>
                      <td><code>mat-card-title</code></td>
                      <td>Primary title text within the header</td>
                    </tr>
                    <tr>
                      <td><code>mat-card-subtitle</code></td>
                      <td>Secondary text below the title</td>
                    </tr>
                    <tr>
                      <td><code>mat-card-title-group</code></td>
                      <td>Groups title/subtitle with a larger image</td>
                    </tr>
                    <tr>
                      <td><code>mat-card-content</code></td>
                      <td>Primary content section of the card</td>
                    </tr>
                    <tr>
                      <td><code>mat-card-actions</code></td>
                      <td>Container for action buttons</td>
                    </tr>
                    <tr>
                      <td><code>mat-card-footer</code></td>
                      <td>Footer section at the bottom of the card</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>

            <mat-card appearance="outlined" class="material-card-doc__api-card">
              <mat-card-header>
                <mat-card-title>Directives</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table class="material-card-doc__api-table">
                  <thead>
                    <tr>
                      <th>Directive</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>mat-card-avatar</code></td>
                      <td>
                        Attribute directive for avatar images in the header
                      </td>
                    </tr>
                    <tr>
                      <td><code>mat-card-image</code></td>
                      <td>Full-width image that spans the card width</td>
                    </tr>
                    <tr>
                      <td><code>mat-card-sm-image</code></td>
                      <td>Small image (80x80) for title groups</td>
                    </tr>
                    <tr>
                      <td><code>mat-card-md-image</code></td>
                      <td>Medium image (112x112) for title groups</td>
                    </tr>
                    <tr>
                      <td><code>mat-card-lg-image</code></td>
                      <td>Large image (152x152) for title groups</td>
                    </tr>
                    <tr>
                      <td><code>mat-card-xl-image</code></td>
                      <td>Extra large image (240x240) for title groups</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>

            <mat-card appearance="outlined" class="material-card-doc__api-card">
              <mat-card-header>
                <mat-card-title>Input Properties</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table class="material-card-doc__api-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Type</th>
                      <th>Default</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>[appearance]</code></td>
                      <td><code>'raised' | 'filled' | 'outlined'</code></td>
                      <td><code>'raised'</code></td>
                      <td>Visual style of the card</td>
                    </tr>
                    <tr>
                      <td><code>[align]</code></td>
                      <td><code>'start' | 'end'</code></td>
                      <td><code>'start'</code></td>
                      <td>Alignment of mat-card-actions buttons</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>

            <mat-card appearance="outlined" class="material-card-doc__api-card">
              <mat-card-header>
                <mat-card-title>Accessibility</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ul class="accessibility-list">
                  <li>
                    <mat-icon>check_circle</mat-icon>
                    Cards have <code>role="region"</code> by default for
                    landmark navigation
                  </li>
                  <li>
                    <mat-icon>check_circle</mat-icon>
                    Use appropriate heading levels (h2, h3, etc.) for card
                    titles
                  </li>
                  <li>
                    <mat-icon>check_circle</mat-icon>
                    Add <code>tabindex="0"</code> for interactive/clickable
                    cards
                  </li>
                  <li>
                    <mat-icon>check_circle</mat-icon>
                    Include <code>alt</code> text for all images
                  </li>
                  <li>
                    <mat-icon>check_circle</mat-icon>
                    Ensure sufficient color contrast for text content
                  </li>
                </ul>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- CSS Tokens Tab -->
        <mat-tab label="CSS Tokens">
          <div class="material-card-doc__section">
            <h2 class="material-card-doc__section-title">Design Tokens</h2>
            <p class="material-card-doc__section-description">
              AegisX customizes these Material Design tokens for card styling.
            </p>
            <ax-component-tokens [tokens]="cardTokens" />

            <h3 class="material-card-doc__subsection-title">
              Custom Styling Example
            </h3>
            <ax-code-tabs [tabs]="customStylingCode" />
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .material-card-doc {
        max-width: 1000px;
        margin: 0 auto;

        &__header-links {
          display: flex;
          gap: var(--ax-spacing-md);
          margin-top: var(--ax-spacing-md);
        }

        &__external-link {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8125rem;
          color: var(--ax-brand-default);
          text-decoration: none;

          mat-icon {
            font-size: 16px;
            width: 16px;
            height: 16px;
          }

          &:hover {
            text-decoration: underline;
          }
        }

        &__tabs {
          margin-top: var(--ax-spacing-lg);
        }

        &__section {
          padding: var(--ax-spacing-lg);
        }

        &__section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: 0 0 var(--ax-spacing-sm) 0;
        }

        &__section-description {
          font-size: 0.9375rem;
          color: var(--ax-text-secondary);
          margin: 0 0 var(--ax-spacing-xl) 0;
        }

        &__subsection-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: var(--ax-spacing-2xl) 0 var(--ax-spacing-md) 0;

          &:first-of-type {
            margin-top: 0;
          }
        }

        &__api-card {
          margin-bottom: var(--ax-spacing-lg);
        }

        &__api-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;

          th,
          td {
            padding: var(--ax-spacing-sm) var(--ax-spacing-md);
            text-align: left;
            border-bottom: 1px solid var(--ax-border-default);
          }

          th {
            font-weight: 600;
            color: var(--ax-text-heading);
            background: var(--ax-background-subtle);
          }

          code {
            background: var(--ax-background-subtle);
            padding: 2px 6px;
            border-radius: var(--ax-radius-sm);
            font-size: 0.8125rem;
          }
        }
      }

      /* Card Types Grid */
      .card-types-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--ax-spacing-lg);
        margin-bottom: var(--ax-spacing-2xl);
      }

      .card-type-demo {
        display: flex;
        flex-direction: column;
        gap: var(--ax-spacing-sm);
      }

      .card-type-label {
        display: flex;
        align-items: center;
        gap: var(--ax-spacing-sm);
        font-size: 0.875rem;

        code {
          background: var(--ax-background-subtle);
          padding: 4px 8px;
          border-radius: var(--ax-radius-sm);
        }
      }

      .default-badge {
        background: var(--ax-brand-default);
        color: white;
        padding: 2px 8px;
        border-radius: var(--ax-radius-full);
        font-size: 0.75rem;
        font-weight: 500;
      }

      .demo-card {
        height: 100%;
      }

      /* Anatomy Card */
      .anatomy-card {
        max-width: 400px;
      }

      /* Avatars */
      .avatar-purple {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 50%;
        width: 40px;
        height: 40px;
      }

      .avatar-blue {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        border-radius: 50%;
        width: 40px;
        height: 40px;
      }

      /* Product Card */
      .product-card {
        max-width: 320px;
      }

      .product-category {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--ax-brand-default);
        font-weight: 600;
        margin-bottom: var(--ax-spacing-xs);
      }

      .product-title {
        font-size: 1.125rem;
        font-weight: 600;
        margin: 0 0 var(--ax-spacing-xs) 0;
        color: var(--ax-text-heading);
      }

      .product-description {
        font-size: 0.875rem;
        color: var(--ax-text-secondary);
        margin: 0 0 var(--ax-spacing-md) 0;
      }

      .product-price {
        display: flex;
        align-items: center;
        gap: var(--ax-spacing-sm);
      }

      .price-current {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--ax-text-heading);
      }

      .price-original {
        font-size: 0.875rem;
        color: var(--ax-text-secondary);
        text-decoration: line-through;
      }

      /* Profile Card */
      .profile-card {
        max-width: 320px;
        overflow: hidden;
      }

      .profile-cover {
        height: 100px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      .profile-avatar {
        margin-top: -50px;
        margin-bottom: var(--ax-spacing-md);
        text-align: center;

        img {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          border: 4px solid white;
          box-shadow: var(--ax-shadow-md);
        }
      }

      .profile-info {
        text-align: center;
        margin-bottom: var(--ax-spacing-md);

        h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--ax-text-heading);
        }

        .profile-role {
          color: var(--ax-text-secondary);
          margin: var(--ax-spacing-xs) 0;
        }

        .profile-location {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          font-size: 0.875rem;
          color: var(--ax-text-secondary);
          margin: 0;

          mat-icon {
            font-size: 16px;
            width: 16px;
            height: 16px;
          }
        }
      }

      .profile-stats {
        display: flex;
        justify-content: space-around;
        padding: var(--ax-spacing-md) 0;
        border-top: 1px solid var(--ax-border-default);
        border-bottom: 1px solid var(--ax-border-default);
      }

      .stat {
        text-align: center;

        .stat-value {
          display: block;
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--ax-text-heading);
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--ax-text-secondary);
        }
      }

      /* Article Card */
      .article-card {
        max-width: 400px;

        mat-card-subtitle {
          display: flex;
          align-items: center;
          gap: 4px;

          mat-icon {
            font-size: 14px;
            width: 14px;
            height: 14px;
          }
        }

        mat-chip-set {
          margin-top: var(--ax-spacing-md);
        }
      }

      /* Stats Cards */
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--ax-spacing-md);
      }

      .stats-card {
        mat-card-content {
          display: flex;
          align-items: center;
          gap: var(--ax-spacing-md);
        }
      }

      .stats-icon {
        width: 48px;
        height: 48px;
        border-radius: var(--ax-radius-md);
        display: flex;
        align-items: center;
        justify-content: center;

        mat-icon {
          color: white;
        }

        &--blue {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        &--green {
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
        }

        &--orange {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
      }

      .stats-info {
        flex: 1;

        .stats-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--ax-text-heading);
        }

        .stats-label {
          font-size: 0.875rem;
          color: var(--ax-text-secondary);
        }
      }

      .stats-trend {
        display: flex;
        align-items: center;
        gap: 2px;
        font-size: 0.875rem;
        font-weight: 500;

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
        }

        &--up {
          color: #22c55e;
        }

        &--down {
          color: #ef4444;
        }
      }

      /* Interactive Cards */
      .interactive-cards {
        display: flex;
        gap: var(--ax-spacing-md);
        flex-wrap: wrap;
      }

      .interactive-card {
        width: 140px;
        cursor: pointer;
        transition: all 0.2s ease;
        text-align: center;

        &:hover {
          transform: translateY(-4px);
          box-shadow: var(--ax-shadow-lg);
        }

        &:focus {
          outline: 2px solid var(--ax-brand-default);
          outline-offset: 2px;
        }

        .feature-icon {
          font-size: 40px;
          width: 40px;
          height: 40px;
          color: var(--ax-brand-default);
          margin-bottom: var(--ax-spacing-sm);
        }

        h4 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: var(--ax-text-heading);
        }

        p {
          margin: var(--ax-spacing-xs) 0 0;
          font-size: 0.875rem;
          color: var(--ax-text-secondary);
        }
      }

      /* Media Card */
      .media-card {
        max-width: 400px;
        overflow: hidden;
      }

      .media-thumbnail {
        position: relative;

        img {
          width: 100%;
          display: block;
        }
      }

      .media-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.2s ease;

        .media-card:hover & {
          opacity: 1;
        }
      }

      .play-button {
        transform: scale(0.9);
        transition: transform 0.2s ease;

        .media-card:hover & {
          transform: scale(1);
        }
      }

      .media-duration {
        position: absolute;
        bottom: 8px;
        right: 8px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.75rem;
      }

      .media-title {
        font-size: 1rem;
        font-weight: 600;
        margin: 0 0 var(--ax-spacing-xs) 0;
        color: var(--ax-text-heading);
      }

      .media-meta {
        display: flex;
        gap: var(--ax-spacing-xs);
        font-size: 0.875rem;
        color: var(--ax-text-secondary);
        margin: 0;
      }

      /* Horizontal Card */
      .horizontal-card {
        display: flex;
        max-width: 600px;
      }

      .horizontal-card__image {
        flex-shrink: 0;

        img {
          width: 180px;
          height: 100%;
          object-fit: cover;
        }
      }

      .horizontal-card__content {
        display: flex;
        flex-direction: column;
        flex: 1;

        mat-card-content {
          flex: 1;
        }
      }

      .course-meta {
        display: flex;
        gap: var(--ax-spacing-md);
        margin-top: var(--ax-spacing-sm);
        font-size: 0.875rem;
        color: var(--ax-text-secondary);

        span {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }
      }

      /* Loading Cards */
      .loading-cards {
        display: flex;
        gap: var(--ax-spacing-lg);
        flex-wrap: wrap;
      }

      .loading-card {
        width: 280px;

        mat-progress-bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
        }

        &--spinner {
          mat-card-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 200px;
            gap: var(--ax-spacing-md);

            p {
              color: var(--ax-text-secondary);
              margin: 0;
            }
          }
        }
      }

      .skeleton {
        background: linear-gradient(
          90deg,
          var(--ax-background-subtle) 25%,
          var(--ax-background-muted) 50%,
          var(--ax-background-subtle) 75%
        );
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: var(--ax-radius-sm);
      }

      .skeleton-image {
        height: 140px;
        margin-bottom: var(--ax-spacing-md);
      }

      .skeleton-title {
        height: 24px;
        width: 70%;
        margin-bottom: var(--ax-spacing-sm);
      }

      .skeleton-text {
        height: 16px;
        margin-bottom: var(--ax-spacing-xs);

        &--short {
          width: 50%;
        }
      }

      @keyframes shimmer {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }

      /* Accessibility List */
      .accessibility-list {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          display: flex;
          align-items: flex-start;
          gap: var(--ax-spacing-sm);
          padding: var(--ax-spacing-sm) 0;

          mat-icon {
            color: #22c55e;
            flex-shrink: 0;
          }

          code {
            background: var(--ax-background-subtle);
            padding: 2px 6px;
            border-radius: var(--ax-radius-sm);
            font-size: 0.8125rem;
          }
        }
      }
    `,
  ],
})
export class MaterialCardDocComponent {
  productCardCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<mat-card class="product-card">
  <img mat-card-image src="product.jpg" alt="Product" />
  <mat-card-content>
    <div class="product-category">Electronics</div>
    <h3>Wireless Headphones</h3>
    <p>Premium noise-canceling wireless headphones.</p>
    <div class="product-price">
      <span class="price-current">$199.99</span>
      <span class="price-original">$249.99</span>
    </div>
  </mat-card-content>
  <mat-card-actions>
    <button mat-button>
      <mat-icon>favorite_border</mat-icon>
      Wishlist
    </button>
    <button mat-flat-button color="primary">
      <mat-icon>shopping_cart</mat-icon>
      Add to Cart
    </button>
  </mat-card-actions>
</mat-card>`,
    },
  ];

  profileCardCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<mat-card class="profile-card">
  <div class="profile-cover"></div>
  <mat-card-content>
    <div class="profile-avatar">
      <img src="avatar.jpg" alt="Avatar" />
    </div>
    <div class="profile-info">
      <h3>Sarah Johnson</h3>
      <p class="profile-role">Senior Product Designer</p>
      <p class="profile-location">
        <mat-icon>location_on</mat-icon>
        San Francisco, CA
      </p>
    </div>
    <div class="profile-stats">
      <div class="stat">
        <span class="stat-value">1,234</span>
        <span class="stat-label">Followers</span>
      </div>
      <!-- More stats... -->
    </div>
  </mat-card-content>
  <mat-card-actions>
    <button mat-stroked-button>Message</button>
    <button mat-flat-button color="primary">Follow</button>
  </mat-card-actions>
</mat-card>`,
    },
  ];

  articleCardCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<mat-card appearance="outlined" class="article-card">
  <mat-card-header>
    <div mat-card-avatar class="author-avatar"></div>
    <mat-card-title>Design Systems at Scale</mat-card-title>
    <mat-card-subtitle>
      <mat-icon>schedule</mat-icon>
      5 min read · Dec 3, 2024
    </mat-card-subtitle>
  </mat-card-header>
  <img mat-card-image src="article.jpg" alt="Article" />
  <mat-card-content>
    <p>Article description...</p>
    <mat-chip-set>
      <mat-chip>Design</mat-chip>
      <mat-chip>Systems</mat-chip>
    </mat-chip-set>
  </mat-card-content>
  <mat-card-actions align="end">
    <button mat-icon-button>
      <mat-icon>bookmark_border</mat-icon>
    </button>
    <button mat-icon-button>
      <mat-icon>share</mat-icon>
    </button>
    <button mat-button color="primary">Read More</button>
  </mat-card-actions>
</mat-card>`,
    },
  ];

  statsCardCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<mat-card appearance="filled" class="stats-card">
  <mat-card-content>
    <div class="stats-icon stats-icon--blue">
      <mat-icon>people</mat-icon>
    </div>
    <div class="stats-info">
      <span class="stats-value">12,543</span>
      <span class="stats-label">Total Users</span>
    </div>
    <div class="stats-trend stats-trend--up">
      <mat-icon>trending_up</mat-icon>
      +12.5%
    </div>
  </mat-card-content>
</mat-card>`,
    },
    {
      language: 'scss' as const,
      label: 'SCSS',
      code: `.stats-card {
  mat-card-content {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
}

.stats-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  &--blue {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  }
}

.stats-trend--up {
  color: #22c55e;
}

.stats-trend--down {
  color: #ef4444;
}`,
    },
  ];

  interactiveCardCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<mat-card class="interactive-card" tabindex="0" (click)="onCardClick()">
  <mat-card-content>
    <mat-icon class="feature-icon">folder</mat-icon>
    <h4>Documents</h4>
    <p>23 files</p>
  </mat-card-content>
</mat-card>`,
    },
    {
      language: 'scss' as const,
      label: 'SCSS',
      code: `.interactive-card {
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--ax-shadow-lg);
  }

  &:focus {
    outline: 2px solid var(--ax-brand-default);
    outline-offset: 2px;
  }
}`,
    },
  ];

  mediaCardCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<mat-card class="media-card">
  <div class="media-thumbnail">
    <img src="video-thumbnail.jpg" alt="Video" />
    <div class="media-overlay">
      <button mat-fab color="primary">
        <mat-icon>play_arrow</mat-icon>
      </button>
      <span class="media-duration">12:34</span>
    </div>
  </div>
  <mat-card-content>
    <h3>Video Title</h3>
    <p class="media-meta">
      <span>Channel Name</span>
      <span>•</span>
      <span>125K views</span>
    </p>
  </mat-card-content>
</mat-card>`,
    },
  ];

  horizontalCardCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<mat-card appearance="outlined" class="horizontal-card">
  <div class="horizontal-card__image">
    <img src="image.jpg" alt="Item" />
  </div>
  <div class="horizontal-card__content">
    <mat-card-header>
      <mat-card-title>Premium Workshop</mat-card-title>
      <mat-card-subtitle>Online Course</mat-card-subtitle>
    </mat-card-header>
    <mat-card-content>
      <p>Course description...</p>
    </mat-card-content>
    <mat-card-actions>
      <button mat-flat-button color="primary">Enroll Now</button>
    </mat-card-actions>
  </div>
</mat-card>`,
    },
    {
      language: 'scss' as const,
      label: 'SCSS',
      code: `.horizontal-card {
  display: flex;

  &__image img {
    width: 180px;
    height: 100%;
    object-fit: cover;
  }

  &__content {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
}`,
    },
  ];

  loadingCardCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<!-- Progress bar loading -->
<mat-card class="loading-card">
  <mat-progress-bar mode="indeterminate"></mat-progress-bar>
  <mat-card-content>
    <div class="skeleton skeleton-image"></div>
    <div class="skeleton skeleton-title"></div>
    <div class="skeleton skeleton-text"></div>
  </mat-card-content>
</mat-card>

<!-- Spinner loading -->
<mat-card class="loading-card--spinner">
  <mat-card-content>
    <mat-spinner diameter="40"></mat-spinner>
    <p>Loading content...</p>
  </mat-card-content>
</mat-card>`,
    },
    {
      language: 'scss' as const,
      label: 'SCSS',
      code: `.skeleton {
  background: linear-gradient(
    90deg,
    var(--ax-background-subtle) 25%,
    var(--ax-background-muted) 50%,
    var(--ax-background-subtle) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}`,
    },
  ];

  customStylingCode = [
    {
      language: 'scss' as const,
      label: 'SCSS',
      code: `/* Customize card appearance globally */
:root {
  /* Elevated card */
  --mdc-elevated-card-container-shape: var(--ax-radius-lg);
  --mdc-elevated-card-container-elevation: var(--ax-shadow-md);

  /* Filled card */
  --mdc-filled-card-container-shape: var(--ax-radius-lg);
  --mdc-filled-card-container-color: var(--ax-background-subtle);

  /* Outlined card */
  --mdc-outlined-card-container-shape: var(--ax-radius-lg);
  --mdc-outlined-card-outline-color: var(--ax-border-default);
  --mdc-outlined-card-outline-width: 1px;
}

/* Custom card class */
.custom-card {
  --mdc-elevated-card-container-shape: 16px;
  --mdc-elevated-card-container-elevation:
    0 4px 20px rgba(0, 0, 0, 0.15);
}`,
    },
  ];

  cardTokens: ComponentToken[] = [
    {
      cssVar: '--mdc-elevated-card-container-shape',
      usage: 'Border radius for elevated cards',
      value: 'var(--ax-radius-md)',
      category: 'Shape',
    },
    {
      cssVar: '--mdc-elevated-card-container-elevation',
      usage: 'Box shadow for elevated cards',
      value: 'var(--ax-shadow-sm)',
      category: 'Elevation',
    },
    {
      cssVar: '--mdc-elevated-card-container-color',
      usage: 'Background color for elevated cards',
      value: 'var(--ax-background-default)',
      category: 'Color',
    },
    {
      cssVar: '--mdc-filled-card-container-shape',
      usage: 'Border radius for filled cards',
      value: 'var(--ax-radius-md)',
      category: 'Shape',
    },
    {
      cssVar: '--mdc-filled-card-container-color',
      usage: 'Background color for filled cards',
      value: 'var(--ax-background-subtle)',
      category: 'Color',
    },
    {
      cssVar: '--mdc-outlined-card-container-shape',
      usage: 'Border radius for outlined cards',
      value: 'var(--ax-radius-md)',
      category: 'Shape',
    },
    {
      cssVar: '--mdc-outlined-card-outline-color',
      usage: 'Border color for outlined cards',
      value: 'var(--ax-border-default)',
      category: 'Border',
    },
    {
      cssVar: '--mdc-outlined-card-outline-width',
      usage: 'Border width for outlined cards',
      value: '1px',
      category: 'Border',
    },
  ];
}
