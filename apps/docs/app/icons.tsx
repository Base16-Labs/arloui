import * as Clipboard from 'expo-clipboard';
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { createElement, useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { useTokens } from '@arloui/registry';
import iconNames from '@/data/icon-names.json';
import {
  filterIconsByTab,
  iconsWeightQuery,
  resolveDetailIconId,
  searchParamOne,
  stripWeightPrefix,
  type IconStyleTab,
} from '@/iconGallery';

function tabFromParams(weight: string | string[] | undefined): IconStyleTab {
  const w = Array.isArray(weight) ? weight[0] : weight;
  return w === 'solid' || w === 'filled' ? 'solid' : 'outline';
}

function fileBaseToComponentName(fileBase: string): string {
  return fileBase
    .split('-')
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join('');
}

function jsxSnippet(componentName: string): string {
  return `import { ${componentName} } from '@arloui/icons';

<${componentName} width={24} height={24} color="currentColor" />`;
}

/**
 * Real `<img>` for SVG (RN Web `Image` is unreliable). `pointer-events: none` so the parent
 * `Pressable` receives clicks — otherwise the browser targets the img and `onPress` never fires.
 */
function WebSvgImg({ name, size }: { name: string; size: number }) {
  if (Platform.OS !== 'web') return null;
  return createElement('img', {
    src: `/arloui-icons/${name}.svg`,
    width: size,
    height: size,
    alt: '',
    draggable: false,
    style: {
      display: 'block',
      objectFit: 'contain' as const,
      pointerEvents: 'none' as const,
      userSelect: 'none' as const,
    },
  });
}

type DetailOverlayProps = {
  active: string;
  prefetchedXml: string | null;
  pad: number;
  t: ReturnType<typeof useTokens>;
  onClose: () => void;
  onCopySvg: () => void;
  onCopyJsx: () => void;
  /** Portaled on web: position fixed + full viewport */
  variant: 'portal' | 'embedded';
};

function IconDetailOverlay(props: DetailOverlayProps) {
  const { active, prefetchedXml, pad, t, onClose, onCopySvg, onCopyJsx, variant } = props;

  const sheet = (
    <View
      style={[
        variant === 'portal'
          ? ({
              position: 'fixed' as const,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 2147483646,
              justifyContent: 'center',
              alignItems: 'center',
              padding: pad,
            } as unknown as ViewStyle)
          : StyleSheet.absoluteFillObject,
        variant === 'embedded'
          ? { zIndex: 2147483646, justifyContent: 'center', alignItems: 'center', padding: pad }
          : null,
      ]}
      pointerEvents="box-none"
    >
      <Pressable
        onPress={onClose}
        style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.45)' }]}
        accessibilityRole="button"
        accessibilityLabel="Dismiss"
      />
      <View
        pointerEvents="box-none"
        style={[
          StyleSheet.absoluteFillObject,
          { justifyContent: 'center', alignItems: 'center', padding: pad },
        ]}
      >
        <View
          style={{
            backgroundColor: t.colors.bg,
            borderRadius: t.radii.lg,
            padding: t.spacing[5],
            gap: t.spacing[4],
            maxWidth: 480,
            width: '100%',
            borderWidth: 1,
            borderColor: t.colors.border,
          }}
        >
          <Text
            style={{
              color: t.colors.textPrimary,
              fontFamily: t.fontFamilies.sans,
              fontSize: t.typography.title2.fontSize,
              fontWeight: t.typography.title2.fontWeight,
            }}
          >
            {stripWeightPrefix(active)}
          </Text>

          {Platform.OS === 'web' ? (
            <View
              style={{
                alignItems: 'center',
                padding: t.spacing[4],
                backgroundColor: t.colors.surface,
                borderRadius: t.radii.md,
              }}
            >
              <WebSvgImg name={active} size={56} />
            </View>
          ) : (
            prefetchedXml && <SvgXml xml={prefetchedXml} width={48} height={48} />
          )}

          <View style={{ gap: t.spacing[2] }}>
            <Pressable
              onPress={onCopySvg}
              style={({ pressed }) => ({
                backgroundColor: t.colors.textPrimary,
                paddingVertical: t.spacing[3],
                borderRadius: t.radii.md,
                alignItems: 'center',
                opacity: pressed ? 0.9 : 1,
                cursor: Platform.OS === 'web' ? 'pointer' : undefined,
              })}
            >
              <Text
                style={{ color: t.colors.bg, fontFamily: t.fontFamilies.sans, fontWeight: '600' }}
              >
                Copy SVG
              </Text>
            </Pressable>
            <Pressable
              onPress={onCopyJsx}
              style={({ pressed }) => ({
                borderWidth: 1,
                borderColor: t.colors.borderStrong,
                paddingVertical: t.spacing[3],
                borderRadius: t.radii.md,
                alignItems: 'center',
                opacity: pressed ? 0.9 : 1,
                cursor: Platform.OS === 'web' ? 'pointer' : undefined,
              })}
            >
              <Text
                style={{
                  color: t.colors.textPrimary,
                  fontFamily: t.fontFamilies.sans,
                  fontWeight: '600',
                }}
              >
                Copy React usage
              </Text>
            </Pressable>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => ({
                paddingVertical: t.spacing[2],
                alignItems: 'center',
                opacity: pressed ? 0.85 : 1,
                cursor: Platform.OS === 'web' ? 'pointer' : undefined,
              })}
            >
              <Text style={{ color: t.colors.textSecondary, fontFamily: t.fontFamilies.sans }}>
                Close
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );

  return sheet;
}

export default function IconsGalleryScreen() {
  const router = useRouter();
  const t = useTokens();
  const { width: winWidth } = useWindowDimensions();
  const width = Math.max(winWidth || 0, 360);
  const cols = width >= 900 ? 4 : width >= 600 ? 3 : 2;
  const pad = t.spacing[4];
  const gap = t.spacing[2];
  const tileW = (width - pad * 2 - gap * (cols - 1)) / cols;
  const params = useLocalSearchParams<{ weight?: string | string[]; icon?: string | string[] }>();
  const styleTab = tabFromParams(params.weight);
  const weightQs = iconsWeightQuery(styleTab);
  const [query, setQuery] = useState('');
  const [prefetchedXml, setPrefetchedXml] = useState<string | null>(null);

  const names = iconNames as string[];

  const filtered = useMemo(
    () => filterIconsByTab(names, styleTab, query),
    [names, styleTab, query],
  );

  const active = useMemo(
    () => resolveDetailIconId(searchParamOne(params.icon), names, styleTab),
    [params.icon, names, styleTab],
  );

  useEffect(() => {
    if (!active) {
      setPrefetchedXml(null);
      return;
    }
    setPrefetchedXml(null);
    let cancelled = false;
    fetch(`/arloui-icons/${active}.svg`)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.text();
      })
      .then((xml) => {
        if (!cancelled) setPrefetchedXml(xml);
      })
      .catch(() => {
        if (!cancelled) setPrefetchedXml(null);
      });
    return () => {
      cancelled = true;
    };
  }, [active]);

  const closeDetail = useCallback(() => {
    router.replace(`/icons?weight=${weightQs}`);
  }, [router, weightQs]);

  const copySvg = useCallback(async () => {
    if (!active) return;
    if (prefetchedXml) {
      await Clipboard.setStringAsync(prefetchedXml);
      return;
    }
    try {
      const r = await fetch(`/arloui-icons/${active}.svg`);
      if (!r.ok) return;
      const xml = await r.text();
      await Clipboard.setStringAsync(xml);
    } catch {
      /* ignore */
    }
  }, [active, prefetchedXml]);

  const copyJsx = useCallback(async () => {
    if (!active) return;
    await Clipboard.setStringAsync(jsxSnippet(fileBaseToComponentName(active)));
  }, [active]);

  const detail =
    active !== null ? (
      <IconDetailOverlay
        active={active}
        prefetchedXml={prefetchedXml}
        pad={pad}
        t={t}
        onClose={closeDetail}
        onCopySvg={copySvg}
        onCopyJsx={copyJsx}
        variant={Platform.OS === 'web' ? 'portal' : 'embedded'}
      />
    ) : null;

  return (
    <>
      <Stack.Screen options={{ title: 'Icons' }} />
      <SafeAreaView
        edges={['bottom']}
        style={{ flex: 1, minHeight: 0, backgroundColor: t.colors.bg }}
      >
        <FlatList
          style={{ flex: 1, minHeight: 0 }}
          data={filtered}
          keyExtractor={(item): string => item}
          numColumns={cols}
          key={`${cols}-${styleTab}`}
          removeClippedSubviews={Platform.OS !== 'web'}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={Platform.OS === 'web' ? 48 : 24}
          maxToRenderPerBatch={Platform.OS === 'web' ? 48 : 24}
          windowSize={Platform.OS === 'web' ? 15 : 7}
          ListHeaderComponent={
            <View
              style={{ paddingTop: t.spacing[3], gap: t.spacing[3], marginBottom: t.spacing[2] }}
            >
              <Link href="/" asChild>
                <Pressable style={{ alignSelf: 'flex-start' }}>
                  <Text style={{ color: t.colors.textSecondary, fontFamily: t.fontFamilies.sans }}>
                    ← Home
                  </Text>
                </Pressable>
              </Link>
              <View
                style={{ flexDirection: 'row', gap: t.spacing[2], zIndex: 2, position: 'relative' }}
              >
                <Link
                  href="/icons?weight=outline"
                  style={{
                    flex: 1,
                    paddingVertical: t.spacing[2],
                    paddingHorizontal: t.spacing[3],
                    borderRadius: t.radii.md,
                    borderWidth: 1,
                    borderColor: styleTab === 'outline' ? t.colors.textPrimary : t.colors.border,
                    backgroundColor:
                      styleTab === 'outline' ? t.colors.textPrimary : t.colors.surface,
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: t.fontFamilies.sans,
                      fontWeight: '600',
                      fontSize: t.typography.bodySm.fontSize,
                      color: styleTab === 'outline' ? t.colors.bg : t.colors.textPrimary,
                    }}
                  >
                    Outline
                  </Text>
                </Link>
                <Link
                  href="/icons?weight=solid"
                  style={{
                    flex: 1,
                    paddingVertical: t.spacing[2],
                    paddingHorizontal: t.spacing[3],
                    borderRadius: t.radii.md,
                    borderWidth: 1,
                    borderColor: styleTab === 'solid' ? t.colors.textPrimary : t.colors.border,
                    backgroundColor: styleTab === 'solid' ? t.colors.textPrimary : t.colors.surface,
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: t.fontFamilies.sans,
                      fontWeight: '600',
                      fontSize: t.typography.bodySm.fontSize,
                      color: styleTab === 'solid' ? t.colors.bg : t.colors.textPrimary,
                    }}
                  >
                    Filled
                  </Text>
                </Link>
              </View>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search icons…"
                placeholderTextColor={t.colors.textTertiary}
                style={{
                  borderWidth: 1,
                  borderColor: t.colors.border,
                  borderRadius: t.radii.md,
                  paddingHorizontal: t.spacing[3],
                  paddingVertical: t.spacing[2],
                  color: t.colors.textPrimary,
                  fontFamily: t.fontFamilies.sans,
                  fontSize: t.typography.body.fontSize,
                  backgroundColor: t.colors.surface,
                }}
              />
              <Text
                style={{
                  color: t.colors.textSecondary,
                  fontFamily: t.fontFamilies.sans,
                  fontSize: t.typography.bodySm.fontSize,
                  lineHeight: t.typography.bodySm.lineHeight,
                }}
              >
                Outline vs Filled (solid) icons; search applies within the selected set.
              </Text>
            </View>
          }
          contentContainerStyle={{ paddingHorizontal: pad, paddingBottom: pad }}
          columnWrapperStyle={
            cols > 1
              ? {
                  gap,
                  marginBottom: gap,
                  width: '100%',
                  flexDirection: 'row',
                  flexWrap: 'nowrap',
                }
              : undefined
          }
          ListFooterComponent={
            <Text
              style={{
                marginTop: t.spacing[2],
                color: t.colors.textTertiary,
                fontFamily: t.fontFamilies.sans,
                fontSize: 12,
                textAlign: 'center',
              }}
            >
              {filtered.length} icon{filtered.length === 1 ? '' : 's'}
              {query.trim() ? ` matching “${query.trim()}”` : ''} ·{' '}
              {styleTab === 'outline' ? 'Outline' : 'Filled'}
            </Text>
          }
          renderItem={({ item }) => (
            <Link
              href={`/icons?weight=${weightQs}&icon=${encodeURIComponent(item)}`}
              style={{
                width: tileW,
                flexShrink: 0,
                borderWidth: 1,
                borderColor: t.colors.border,
                borderRadius: t.radii.md,
                padding: t.spacing[3],
                backgroundColor: t.colors.surface,
                gap: t.spacing[2],
                alignItems: 'center',
                ...(Platform.OS === 'web'
                  ? { cursor: 'pointer' as const, textDecorationLine: 'none' as const }
                  : null),
              }}
            >
              {Platform.OS === 'web' ? (
                <View style={{ width: 40, height: 40 }} pointerEvents="none">
                  <WebSvgImg name={item} size={40} />
                </View>
              ) : null}
              <Text
                numberOfLines={2}
                style={{
                  color: t.colors.textPrimary,
                  fontFamily: t.fontFamilies.mono,
                  fontSize: 11,
                  textAlign: 'center',
                }}
              >
                {stripWeightPrefix(item)}
              </Text>
            </Link>
          )}
        />

        {Platform.OS !== 'web' && detail}
      </SafeAreaView>

      {Platform.OS === 'web' && typeof document !== 'undefined' && detail
        ? // `react-dom` is web-only; avoid a top-level import so native bundles do not pull it in.
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          require('react-dom').createPortal(detail, document.body)
        : null}
    </>
  );
}
