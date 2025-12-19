import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { VariantSelectorDocComponent } from './variant-selector-doc.component';

describe('VariantSelectorDocComponent', () => {
  let component: VariantSelectorDocComponent;
  let fixture: ComponentFixture<VariantSelectorDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VariantSelectorDocComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(VariantSelectorDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Rendering', () => {
    it('should render doc header with correct title', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const header = compiled.querySelector('ax-doc-header');
      expect(header).toBeTruthy();
    });

    it('should render tab group with 5 tabs', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const tabs = compiled.querySelectorAll('mat-tab');
      expect(tabs.length).toBe(5);
    });

    it('should have Overview tab', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const overviewTab = Array.from(compiled.querySelectorAll('mat-tab')).find(
        (tab) => tab.getAttribute('label') === 'Overview',
      );
      expect(overviewTab).toBeTruthy();
    });

    it('should have Examples tab', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const examplesTab = Array.from(compiled.querySelectorAll('mat-tab')).find(
        (tab) => tab.getAttribute('label') === 'Examples',
      );
      expect(examplesTab).toBeTruthy();
    });

    it('should have API tab', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const apiTab = Array.from(compiled.querySelectorAll('mat-tab')).find(
        (tab) => tab.getAttribute('label') === 'API',
      );
      expect(apiTab).toBeTruthy();
    });

    it('should have Tokens tab', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const tokensTab = Array.from(compiled.querySelectorAll('mat-tab')).find(
        (tab) => tab.getAttribute('label') === 'Tokens',
      );
      expect(tokensTab).toBeTruthy();
    });

    it('should have Guidelines tab', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const guidelinesTab = Array.from(
        compiled.querySelectorAll('mat-tab'),
      ).find((tab) => tab.getAttribute('label') === 'Guidelines');
      expect(guidelinesTab).toBeTruthy();
    });
  });

  describe('Sample Data', () => {
    it('should have sample variants defined', () => {
      expect(component.sampleVariants).toBeDefined();
      expect(component.sampleVariants.length).toBeGreaterThan(0);
    });

    it('should have multi-dimensional variants defined', () => {
      expect(component.multiDimensionalVariants).toBeDefined();
      expect(component.multiDimensionalVariants.length).toBeGreaterThan(0);
    });

    it('should have stock variants defined', () => {
      expect(component.stockVariants).toBeDefined();
      expect(component.stockVariants.length).toBeGreaterThan(0);
    });

    it('should have ecommerce variants defined', () => {
      expect(component.ecommerceVariants).toBeDefined();
      expect(component.ecommerceVariants.length).toBeGreaterThan(0);
    });

    it('should have valid variant structure', () => {
      const variant = component.sampleVariants[0];
      expect(variant.sku).toBeDefined();
      expect(variant.name).toBeDefined();
      expect(variant.attributes).toBeDefined();
      expect(variant.price).toBeDefined();
      expect(variant.stockLevel).toBeDefined();
      expect(variant.available).toBeDefined();
    });
  });

  describe('Code Examples', () => {
    it('should have basic usage code example', () => {
      expect(component.basicUsageCode).toBeDefined();
      expect(component.basicUsageCode.length).toBeGreaterThan(0);
    });

    it('should have layout modes code example', () => {
      expect(component.layoutModesCode).toBeDefined();
      expect(component.layoutModesCode.length).toBeGreaterThan(0);
    });

    it('should have attributes code example', () => {
      expect(component.attributesCode).toBeDefined();
      expect(component.attributesCode.length).toBeGreaterThan(0);
    });

    it('should have stock availability code example', () => {
      expect(component.stockAvailabilityCode).toBeDefined();
      expect(component.stockAvailabilityCode.length).toBeGreaterThan(0);
    });

    it('should have search code example', () => {
      expect(component.searchCode).toBeDefined();
      expect(component.searchCode.length).toBeGreaterThan(0);
    });

    it('should have HTML and TypeScript code tabs in basic usage', () => {
      const htmlTab = component.basicUsageCode.find(
        (tab) => tab.language === 'html',
      );
      const tsTab = component.basicUsageCode.find(
        (tab) => tab.language === 'typescript',
      );
      expect(htmlTab).toBeDefined();
      expect(tsTab).toBeDefined();
    });
  });

  describe('Component Tokens', () => {
    it('should have variant selector tokens defined', () => {
      expect(component.variantSelectorTokens).toBeDefined();
      expect(component.variantSelectorTokens.length).toBeGreaterThan(0);
    });

    it('should have tokens with required properties', () => {
      const token = component.variantSelectorTokens[0];
      expect(token.category).toBeDefined();
      expect(token.cssVar).toBeDefined();
      expect(token.usage).toBeDefined();
    });

    it('should have color tokens', () => {
      const colorTokens = component.variantSelectorTokens.filter(
        (t) => t.category === 'Colors',
      );
      expect(colorTokens.length).toBeGreaterThan(0);
    });

    it('should have spacing tokens', () => {
      const spacingTokens = component.variantSelectorTokens.filter(
        (t) => t.category === 'Spacing',
      );
      expect(spacingTokens.length).toBeGreaterThan(0);
    });

    it('should have border tokens', () => {
      const borderTokens = component.variantSelectorTokens.filter(
        (t) => t.category === 'Borders',
      );
      expect(borderTokens.length).toBeGreaterThan(0);
    });
  });

  describe('Event Handlers', () => {
    it('should have handleVariantSelect method', () => {
      expect(component.handleVariantSelect).toBeDefined();
      expect(typeof component.handleVariantSelect).toBe('function');
    });

    it('should have handleAttributeFilter method', () => {
      expect(component.handleAttributeFilter).toBeDefined();
      expect(typeof component.handleAttributeFilter).toBe('function');
    });

    it('should handle variant select event', () => {
      spyOn(console, 'log');
      const mockSelection = {
        variants: [
          {
            variant: component.sampleVariants[0],
            quantity: 1,
          },
        ],
      };
      component.handleVariantSelect(mockSelection);
      expect(console.log).toHaveBeenCalledWith(
        'Variant selected:',
        mockSelection,
      );
    });

    it('should handle attribute filter event', () => {
      spyOn(console, 'log');
      const mockEvent = { attribute: 'size', value: 'Large' };
      component.handleAttributeFilter(mockEvent);
      expect(console.log).toHaveBeenCalledWith('Attribute filter:', mockEvent);
    });
  });

  describe('Live Preview Components', () => {
    it('should render live preview components', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const livePreviews = compiled.querySelectorAll('ax-live-preview');
      expect(livePreviews.length).toBeGreaterThan(0);
    });

    it('should render variant selector components in previews', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const variantSelectors = compiled.querySelectorAll('ax-variant-selector');
      expect(variantSelectors.length).toBeGreaterThan(0);
    });

    it('should render code tabs components', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const codeTabs = compiled.querySelectorAll('ax-code-tabs');
      expect(codeTabs.length).toBeGreaterThan(0);
    });
  });

  describe('API Documentation', () => {
    it('should render input properties table', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const tables = compiled.querySelectorAll(
        '.variant-selector-doc__api-table table',
      );
      expect(tables.length).toBeGreaterThan(0);
    });

    it('should document productId input', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const content = compiled.textContent || '';
      expect(content).toContain('productId');
    });

    it('should document variants input', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const content = compiled.textContent || '';
      expect(content).toContain('variants');
    });

    it('should document layout input', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const content = compiled.textContent || '';
      expect(content).toContain('layout');
    });

    it('should document variantSelect output', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const content = compiled.textContent || '';
      expect(content).toContain('variantSelect');
    });

    it('should document attributeFilter output', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const content = compiled.textContent || '';
      expect(content).toContain('attributeFilter');
    });
  });

  describe('Type Definitions', () => {
    it('should display ProductVariant interface', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const content = compiled.textContent || '';
      expect(content).toContain('ProductVariant');
    });

    it('should display VariantSelection interface', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const content = compiled.textContent || '';
      expect(content).toContain('VariantSelection');
    });

    it('should display AttributeFilterEvent interface', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const content = compiled.textContent || '';
      expect(content).toContain('AttributeFilterEvent');
    });
  });

  describe('Guidelines Section', () => {
    it('should render do and dont guidelines', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const guidelines = compiled.querySelectorAll(
        '.variant-selector-doc__guideline',
      );
      expect(guidelines.length).toBe(2);
    });

    it('should render accessibility list', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const a11yList = compiled.querySelector(
        '.variant-selector-doc__a11y-list',
      );
      expect(a11yList).toBeTruthy();
    });

    it('should render best practices list', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const bestPractices = compiled.querySelector(
        '.variant-selector-doc__best-practices',
      );
      expect(bestPractices).toBeTruthy();
    });

    it('should render use cases section', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const useCases = compiled.querySelector(
        '.variant-selector-doc__use-cases',
      );
      expect(useCases).toBeTruthy();
    });
  });

  describe('Layout Modes Documentation', () => {
    it('should document grid layout', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const content = compiled.textContent || '';
      expect(content).toContain('Grid');
    });

    it('should document list layout', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const content = compiled.textContent || '';
      expect(content).toContain('List');
    });

    it('should document compact layout', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const content = compiled.textContent || '';
      expect(content).toContain('Compact');
    });
  });

  describe('Feature Documentation', () => {
    it('should document multi-dimensional attributes', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const content = compiled.textContent || '';
      expect(content).toContain('Multi-Dimensional Attributes');
    });

    it('should document stock availability', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const content = compiled.textContent || '';
      expect(content).toContain('Stock Availability');
    });

    it('should document search functionality', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const content = compiled.textContent || '';
      expect(content).toContain('Search');
    });

    it('should document image thumbnails', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const content = compiled.textContent || '';
      expect(content).toContain('image');
    });

    it('should document attribute filtering', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const content = compiled.textContent || '';
      expect(content).toContain('filter');
    });
  });
});
