import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Button, Card, FabButton, SocialAuthButton } from '@arloui/registry';
import { useTokens } from '@arloui/registry';
import { Stack } from 'expo-router';

export default function ButtonShowcase() {
  const t = useTokens();
  const rowGap = t.spacing[3];
  const is = t.sizing.icon.md;

  const pi = t.colors.textInteractivePrimary;
  const pt = t.colors.textInteractiveTertiary;
  const pp = t.colors.interactivePrimary;
  const tp = t.colors.textPrimary;
  const ie = t.colors.textInteractiveError;

  return (
    <>
      <Stack.Screen options={{ title: 'Button' }} />
      <View style={{ flex: 1, minHeight: 0, backgroundColor: t.colors.bg }}>
        <ScrollView
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: t.spacing[5], gap: t.spacing[5], paddingBottom: t.spacing[10], flexGrow: 1 }}
        >
          <SectionTitle title="Tone × appearance (Figma kit)" />
          <Card>
            <Card.Body>
              <Text
                style={{
                  fontFamily: t.fontFamilies.sans,
                  fontSize: t.typography.bodySm.fontSize,
                  color: t.colors.textSecondary,
                  marginBottom: t.spacing[2],
                }}
              >
                Solid uses rounded rect + pressed shadow. Ghost & outline use pill radius.
              </Text>
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

          <SectionTitle title="Legacy variant prop" />
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

          <SectionTitle title="Sizes" />
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

          <SectionTitle title="Icon-only (circle)" />
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

          <SectionTitle title="Social auth (Facebook · X)" />
          <Card>
            <Card.Body>
              <View style={{ gap: rowGap, alignItems: 'stretch' }}>
                <LabeledRow label="Facebook">
                  <SocialAuthButton provider="facebook" appearance="brandSolid" />
                  <SocialAuthButton provider="facebook" appearance="brandSoft" />
                  <SocialAuthButton provider="facebook" appearance="brandOutline" />
                  <SocialAuthButton provider="facebook" appearance="neutralSolid" />
                  <SocialAuthButton provider="facebook" appearance="neutralOutline" />
                </LabeledRow>
                <LabeledRow label="X">
                  <SocialAuthButton provider="x" appearance="brandSolid" />
                  <SocialAuthButton provider="x" appearance="brandSoft" />
                  <SocialAuthButton provider="x" appearance="brandOutline" />
                  <SocialAuthButton provider="x" appearance="neutralSolid" />
                  <SocialAuthButton provider="x" appearance="neutralOutline" />
                </LabeledRow>
              </View>
            </Card.Body>
          </Card>

          <SectionTitle title="FAB (circular)" />
          <Card>
            <Card.Body>
              <Text
                style={{
                  fontFamily: t.fontFamilies.sans,
                  fontSize: t.typography.bodySm.fontSize,
                  color: t.colors.textSecondary,
                  marginBottom: t.spacing[2],
                }}
              >
                Rest shadow `sm`; press darkens fill; disabled ~28% opacity; web focus uses outline ring + offset.
              </Text>
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
                <FabButton tone="neutral" size="md" accessibilityLabel="Add neutral">
                  <Ionicons name="add" size={is} color={tp} />
                </FabButton>
                <FabButton tone="primary" size="md" accessibilityLabel="Disabled FAB" disabled>
                  <Ionicons name="add" size={is} color={pi} />
                </FabButton>
              </View>
            </Card.Body>
          </Card>

          <SectionTitle title="States" />
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
        </ScrollView>
      </View>
    </>
  );
}

function bagArrow(iconColor: string, iconSize: number) {
  return {
    leadingIcon: <Ionicons name="bag-outline" size={iconSize} color={iconColor} />,
    trailingIcon: <Ionicons name="arrow-forward" size={iconSize - 2} color={iconColor} />,
  };
}

function LabeledRow({ label, children }: { label: string; children: ReactNode }) {
  const t = useTokens();
  return (
    <View style={{ gap: t.spacing[2], alignSelf: 'stretch' }}>
      <Text style={{ fontFamily: t.fontFamilies.mono, fontSize: 11, color: t.colors.textTertiary }}>{label}</Text>
      <View style={{ gap: t.spacing[2], alignItems: 'flex-start', flexWrap: 'wrap', flexDirection: 'row' }}>{children}</View>
    </View>
  );
}

function SectionTitle({ title }: { title: string }) {
  const t = useTokens();
  return (
    <Text
      style={{
        color: t.colors.textTertiary,
        fontFamily: t.fontFamilies.mono,
        fontSize: t.typography.label.fontSize,
        letterSpacing: t.typography.label.letterSpacing,
        textTransform: 'uppercase',
      }}
    >
      {title}
    </Text>
  );
}
