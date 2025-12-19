import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QuantityInputDocComponent } from './quantity-input-doc.component';

describe('QuantityInputDocComponent', () => {
  let component: QuantityInputDocComponent;
  let fixture: ComponentFixture<QuantityInputDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuantityInputDocComponent, BrowserAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(QuantityInputDocComponent);
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

    it('should have unit conversion code examples', () => {
      expect(component.unitConversionCode).toBeDefined();
      expect(component.unitConversionCode.length).toBe(2);
    });

    it('should have validation code examples', () => {
      expect(component.validationCode).toBeDefined();
      expect(component.validationCode.length).toBe(2);
    });

    it('should have stepper code examples', () => {
      expect(component.stepperCode).toBeDefined();
      expect(component.stepperCode.length).toBeGreaterThan(0);
    });

    it('should have presets code examples', () => {
      expect(component.presetsCode).toBeDefined();
      expect(component.presetsCode.length).toBeGreaterThan(0);
    });

    it('should have disabled code examples', () => {
      expect(component.disabledCode).toBeDefined();
      expect(component.disabledCode.length).toBeGreaterThan(0);
    });
  });

  describe('Unit Configurations', () => {
    it('should have basic units defined', () => {
      expect(component.basicUnits).toBeDefined();
      expect(component.basicUnits.length).toBe(1);
      expect(component.basicUnits[0].code).toBe('pieces');
    });

    it('should have multi units defined', () => {
      expect(component.multiUnits).toBeDefined();
      expect(component.multiUnits.length).toBe(3);
      expect(component.multiUnits[0].code).toBe('pieces');
      expect(component.multiUnits[1].code).toBe('box');
      expect(component.multiUnits[2].code).toBe('carton');
    });

    it('should have correct conversion rates for multi units', () => {
      expect(component.multiUnits[0].conversionRate).toBe(1); // pieces
      expect(component.multiUnits[1].conversionRate).toBe(12); // box = 12 pieces
      expect(component.multiUnits[2].conversionRate).toBe(144); // carton = 144 pieces
    });

    it('should have decimal unit defined', () => {
      expect(component.decimalUnit).toBeDefined();
      expect(component.decimalUnit[0].code).toBe('kg');
      expect(component.decimalUnit[0].decimalPlaces).toBe(2);
    });

    it('should have integer unit defined', () => {
      expect(component.integerUnit).toBeDefined();
      expect(component.integerUnit[0].code).toBe('boxes');
      expect(component.integerUnit[0].decimalPlaces).toBe(0);
    });

    it('should have transfer units defined', () => {
      expect(component.transferUnits1).toBeDefined();
      expect(component.transferUnits1.length).toBe(2);
      expect(component.transferUnits2).toBeDefined();
      expect(component.transferUnits2.length).toBe(2);
    });

    it('should have order units defined', () => {
      expect(component.orderUnits).toBeDefined();
      expect(component.orderUnits.length).toBe(2);
    });
  });

  describe('Component Tokens', () => {
    it('should have quantity input tokens defined', () => {
      expect(component.quantityInputTokens).toBeDefined();
      expect(component.quantityInputTokens.length).toBeGreaterThan(0);
    });

    it('should have color tokens', () => {
      const colorTokens = component.quantityInputTokens.filter(
        (token) => token.category === 'Colors',
      );
      expect(colorTokens.length).toBeGreaterThan(0);
    });

    it('should have spacing tokens', () => {
      const spacingTokens = component.quantityInputTokens.filter(
        (token) => token.category === 'Spacing',
      );
      expect(spacingTokens.length).toBeGreaterThan(0);
    });

    it('should have border tokens', () => {
      const borderTokens = component.quantityInputTokens.filter(
        (token) => token.category === 'Borders',
      );
      expect(borderTokens.length).toBeGreaterThan(0);
    });

    it('should have typography tokens', () => {
      const typographyTokens = component.quantityInputTokens.filter(
        (token) => token.category === 'Typography',
      );
      expect(typographyTokens.length).toBeGreaterThan(0);
    });

    it('should have required input tokens', () => {
      const tokenVars = component.quantityInputTokens.map((t) => t.cssVar);
      expect(tokenVars).toContain('--ax-border-default');
      expect(tokenVars).toContain('--ax-border-focus');
      expect(tokenVars).toContain('--ax-error-default');
      expect(tokenVars).toContain('--ax-primary-default');
    });
  });

  describe('Validation Handler', () => {
    it('should handle validation state', () => {
      spyOn(console, 'log');

      const mockState = {
        valid: false,
        errors: [{ type: 'max', message: 'Maximum value is 100' }],
      };

      component.handleValidation(mockState);

      expect(console.log).toHaveBeenCalledWith('Validation state:', mockState);
      expect(console.log).toHaveBeenCalledWith(
        'Validation errors:',
        mockState.errors,
      );
    });

    it('should log validation state when valid', () => {
      spyOn(console, 'log');

      const mockState = {
        valid: true,
        errors: [],
      };

      component.handleValidation(mockState);

      expect(console.log).toHaveBeenCalledWith('Validation state:', mockState);
    });

    it('should not log errors when validation is valid', () => {
      spyOn(console, 'log');

      const mockState = {
        valid: true,
        errors: [],
      };

      component.handleValidation(mockState);

      expect(console.log).not.toHaveBeenCalledWith(
        'Validation errors:',
        jasmine.anything(),
      );
    });
  });

  describe('Calculate Total', () => {
    it('should calculate total correctly', () => {
      const total = component.calculateTotal(100, 50, 350);
      expect(total).toBe('700.00');
    });

    it('should round up boxes when quantity is not exact multiple', () => {
      const total = component.calculateTotal(75, 50, 350); // 75 pieces = 2 boxes
      expect(total).toBe('700.00');
    });

    it('should handle single box quantities', () => {
      const total = component.calculateTotal(25, 50, 350); // 25 pieces = 1 box
      expect(total).toBe('350.00');
    });

    it('should format total with Thai locale', () => {
      const total = component.calculateTotal(500, 50, 350); // 500 pieces = 10 boxes
      expect(total).toBe('3,500.00');
    });

    it('should handle zero quantity', () => {
      const total = component.calculateTotal(0, 50, 350);
      expect(total).toBe('0.00');
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
      expect(docHeader?.getAttribute('title')).toBe('Quantity Input');
    });

    it('should have correct icon', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const docHeader = compiled.querySelector('ax-doc-header');
      expect(docHeader?.getAttribute('icon')).toBe('dialpad');
    });
  });

  describe('Live Preview Components', () => {
    it('should render live preview components', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const livePreviews = compiled.querySelectorAll('ax-live-preview');
      expect(livePreviews.length).toBeGreaterThan(0);
    });

    it('should render quantity input components in previews', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const quantityInputs = compiled.querySelectorAll('ax-quantity-input');
      expect(quantityInputs.length).toBeGreaterThan(0);
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

  describe('Initial State Values', () => {
    it('should have correct initial quantity values', () => {
      expect(component.basicQuantity).toBe(100);
      expect(component.conversionQuantity).toBe(60);
      expect(component.validationQuantity).toBe(50);
      expect(component.decimalQuantity).toBe(12.5);
      expect(component.integerQuantity).toBe(10);
    });

    it('should have correct stepper quantity values', () => {
      expect(component.stepQuantity1).toBe(5);
      expect(component.stepQuantity10).toBe(50);
    });

    it('should have correct example quantity values', () => {
      expect(component.presetQuantity).toBe(100);
      expect(component.disabledQuantity).toBe(75);
      expect(component.transferQuantity1).toBe(120);
      expect(component.transferQuantity2).toBe(10.5);
      expect(component.orderQuantity1).toBe(100);
      expect(component.keyboardQuantity).toBe(50);
    });
  });

  describe('Keyboard Shortcuts Documentation', () => {
    it('should document keyboard shortcuts in examples tab', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const content = compiled.textContent || '';
      expect(content).toContain('Keyboard Shortcuts');
    });

    it('should document arrow up/down shortcuts', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const content = compiled.textContent || '';
      expect(content).toContain('Increment by step');
      expect(content).toContain('Decrement by step');
    });

    it('should document page up/down shortcuts', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const content = compiled.textContent || '';
      expect(content).toContain('Page Up');
      expect(content).toContain('Page Down');
    });
  });

  describe('Unit Conversion Documentation', () => {
    it('should document unit conversion in overview tab', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const content = compiled.textContent || '';
      expect(content).toContain('Unit Conversion');
    });

    it('should show conversion hint examples', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const content = compiled.textContent || '';
      expect(content).toContain('Base value');
    });
  });

  describe('Validation Documentation', () => {
    it('should document validation types', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const content = compiled.textContent || '';
      expect(content).toContain('Validation');
      expect(content).toContain('Min/Max Validation');
      expect(content).toContain('Decimal Places Validation');
      expect(content).toContain('Integer Only Validation');
    });
  });
});
