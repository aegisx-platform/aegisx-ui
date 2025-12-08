/**
 * OKLCH Color Utilities
 *
 * OKLCH is a perceptually uniform color space that's great for:
 * - Generating harmonious color palettes
 * - Consistent color manipulation
 * - Better contrast ratios
 */

import { OklchColor } from '../models/theme-generator.types';

// ============================================================================
// OKLCH to/from String
// ============================================================================

/**
 * Convert OklchColor object to CSS oklch() string
 */
export function oklchToString(color: OklchColor, includeAlpha = false): string {
  const l = Math.round(color.l * 100) / 100;
  const c = Math.round(color.c * 1000) / 1000;
  const h = Math.round(color.h * 100) / 100;

  if (includeAlpha && color.a !== undefined && color.a < 1) {
    return `oklch(${l}% ${c} ${h} / ${color.a})`;
  }
  return `oklch(${l}% ${c} ${h})`;
}

/**
 * Parse CSS oklch() string to OklchColor object
 */
export function parseOklchString(str: string): OklchColor | null {
  // Match: oklch(L% C H) or oklch(L% C H / A)
  const regex =
    /oklch\(\s*([\d.]+)%?\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)/i;
  const match = str.match(regex);

  if (!match) return null;

  return {
    l: parseFloat(match[1]),
    c: parseFloat(match[2]),
    h: parseFloat(match[3]),
    a: match[4] ? parseFloat(match[4]) : undefined,
  };
}

// ============================================================================
// OKLCH to/from Hex (via sRGB)
// ============================================================================

/**
 * Convert OKLCH to Hex color
 * Note: This is an approximation since OKLCH gamut is larger than sRGB
 */
export function oklchToHex(color: OklchColor): string {
  const rgb = oklchToRgb(color);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

/**
 * Convert Hex to OKLCH
 */
export function hexToOklch(hex: string): OklchColor {
  const rgb = hexToRgb(hex);
  return rgbToOklch(rgb.r, rgb.g, rgb.b);
}

// ============================================================================
// RGB Conversions
// ============================================================================

interface Rgb {
  r: number;
  g: number;
  b: number;
}

function hexToRgb(hex: string): Rgb {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return { r: 0, g: 0, b: 0 };
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const clamped = Math.max(0, Math.min(255, Math.round(n)));
    return clamped.toString(16).padStart(2, '0');
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// ============================================================================
// OKLCH <-> RGB Conversion (via OKLab)
// ============================================================================

function oklchToRgb(color: OklchColor): Rgb {
  // OKLCH to OKLab
  const hRad = (color.h * Math.PI) / 180;
  const L = color.l / 100;
  const a = color.c * Math.cos(hRad);
  const b = color.c * Math.sin(hRad);

  // OKLab to linear sRGB
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  // Linear sRGB to sRGB
  const linearR = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const linearG = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const linearB = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  const gammaCorrect = (c: number) => {
    if (c <= 0.0031308) return c * 12.92;
    return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  };

  return {
    r: gammaCorrect(linearR) * 255,
    g: gammaCorrect(linearG) * 255,
    b: gammaCorrect(linearB) * 255,
  };
}

function rgbToOklch(r: number, g: number, b: number): OklchColor {
  // Normalize RGB
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  // sRGB to linear sRGB
  const linearize = (c: number) => {
    if (c <= 0.04045) return c / 12.92;
    return Math.pow((c + 0.055) / 1.055, 2.4);
  };

  const linearR = linearize(rNorm);
  const linearG = linearize(gNorm);
  const linearB = linearize(bNorm);

  // Linear sRGB to OKLab
  const l = Math.cbrt(
    0.4122214708 * linearR + 0.5363325363 * linearG + 0.0514459929 * linearB,
  );
  const m = Math.cbrt(
    0.2119034982 * linearR + 0.6806995451 * linearG + 0.1073969566 * linearB,
  );
  const s = Math.cbrt(
    0.0883024619 * linearR + 0.2817188376 * linearG + 0.6299787005 * linearB,
  );

  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const b_val = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

  // OKLab to OKLCH
  const C = Math.sqrt(a * a + b_val * b_val);
  let H = (Math.atan2(b_val, a) * 180) / Math.PI;
  if (H < 0) H += 360;

  return {
    l: L * 100,
    c: C,
    h: H,
  };
}

// ============================================================================
// Color Manipulation
// ============================================================================

/**
 * Adjust lightness of OKLCH color
 */
export function adjustLightness(color: OklchColor, amount: number): OklchColor {
  return {
    ...color,
    l: Math.max(0, Math.min(100, color.l + amount)),
  };
}

/**
 * Adjust chroma (saturation) of OKLCH color
 */
export function adjustChroma(color: OklchColor, amount: number): OklchColor {
  return {
    ...color,
    c: Math.max(0, Math.min(0.4, color.c + amount)),
  };
}

/**
 * Adjust hue of OKLCH color
 */
export function adjustHue(color: OklchColor, degrees: number): OklchColor {
  let newHue = color.h + degrees;
  while (newHue < 0) newHue += 360;
  while (newHue >= 360) newHue -= 360;
  return {
    ...color,
    h: newHue,
  };
}

/**
 * Generate content color (text on colored background)
 * Returns light or dark text based on background lightness
 */
export function generateContentColor(bgColor: OklchColor): OklchColor {
  // If background is light (L > 60%), use dark text
  if (bgColor.l > 60) {
    return {
      l: 20,
      c: 0.02,
      h: bgColor.h, // Keep same hue for harmony
    };
  }
  // If background is dark, use light text
  return {
    l: 98,
    c: 0.01,
    h: bgColor.h,
  };
}

/**
 * Generate a lighter shade of a color
 */
export function generateLightShade(
  color: OklchColor,
  level: number = 1,
): OklchColor {
  const lightnessIncrease = level * 15;
  const chromaDecrease = level * 0.03;
  return {
    l: Math.min(98, color.l + lightnessIncrease),
    c: Math.max(0.01, color.c - chromaDecrease),
    h: color.h,
  };
}

/**
 * Generate a darker shade of a color
 */
export function generateDarkShade(
  color: OklchColor,
  level: number = 1,
): OklchColor {
  const lightnessDecrease = level * 15;
  const chromaIncrease = level * 0.02;
  return {
    l: Math.max(10, color.l - lightnessDecrease),
    c: Math.min(0.35, color.c + chromaIncrease),
    h: color.h,
  };
}

// ============================================================================
// Palette Generation
// ============================================================================

/**
 * Generate a color palette from a base color
 * Returns shades from 50 (lightest) to 900 (darkest)
 */
export function generatePalette(
  baseColor: OklchColor,
): Record<
  50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900,
  OklchColor
> {
  return {
    50: { l: 97, c: baseColor.c * 0.1, h: baseColor.h },
    100: { l: 94, c: baseColor.c * 0.2, h: baseColor.h },
    200: { l: 88, c: baseColor.c * 0.4, h: baseColor.h },
    300: { l: 80, c: baseColor.c * 0.6, h: baseColor.h },
    400: { l: 70, c: baseColor.c * 0.8, h: baseColor.h },
    500: baseColor, // Base color
    600: { l: baseColor.l - 10, c: baseColor.c * 1.05, h: baseColor.h },
    700: { l: baseColor.l - 20, c: baseColor.c * 1.1, h: baseColor.h },
    800: { l: baseColor.l - 30, c: baseColor.c * 1.0, h: baseColor.h },
    900: { l: baseColor.l - 40, c: baseColor.c * 0.9, h: baseColor.h },
  };
}

/**
 * Generate complementary color (opposite on color wheel)
 */
export function getComplementary(color: OklchColor): OklchColor {
  return adjustHue(color, 180);
}

/**
 * Generate analogous colors (adjacent on color wheel)
 */
export function getAnalogous(color: OklchColor): [OklchColor, OklchColor] {
  return [adjustHue(color, -30), adjustHue(color, 30)];
}

/**
 * Generate triadic colors (evenly spaced on color wheel)
 */
export function getTriadic(color: OklchColor): [OklchColor, OklchColor] {
  return [adjustHue(color, 120), adjustHue(color, 240)];
}

// ============================================================================
// Color Validation
// ============================================================================

/**
 * Check if color is within sRGB gamut
 */
export function isInGamut(color: OklchColor): boolean {
  const rgb = oklchToRgb(color);
  return (
    rgb.r >= 0 &&
    rgb.r <= 255 &&
    rgb.g >= 0 &&
    rgb.g <= 255 &&
    rgb.b >= 0 &&
    rgb.b <= 255
  );
}

/**
 * Clamp color to sRGB gamut
 */
export function clampToGamut(color: OklchColor): OklchColor {
  if (isInGamut(color)) return color;

  // Binary search to find maximum chroma within gamut
  let low = 0;
  let high = color.c;
  let result = { ...color, c: 0 };

  while (high - low > 0.001) {
    const mid = (low + high) / 2;
    const test = { ...color, c: mid };
    if (isInGamut(test)) {
      low = mid;
      result = test;
    } else {
      high = mid;
    }
  }

  return result;
}

// ============================================================================
// Contrast Calculation
// ============================================================================

/**
 * Calculate WCAG contrast ratio between two colors
 */
export function getContrastRatio(
  color1: OklchColor,
  color2: OklchColor,
): number {
  const rgb1 = oklchToRgb(color1);
  const rgb2 = oklchToRgb(color2);

  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast meets WCAG AA standard (4.5:1 for normal text)
 */
export function meetsWcagAA(
  textColor: OklchColor,
  bgColor: OklchColor,
  isLargeText = false,
): boolean {
  const ratio = getContrastRatio(textColor, bgColor);
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Check if contrast meets WCAG AAA standard (7:1 for normal text)
 */
export function meetsWcagAAA(
  textColor: OklchColor,
  bgColor: OklchColor,
  isLargeText = false,
): boolean {
  const ratio = getContrastRatio(textColor, bgColor);
  return isLargeText ? ratio >= 4.5 : ratio >= 7;
}
