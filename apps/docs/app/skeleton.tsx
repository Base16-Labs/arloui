import { Stack, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Skeleton, useTokens, type SkeletonAnimation } from '@arloui/registry';
import { CanvasPill } from '@/components/playground/canvas-pill';
import { LiveBadge } from '@/components/playground/live-badge';
import { ThemeToggle } from '@/components/playground/theme-toggle';
import { VariantChip, VariantControlRow } from '@/components/playground/variant-controls';
import { VariantSheet } from '@/components/playground/variant-sheet';

type SkeletonPattern = 'feed' | 'article' | 'profile';

const PATTERNS: SkeletonPattern[] = ['feed', 'article', 'profile'];
const MOTIONS: SkeletonAnimation[] = ['shimmer', 'pulse', 'none'];
const ARTICLE_LINE_WIDTHS = ['100%', '96%', '86%', '92%', '60%'] as const;

export default function SkeletonCanvas() {
  const t = useTokens();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [menuOpen, setMenuOpen] = useState(false);
  const [pattern, setPattern] = useState<SkeletonPattern>('feed');
  const [animation, setAnimation] = useState<SkeletonAnimation>('shimmer');
  const previewOffset = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(previewOffset, {
      toValue: menuOpen ? -112 : 0,
      damping: 27,
      stiffness: 300,
      mass: 0.8,
      useNativeDriver: true,
    }).start();
  }, [menuOpen, previewOffset]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.colors.bg }}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              position: 'absolute',
              top: 22,
              right: 20,
              left: 20,
              zIndex: 5,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <LiveBadge />
            <ThemeToggle />
          </View>

          <Animated.View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: 64,
              paddingHorizontal: 20,
              paddingBottom: 88,
              transform: [{ translateY: previewOffset }],
            }}
          >
            <View
              style={{
                width: '100%',
                maxWidth: 350,
                height: 470,
                overflow: 'hidden',
                borderRadius: 34,
                borderWidth: 1,
                borderColor: t.colors.border,
                backgroundColor: t.colors.surface,
                padding: 20,
              }}
            >
              <SkeletonPatternPreview pattern={pattern} animation={animation} />
            </View>
          </Animated.View>

          {!menuOpen ? (
            <View
              style={{
                position: 'absolute',
                right: 0,
                bottom: Math.max(insets.bottom, 14),
                left: 0,
                alignItems: 'center',
              }}
            >
              <CanvasPill
                componentName="Skeleton"
                open={false}
                onComponentPress={() => router.replace('/')}
                onMenuPress={() => setMenuOpen(true)}
              />
            </View>
          ) : null}

          <VariantSheet
            visible={menuOpen}
            previous="Sheet"
            next="Tab Bar"
            onClose={() => setMenuOpen(false)}
            onPrevious={() => router.replace('/sheet')}
            onNext={() => router.replace('/tab-bar')}
          >
            <View style={{ gap: 14 }}>
              <VariantControlRow label="Pattern">
                {PATTERNS.map((option) => (
                  <VariantChip
                    key={option}
                    label={option}
                    active={pattern === option}
                    onPress={() => setPattern(option)}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Motion">
                {MOTIONS.map((option) => (
                  <VariantChip
                    key={option}
                    label={option}
                    active={animation === option}
                    onPress={() => setAnimation(option)}
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

function SkeletonPatternPreview({
  pattern,
  animation,
}: {
  pattern: SkeletonPattern;
  animation: SkeletonAnimation;
}) {
  if (pattern === 'article') return <ArticleSkeleton animation={animation} />;
  if (pattern === 'profile') return <ProfileSkeleton animation={animation} />;
  return <FeedSkeleton animation={animation} />;
}

function FeedSkeleton({ animation }: { animation: SkeletonAnimation }) {
  return (
    <View style={{ gap: 18 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Skeleton shape="circle" width={44} height={44} animation={animation} />
        <View style={{ flex: 1, gap: 8 }}>
          <Skeleton shape="text" width="46%" animation={animation} />
          <Skeleton shape="text" width="28%" height={9} animation={animation} />
        </View>
      </View>
      <Skeleton height={214} borderRadius={18} animation={animation} />
      <View style={{ gap: 9 }}>
        <Skeleton shape="text" width="88%" animation={animation} />
        <Skeleton shape="text" width="64%" animation={animation} />
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Skeleton width={68} height={32} borderRadius={16} animation={animation} />
        <Skeleton width={68} height={32} borderRadius={16} animation={animation} />
      </View>
    </View>
  );
}

function ArticleSkeleton({ animation }: { animation: SkeletonAnimation }) {
  return (
    <View style={{ gap: 18 }}>
      <View style={{ gap: 10 }}>
        <Skeleton shape="text" width="92%" height={22} animation={animation} />
        <Skeleton shape="text" width="68%" height={22} animation={animation} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Skeleton shape="circle" width={32} height={32} animation={animation} />
        <Skeleton shape="text" width="32%" height={10} animation={animation} />
      </View>
      <Skeleton height={160} borderRadius={16} animation={animation} />
      <View style={{ gap: 10 }}>
        {ARTICLE_LINE_WIDTHS.map((width, index) => (
          <Skeleton key={`${width}-${index}`} shape="text" width={width} animation={animation} />
        ))}
      </View>
    </View>
  );
}

function ProfileSkeleton({ animation }: { animation: SkeletonAnimation }) {
  return (
    <View style={{ alignItems: 'center', gap: 14, paddingTop: 18 }}>
      <Skeleton shape="circle" width={88} height={88} animation={animation} />
      <Skeleton shape="text" width={128} height={18} animation={animation} />
      <Skeleton shape="text" width={82} height={10} animation={animation} />
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-around',
          paddingVertical: 20,
        }}
      >
        {[0, 1, 2].map((item) => (
          <View key={item} style={{ alignItems: 'center', gap: 8 }}>
            <Skeleton width={36} height={18} animation={animation} />
            <Skeleton shape="text" width={54} height={9} animation={animation} />
          </View>
        ))}
      </View>
      <Skeleton height={46} borderRadius={23} animation={animation} />
      <View style={{ width: '100%', gap: 12, paddingTop: 6 }}>
        {[0, 1, 2].map((item) => (
          <View key={item} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Skeleton shape="circle" width={38} height={38} animation={animation} />
            <View style={{ flex: 1, gap: 7 }}>
              <Skeleton shape="text" width="58%" animation={animation} />
              <Skeleton shape="text" width="34%" height={9} animation={animation} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
