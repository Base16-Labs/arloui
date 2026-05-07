import { Redirect } from 'expo-router';

/** Nested `/components/button` is flaky on Expo Router web — canonical showcase is `/button`. */
export default function LegacyButtonRouteRedirect() {
  return <Redirect href="/button" />;
}
