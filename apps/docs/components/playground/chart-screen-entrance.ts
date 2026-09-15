import type { NativeStackNavigationProp } from 'expo-router';

type Navigation = Pick<NativeStackNavigationProp<Record<string, undefined>>, 'addListener' | 'isFocused'>;
type Frames = { request: (callback: () => void) => number; cancel: (id: number) => void };

/** Native screens mount before they appear. Only start the chart after arrival. */
export function subscribeChartScreenEntrance(
  navigation: Navigation,
  native: boolean,
  setReady: (ready: boolean) => void,
  frames: Frames,
) {
  let active = true;
  let frame: number | undefined;
  const cancel = () => {
    if (frame !== undefined) frames.cancel(frame);
    frame = undefined;
  };
  const hide = () => {
    cancel();
    setReady(false);
  };
  const reveal = () => {
    cancel();
    // Let layout and the first visible frame commit before mounting the preview.
    frame = frames.request(() => {
      frame = frames.request(() => {
        if (active && navigation.isFocused()) setReady(true);
      });
    });
  };
  const focus = () => {
    hide();
    // Web has no native transitionEnd event, including direct URL visits.
    if (!native) reveal();
  };
  const unsubscribe = [
    navigation.addListener('focus', focus),
    navigation.addListener('blur', hide),
    navigation.addListener('transitionStart', hide),
    navigation.addListener('transitionEnd', () => {
      if (navigation.isFocused()) reveal();
    }),
  ];
  focus();
  return () => {
    active = false;
    cancel();
    unsubscribe.forEach((remove) => remove());
  };
}
