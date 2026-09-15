/**
 * Arlo UI — Bar chart, shared
 *
 * The vocabulary both layouts speak: the props they are handed, the spacing and
 * density tables, and the two small marks (skeleton, reference rule) that look
 * the same whichever way the categories run.
 *
 * It exists so `bar-vertical` and `bar-horizontal` can share without importing
 * each other or reaching back into `bar-chart`, which imports them.
 */
import type { ReactNode } from 'react';
import { Animated, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTokens } from '../../foundation/theme-provider';
import {
  barPath,
  densityMetrics,
  type ChartChrome,
  type ChartDensity,
  type ChartPoint,
  type ChartReference,
  type ChartTone,
} from './core';
import { type ChartEmptyProps } from './empty';
import { useReduceMotion, useSkeletonPulse } from './hooks';

/** A bar needs a name, so `label` is required here even though `ChartPoint`'s is not. */
/**
 * What the renderers take: the public props plus everything the parts resolve
 * to. Presence lives in the tree now, so these are no longer anyone's to pass —
 * `resolveComposition` is the only thing that fills them in.
 */
export type BarChartResolved = Omit<BarChartProps, 'data'> & {
  data: readonly BarDatum[] | readonly number[];
  series?: readonly BarSeries[];
  legend?: readonly string[];
  chrome?: ChartChrome;
  reference?: ChartReference;
  showValues?: boolean;
  showLabels?: boolean;
};

export type BarDatum = ChartPoint & {
  label: string;
  /** Overrides the resolved colour for this bar alone. Single-series only. */
  color?: string;
};

/** How two or more series share a category. */
export type BarChartVariant = 'grouped' | 'stacked';

export type BarChartLayout = 'vertical' | 'horizontal';

/**
 * How much of its slot a category's mark takes up.
 *
 * A **fraction**, not a fixed gap. The gap used to be 1–2pt whatever the chart
 * was, which is a different picture at seven bars than at thirty: seven bars in
 * 350pt read as one solid block with hairlines scored into it. A fraction of the
 * slot looks the same at any count, which is what makes it a token rather than a
 * number someone tuned for one screenshot.
 *
 * `default` is 0.78 — the ratio the design file uses (a 34pt bar in a 44pt slot).
 */
export type BarChartSpacing = 'tight' | 'default' | 'loose';

export const SPACING_FILL: Record<BarChartSpacing, number> = {
  tight: 0.94,
  default: 0.78,
  loose: 0.58,
};

/**
 * The same idea on the axis rows run along.
 *
 * Categories in a vertical chart march across the width, so spacing is how much
 * of its slot a bar fills. In a row chart they march *down*, so spacing is the
 * gap between rows. It is one question — how much air is between the marks —
 * asked of whichever axis the categories happen to use, which is why the control
 * should not go dead when the layout flips.
 *
 * A multiplier on the density-provided gap rather than a second set of absolute
 * values: density decides how tight the rows are to begin with, and spacing
 * moves them from there.
 */
export const SPACING_ROW_GAP: Record<BarChartSpacing, number> = {
  tight: 0.5,
  default: 1,
  loose: 1.9,
};

export type BarSeries = readonly (BarDatum | number)[];

export type BarChartProps = {
  /** Animate entry and updates. Device Reduce Motion always takes precedence. Default: true. */
  animated?: boolean;
  /**
   * The first series. Bars want labels, so a bare `number[]` gets index labels.
   *
   * Optional because `<BarChart.Series>` can supply it instead — one or the
   * other, and a `Series` child wins.
   */
  data?: readonly BarDatum[] | readonly number[];
  /** How the series share each category. Grouped by default. */
  variant?: BarChartVariant;
  /** Vertical bars, or the same categories as ranked horizontal rows. */
  layout?: BarChartLayout;
  /**
   * How much air is between the marks.
   *
   * Vertical: how much of its slot each bar fills — the tap target stays the
   * whole slot, so loosening the bars never shrinks what you can hit.
   * Horizontal: the gap between rows. Same question, whichever axis the
   * categories run along.
   */
  spacing?: BarChartSpacing;
  /** How tall the bars box is. Ignored for `layout="horizontal"`, which grows with its rows. */
  height?: number;
  /**
   * Honours `brand` (default), `series`, `auto` (colour by sign), `positive`,
   * `negative`, and `neutral` — for a single series. With `series`, every bar
   * takes its own palette slot and this is ignored.
   */
  tone?: ChartTone;
  /** How much mark there is: stroke, corner radius, and the gap between bars. */
  density?: ChartDensity;
  /** Selected category. Controlled when passed; `defaultActiveIndex` seeds the internal one. */
  activeIndex?: number | null;
  /** Which category starts selected when selection is uncontrolled. */
  defaultActiveIndex?: number | null;
  /** Called with the tapped category's index and datum. Passing it is what makes bars tappable. */
  onSelect?: (index: number, datum: BarDatum) => void;
  /** Formats every number the chart shows — value labels, the reference chip, the selected readout. */
  format?: (value: number) => string;
  /** Force the top of the scale; otherwise it comes from the data. */
  maxValue?: number;
  /** Rendered in place of the bars when `data` is empty. */
  emptyLabel?: string;
  /**
   * The composed empty slot — headline, one line, one action — the same one
   * `Chart.Empty` draws. Wins over `emptyLabel`, which stays for the case where
   * a bare string genuinely is the right answer.
   *
   * A bar chart with nothing in it is exactly as empty as a plot with nothing in
   * it, so the two must not say so differently.
   */
  empty?: ChartEmptyProps;
  /**
   * Draws grey bars at a fixed profile instead of the data. Same footprint as the
   * loaded chart — the row does not reflow when the values land, and the labels
   * stay off because a skeleton with real category names is half-loaded, not
   * loading.
   */
  loading?: boolean;
  /** Keep the last supplied data visible during a background fetch. Overrides loading. */
  refreshing?: boolean;
  /** Overrides the summary read to assistive tech, which otherwise describes the series. */
  accessibilityLabel?: string;
  /** Style for the chart's outer container. */
  style?: StyleProp<ViewStyle>;
  /**
   * The composed form. Each part's presence in the tree is the switch —
   * `<BarChart.Values />` rather than `showValues`, `<BarChart.Baseline />`
   * rather than `chrome="baseline"`. See `resolveComposition`.
   *
   * Omit it and the chart renders exactly as it always has.
   */
  children?: ReactNode;
};

/**
 * How much of an unselected category's colour survives. Low enough that the
 * selected one is unmistakably the subject, high enough that the others still
 * read as bars — for the default brand blue this lands on a light blue.
 */
export const DIMMED_ALPHA = 0.22;
export const LABEL_HEIGHT = 18;
export const VALUE_HEIGHT = 16;


export function normalizeBars(
  data: readonly (BarDatum | number)[],
  fallbackLabels?: readonly string[],
): BarDatum[] {
  return (data as ReadonlyArray<number | BarDatum>).map((entry, index) =>
    typeof entry === 'number'
      ? { value: entry, label: fallbackLabels?.[index] ?? String(index + 1) }
      : { ...entry, label: entry.label ?? fallbackLabels?.[index] ?? String(index + 1) },
  );
}

/**
 * The silhouette drawn while `loading`.
 *
 * Bars, not a spinner: the skeleton has to hold the same footprint the data will,
 * so the row does not reflow when it lands. Equal heights avoid suggesting
 * category rankings before their values are available.
 */
export const SKELETON_HEIGHTS = [0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6];

export function BarSkeleton({
  width,
  height,
  count,
  spacing,
  radius,
}: {
  width: number;
  height: number;
  count: number;
  spacing: BarChartSpacing;
  radius: number;
}) {
  const t = useTokens();
  const pulse = useSkeletonPulse(t.motion.duration.slow);
  if (width === 0) return null;

  // The same slot arithmetic the loaded chart uses, so the silhouette holds the
  // exact footprint and nothing shifts sideways when the data lands.
  const slot = count > 0 ? width / count : 0;
  const barWidth = Math.max(0, slot * SPACING_FILL[spacing]);
  const markInset = Math.max(0, (slot - barWidth) / 2);
  const bars = Array.from({ length: count }, (_, index) => {
    const fraction = SKELETON_HEIGHTS[index % SKELETON_HEIGHTS.length] ?? 0.5;
    const barHeight = height * fraction;
    return barPath({
      x: index * slot + markInset,
      y: height - barHeight,
      width: barWidth,
      height: barHeight,
      radius,
      roundedEnd: 'top',
    });
  });
  return (
    <Animated.View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, { opacity: pulse }]}
    >
      <Svg width={width} height={height}>
        {bars.map((d, index) => (
          <Path
            key={index}
            d={d}
            // `surfaceStrong`, the skeleton material the plot and the readouts
            // use. This was `surfaceInput`, a token lighter in light mode and
            // near-invisible against the surface in dark.
            fill={t.colors.surfaceStrong}
          />
        ))}
      </Svg>
    </Animated.View>
  );
}

/**
 * The labelled dashed line — a budget, an average — with its chip at the right
 * edge. The chip is opaque on purpose: it sits over the line it names, so the
 * line can run the full width and the two never have to agree on arithmetic.
 */
export function ReferenceLine({ y, width, label }: { y: number; width: number; label: string }) {
  const t = useTokens();
  return (
    <>
      <Svg
        width={width}
        height={1}
        style={{ position: 'absolute', left: 0, top: y }}
        pointerEvents="none"
      >
        <Path
          d={`M0,0.5 L${width.toFixed(2)},0.5`}
          stroke={t.colors.focusRingMain}
          strokeWidth={1}
          strokeDasharray="4 4"
          fill="none"
        />
      </Svg>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          right: 0,
          top: y - 9,
          backgroundColor: t.colors.feedbackInfoBg,
          borderRadius: 6,
          paddingHorizontal: 10,
          paddingVertical: 2,
        }}
      >
        <Text
          style={{
            color: t.colors.textInteractiveTertiary,
            fontFamily: t.fontFamilies.sans,
            fontSize: 10,
            lineHeight: 14,
            fontWeight: '700',
          }}
        >
          {label}
        </Text>
      </View>
    </>
  );
}

/* ------------------------------------------------------------------------- *
 * The composed form — see `collectParts` in `hooks.ts` for why parts are read
 * rather than rendered.
 * ------------------------------------------------------------------------- */
