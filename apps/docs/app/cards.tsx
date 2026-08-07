import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, ScrollView, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ActionCard,
  ListCard,
  MediaCard,
  StatCard,
  useTokens,
  type CardRadius,
  type CardSpacing,
} from '@arloui/registry';
import { CanvasPill } from '@/components/playground/canvas-pill';
import { LiveBadge } from '@/components/playground/live-badge';
import { ThemeToggle } from '@/components/playground/theme-toggle';
import { VariantChip, VariantControlRow } from '@/components/playground/variant-controls';
import { VariantSheet } from '@/components/playground/variant-sheet';

type Variant = 'stat' | 'list' | 'media' | 'action';

const VARIANTS: Variant[] = ['stat', 'list', 'media', 'action'];
const RADII: CardRadius[] = ['none', 'sm', 'md', 'lg', 'xl', '2xl'];
const MARGINS: CardSpacing[] = ['none', 'xs', 'sm', 'md', 'lg'];

const money = (v: number) =>
  `$${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function CardsCanvas() {
  const t = useTokens();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [variant, setVariant] = useState<Variant>('stat');
  const [dismissed, setDismissed] = useState(false);
  const [radius, setRadius] = useState<CardRadius>('xl');
  const [margin, setMargin] = useState<CardSpacing>('none');
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
                gap: 12,
              }}
            >
              {variant === 'stat' ? (
                <>
                  <StatCard
                    radius={radius}
                    margin={margin}
                    label="Balance"
                    value={12480.32}
                    delta={412.19}
                    deltaPercent={3.4}
                    format={money}
                    trend={[900, 940, 910, 1020, 1080, 1040, 1180]}
                  />
                  <StatCard
                    radius={radius}
                    margin={margin}
                    label="Spend"
                    value={2310.4}
                    delta={-186.2}
                    format={money}
                    caption="vs last month"
                    trend={[1400, 1320, 1280, 1180, 1120, 1040, 980]}
                  />
                  <StatCard
                    radius={radius}
                    margin={margin}
                    label="Subscribers"
                    value={18402}
                    icon={<Ionicons name="people-outline" size={18} color={t.colors.textTertiary} />}
                  />
                </>
              ) : null}

              {variant === 'list' ? (
                <>
                  <ListCard.Group radius={radius} margin={margin}>
                    <ListCard
                      title="Spotify"
                      subtitle="Yesterday"
                      value="−$9.99"
                      valueTone="negative"
                      chevron
                      onPress={() => {}}
                      leading={
                        <Ionicons name="musical-notes" size={22} color={t.colors.textSecondary} />
                      }
                    />
                    <ListCard
                      title="Transfer from Ada"
                      subtitle="Mar 3"
                      value="+$1,200.00"
                      valueTone="positive"
                      valueCaption="Completed"
                      chevron
                      onPress={() => {}}
                      leading={<Ionicons name="arrow-down" size={22} color={t.colors.textSecondary} />}
                    />
                    <ListCard
                      title="Refunded"
                      subtitle="Feb 28"
                      value="$0.00"
                      disabled
                      leading={<Ionicons name="ban-outline" size={22} color={t.colors.textSecondary} />}
                    />
                  </ListCard.Group>
                  <ListCard
                    title="Standalone row"
                    subtitle="Carries its own surface"
                    chevron
                    onPress={() => {}}
                  />
                </>
              ) : null}

              {variant === 'media' ? (
                <>
                  <MediaCard
                    radius={radius}
                    margin={margin}
                    title="Kyoto in autumn"
                    subtitle="12 photos · shared album"
                    onPress={() => {}}
                    media={
                      <View style={{ flex: 1, backgroundColor: t.colors.chartSeries1, opacity: 0.75 }} />
                    }
                  />
                  <MediaCard
                    radius={radius}
                    margin={margin}
                    layout="overlay"
                    title="Weekend in Lagos"
                    subtitle="Updated 2h ago"
                    onPress={() => {}}
                    media={
                      <View style={{ flex: 1, backgroundColor: t.colors.chartSeries3, opacity: 0.85 }} />
                    }
                  />
                </>
              ) : null}

              {variant === 'action' ? (
                <>
                  {!dismissed ? (
                    <ActionCard
                    radius={radius}
                    margin={margin}
                      title="Turn on two-factor auth"
                      body="Add a second step when signing in from a new device."
                      icon={<Ionicons name="shield-checkmark" size={20} color={t.colors.interactivePrimary} />}
                      primaryAction={{ label: 'Enable', onPress: () => {} }}
                      secondaryAction={{ label: 'Not now', onPress: () => setDismissed(true) }}
                      onDismiss={() => setDismissed(true)}
                    />
                  ) : (
                    <Text
                      style={{
                        color: t.colors.textTertiary,
                        fontFamily: 'Manrope',
                        fontSize: 13,
                        textAlign: 'center',
                        paddingVertical: 12,
                      }}
                    >
                      Dismissed — switch variants to reset
                    </Text>
                  )}
                  <ActionCard
                    radius={radius}
                    margin={margin}
                    tone="error"
                    title="Payment failed"
                    body="We couldn't charge your card ending in 4242."
                    icon={<Ionicons name="alert-circle" size={20} color={t.colors.feedbackError} />}
                    primaryAction={{ label: 'Update card', onPress: () => {} }}
                  />
                  <ActionCard
                    radius={radius}
                    margin={margin}
                    tone="success"
                    title="You're all set"
                    body="Your account is verified and ready to go."
                    icon={<Ionicons name="checkmark-circle" size={20} color={t.colors.feedbackSuccess} />}
                    stackActions
                    primaryAction={{ label: 'Start using Arlo', onPress: () => {} }}
                  />
                </>
              ) : null}
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
                componentName="Cards"
                open={false}
                onComponentPress={() => router.replace('/')}
                onMenuPress={() => setSheetOpen(true)}
              />
            </View>
          ) : null}

          <VariantSheet
            visible={sheetOpen}
            previous="Carousel"
            next="Chart"
            onClose={() => setSheetOpen(false)}
            onPrevious={() => router.replace('/carousel')}
            onNext={() => router.replace('/chart')}
          >
            <View style={{ gap: 14 }}>
              <VariantControlRow label="Variant">
                {VARIANTS.map((value) => (
                  <VariantChip
                    key={value}
                    label={value}
                    active={variant === value}
                    onPress={() => {
                      setVariant(value);
                      setDismissed(false);
                    }}
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
              <VariantControlRow label="Margin">
                {MARGINS.map((value) => (
                  <VariantChip
                    key={value}
                    label={value}
                    active={margin === value}
                    onPress={() => setMargin(value)}
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
