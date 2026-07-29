import { useMemo, useSyncExternalStore, type ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useTokens } from '../../foundation/theme-provider';
import {
  ToastItem,
  toastEdgeOffset,
  type ToastColorStyle,
  type ToastPosition,
} from './toast';

export type ToastOptions = {
  /** Reuse an id to replace a live toast in place instead of stacking a duplicate. */
  id?: string;
  colorStyle?: ToastColorStyle;
  icon?: ReactNode;
  showDismiss?: boolean;
  /** Auto-dismiss in ms. 0 = persist until dismissed. Defaults to the Toaster's. */
  duration?: number;
  accessibilityLabel?: string;
};

export type ToastRecord = ToastOptions & {
  id: string;
  message: string;
  /** Set by `dismiss()` — the toast plays its exit, then leaves the queue. */
  dismissing: boolean;
};

/**
 * A module-level queue, not React context, so `toast()` is callable from
 * anywhere — event handlers, effects, or plain functions outside the tree —
 * without threading a provider through the app. Mount one `Toaster` to render
 * it. This mirrors how Sonner works on the web.
 */
let queue: ToastRecord[] = [];
const listeners = new Set<() => void>();
let sequence = 0;

function publish(next: ToastRecord[]) {
  queue = next;
  for (const listener of listeners) listener();
}

/** Queue a toast. Newest goes to the front of the deck. Returns its id. */
export function toast(message: string, options: ToastOptions = {}): string {
  const id = options.id ?? `toast-${++sequence}`;
  const record: ToastRecord = { ...options, id, message, dismissing: false };
  const existing = queue.findIndex((item) => item.id === id);
  publish(
    existing >= 0
      ? queue.map((item, index) => (index === existing ? record : item))
      : [record, ...queue],
  );
  return id;
}

/** Dismiss one toast, or every toast when called without an id. */
export function dismissToast(id?: string) {
  publish(
    queue.map((item) =>
      id === undefined || item.id === id ? { ...item, dismissing: true } : item,
    ),
  );
}

function removeToast(id: string) {
  publish(queue.filter((item) => item.id !== id));
}

/** Test seam — drops the queue without playing exit animations. */
export function resetToasts() {
  sequence = 0;
  publish([]);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => queue;

/** `const { toast, dismiss, dismissAll } = useToast()` */
export function useToast() {
  return useMemo(
    () => ({ toast, dismiss: dismissToast, dismissAll: () => dismissToast() }),
    [],
  );
}

export type ToasterProps = {
  position?: ToastPosition;
  /** Default color style; a per-toast `colorStyle` wins. */
  colorStyle?: ToastColorStyle;
  /** Default auto-dismiss in ms; a per-toast `duration` wins. */
  duration?: number;
  /** How many toasts are on screen at once. The rest wait their turn. */
  visibleToasts?: number;
  /** Safe-area top inset from the host app. */
  topInset?: number;
  /** Safe-area bottom inset from the host app. */
  bottomInset?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Renders the toast deck: newest in front, older ones peeking out behind it,
 * scaled down. Mount one near the root, inside your `ThemeProvider`.
 */
export function Toaster({
  position = 'bottom',
  colorStyle = 'contrast',
  duration = 3500,
  visibleToasts = 3,
  topInset = 0,
  bottomInset = 0,
  style,
}: ToasterProps) {
  const t = useTokens();
  const items = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  if (items.length === 0) return null;

  const safeOffset = toastEdgeOffset(position, topInset, bottomInset, t.spacing[2]);

  // Oldest first so the newest toast is the last sibling and paints on top.
  // Ordering by paint rather than `zIndex` keeps Android correct, where equal
  // `elevation` values (every toast shares one) fall back to child order.
  const painted = items.slice().reverse();

  return (
    <View pointerEvents="box-none" style={[{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }, style]}>
      {painted.map((item, index) => {
        const depth = painted.length - 1 - index;
        return (
          <View
            key={item.id}
            pointerEvents="box-none"
            style={{
              position: 'absolute',
              left: t.spacing[4],
              right: t.spacing[4],
              ...(position === 'top' ? { top: safeOffset } : { bottom: safeOffset }),
              alignItems: 'center',
            }}
          >
            <ToastItem
              message={item.message}
              position={position}
              colorStyle={item.colorStyle ?? colorStyle}
              icon={item.icon}
              showDismiss={item.showDismiss}
              duration={item.duration ?? duration}
              accessibilityLabel={item.accessibilityLabel}
              depth={depth}
              hidden={depth >= visibleToasts}
              interactive={depth === 0 && !item.dismissing}
              dismissing={item.dismissing}
              onClosed={() => removeToast(item.id)}
            />
          </View>
        );
      })}
    </View>
  );
}
