/**
 * Arlo UI — Chart plot
 *
 * The mark itself: the line, its fill, the optional compare line, stacked
 * bands, likely-range band, bar marks, and the scrub gesture that drives the
 * readouts. Everything measured on one scale — see `extrasRange`.
 */
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Animated,
  Easing,
  PanResponder,
  Platform,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop, Circle, Line, ClipPath, G } from 'react-native-svg';
import { rgbaFromHex } from '@arloui/tokens';
import { haptic } from '../../foundation/haptics';
import { useTokens } from '../../foundation/theme-provider';
import {
  areaPath,
  bandPath,
  barPath,
  densityMetrics,
  linePath,
  makeScale,
  resample,
  interpolateSeries,
  seriesColorAt,
  toneColor,
  toPoints,
  valuesOf,
  type ChartChrome,
  type ChartCurve,
  type ChartData,
  type ChartReference,
} from './core';
import { EmptyContent } from './empty';
import { useChart } from './chart-context';
import { allParts, collectParts, useReduceMotion } from './hooks';
import { useChartEntrance } from './hooks';
import { ChartFill, ChartReveal } from './motion';
import { ChartLegend } from './legend';
import { PlotPlaceholder } from './skeleton';

export type ChartRange = { lower: ChartData; upper: ChartData };

export type ChartPlotProps = {
  /** How tall the plot box is, in points. The width comes from the parent. */
  height?: number;
  /** Fade a gradient under the line. */
  fill?: boolean;
  /** Turn off scrubbing for a static, decorative plot. */
  /** Straight segments (default) or a fitted spline. See `ChartCurve`. */
  curve?: ChartCurve;
  /** Overrides the root's `chrome` for this plot. */
  /** One reference line, or several — the min/max pair a dense series reads against. */
  /**
   * A second series, drawn dashed in the neutral hue — the baseline a projection
   * is measured against. It never takes the scrub: one series answers to the
   * finger, the other is context.
   */
  compare?: ChartData;
  /**
   * A shaded band between two bounds — the "likely range" behind a projection.
   * A prop on `Chart.Plot` rather than a new form: the readout, the scrub, and the tone
   * all still belong to the primary series.
   */
  range?: ChartRange;
  /**
   * Marks drawn inside this plot, sharing its scale and its scrub —
   * `<Chart.Bars data={volume} />` behind a line is the combo chart.
   *
   * They are read, not rendered: the plot measures them into its own domain and
   * paints them itself, so the bars land under the line rather than wherever the
   * element sits in the tree, and one PanResponder still owns the gesture.
   */
  children?: ReactNode;
  /**
   * Series stacked on top of the primary — part-to-total over time, the shape a
   * bar chart draws with `variant="stacked"` when the x-axis is continuous
   * rather than categorical.
   *
   * Each entry is added to the running total, so the top edge of the last layer
   * is the sum of everything. They take the categorical palette and are drawn as
   * filled bands, not lines: a stack is read by the thickness of each layer, and
   * outlining every one turns it back into a set of overlapping lines.
   *
   * `stack` is distinct from `compare`, which is a *second* series measured
   * against the first rather than added to it — and from `range`, which is one
   * band around one series. Stacking implies the parts sum to something
   * meaningful; the other two do not.
   *
   * The primary still owns the scrub, the readout, and the tone. Negatives are
   * clamped to zero, matching the bar chart: a negative share of a total is not
   * a thing the shape can express.
   */
  stack?: readonly ChartData[];
  /** Stacked-series colors, primary first. Missing slots use the theme palette. */
  stackColors?: readonly string[];
  /**
   * Floating readout pill above the crosshair while scrubbing, showing the
   * formatted value of the point under the finger. The big `Chart.Value` stays
   * the primary readout — this is for dense series where the eye is on the plot,
   * not above it.
   */
  tooltip?: boolean;
  /** Shown when the series is empty. `Chart.Empty` wins over this. */
  emptyLabel?: string;
  /** Shown for a one-point series, which has no shape to draw. */
  notEnoughLabel?: string;
  /** Announced by screen readers in place of the visual plot. */
  accessibilityLabel?: string;
  /** Style for the plot box. */
  style?: StyleProp<ViewStyle>;
};


/**
 * The mark itself — the line, and whatever else is named inside it.
 *
 * Its children are what gets drawn in the box: `Line` and `Bars` for extra
 * marks, `Baseline` and `Reference` for furniture, `Crosshair` for the scrub.
 * With no children it draws the line and the zero rule and answers a touch.
 */
export function ChartPlot({
  height = 180,
  fill = true,
  curve = 'steep',
  compare,
  stack,
  stackColors,
  range,
  children,
  tooltip = false,
  emptyLabel = 'No data',
  notEnoughLabel = 'Not enough data',
  accessibilityLabel,
  style,
}: ChartPlotProps) {
  const t = useTokens();
  const {
    points,
    values,
    activeIndex,
    setActiveIndex,
    color,
    baseline,
    min,
    max,
    span,
    first,
    last,
    density,
    format,
    loading,
    empty,
  } = useChart();
  /*
   * No children is the default composition — the zero rule and nothing else —
   * so `<Chart.Plot />` draws what it always drew. Name any child and the plot
   * draws only what was named, the same inversion every other form uses.
   */
  const declaredChrome = useMemo(() => {
    // See the note in `bar-chart`: `{null}` is a deliberate empty tree.
    if (children === undefined)
      return { chrome: 'baseline' as ChartChrome, reference: undefined, crosshair: true };
    const parts = collectParts(children);
    const named = allParts<ChartReferenceProps>(parts, ChartReferencePart);
    return {
      chrome: (named.length > 0
        ? 'reference'
        : parts.has(ChartBaselinePart)
          ? 'baseline'
          : 'none') as ChartChrome,
      reference: named.length > 0 ? named : undefined,
      crosshair: parts.has(ChartCrosshairPart),
    };
  }, [children]);
  const chrome = declaredChrome.chrome;
  const scrubbable = declaredChrome.crosshair;
  const reference = declaredChrome.reference;
  /*
   * `reference` accepts one line or the min/max pair. Normalising here keeps
   * every draw site a loop over a list rather than a branch per arity.
   */
  const references = useMemo(() => {
    if (reference == null) return [];
    return (Array.isArray(reference) ? reference : [reference]).filter(
      (entry) => typeof entry?.value === 'number',
    );
  }, [reference]);
  const metrics = densityMetrics(density);
  const inset = metrics.inset;

  const compareValues = useMemo(() => (compare ? valuesOf(toPoints(compare)) : []), [compare]);

  /**
   * The bar marks this plot was given, as plain values.
   *
   * A combo chart is one scale with two kinds of mark on it. Bars measured on a
   * scale of their own would sit at plausible-looking but wrong heights against
   * the line — the failure is silent, which is why they go through the same
   * `extrasRange` union every other extra does.
   */
  /** The extra line marks, in tree order — see `barMarks` for why they are read. */
  const lineMarks = useMemo(() => {
    const declared = allParts<ChartLineProps>(collectParts(children), ChartLinePart);
    return declared.map((mark, index) => ({
      values: valuesOf(toPoints(mark.data)),
      color: mark.color,
      dashed: mark.dashed ?? false,
      label: mark.label,
      slot: index,
    }));
  }, [children]);

  const barMarks = useMemo(() => {
    const declared = allParts<ChartBarsProps>(collectParts(children), ChartBarsPart);
    return declared.map((mark) => ({
      values: valuesOf(toPoints(mark.data)),
      color: mark.color,
      opacity: mark.opacity ?? 0.35,
    }));
  }, [children]);

  /**
   * The stack as cumulative top edges, outermost last.
   *
   * Each layer carries the running total rather than its own value, because that
   * is what gets drawn: a stacked area is a set of nested areas, and the band a
   * reader sees is the gap between one cumulative edge and the one below it.
   * Summing at draw time instead would recompute the same totals per frame.
   */
  const stackLayers = useMemo(() => {
    if (!stack || stack.length === 0) return [];
    const layers: number[][] = [];
    let running = values.slice();
    for (const entry of stack) {
      const next = valuesOf(toPoints(entry));
      running = running.map((total, index) => total + Math.max(0, next[index] ?? 0));
      layers.push(running);
    }
    return layers;
  }, [stack, values]);
  const upperValues = useMemo(() => (range ? valuesOf(toPoints(range.upper)) : []), [range]);
  const lowerValues = useMemo(() => (range ? valuesOf(toPoints(range.lower)) : []), [range]);

  const [width, setWidth] = useState(0);
  const reduceMotion = useReduceMotion();
  const count = points.length;

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  }, []);

  /*
   * Period morph. Two periods are different *lengths*, so there is nothing to
   * tween between until both ends are resampled onto a common length — then it is
   * one number per point. What gets drawn mid-flight is the interpolated series;
   * what it lands on is always the real one, so no frame of this is data the
   * chart invented and kept.
   */
  const [morphValues, setMorphValues] = useState<number[] | null>(null);
  const previousValues = useRef<number[]>(values);
  // Lazy `useState`, not `useRef(new Animated.Value())`: the ref form allocates a
  // throwaway Value every render and reads `.current` during render, which is what
  // the refs lint rule exists to catch.
  const [progress] = useState(() => new Animated.Value(1));

  useEffect(() => {
    const from = previousValues.current;
    const to = values;

    const unchanged = from.length === to.length && from.every((v, i) => v === to[i]);
    // A first paint has nothing to morph from, and a scrub in flight must not be
    // interrupted by the line moving under the finger.
    if (unchanged || from.length === 0 || to.length === 0 || reduceMotion) {
      previousValues.current = to;
      setMorphValues(null);
      return;
    }

    const frames = Math.max(from.length, to.length);
    const a = resample(from, frames);
    const b = resample(to, frames);

    progress.setValue(0);
    setMorphValues(a);
    const id = progress.addListener(({ value: p }) => {
      const next = interpolateSeries(a, b, p);
      previousValues.current = next;
      setMorphValues(next);
    });
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: t.motion.chart.data.duration,
      easing: Easing.bezier(...t.motion.chart.data.easing),
      // Path `d` is a string built in JS — there is no native equivalent to drive.
      useNativeDriver: false,
    });
    animation.start(({ finished }) => {
      // Land on the real series, not on the last interpolated frame.
      if (finished) {
        previousValues.current = to;
        setMorphValues(null);
      }
    });
    return () => {
      animation.stop();
      progress.removeListener(id);
    };
  }, [values, progress, reduceMotion, t.motion.chart.data.duration, t.motion.chart.data.easing]);

  /*
   * Mid-morph the drawn series is the interpolated one, so the scale has to be
   * built from whatever is actually on screen — otherwise a series moving into a
   * new range would clip against the old one for the length of the tween.
   */
  const drawnValues = morphValues ?? values;

  /*
   * The scale has to fit everything that is drawn, not just the primary series —
   * a compare line or a band that pokes past the primary's extremes would clip.
   * The extras are static per layout, so the union is one scan.
   */
  const extrasRange = useMemo(() => {
    let lo = Number.POSITIVE_INFINITY;
    let hi = Number.NEGATIVE_INFINITY;
    for (const list of [compareValues, upperValues, lowerValues, ...stackLayers, ...barMarks.map((m) => m.values), ...lineMarks.map((m) => m.values)]) {
      for (const value of list) {
        if (value < lo) lo = value;
        if (value > hi) hi = value;
      }
    }
    // A stacked area measures parts of a total, so its filled base starts at zero.
    return lo === Number.POSITIVE_INFINITY ? null : { min: stackLayers.length ? Math.min(0, lo) : lo, max: hi };
  }, [compareValues, upperValues, lowerValues, stackLayers, barMarks, lineMarks]);

  const drawnRange = useMemo(() => {
    let lo = morphValues ? (morphValues[0] ?? 0) : min;
    let hi = morphValues ? lo : max;
    if (morphValues) {
      for (const value of morphValues) {
        if (value < lo) lo = value;
        if (value > hi) hi = value;
      }
    }
    if (extrasRange) {
      lo = Math.min(lo, extrasRange.min);
      hi = Math.max(hi, extrasRange.max);
    }
    return { min: lo, span: hi - lo };
  }, [morphValues, min, max, extrasRange]);

  const scale = useMemo(
    () =>
      makeScale({
        count: drawnValues.length,
        min: drawnRange.min,
        span: drawnRange.span,
        width,
        height,
        inset,
      }),
    [drawnValues.length, drawnRange.min, drawnRange.span, width, height, inset],
  );

  /*
   * The extras share the primary's domain but not its point count, so each is
   * placed by a scale of its own — a forecast band may sample monthly against a
   * daily primary line, and both still have to land on the same x track.
   */
  const extraScale = useCallback(
    (seriesCount: number) =>
      makeScale({
        count: seriesCount,
        min: drawnRange.min,
        span: drawnRange.span,
        width,
        height,
        inset,
      }),
    [drawnRange.min, drawnRange.span, width, height, inset],
  );

  /**
   * Bars, measured on the plot's scale.
   *
   * Grounded at the domain floor rather than at y=0: the plot's scale is fitted
   * to the data, so on an all-positive series zero is off the bottom of the box
   * and bars drawn to it would each carry a tall invisible stem. The floor is
   * where the axis actually is.
   */
  const barShapes = useMemo(() => {
    if (width === 0 || barMarks.length === 0) return [];
    return barMarks.map((mark) => {
      const marked = extraScale(mark.values.length);
      // Slot width from the mark's own point count, so a monthly volume series
      // under a daily line still spans the plot rather than hugging the left.
      const slot = mark.values.length > 0 ? (width - inset * 2) / mark.values.length : 0;
      const barWidth = Math.max(1, slot * 0.6);
      const floor = marked.y(drawnRange.min);
      return {
        color: mark.color,
        opacity: mark.opacity,
        d: mark.values
          .map((value, index) => {
            const top = marked.y(value);
            return barPath({
              x: marked.x(index) - barWidth / 2,
              y: Math.min(top, floor),
              width: barWidth,
              height: Math.abs(floor - top),
              radius: Math.min(metrics.barRadius, barWidth / 2),
              roundedEnd: 'top',
            });
          })
          .join(' '),
      };
    });
  }, [barMarks, width, inset, extraScale, drawnRange.min, metrics.barRadius]);

  const band = useMemo(() => {
    if (width === 0 || upperValues.length === 0 || lowerValues.length === 0) return '';
    const upper = extraScale(upperValues.length);
    const lower = extraScale(lowerValues.length);
    return bandPath(
      upperValues.map((value, index) => ({ x: upper.x(index), y: upper.y(value) })),
      lowerValues.map((value, index) => ({ x: lower.x(index), y: lower.y(value) })),
      curve,
    );
  }, [upperValues, lowerValues, width, extraScale, curve]);

  /*
   * The compare line and the band take the plot's `curve`, not a hardcoded one.
   *
   * This was pinned to `'steep'`, so `curve="smooth"` drew a fitted spline for the
   * primary over a hard-cornered comparison and a hard-cornered band — three
   * marks over the same x-range disagreeing about how the data is interpolated.
   * `curve` is one decision for the whole plot.
   */
  /**
   * Each layer as a closed band between its own top edge and the edge below it.
   *
   * Drawn outermost-first so the nearer layers paint over the farther ones — the
   * fills are opaque, so a stack drawn the other way would bury every band but
   * the last under the total.
   */
  const stackBands = useMemo(() => {
    if (width === 0 || stackLayers.length === 0) return [];
    const toPts = (list: readonly number[]) => {
      const s = extraScale(list.length);
      return list.map((value, index) => ({ x: s.x(index), y: s.y(value) }));
    };
    return stackLayers
      .map((layer, index) => ({
        d: bandPath(toPts(layer), toPts(stackLayers[index - 1] ?? values), curve),
        // Slot 0 belongs to the primary, which takes a palette slot too once it
        // is stacked — see `lineColor`.
        color: stackColors?.[index + 1] ?? seriesColorAt(t, index + 1),
      }))
      .reverse();
  }, [stackLayers, values, width, extraScale, curve, t, stackColors]);

  /*
   * Once a plot is stacked, the primary takes a palette slot and `tone` stops
   * applying — the same rule the bar chart uses for `series`, and for the same
   * reason: a stack is a set of categories, not one measurement with a
   * direction, so there is nothing for `positive`/`negative` to mean.
   *
   * It also has to be this way to stay legible. The layers came off the
   * categorical palette while the primary stayed on the tone palette, and those
   * two sets are not checked against each other: the default `auto` tone
   * resolves to `chartPositive` (#008236, green) and the first layer landed on
   * `chartSeries2` (#65A30D, olive) — two greens side by side in the same stack,
   * with a legend claiming they were different things.
   */
  const stacked = stackLayers.length > 0;
  const lineColor = stacked ? (stackColors?.[0] ?? seriesColorAt(t, 0)) : color;

  const linePaths = useMemo(() => {
    if (width === 0) return [];
    return lineMarks
      .filter((mark) => mark.values.length >= 2)
      .map((mark) => {
        const marked = extraScale(mark.values.length);
        return {
          ...mark,
          d: linePath(
            mark.values.map((value, index) => ({ x: marked.x(index), y: marked.y(value) })),
            curve,
          ),
        };
      });
  }, [lineMarks, width, extraScale, curve]);

  const comparePath = useMemo(() => {
    if (width === 0 || compareValues.length < 2) return '';
    const compare = extraScale(compareValues.length);
    return linePath(
      compareValues.map((value, index) => ({ x: compare.x(index), y: compare.y(value) })),
      curve,
    );
  }, [compareValues, width, extraScale, curve]);

  // The scale the *gesture* reads. Pinned to the real series so the index under
  // the finger never depends on how far through a morph the chart happens to be.
  const scrubScale = useMemo(
    () => makeScale({ count, min, span, width, height, inset }),
    [count, min, span, width, height, inset],
  );

  // One tick per point the scrub actually lands on. Keying off the committed
  // index rather than the touch stream is what collapses a drag's many move
  // events down to the handful of points it crossed — React drops the re-render
  // when the index doesn't change, so this effect doesn't run either.
  useEffect(() => {
    if (activeIndex == null) return;
    void haptic('selection');
  }, [activeIndex]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => scrubbable,
        onMoveShouldSetPanResponder: () => scrubbable,
        // Claim the gesture so a parent ScrollView doesn't steal a horizontal drag.
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: (event) =>
          setActiveIndex(scrubScale.indexAt(event.nativeEvent.locationX)),
        onPanResponderMove: (event) =>
          setActiveIndex(scrubScale.indexAt(event.nativeEvent.locationX)),
        onPanResponderRelease: () => setActiveIndex(null),
        onPanResponderTerminate: () => setActiveIndex(null),
      }),
    [scrubScale, setActiveIndex, scrubbable],
  );

  const plotPoints = useMemo(
    () => drawnValues.map((value, index) => ({ x: scale.x(index), y: scale.y(value) })),
    [drawnValues, scale],
  );

  const line = linePath(plotPoints, curve);
  const area = fill ? areaPath(plotPoints, height - inset, curve) : '';

  const baselineY = scale.y(baseline);
  const showBaseline =
    chrome === 'baseline' &&
    count > 1 &&
    baseline >= drawnRange.min &&
    baseline <= drawnRange.min + drawnRange.span &&
    drawnRange.span > 0;
  const showReferences = chrome === 'reference' && references.length > 0 && count > 1;

  const active = activeIndex != null && count > 1 && morphValues == null
    ? { x: scrubScale.x(activeIndex), y: scrubScale.y(values[activeIndex] ?? min) }
    : null;

  // Measured once so the pill can be kept inside the plot at the plot's edges.
  const [pillWidth, setPillWidth] = useState(0);
  const activeValue = activeIndex != null ? (values[activeIndex] ?? 0) : 0;
  const tooltipText = tooltip && active ? (format ? format(activeValue) : String(activeValue)) : null;
  const pillLeft =
    active && pillWidth > 0
      ? Math.min(
          Math.max(active.x, pillWidth / 2 + 2),
          Math.max(pillWidth / 2 + 2, width - pillWidth / 2 - 2),
        )
      : (active?.x ?? 0);

  // Per instance: two charts on one screen resolve to different colours but would
  // share one document-global gradient id, so the first definition would win.
  const gradientId = `arloChartFill-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  const summary =
    accessibilityLabel ??
    (loading
      ? 'Chart loading'
      : count === 0
        ? emptyLabel
        : count === 1
          ? notEnoughLabel
          : `Line chart, ${count} points, from ${first} to ${last}, low ${min}, high ${max}`);

  const message =
    count === 0 ? (empty ?? emptyLabel) : count === 1 ? notEnoughLabel : null;
  const drawable = !loading && count > 1 && width > 0;
  const entrance = useChartEntrance(drawable);
  const revealId = `${gradientId}-reveal`;

  return (
    <View
      onLayout={handleLayout}
      accessible
      accessibilityRole="image"
      accessibilityLabel={summary}
      style={[{ height, width: '100%' }, style]}
      {...(scrubbable && drawable ? panResponder.panHandlers : {})}
    >
      {loading ? (
        <PlotShimmer width={width} height={height} inset={inset} />
      ) : null}

      {drawable ? (
        <Svg width={width} height={height} style={{ position: 'absolute' }} pointerEvents="none">
          <Defs><ClipPath id={revealId}><ChartReveal progress={entrance} width={width} height={height} immediate={activeIndex != null} /></ClipPath></Defs>
          <G clipPath={`url(#${revealId})`}>
          {/* Behind everything: a bar is context for the line, not a rival to it. */}
          {barShapes.map((mark, index) => (
            <Path
              key={`bars-${index}`}
              d={mark.d}
              fill={mark.color ?? toneColor(t, 'neutral')}
              opacity={mark.opacity}
              stroke="none"
            />
          ))}
          {band ? (
            <Path
              d={band}
              fill={rgbaFromHex(t.colors.interactivePrimary, 0.12)}
              stroke="none"
            />
          ) : null}

          {/*
            Under the primary, which keeps the line that answers the scrub on top
            of everything it is stacked with.
          */}
          <ChartFill progress={entrance} immediate={activeIndex != null}>
          {stackBands.map((layer, index) => (
            <Path key={`stack-${index}`} d={layer.d} fill={layer.color} stroke="none" />
          ))}

          {area && stacked ? (
            <Path d={area} fill={lineColor} stroke="none" />
          ) : area ? (
            <>
              <Defs>
                <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor={lineColor} stopOpacity={0.22} />
                  <Stop offset="1" stopColor={lineColor} stopOpacity={0} />
                </LinearGradient>
              </Defs>
              <Path d={area} fill={`url(#${gradientId})`} />
            </>
          ) : null}

          </ChartFill>
          </G>
          {showBaseline ? (
            <Path
              d={`M${inset},${baselineY.toFixed(2)} L${(width - inset).toFixed(2)},${baselineY.toFixed(2)}`}
              stroke={t.colors.borderSecondary}
              strokeWidth={1}
              strokeDasharray="3 4"
              fill="none"
            />
          ) : null}

          {showReferences
            ? references.map((entry, index) => (
                <Path
                  key={`reference-${index}-${entry.value}`}
                  d={`M${inset},${scale.y(entry.value).toFixed(2)} L${(width - inset).toFixed(2)},${scale.y(entry.value).toFixed(2)}`}
                  stroke={t.colors.borderSecondary}
                  strokeWidth={1}
                  strokeDasharray="2 3"
                  fill="none"
                />
              ))
            : null}

          <G clipPath={`url(#${revealId})`}>
          {linePaths.map((mark, index) => (
            <Path
              key={`line-${index}`}
              d={mark.d}
              stroke={mark.color ?? seriesColorAt(t, mark.slot + 1)}
              strokeWidth={metrics.stroke}
              strokeLinecap="round"
              strokeDasharray={mark.dashed ? '4 4' : undefined}
              fill="none"
            />
          ))}
          {comparePath ? (
            <Path
              d={comparePath}
              stroke={t.colors.chartOther}
              strokeWidth={metrics.stroke}
              strokeLinecap="round"
              strokeDasharray="4 4"
              fill="none"
            />
          ) : null}

          <Path
            d={line}
            stroke={lineColor}
            strokeWidth={metrics.stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {active ? (
            <>
              <Path
                d={`M${active.x.toFixed(2)},${inset} L${active.x.toFixed(2)},${(height - inset).toFixed(2)}`}
                stroke={t.colors.borderSecondary}
                strokeWidth={1}
                fill="none"
              />
              {/* Surface ring keeps the dot readable where it overlaps the line. */}
              <Circle
                cx={active.x}
                cy={active.y}
                r={metrics.dot}
                fill={lineColor}
                stroke={t.colors.surfaceElevated}
                strokeWidth={2}
              />
            </>
          ) : null}
          </G>
        </Svg>
      ) : null}

      {/* Reference labels ride outside the SVG so they use the same type ramp as
          everything else, rather than SVG's own text metrics. */}
      {drawable &&
        showReferences &&
        references.map((entry, index) => (
          <View
            key={`reference-label-${index}-${entry.value}`}
            pointerEvents="none"
            style={{ position: 'absolute', right: inset, top: scale.y(entry.value) - metrics.labelSize - 4 }}
          >
            <Text
              style={{
                color: t.colors.textTertiary,
                fontFamily: t.fontFamilies.mono,
                fontSize: metrics.labelSize - 1,
                fontWeight: '500',
              }}
            >
              {entry.label ?? (format ? format(entry.value) : String(entry.value))}
            </Text>
          </View>
        ))}

      {/* The scrub readout: a pill above the crosshair, kept inside the plot once
          its width is known. Same ramp rule as the labels above — RN text, not
          SVG text. */}
      {drawable && tooltipText != null && active ? (
        <View
          pointerEvents="none"
          onLayout={(event) => setPillWidth(event.nativeEvent.layout.width)}
          style={{
            position: 'absolute',
            left: pillLeft,
            top: Math.max(0, active.y - metrics.dot - 28),
            transform: [{ translateX: '-50%' }],
            backgroundColor: t.colors.surfaceInverse,
            borderRadius: 6,
            paddingHorizontal: 9,
            paddingVertical: 4,
          }}
        >
          <Text
            style={{
              color: t.colors.textInverse,
              fontFamily: t.fontFamilies.sans,
              fontSize: 11,
              lineHeight: 14,
              fontWeight: '700',
            }}
          >
            {tooltipText}
          </Text>
        </View>
      ) : null}

      {!loading && message != null ? (
        <View
          /*
           * `box-none`, not `none`: an empty slot can carry an action, and
           * `none` made that button unpressable — the one control on a screen
           * with no data, dead. `box-none` keeps the overlay itself out of the
           * way of the plot while letting its children take a touch.
           */
          pointerEvents="box-none"
          // `absoluteFill`, not `absoluteFillObject`: RN 0.86 dropped the latter, and
          // it fails silently — the lookup is `undefined`, so the overlay defines no
          // geometry and collapses to zero size.
          style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}
        >
          {typeof message === 'string' ? (
            <Text
              style={{
                color: t.colors.textTertiary,
                fontFamily: t.fontFamilies.sans,
                fontSize: t.typography.bodySm.fontSize,
                lineHeight: t.typography.bodySm.lineHeight,
              }}
            >
              {message}
            </Text>
          ) : (
            message
          )}
        </View>
      ) : null}
    </View>
  );
}

/**
 * Loading is the plot's own silhouette, pulsing — not a grey rectangle. A block
 * where a chart goes tells you the layout; a line where the line goes tells you
 * what is arriving.
 */
export const PlotShimmer = PlotPlaceholder;

/** Time-range selector. Renders nothing when the chart was given no `periods`. */

/**
 * The scrub crosshair — the vertical rule and the dot that follow a finger.
 *
 * `scrubbable` was the last boolean standing in for whether an element exists,
 * and it conflated two things: whether the plot answers a touch, and whether it
 * draws anything when it does. Naming the part is the switch for both, because
 * a plot that tracks a finger and shows nothing is not a feature.
 */
export function ChartCrosshairPart(): ReactNode {
  return null;
}

/**
 * The zero rule, drawn across the plot at the baseline value.
 *
 * Furniture goes inside `<Chart.Plot>` rather than beside it: the root's
 * children are information — the readout, the delta, the period selector — and
 * the plot's children are what is drawn *in* the box. Keeping the two apart is
 * what stops "where does this go?" being a question.
 */
export function ChartBaselinePart(): ReactNode {
  return null;
}

/** A labelled dashed line at a value you name. Repeat it for several — a min and a max, say. */
export type ChartReferenceProps = ChartReference;
export function ChartReferencePart(_: ChartReferenceProps): ReactNode {
  return null;
}

/**
 * An *additional* line — a second, third, nth series on the same scale.
 *
 * Not the primary one: that comes from the root's `data`, and a line chart
 * draws it whether or not this part is named. Reach for this when a second
 * series has to sit beside the first.
 *
 * `compare` draws exactly one extra line and does it through a prop; this is
 * the same idea as a part, so any number of them compose and each carries its
 * own colour and name. Prefer it: `compare` stays for the single-line case it
 * already serves.
 */
export type ChartLineProps = {
  data: ChartData;
  /** Defaults to the categorical palette, one slot per line in tree order. */
  color?: string;
  /** Dashed, the way `compare` draws — for a baseline or a forecast. */
  dashed?: boolean;
  /** Names the line to the legend and to assistive tech. */
  label?: string;
};
export function ChartLinePart(_: ChartLineProps): ReactNode {
  return null;
}

/**
 * A bar mark inside a plot. The combo chart: volume behind price, rainfall
 * behind temperature — a second quantity that shares the x-axis and wants a
 * different shape.
 *
 * Renders nothing itself; `Chart.Plot` measures it into its own scale and draws
 * it. See `barMarks` there.
 */
export type ChartBarsProps = {
  data: ChartData;
  /** Defaults to the neutral chart hue — a bar mark is context, not the subject. */
  color?: string;
  /** Defaults to 0.35, so the line stays legible where it crosses. */
  opacity?: number;
};
export function ChartBarsPart(_: ChartBarsProps): ReactNode {
  return null;
}
