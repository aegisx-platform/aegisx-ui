import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BarcodeScannerDocComponent } from './barcode-scanner-doc.component';

describe('BarcodeScannerDocComponent', () => {
  let component: BarcodeScannerDocComponent;
  let fixture: ComponentFixture<BarcodeScannerDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarcodeScannerDocComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(BarcodeScannerDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render doc header with correct title', () => {
    const compiled = fixture.nativeElement;
    const header = compiled.querySelector('ax-doc-header');
    expect(header).toBeTruthy();
  });

  it('should render 5 tabs', () => {
    const compiled = fixture.nativeElement;
    const tabs = compiled.querySelectorAll('mat-tab');
    expect(tabs.length).toBe(5);
  });

  it('should have Overview tab with correct label', () => {
    const compiled = fixture.nativeElement;
    const tabs = compiled.querySelectorAll('mat-tab');
    expect(tabs[0].getAttribute('label')).toBe('Overview');
  });

  it('should have Examples tab with correct label', () => {
    const compiled = fixture.nativeElement;
    const tabs = compiled.querySelectorAll('mat-tab');
    expect(tabs[1].getAttribute('label')).toBe('Examples');
  });

  it('should have API tab with correct label', () => {
    const compiled = fixture.nativeElement;
    const tabs = compiled.querySelectorAll('mat-tab');
    expect(tabs[2].getAttribute('label')).toBe('API');
  });

  it('should have Tokens tab with correct label', () => {
    const compiled = fixture.nativeElement;
    const tabs = compiled.querySelectorAll('mat-tab');
    expect(tabs[3].getAttribute('label')).toBe('Tokens');
  });

  it('should have Guidelines tab with correct label', () => {
    const compiled = fixture.nativeElement;
    const tabs = compiled.querySelectorAll('mat-tab');
    expect(tabs[4].getAttribute('label')).toBe('Guidelines');
  });

  it('should render live preview components', () => {
    const compiled = fixture.nativeElement;
    const livePreviews = compiled.querySelectorAll('ax-live-preview');
    expect(livePreviews.length).toBeGreaterThan(0);
  });

  it('should render code tabs components', () => {
    const compiled = fixture.nativeElement;
    const codeTabs = compiled.querySelectorAll('ax-code-tabs');
    expect(codeTabs.length).toBeGreaterThan(0);
  });

  it('should render component tokens in Tokens tab', () => {
    const compiled = fixture.nativeElement;
    const componentTokens = compiled.querySelector('ax-component-tokens');
    expect(componentTokens).toBeTruthy();
  });

  it('should have barcodeScannerTokens defined', () => {
    expect(component.barcodeScannerTokens).toBeDefined();
    expect(component.barcodeScannerTokens.length).toBeGreaterThan(0);
  });

  it('should have basicUsageCode defined', () => {
    expect(component.basicUsageCode).toBeDefined();
    expect(component.basicUsageCode.length).toBeGreaterThan(0);
  });

  it('should have modesCode defined', () => {
    expect(component.modesCode).toBeDefined();
    expect(component.modesCode.length).toBeGreaterThan(0);
  });

  it('should have formatsCode defined', () => {
    expect(component.formatsCode).toBeDefined();
    expect(component.formatsCode.length).toBeGreaterThan(0);
  });

  it('should have continuousScanCode defined', () => {
    expect(component.continuousScanCode).toBeDefined();
    expect(component.continuousScanCode.length).toBeGreaterThan(0);
  });

  it('should have historyCode defined', () => {
    expect(component.historyCode).toBeDefined();
    expect(component.historyCode.length).toBeGreaterThan(0);
  });

  it('should have errorHandlingCode defined', () => {
    expect(component.errorHandlingCode).toBeDefined();
    expect(component.errorHandlingCode.length).toBeGreaterThan(0);
  });

  it('should handle scan event', () => {
    const mockResult = {
      code: '1234567890123',
      format: 'ean13' as const,
      timestamp: new Date(),
      mode: 'camera' as const,
    };
    spyOn(console, 'log');
    component.handleScan(mockResult);
    expect(console.log).toHaveBeenCalledWith('Scan result:', mockResult);
  });

  it('should handle scan error', () => {
    const mockError = { type: 'permission-denied', message: 'Camera denied' };
    spyOn(console, 'error');
    component.handleError(mockError);
    expect(console.error).toHaveBeenCalledWith('Scan error:', mockError);
  });

  it('should handle product receiving', () => {
    const mockResult = { code: '123', format: 'ean13' };
    spyOn(console, 'log');
    component.handleProductReceiving(mockResult);
    expect(console.log).toHaveBeenCalledWith('Product receiving:', mockResult);
  });

  it('should handle stock taking', () => {
    const mockResult = { code: '456', format: 'code128' };
    spyOn(console, 'log');
    component.handleStockTaking(mockResult);
    expect(console.log).toHaveBeenCalledWith('Stock taking:', mockResult);
  });

  it('should handle asset tracking', () => {
    const mockResult = { code: 'ASSET-001', format: 'qr' };
    spyOn(console, 'log');
    component.handleAssetTracking(mockResult);
    expect(console.log).toHaveBeenCalledWith('Asset tracking:', mockResult);
  });

  it('should handle permission error', () => {
    const mockError = { type: 'permission-denied', message: 'Access denied' };
    spyOn(console, 'error');
    component.handlePermissionError(mockError);
    expect(console.error).toHaveBeenCalledWith('Permission error:', mockError);
  });

  it('should handle mode change', () => {
    spyOn(console, 'log');
    component.handleModeChange('manual');
    expect(console.log).toHaveBeenCalledWith('Mode changed to:', 'manual');
  });

  it('should render API table with input properties', () => {
    const compiled = fixture.nativeElement;
    const apiTables = compiled.querySelectorAll(
      '.barcode-scanner-doc__api-table',
    );
    expect(apiTables.length).toBeGreaterThan(0);
  });

  it('should render format grid', () => {
    const compiled = fixture.nativeElement;
    const formatGrid = compiled.querySelector(
      '.barcode-scanner-doc__format-grid',
    );
    expect(formatGrid).toBeTruthy();
  });

  it('should render guidelines section with do and dont', () => {
    const compiled = fixture.nativeElement;
    const guidelines = compiled.querySelector(
      '.barcode-scanner-doc__guidelines',
    );
    expect(guidelines).toBeTruthy();
  });

  it('should render accessibility section', () => {
    const compiled = fixture.nativeElement;
    const a11yList = compiled.querySelector('.barcode-scanner-doc__a11y-list');
    expect(a11yList).toBeTruthy();
  });

  it('should render best practices section', () => {
    const compiled = fixture.nativeElement;
    const bestPractices = compiled.querySelector(
      '.barcode-scanner-doc__best-practices',
    );
    expect(bestPractices).toBeTruthy();
  });

  it('should render browser compatibility section', () => {
    const compiled = fixture.nativeElement;
    const browserCompat = compiled.querySelector(
      '.barcode-scanner-doc__browser-compat',
    );
    expect(browserCompat).toBeTruthy();
  });

  it('should render permissions flow', () => {
    const compiled = fixture.nativeElement;
    const permissions = compiled.querySelector(
      '.barcode-scanner-doc__permissions',
    );
    expect(permissions).toBeTruthy();
  });
});
