/**
 * Arlo UI — Sparkline
 *
 * A line with everything else removed: no axes, no labels, no scrub, no legend.
 * It belongs inline — beside a number in a stat card, inside a table row — where
 * the surrounding text already says what the number is and the shape is the only
 * thing the mark has to carry.
 *
 * If you want a value readout, a baseline, or scrubbing, you want `Chart`.
 */
import { useMemo, useState } from 'react';
import { View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { useTokens } from '../../foundation/theme-provider';
import type { ChartTone } from './chart';

export type SparklineProps = {
  data: number[];
  /** Matches `Chart`: `'auto'` tones by whether the series ended above where it started. */
  tone?: ChartTone;
  width?: number;
  height?: number;
  /** Fade a gradient under the line. Off by default — inline marks stay light. */
  fill?: boolean;
  /** Dot on the final point, for "where it ended up". */
  showEndDot?: boolean;
  strokeWidth?: number;
  /**
   * Sparklines are decorative next to a value that is already announced, so they
   * are hidden from assistive tech unless you pass a label.
   */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

const INSET = 3;

export function Sparkline({
  data,
  tone = 'auto',
  width: widthProp,
  height = 28,
  fill = false,
  showEndDot = false,
  strokeWidth = 2,
  accessibilityLabel,
  style,
}: SparklineProps) {
  const t = useTokens();
  const [measured, setMeasured] = useState(0);
  const width = widthProp ?? measured;

  const { min, span, first, last } = useMemo(() => {
    const head = data[0];
    if (head == null) return { min: 0, span: 0, first: 0, last: 0 };
    let lo = head;
    let hi = head;
    for (const v of data) {
      if (v < lo) lo = v;
      if (v > hi) hi = v;
    }
    return { min: lo, span: hi - lo, first: head, last: data[data.length - 1] ?? head };
  }, [data]);

  const color =
    tone === 'neutral'
      ? t.colors.textSecondary
      : tone === 'positive'
        ? t.colors.chartPositive
        : tone === 'negative'
          ? t.colors.chartNegative
          : last >= first
            ? t.colors.chartPositive
            : t.colors.chartNegative;

  const usableW = Math.max(0, width - INSET * 2);
  const usableH = Math.max(0, height - INSET * 2);

  const points = useMemo(() => {
    if (width === 0 || data.length === 0) return [];
    return data.map((value, index) => {
      const x = data.length < 2 ? INSET + usableW / 2 : INSET + (index / (data.length - 1)) * usableW;
      // A flat series has no range to normalise against, so it runs down the middle.
      const ratio = span === 0 ? 0.5 : (value - min) / span;
      return { x, y: INSET + (1 - ratio) * usableH };
    });
  }, [data, width, usableW, usableH, min, span]);

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(' ');
  const end = points[points.length - 1];
  const start = points[0];
  const areaPath =
    fill && linePath && start && end
      ? `${linePath} L${end.x.toFixed(2)},${height - INSET} L${start.x.toFixed(2)},${height - INSET} Z`
      : '';

  const gradientId = `arloSparkFill-${tone}`;

  return (
    <View
      onLayout={
        widthProp == null
          ? (event: LayoutChangeEvent) => setMeasured(event.nativeEvent.layout.width)
          : undefined
      }
      accessible={accessibilityLabel != null}
      accessibilityRole={accessibilityLabel != null ? 'image' : undefined}
      accessibilityLabel={accessibilityLabel}
      accessibilityElementsHidden={accessibilityLabel == null}
      importantForAccessibility={accessibilityLabel == null ? 'no-hide-descendants' : 'auto'}
      style={[{ width: widthProp, height }, style]}
    >
      {width > 0 && points.length > 0 ? (
        <Svg width={width} height={height}>
          {areaPath ? (
            <>
              <Defs>
                <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor={color} stopOpacity={0.24} />
                  <Stop offset="1" stopColor={color} stopOpacity={0} />
                </LinearGradient>
              </Defs>
              <Path d={areaPath} fill={`url(#${gradientId})`} />
            </>
          ) : null}
          <Path
            d={linePath}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {showEndDot && end ? <Circle cx={end.x} cy={end.y} r={strokeWidth + 0.5} fill={color} /> : null}
        </Svg>
      ) : null}
    </View>
  );
}
