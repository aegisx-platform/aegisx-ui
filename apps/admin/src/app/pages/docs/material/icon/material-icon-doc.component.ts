import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import {
  DocHeaderComponent,
  CodeTabsComponent,
  LivePreviewComponent,
  ComponentTokensComponent,
} from '../../../../components/docs';
import { ComponentToken } from '../../../../types/docs.types';

interface IconCategory {
  name: string;
  icons: string[];
}

@Component({
  selector: 'app-material-icon-doc',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatChipsModule,
    MatDividerModule,
    DocHeaderComponent,
    CodeTabsComponent,
    LivePreviewComponent,
    ComponentTokensComponent,
  ],
  template: `
    <div class="material-icon-doc">
      <ax-doc-header
        title="Icon"
        description="Material Design icons are beautiful, delightful, and easy to use. Over 2,100+ icons available."
        [status]="'stable'"
        [version]="'19.0'"
        [breadcrumbs]="[
          { label: 'Docs', link: '/docs' },
          { label: 'Material', link: '/docs/material/overview' },
        ]"
      >
        <div class="header-links">
          <a
            href="https://fonts.google.com/icons"
            target="_blank"
            rel="noopener"
            class="external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Google Fonts Icons
          </a>
          <a
            href="https://material.angular.io/components/icon/overview"
            target="_blank"
            rel="noopener"
            class="external-link"
          >
            <mat-icon>open_in_new</mat-icon>
            Angular Material Docs
          </a>
        </div>
      </ax-doc-header>

      <mat-tab-group class="doc-tabs" animationDuration="200ms">
        <!-- Icon Gallery Tab -->
        <mat-tab label="Icon Gallery">
          <div class="section">
            <h2 class="section-title">Icon Gallery</h2>
            <p class="section-description">
              Click any icon to copy its name. Use
              <code>&lt;mat-icon&gt;icon_name&lt;/mat-icon&gt;</code> in your
              templates.
            </p>

            <!-- Search & Filter -->
            <div class="search-bar">
              <mat-form-field appearance="outline" class="search-field">
                <mat-label>Search icons</mat-label>
                <mat-icon matPrefix>search</mat-icon>
                <input
                  matInput
                  [ngModel]="searchQuery()"
                  (ngModelChange)="searchQuery.set($event)"
                  placeholder="Type to search..."
                />
                @if (searchQuery()) {
                  <button
                    matSuffix
                    mat-icon-button
                    (click)="searchQuery.set('')"
                  >
                    <mat-icon>close</mat-icon>
                  </button>
                }
              </mat-form-field>
              <div class="icon-count">
                <mat-icon>grid_view</mat-icon>
                {{ totalIconCount() }} icons
              </div>
            </div>

            <!-- Category Chips -->
            <mat-chip-listbox
              class="category-chips"
              [value]="selectedCategory()"
              (change)="selectedCategory.set($event.value)"
            >
              <mat-chip-option value="all">All</mat-chip-option>
              @for (category of iconCategories; track category.name) {
                <mat-chip-option [value]="category.name">{{
                  category.name
                }}</mat-chip-option>
              }
            </mat-chip-listbox>

            <!-- Icon Grid -->
            @for (category of filteredCategories(); track category.name) {
              <div class="icon-category-section">
                <h3 class="category-title">
                  <mat-icon>{{ getCategoryIcon(category.name) }}</mat-icon>
                  {{ category.name }}
                  <span class="icon-count-badge">{{
                    category.icons.length
                  }}</span>
                </h3>
                <div class="icon-grid">
                  @for (icon of category.icons; track icon) {
                    <button
                      class="icon-item"
                      [matTooltip]="icon"
                      matTooltipPosition="above"
                      (click)="copyIconName(icon)"
                    >
                      <mat-icon>{{ icon }}</mat-icon>
                      <span class="icon-name">{{ icon }}</span>
                    </button>
                  }
                </div>
              </div>
            }

            @if (filteredCategories().length === 0) {
              <div class="no-results">
                <mat-icon>search_off</mat-icon>
                <p>No icons found for "{{ searchQuery() }}"</p>
              </div>
            }
          </div>
        </mat-tab>

        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="section">
            <h2 class="section-title">Icon Usage</h2>

            <h3 class="subsection-title">Basic Icons</h3>
            <ax-live-preview title="Common Material icons">
              <div class="icon-row">
                <mat-icon>home</mat-icon>
                <mat-icon>favorite</mat-icon>
                <mat-icon>settings</mat-icon>
                <mat-icon>search</mat-icon>
                <mat-icon>delete</mat-icon>
                <mat-icon>edit</mat-icon>
                <mat-icon>add</mat-icon>
                <mat-icon>close</mat-icon>
              </div>
            </ax-live-preview>

            <h3 class="subsection-title">Icon Sizes</h3>
            <ax-live-preview title="Different icon sizes using CSS classes">
              <div class="icon-row size-demo">
                <div class="size-item">
                  <mat-icon class="icon-xs">star</mat-icon>
                  <span>16px</span>
                </div>
                <div class="size-item">
                  <mat-icon class="icon-sm">star</mat-icon>
                  <span>20px</span>
                </div>
                <div class="size-item">
                  <mat-icon>star</mat-icon>
                  <span>24px (default)</span>
                </div>
                <div class="size-item">
                  <mat-icon class="icon-md">star</mat-icon>
                  <span>32px</span>
                </div>
                <div class="size-item">
                  <mat-icon class="icon-lg">star</mat-icon>
                  <span>40px</span>
                </div>
                <div class="size-item">
                  <mat-icon class="icon-xl">star</mat-icon>
                  <span>48px</span>
                </div>
              </div>
            </ax-live-preview>

            <h3 class="subsection-title">Icon Colors</h3>
            <ax-live-preview
              title="Colored icons using theme colors and custom CSS"
            >
              <div class="icon-row color-demo">
                <div class="color-item">
                  <mat-icon color="primary">check_circle</mat-icon>
                  <span>Primary</span>
                </div>
                <div class="color-item">
                  <mat-icon color="accent">info</mat-icon>
                  <span>Accent</span>
                </div>
                <div class="color-item">
                  <mat-icon color="warn">warning</mat-icon>
                  <span>Warn</span>
                </div>
                <div class="color-item">
                  <mat-icon class="icon-success">verified</mat-icon>
                  <span>Success</span>
                </div>
                <div class="color-item">
                  <mat-icon class="icon-error">error</mat-icon>
                  <span>Error</span>
                </div>
                <div class="color-item">
                  <mat-icon class="icon-info">help</mat-icon>
                  <span>Info</span>
                </div>
              </div>
            </ax-live-preview>

            <h3 class="subsection-title">Icons in Buttons</h3>
            <ax-live-preview title="Icons combined with buttons">
              <div class="button-row">
                <button mat-icon-button>
                  <mat-icon>menu</mat-icon>
                </button>
                <button mat-icon-button color="primary">
                  <mat-icon>favorite</mat-icon>
                </button>
                <button mat-flat-button color="primary">
                  <mat-icon>add</mat-icon>
                  Add Item
                </button>
                <button mat-stroked-button>
                  <mat-icon>download</mat-icon>
                  Download
                </button>
                <button mat-fab color="primary">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-mini-fab color="accent">
                  <mat-icon>add</mat-icon>
                </button>
              </div>
            </ax-live-preview>

            <h3 class="subsection-title">Icon Styles (Filled vs Outlined)</h3>
            <ax-live-preview
              title="Material Symbols support filled, outlined, rounded, and sharp styles"
            >
              <div class="icon-row style-demo">
                <div class="style-group">
                  <span class="style-label">Filled (default)</span>
                  <div class="icon-row">
                    <mat-icon>home</mat-icon>
                    <mat-icon>favorite</mat-icon>
                    <mat-icon>star</mat-icon>
                    <mat-icon>bookmark</mat-icon>
                  </div>
                </div>
                <mat-divider [vertical]="true"></mat-divider>
                <div class="style-group">
                  <span class="style-label">Outlined</span>
                  <div class="icon-row">
                    <mat-icon fontSet="material-icons-outlined">home</mat-icon>
                    <mat-icon fontSet="material-icons-outlined"
                      >favorite</mat-icon
                    >
                    <mat-icon fontSet="material-icons-outlined">star</mat-icon>
                    <mat-icon fontSet="material-icons-outlined"
                      >bookmark</mat-icon
                    >
                  </div>
                </div>
              </div>
            </ax-live-preview>

            <h3 class="subsection-title">Icons with Badges</h3>
            <ax-live-preview title="Icons with notification badges">
              <div class="icon-row badge-demo">
                <div class="icon-with-badge">
                  <mat-icon>notifications</mat-icon>
                  <span class="badge">3</span>
                </div>
                <div class="icon-with-badge">
                  <mat-icon>mail</mat-icon>
                  <span class="badge">12</span>
                </div>
                <div class="icon-with-badge">
                  <mat-icon>shopping_cart</mat-icon>
                  <span class="badge dot"></span>
                </div>
              </div>
            </ax-live-preview>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="section">
            <h2 class="section-title">Code Examples</h2>

            <h3 class="subsection-title">Basic Usage</h3>
            <ax-code-tabs [tabs]="basicUsageCode" />

            <h3 class="subsection-title">Custom Sizing</h3>
            <ax-code-tabs [tabs]="sizingCode" />

            <h3 class="subsection-title">Icon Buttons</h3>
            <ax-code-tabs [tabs]="buttonCode" />

            <h3 class="subsection-title">SVG Icons (Custom)</h3>
            <ax-code-tabs [tabs]="svgIconCode" />
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="section">
            <h2 class="section-title">API Reference</h2>

            <h3 class="subsection-title">MatIcon Properties</h3>
            <mat-card appearance="outlined">
              <mat-card-content>
                <table class="api-table">
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
                      <td><code>fontIcon</code></td>
                      <td><code>string</code></td>
                      <td>-</td>
                      <td>Name of the icon in the icon font</td>
                    </tr>
                    <tr>
                      <td><code>fontSet</code></td>
                      <td><code>string</code></td>
                      <td><code>'material-icons'</code></td>
                      <td>
                        Font set the icon belongs to (e.g.,
                        'material-icons-outlined')
                      </td>
                    </tr>
                    <tr>
                      <td><code>svgIcon</code></td>
                      <td><code>string</code></td>
                      <td>-</td>
                      <td>
                        Name of the SVG icon registered in MatIconRegistry
                      </td>
                    </tr>
                    <tr>
                      <td><code>color</code></td>
                      <td><code>'primary' | 'accent' | 'warn'</code></td>
                      <td>-</td>
                      <td>Theme color palette for the icon</td>
                    </tr>
                    <tr>
                      <td><code>inline</code></td>
                      <td><code>boolean</code></td>
                      <td><code>false</code></td>
                      <td>Whether the icon should be inlined with text</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>

            <h3 class="subsection-title">MatIconRegistry Methods</h3>
            <mat-card appearance="outlined">
              <mat-card-content>
                <table class="api-table">
                  <thead>
                    <tr>
                      <th>Method</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>addSvgIcon(name, url)</code></td>
                      <td>Registers an SVG icon by URL</td>
                    </tr>
                    <tr>
                      <td><code>addSvgIconLiteral(name, literal)</code></td>
                      <td>
                        Registers an SVG icon using the SVG literal content
                      </td>
                    </tr>
                    <tr>
                      <td><code>addSvgIconSet(url)</code></td>
                      <td>Registers an icon set by URL</td>
                    </tr>
                    <tr>
                      <td><code>setDefaultFontSetClass(fontSetClass)</code></td>
                      <td>Sets the CSS class for the default font set</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- CSS Tokens Tab -->
        <mat-tab label="CSS Tokens">
          <div class="section">
            <h2 class="section-title">Design Tokens</h2>
            <ax-component-tokens [tokens]="iconTokens" />
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .material-icon-doc {
        max-width: 1200px;
        margin: 0 auto;
      }

      .header-links {
        display: flex;
        gap: var(--ax-spacing-md);
        margin-top: var(--ax-spacing-md);
      }

      .external-link {
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

      .doc-tabs {
        margin-top: var(--ax-spacing-lg);
      }

      .section {
        padding: var(--ax-spacing-lg);
      }

      .section-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--ax-text-strong);
        margin: 0 0 var(--ax-spacing-sm) 0;
      }

      .section-description {
        color: var(--ax-text-secondary);
        margin-bottom: var(--ax-spacing-lg);

        code {
          background: var(--ax-background-subtle);
          padding: 2px 6px;
          border-radius: var(--ax-radius-sm);
          font-size: 0.875rem;
        }
      }

      .subsection-title {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--ax-text-strong);
        margin: var(--ax-spacing-xl) 0 var(--ax-spacing-md) 0;
      }

      /* Search Bar */
      .search-bar {
        display: flex;
        gap: var(--ax-spacing-md);
        align-items: center;
        margin-bottom: var(--ax-spacing-md);
      }

      .search-field {
        flex: 1;
        max-width: 400px;
      }

      .icon-count {
        display: flex;
        align-items: center;
        gap: var(--ax-spacing-xs);
        font-size: 0.875rem;
        color: var(--ax-text-secondary);

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
        }
      }

      /* Category Chips */
      .category-chips {
        margin-bottom: var(--ax-spacing-lg);
      }

      /* Icon Grid */
      .icon-category-section {
        margin-bottom: var(--ax-spacing-xl);
      }

      .category-title {
        display: flex;
        align-items: center;
        gap: var(--ax-spacing-sm);
        font-size: 1rem;
        font-weight: 600;
        color: var(--ax-text-strong);
        margin: 0 0 var(--ax-spacing-md) 0;
        padding-bottom: var(--ax-spacing-sm);
        border-bottom: 1px solid var(--ax-border-default);

        mat-icon {
          color: var(--ax-brand-default);
        }
      }

      .icon-count-badge {
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--ax-text-subtle);
        background: var(--ax-background-muted);
        padding: 2px 8px;
        border-radius: var(--ax-radius-full);
      }

      .icon-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: var(--ax-spacing-sm);
      }

      .icon-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--ax-spacing-xs);
        padding: var(--ax-spacing-md);
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-md);
        background: var(--ax-background-default);
        cursor: pointer;
        transition: all 0.15s ease;

        &:hover {
          border-color: var(--ax-brand-default);
          background: var(--ax-brand-faint);

          mat-icon {
            color: var(--ax-brand-default);
          }
        }

        &:active {
          transform: scale(0.95);
        }

        mat-icon {
          font-size: 28px;
          width: 28px;
          height: 28px;
          color: var(--ax-text-body);
        }

        .icon-name {
          font-size: 0.6875rem;
          color: var(--ax-text-subtle);
          text-align: center;
          word-break: break-all;
          max-width: 100%;
        }
      }

      .no-results {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--ax-spacing-md);
        padding: var(--ax-spacing-3xl);
        color: var(--ax-text-subtle);

        mat-icon {
          font-size: 48px;
          width: 48px;
          height: 48px;
        }
      }

      /* Icon Rows */
      .icon-row {
        display: flex;
        gap: var(--ax-spacing-lg);
        align-items: center;
        flex-wrap: wrap;

        mat-icon {
          color: var(--ax-text-body);
        }
      }

      /* Size Demo */
      .size-demo {
        gap: var(--ax-spacing-xl);
      }

      .size-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--ax-spacing-xs);

        span {
          font-size: 0.75rem;
          color: var(--ax-text-subtle);
        }
      }

      .icon-xs {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }
      .icon-sm {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
      .icon-md {
        font-size: 32px;
        width: 32px;
        height: 32px;
      }
      .icon-lg {
        font-size: 40px;
        width: 40px;
        height: 40px;
      }
      .icon-xl {
        font-size: 48px;
        width: 48px;
        height: 48px;
      }

      /* Color Demo */
      .color-demo {
        gap: var(--ax-spacing-xl);
      }

      .color-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--ax-spacing-xs);

        span {
          font-size: 0.75rem;
          color: var(--ax-text-subtle);
        }
      }

      .icon-success {
        color: var(--ax-success-default);
      }
      .icon-error {
        color: var(--ax-error-default);
      }
      .icon-info {
        color: var(--ax-info-default);
      }

      /* Button Row */
      .button-row {
        display: flex;
        gap: var(--ax-spacing-md);
        align-items: center;
        flex-wrap: wrap;
      }

      /* Style Demo */
      .style-demo {
        gap: var(--ax-spacing-xl);
        align-items: flex-start;
      }

      .style-group {
        display: flex;
        flex-direction: column;
        gap: var(--ax-spacing-sm);
      }

      .style-label {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--ax-text-subtle);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      /* Badge Demo */
      .badge-demo {
        gap: var(--ax-spacing-xl);
      }

      .icon-with-badge {
        position: relative;
        display: inline-flex;

        mat-icon {
          font-size: 28px;
          width: 28px;
          height: 28px;
        }

        .badge {
          position: absolute;
          top: -4px;
          right: -4px;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          font-size: 0.6875rem;
          font-weight: 600;
          color: white;
          background: var(--ax-error-default);
          border-radius: var(--ax-radius-full);
          display: flex;
          align-items: center;
          justify-content: center;

          &.dot {
            min-width: 10px;
            width: 10px;
            height: 10px;
            padding: 0;
          }
        }
      }

      /* API Table */
      .api-table {
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
          background: var(--ax-background-subtle);
        }

        code {
          background: var(--ax-background-subtle);
          padding: 2px 6px;
          border-radius: var(--ax-radius-sm);
          font-size: 0.8125rem;
        }
      }
    `,
  ],
})
export class MaterialIconDocComponent {
  constructor(private snackBar: MatSnackBar) {}

  searchQuery = signal('');
  selectedCategory = signal<string>('all');

  iconCategories: IconCategory[] = [
    {
      name: 'Action',
      icons: [
        'add',
        'remove',
        'delete',
        'edit',
        'save',
        'close',
        'check',
        'refresh',
        'search',
        'settings',
        'home',
        'menu',
        'more_vert',
        'more_horiz',
        'visibility',
        'visibility_off',
        'lock',
        'lock_open',
        'power_settings_new',
        'print',
        'download',
        'upload',
        'share',
        'copy_all',
        'content_copy',
        'content_paste',
        'undo',
        'redo',
        'filter_list',
        'sort',
        'zoom_in',
        'zoom_out',
        'fullscreen',
        'fullscreen_exit',
        'open_in_new',
        'launch',
        'link',
        'link_off',
      ],
    },
    {
      name: 'Navigation',
      icons: [
        'arrow_back',
        'arrow_forward',
        'arrow_upward',
        'arrow_downward',
        'arrow_drop_down',
        'arrow_drop_up',
        'arrow_left',
        'arrow_right',
        'chevron_left',
        'chevron_right',
        'expand_more',
        'expand_less',
        'first_page',
        'last_page',
        'navigate_before',
        'navigate_next',
        'menu',
        'menu_open',
        'apps',
        'dashboard',
        'view_list',
        'view_module',
        'view_quilt',
        'grid_view',
        'list',
        'table_rows',
        'view_agenda',
      ],
    },
    {
      name: 'Status & Feedback',
      icons: [
        'check_circle',
        'cancel',
        'error',
        'warning',
        'info',
        'help',
        'help_outline',
        'report',
        'report_problem',
        'notification_important',
        'done',
        'done_all',
        'priority_high',
        'pending',
        'hourglass_empty',
        'hourglass_full',
        'sync',
        'sync_problem',
        'cached',
        'autorenew',
        'verified',
        'verified_user',
        'gpp_good',
        'gpp_bad',
        'security',
      ],
    },
    {
      name: 'Communication',
      icons: [
        'mail',
        'inbox',
        'send',
        'reply',
        'forward',
        'drafts',
        'mark_email_read',
        'mark_email_unread',
        'attach_file',
        'attachment',
        'notifications',
        'notifications_active',
        'notifications_off',
        'chat',
        'chat_bubble',
        'forum',
        'comment',
        'message',
        'sms',
        'call',
        'phone',
        'video_call',
        'voicemail',
        'contacts',
        'contact_mail',
        'contact_phone',
      ],
    },
    {
      name: 'Content',
      icons: [
        'add_circle',
        'remove_circle',
        'add_box',
        'create',
        'mode_edit',
        'delete_forever',
        'archive',
        'unarchive',
        'inventory',
        'inventory_2',
        'folder',
        'folder_open',
        'folder_shared',
        'create_new_folder',
        'file_copy',
        'file_present',
        'description',
        'article',
        'note_add',
        'text_snippet',
        'picture_as_pdf',
        'image',
        'photo_library',
        'video_library',
      ],
    },
    {
      name: 'Social',
      icons: [
        'person',
        'person_add',
        'person_remove',
        'people',
        'groups',
        'group_add',
        'supervisor_account',
        'manage_accounts',
        'account_circle',
        'face',
        'sentiment_satisfied',
        'sentiment_dissatisfied',
        'mood',
        'mood_bad',
        'thumb_up',
        'thumb_down',
        'favorite',
        'favorite_border',
        'star',
        'star_border',
        'star_half',
        'bookmark',
        'bookmark_border',
        'share',
      ],
    },
    {
      name: 'Business',
      icons: [
        'business',
        'business_center',
        'work',
        'work_outline',
        'apartment',
        'store',
        'storefront',
        'shopping_cart',
        'shopping_bag',
        'receipt',
        'receipt_long',
        'payments',
        'credit_card',
        'account_balance',
        'account_balance_wallet',
        'attach_money',
        'money',
        'euro',
        'trending_up',
        'trending_down',
        'trending_flat',
        'analytics',
        'insights',
        'assessment',
      ],
    },
    {
      name: 'Date & Time',
      icons: [
        'schedule',
        'access_time',
        'timer',
        'timer_off',
        'alarm',
        'alarm_add',
        'alarm_off',
        'snooze',
        'event',
        'event_available',
        'event_busy',
        'event_note',
        'calendar_today',
        'calendar_month',
        'date_range',
        'today',
        'update',
        'history',
        'watch_later',
        'more_time',
      ],
    },
    {
      name: 'Medical & Health',
      icons: [
        'local_hospital',
        'medical_services',
        'medication',
        'vaccines',
        'healing',
        'health_and_safety',
        'coronavirus',
        'masks',
        'bloodtype',
        'monitor_heart',
        'favorite',
        'sick',
        'elderly',
        'wheelchair_pickup',
        'emergency',
        'local_pharmacy',
        'biotech',
        'science',
      ],
    },
    {
      name: 'Maps & Location',
      icons: [
        'location_on',
        'location_off',
        'my_location',
        'near_me',
        'place',
        'pin_drop',
        'room',
        'map',
        'layers',
        'terrain',
        'navigation',
        'directions',
        'directions_car',
        'local_shipping',
        'flight',
        'train',
        'subway',
        'home',
        'hotel',
        'restaurant',
        'local_cafe',
      ],
    },
    {
      name: 'Device & Hardware',
      icons: [
        'devices',
        'computer',
        'desktop_windows',
        'laptop',
        'tablet',
        'smartphone',
        'phone_android',
        'phone_iphone',
        'watch',
        'tv',
        'keyboard',
        'mouse',
        'headphones',
        'speaker',
        'router',
        'usb',
        'bluetooth',
        'wifi',
        'signal_wifi_4_bar',
        'battery_full',
        'battery_charging_full',
      ],
    },
    {
      name: 'File & Document',
      icons: [
        'insert_drive_file',
        'file_present',
        'description',
        'article',
        'picture_as_pdf',
        'text_snippet',
        'folder',
        'folder_open',
        'folder_shared',
        'cloud',
        'cloud_upload',
        'cloud_download',
        'cloud_done',
        'backup',
        'save',
        'save_alt',
        'file_download',
        'file_upload',
        'import_export',
      ],
    },
  ];

  totalIconCount = computed(() => {
    return this.iconCategories.reduce((sum, cat) => sum + cat.icons.length, 0);
  });

  filteredCategories = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const category = this.selectedCategory();

    let categories = this.iconCategories;

    // Filter by category
    if (category !== 'all') {
      categories = categories.filter((c) => c.name === category);
    }

    // Filter by search query
    if (query) {
      categories = categories
        .map((c) => ({
          ...c,
          icons: c.icons.filter((icon) => icon.includes(query)),
        }))
        .filter((c) => c.icons.length > 0);
    }

    return categories;
  });

  getCategoryIcon(name: string): string {
    const iconMap: Record<string, string> = {
      Action: 'touch_app',
      Navigation: 'explore',
      'Status & Feedback': 'feedback',
      Communication: 'forum',
      Content: 'content_copy',
      Social: 'people',
      Business: 'business',
      'Date & Time': 'schedule',
      'Medical & Health': 'medical_services',
      'Maps & Location': 'place',
      'Device & Hardware': 'devices',
      'File & Document': 'folder',
    };
    return iconMap[name] || 'category';
  }

  copyIconName(iconName: string): void {
    navigator.clipboard.writeText(iconName).then(() => {
      this.snackBar.open(`Copied "${iconName}" to clipboard`, 'OK', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
    });
  }

  basicUsageCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<!-- Basic Icon (using icon name as content) -->
<mat-icon>home</mat-icon>
<mat-icon>favorite</mat-icon>
<mat-icon>settings</mat-icon>

<!-- Using fontIcon attribute -->
<mat-icon fontIcon="search"></mat-icon>

<!-- Themed Colors -->
<mat-icon color="primary">check_circle</mat-icon>
<mat-icon color="accent">info</mat-icon>
<mat-icon color="warn">warning</mat-icon>

<!-- Custom CSS Colors -->
<mat-icon class="success-icon">verified</mat-icon>
<mat-icon style="color: #e91e63;">favorite</mat-icon>`,
    },
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [MatIconModule],
  template: \`<mat-icon>home</mat-icon>\`
})
export class MyComponent {}`,
    },
  ];

  sizingCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<!-- Using inline styles -->
<mat-icon style="font-size: 16px; width: 16px; height: 16px;">star</mat-icon>
<mat-icon style="font-size: 32px; width: 32px; height: 32px;">star</mat-icon>
<mat-icon style="font-size: 48px; width: 48px; height: 48px;">star</mat-icon>

<!-- Using CSS classes (recommended) -->
<mat-icon class="icon-sm">star</mat-icon>
<mat-icon class="icon-lg">star</mat-icon>
<mat-icon class="icon-xl">star</mat-icon>`,
    },
    {
      language: 'scss' as const,
      label: 'CSS',
      code: `/* Define reusable size classes */
.icon-xs { font-size: 16px; width: 16px; height: 16px; }
.icon-sm { font-size: 20px; width: 20px; height: 20px; }
.icon-md { font-size: 32px; width: 32px; height: 32px; }
.icon-lg { font-size: 40px; width: 40px; height: 40px; }
.icon-xl { font-size: 48px; width: 48px; height: 48px; }`,
    },
  ];

  buttonCode = [
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<!-- Icon Button -->
<button mat-icon-button>
  <mat-icon>menu</mat-icon>
</button>

<!-- Button with Icon and Text -->
<button mat-flat-button color="primary">
  <mat-icon>add</mat-icon>
  Add Item
</button>

<button mat-stroked-button>
  <mat-icon>download</mat-icon>
  Download
</button>

<!-- FAB Buttons -->
<button mat-fab color="primary">
  <mat-icon>edit</mat-icon>
</button>

<button mat-mini-fab color="accent">
  <mat-icon>add</mat-icon>
</button>`,
    },
  ];

  svgIconCode = [
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({...})
export class MyComponent {
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    // Register SVG icon from URL
    this.iconRegistry.addSvgIcon(
      'custom_icon',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/custom.svg')
    );

    // Register SVG icon from literal
    this.iconRegistry.addSvgIconLiteral(
      'inline_icon',
      this.sanitizer.bypassSecurityTrustHtml('<svg>...</svg>')
    );
  }
}`,
    },
    {
      language: 'html' as const,
      label: 'HTML',
      code: `<!-- Use registered SVG icon -->
<mat-icon svgIcon="custom_icon"></mat-icon>
<mat-icon svgIcon="inline_icon"></mat-icon>`,
    },
  ];

  iconTokens: ComponentToken[] = [
    {
      cssVar: '--mat-icon-color',
      usage: 'Default icon color',
      value: 'var(--ax-text-body)',
      category: 'Colors',
    },
    {
      cssVar: '--mdc-icon-button-icon-size',
      usage: 'Icon button icon size',
      value: '24px',
      category: 'Size',
    },
    {
      cssVar: '--mdc-icon-button-state-layer-color',
      usage: 'Icon button ripple color',
      value: 'var(--ax-text-body)',
      category: 'State',
    },
    {
      cssVar: '--mdc-icon-button-icon-color',
      usage: 'Icon button icon color',
      value: 'inherit',
      category: 'Colors',
    },
    {
      cssVar: '--mdc-icon-button-disabled-icon-color',
      usage: 'Disabled icon button color',
      value: 'var(--ax-text-disabled)',
      category: 'State',
    },
  ];
}
