/**
 * Arlo UI — Meter
 *
 * One value against a target: budget used, storage filled, goal progress. This is
 * a magnitude, not a category, so it is a single hue rather than a series colour —
 * and a `bar`, a `ring`, or an `arc`, which are the same data with different
 * shapes.
 *
 *   <Meter value={72} max={100} label="Storage" />
 *   <Meter shape="ring" value={1840} max={2000} label="Steps" tone="positive" />
 *   <Meter shape="arc" value={712} max={850} label="Credit score" />
 *
 * `arc` is the gauge: the same sweep as the ring with the bottom third left
 * open. It is the shape a score wants — a credit rating, a sleep score, a
 * readiness number — because the gap gives the value somewhere to sit and reads
 * as a dial rather than as progress towards a full circle.
 *
 * `rings` puts more than one value on the same dial, drawn concentrically:
 *
 *   <Meter value={520} max={600} rings={[{ value: 32, max: 40 }]} />
 *
 * That is the one arrangement composition cannot reach. Three meters side by
 * side are three readings; three rings on one dial are a single one.
 *
 * Passing `warnAt` / `dangerAt` moves it onto the status palette, which is
 * reserved for state and always ships with a visible value — never colour alone.
 *
 * The fill sweeps up from empty on mount and on every value change, and the
 * readout counts with it, so the number and the shape always agree mid-flight.
 * It runs on the `slow` duration rather than `base`: a meter is read as a
 * quantity, and a fill that lands before the eye reaches it may as well be
 * static. Reduce Motion pins both straight to the final value.
 */
import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Animated,
  Easing,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useTokens } from '../../foundation/theme-provider';
import { ChartLoading, ChartMotion } from './hooks';
import {
  arcLength,
  arcPath,
  seriesColorAt,
  type ChartDensity,
  type ChartTone,
} from './core';
import { allParts, collectParts, hasPart, partProps, useSkeletonPulse } from './hooks';
import { useReduceMotion } from './hooks';

/**
 * Created once at module scope. Building it inside render returns a new component
 * type every pass, which remounts the circle and drops the animation mid-flight.
 */
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

export type MeterShape = 'bar' | 'ring' | 'arc';

/**
 * The gauge's sweep: 240 degrees, centred on twelve o'clock, leaving the bottom
 * third open. That gap is what makes an arc read as a gauge rather than as a
 * ring someone forgot to close — and it is where the readout's descenders go.
 */
const ARC_SWEEP = (Math.PI * 4) / 3;
const ARC_START = -ARC_SWEEP / 2;
const ARC_END = ARC_SWEEP / 2;

/** Gap between concentric rings, in points. */
const RING_GAP = 4;

/**
 * What `density` means for a meter.
 *
 * It used to mean one thing only: `metrics.showLabels`, which hid the label.
 * That is not density, and it is already what *not passing a label* does — so
 * the axis meant to say "this meter is going somewhere small" changed nothing
 * about its size, and duplicated a decision the caller had already made.
 *
 * It now sizes the meter: the bar's thickness, the ring's stroke and diameter,
 * and the type in the middle. The label is governed by whether you pass one.
 */
const METER_METRICS = {
  default: { bar: 8, ring: 10, size: 120, readoutHole: 64 },
  compact: { bar: 6, ring: 7, size: 88, readoutHole: 48 },
} as const;


/**
 * One more value on the same dial.
 *
 * Concentric rings are the one thing composition genuinely cannot produce: three
 * `Meter`s side by side are three meters, and three rings on one dial are a
 * single reading of a day. Everything a ring needs to differ on is here;
 * everything else it inherits from the meter it sits inside.
 */
export type MeterRing = {
  value: number;
  /** Defaults to the meter's own `max`. */
  max?: number;
  /** Defaults to the meter's own `min`. */
  min?: number;
  /** Overrides the palette slot this ring would otherwise take. */
  color?: string;
  /** Named for assistive tech. Rings have no room for a visible label. */
  label?: string;
};

export type MeterProps = {
  /** Animate entry and updates. Device Reduce Motion always takes precedence. Default: true. */
  animated?: boolean;
  /** What to show, in the same units as `min` and `max`. */
  value: number;
  /** Top of the range. The fill is `value` as a share of `min`..`max`. */
  max?: number;
  /** Bottom of the range, for meters that do not start at zero. */
  min?: number;
  /** A `bar`, a full `ring`, or an `arc` gauge open at the bottom. */
  shape?: MeterShape;
  /**
   * Honours `brand` (default), `positive`, `negative`, and `neutral`. A meter is
   * one value against a target — it has no series to enumerate and no direction to
   * infer — so `series` and `auto` both resolve to `brand`.
   */
  tone?: ChartTone;
  /** How thick the track is, unless `thickness` overrides it. */
  density?: ChartDensity;
  /** Text in the middle of a ring, or beside a bar. Defaults to a percentage. */
  /**
   * Force the numeric readout on or off. Left unset, a ring or an arc decides
   * from its own geometry: concentric `rings` eat into the hole, and once there
   * is not enough of it left the readout would be drawn over the innermost
   * track. A bar has no hole, so it always shows one.
   *
   * Set it explicitly only where you want to override that — the value stated
   * nearby (`false`), or a crowded dial you have sized yourself (`true`).
   */
  /** Fraction (0-1) past which the meter turns warning. */
  warnAt?: number;
  /** Fraction (0-1) past which the meter turns danger. */
  dangerAt?: number;
  /** Bar thickness, or ring stroke width. */
  thickness?: number;
  /** Ring or arc diameter. Ignored by the bar shape. */
  size?: number;
  /**
   * Additional concentric rings, drawn inside the primary one. `value` is always
   * the outermost; these stack inwards in order, exactly as `series` extends
   * `data` on a bar chart.
   *
   * Honoured by `ring` and `arc` only — a bar has no inside to draw into. Extra
   * rings take the categorical palette rather than the meter's `tone`: once there
   * is more than one value on the dial they are categories, and a shared tone
   * would make them unreadable. Thresholds stay with the primary, which is the
   * one the readout reports.
   */
  /**
   * Pulses the track and holds back the fill and the readout. The label stays —
   * it is the one part of a meter you already know before the value arrives, and
   * skeletoning known text just makes the row flicker.
   *
   * There is no `emptyLabel` counterpart: a meter is one value against a target,
   * so it is either loading or it has a value. An empty meter is a zero.
   */
  loading?: boolean;
  /** Keep the last supplied data visible during a background fetch. Overrides loading. */
  refreshing?: boolean;
  /** Overrides the label read to assistive tech, which otherwise uses the meter's name. */
  accessibilityLabel?: string;
  /** Style for the meter's outer container. */
  style?: StyleProp<ViewStyle>;
  /**
   * The composed form: `<Meter.Value />` rather than `showValue`, and one
   * `<Meter.Ring />` per ring rather than the `rings` array. Omit it and the
   * meter renders exactly as it always has.
   */
  children?: ReactNode;
};

/**
 * One track and one fill at a given radius, for a full ring or a partial arc.
 *
 * Both shapes animate the same way — `strokeDasharray` over the path's own
 * length — so they share a component rather than diverging into two nearly
 * identical branches. A full turn keeps the `<Circle>` it has always used; only
 * the partial sweep needs a path, because an arc is not a circle.
 */
function Sweep({
  cx,
  cy,
  radius,
  thickness,
  color,
  trackColor,
  trackOpacity,
  progress,
  partial,
}: {
  cx: number;
  cy: number;
  radius: number;
  thickness: number;
  color: string;
  trackColor: string;
  trackOpacity: Animated.Value | Animated.AnimatedMultiplication<number> | number;
  progress: Animated.Value;
  /** `false` draws the full circle; `true` draws the gauge's 240-degree arc. */
  partial: boolean;
}) {
  const length = partial ? arcLength(radius, ARC_SWEEP) : 2 * Math.PI * radius;
  const offset = progress.interpolate({ inputRange: [0, 1], outputRange: [length, 0] });

  if (partial) {
    const d = arcPath({ cx, cy, radius, startAngle: ARC_START, endAngle: ARC_END });
    return (
      <>
        <Path
          d={d}
          stroke={trackColor}
          strokeWidth={thickness}
          strokeLinecap="round"
          fill="none"
          opacity={trackOpacity as number}
        />
        <AnimatedPath
          d={d}
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={length}
          strokeDashoffset={offset}
        />
      </>
    );
  }

  return (
    <>
      <AnimatedCircle
        cx={cx}
        cy={cy}
        r={radius}
        stroke={trackColor}
        strokeWidth={thickness}
        fill="none"
        opacity={trackOpacity}
      />
      <AnimatedCircle
        cx={cx}
        cy={cy}
        r={radius}
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={length}
        strokeDashoffset={offset}
        // Start the sweep at 12 o'clock instead of 3.
        transform={`rotate(-90 ${cx} ${cy})`}
      />
    </>
  );
}

/**
 * An inner ring, which owns its own sweep.
 *
 * A component per ring rather than a loop of hooks in the parent: the number of
 * rings is a prop, and `useState`/`useEffect` cannot be called a variable number
 * of times. Each ring animating itself also means adding one never restarts the
 * others.
 */
function ExtraRing({
  ring,
  index,
  cx,
  cy,
  radius,
  thickness,
  trackColor,
  trackOpacity,
  fallbackMin,
  fallbackMax,
  partial,
  loading,
  reduceMotion,
  duration,
}: {
  ring: MeterRing;
  index: number;
  cx: number;
  cy: number;
  radius: number;
  thickness: number;
  trackColor: string;
  trackOpacity: Animated.Value | Animated.AnimatedMultiplication<number> | number;
  fallbackMin: number;
  fallbackMax: number;
  partial: boolean;
  loading: boolean;
  reduceMotion: boolean;
  duration: number;
}) {
  const t = useTokens();
  const [progress] = useState(() => new Animated.Value(0));
  const min = ring.min ?? fallbackMin;
  const max = ring.max ?? fallbackMax;
  const range = max - min;
  const fraction =
    loading || range === 0 ? 0 : Math.min(1, Math.max(0, (ring.value - min) / range));

  useEffect(() => {
    if (reduceMotion) {
      progress.setValue(fraction);
      return;
    }
    const animation = Animated.timing(progress, {
      toValue: fraction,
      duration,
      easing: Easing.out(Easing.cubic),
      // Stroke offset is not a transform, so this cannot go native.
      useNativeDriver: false,
    });
    animation.start();
    return () => animation.stop();
  }, [fraction, progress, reduceMotion, duration, partial]);

  return (
    <Sweep
      cx={cx}
      cy={cy}
      radius={radius}
      thickness={thickness}
      // +1 because the primary already holds the first slot.
      color={ring.color ?? seriesColorAt(t, index + 1)}
      trackColor={trackColor}
      trackOpacity={trackOpacity}
      progress={progress}
      partial={partial}
    />
  );
}

type MeterResolved = MeterProps & {
  label?: string;
  valueLabel?: string;
  showValue?: boolean;
  rings?: readonly MeterRing[];
};

function MeterInner({
  value,
  max = 100,
  min = 0,
  shape = 'bar',
  tone = 'brand',
  density = 'default',
  label,
  valueLabel,
  showValue,
  warnAt,
  dangerAt,
  thickness,
  size,
  rings,
  loading = false,
  refreshing = false,
  accessibilityLabel,
  style,
}: MeterResolved) {
  const t = useTokens();
  const scale = METER_METRICS[density === 'compact' ? 'compact' : 'default'];
  const meterThickness = thickness ?? (shape === 'bar' ? scale.bar : scale.ring);
  const meterSize = size ?? scale.size;
  /** A smaller dial takes a smaller figure — 20pt in an 88pt ring reads oversized. */
  const readoutType = density === 'compact' ? t.typography.title3 : t.typography.title2;
  const reduceMotion = useReduceMotion();
  const [progress] = useState(() => new Animated.Value(0));

  const range = max - min;
  // The fill stays empty while loading — a meter that sweeps to a real number
  // before the number is known has already told the reader something false.
  const fraction =
    loading || range === 0 ? 0 : Math.min(1, Math.max(0, (value - min) / range));
  const pulse = useSkeletonPulse(t.motion.duration.slow, loading);
  const trackOpacity = loading ? pulse : 1;

  /**
   * What the readout currently says. Tracks `progress` while the fill sweeps, so
   * it starts at empty alongside it — seeding this with `fraction` would paint
   * the final number for one frame before the sweep yanked it back to zero.
   */
  const [shownFraction, setShownFraction] = useState(0);


  useEffect(() => {
    if (reduceMotion) {
      // No listener and no state write — the readout reads `fraction` directly
      // in this mode, so there is nothing to keep in sync.
      progress.setValue(fraction);
      return;
    }
    // The readout is driven off the same value as the fill, so the number and the
    // shape can never disagree part-way through the sweep.
    const id = progress.addListener(({ value }) => setShownFraction(Math.round(value * 100) / 100));
    // Retarget from the current fill instead of restarting at zero on every update.
    const animation = Animated.timing(progress, {
      toValue: fraction,
      duration: t.motion.duration.slow,
      easing: Easing.out(Easing.cubic),
      // Width and stroke offset are layout properties, so this can't go native.
      useNativeDriver: false,
    });
    animation.start(({ finished }) => {
      // Land exactly on the target: the last listener frame is close, not equal.
      if (finished) setShownFraction(fraction);
    });
    return () => {
      animation.stop();
      progress.removeListener(id);
    };
  }, [fraction, progress, reduceMotion, shape, t.motion.duration.slow]);

  // Thresholds move the meter onto the reserved status palette; without them it
  // stays on the requested tone.
  const color = useMemo(() => {
    if (dangerAt != null && fraction >= dangerAt) return t.colors.feedbackError;
    if (warnAt != null && fraction >= warnAt) return t.colors.feedbackWarning;
    // `auto` and `series` land on brand: there is no direction to infer from one
    // value, and no categories to enumerate.
    return tone === 'positive'
      ? t.colors.chartPositive
      : tone === 'negative'
        ? t.colors.chartNegative
        : tone === 'neutral'
          ? t.colors.textSecondary
          : t.colors.interactivePrimary;
  }, [dangerAt, warnAt, fraction, tone, t.colors]);

  /**
   * The settled value. Assistive tech gets this one — a screen reader announcing
   * a number that is still counting reads as noise, and the meter's semantic
   * value is where it is going, not where the sweep currently is.
   */
  const readout = valueLabel ?? `${Math.round(fraction * 100)}%`;
  /** What is painted, which counts up with the fill — or lands flat under Reduce Motion. */
  const shownReadout =
    valueLabel ?? `${Math.round((reduceMotion ? fraction : shownFraction) * 100)}%`;
  const a11y = accessibilityLabel ?? (loading ? 'Loading' : label);

  /**
   * `compact` drops the caption, which is the inline case: a bare bar sitting next
   * to text that already names it. The value readout is governed by `showValue`
   * and is left alone — a meter with neither a label nor a number is a decoration.
   */
  /*
   * `label != null` alone. Density used to hide it, which is the same decision
   * as not passing one — so the two controls fought over a single outcome and
   * neither was legible. Density sizes the meter; the label is yours.
   */
  const withLabel = label != null;

  const track = t.colors.surfaceInput;
  /** A bar has no hole for the readout to crowd, so it shows one unless told not to. */
  const barReadout = showValue ?? true;

  if (shape === 'ring' || shape === 'arc') {
    const partial = shape === 'arc';
    const cx = meterSize / 2;
    const cy = meterSize / 2;
    const outerRadius = (meterSize - meterThickness) / 2;
    const extras = rings ?? [];

    /*
     * Whether the hole can still hold a readout.
     *
     * Each concentric ring takes a track and a gap out of the middle, so at the
     * default 120/10 a second extra ring leaves 44pt of clear space — and the
     * readout is a ~45x40 box, a 20pt figure with its caption under it. It was
     * drawn anyway, straight over the innermost track.
     *
     * Measured rather than counted, so it stays right for any `size` and
     * `thickness` a caller picks instead of only for the default.
     */
    const innermost = outerRadius - extras.length * (meterThickness + RING_GAP);
    const hole = 2 * (innermost - meterThickness / 2);
    const readoutFits = hole >= scale.readoutHole;
    const withReadout = showValue ?? readoutFits;

    /*
     * An arc only occupies the top two thirds of its box, so the box is cropped
     * to what it draws. The lowest ink is the cap at ±120 degrees, which sits at
     * `cy + radius/2`; anything below that is empty and would read as the gauge
     * floating high in its own space.
     */
    const boxHeight = partial
      ? Math.ceil(cy + outerRadius / 2 + meterThickness / 2)
      : meterSize;

    return (
      <View
        accessible
        accessibilityRole="progressbar"
        accessibilityState={{ busy: loading || refreshing }}
        accessibilityLabel={a11y}
        accessibilityValue={loading ? undefined : { min, max, now: value, text: readout }}
        style={[
          { width: meterSize, height: boxHeight, alignItems: 'center', justifyContent: 'center' },
          style,
        ]}
      >
        <Svg width={meterSize} height={meterSize} style={{ position: 'absolute', top: 0, left: 0 }}>
          <Sweep
            cx={cx}
            cy={cy}
            radius={outerRadius}
            thickness={meterThickness}
            color={color}
            trackColor={track}
            trackOpacity={trackOpacity}
            progress={progress}
            partial={partial}
          />
          {extras.map((ring, index) => (
            <ExtraRing
              key={ring.label ?? index}
              ring={ring}
              index={index}
              cx={cx}
              cy={cy}
              radius={outerRadius - (index + 1) * (meterThickness + RING_GAP)}
              thickness={meterThickness}
              trackColor={track}
              trackOpacity={trackOpacity}
              fallbackMin={min}
              fallbackMax={max}
              partial={partial}
              loading={loading}
              reduceMotion={reduceMotion}
              duration={t.motion.duration.slow}
            />
          ))}
        </Svg>
        {withReadout ? (
          <View
            style={[
              { alignItems: 'center' },
              partial
                ? {
                    /*
                     * Centred *on* the dial's centre, not hung from it. This was
                     * `top: cy`, which puts the readout's top edge at the middle
                     * and drops the whole box through the arc's lower legs —
                     * their lowest ink sits at `cy + outerRadius / 2`, right
                     * where the text was landing.
                     */
                    position: 'absolute',
                    top: cy,
                    left: 0,
                    right: 0,
                    transform: [{ translateY: '-50%' }],
                  }
                : null,
            ]}
          >
            {/*
              The cap lives on an inner wrapper, not the box above it.
              
              Never wider than the hole can hold: a box centred in a circle only
              clears it if its diagonal does, so the safe width is the inscribed
              square's side. It cannot go on the positioning box because the arc
              anchors that with `left: 0; right: 0` — a `maxWidth` there makes the
              box that wide *from the left edge* instead of centring it.
            */}
            <View style={{ alignItems: 'center', maxWidth: Math.max(24, hole * 0.7) }}>
            {!loading ? (
              <Text
                // One line, always. A long `valueLabel` used to wrap and grow the
                // box downwards into the track — the same clash as running wide,
                // on the other axis.
                numberOfLines={1}
                style={{
                  color: t.colors.textPrimary,
                  fontFamily: t.fontFamilies.sans,
                  fontSize: readoutType.fontSize,
                  lineHeight: readoutType.lineHeight,
                  fontWeight: '700',
                }}
              >
                {shownReadout}
              </Text>
            ) : null}
            {withLabel ? (
              <Text
                numberOfLines={1}
                style={{
                  color: t.colors.textSecondary,
                  fontFamily: t.fontFamilies.sans,
                  fontSize: t.typography.bodySm.fontSize,
                  lineHeight: t.typography.bodySm.lineHeight,
                }}
              >
                {label}
              </Text>
            ) : null}
            </View>
          </View>
        ) : null}
      </View>
    );
  }

  return (
    <View
      accessible
      accessibilityRole="progressbar"
        accessibilityState={{ busy: loading || refreshing }}
      accessibilityLabel={a11y}
      accessibilityValue={loading ? undefined : { min, max, now: value, text: readout }}
      style={[
        {
          gap: t.spacing[1],
          /*
           * A bar has no intrinsic width — its track fills whatever it is given.
           * Inside a parent with `alignItems: 'center'` that means it collapses
           * to the width of the label row above it and the line reads as a stub.
           * `alignSelf` beats the parent's `alignItems`, so the bar stays full
           * width wherever it is dropped; `style` still comes after and wins.
           */
          alignSelf: 'stretch',
        },
        style,
      ]}
    >
      {withLabel || barReadout ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          {withLabel ? (
            <Text
              numberOfLines={1}
              style={{
                flexShrink: 1,
                color: t.colors.textSecondary,
                fontFamily: t.fontFamilies.sans,
                fontSize: t.typography.bodySm.fontSize,
                lineHeight: t.typography.bodySm.lineHeight,
              }}
            >
              {label}
            </Text>
          ) : (
            <View />
          )}
          {barReadout && !loading ? (
            <Text
              style={{
                color: t.colors.textPrimary,
                fontFamily: t.fontFamilies.sans,
                fontSize: t.typography.bodySm.fontSize,
                lineHeight: t.typography.bodySm.lineHeight,
                fontWeight: '600',
              }}
            >
              {shownReadout}
            </Text>
          ) : null}
        </View>
      ) : null}
      <Animated.View
        style={{
          height: meterThickness,
          borderRadius: t.radii.full,
          backgroundColor: track,
          overflow: 'hidden',
          opacity: trackOpacity,
        }}
      >
        <Animated.View
          style={{
            height: '100%',
            borderRadius: t.radii.full,
            backgroundColor: color,
            width: progress.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          }}
        />
      </Animated.View>
    </View>
  );
}

/* ------------------------------------------------------------------------- *
 * The composed form — see `collectParts` in `hooks.ts`.
 * ------------------------------------------------------------------------- */

/** The value, as a figure. On a ring or arc it sits in the hole; on a bar it sits above the track. */
export type MeterValueProps = {
  /** Overrides the formatted value, the way `valueLabel` did. */
  value?: string;
};
function MeterValuePart(_: MeterValueProps): ReactNode {
  return null;
}

/** The name under the readout. Takes its text as children. */
export type MeterLabelProps = { children?: ReactNode };
function MeterLabelPart(_: MeterLabelProps): ReactNode {
  return null;
}

/** One concentric ring. Replaces an entry in the `rings` array. */
export type MeterRingProps = MeterRing;
function MeterRingPart(_: MeterRingProps): ReactNode {
  return null;
}

/**
 * With no children the props stand. With children the tree states what the
 * meter shows — and `rings` becomes one element per ring, so a ring's colour
 * and label sit on the ring rather than in a parallel position.
 */
function resolveComposition(props: MeterProps): MeterResolved {
  const { children, ...rest } = props;
  // The one-liner leaves `showValue` undefined on purpose: the geometry decides
  // whether a readout fits (`showValue ?? readoutFits`). Forcing it true here
  // would talk over that and put a figure back inside a crowded ring — the
  // clash the containment work went in to stop.
  /*
   * `undefined`, not `== null`: an absent `children` is "give me the defaults",
   * while an explicit `{null}` is "I named nothing, draw nothing". Without the
   * distinction there is no way to ask for a bare mark — no zero rule, no
   * labels — short of an empty fragment, which reads like a mistake.
   */
  if (children === undefined) return rest;

  const parts = collectParts(children);
  const value = partProps<MeterValueProps>(parts, MeterValuePart);
  const label = partProps<MeterLabelProps>(parts, MeterLabelPart);
  const rings = allParts<MeterRingProps>(parts, MeterRingPart);

  return {
    ...rest,
    showValue: hasPart(parts, MeterValuePart),
    valueLabel: value?.value,
    label: typeof label?.children === 'string' ? label.children : undefined,
    rings: rings.length > 0 ? rings : undefined,
  };
}

function MeterRoot(props: MeterProps) {
  return <ChartMotion animated={props.animated}><ChartLoading loading={props.loading} refreshing={props.refreshing}>{(loading) => <MeterInner {...resolveComposition(props)} loading={loading} />}</ChartLoading></ChartMotion>;
}

/** The parts, for `Chart.Meter.Value` and friends. */
export const MeterParts = {
  Value: MeterValuePart,
  Label: MeterLabelPart,
  Ring: MeterRingPart,
};

export const Meter = Object.assign(MeterRoot, MeterParts);
