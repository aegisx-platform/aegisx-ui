import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AxAvatarComponent } from './avatar.component';

describe('AxAvatarComponent — [color] tint', () => {
  let fixture: ComponentFixture<AxAvatarComponent>;
  let component: AxAvatarComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AxAvatarComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(AxAvatarComponent);
    component = fixture.componentInstance;
  });

  it('adds the tint class when [color] is provided', () => {
    component.name = 'Chandler Geller';
    component.color = 'blue';
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement.querySelector('.ax-avatar');
    expect(el.classList.contains('ax-avatar-tint-blue')).toBe(true);
    expect(el.textContent?.trim()).toBe('CG');
  });

  it('keeps existing neutral styling when [color] is omitted', () => {
    component.name = 'Monica Green';
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement.querySelector('.ax-avatar');
    expect(
      Array.from(el.classList).some((c) => c.startsWith('ax-avatar-tint-')),
    ).toBe(false);
  });
});
