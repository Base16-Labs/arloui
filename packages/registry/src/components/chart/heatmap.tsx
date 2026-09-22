/**
 * Arlo UI — Heatmap
 *
 * A calendar of filled and empty squares: streaks, consistency, "show up" grids.
 * The mark is so simple it needs no charting library and no axes — a square is
 * either a day with something in it or a day without, and the ramp only ever
 * says *how much*, never *which kind*, of activity.
 *
 *   <Chart.Heatmap data={[{ date: '2026-03-01', value: 2 }]} onSelect={...} />
 *
 * The headline streak count is the app's to compose — the grid is the component,
 * the number is the story, and the two do not have to load together.
 *
 * Deliberate choices:
 *
 * - **Monday-first columns, one week per row.** A month grid is read as "week
 *   across, weekday down"; the M T W T F S S header pins the columns so an
 *   unlabelled ramp of squares never has to be decoded.
 * - **The ramp is one hue, in tints of the brand.** Intensity is a magnitude, so
 *   it does not spend the categorical palette — and tints of `interactivePrimary`
 *   survive both modes because they are derived from it, not chosen beside it.
 * - **Empty days are the input track, not white.** The grid has to read on any
 *   surface, and a hard-coded empty square is a white square in dark mode.
 * - **Days with no datum are empty, not absent.** `from`/`to` pad the grid to
 *   whole weeks so the columns line up; a gap in the data is information.
 * - **Selection is per day, and only when asked.** Without an `onSelect` the grid
 *   is one image to a screen reader — forty-two tappable squares is not a
 *   control surface, it is noise.
 */
import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Animated, Easing, Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { rgbaFromHex } from '../../foundation/tokens';
import { haptic } from '../../foundation/haptics';
import { EmptyContent, type ChartEmptyProps } from './empty';
import { useTokens } from '../../foundation/theme-provider';
import { chartChrome } from './core';
import { ChartLoading, ChartMotion, useReduceMotion } from './hooks';
import { BAR_ENTER_STAGGER } from './motion';
import type { ChartPoint } from './core';
import { collectParts, hasPart, useSkeletonPulse, warnDroppedDefaults } from './hooks';

export type HeatmapDatum = ChartPoint & {
  /** A timestamp, an ISO string, or a `Date` — normalised to local midnight. */
  date: string | number | Date;
};

export type HeatmapProps = {
  /** Animate entry and updates. Device Reduce Motion always takes precedence. Default: true. */
  animated?: boolean;
  /** Dated values. A day with no entry renders empty, not absent. */
  data: readonly HeatmapDatum[];
  /** Filled intensity steps above "none". Default 3. */
  levels?: number;
  /** Grid start; defaults to the earliest datum, wound back to Monday. */
  from?: string | number | Date;
  /** Grid end; defaults to the latest datum, run on to Sunday. */
  to?: string | number | Date;
  /** Tapping a day. Without this the grid is one image, not forty-two buttons. */
  onSelect?: (datum: HeatmapDatum | null, date: Date) => void;
  /** Formats a day's value in its accessibility label. */
  format?: (value: number) => string;
  /**
   * The composed empty slot — headline, one line, one action — the same one
   * every other form draws.
   *
   * A heatmap of empty squares is usually the data ("you showed up zero days"),
   * which is why the grid is not treated as empty just because every value is.
   * But with no data *and* no `from`/`to` there is no month to draw at all, and
   * that is a genuinely empty chart rather than a quiet one.
   */
  empty?: ChartEmptyProps;
  /** Rendered in place of the grid when there is no range to draw. */
  emptyLabel?: string;
  /** Pulses the empty grid instead of the data. */
  loading?: boolean;
  /** Keep the last supplied data visible during a background fetch. Overrides loading. */
  refreshing?: boolean;
  /** Overrides the summary read to assistive tech, which otherwise gives the range and its busiest day. */
  accessibilityLabel?: string;
  /** Style for the grid's outer container. */
  style?: StyleProp<ViewStyle>;
  /**
   * The composed form: `<Heatmap.DayLabels />` rather than `showDayLabels`,
   * `<Heatmap.Scale />` rather than `showScale`. Omit it and the map renders
   * exactly as it always has.
   */
  children?: ReactNode;
};

/**
 * The grid's own scale.
 *
 * A heatmap is a lattice, not a mark on an axis, so its gutter and key swatch
 * are sized against the cell rather than against `spacing` or `densityMetrics`.
 * Five points is the widest gutter that still reads as one surface at a year's
 * width; the key squares match a cell at that size.
 */
const CELL_GAP = 5;
const KEY_SWATCH = 11;
/** Weekday initials sit a notch under the scale caption and ride tight to the columns. */
const DAY_INITIAL_SIZE = 10;
const DAY_INITIAL_LINE_HEIGHT = 12;
/** The Less–More caption, at the default label size. */
const SCALE_CAPTION_SIZE = 11;

const DAY_INITIALS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

/** How far a week sits before it settles on first paint. */
const WEEK_TRAVEL = 6;

/**
 * One week of the first-paint stagger. Opacity and a short settle, not a colour
 * tween: a cell's fill is its datum, and animating it would count the days.
 */
function HeatmapWeekEnter({ index, children }: { index: number; children: ReactNode }) {
  const t = useTokens();
  const reduced = useReduceMotion();
  const [opacity] = useState(() => new Animated.Value(reduced ? 1 : 0));
  const {
    duration,
    easing: [x1, y1, x2, y2],
  } = t.motion.chart.enter;
  useEffect(() => {
    opacity.stopAnimation();
    if (reduced) {
      opacity.setValue(1);
      return;
    }
    opacity.setValue(0);
    // Delay via timeout, not `timing.delay`: stopping a delayed Animated.timing
    // in React Strict Mode leaves the value at 0 and the second start is a no-op.
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        easing: Easing.bezier(x1, y1, x2, y2),
        // JS driver: native driver never updates these views on web, so the
        // weeks would stay at opacity 0 after first paint.
        useNativeDriver: false,
      }).start();
    }, index * BAR_ENTER_STAGGER);
    return () => {
      clearTimeout(timer);
      opacity.stopAnimation();
    };
  }, [reduced, opacity, duration, x1, y1, x2, y2, index]);
  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY: opacity.interpolate({ inputRange: [0, 1], outputRange: [WEEK_TRAVEL, 0] }) }],
      }}
    >
      {children}
    </Animated.View>
  );
}

/** Local midnight of a day, as the number every lookup keys on. */
function dayKey(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function toDate(value: string | number | Date): Date {
  return value instanceof Date ? value : new Date(value);
}

/** The Monday at or before `date`, local midnight. */
function startOfWeek(date: Date): Date {
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const offset = (day.getDay() + 6) % 7; // Sunday -> 6, Monday -> 0.
  day.setDate(day.getDate() - offset);
  return day;
}

/** The Sunday at or after `date`, local midnight. */
function endOfWeek(date: Date): Date {
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const offset = 7 - ((day.getDay() + 6) % 7) - 1;
  day.setDate(day.getDate() + offset);
  return day;
}

type HeatmapResolved = HeatmapProps & {
  showDayLabels?: boolean;
  showScale?: boolean;
};

function HeatmapInner({
  data,
  levels = 3,
  from,
  to,
  showDayLabels = true,
  showScale = true,
  onSelect,
  format,
  empty,
  emptyLabel = 'No activity yet',
  loading = false,
  refreshing = false,
  accessibilityLabel,
  style,
}: HeatmapResolved) {
  const t = useTokens();
  const pulse = useSkeletonPulse(t.motion.duration.slow, loading);
  const [gridWidth, setGridWidth] = useState(0);
  const interactive = onSelect != null;

  const byDay = useMemo(() => {
    const map = new Map<number, HeatmapDatum>();
    for (const datum of data) map.set(dayKey(toDate(datum.date)), datum);
    return map;
  }, [data]);

  const { weeks, maxValue } = useMemo(() => {
    let maxValue = 0;
    for (const datum of data) if (datum.value > maxValue) maxValue = datum.value;

    const first = data[0]?.date;
    const last = data[data.length - 1]?.date;
    /*
     * No data and no explicit range: there is no month to draw, and inventing
     * "this week" would dress nothing up as somewhere. The grid stays empty and
     * the summary says so.
     */
    const start = from != null ? startOfWeek(toDate(from)) : first != null ? startOfWeek(toDate(first)) : null;
    let end = to != null ? endOfWeek(toDate(to)) : last != null ? endOfWeek(toDate(last)) : null;
    if (start == null || end == null) return { weeks: [], maxValue };
    if (end.getTime() < start.getTime()) end = start;

    const days: { key: number; date: Date }[] = [];
    const cursor = new Date(start);
    while (cursor.getTime() <= end.getTime()) {
      days.push({ key: dayKey(cursor), date: new Date(cursor) });
      cursor.setDate(cursor.getDate() + 1);
    }
    // One week per row: the grid is read as "week across, weekday down".
    const weeks: { key: number; date: Date }[][] = [];
    for (let index = 0; index < days.length; index += 7) {
      weeks.push(days.slice(index, index + 7));
    }
    return { weeks, maxValue };
  }, [data, from, to]);

  /**
   * Level 0 is "none"; 1..levels bucket the value's share of the busiest day.
   * Bucketing against the series max keeps the ramp relative — a grid of small
   * numbers still shows which days carried the week.
   */
  const levelFor = (value: number): number => {
    if (value <= 0 || maxValue <= 0) return 0;
    return Math.min(levels, Math.max(1, Math.ceil((value / maxValue) * levels)));
  };

  const levelColor = (level: number): string => {
    if (level <= 0) return t.colors.surfaceInput;
    const base = t.colors.interactivePrimary;
    if (!base.startsWith('#')) return base;
    const alpha = levels === 1 ? 1 : 0.25 + (0.75 * (level - 1)) / (levels - 1);
    return rgbaFromHex(base, alpha);
  };

  const activeDays = useMemo(
    () => weeks.flat().filter(({ key }) => (byDay.get(key)?.value ?? 0) > 0).length,
    [weeks, byDay],
  );

  const summary =
    accessibilityLabel ??
    (loading
      ? 'Heatmap loading'
      : weeks.length === 0
        ? 'No data'
        : `Heatmap, ${activeDays} of ${weeks.length * 7} days with activity`);

  const cellLabel = (datum: HeatmapDatum, date: Date) => {
    const when = date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
    const value = format ? format(datum.value) : String(datum.value);
    return `${when}, ${value}`;
  };

  /*
   * Nothing to draw at all — no data and no range — so the slot replaces the
   * grid rather than sitting inside it, the way it does on every other form.
   */
  if (!loading && weeks.length === 0) {
    return (
      <View style={[{ justifyContent: 'center' }, style]}>
        {empty ? <EmptyContent {...empty} /> : <EmptyContent title={emptyLabel} />}
      </View>
    );
  }

  return (
    <View style={[{ gap: t.spacing[2] }, style]}>
      {/* `Animated.View`, not `View`: the pulse is an Animated.Value, and a plain
          view would hand the native side an object where it expects a number. */}
      <Animated.View
        accessible={!interactive}
        accessibilityRole={interactive ? undefined : 'image'}
        accessibilityState={{ busy: loading || refreshing }}
        accessibilityLabel={interactive ? undefined : summary}
        onLayout={(event) => setGridWidth(event.nativeEvent.layout.width)}
        style={{ gap: CELL_GAP, opacity: loading ? pulse : 1 }}
      >
        {/*
          Weeks enter top to bottom — time in this grid runs down the rows.
          Day labels stay put, like axes on a plot. Cell colours never tween:
          intensity is the datum, and animating it would count the days.
        */}
        {showDayLabels ? (
          <View style={{ flexDirection: 'row', gap: CELL_GAP }}>
            {DAY_INITIALS.map((initial, index) => (
              <Text
                key={`${initial}-${index}`}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  color: t.colors.textTertiary,
                  fontFamily: t.fontFamilies.sans,
                  fontSize: DAY_INITIAL_SIZE,
                  lineHeight: DAY_INITIAL_LINE_HEIGHT,
                  fontWeight: t.fontWeights.semibold,
                }}
              >
                {initial}
              </Text>
            ))}
          </View>
        ) : null}

        {weeks.map((week, weekIndex) => {
          const row = (
            <View style={{ flexDirection: 'row', gap: CELL_GAP }}>
              {week.map((cell) => {
                const datum = loading ? null : (byDay.get(cell.key) ?? null);
                const level = datum ? levelFor(datum.value) : 0;
                const backgroundColor = loading ? t.colors.surfaceInput : levelColor(level);
                const square = {
                  flex: 1,
                  aspectRatio: 1,
                  borderRadius: chartChrome.swatchRadius,
                  backgroundColor,
                } as const;

                if (!interactive || loading || !datum) {
                  return <View key={cell.key} style={square} />;
                }

                return (
                  <Pressable
                    key={cell.key}
                    accessibilityRole="button"
                    accessibilityLabel={cellLabel(datum, cell.date)}
                    onPress={() => {
                      void haptic('selection');
                      onSelect(datum, cell.date);
                    }}
                    style={square}
                  />
                );
              })}
            </View>
          );
          if (loading) return <View key={`week-${weekIndex}`}>{row}</View>;
          return (
            <HeatmapWeekEnter key={`week-${weekIndex}`} index={weekIndex}>
              {row}
            </HeatmapWeekEnter>
          );
        })}
      </Animated.View>

      {showScale && !loading ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: chartChrome.labelGap }}>
          <Text
            style={{
              color: t.colors.textTertiary,
              fontFamily: t.fontFamilies.sans,
              fontSize: SCALE_CAPTION_SIZE,
              lineHeight: chartChrome.labelLineHeight,
            }}
          >
            Less
          </Text>
          {Array.from({ length: levels + 1 }, (_, level) => (
            <View key={level} style={{ width: KEY_SWATCH, height: KEY_SWATCH, borderRadius: chartChrome.swatchRadius, backgroundColor: levelColor(level) }} />
          ))}
          <Text
            style={{
              color: t.colors.textTertiary,
              fontFamily: t.fontFamilies.sans,
              fontSize: SCALE_CAPTION_SIZE,
              lineHeight: chartChrome.labelLineHeight,
            }}
          >
            More
          </Text>
        </View>
      ) : null}
    </View>
  );
}

/* ------------------------------------------------------------------------- *
 * The composed form — see `collectParts` in `hooks.ts`.
 * ------------------------------------------------------------------------- */

/** The weekday initials down the left edge of the grid. */
function HeatmapDayLabelsPart(): ReactNode {
  return null;
}

/** The Less-to-More key under the grid, showing what each level of fill means. */
function HeatmapScalePart(): ReactNode {
  return null;
}

function resolveComposition(props: HeatmapProps): HeatmapResolved {
  const { children, ...rest } = props;
  // The one-liner: the grid with its gutter and key.
  /*
   * `undefined`, not `== null`: an absent `children` is "give me the defaults",
   * while an explicit `{null}` is "I named nothing, draw nothing". Without the
   * distinction there is no way to ask for a bare mark — no zero rule, no
   * labels — short of an empty fragment, which reads like a mistake.
   */
  if (children === undefined) return { ...rest, showDayLabels: true, showScale: true };
  const parts = collectParts(children);
  const showDayLabels = hasPart(parts, HeatmapDayLabelsPart);
  const showScale = hasPart(parts, HeatmapScalePart);
  // Both are in the default: without the initials the columns are unlabelled,
  // and without the key the fill levels mean nothing.
  warnDroppedDefaults(children === null ? '' : 'Chart.Heatmap', [
    ...(showDayLabels ? [] : ['<Chart.Heatmap.DayLabels />']),
    ...(showScale ? [] : ['<Chart.Heatmap.Scale />']),
  ]);

  return { ...rest, showDayLabels, showScale };
}

function HeatmapRoot(props: HeatmapProps) {
  return <ChartMotion animated={props.animated}><ChartLoading loading={props.loading} refreshing={props.refreshing}>{(loading) => <HeatmapInner {...resolveComposition(props)} loading={loading} />}</ChartLoading></ChartMotion>;
}

/** The parts, for `Chart.Heatmap.Scale` and friends. */
export const HeatmapParts = {
  DayLabels: HeatmapDayLabelsPart,
  Scale: HeatmapScalePart,
};

export const Heatmap = Object.assign(HeatmapRoot, HeatmapParts);
