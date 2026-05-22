import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { Input, InputAction, useTokens } from '@arloui/registry';
import { ShowcaseScreen } from '@/components/playground/showcase-screen';
import { ShowcaseSection } from '@/components/playground/showcase-section';

export default function InputShowcase() {
  const t = useTokens();
  const [query, setQuery] = useState('Query');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const iconColor = t.colors.textSecondary;
  const errorColor = t.colors.textInteractiveError;

  return (
    <ShowcaseScreen
      eyebrow="Controls"
      title="Input"
      subtitle="Labels, icons, actions, password, search, and validation states."
      stackTitle="Input"
      contentContainerStyle={{ gap: t.spacing[6] }}
    >
      <ShowcaseSection title="Default" subtitle="Name fields">
        <Input placeholder="Name" />
        <Input insetLabel label="Name" defaultValue="Allan Thomas" />
      </ShowcaseSection>

      <ShowcaseSection title="Leading icon" subtitle="Email with mail icon">
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
      </ShowcaseSection>

      <ShowcaseSection title="Leading action" subtitle="Country code + phone">
        <PhoneRow t={t} iconColor={iconColor} />
        <PhoneRow t={t} iconColor={iconColor} filled />
      </ShowcaseSection>

      <ShowcaseSection title="Password" subtitle="Show / hide and error">
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
          secureTextEntry
          errorText="Incorrect Password"
          trailingAction={
            <InputAction accessibilityLabel="Show password">
              <Ionicons name="eye-off-outline" size={20} color={iconColor} />
            </InputAction>
          }
          helperStyle={{ color: errorColor }}
        />
      </ShowcaseSection>

      <ShowcaseSection title="Helper text" subtitle="Username availability">
        <Input label="Username" placeholder="Username" />
        <Input insetLabel label="Username" defaultValue="@allanthomas" errorText="Username taken" />
      </ShowcaseSection>

      <ShowcaseSection title="Search" subtitle="Leading icon and clear action">
        <Input
          placeholder="Search"
          leadingIcon={<Ionicons name="search-outline" size={20} color={t.colors.textTertiary} />}
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
      </ShowcaseSection>

      <ShowcaseSection title="Field states" subtitle="Helper, error, and disabled">
        <Input label="Label" placeholder="Label" helperText="Helper text" />
        <Input insetLabel label="Label" defaultValue="Content" helperText="Helper text" />
        <Input insetLabel label="Label" defaultValue="Content" errorText="Helper text" />
        <Input defaultValue="Content" helperText="Helper text" editable={false} />
      </ShowcaseSection>
    </ShowcaseScreen>
  );
}

function PhoneRow({
  t,
  iconColor,
  filled,
}: {
  t: ReturnType<typeof useTokens>;
  iconColor: string;
  filled?: boolean;
}) {
  return (
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
        <Text style={{ fontFamily: t.fontFamilies.sans, color: t.colors.textPrimary }}>+447</Text>
        <Ionicons name="chevron-down" size={16} color={iconColor} />
      </InputAction>
      {filled ? (
        <Input containerStyle={{ flex: 1 }} insetLabel label="Phone" defaultValue="020-293-9393" keyboardType="phone-pad" />
      ) : (
        <Input containerStyle={{ flex: 1 }} placeholder="Phone" />
      )}
    </View>
  );
}
