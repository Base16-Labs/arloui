import { Link, Stack } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { Button, Card } from '@arloui/registry';
import { useTokens } from '@arloui/registry';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const t = useTokens();
  return (
    <>
      <Stack.Screen options={{ title: 'Arlo UI' }} />
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.colors.bg }}>
        <ScrollView contentContainerStyle={{ padding: t.spacing[5], gap: t.spacing[6] }}>
          <View style={{ gap: t.spacing[2] }}>
            <Text
              style={{
                color: t.colors.textTertiary,
                fontFamily: t.fontFamilies.mono,
                fontSize: t.typography.label.fontSize,
                letterSpacing: t.typography.label.letterSpacing,
                textTransform: 'uppercase',
              }}
            >
              arlo ui · v0.1.0
            </Text>
            <Text
              style={{
                color: t.colors.textPrimary,
                fontFamily: t.fontFamilies.sans,
                fontSize: t.typography.displayLg.fontSize,
                lineHeight: t.typography.displayLg.lineHeight,
                fontWeight: '600',
              }}
            >
              Copy-paste UI for React Native.
            </Text>
            <Text
              style={{
                color: t.colors.textSecondary,
                fontFamily: t.fontFamilies.sans,
                fontSize: t.typography.body.fontSize,
                lineHeight: t.typography.body.lineHeight,
              }}
            >
              Premium primitives. Token-driven. Zero black boxes.
            </Text>
          </View>

          <Card>
            <Card.Header>
              <Card.Title>Button</Card.Title>
              <Card.Subtitle>Variants and sizes</Card.Subtitle>
            </Card.Header>
            <Card.Body>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: t.spacing[2] }}>
                <Button label="Primary" />
                <Button label="Secondary" variant="secondary" />
                <Button label="Ghost" variant="ghost" />
                <Button label="Danger" variant="danger" />
              </View>
            </Card.Body>
          </Card>

          <Card tone="raised">
            <Card.Header>
              <Card.Title>Icons</Card.Title>
              <Card.Subtitle>Copy SVG or React usage (web gallery)</Card.Subtitle>
            </Card.Header>
            <Card.Body>
              <Link href="/icons" asChild>
                <Button label="Icon gallery →" variant="secondary" />
              </Link>
            </Card.Body>
          </Card>

          <Card tone="raised">
            <Card.Header>
              <Card.Title>Components</Card.Title>
              <Card.Subtitle>Browse the registry</Card.Subtitle>
            </Card.Header>
            <Card.Body style={{ gap: t.spacing[2] }}>
              <Link href="/button" asChild>
                <Button label="Button showcase →" variant="secondary" />
              </Link>
              <Link href={'/input' as never} asChild>
                <Button label="Input showcase →" variant="secondary" />
              </Link>
            </Card.Body>
          </Card>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
