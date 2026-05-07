import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Input, InputAction, useTokens } from '@arloui/registry';

export default function InputShowcase() {
  const t = useTokens();
  const [query, setQuery] = useState('Query');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const iconColor = t.colors.textSecondary;
  const errorColor = t.colors.textInteractiveError;

  return (
    <>
      <Stack.Screen options={{ title: 'Input' }} />
      <View style={{ flex: 1, minHeight: 0, backgroundColor: t.colors.bg }}>
        <ScrollView
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            padding: t.spacing[5],
            gap: t.spacing[6],
            paddingBottom: t.spacing[10],
          }}
        >
          <View style={{ gap: t.spacing[2] }}>
            <Text
              style={{
                color: t.colors.textPrimary,
                fontFamily: t.fontFamilies.sans,
                fontSize: t.typography.displayLg.fontSize,
                lineHeight: t.typography.displayLg.lineHeight,
                fontWeight: '600',
              }}
            >
              Text Inputs - Examples
            </Text>
            <Text
              style={{
                color: t.colors.textSecondary,
                fontFamily: t.fontFamilies.sans,
                fontSize: t.typography.body.fontSize,
                lineHeight: t.typography.body.lineHeight,
              }}
            >
              Default, icon, action, password, helper, search, disabled, focused, and error states.
            </Text>
          </View>

          <Section title="Default" subtitle="Example: name fields">
            <Input placeholder="Name" />
            <Input insetLabel label="Name" defaultValue="Allan Thomas" />
          </Section>

          <Section
            title="Leading Icon"
            subtitle="Contextual icon to communicate field better. Example: email fields"
          >
            <Input
              placeholder="Email"
              leadingIcon={<Ionicons name="mail-outline" size={20} color={t.colors.textTertiary} />}
            />
            <Input
              insetLabel
              label="Email"
              defaultValue="allan.thomas@atstudio.com"
              leadingIcon={<Ionicons name="mail-outline" size={20} color={iconColor} />}
            />
          </Section>

          <Section
            title="Leading Action"
            subtitle="Action controlling content of input field. Example: phone fields with country code selection"
          >
            <View style={{ flexDirection: 'row', gap: t.spacing[2] }}>
              <InputAction
                accessibilityLabel="Select country code"
                style={{
                  minHeight: 52,
                  paddingHorizontal: t.spacing[3],
                  gap: t.spacing[1],
                  flexDirection: 'row',
                }}
              >
                <Text style={{ fontFamily: t.fontFamilies.sans, color: t.colors.textPrimary }}>
                  +447
                </Text>
                <Ionicons name="chevron-down" size={16} color={iconColor} />
              </InputAction>
              <Input containerStyle={{ flex: 1 }} placeholder="Phone" />
            </View>
            <View style={{ flexDirection: 'row', gap: t.spacing[2] }}>
              <InputAction
                accessibilityLabel="Select country code"
                style={{
                  minHeight: 52,
                  paddingHorizontal: t.spacing[3],
                  gap: t.spacing[1],
                  flexDirection: 'row',
                }}
              >
                <Text style={{ fontFamily: t.fontFamilies.sans, color: t.colors.textPrimary }}>
                  +447
                </Text>
                <Ionicons name="chevron-down" size={16} color={iconColor} />
              </InputAction>
              <Input
                containerStyle={{ flex: 1 }}
                insetLabel
                label="Phone"
                defaultValue="020-293-9393"
                keyboardType="phone-pad"
              />
            </View>
          </Section>

          <Section
            title="Password with Trailing Action"
            subtitle="Trailing action is for actions taken after inputting content such as copying or hiding/showing. Example: password"
          >
            <Input
              placeholder="Password"
              secureTextEntry={!passwordVisible}
              trailingAction={
                <InputAction
                  accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
                  onPress={() => setPasswordVisible((v) => !v)}
                >
                  <Ionicons
                    name={passwordVisible ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color={iconColor}
                  />
                </InputAction>
              }
            />
            <Input
              defaultValue="Password"
              secureTextEntry={!passwordVisible}
              trailingAction={
                <InputAction
                  accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
                  onPress={() => setPasswordVisible((v) => !v)}
                >
                  <Ionicons
                    name={passwordVisible ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color={iconColor}
                  />
                </InputAction>
              }
            />
            <Input
              defaultValue="Password"
              secureTextEntry
              errorText="Incorrect Password"
              trailingAction={
                <InputAction accessibilityLabel="Show password">
                  <Ionicons name="eye-off-outline" size={20} color={iconColor} />
                </InputAction>
              }
              helperStyle={{ color: errorColor }}
            />
          </Section>

          <Section title="With Helper Text" subtitle="Example: existing username">
            <Input
              label="Username"
              placeholder="Username"
              trailingAction={
                <InputAction accessibilityLabel="Username visibility">
                  <Ionicons name="eye-off-outline" size={20} color={iconColor} />
                </InputAction>
              }
            />
            <Input
              insetLabel
              label="Username"
              defaultValue="@allanthomas"
              errorText="Username taken"
            />
          </Section>

          <Section title="With Leading Icon and Trailing action" subtitle="Example: search">
            <Input
              placeholder="Search"
              leadingIcon={
                <Ionicons name="search-outline" size={20} color={t.colors.textTertiary} />
              }
            />
            <Input
              value={query}
              onChangeText={setQuery}
              leadingIcon={<Ionicons name="search-outline" size={20} color={iconColor} />}
              trailingAction={
                query ? (
                  <InputAction accessibilityLabel="Clear query" onPress={() => setQuery('')}>
                    <Ionicons name="close" size={22} color={iconColor} />
                  </InputAction>
                ) : undefined
              }
            />
          </Section>

          <Section title="Background style states" subtitle="Focused, filled, error, and disabled">
            <Input label="Label" placeholder="Label" helperText="Helper text" />
            <Input insetLabel label="Label" defaultValue="Content" helperText="Helper text" />
            <Input insetLabel label="Label" defaultValue="Content" errorText="Helper text" />
            <Input defaultValue="Content" helperText="Helper text" editable={false} />
          </Section>
        </ScrollView>
      </View>
    </>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const t = useTokens();
  return (
    <View style={{ gap: t.spacing[3] }}>
      <View style={{ gap: t.spacing[1] }}>
        <Text
          style={{
            color: t.colors.textPrimary,
            fontFamily: t.fontFamilies.sans,
            fontSize: t.typography.title2.fontSize,
            lineHeight: t.typography.title2.lineHeight,
            fontWeight: '600',
          }}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={{
              color: t.colors.textSecondary,
              fontFamily: t.fontFamilies.sans,
              fontSize: t.typography.bodySm.fontSize,
              lineHeight: t.typography.bodySm.lineHeight,
            }}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={{ gap: t.spacing[2] }}>{children}</View>
    </View>
  );
}
