import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { Chip, useTokens, type ChipAccent, type ChipRadius, type ChipSelectionIndicator, type ChipSize, type ChipStyle, type ChipType } from '@arloui/registry';
import { CanvasPill } from '@/components/playground/canvas-pill';
import { LiveBadge } from '@/components/playground/live-badge';
import { ThemeToggle } from '@/components/playground/theme-toggle';
import { VariantChip as VariantChipControl, VariantControlRow } from '@/components/playground/variant-controls';
import { VariantSheet } from '@/components/playground/variant-sheet';

type PreviewState = 'default' | 'disabled';
type IconMode = 'none' | 'leading' | 'icon-only';

const TYPES: ChipType[] = ['filter', 'input', 'assist'];
const STYLES: ChipStyle[] = ['outline', 'fill'];
const ACCENTS: ChipAccent[] = ['primary', 'neutral'];
const RADII: ChipRadius[] = ['full', 'lg'];
const INDICATORS: ChipSelectionIndicator[] = ['check', 'none'];
const SIZES: ChipSize[] = ['sm', 'md'];
const STATES: PreviewState[] = ['default', 'disabled'];
const ICON_MODES: IconMode[] = ['none', 'leading', 'icon-only'];

const FILTER_OPTIONS = ['All', 'Active', 'Archived', 'Draft'];
const INPUT_TOKENS = ['React Native', 'TypeScript', 'Expo'];

function StarIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M8 1.5L9.8 5.7L14.2 6.1L10.9 9.1L11.8 13.5L8 11.3L4.2 13.5L5.1 9.1L1.8 6.1L6.2 5.7L8 1.5Z"
        fill={color}
      />
    </Svg>
  );
}

function CalendarIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M5.5 1.5V3.5M10.5 1.5V3.5M2.5 6.5H13.5M3.5 3H12.5C13.0523 3 13.5 3.44772 13.5 4V13C13.5 13.5523 13.0523 14 12.5 14H3.5C2.94772 14 2.5 13.5523 2.5 13V4C2.5 3.44772 2.94772 3 3.5 3Z"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function GlobeIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M8 14.5C11.5899 14.5 14.5 11.5899 14.5 8C14.5 4.41015 11.5899 1.5 8 1.5C4.41015 1.5 1.5 4.41015 1.5 8C1.5 11.5899 4.41015 14.5 8 14.5ZM1.5 8H14.5M8 1.5C9.657 3.313 10.614 5.6 10.7 8C10.614 10.4 9.657 12.687 8 14.5C6.343 12.687 5.386 10.4 5.3 8C5.386 5.6 6.343 3.313 8 1.5Z"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const FILTER_ICONS = [StarIcon, CalendarIcon, GlobeIcon, StarIcon];
const INPUT_ICONS = [CalendarIcon, GlobeIcon, StarIcon];

export default function ChipCanvas() {
  const t = useTokens();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [chipType, setChipType] = useState<ChipType>('filter');
  const [chipStyle, setChipStyle] = useState<ChipStyle>('outline');
  const [accent, setAccent] = useState<ChipAccent>('primary');
  const [radius, setRadius] = useState<ChipRadius>('full');
  const [indicator, setIndicator] = useState<ChipSelectionIndicator>('check');
  const [size, setSize] = useState<ChipSize>('md');
  const [state, setState] = useState<PreviewState>('default');
  const [iconMode, setIconMode] = useState<IconMode>('none');
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set(['Active']));
  const [tokens, setTokens] = useState(INPUT_TOKENS);
  const [previewOffset] = useState(() => new Animated.Value(0));

  const iconSize = size === 'sm' ? 14 : 16;

  useEffect(() => {
    Animated.spring(previewOffset, {
      toValue: sheetOpen ? -120 : 0,
      damping: 27,
      stiffness: 300,
      mass: 0.8,
      useNativeDriver: true,
    }).start();
  }, [previewOffset, sheetOpen]);

  const toggleFilter = (label: string) => {
    setSelectedFilters((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const removeToken = (label: string) => {
    setTokens((prev) => prev.filter((t) => t !== label));
  };

  const renderIcon = (IconComponent: typeof StarIcon) => (
    <IconComponent size={iconSize} color={t.colors.textSecondary} />
  );

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
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing[3] }}>
              <LiveBadge />
            </View>
            <ThemeToggle />
          </View>

          <Animated.View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: t.spacing[6],
              transform: [{ translateY: previewOffset }],
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: t.spacing[2],
                justifyContent: 'center',
              }}
            >
              {chipType === 'filter'
                ? FILTER_OPTIONS.map((label, i) => (
                    <Chip
                      key={label}
                      type="filter"
                      chipStyle={chipStyle}
                      accent={accent}
                      radius={radius}
                      selectionIndicator={indicator}
                      size={size}
                      selected={selectedFilters.has(label)}
                      disabled={state === 'disabled'}
                      leadingIcon={iconMode !== 'none' ? renderIcon(FILTER_ICONS[i % FILTER_ICONS.length]!) : undefined}
                      onPress={() => toggleFilter(label)}
                    >
                      {iconMode === 'icon-only' ? undefined : label}
                    </Chip>
                  ))
                : chipType === 'input'
                  ? tokens.map((label, i) => (
                      <Chip
                        key={label}
                        type="input"
                        chipStyle={chipStyle}
                        accent={accent}
                        radius={radius}
                        size={size}
                        disabled={state === 'disabled'}
                        leadingIcon={iconMode !== 'none' ? renderIcon(INPUT_ICONS[i % INPUT_ICONS.length]!) : undefined}
                        onRemove={() => removeToken(label)}
                      >
                        {iconMode === 'icon-only' ? undefined : label}
                      </Chip>
                    ))
                  : ['Share', 'Export', 'Duplicate'].map((label, i) => (
                      <Chip
                        key={label}
                        type="assist"
                        chipStyle={chipStyle}
                        accent={accent}
                        radius={radius}
                        size={size}
                        disabled={state === 'disabled'}
                        leadingIcon={iconMode !== 'none' ? renderIcon([StarIcon, CalendarIcon, GlobeIcon][i]!) : undefined}
                      >
                        {iconMode === 'icon-only' ? undefined : label}
                      </Chip>
                    ))}
            </View>
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
                componentName="Chip"
                open={false}
                onComponentPress={() => router.replace('/')}
                onMenuPress={() => setSheetOpen(true)}
              />
            </View>
          ) : null}

          <VariantSheet
            visible={sheetOpen}
            previous="Badge"
            next="Button"
            onClose={() => setSheetOpen(false)}
            onPrevious={() => router.replace('/badge')}
            onNext={() => router.replace('/button')}
          >
            <View style={{ gap: t.spacing[4] }}>
              <VariantControlRow label="Type">
                {TYPES.map((value) => (
                  <VariantChipControl
                    key={value}
                    label={value}
                    active={chipType === value}
                    onPress={() => {
                      setChipType(value);
                      if (value === 'input') setTokens(INPUT_TOKENS);
                    }}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Style">
                {STYLES.map((value) => (
                  <VariantChipControl
                    key={value}
                    label={value}
                    active={chipStyle === value}
                    onPress={() => setChipStyle(value)}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Accent">
                {ACCENTS.map((value) => (
                  <VariantChipControl
                    key={value}
                    label={value}
                    active={accent === value}
                    onPress={() => setAccent(value)}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Selected">
                {INDICATORS.map((value) => (
                  <VariantChipControl
                    key={value}
                    label={value}
                    active={indicator === value}
                    onPress={() => setIndicator(value)}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Icon">
                {ICON_MODES.map((value) => (
                  <VariantChipControl
                    key={value}
                    label={value}
                    active={iconMode === value}
                    onPress={() => setIconMode(value)}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Radius">
                {RADII.map((value) => (
                  <VariantChipControl
                    key={value}
                    label={value}
                    active={radius === value}
                    onPress={() => setRadius(value)}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="Size">
                {SIZES.map((value) => (
                  <VariantChipControl
                    key={value}
                    label={value}
                    active={size === value}
                    onPress={() => setSize(value)}
                  />
                ))}
              </VariantControlRow>
              <VariantControlRow label="State">
                {STATES.map((value) => (
                  <VariantChipControl
                    key={value}
                    label={value}
                    active={state === value}
                    onPress={() => setState(value)}
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
