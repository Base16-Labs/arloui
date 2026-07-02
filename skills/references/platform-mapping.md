# Arlo UI Platform Mapping

Use this file when translating between Figma, React Native, and SwiftUI. Match hierarchy and behavior first, then chase visual parity.

## Figma

- Build foundations first: color, type, spacing, radius, and effects.
- Name components predictably:
  - `Foundation/Color/...`
  - `Foundation/Type/...`
  - `Components/Button/Primary`
  - `Components/Finance/WatchlistRow`
  - `Components/AI/AssistantComposer`
  - `Patterns/Finance/Home`
- Use variants for state, emphasis, size, and theme.
- Favor auto layout and explicit spacing rules over manual nudging.
- Keep base primitives separate from domain compositions.

## React Native

- Default to `StyleSheet` and small token objects.
- Prefer composition over prop-heavy mega-components.
- Use `Pressable` for interactive states and make the pressed state obvious.
- Reach for `FlatList` or `SectionList` when a pattern is clearly list-shaped.
- Animation libraries are optional. If the codebase does not already use one, keep motion simple and native.

Token naming in `tokens.ts` should mirror the CSS custom property names from `references/tokens.md` where possible (e.g., `bg`, `surface`, `textPrimary`, `accent`) so the design system stays in sync across targets.

**Platform differences to watch:**
- Safe area: wrap root screens in `SafeAreaView` or use `useSafeAreaInsets` for fine-grained control. Bottom insets differ significantly between notched iOS and Android.
- Status bar: set `StatusBar` style explicitly per screen. Android requires `translucent` prop for edge-to-edge.
- Back gesture: Android has a hardware/gesture back action; iOS uses swipe-from-left. Do not rely on custom back buttons alone — always handle `BackHandler` for Android modals.
- Haptics: iOS haptic APIs are richer than Android's. Keep haptic calls guarded behind a platform check or abstracted in a shared utility.

Suggested structure:

- `tokens.ts`: colors, spacing, radius, and type sizes
- `components/...`: reusable blocks
- `screens/...`: assembled recipes

## SwiftUI

- Keep tokens close to the code using them, typically via lightweight extensions or a small theme namespace.
- Build small views with clear responsibilities instead of giant generic wrappers.
- Use `safeAreaInset` or a bottom overlay pattern for anchored actions and composers.
- Prefer native transitions and restrained springs.
- Use previews when they meaningfully speed up iteration or state review.

**Platform differences to watch:**
- Safe area: use `.safeAreaInset(edge: .bottom)` for anchored bars; avoid hardcoded bottom padding.
- Dynamic Island / notch: do not place interactive elements in the top safe area without testing on devices with and without a notch.
- Navigation: `NavigationStack` is preferred over `NavigationView` on iOS 16+. Avoid mixing the two.
- Sheet behavior: iOS 16+ supports `.presentationDetents` for half-height sheets — prefer this over custom overlay implementations.

Suggested structure:

- `Theme/ArloColor.swift`
- `Theme/ArloType.swift`
- `Components/...`
- `Screens/...`

## Cross-Platform Translation Rules

- Preserve layout rhythm and information order before matching every pixel.
- Keep the same component anatomy even if spacing shifts slightly between platforms.
- Respect platform-native behaviors for lists, sheets, keyboard avoidance, and haptics.
- If a flourish is hard to maintain across platforms, simplify it until it is durable.
- Code outputs should be easy to paste into an existing app without dragging in a new dependency tree.
- **Safe area is non-negotiable on every platform.** Never hardcode bottom padding — always inset from the device's actual safe area. Treat this as a baseline check on every screen output.
