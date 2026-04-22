import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AxStepProgressComponent } from './step-progress.component';
import { StepProgressItem } from './step-progress.types';

describe('AxStepProgressComponent', () => {
  let fixture: ComponentFixture<AxStepProgressComponent>;

  const steps: StepProgressItem[] = [
    { code: 'A', label: 'Planned', icon: 'description', status: 'completed' },
    { code: 'B', label: 'Approved', icon: 'verified', status: 'completed' },
    { code: 'C', label: 'In progress', icon: 'cached', status: 'current' },
    { code: 'D', label: 'Shipped', icon: 'local_shipping', status: 'upcoming' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AxStepProgressComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AxStepProgressComponent);
    fixture.componentRef.setInput('steps', steps);
    fixture.detectChanges();
  });

  it('renders one marker per step', () => {
    const markers = fixture.debugElement.queryAll(
      By.css('[data-testid="step-marker"]'),
    );
    expect(markers.length).toBe(4);
  });

  it('applies the correct status class to each marker', () => {
    const markers = fixture.debugElement.queryAll(
      By.css('[data-testid="step-marker"]'),
    );
    expect(markers[0].nativeElement.classList).toContain('status-completed');
    expect(markers[2].nativeElement.classList).toContain('status-current');
    expect(markers[3].nativeElement.classList).toContain('status-upcoming');
  });

  it('renders numeric fallback when icon is missing', () => {
    fixture.componentRef.setInput('steps', [
      { code: 'X', label: 'No icon', status: 'upcoming' },
    ]);
    fixture.detectChanges();
    const marker = fixture.debugElement.query(
      By.css('[data-testid="step-marker"]'),
    );
    expect(marker.nativeElement.textContent?.trim()).toBe('1');
  });

  it('collapses excess steps when overflow=collapse', () => {
    const many: StepProgressItem[] = Array.from({ length: 9 }, (_, i) => ({
      code: `S${i}`,
      label: `Step ${i + 1}`,
      status:
        i < 3
          ? 'completed'
          : i === 3
            ? 'current'
            : 'upcoming',
    }));
    fixture.componentRef.setInput('steps', many);
    fixture.componentRef.setInput('overflow', 'collapse');
    fixture.componentRef.setInput('maxVisible', 5);
    fixture.detectChanges();

    const markers = fixture.debugElement.queryAll(
      By.css('[data-testid="step-marker"]'),
    );
    const ellipsis = fixture.debugElement.query(
      By.css('[data-testid="step-ellipsis"]'),
    );
    expect(markers.length).toBe(5);
    expect(ellipsis).toBeTruthy();
  });

  it('emits stepClick when clickable and marker is clicked', () => {
    fixture.componentRef.setInput('clickable', true);
    fixture.detectChanges();

    const emitted: StepProgressItem[] = [];
    fixture.componentInstance.stepClick.subscribe((s) => emitted.push(s));

    const marker = fixture.debugElement.queryAll(
      By.css('[data-testid="step-marker"]'),
    )[1];
    marker.nativeElement.click();

    expect(emitted.length).toBe(1);
    expect(emitted[0].code).toBe('B');
  });

  it('does not emit stepClick when clickable=false (default)', () => {
    const emitted: StepProgressItem[] = [];
    fixture.componentInstance.stepClick.subscribe((s) => emitted.push(s));

    const marker = fixture.debugElement.queryAll(
      By.css('[data-testid="step-marker"]'),
    )[0];
    marker.nativeElement.click();

    expect(emitted.length).toBe(0);
  });
});
