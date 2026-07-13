import * as Clipboard from 'expo-clipboard';
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  createElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from 'react';
import { createPortal } from 'react-dom';
import { Pressable, Text, TextInput, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

function ThumbImg({ name }: { name: string }) {
  return createElement('img', {
    src: `/arloui-icons/${name}.svg`,
    width: 28,
    height: 28,
    alt: '',
    loading: 'lazy' as const,
    draggable: false,
    style: {
      display: 'block',
      objectFit: 'contain' as const,
      pointerEvents: 'none' as const,
    },
  });
}

/** Web: query-only transitions can update the URL without refreshing route params (see expo-router `getNavigateAction`). */
const iconGallerySearchListeners = new Set<() => void>();
let iconGalleryHistoryPatchInstalled = false;
let savedPushState: typeof history.pushState | null = null;
let savedReplaceState: typeof history.replaceState | null = null;

function notifyIconGallerySearchListeners() {
  iconGallerySearchListeners.forEach((fn) => fn());
}

function installIconGalleryHistoryPatch() {
  if (iconGalleryHistoryPatchInstalled || typeof window === 'undefined') return;
  iconGalleryHistoryPatchInstalled = true;
  savedPushState = history.pushState.bind(history);
  savedReplaceState = history.replaceState.bind(history);
  history.pushState = (...args: Parameters<typeof history.pushState>) => {
    savedPushState!(...args);
    notifyIconGallerySearchListeners();
  };
  history.replaceState = (...args: Parameters<typeof history.replaceState>) => {
    savedReplaceState!(...args);
    notifyIconGallerySearchListeners();
  };
}

function subscribeIconGalleryLocationSearch(onStoreChange: () => void) {
  if (typeof window === 'undefined') return () => {};
  iconGallerySearchListeners.add(onStoreChange);
  if (iconGallerySearchListeners.size === 1) installIconGalleryHistoryPatch();
  const onPop = () => notifyIconGallerySearchListeners();
  window.addEventListener('popstate', onPop);
  return () => {
    iconGallerySearchListeners.delete(onStoreChange);
    window.removeEventListener('popstate', onPop);
    if (iconGallerySearchListeners.size === 0 && savedPushState && savedReplaceState) {
      history.pushState = savedPushState;
      history.replaceState = savedReplaceState;
      iconGalleryHistoryPatchInstalled = false;
      savedPushState = null;
      savedReplaceState = null;
    }
  };
}

function snapshotIconGallerySearch() {
  return typeof window !== 'undefined' ? window.location.search : '';
}

function iconsParamsFromSearch(search: string): { weight?: string; icon?: string } {
  const q = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const weight = q.get('weight');
  const icon = q.get('icon');
  const out: { weight?: string; icon?: string } = {};
  if (weight != null && weight !== '') out.weight = weight;
  if (icon != null && icon !== '') out.icon = icon;
  return out;
}

function useIconsSearchParams(
  routerWeight: string | string[] | undefined,
  routerIcon: string | string[] | undefined,
): { weight?: string | string[]; icon?: string | string[] } {
  const search = useSyncExternalStore(
    subscribeIconGalleryLocationSearch,
    snapshotIconGallerySearch,
    () => '',
  );
  return useMemo(() => {
    const fromUrl = iconsParamsFromSearch(search);
    return {
      weight: fromUrl.weight ?? routerWeight,
      icon: fromUrl.icon ?? routerIcon,
    };
  }, [search, routerWeight, routerIcon]);
}

function tabFromParams(weight: string | string[] | undefined): IconStyleTab {
  const w = Array.isArray(weight) ? weight[0] : weight;
  return w === 'solid' || w === 'filled' ? 'solid' : 'outline';
}

/**
 * Web-only icons gallery: CSS Grid + normal document flow (no FlatList / numColumns).
 * Expo Router loads this file instead of icons.tsx when bundling for web.
 */
export default function IconsGalleryScreenWeb() {
  const router = useRouter();
  const t = useTokens();
  const pad = t.spacing[4];
  const gap = t.spacing[2];
  const routerParams = useLocalSearchParams<{
    weight?: string | string[];
    icon?: string | string[];
  }>();
  const params = useIconsSearchParams(routerParams.weight, routerParams.icon);
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

  const gridStyle = useMemo(
    () =>
      ({
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(5.5rem, 1fr))',
        gap,
        width: '100%',
        paddingBottom: pad,
      }) as const,
    [gap, pad],
  );

  /** Plain DOM scroll container: RN Web `ScrollView` can steal clicks from nested `<button>`s. */
  const scrollAreaStyle = useMemo(
    () => ({
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
      minHeight: 0,
      overflowY: 'auto' as const,
      overflowX: 'hidden' as const,
      paddingLeft: pad,
      paddingRight: pad,
      WebkitOverflowScrolling: 'touch' as const,
    }),
    [pad],
  );

  return (
    <>
      <Stack.Screen options={{ title: 'Icons' }} />
      <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: t.colors.bg }}>
        <View style={{ flex: 1, minHeight: 0 }}>
          <View
            style={{
              paddingHorizontal: pad,
              paddingTop: t.spacing[3],
              gap: t.spacing[3],
              zIndex: 2,
              elevation: 2,
              position: 'relative',
            }}
          >
            <Link href="/" asChild>
              <Pressable style={{ alignSelf: 'flex-start' }}>
                <Text style={{ color: t.colors.textSecondary, fontFamily: t.fontFamilies.sans }}>
                  ← Home
                </Text>
              </Pressable>
            </Link>
            {/*
              Drive Outline / Filled via URL (?weight=solid) and real <a href> navigation.
              Clicks then work even when RN Web swallows synthetic press events on overlays.
            */}
            <View style={{ flexDirection: 'row', gap: t.spacing[2], width: '100%' }}>
              <Link
                href="/icons?weight=outline"
                style={{
                  flex: 1,
                  minWidth: 0,
                  paddingVertical: t.spacing[2],
                  paddingHorizontal: t.spacing[3],
                  borderRadius: t.radii.md,
                  borderWidth: 1,
                  borderColor: styleTab === 'outline' ? t.colors.textPrimary : t.colors.border,
                  backgroundColor: styleTab === 'outline' ? t.colors.textPrimary : t.colors.surface,
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
                  minWidth: 0,
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
              Web gallery: CSS Grid, Outline vs Filled (solid) sets, and search within the active
              set. Showing {filtered.length} matches.
            </Text>
          </View>

          <div style={scrollAreaStyle}>
            <div style={gridStyle as CSSProperties}>
              {filtered.map((item) => (
                <Link
                  key={item}
                  href={`/icons?weight=${weightQs}&icon=${encodeURIComponent(item)}`}
                  style={{
                    margin: 0,
                    borderWidth: 1,
                    borderColor: t.colors.border,
                    borderRadius: t.radii.md,
                    paddingTop: t.spacing[2],
                    paddingBottom: t.spacing[1],
                    paddingLeft: t.spacing[1],
                    paddingRight: t.spacing[1],
                    backgroundColor: t.colors.surface,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    cursor: 'pointer',
                    minWidth: 0,
                    textDecorationLine: 'none',
                  }}
                >
                  <View
                    style={{
                      width: '100%',
                      height: 36,
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <ThumbImg name={item} />
                  </View>
                  <span
                    style={{
                      display: 'block',
                      width: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      color: t.colors.textTertiary,
                      fontFamily: t.fontFamilies.mono,
                      fontSize: 9,
                      lineHeight: '12px',
                      textAlign: 'center',
                      pointerEvents: 'none',
                    }}
                  >
                    {stripWeightPrefix(item)}
                  </span>
                </Link>
              ))}
            </div>
            <Text
              style={{
                marginTop: t.spacing[2],
                marginBottom: pad,
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
          </div>
        </View>

        {active !== null && typeof document !== 'undefined'
          ? createPortal(
              <View
                style={
                  {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 2147483646,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: pad,
                  } as unknown as ViewStyle
                }
                pointerEvents="box-none"
              >
                <Pressable
                  onPress={closeDetail}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.45)',
                  }}
                />
                <View style={{ maxWidth: 480, width: '100%', zIndex: 1 }} pointerEvents="box-none">
                  <View
                    style={{
                      backgroundColor: t.colors.bg,
                      borderRadius: t.radii.lg,
                      padding: t.spacing[5],
                      gap: t.spacing[4],
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
                    <View
                      style={{
                        alignItems: 'center',
                        padding: t.spacing[4],
                        backgroundColor: t.colors.surface,
                        borderRadius: t.radii.md,
                      }}
                    >
                      {createElement('img', {
                        src: `/arloui-icons/${active}.svg`,
                        width: 56,
                        height: 56,
                        alt: '',
                        style: {
                          display: 'block',
                          objectFit: 'contain' as const,
                          pointerEvents: 'none' as const,
                        },
                      })}
                    </View>
                    <View style={{ gap: t.spacing[2] }}>
                      <Pressable
                        onPress={copySvg}
                        style={({ pressed }) => ({
                          backgroundColor: t.colors.textPrimary,
                          paddingVertical: t.spacing[3],
                          borderRadius: t.radii.md,
                          alignItems: 'center',
                          opacity: pressed ? 0.9 : 1,
                          cursor: 'pointer',
                        })}
                      >
                        <Text
                          style={{
                            color: t.colors.bg,
                            fontFamily: t.fontFamilies.sans,
                            fontWeight: '600',
                          }}
                        >
                          Copy SVG
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={copyJsx}
                        style={({ pressed }) => ({
                          borderWidth: 1,
                          borderColor: t.colors.borderStrong,
                          paddingVertical: t.spacing[3],
                          borderRadius: t.radii.md,
                          alignItems: 'center',
                          opacity: pressed ? 0.9 : 1,
                          cursor: 'pointer',
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
                        onPress={closeDetail}
                        style={({ pressed }) => ({
                          paddingVertical: t.spacing[2],
                          alignItems: 'center',
                          opacity: pressed ? 0.85 : 1,
                          cursor: 'pointer',
                        })}
                      >
                        <Text
                          style={{ color: t.colors.textSecondary, fontFamily: t.fontFamilies.sans }}
                        >
                          Close
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>,
              document.body,
            )
          : null}
      </SafeAreaView>
    </>
  );
}
