import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AxActivityListCardComponent } from './ax-activity-list-card.component';
import { ActivityListItem } from './ax-activity-list-card.types';

const SAMPLE: readonly ActivityListItem[] = [
  {
    id: '1',
    avatar: { name: 'Chandler Geller', color: 'blue' },
    primary: 'Chandler Geller',
    secondary: 'hello@jayo.design',
    amount: '$2,450',
    status: { label: 'Paid', tone: 'success' },
    date: 'Dec 12',
  },
];

describe('AxActivityListCardComponent', () => {
  let fixture: ComponentFixture<AxActivityListCardComponent>;
  let c: AxActivityListCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AxActivityListCardComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(AxActivityListCardComponent);
    c = fixture.componentInstance;
  });

  it('composes ax-card + ax-avatar + ax-badge', () => {
    c.title = 'Recent activity';
    c.items = SAMPLE;
    fixture.detectChanges();

    const host: HTMLElement = fixture.nativeElement;
    expect(host.querySelector('ax-card')).toBeTruthy();
    expect(host.querySelector('ax-avatar')).toBeTruthy();
    expect(host.querySelector('ax-badge')).toBeTruthy();
    expect(host.textContent).toContain('Recent activity');
    expect(host.textContent).toContain('Chandler Geller');
    expect(host.textContent).toContain('$2,450');
    expect(host.textContent).toContain('Paid');
    expect(host.textContent).toContain('Dec 12');
  });

  it('hides columns when configured off', () => {
    c.items = SAMPLE;
    c.columns = { amount: false, status: false, date: false, menu: false };
    fixture.detectChanges();

    const host: HTMLElement = fixture.nativeElement;
    expect(host.textContent).not.toContain('$2,450');
    expect(host.querySelector('ax-badge')).toBeFalsy();
    expect(host.textContent).not.toContain('Dec 12');
    expect(host.querySelector('.ax-activity-list-card__menu')).toBeFalsy();
  });

  it('emits itemClick when a row is clicked', () => {
    c.items = SAMPLE;
    fixture.detectChanges();
    const spy = jest.fn();
    c.itemClick.subscribe(spy);
    const row = fixture.nativeElement.querySelector(
      '.ax-activity-list-card__row:not(.ax-activity-list-card__row--header)',
    ) as HTMLElement;
    row.click();
    expect(spy).toHaveBeenCalledWith(SAMPLE[0]);
  });

  it('maps danger tone to ax-badge color="error"', () => {
    expect(c.toneToBadgeColor('danger')).toBe('error');
    expect(c.toneToBadgeColor('success')).toBe('success');
    expect(c.toneToBadgeColor('warning')).toBe('warning');
    expect(c.toneToBadgeColor('info')).toBe('info');
    expect(c.toneToBadgeColor('neutral')).toBe('neutral');
  });
});
