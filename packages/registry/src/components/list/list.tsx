/**
 * Arlo UI — List
 *
 * One compound component for every stacked-row layout. `List` is the container and
 * `List.Row` is the item, so there is never a question of which to reach for:
 *
 *   <List>
 *     <List.Row leading={<Icon />} title="Spotify" subtitle="Yesterday" value="−$9.99" />
 *     <List.Row title="Transfer from Ada" subtitle="Mar 3" value="+$1,200" valueTone="positive" />
 *   </List>
 *
 * The List draws no surface of its own. Whether the rows sit on a card or straight
 * on the page is the caller's choice — wrap the List in a `Card` for the grouped
 * look, or leave it on the canvas for an edge-to-edge one. The List only decides
 * how the rows relate to each other:
 *
 *   - `separated={false}` (default) — rows are contiguous, divided by a hairline
 *     whose inset is set by `divider`.
 *   - `separated` — each row stands apart with a gap and carries its own surface;
 *     `divider` no longer applies.
 *
 * `divider` controls where the hairline starts and stops:
 *   - `inset`    — Apple style: begins after the leading asset, ends at the content
 *                  padding. The row measures its own leading, so the rule lines up
 *                  under the title whether the asset is a small icon or a thumbnail.
 *   - `balanced` — content padding on both sides.
 *   - `edge`     — full bleed, no inset.
 *   - `none`     — no rule.
 *
 * Defaults are strong (`separated=false`, `divider="inset"`, 44pt rows, native
 * background-highlight press); every part is overridable.
 */
import {
  Children,
  cloneElement,
  isValidElement,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import {
  Pressable,
  Text,
  View,
  type LayoutChangeEvent,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTokens } from '../../foundation/theme-provider';

/** Where the between-row hairline starts and stops. */
export type ListDivider = 'inset' | 'balanced' | 'edge' | 'none';

/** How much vertical breathing room each row gets — how far apart the items sit. */
export type ListDensity = 'comfortable' | 'compact';

/** Direction for a row's trailing `value` — amounts usually want a sign of movement. */
export type ListRowValueTone = 'default' | 'positive' | 'negative';

export type ListProps = {
  children: ReactNode;
  /** `true` spaces each row into its own surface; `false` keeps them contiguous. */
  separated?: boolean;
  /** Hairline inset between contiguous rows. Ignored when `separated`. */
  divider?: ListDivider;
  /** Row vertical padding — how far apart the items sit. Defaults to `'comfortable'`. */
  density?: ListDensity;
  /** Gap between rows when `separated`. Defaults to `spacing[3]`. */
  gap?: number;
  style?: StyleProp<ViewStyle>;
};

export type ListRowProps = {
  title: string;
  /** Supporting line under the title. Takes a node so a badge or meta row fits. */
  subtitle?: ReactNode;
  /** Leading slot — an icon or a media thumbnail. */
  leading?: ReactNode;
  /** Trailing text, e.g. an amount. Sits before a trailing icon if both are given. */
  value?: string;
  /** Secondary line under `value`. */
  valueCaption?: string;
  /** Tone for `value`. */
  valueTone?: ListRowValueTone;
  /** Trailing icon or accessory, e.g. a disclosure chevron. Can pair with `value`. */
  trailing?: ReactNode;
  disabled?: boolean;
  onPress?: PressableProps['onPress'];
  onLongPress?: PressableProps['onLongPress'];
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;

  // --- set by List; not part of the public call site ---
  /** @internal */ separated?: boolean;
  /** @internal */ divider?: ListDivider;
  /** @internal */ density?: ListDensity;
  /** @internal */ showDivider?: boolean;
};

function ListRow({
  title,
  subtitle,
  leading,
  value,
  valueCaption,
  valueTone = 'default',
  trailing,
  disabled = false,
  onPress,
  onLongPress,
  accessibilityLabel,
  style,
  separated = false,
  divider = 'inset',
  density = 'comfortable',
  showDivider = false,
}: ListRowProps) {
  const t = useTokens();
  const interactive = onPress != null || onLongPress != null;
  const paddingH = t.spacing[4];
  const paddingV = density === 'compact' ? t.spacing[2] : t.spacing[3];
  const gap = t.spacing[3];

  // The `inset` rule has to clear whatever sits in the leading slot — a 20pt icon
  // and a 40pt thumbnail start the content at different x. Measure it.
  const [leadingWidth, setLeadingWidth] = useState(0);
  const onLeadingLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w !== leadingWidth) setLeadingWidth(w);
  };

  const valueColor =
    valueTone === 'positive'
      ? t.colors.chartPositive
      : valueTone === 'negative'
        ? t.colors.chartNegative
        : t.colors.textPrimary;

  const rowInner = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap,
        minHeight: t.sizing.touchTarget.minimum,
        paddingVertical: paddingV,
        paddingHorizontal: paddingH,
      }}
    >
      {leading ? (
        <View
          onLayout={onLeadingLayout}
          style={{ flexShrink: 0, alignItems: 'center', justifyContent: 'center' }}
        >
          {leading}
        </View>
      ) : null}

      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
        <Text
          numberOfLines={1}
          style={{
            color: t.colors.textPrimary,
            fontFamily: t.fontFamilies.sans,
            fontSize: t.typography.body.fontSize,
            lineHeight: t.typography.body.lineHeight,
            fontWeight: '600',
          }}
        >
          {title}
        </Text>
        {subtitle != null ? (
          typeof subtitle === 'string' ? (
            <Text
              numberOfLines={1}
              style={{
                color: t.colors.textSecondary,
                fontFamily: t.fontFamilies.sans,
                fontSize: t.typography.bodySm.fontSize,
                lineHeight: t.typography.bodySm.lineHeight,
              }}
            >
              {subtitle}
            </Text>
          ) : (
            subtitle
          )
        ) : null}
      </View>

      {value != null ? (
        <View style={{ flexShrink: 0, alignItems: 'flex-end', gap: 2 }}>
          <Text
            numberOfLines={1}
            style={{
              color: valueColor,
              fontFamily: t.fontFamilies.sans,
              fontSize: t.typography.body.fontSize,
              lineHeight: t.typography.body.lineHeight,
              fontWeight: '600',
            }}
          >
            {value}
          </Text>
          {valueCaption ? (
            <Text
              numberOfLines={1}
              style={{
                color: t.colors.textTertiary,
                fontFamily: t.fontFamilies.sans,
                fontSize: t.typography.bodySm.fontSize,
                lineHeight: t.typography.bodySm.lineHeight,
              }}
            >
              {valueCaption}
            </Text>
          ) : null}
        </View>
      ) : null}

      {trailing ? <View style={{ flexShrink: 0 }}>{trailing}</View> : null}
    </View>
  );

  // The row owns its bottom rule so the inset can read off the measured leading.
  const dividerNode =
    !separated && showDivider && divider !== 'none' ? (
      <View
        style={{
          height: 1,
          backgroundColor: t.colors.borderSecondary,
          marginLeft:
            divider === 'edge'
              ? 0
              : divider === 'balanced'
                ? paddingH
                : paddingH + (leading ? leadingWidth + gap : 0),
          marginRight: divider === 'edge' ? 0 : paddingH,
        }}
      />
    ) : null;

  const surface: ViewStyle = separated
    ? {
        backgroundColor: t.colors.surface,
        borderRadius: t.radii.xl,
        borderWidth: 1,
        borderColor: t.colors.border,
        overflow: 'hidden',
      }
    : {};

  const outerStyle: ViewStyle = { ...surface, opacity: disabled ? 0.45 : 1 };

  if (!interactive) {
    return (
      <View style={[outerStyle, style]}>
        {rowInner}
        {dividerNode}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        outerStyle,
        pressed && !disabled ? { backgroundColor: t.colors.surfaceInput } : null,
        style,
      ]}
    >
      {rowInner}
      {dividerNode}
    </Pressable>
  );
}

function ListContainer({
  children,
  separated = false,
  divider = 'inset',
  density = 'comfortable',
  gap,
  style,
}: ListProps) {
  const t = useTokens();
  const rows = Children.toArray(children).filter(isValidElement) as ReactElement<ListRowProps>[];
  const count = rows.length;

  if (separated) {
    return (
      <View style={[{ gap: gap ?? t.spacing[3] }, style]}>
        {rows.map((row, index) => cloneElement(row, { key: index, separated: true, density }))}
      </View>
    );
  }

  return (
    <View style={style}>
      {rows.map((row, index) =>
        cloneElement(row, {
          key: index,
          separated: false,
          divider,
          density,
          showDivider: index < count - 1,
        }),
      )}
    </View>
  );
}

export const List = Object.assign(ListContainer, { Row: ListRow });
