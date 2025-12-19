import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StockLevelDocComponent } from './stock-level-doc.component';

describe('StockLevelDocComponent', () => {
  let component: StockLevelDocComponent;
  let fixture: ComponentFixture<StockLevelDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockLevelDocComponent, BrowserAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(StockLevelDocComponent);
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

    it('should have color schemes code examples', () => {
      expect(component.colorSchemesCode).toBeDefined();
      expect(component.colorSchemesCode.length).toBeGreaterThan(0);
    });

    it('should have sizes code examples', () => {
      expect(component.sizesCode).toBeDefined();
      expect(component.sizesCode.length).toBeGreaterThan(0);
    });

    it('should have warning code examples', () => {
      expect(component.warningCode).toBeDefined();
      expect(component.warningCode.length).toBe(2);
    });

    it('should have label options code examples', () => {
      expect(component.labelOptionsCode).toBeDefined();
      expect(component.labelOptionsCode.length).toBeGreaterThan(0);
    });
  });

  describe('Component Tokens', () => {
    it('should have stock level tokens defined', () => {
      expect(component.stockLevelTokens).toBeDefined();
      expect(component.stockLevelTokens.length).toBeGreaterThan(0);
    });

    it('should have color tokens', () => {
      const colorTokens = component.stockLevelTokens.filter(
        (token) => token.category === 'Colors',
      );
      expect(colorTokens.length).toBeGreaterThan(0);
    });

    it('should have spacing tokens', () => {
      const spacingTokens = component.stockLevelTokens.filter(
        (token) => token.category === 'Spacing',
      );
      expect(spacingTokens.length).toBeGreaterThan(0);
    });

    it('should have border tokens', () => {
      const borderTokens = component.stockLevelTokens.filter(
        (token) => token.category === 'Borders',
      );
      expect(borderTokens.length).toBeGreaterThan(0);
    });

    it('should have required color zone tokens', () => {
      const tokenVars = component.stockLevelTokens.map((t) => t.cssVar);
      expect(tokenVars).toContain('--ax-success-default');
      expect(tokenVars).toContain('--ax-warning-default');
      expect(tokenVars).toContain('--ax-error-default');
    });
  });

  describe('Warning Handler', () => {
    it('should handle warning click event', () => {
      spyOn(window, 'alert');
      spyOn(console, 'log');

      const mockEvent = {
        level: 'low',
        current: 30,
        minimum: 50,
      };

      component.handleWarning(mockEvent);

      expect(console.log).toHaveBeenCalledWith('Warning triggered:', mockEvent);
      expect(window.alert).toHaveBeenCalled();
    });

    it('should log warning details', () => {
      spyOn(console, 'log');

      const mockEvent = {
        level: 'low',
        current: 30,
        minimum: 50,
      };

      component.handleWarning(mockEvent);

      expect(console.log).toHaveBeenCalledWith('Warning triggered:', mockEvent);
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
      expect(docHeader?.getAttribute('title')).toBe('Stock Level');
    });

    it('should have correct icon', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const docHeader = compiled.querySelector('ax-doc-header');
      expect(docHeader?.getAttribute('icon')).toBe('inventory_2');
    });
  });

  describe('Live Preview Components', () => {
    it('should render live preview components', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const livePreviews = compiled.querySelectorAll('ax-live-preview');
      expect(livePreviews.length).toBeGreaterThan(0);
    });

    it('should render stock level components in previews', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const stockLevels = compiled.querySelectorAll('ax-stock-level');
      expect(stockLevels.length).toBeGreaterThan(0);
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
});
