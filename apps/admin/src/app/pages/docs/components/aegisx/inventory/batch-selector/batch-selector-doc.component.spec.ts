import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BatchSelectorDocComponent } from './batch-selector-doc.component';

describe('BatchSelectorDocComponent', () => {
  let component: BatchSelectorDocComponent;
  let fixture: ComponentFixture<BatchSelectorDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchSelectorDocComponent, BrowserAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(BatchSelectorDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Sample Data', () => {
    it('should have sample batches defined', () => {
      expect(component.sampleBatches).toBeDefined();
      expect(component.sampleBatches.length).toBeGreaterThan(0);
    });

    it('should have expiry status batches defined', () => {
      expect(component.expiryStatusBatches).toBeDefined();
      expect(component.expiryStatusBatches.length).toBe(4);
    });

    it('should have large batch list defined', () => {
      expect(component.largeBatchList).toBeDefined();
      expect(component.largeBatchList.length).toBeGreaterThan(3);
    });

    it('should have valid batch data structure', () => {
      const batch = component.sampleBatches[0];
      expect(batch.batchNumber).toBeDefined();
      expect(batch.expiryDate).toBeInstanceOf(Date);
      expect(batch.availableQuantity).toBeGreaterThan(0);
      expect(batch.status).toBe('available');
    });
  });

  describe('Code Examples', () => {
    it('should have basic usage code examples', () => {
      expect(component.basicUsageCode).toBeDefined();
      expect(component.basicUsageCode.length).toBe(2);
      expect(component.basicUsageCode[0].label).toBe('HTML');
      expect(component.basicUsageCode[1].label).toBe('TypeScript');
    });

    it('should have strategies code examples', () => {
      expect(component.strategiesCode).toBeDefined();
      expect(component.strategiesCode.length).toBeGreaterThan(0);
      expect(component.strategiesCode[0].code).toContain('fifo');
      expect(component.strategiesCode[0].code).toContain('fefo');
      expect(component.strategiesCode[0].code).toContain('lifo');
    });

    it('should have expiry tracking code examples', () => {
      expect(component.expiryTrackingCode).toBeDefined();
      expect(component.expiryTrackingCode.length).toBe(2);
      expect(component.expiryTrackingCode[0].code).toContain(
        'expiryWarningDays',
      );
      expect(component.expiryTrackingCode[0].code).toContain(
        'expiryCriticalDays',
      );
    });

    it('should have quantity allocation code examples', () => {
      expect(component.quantityAllocationCode).toBeDefined();
      expect(component.quantityAllocationCode.length).toBe(2);
      expect(component.quantityAllocationCode[0].code).toContain(
        'requestedQuantity',
      );
    });

    it('should have single select code examples', () => {
      expect(component.singleSelectCode).toBeDefined();
      expect(component.singleSelectCode.length).toBeGreaterThan(0);
      expect(component.singleSelectCode[0].code).toContain('allowMultiple');
    });
  });

  describe('Component Tokens', () => {
    it('should have batch selector tokens defined', () => {
      expect(component.batchSelectorTokens).toBeDefined();
      expect(component.batchSelectorTokens.length).toBeGreaterThan(0);
    });

    it('should have color tokens', () => {
      const colorTokens = component.batchSelectorTokens.filter(
        (token) => token.category === 'Colors',
      );
      expect(colorTokens.length).toBeGreaterThan(0);
    });

    it('should have spacing tokens', () => {
      const spacingTokens = component.batchSelectorTokens.filter(
        (token) => token.category === 'Spacing',
      );
      expect(spacingTokens.length).toBeGreaterThan(0);
    });

    it('should have border tokens', () => {
      const borderTokens = component.batchSelectorTokens.filter(
        (token) => token.category === 'Borders',
      );
      expect(borderTokens.length).toBeGreaterThan(0);
    });

    it('should have required expiry status color tokens', () => {
      const tokenVars = component.batchSelectorTokens.map((t) => t.cssVar);
      expect(tokenVars).toContain('--ax-success-default');
      expect(tokenVars).toContain('--ax-warning-default');
      expect(tokenVars).toContain('--ax-error-default');
      expect(tokenVars).toContain('--ax-text-disabled');
    });

    it('should have primary color token for recommendation', () => {
      const tokenVars = component.batchSelectorTokens.map((t) => t.cssVar);
      expect(tokenVars).toContain('--ax-primary-default');
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
      expect(docHeader?.getAttribute('title')).toBe('Batch Selector');
    });

    it('should have correct icon', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const docHeader = compiled.querySelector('ax-doc-header');
      expect(docHeader?.getAttribute('icon')).toBe('qr_code_scanner');
    });
  });

  describe('Live Preview Components', () => {
    it('should render live preview components', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const livePreviews = compiled.querySelectorAll('ax-live-preview');
      expect(livePreviews.length).toBeGreaterThan(0);
    });

    it('should render batch selector components in previews', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const batchSelectors = compiled.querySelectorAll('ax-batch-selector');
      expect(batchSelectors.length).toBeGreaterThan(0);
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

  describe('Strategy Documentation', () => {
    it('should document FIFO strategy', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const content = compiled.textContent || '';
      expect(content).toContain('FIFO');
      expect(content).toContain('First In First Out');
    });

    it('should document FEFO strategy', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const content = compiled.textContent || '';
      expect(content).toContain('FEFO');
      expect(content).toContain('First Expired First Out');
    });

    it('should document LIFO strategy', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const content = compiled.textContent || '';
      expect(content).toContain('LIFO');
      expect(content).toContain('Last In First Out');
    });
  });

  describe('Expiry Status Documentation', () => {
    it('should document safe status', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const content = compiled.textContent || '';
      expect(content).toContain('Safe');
      expect(content).toContain('Green');
    });

    it('should document warning status', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const content = compiled.textContent || '';
      expect(content).toContain('Warning');
      expect(content).toContain('Yellow');
    });

    it('should document critical status', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const content = compiled.textContent || '';
      expect(content).toContain('Critical');
      expect(content).toContain('Red');
    });

    it('should document expired status', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const content = compiled.textContent || '';
      expect(content).toContain('Expired');
      expect(content).toContain('Gray');
    });
  });

  describe('API Documentation', () => {
    it('should document input properties', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const content = compiled.textContent || '';
      expect(content).toContain('productId');
      expect(content).toContain('batches');
      expect(content).toContain('strategy');
      expect(content).toContain('allowMultiple');
      expect(content).toContain('requestedQuantity');
    });

    it('should document output events', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const content = compiled.textContent || '';
      expect(content).toContain('batchSelect');
      expect(content).toContain('batchesLoad');
      expect(content).toContain('loadError');
    });

    it('should document type definitions', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const content = compiled.textContent || '';
      expect(content).toContain('BatchInfo');
      expect(content).toContain('BatchSelection');
      expect(content).toContain('SelectedBatch');
    });
  });

  describe('Guidelines Documentation', () => {
    it('should have do and dont sections', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const guidelines = compiled.querySelectorAll(
        '.batch-selector-doc__guideline',
      );
      expect(guidelines.length).toBeGreaterThan(0);
    });

    it('should document accessibility features', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const content = compiled.textContent || '';
      expect(content).toContain('Accessibility');
      expect(content).toContain('keyboard');
      expect(content).toContain('screen reader');
    });

    it('should document best practices', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const content = compiled.textContent || '';
      expect(content).toContain('Best Practices');
    });
  });
});
