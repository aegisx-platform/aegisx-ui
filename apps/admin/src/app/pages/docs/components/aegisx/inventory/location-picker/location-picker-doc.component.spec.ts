import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationPickerDocComponent } from './location-picker-doc.component';

describe('LocationPickerDocComponent', () => {
  let component: LocationPickerDocComponent;
  let fixture: ComponentFixture<LocationPickerDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationPickerDocComponent, BrowserAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LocationPickerDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Code Examples', () => {
    it('should have basic usage code examples', () => {
      expect(component.basicUsageCode).toBeDefined();
      expect(component.basicUsageCode.length).toBe(2);
      expect(component.basicUsageCode[0].label).toBe('HTML');
      expect(component.basicUsageCode[1].label).toBe('TypeScript');
    });

    it('should have tree navigation code examples', () => {
      expect(component.treeNavigationCode).toBeDefined();
      expect(component.treeNavigationCode.length).toBeGreaterThan(0);
    });

    it('should have search code examples', () => {
      expect(component.searchCode).toBeDefined();
      expect(component.searchCode.length).toBeGreaterThan(0);
    });

    it('should have recent favorites code examples', () => {
      expect(component.recentFavoritesCode).toBeDefined();
      expect(component.recentFavoritesCode.length).toBe(2);
    });

    it('should have selection modes code examples', () => {
      expect(component.selectionModesCode).toBeDefined();
      expect(component.selectionModesCode.length).toBe(2);
    });
  });

  describe('Component Tokens', () => {
    it('should have location picker tokens defined', () => {
      expect(component.locationPickerTokens).toBeDefined();
      expect(component.locationPickerTokens.length).toBeGreaterThan(0);
    });

    it('should have color tokens', () => {
      const colorTokens = component.locationPickerTokens.filter(
        (token) => token.category === 'Colors',
      );
      expect(colorTokens.length).toBeGreaterThan(0);
    });

    it('should have spacing tokens', () => {
      const spacingTokens = component.locationPickerTokens.filter(
        (token) => token.category === 'Spacing',
      );
      expect(spacingTokens.length).toBeGreaterThan(0);
    });

    it('should have border tokens', () => {
      const borderTokens = component.locationPickerTokens.filter(
        (token) => token.category === 'Borders',
      );
      expect(borderTokens.length).toBeGreaterThan(0);
    });

    it('should have required status color tokens', () => {
      const tokenVars = component.locationPickerTokens.map((t) => t.cssVar);
      expect(tokenVars).toContain('--ax-success-default');
      expect(tokenVars).toContain('--ax-warning-default');
      expect(tokenVars).toContain('--ax-error-default');
    });

    it('should have primary color token for favorites', () => {
      const tokenVars = component.locationPickerTokens.map((t) => t.cssVar);
      expect(tokenVars).toContain('--ax-primary-default');
    });
  });

  describe('Sample Location Data', () => {
    it('should have basic locations data', () => {
      expect(component.basicLocations).toBeDefined();
      expect(component.basicLocations.length).toBeGreaterThan(0);
    });

    it('should have warehouse locations data', () => {
      expect(component.warehouseLocations).toBeDefined();
      expect(component.warehouseLocations.length).toBeGreaterThan(0);
    });

    it('should have hierarchical structure in warehouse locations', () => {
      const warehouse = component.warehouseLocations[0];
      expect(warehouse.children).toBeDefined();
      expect(warehouse.children!.length).toBeGreaterThan(0);
    });

    it('should have location nodes with required properties', () => {
      const warehouse = component.basicLocations[0];
      expect(warehouse.id).toBeDefined();
      expect(warehouse.code).toBeDefined();
      expect(warehouse.name).toBeDefined();
      expect(warehouse.type).toBeDefined();
    });

    it('should have capacity information in locations', () => {
      const warehouse = component.warehouseLocations[0];
      expect(warehouse.stockCount).toBeDefined();
      expect(warehouse.capacity).toBeDefined();
      expect(warehouse.utilization).toBeDefined();
    });

    it('should have proper parent-child relationships', () => {
      const warehouse = component.warehouseLocations[0];
      const zone = warehouse.children![0];
      expect(zone.parentId).toBe(warehouse.id);
    });

    it('should have bin-level locations in deep hierarchy', () => {
      const warehouse = component.warehouseLocations[0];
      const zone = warehouse.children![0];
      const aisle = zone.children![0];
      const shelf = aisle.children![0];
      const bins = shelf.children;

      expect(bins).toBeDefined();
      expect(bins!.length).toBeGreaterThan(0);
      expect(bins![0].type).toBe('bin');
    });
  });

  describe('Location Selection Handler', () => {
    it('should handle location select event', () => {
      spyOn(console, 'log');

      const mockSelection = {
        location: component.basicLocations[0],
        path: [component.basicLocations[0]],
        pathString: 'WH-001',
      };

      component.handleLocationSelect(mockSelection);

      expect(console.log).toHaveBeenCalledWith(
        'Location selected:',
        mockSelection,
      );
    });

    it('should log selection details', () => {
      spyOn(console, 'log');

      const mockSelection = {
        location: { id: 'TEST', code: 'TEST', name: 'Test Location' },
        path: [],
        pathString: 'WH-001 > ZONE-A > TEST',
      };

      component.handleLocationSelect(mockSelection);

      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('Tab Content', () => {
    it('should render all tab groups', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const tabGroup = compiled.querySelector('mat-tab-group');
      expect(tabGroup).toBeTruthy();
    });

    it('should have Overview tab', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const tabs = compiled.querySelectorAll('mat-tab');
      const overviewTab = Array.from(tabs).find((tab) =>
        tab.textContent?.includes('Overview'),
      );
      expect(overviewTab).toBeTruthy();
    });

    it('should have Examples tab', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const tabs = compiled.querySelectorAll('mat-tab');
      const examplesTab = Array.from(tabs).find((tab) =>
        tab.textContent?.includes('Examples'),
      );
      expect(examplesTab).toBeTruthy();
    });

    it('should have API tab', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const tabs = compiled.querySelectorAll('mat-tab');
      const apiTab = Array.from(tabs).find((tab) =>
        tab.textContent?.includes('API'),
      );
      expect(apiTab).toBeTruthy();
    });

    it('should have Tokens tab', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const tabs = compiled.querySelectorAll('mat-tab');
      const tokensTab = Array.from(tabs).find((tab) =>
        tab.textContent?.includes('Tokens'),
      );
      expect(tokensTab).toBeTruthy();
    });

    it('should have Guidelines tab', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const tabs = compiled.querySelectorAll('mat-tab');
      const guidelinesTab = Array.from(tabs).find((tab) =>
        tab.textContent?.includes('Guidelines'),
      );
      expect(guidelinesTab).toBeTruthy();
    });
  });

  describe('Documentation Header', () => {
    it('should render doc header component', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const docHeader = compiled.querySelector('ax-doc-header');
      expect(docHeader).toBeTruthy();
    });

    it('should have correct title', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const docHeader = compiled.querySelector('ax-doc-header');
      expect(docHeader?.getAttribute('title')).toBe('Location Picker');
    });

    it('should have correct icon', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const docHeader = compiled.querySelector('ax-doc-header');
      expect(docHeader?.getAttribute('icon')).toBe('warehouse');
    });
  });

  describe('Live Preview Components', () => {
    it('should render live preview components', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const livePreviews = compiled.querySelectorAll('ax-live-preview');
      expect(livePreviews.length).toBeGreaterThan(0);
    });

    it('should render location picker components in previews', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const locationPickers = compiled.querySelectorAll('ax-location-picker');
      expect(locationPickers.length).toBeGreaterThan(0);
    });
  });

  describe('Code Tabs', () => {
    it('should render code tabs components', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const codeTabs = compiled.querySelectorAll('ax-code-tabs');
      expect(codeTabs.length).toBeGreaterThan(0);
    });
  });

  describe('Component Token Display', () => {
    it('should render component tokens component', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const componentTokens = compiled.querySelector('ax-component-tokens');
      expect(componentTokens).toBeTruthy();
    });
  });

  describe('Keyboard Shortcuts Section', () => {
    it('should document keyboard navigation shortcuts', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const shortcuts = compiled.querySelector(
        '.location-picker-doc__keyboard-shortcuts',
      );
      expect(shortcuts).toBeTruthy();
    });

    it('should have keyboard shortcut items', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const shortcutItems = compiled.querySelectorAll('.shortcut-item');
      expect(shortcutItems.length).toBeGreaterThan(0);
    });
  });

  describe('API Documentation', () => {
    it('should render API tables', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const apiTables = compiled.querySelectorAll(
        '.location-picker-doc__api-table',
      );
      expect(apiTables.length).toBeGreaterThan(0);
    });

    it('should document type definitions', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const typeDefinitions = compiled.querySelectorAll('pre code');
      expect(typeDefinitions.length).toBeGreaterThan(0);
    });
  });

  describe('Guidelines Section', () => {
    it('should render do and dont guidelines', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const guidelines = compiled.querySelector(
        '.location-picker-doc__guidelines',
      );
      expect(guidelines).toBeTruthy();
    });

    it('should have accessibility list', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const a11yList = compiled.querySelector(
        '.location-picker-doc__a11y-list',
      );
      expect(a11yList).toBeTruthy();
    });

    it('should have best practices list', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const bestPractices = compiled.querySelector(
        '.location-picker-doc__best-practices',
      );
      expect(bestPractices).toBeTruthy();
    });

    it('should have use cases list', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const useCases = compiled.querySelector(
        '.location-picker-doc__use-cases',
      );
      expect(useCases).toBeTruthy();
    });
  });
});
