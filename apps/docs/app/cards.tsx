import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import {
  Button,
  Card,
  Carousel,
  List,
  useTokens,
  type CardElevation,
  type CardHaptic,
  type CardRadius,
  type CardSpacing,
  type CardSurface,
} from '@arloui/registry';
import { CanvasPill } from '@/components/playground/canvas-pill';
import { LiveBadge } from '@/components/playground/live-badge';
import { ThemeToggle } from '@/components/playground/theme-toggle';
import { VariantChip, VariantControlRow } from '@/components/playground/variant-controls';
import { VariantSheet } from '@/components/playground/variant-sheet';

// Recipes compose Card with the other primitives — they are not props on Card.
// The playground shows them so the surface reads in context; the docs spell out
// that a "media card" or "list card" is a composition, not a component.
type Recipe = 'basic' | 'media' | 'action' | 'list' | 'carousel';

const RECIPES: Recipe[] = ['basic', 'media', 'action', 'list', 'carousel'];
const SURFACES: CardSurface[] = ['default', 'elevated', 'bleed', 'inverse'];
const ELEVATIONS: CardElevation[] = ['none', 'sm', 'md', 'lg'];
const BORDERS: number[] = [0, 1, 2, 3, 4];
// 'off' makes the card non-interactive; the rest pass onPress + that haptic.
const PRESSES: ('off' | CardHaptic)[] = ['off', 'light', 'medium', 'heavy'];
const PADDINGS: CardSpacing[] = ['xs', 'sm', 'md', 'lg', 'xl'];
const RADII: CardRadius[] = ['none', 'sm', 'md', 'lg', 'xl', '2xl'];

export default function CardsCanvas() {
  const t = useTokens();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [recipe, setRecipe] = useState<Recipe>('basic');
  const [surface, setSurface] = useState<CardSurface>('default');
  const [elevation, setElevation] = useState<CardElevation>('none');
  const [border, setBorder] = useState(1);
  const [padding, setPadding] = useState<CardSpacing>('md');
  const [radius, setRadius] = useState<CardRadius>('xl');
  const [press, setPress] = useState<'off' | CardHaptic>('off');
  const [previewOffset] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.spring(previewOffset, {
      toValue: sheetOpen ? -120 : 0,
      damping: 27,
      stiffness: 300,
      mass: 0.8,
      useNativeDriver: true,
    }).start();
  }, [previewOffset, sheetOpen]);

  const common = {
    surface,
    elevation,
    border,
    radius,
    onPress: press === 'off' ? undefined : () => {},
    haptic: press === 'off' ? undefined : press,
  } as const;
  // Soft, background-like gradient for the `bleed` backdrop — one set per theme.
  const ambient =
    t.name === 'dark'
      ? ['#4C43B0', '#3D4CB4', '#6E3FA4']
      : ['#EDE9FE', '#E0E7FF', '#FCE7F3'];
  const rowIcon = (name: keyof typeof Ionicons.glyphMap) => (
    <Ionicons name={name} size={22} color={t.colors.textSecondary} />
  );
  const chevron = <Ionicons name="chevron-forward" size={18} color={t.colors.textTertiary} />;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.colors.bg }}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              position: 'absolute',
              top: 22,
              left: 20,
              right: 20,
              zIndex: 5,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <LiveBadge />
            </View>
            <ThemeToggle />
          </View>

          <Animated.View style={{ flex: 1, transform: [{ translateY: previewOffset }] }}>
            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingTop: 76,
                paddingBottom: 120,
                justifyContent: 'center',
                flexGrow: 1,
              }}
            >
              {/* For `bleed`, a screen-like frame with a soft ambient gradient so the
                  translucent surface reads against colour, like a card over a hero. */}
              <View
                style={
                  surface === 'bleed'
                    ? {
                        width: '100%',
                        minHeight: 440,
                        borderRadius: 34,
                        overflow: 'hidden',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }
                    : undefined
                }
              >
                {surface === 'bleed' ? (
                  <Svg style={StyleSheet.absoluteFill}>
                    <Defs>
                      {/* Soft, background-like ambient wash — theme-aware, not a vivid hero. */}
                      <RadialGradient id="ambient" cx="26%" cy="18%" r="110%">
                        <Stop offset="0" stopColor={ambient[0]} />
                        <Stop offset="0.55" stopColor={ambient[1]} />
                        <Stop offset="1" stopColor={ambient[2]} />
                      </RadialGradient>
                    </Defs>
                    {/* rx/ry rounds the fill itself — iOS won't reliably clip a native
                        SVG to the parent's borderRadius. */}
                    <Rect x="0" y="0" width="100%" height="100%" rx={34} ry={34} fill="url(#ambient)" />
                  </Svg>
                ) : null}

                <View style={{ width: surface === 'bleed' ? '84%' : '100%' }}>
                {recipe === 'basic' ? (
                  <Card {...common} padding={padding}>
                    <Card.Header>
                      <Card.Title>Weekly summary</Card.Title>
                      <Card.Subtitle>The surface primitive — border, radius, slots.</Card.Subtitle>
                    </Card.Header>
                    <Card.Body>
                      <Card.Subtitle>
                        Depth comes from layering and spacing before shadows. Elevation is opt-in.
                      </Card.Subtitle>
                    </Card.Body>
                  </Card>
                ) : null}

                {recipe === 'media' ? (
                  <Card {...common} padding="none">
                    <Card.Media height={160}>
                      <View style={{ flex: 1, backgroundColor: t.colors.chartSeries1, opacity: 0.8 }} />
                    </Card.Media>
                    <Card.Body style={{ padding: t.spacing[4], gap: 2 }}>
                      <Card.Title>Kyoto in autumn</Card.Title>
                      <Card.Subtitle>12 photos · shared album</Card.Subtitle>
                    </Card.Body>
                  </Card>
                ) : null}

                {recipe === 'action' ? (
                  <Card {...common} padding={padding}>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: t.radii.full,
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: t.colors.surfaceInput,
                        }}
                      >
                        <Ionicons name="shield-checkmark" size={20} color={t.colors.interactivePrimary} />
                      </View>
                      <View style={{ flex: 1, gap: 2 }}>
                        <Card.Title>Turn on two-factor auth</Card.Title>
                        <Card.Subtitle>Add a second step when signing in from a new device.</Card.Subtitle>
                      </View>
                    </View>
                    <Card.Footer>
                      <Button tone="neutral" appearance="ghost" size="sm" onPress={() => {}}>
                        Not now
                      </Button>
                      <Button size="sm" onPress={() => {}}>
                        Enable
                      </Button>
                    </Card.Footer>
                  </Card>
                ) : null}

                {recipe === 'list' ? (
                  <Card {...common} padding="none">
                    <List divider="inset">
                      <List.Row
                        leading={rowIcon('musical-notes')}
                        title="Spotify"
                        subtitle="Yesterday"
                        value="−$9.99"
                        valueTone="negative"
                        trailing={chevron}
                        onPress={() => {}}
                      />
                      <List.Row
                        leading={rowIcon('trending-up')}
                        title="Transfer from Ada"
                        subtitle="Mar 3"
                        value="+$1,200.00"
                        valueTone="positive"
                        trailing={chevron}
                        onPress={() => {}}
                      />
                      <List.Row
                        leading={rowIcon('card')}
                        title="Apple Card"
                        subtitle="Feb 28"
                        value="−$42.10"
                        trailing={chevron}
                        onPress={() => {}}
                      />
                    </List>
                  </Card>
                ) : null}

                {recipe === 'carousel' ? (
                  // The Card is the container the Carousel sits in: padding="none" lets
                  // full-bleed items clip to the card's corners, and the dots overlay the
                  // media, so no padding is needed at all.
                  <Card {...common} padding="none">
                    <Carousel snap="item" peek={false} indicator="dots" indicatorPosition="overlay">
                      {[t.colors.chartSeries1, t.colors.chartSeries2, t.colors.chartSeries3].map(
                        (c, i) => (
                          <View key={i} style={{ height: 220, backgroundColor: c, opacity: 0.85 }} />
                        ),
                      )}
                    </Carousel>
                  </Card>
                ) : null}
                </View>
              </View>
            </ScrollView>
          </Animated.View>

          {!sheetOpen ? (
            <View
              style={{
                position: 'absolute',
                bottom: Math.max(insets.bottom, 14),
                left: 0,
                right: 0,
                alignItems: 'center',
              }}
            >
              <CanvasPill
                componentName="Card"
                open={false}
                onComponentPress={() => router.replace('/')}
                onMenuPress={() => setSheetOpen(true)}
              />
            </View>
          ) : null}

          <VariantSheet
            visible={sheetOpen}
            previous="Button"
            next="List"
            onClose={() => setSheetOpen(false)}
            onPrevious={() => router.replace('/button')}
            onNext={() => router.replace('/list')}
          >
            <View style={{ gap: 14 }}>
              <VariantControlRow label="Recipe">
                {RECIPES.map((value) => (
                  <VariantChip
                    key={value}
                    label={value}
                    active={recipe === value}
                    onPress={() => setRecipe(value)}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Surface">
                {SURFACES.map((value) => (
                  <VariantChip
                    key={value}
                    label={value}
                    active={surface === value}
                    onPress={() => {
                      setSurface(value);
                      // "Elevated" only reads as raised if it carries a shadow, so
                      // picking it lifts the elevation to md; any other surface sits flat.
                      setElevation(value === 'elevated' ? 'md' : 'none');
                    }}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Elevation">
                {ELEVATIONS.map((value) => (
                  <VariantChip
                    key={value}
                    label={value}
                    active={elevation === value}
                    onPress={() => setElevation(value)}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Border">
                {BORDERS.map((value) => (
                  <VariantChip
                    key={value}
                    label={String(value)}
                    active={border === value}
                    onPress={() => setBorder(value)}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Padding">
                {PADDINGS.map((value) => (
                  <VariantChip
                    key={value}
                    label={value}
                    active={padding === value}
                    onPress={() => setPadding(value)}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Radius">
                {RADII.map((value) => (
                  <VariantChip
                    key={value}
                    label={value}
                    active={radius === value}
                    onPress={() => setRadius(value)}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="OnPress">
                {PRESSES.map((value) => (
                  <VariantChip
                    key={value}
                    label={value}
                    active={press === value}
                    onPress={() => setPress(value)}
                  />
                ))}
              </VariantControlRow>
            </View>
          </VariantSheet>
        </View>
      </SafeAreaView>
    </>
  );
}
