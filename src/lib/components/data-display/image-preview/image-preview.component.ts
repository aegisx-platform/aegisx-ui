import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
  effect,
  HostListener,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PreviewImage } from './image-preview.types';

/**
 * Image Preview (Lightbox) Component
 *
 * Full-screen overlay gallery with prev/next navigation,
 * thumbnail strip, keyboard controls, and counter.
 *
 * @example
 * // Basic usage
 * <ax-image-preview
 *   [images]="drugImages()"
 *   [open]="previewOpen()"
 *   (closed)="previewOpen.set(false)"
 * />
 *
 * @example
 * // Start at specific index
 * <ax-image-preview
 *   [images]="images()"
 *   [open]="true"
 *   [startIndex]="2"
 *   pathPrefix="/api/uploads/"
 *   (closed)="onClose()"
 * />
 */
@Component({
  selector: 'ax-image-preview',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open()) {
      <div
        class="ax-preview-overlay"
        role="button"
        tabindex="0"
        aria-label="ปิด"
        (click)="close()"
        (keyup.enter)="close()"
        (keyup.escape)="close()"
      >
        <div
          class="ax-preview-container"
          role="presentation"
          (click)="$event.stopPropagation()"
          (keyup)="$event.stopPropagation()"
        >
          <!-- Close button -->
          <button class="ax-preview-close" (click)="close()" aria-label="ปิด">
            <mat-icon>close</mat-icon>
          </button>

          <!-- Main Image -->
          <div class="ax-preview-main">
            @if (currentImage(); as img) {
              <img
                [src]="resolveUrl(img.url)"
                [alt]="img.caption || ''"
                class="ax-preview-img"
              />
            }
          </div>

          <!-- Navigation arrows -->
          @if (images().length > 1) {
            <button
              class="ax-preview-nav ax-preview-nav--prev"
              (click)="prev()"
              aria-label="ก่อนหน้า"
            >
              <mat-icon>chevron_left</mat-icon>
            </button>
            <button
              class="ax-preview-nav ax-preview-nav--next"
              (click)="next()"
              aria-label="ถัดไป"
            >
              <mat-icon>chevron_right</mat-icon>
            </button>
          }

          <!-- Thumbnails -->
          @if (images().length > 1) {
            <div class="ax-preview-thumbs">
              @for (img of images(); track img.id; let i = $index) {
                <img
                  [src]="resolveUrl(img.url)"
                  [alt]="img.caption || ''"
                  class="ax-preview-thumb"
                  [class.ax-preview-thumb--active]="i === currentIndex()"
                  role="button"
                  tabindex="0"
                  (click)="currentIndex.set(i)"
                  (keyup.enter)="currentIndex.set(i)"
                />
              }
            </div>
          }

          <!-- Counter -->
          <div class="ax-preview-counter">
            {{ currentIndex() + 1 }} / {{ images().length }}
          </div>

          <!-- Caption -->
          @if (currentImage()?.caption) {
            <div class="ax-preview-caption">{{ currentImage()!.caption }}</div>
          }
        </div>
      </div>
    }
  `,
  styles: [
    `
      .ax-preview-overlay {
        position: fixed;
        inset: 0;
        z-index: 1000;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        animation: ax-fade-in 0.15s ease;
      }

      .ax-preview-container {
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .ax-preview-close {
        position: absolute;
        top: -44px;
        right: 0;
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        z-index: 1;
        padding: 4px;
        border-radius: 50%;
        transition: background 0.15s;
        mat-icon {
          font-size: 28px;
          width: 28px;
          height: 28px;
        }
        &:hover {
          background: rgba(255, 255, 255, 0.15);
        }
      }

      .ax-preview-main {
        display: flex;
        align-items: center;
        justify-content: center;
        max-height: 70vh;
      }

      .ax-preview-img {
        max-width: 80vw;
        max-height: 70vh;
        object-fit: contain;
        border-radius: 8px;
        user-select: none;
      }

      .ax-preview-nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255, 255, 255, 0.15);
        border: none;
        border-radius: 50%;
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        cursor: pointer;
        transition: background 0.15s;
        &:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        &--prev {
          left: -60px;
        }
        &--next {
          right: -60px;
        }
      }

      .ax-preview-thumbs {
        display: flex;
        gap: 8px;
        margin-top: 16px;
        overflow-x: auto;
        max-width: 80vw;
        padding: 4px 0;
      }

      .ax-preview-thumb {
        width: 56px;
        height: 56px;
        border-radius: 6px;
        object-fit: cover;
        cursor: pointer;
        border: 2px solid transparent;
        opacity: 0.6;
        transition: all 0.15s;
        flex-shrink: 0;
        &:hover {
          opacity: 0.9;
        }
        &--active {
          border-color: white;
          opacity: 1;
        }
      }

      .ax-preview-counter {
        margin-top: 8px;
        color: rgba(255, 255, 255, 0.6);
        font-size: 0.75rem;
      }

      .ax-preview-caption {
        margin-top: 4px;
        color: rgba(255, 255, 255, 0.8);
        font-size: 0.8125rem;
        text-align: center;
        max-width: 60vw;
      }

      @keyframes ax-fade-in {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
    `,
  ],
})
export class AxImagePreviewComponent {
  /** Array of images to display */
  readonly images = input.required<PreviewImage[]>();

  /** Whether the lightbox is open */
  readonly open = input(false);

  /** Starting index when opened */
  readonly startIndex = input(0);

  /** URL prefix for relative paths (e.g., '/api/uploads/') */
  readonly pathPrefix = input('');

  /** Emitted when lightbox is closed */
  readonly closed = output<void>();

  /** Current active index */
  readonly currentIndex = signal(0);

  /** Current image */
  protected readonly currentImage = computed(() => {
    const imgs = this.images();
    const idx = this.currentIndex();
    return imgs[idx] ?? null;
  });

  constructor() {
    // Reset index when opened or startIndex changes
    effect(() => {
      if (this.open()) {
        this.currentIndex.set(this.startIndex());
      }
    });
  }

  /** Keyboard navigation */
  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.open()) return;

    switch (event.key) {
      case 'Escape':
        this.close();
        break;
      case 'ArrowLeft':
        this.prev();
        break;
      case 'ArrowRight':
        this.next();
        break;
    }
  }

  prev(): void {
    const idx = this.currentIndex();
    const len = this.images().length;
    this.currentIndex.set(idx > 0 ? idx - 1 : len - 1);
  }

  next(): void {
    const idx = this.currentIndex();
    const len = this.images().length;
    this.currentIndex.set(idx < len - 1 ? idx + 1 : 0);
  }

  close(): void {
    this.closed.emit();
  }

  resolveUrl(url: string): string {
    if (!url) return '';
    // Absolute URLs or data URIs pass through
    if (
      url.startsWith('http') ||
      url.startsWith('data:') ||
      url.startsWith('blob:')
    ) {
      return url;
    }
    return this.pathPrefix() + url;
  }
}
