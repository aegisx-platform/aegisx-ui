import { Component, Input, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';

import { ShowcaseDataService, ComponentExample } from '../services/showcase-data.service';
import { CodeViewerComponent } from '../shared/code-viewer.component';
import { ComponentPreviewComponent } from '../shared/component-preview.component';

// Import AegisX UI components to demonstrate
import { AegisxUiModule } from '@aegisx/ui';

interface AegisxSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  components: ComponentExample[];
  expanded?: boolean;
}

@Component({
  selector: 'app-aegisx-ui-section',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    MatExpansionModule,
    CodeViewerComponent,
    ComponentPreviewComponent,
    AegisxUiModule,
  ],
  template: `
    <div class="aegisx-ui-section">
      <div class="section-header">
        <div class="header-content">
          <mat-icon class="section-icon">architecture</mat-icon>
          <div class="section-info">
            <h2>AegisX UI Components</h2>
            <p>Custom component library built for enterprise applications</p>
          </div>
        </div>
        <div class="section-stats">
          <div class="stat">
            <span class="stat-number">{{ totalComponents() }}</span>
            <span class="stat-label">Components</span>
          </div>
          <div class="stat">
            <span class="stat-number">{{ filteredComponents().length }}</span>
            <span class="stat-label">Matches</span>
          </div>
        </div>
      </div>

      <!-- Search Results -->
      <div *ngIf="searchQuery && filteredComponents().length > 0" class="search-results">
        <h3 class="search-title">
          <mat-icon>search</mat-icon>
          Found {{ filteredComponents().length }} AegisX UI components
        </h3>
        
        <div class="component-grid">
          <mat-card *ngFor="let component of filteredComponents()" class="component-card search-result">
            <mat-card-header>
              <mat-icon mat-card-avatar class="component-avatar">{{ getComponentIcon(component.id) }}</mat-icon>
              <mat-card-title>{{ component.name }}</mat-card-title>
              <mat-card-subtitle>{{ component.source }}</mat-card-subtitle>
            </mat-card-header>
            
            <mat-card-content>
              <p>{{ component.description }}</p>
              
              <!-- Live Preview -->
              <div class="component-preview-container">
                <app-component-preview 
                  [componentId]="component.id" 
                  [responsive]="component.responsive || false">
                  <ng-container [ngSwitch]="component.id">
                    <!-- Layout Components Demos -->
                    <div *ngSwitchCase="'aegisx-classic-layout'" class="layout-demo">
                      <div class="layout-preview classic">
                        <div class="header">Header</div>
                        <div class="sidebar">Sidebar</div>
                        <div class="content">Main Content</div>
                        <div class="footer">Footer</div>
                      </div>
                    </div>

                    <div *ngSwitchCase="'aegisx-compact-layout'" class="layout-demo">
                      <div class="layout-preview compact">
                        <div class="toolbar">Compact Toolbar</div>
                        <div class="main">Content Area</div>
                      </div>
                    </div>

                    <!-- Navigation Components -->
                    <div *ngSwitchCase="'aegisx-nav-menu'" class="nav-demo">
                      <!-- You would use actual AegisX nav component here -->
                      <div class="nav-preview">
                        <div class="nav-item active">
                          <mat-icon>dashboard</mat-icon>
                          Dashboard
                        </div>
                        <div class="nav-item">
                          <mat-icon>people</mat-icon>
                          Users
                        </div>
                        <div class="nav-item">
                          <mat-icon>settings</mat-icon>
                          Settings
                        </div>
                      </div>
                    </div>

                    <!-- Card Component -->
                    <div *ngSwitchCase="'aegisx-card'" class="card-demo">
                      <!-- Enhanced card with AegisX styling -->
                      <div class="aegisx-card-preview">
                        <div class="card-header">
                          <mat-icon>star</mat-icon>
                          <span>Enhanced Card</span>
                        </div>
                        <div class="card-body">
                          Custom styled card with additional features
                        </div>
                        <div class="card-actions">
                          <button mat-button color="primary">Action</button>
                        </div>
                      </div>
                    </div>

                    <!-- Alert Component -->
                    <div *ngSwitchCase="'aegisx-alert'" class="alert-demo">
                      <div class="alert-preview success">
                        <mat-icon>check_circle</mat-icon>
                        <span>Success: Operation completed!</span>
                      </div>
                    </div>

                    <!-- Loading Component -->
                    <div *ngSwitchCase="'aegisx-loading'" class="loading-demo">
                      <div class="loading-preview">
                        <div class="loading-spinner"></div>
                        <span>Loading content...</span>
                      </div>
                    </div>

                    <!-- Default preview -->
                    <div *ngSwitchDefault class="default-preview">
                      <mat-icon class="preview-icon">{{ getComponentIcon(component.id) }}</mat-icon>
                      <h4>{{ component.name }}</h4>
                      <p>Interactive preview coming soon</p>
                    </div>
                  </ng-container>
                </app-component-preview>
              </div>
              
              <!-- Component Tags -->
              <div class="component-tags">
                <mat-chip *ngFor="let tag of component.tags" class="tag-chip">
                  {{ tag }}
                </mat-chip>
              </div>

              <!-- Features -->
              <div class="component-features">
                <mat-chip 
                  [color]="getComplexityColor(component.complexity)"
                  class="complexity-chip">
                  {{ component.complexity }} complexity
                </mat-chip>
                
                <mat-chip *ngIf="component.responsive" class="feature-chip">
                  <mat-icon>phone_android</mat-icon>
                  Responsive
                </mat-chip>
                
                <mat-chip *ngIf="component.accessibility" class="feature-chip">
                  <mat-icon>accessibility</mat-icon>
                  Accessible
                </mat-chip>
              </div>
            </mat-card-content>
            
            <mat-card-actions>
              <button mat-button (click)="viewComponentDocs(component)">
                <mat-icon>help</mat-icon>
                Documentation
              </button>
              <button mat-button (click)="showCode(component)">
                <mat-icon>code</mat-icon>
                Usage
              </button>
              <button mat-button (click)="openInStackBlitz(component)">
                <mat-icon>launch</mat-icon>
                Try Online
              </button>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>

      <!-- Organized Sections -->
      <div *ngIf="!searchQuery" class="organized-sections">
        <mat-accordion class="sections-accordion" multi>
          <mat-expansion-panel 
            *ngFor="let section of aegisxSections()" 
            [expanded]="section.expanded"
            class="section-panel">
            
            <mat-expansion-panel-header>
              <mat-panel-title>
                <mat-icon>{{ section.icon }}</mat-icon>
                {{ section.title }}
                <mat-chip class="count-chip">{{ section.components.length }}</mat-chip>
              </mat-panel-title>
              <mat-panel-description>
                {{ section.description }}
              </mat-panel-description>
            </mat-expansion-panel-header>

            <div class="section-content">
              <!-- Section Introduction -->
              <div class="section-intro">
                <p>{{ getSectionIntroduction(section.id) }}</p>
              </div>

              <!-- Components Grid -->
              <div class="component-grid">
                <mat-card *ngFor="let component of section.components" class="component-card">
                  <mat-card-header>
                    <mat-icon mat-card-avatar class="component-avatar">{{ getComponentIcon(component.id) }}</mat-icon>
                    <mat-card-title>{{ component.name }}</mat-card-title>
                    <mat-card-subtitle>{{ component.category }}</mat-card-subtitle>
                  </mat-card-header>
                  
                  <mat-card-content>
                    <p>{{ component.description }}</p>
                    
                    <!-- Interactive Preview -->
                    <div class="component-preview-container">
                      <!-- Same switch logic as above for consistency -->
                      <app-component-preview 
                        [componentId]="component.id" 
                        [responsive]="component.responsive || false">
                        <!-- Component demo content would go here -->
                        <!-- This would be the same as the search results section -->
                      </app-component-preview>
                    </div>
                    
                    <!-- Tags and Features -->
                    <div class="component-tags">
                      <mat-chip *ngFor="let tag of component.tags" class="tag-chip">
                        {{ tag }}
                      </mat-chip>
                    </div>
                  </mat-card-content>
                  
                  <mat-card-actions>
                    <button mat-button (click)="viewComponentDocs(component)">
                      <mat-icon>description</mat-icon>
                      Docs
                    </button>
                    <button mat-button (click)="showCode(component)">
                      <mat-icon>code</mat-icon>
                      Code
                    </button>
                    <button mat-button color="primary" (click)="tryComponent(component)">
                      <mat-icon>play_arrow</mat-icon>
                      Try It
                    </button>
                  </mat-card-actions>
                </mat-card>
              </div>
            </div>
          </mat-expansion-panel>
        </mat-accordion>
      </div>

      <!-- No Results -->
      <div *ngIf="searchQuery && filteredComponents().length === 0" class="no-results">
        <mat-icon>search_off</mat-icon>
        <h3>No AegisX UI components found</h3>
        <p>Try searching with different keywords or browse all components.</p>
        <button mat-raised-button color="primary" (click)="clearSearch()">
          Browse All Components
        </button>
      </div>

      <!-- Getting Started Guide -->
      <div class="getting-started" *ngIf="!searchQuery">
        <mat-card class="guide-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>school</mat-icon>
            <mat-card-title>Getting Started with AegisX UI</mat-card-title>
            <mat-card-subtitle>Installation and basic usage</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <div class="installation-steps">
              <h4>Installation</h4>
              <app-code-viewer 
                [code]="installationCode" 
                language="bash" 
                title="Install AegisX UI">
              </app-code-viewer>
              
              <h4>Basic Usage</h4>
              <app-code-viewer 
                [code]="usageCode" 
                language="typescript" 
                title="Import and Use Components">
              </app-code-viewer>
            </div>
          </mat-card-content>
          
          <mat-card-actions>
            <button mat-button color="primary">
              <mat-icon>link</mat-icon>
              Full Documentation
            </button>
            <button mat-button>
              <mat-icon>code</mat-icon>
              GitHub Repository
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styleUrls: ['./aegisx-ui-section.component.scss']
})
export class AegisxUiSectionComponent implements OnInit {
  @Input() searchQuery: string = '';
  @Input() theme: 'light' | 'dark' = 'light';

  private showcaseDataService = inject(ShowcaseDataService);

  // Signals
  components = signal<ComponentExample[]>([]);
  loading = signal(false);

  // Computed properties
  filteredComponents = computed(() => {
    if (!this.searchQuery) return [];
    
    return this.components().filter(component =>
      component.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      component.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      component.tags.some(tag => tag.toLowerCase().includes(this.searchQuery.toLowerCase()))
    );
  });

  totalComponents = computed(() => this.components().length);

  aegisxSections = computed(() => {
    const componentsByCategory = this.groupComponentsByCategory();
    
    const sections: AegisxSection[] = [
      {
        id: 'layout-components',
        title: 'Layout Components',
        description: 'Structural components for organizing application layouts',
        icon: 'view_quilt',
        components: componentsByCategory['Layout Components'] || [],
        expanded: true
      },
      {
        id: 'navigation-components',
        title: 'Navigation Components',
        description: 'Enhanced navigation and menu components',
        icon: 'navigation',
        components: componentsByCategory['Navigation Components'] || []
      },
      {
        id: 'content-components',
        title: 'Content Components',
        description: 'Cards, alerts, and content display components',
        icon: 'article',
        components: componentsByCategory['Content Components'] || []
      },
      {
        id: 'interactive-components',
        title: 'Interactive Components',
        description: 'User interaction and feedback components',
        icon: 'touch_app',
        components: componentsByCategory['Interactive Components'] || []
      }
    ];

    return sections.filter(section => section.components.length > 0);
  });

  // Code examples for getting started
  installationCode = \`npm install @aegisx/ui

# or with yarn
yarn add @aegisx/ui\`;

  usageCode = \`import { AegisxUiModule } from '@aegisx/ui';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \\\`
    <aegisx-classic-layout>
      <aegisx-nav-menu [items]="menuItems"></aegisx-nav-menu>
      <router-outlet></router-outlet>
    </aegisx-classic-layout>
  \\\`,
  imports: [AegisxUiModule]
})
export class AppComponent {
  menuItems = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Users', icon: 'people', route: '/users' }
  ];
}\`;

  ngOnInit() {
    this.loadAegisxComponents();
  }

  private async loadAegisxComponents() {
    this.loading.set(true);
    
    try {
      await this.showcaseDataService.loadComponentData();
      const aegisxData = this.showcaseDataService.getCategoryData('aegisx');
      
      if (aegisxData) {
        this.components.set(aegisxData.components);
      }
    } catch (error) {
      console.error('Failed to load AegisX UI components:', error);
    } finally {
      this.loading.set(false);
    }
  }

  private groupComponentsByCategory(): Record<string, ComponentExample[]> {
    const grouped: Record<string, ComponentExample[]> = {};
    
    for (const component of this.components()) {
      if (!grouped[component.category]) {
        grouped[component.category] = [];
      }
      grouped[component.category].push(component);
    }
    
    return grouped;
  }

  getSectionIntroduction(sectionId: string): string {
    const introductions = {
      'layout-components': 'Powerful layout components that provide the structural foundation for enterprise applications with flexible configuration options.',
      'navigation-components': 'Advanced navigation components with multi-level support, icons, badges, and responsive behavior.',
      'content-components': 'Enhanced content display components with custom styling and additional features beyond standard Material Design.',
      'interactive-components': 'Specialized components for user interactions, loading states, and feedback mechanisms.'
    };
    
    return introductions[sectionId as keyof typeof introductions] || '';
  }

  getComponentIcon(componentId: string): string {
    const iconMap: Record<string, string> = {
      'aegisx-classic-layout': 'view_quilt',
      'aegisx-compact-layout': 'view_compact',
      'aegisx-enterprise-layout': 'business',
      'aegisx-nav-menu': 'menu',
      'aegisx-breadcrumb': 'arrow_right',
      'aegisx-card': 'crop_portrait',
      'aegisx-alert': 'notification_important',
      'aegisx-drawer': 'menu_open',
      'aegisx-loading': 'hourglass_empty',
      'aegisx-user-menu': 'account_circle',
      'aegisx-fullscreen': 'fullscreen'
    };
    
    return iconMap[componentId] || 'widgets';
  }

  getComplexityColor(complexity: 'low' | 'medium' | 'high'): 'primary' | 'accent' | 'warn' {
    switch (complexity) {
      case 'low': return 'primary';
      case 'medium': return 'accent';
      case 'high': return 'warn';
    }
  }

  // Event handlers
  viewComponentDocs(component: ComponentExample) {
    // Open documentation for the component
    console.log('Opening docs for:', component.name);
  }

  showCode(component: ComponentExample) {
    // Show code example in dialog or expand section
    console.log('Showing code for:', component.name);
  }

  tryComponent(component: ComponentExample) {
    // Open interactive playground or demo
    console.log('Trying component:', component.name);
  }

  openInStackBlitz(component: ComponentExample) {
    // Open component example in StackBlitz
    console.log('Opening in StackBlitz:', component.name);
  }

  clearSearch() {
    // Emit event to parent to clear search
    console.log('Clear search requested');
  }
}