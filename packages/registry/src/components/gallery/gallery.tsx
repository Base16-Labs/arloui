import { Children, forwardRef, isValidElement, useState, type ReactNode } from 'react';
import {
  ScrollView,
  View,
  type LayoutChangeEvent,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTokens } from '../../foundation/theme-provider';

export type GalleryColumns = 1 | 2 | 3 | 4;
export type GalleryRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

export type GalleryProps = {
  children: ReactNode;
  columns?: GalleryColumns;
  gap?: number;
  radius?: GalleryRadius;
  masonry?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
} & Pick<ScrollViewProps, 'showsVerticalScrollIndicator' | 'onScroll' | 'scrollEventThrottle'>;

export const Gallery = forwardRef<ScrollView, GalleryProps>(function Gallery(
  {
    children,
    columns = 2,
    gap,
    radius,
    masonry = false,
    style,
    contentContainerStyle,
    accessibilityLabel = 'Gallery',
    ...scrollProps
  },
  ref,
) {
  const t = useTokens();
  const resolvedGap = gap ?? t.spacing[2];
  const resolvedRadius = radius != null ? t.radii[radius] : t.radii.lg;

  const items = Children.toArray(children).filter(isValidElement);
  const [containerWidth, setContainerWidth] = useState(0);

  const colWidth =
    containerWidth > 0 ? (containerWidth - resolvedGap * (columns - 1)) / columns : 0;

  const handleLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0 && w !== containerWidth) setContainerWidth(w);
  };

  if (masonry) {
    return (
      <ScrollView
        ref={ref}
        accessibilityLabel={accessibilityLabel}
        style={style}
        contentContainerStyle={contentContainerStyle}
        onLayout={handleLayout}
        {...scrollProps}
      >
        <MasonryLayout
          items={items}
          columns={columns}
          gap={resolvedGap}
          radius={resolvedRadius}
          containerWidth={containerWidth}
        />
      </ScrollView>
    );
  }

  const rows: React.ReactElement[][] = [];
  for (let i = 0; i < items.length; i += columns) {
    rows.push(items.slice(i, i + columns) as React.ReactElement[]);
  }

  return (
    <ScrollView
      ref={ref}
      accessibilityLabel={accessibilityLabel}
      style={style}
      contentContainerStyle={contentContainerStyle}
      onLayout={handleLayout}
      {...scrollProps}
    >
      <View style={{ gap: resolvedGap }}>
        {rows.map((row, ri) => (
          <View key={ri} style={{ flexDirection: 'row', gap: resolvedGap }}>
            {row.map((child, ci) => (
              <View
                key={ci}
                style={{
                  width: colWidth > 0 ? colWidth : undefined,
                  flex: colWidth > 0 ? undefined : 1,
                  borderRadius: resolvedRadius,
                  overflow: 'hidden',
                }}
              >
                {child}
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
});

function MasonryLayout({
  items,
  columns,
  gap,
  radius,
  containerWidth,
}: {
  items: React.ReactElement[];
  columns: number;
  gap: number;
  radius: number;
  containerWidth: number;
}) {
  const [heights, setHeights] = useState<Record<number, number>>({});

  const colWidth = containerWidth > 0 ? (containerWidth - gap * (columns - 1)) / columns : 0;

  const colHeights = new Array(columns).fill(0) as number[];
  const positions: { col: number; top: number }[] = [];

  items.forEach((_, i) => {
    const shortest = colHeights.indexOf(Math.min(...colHeights));
    positions.push({ col: shortest, top: colHeights[shortest]! });
    colHeights[shortest]! += (heights[i] ?? 0) + gap;
  });

  const totalHeight = Math.max(...colHeights, 0);

  return (
    <View style={{ height: totalHeight > 0 ? totalHeight : undefined }}>
      {containerWidth > 0 &&
        items.map((child, i) => (
          <View
            key={i}
            onLayout={(e) => {
              const h = e.nativeEvent.layout.height;
              setHeights((prev) => (prev[i] === h ? prev : { ...prev, [i]: h }));
            }}
            style={{
              position: 'absolute',
              top: positions[i]?.top ?? 0,
              left: (positions[i]?.col ?? 0) * (colWidth + gap),
              width: colWidth,
              borderRadius: radius,
              overflow: 'hidden',
            }}
          >
            {child}
          </View>
        ))}
    </View>
  );
}
