"use client";

import { cn } from "@/lib/cn";
import { useTheme } from "@/lib/theme";
import snackMap from "@/lib/snack-map.json";

// Deep link that opens a Snack in Expo Go on the public Snack runtime (no
// per-user access check — anyone with Expo Go can open it).
const SNACK_RUNTIME =
  "exp://u.expo.dev/933fd9c0-1666-11e7-afca-d980795c5824?runtime-version=exposdk%3A54.0.0&channel-name=production&snack=";

type DevicePreviewProps = {
  /** Doc slug / Expo route, e.g. "button", "text-area". */
  route: string;
  caption?: string;
  className?: string;
};

/**
 * Embeds the component's live Expo Snack playground — the real apps/docs screen
 * (variant controls, bottom pill, and all). On desktop the interactive preview
 * runs inline; on a phone we deep-link into Expo Go for the native experience
 * (haptics included). Snacks run on Expo's public runtime, so there's no 403.
 */
export function DevicePreview({ route, className }: DevicePreviewProps) {
  const { resolved } = useTheme();
  const snackId = (snackMap as Record<string, string>)[route];

  if (!snackId) return null;

  const embedSrc =
    `https://snack.expo.dev/embedded/${snackId}` +
    `?preview=true&platform=web&supportedPlatforms=ios,android,web` +
    `&theme=${resolved}&name=${encodeURIComponent(`Arlo UI · ${route}`)}`;
  const expoUrl = `${SNACK_RUNTIME}${snackId}`;

  return (
    <div className={cn("mb-12", className)}>
      {/* Desktop / tablet: interactive playground inline. The embed's "My
          Device" tab also shows a QR to open it natively in Expo Go. */}
      <div className="hidden overflow-hidden rounded-2xl border border-line sm:block">
        <iframe
          key={resolved}
          src={embedSrc}
          title={`${route} playground`}
          className="h-[540px] w-full border-0"
          allow="clipboard-write; accelerometer; gyroscope"
          loading="lazy"
        />
      </div>

      {/* Phone: open the live playground natively in Expo Go. */}
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-line py-8 text-ink sm:hidden">
        <a
          href={expoUrl}
          className="flex h-11 items-center rounded-full bg-ink px-6 text-[15px] font-medium text-canvas"
        >
          Open playground in Expo Go
        </a>
        <p className="max-w-[260px] text-center font-mono text-[12px] leading-relaxed text-ink-3">
          Runs natively with haptics. Requires the free Expo Go app.
        </p>
      </div>
    </div>
  );
}
