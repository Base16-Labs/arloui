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
import { useMemo } from 'react';
import { Animated, Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { rgbaFromHex } from '@arloui/tokens';
import { haptic } from '../../foundation/haptics';
import { useTokens } from '../../foundation/theme-provider';
import type { ChartPoint } from './core';
import { useSkeletonPulse } from './hooks';

export type HeatmapDatum = ChartPoint & {
  /** A timestamp, an ISO string, or a `Date` — normalised to local midnight. */
  date: string | number | Date;
};

export type HeatmapProps = {
  /** Dated values. A day with no entry renders empty, not absent. */
  data: readonly HeatmapDatum[];
  /** Filled intensity steps above "none". Default 3. */
  levels?: number;
  /** Grid start; defaults to the earliest datum, wound back to Monday. */
  from?: string | number | Date;
  /** Grid end; defaults to the latest datum, run on to Sunday. */
  to?: string | number | Date;
  /** Weekday initials over the columns. On by default. */
  showDayLabels?: boolean;
  /** The Less–More scale under the grid. On by default. */
  showScale?: boolean;
  /** Tapping a day. Without this the grid is one image, not forty-two buttons. */
  onSelect?: (datum: HeatmapDatum | null, date: Date) => void;
  /** Formats a day's value in its accessibility label. */
  format?: (value: number) => string;
  /** Pulses the empty grid instead of the data. */
  loading?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

const DAY_INITIALS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

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

export function Heatmap({
  data,
  levels = 3,
  from,
  to,
  showDayLabels = true,
  showScale = true,
  onSelect,
  format,
  loading = false,
  accessibilityLabel,
  style,
}: HeatmapProps) {
  const t = useTokens();
  const pulse = useSkeletonPulse(t.motion.duration.slow);
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

  return (
    <View style={[{ gap: t.spacing[2] }, style]}>
      {/* `Animated.View`, not `View`: the pulse is an Animated.Value, and a plain
          view would hand the native side an object where it expects a number. */}
      <Animated.View
        accessible={!interactive}
        accessibilityRole={interactive ? undefined : 'image'}
        accessibilityLabel={interactive ? undefined : summary}
        style={{ gap: 5, opacity: loading ? pulse : 1 }}
      >
        {showDayLabels ? (
          <View style={{ flexDirection: 'row', gap: 5 }}>
            {DAY_INITIALS.map((initial, index) => (
              <Text
                key={`${initial}-${index}`}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  color: t.colors.textTertiary,
                  fontFamily: t.fontFamilies.sans,
                  fontSize: 10,
                  lineHeight: 12,
                  fontWeight: '600',
                }}
              >
                {initial}
              </Text>
            ))}
          </View>
        ) : null}

        {weeks.map((week, weekIndex) => (
          <View key={`week-${weekIndex}`} style={{ flexDirection: 'row', gap: 5 }}>
            {week.map((cell) => {
              const datum = loading ? null : (byDay.get(cell.key) ?? null);
              const level = datum ? levelFor(datum.value) : 0;
              const backgroundColor = loading ? t.colors.surfaceInput : levelColor(level);
              const square = {
                flex: 1,
                aspectRatio: 1,
                borderRadius: 3,
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
        ))}
      </Animated.View>

      {showScale && !loading ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text
            style={{
              color: t.colors.textTertiary,
              fontFamily: t.fontFamilies.sans,
              fontSize: 11,
              lineHeight: 14,
            }}
          >
            Less
          </Text>
          {Array.from({ length: levels + 1 }, (_, level) => (
            <View key={level} style={{ width: 11, height: 11, borderRadius: 3, backgroundColor: levelColor(level) }} />
          ))}
          <Text
            style={{
              color: t.colors.textTertiary,
              fontFamily: t.fontFamilies.sans,
              fontSize: 11,
              lineHeight: 14,
            }}
          >
            More
          </Text>
        </View>
      ) : null}
    </View>
  );
}
