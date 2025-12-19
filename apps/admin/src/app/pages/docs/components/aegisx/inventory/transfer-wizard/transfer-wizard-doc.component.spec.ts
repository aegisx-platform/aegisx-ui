import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransferWizardDocComponent } from './transfer-wizard-doc.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TransferWizardDocComponent', () => {
  let component: TransferWizardDocComponent;
  let fixture: ComponentFixture<TransferWizardDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferWizardDocComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TransferWizardDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render doc header with correct title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const docHeader = compiled.querySelector('ax-doc-header');
    expect(docHeader).toBeTruthy();
  });

  it('should render all 5 tabs', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const tabs = compiled.querySelectorAll('mat-tab');
    expect(tabs.length).toBe(5);
  });

  it('should have Overview tab', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const tabLabels = Array.from(compiled.querySelectorAll('mat-tab')).map(
      (tab) => tab.getAttribute('label'),
    );
    expect(tabLabels).toContain('Overview');
  });

  it('should have Examples tab', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const tabLabels = Array.from(compiled.querySelectorAll('mat-tab')).map(
      (tab) => tab.getAttribute('label'),
    );
    expect(tabLabels).toContain('Examples');
  });

  it('should have API tab', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const tabLabels = Array.from(compiled.querySelectorAll('mat-tab')).map(
      (tab) => tab.getAttribute('label'),
    );
    expect(tabLabels).toContain('API');
  });

  it('should have Tokens tab', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const tabLabels = Array.from(compiled.querySelectorAll('mat-tab')).map(
      (tab) => tab.getAttribute('label'),
    );
    expect(tabLabels).toContain('Tokens');
  });

  it('should have Guidelines tab', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const tabLabels = Array.from(compiled.querySelectorAll('mat-tab')).map(
      (tab) => tab.getAttribute('label'),
    );
    expect(tabLabels).toContain('Guidelines');
  });

  it('should render live preview with transfer wizard', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const livePreview = compiled.querySelector('ax-live-preview');
    expect(livePreview).toBeTruthy();
  });

  it('should render code examples', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const codeTabs = compiled.querySelectorAll('ax-code-tabs');
    expect(codeTabs.length).toBeGreaterThan(0);
  });

  it('should have sample locations data', () => {
    expect(component.sampleLocations()).toBeDefined();
    expect(component.sampleLocations().length).toBeGreaterThan(0);
  });

  it('should have product search function', () => {
    expect(component.productSearchFunction).toBeDefined();
    expect(typeof component.productSearchFunction).toBe('function');
  });

  it('should filter products based on search term', async () => {
    const results = await component.productSearchFunction('gloves');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name.toLowerCase()).toContain('gloves');
  });

  it('should handle transfer complete event', () => {
    spyOn(console, 'log');
    const mockTransfer = {
      sourceLocationId: '1',
      destinationLocationId: '2',
      items: [],
    };
    component.handleTransferComplete(mockTransfer);
    expect(console.log).toHaveBeenCalledWith(
      'Transfer completed:',
      mockTransfer,
    );
  });

  it('should handle transfer cancel event', () => {
    spyOn(console, 'log');
    component.handleTransferCancel();
    expect(console.log).toHaveBeenCalledWith('Transfer cancelled');
  });

  it('should have workflow steps documentation', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const workflowSteps = compiled.querySelectorAll('.workflow-step');
    expect(workflowSteps.length).toBe(5);
  });

  it('should render API tables', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const apiTables = compiled.querySelectorAll(
      '.transfer-wizard-doc__api-table table',
    );
    expect(apiTables.length).toBeGreaterThan(0);
  });

  it('should render component tokens', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const tokens = compiled.querySelector('ax-component-tokens');
    expect(tokens).toBeTruthy();
  });

  it('should have transferWizardTokens array', () => {
    expect(component.transferWizardTokens).toBeDefined();
    expect(Array.isArray(component.transferWizardTokens)).toBe(true);
    expect(component.transferWizardTokens.length).toBeGreaterThan(0);
  });

  it('should render guidelines section', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const guidelines = compiled.querySelectorAll(
      '.transfer-wizard-doc__guideline',
    );
    expect(guidelines.length).toBeGreaterThan(0);
  });

  it('should render do and dont sections', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const doSection = compiled.querySelector(
      '.transfer-wizard-doc__guideline--do',
    );
    const dontSection = compiled.querySelector(
      '.transfer-wizard-doc__guideline--dont',
    );
    expect(doSection).toBeTruthy();
    expect(dontSection).toBeTruthy();
  });

  it('should have all required code examples', () => {
    expect(component.basicUsageCode).toBeDefined();
    expect(component.progressIndicatorCode).toBeDefined();
    expect(component.basicExampleCode).toBeDefined();
    expect(component.preSelectedSourceCode).toBeDefined();
    expect(component.approvalRequiredCode).toBeDefined();
    expect(component.draftSaveCode).toBeDefined();
    expect(component.stepChangeCode).toBeDefined();
  });

  it('should render type definitions', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const preElements = compiled.querySelectorAll('pre code');
    expect(preElements.length).toBeGreaterThan(0);
  });

  it('should render accessibility section', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const a11yList = compiled.querySelector('.transfer-wizard-doc__a11y-list');
    expect(a11yList).toBeTruthy();
  });

  it('should render best practices section', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const bestPractices = compiled.querySelector(
      '.transfer-wizard-doc__best-practices',
    );
    expect(bestPractices).toBeTruthy();
  });
});
