/**
 * Resolve an `--ax-*` design token to a concrete colour string for chart
 * libraries. Chart.js (and most canvas chart libs) cannot parse a CSS
 * `var(--ax-*)` expression — they need a real colour. This reads the
 * token off `:root` at call time so the chart follows the active theme,
 * and falls back to a hex when the token is unavailable (SSR, or a
 * missing token). The hex fallbacks live here, not in the component, so
 * chart components stay free of hardcoded colours.
 *
 * Mirrors apps/web/src/app/shared/utils/chart-color.util.ts — kept as a
 * separate copy because libs/aegisx-ui must not depend on apps/web.
 */
const CHART_COLOR_FALLBACK: Record<string, string> = {
  '--ax-dashboard-accent': '#3b82f6',
  '--ax-dashboard-accent-soft': '#93c5fd',
};

export function axChartColor(token: string): string {
  const fallback = CHART_COLOR_FALLBACK[token] ?? '#000000';
  if (typeof document === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(token)
    .trim();
  return value || fallback;
}
