import type { StyleProp, ViewStyle, TextStyle, ImageStyle } from 'react-native';

type AnyStyle = ViewStyle | TextStyle | ImageStyle;

/**
 * Merge a list of conditional style values into a flat array suitable for `style={...}`.
 *
 *   <View style={cn(styles.root, isActive && styles.active, props.style)} />
 *
 * Falsy entries are dropped. Nested arrays are flattened. This is the RN equivalent
 * of `clsx` for class strings.
 */
export function cn<T extends AnyStyle>(
  ...values: Array<StyleProp<T> | false | null | undefined>
): StyleProp<T> {
  const out: Array<StyleProp<T>> = [];
  for (const v of values) {
    if (!v) continue;
    out.push(v as StyleProp<T>);
  }
  return out;
}
