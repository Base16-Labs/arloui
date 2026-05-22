import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import {
  Button,
  Card,
  FabButton,
  SocialAuthButton,
  useTokens,
  type ButtonAppearance,
  type ButtonTone,
} from '@arloui/registry';
import { PlaygroundChip } from '@/components/playground/playground-chip';
import { SectionLabel } from '@/components/playground/section-label';
import { ShowcaseScreen } from '@/components/playground/showcase-screen';
import {
  AppleMark,
  FacebookMark,
  GoogleMark,
  XMark,
} from '@/components/playground/social-brand-marks';

type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';
type IconLayout = 'none' | 'leading' | 'both';

const TONES: ButtonTone[] = ['primary', 'neutral', 'danger'];
const APPEARANCES: ButtonAppearance[] = ['solid', 'soft', 'ghost', 'outline'];
const SIZES: ButtonSize[] = ['sm', 'md', 'lg', 'xl'];

export default function ButtonShowcase() {
  const t = useTokens();
  const rowGap = t.spacing[3];
  const is = t.sizing.icon.md;

  const [tone, setTone] = useState<ButtonTone>('primary');
  const [appearance, setAppearance] = useState<ButtonAppearance>('solid');
  const [size, setSize] = useState<ButtonSize>('md');
  const [iconLayout, setIconLayout] = useState<IconLayout>('both');

  const pi = t.colors.textInteractivePrimary;
  const pt = t.colors.textInteractiveTertiary;
  const pp = t.colors.interactivePrimary;
  const tp = t.colors.textPrimary;
  const ie = t.colors.textInteractiveError;

  const previewIcons = useMemo(() => {
    const iconSize =
      size === 'sm' ? t.sizing.icon.sm : size === 'md' ? t.sizing.icon.md : t.sizing.icon.lg;
    const fg =
      tone === 'danger'
        ? appearance === 'solid'
          ? pi
          : ie
        : tone === 'neutral'
          ? appearance === 'solid'
            ? pi
            : tp
          : appearance === 'solid'
            ? pi
            : appearance === 'soft'
              ? pp
              : pt;
    return bagArrow(fg, iconSize);
  }, [tone, appearance, size, t, pi, pt, pp, tp, ie]);

  return (
    <ShowcaseScreen
      eyebrow="Controls"
      title="Button"
      subtitle="Tone × appearance, sizes, FAB, social auth, and states — aligned with the www docs preview."
      stackTitle="Button"
    >
      <SectionLabel>Variants</SectionLabel>
      <Card>
        <Card.Body>
          <View style={{ gap: t.spacing[4] }}>
            <VariantRow label="Tone">
              {TONES.map((x) => (
                <PlaygroundChip key={x} label={x} active={tone === x} onPress={() => setTone(x)} />
              ))}
            </VariantRow>
            <VariantRow label="Appearance">
              {APPEARANCES.map((x) => (
                <PlaygroundChip
                  key={x}
                  label={x}
                  active={appearance === x}
                  onPress={() => setAppearance(x)}
                />
              ))}
            </VariantRow>
            <VariantRow label="Size">
              {SIZES.map((x) => (
                <PlaygroundChip key={x} label={x} active={size === x} onPress={() => setSize(x)} />
              ))}
            </VariantRow>
            <VariantRow label="Icons">
              {(['none', 'leading', 'both'] as const).map((x) => (
                <PlaygroundChip
                  key={x}
                  label={x}
                  active={iconLayout === x}
                  onPress={() => setIconLayout(x)}
                />
              ))}
            </VariantRow>
            <View
              style={{
                alignItems: 'center',
                paddingVertical: t.spacing[5],
                paddingHorizontal: t.spacing[3],
                borderRadius: t.radii.lg,
                borderWidth: 1,
                borderColor: t.colors.border,
                backgroundColor: t.colors.surface,
              }}
            >
              <Button
                tone={tone}
                appearance={appearance}
                size={size}
                label="Button"
                fullWidth
                {...(iconLayout === 'none'
                  ? {}
                  : iconLayout === 'leading'
                    ? { leadingIcon: previewIcons.leadingIcon }
                    : previewIcons)}
              />
            </View>
          </View>
        </Card.Body>
      </Card>

      <SectionLabel>Tone × appearance</SectionLabel>
      <Card>
        <Card.Body>
          <View style={{ gap: rowGap, alignItems: 'flex-start' }}>
            <LabeledRow label="Primary">
              <Button tone="primary" appearance="solid" label="Button" {...bagArrow(pi, is)} />
              <Button tone="primary" appearance="soft" label="Button" {...bagArrow(pp, is)} />
              <Button tone="primary" appearance="ghost" label="Button" {...bagArrow(pt, is)} />
              <Button tone="primary" appearance="outline" label="Button" {...bagArrow(pp, is)} />
            </LabeledRow>
            <LabeledRow label="Neutral">
              <Button tone="neutral" appearance="solid" label="Button" {...bagArrow(pi, is)} />
              <Button tone="neutral" appearance="soft" label="Button" {...bagArrow(tp, is)} />
              <Button tone="neutral" appearance="ghost" label="Button" {...bagArrow(tp, is)} />
              <Button tone="neutral" appearance="outline" label="Button" {...bagArrow(tp, is)} />
            </LabeledRow>
            <LabeledRow label="Danger">
              <Button tone="danger" appearance="solid" label="Button" {...bagArrow(pi, is)} />
              <Button tone="danger" appearance="soft" label="Button" {...bagArrow(ie, is)} />
              <Button tone="danger" appearance="ghost" label="Button" {...bagArrow(ie, is)} />
              <Button tone="danger" appearance="outline" label="Button" {...bagArrow(ie, is)} />
            </LabeledRow>
          </View>
        </Card.Body>
      </Card>

      <SectionLabel>Legacy variant</SectionLabel>
      <Card>
        <Card.Body>
          <View style={{ gap: rowGap, alignItems: 'flex-start', flexWrap: 'wrap', flexDirection: 'row' }}>
            <Button variant="primary" label="Primary" />
            <Button variant="secondary" label="Secondary" />
            <Button variant="ghost" label="Ghost" />
            <Button variant="danger" label="Danger" />
          </View>
        </Card.Body>
      </Card>

      <SectionLabel>Sizes</SectionLabel>
      <Card>
        <Card.Body>
          <View style={{ gap: rowGap, alignItems: 'flex-start' }}>
            <Button tone="primary" appearance="solid" label="Small" size="sm" {...bagArrow(pi, t.sizing.icon.sm)} />
            <Button tone="primary" appearance="solid" label="Medium" size="md" {...bagArrow(pi, is)} />
            <Button tone="primary" appearance="solid" label="Large" size="lg" {...bagArrow(pi, t.sizing.icon.lg)} />
            <Button tone="primary" appearance="solid" label="Extra large" size="xl" {...bagArrow(pi, t.sizing.icon.lg)} />
          </View>
        </Card.Body>
      </Card>

      <SectionLabel>Icon only</SectionLabel>
      <Card>
        <Card.Body>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: t.spacing[3], alignItems: 'center' }}>
            <Button tone="primary" appearance="solid" label="Cart" iconOnly leadingIcon={<Ionicons name="bag-outline" size={is} color={pi} />} />
            <Button tone="primary" appearance="soft" label="Cart" iconOnly leadingIcon={<Ionicons name="bag-outline" size={is} color={pp} />} />
            <Button tone="primary" appearance="outline" label="Cart" iconOnly leadingIcon={<Ionicons name="bag-outline" size={is} color={pp} />} />
            <Button tone="neutral" appearance="ghost" label="Cart" iconOnly leadingIcon={<Ionicons name="bag-outline" size={is} color={tp} />} />
          </View>
        </Card.Body>
      </Card>

      <SectionLabel>Social auth</SectionLabel>
      <Card>
        <Card.Body>
          <View style={{ gap: rowGap, alignSelf: 'stretch' }}>
            <Text
              style={{
                fontFamily: t.fontFamilies.sans,
                fontSize: t.typography.bodySm.fontSize,
                lineHeight: t.typography.bodySm.lineHeight,
                color: t.colors.textSecondary,
              }}
            >
              Matches the www phone preview: Google and Apple use Button with brand marks; Facebook and X
              use SocialAuthButton with SVG leading icons.
            </Text>
            <View style={{ gap: t.spacing[2], alignSelf: 'stretch' }}>
              <Button
                label="Continue with Google"
                tone="neutral"
                appearance="outline"
                fullWidth
                leadingIcon={<GoogleMark size={18} />}
                style={{ backgroundColor: '#FFFFFF', borderColor: '#DADCE0' }}
                labelStyle={{ color: '#1F1F1F' }}
              />
              <SocialAuthButton
                provider="facebook"
                appearance="brandSolid"
                fullWidth
                renderLeading={() => <FacebookMark size={18} color="#FFFFFF" />}
              />
              <SocialAuthButton
                provider="x"
                appearance="brandSolid"
                fullWidth
                renderLeading={() => <XMark size={18} color="#FFFFFF" />}
              />
              <Button
                label="Continue with Apple"
                tone="neutral"
                appearance="solid"
                fullWidth
                leadingIcon={<AppleMark size={18} color="#FFFFFF" />}
                style={{ backgroundColor: '#000000' }}
                labelStyle={{ color: '#FFFFFF' }}
              />
            </View>

            <Text
              style={{
                marginTop: t.spacing[2],
                fontFamily: t.fontFamilies.mono,
                fontSize: t.typography.label.fontSize,
                color: t.colors.textTertiary,
              }}
            >
              SocialAuthButton appearances
            </Text>
            <LabeledRow label="Facebook">
              <SocialAuthButton
                provider="facebook"
                appearance="brandSolid"
                renderLeading={() => <FacebookMark size={18} color="#FFFFFF" />}
              />
              <SocialAuthButton
                provider="facebook"
                appearance="brandSoft"
                renderLeading={(_, px) => <FacebookMark size={px} color="#1877F2" />}
              />
              <SocialAuthButton
                provider="facebook"
                appearance="brandOutline"
                renderLeading={(_, px) => <FacebookMark size={px} color="#1877F2" />}
              />
            </LabeledRow>
            <LabeledRow label="X">
              <SocialAuthButton
                provider="x"
                appearance="brandSolid"
                renderLeading={() => <XMark size={18} color="#FFFFFF" />}
              />
              <SocialAuthButton
                provider="x"
                appearance="brandSoft"
                renderLeading={(_, px) => <XMark size={px} color="#000000" />}
              />
              <SocialAuthButton
                provider="x"
                appearance="brandOutline"
                renderLeading={(_, px) => <XMark size={px} color="#000000" />}
              />
            </LabeledRow>
            <LabeledRow label="Neutral">
              <SocialAuthButton provider="facebook" appearance="neutralSolid" />
              <SocialAuthButton provider="x" appearance="neutralOutline" />
            </LabeledRow>
          </View>
        </Card.Body>
      </Card>

      <SectionLabel>FAB</SectionLabel>
      <Card>
        <Card.Body>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: t.spacing[4], alignItems: 'center' }}>
            <FabButton tone="primary" size="sm" accessibilityLabel="Add">
              <Ionicons name="add" size={t.sizing.icon.sm} color={pi} />
            </FabButton>
            <FabButton tone="neutral" size="sm" accessibilityLabel="Add neutral">
              <Ionicons name="add" size={t.sizing.icon.sm} color={tp} />
            </FabButton>
            <FabButton tone="primary" size="md" accessibilityLabel="Add">
              <Ionicons name="add" size={is} color={pi} />
            </FabButton>
            <FabButton tone="neutral" size="md" accessibilityLabel="Disabled FAB" disabled>
              <Ionicons name="add" size={is} color={pi} />
            </FabButton>
          </View>
        </Card.Body>
      </Card>

      <SectionLabel>States</SectionLabel>
      <Card>
        <Card.Body>
          <View style={{ gap: rowGap, alignItems: 'flex-start' }}>
            <Button tone="primary" appearance="solid" label="Disabled" disabled {...bagArrow(pi, is)} />
            <Button tone="primary" appearance="solid" label="Loading" loading {...bagArrow(pi, is)} />
            <Button tone="neutral" appearance="ghost" label="Ghost disabled" disabled {...bagArrow(tp, is)} />
            <Button label="$1,247.93" mono variant="secondary" />
          </View>
        </Card.Body>
      </Card>
    </ShowcaseScreen>
  );
}

function bagArrow(iconColor: string, iconSize: number) {
  return {
    leadingIcon: <Ionicons name="bag-outline" size={iconSize} color={iconColor} />,
    trailingIcon: <Ionicons name="arrow-forward" size={iconSize - 2} color={iconColor} />,
  };
}

function VariantRow({ label, children }: { label: string; children: ReactNode }) {
  const t = useTokens();
  return (
    <View style={{ gap: t.spacing[2] }}>
      <Text
        style={{
          fontFamily: t.fontFamilies.mono,
          fontSize: t.typography.label.fontSize,
          color: t.colors.textTertiary,
          textTransform: 'uppercase',
          letterSpacing: 0.6,
        }}
      >
        {label}
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: t.spacing[2] }}>{children}</View>
    </View>
  );
}

function LabeledRow({ label, children }: { label: string; children: ReactNode }) {
  const t = useTokens();
  return (
    <View style={{ gap: t.spacing[2], alignSelf: 'stretch' }}>
      <Text
        style={{
          fontFamily: t.fontFamilies.mono,
          fontSize: t.typography.label.fontSize,
          color: t.colors.textTertiary,
        }}
      >
        {label}
      </Text>
      <View style={{ gap: t.spacing[2], alignItems: 'flex-start', flexWrap: 'wrap', flexDirection: 'row' }}>
        {children}
      </View>
    </View>
  );
}
