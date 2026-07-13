import type { SVGProps } from "react";

/** Faster than Tailwind default `animate-spin` (1s); use with `DocCircleNotch` in docs. */
export const docLoadingSpinCls = "animate-[spin_0.5s_linear_infinite]";

/** Paths match `packages/icons` OutlineLockSimple + OutlineArrowRight (24×24 viewBox). */
export function DocIconLock(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M19.5 8.625h-3v-2.25c0-1.2-.47-2.34-1.32-3.19A4.5 4.5 0 0 0 12 1.875c-1.19 0-2.34.47-3.18 1.31-.85.85-1.32 1.99-1.32 3.19v2.25h-3c-.4 0-.78.15-1.06.44-.28.28-.44.66-.44 1.06v10.5a1.499 1.499 0 0 0 1.5 1.5h15a1.5 1.5 0 0 0 1.5-1.5v-10.5c0-.4-.16-.78-.44-1.06-.28-.29-.66-.44-1.06-.44M9 6.375c0-.8.32-1.56.88-2.13.56-.56 1.32-.87 2.12-.87s1.56.31 2.12.87c.56.57.88 1.33.88 2.13v2.25H9zm10.5 14.25h-15v-10.5h15z"
      />
    </svg>
  );
}

export function DocIconArrowRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="m20.78 12.531-6.75 6.75a.75.75 0 0 1-1.061-1.062l5.47-5.469H3.75a.75.75 0 0 1 0-1.5h14.689l-5.47-5.469a.75.75 0 0 1 1.061-1.062l6.75 6.75A.76.76 0 0 1 21 12a.75.75 0 0 1-.22.531"
      />
    </svg>
  );
}

/** Compact Google “G” for sign-in row (brand colors). */
export function DocGoogleMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 18" aria-hidden {...props}>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.712s.102-1.172.282-1.712V4.956H.957C.348 6.175 0 7.55 0 9s.348 2.825.957 4.044l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.956L3.964 7.288C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}

/** Facebook “f” mark (white on brand blue). */
export function DocFacebookMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      />
    </svg>
  );
}

/** X / Twitter mark (white on black). */
export function DocXMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    </svg>
  );
}

/**
 * Apple mark from Figma **Social** (`apple-icon`, mask region 1355×49 × 14×17).
 * Use `className="text-white"` on black fills.
 */
export function DocAppleMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="1355 49 15 17" fill="none" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M1366.38 57.5015C1366.36 55.4773 1368.04 54.5047 1368.11 54.4569C1367.17 53.0798 1365.71 52.8923 1365.18 52.8702C1363.94 52.7433 1362.75 53.6038 1362.12 53.6038C1361.49 53.6038 1360.51 52.8886 1359.48 52.9088C1358.12 52.929 1356.87 53.6975 1356.17 54.9147C1354.76 57.3599 1355.81 60.9874 1357.18 62.9749C1357.86 63.9456 1358.66 65.0395 1359.71 64.9991C1360.73 64.9587 1361.11 64.3427 1362.33 64.3427C1363.56 64.3427 1363.9 64.9991 1364.97 64.9789C1366.06 64.9568 1366.75 63.9861 1367.42 63.0116C1368.19 61.8846 1368.51 60.7925 1368.53 60.7355C1368.5 60.7263 1366.4 59.921 1366.38 57.5015Z"
      />
      <path
        fill="currentColor"
        d="M1364.37 51.5556C1364.93 50.879 1365.3 49.9377 1365.2 49C1364.39 49.0331 1363.42 49.5369 1362.84 50.2134C1362.33 50.811 1361.87 51.7689 1362 52.6881C1362.89 52.758 1363.81 52.2303 1364.37 51.5556Z"
      />
    </svg>
  );
}

/** `CircleNotch` path from Figma **Buttons/Button** loading (md · primary). */
export function DocCircleNotch(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="190.5 255.5 13 13" fill="none" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M203.5 262C203.5 263.724 202.815 265.377 201.596 266.596C200.377 267.815 198.724 268.5 197 268.5C195.276 268.5 193.623 267.815 192.404 266.596C191.185 265.377 190.5 263.724 190.5 262C190.5 259.438 191.988 257.103 194.291 256.046C194.351 256.018 194.415 256.003 194.481 256C194.547 255.998 194.612 256.008 194.674 256.031C194.735 256.054 194.792 256.089 194.84 256.133C194.888 256.178 194.927 256.232 194.954 256.291C194.982 256.351 194.997 256.415 195 256.481C195.002 256.547 194.992 256.612 194.969 256.674C194.946 256.735 194.911 256.792 194.867 256.84C194.822 256.888 194.768 256.927 194.709 256.954C192.759 257.849 191.5 259.829 191.5 262C191.5 263.459 192.079 264.858 193.111 265.889C194.142 266.921 195.541 267.5 197 267.5C198.459 267.5 199.858 266.921 200.889 265.889C201.921 264.858 202.5 263.459 202.5 262C202.5 259.829 201.241 257.849 199.291 256.954C199.171 256.899 199.077 256.798 199.031 256.674C198.985 256.549 198.99 256.412 199.046 256.291C199.101 256.171 199.202 256.077 199.326 256.031C199.451 255.985 199.588 255.99 199.709 256.046C202.012 257.103 203.5 259.438 203.5 262Z"
      />
    </svg>
  );
}

/** FAB glyph from Figma **Buttons/FAB** (48×48 artboard around center 72,68). */
export function DocFabIcon(
  props: SVGProps<SVGSVGElement> & {
    variant?: "primary" | "neutral" | "outline" | "danger";
  },
) {
  const { variant = "primary", ...rest } = props;
  const circleFill =
    variant === "primary"
      ? "#155DFC"
      : variant === "danger"
        ? "#FB2C36"
        : variant === "neutral"
          ? "#F3F4F6"
          : "none";
  const circleStroke = variant === "outline" ? "#155DFC" : "none";
  const plusFill =
    variant === "primary" || variant === "danger"
      ? "#FFFFFF"
      : variant === "outline"
        ? "#155DFC"
        : "#364153";

  return (
    <svg viewBox="48 44 48 48" fill="none" aria-hidden {...rest}>
      <path
        d="M48 68C48 54.7452 58.7452 44 72 44C85.2548 44 96 54.7452 96 68C96 81.2548 85.2548 92 72 92C58.7452 92 48 81.2548 48 68Z"
        fill={circleFill}
        stroke={circleStroke}
        strokeWidth={variant === "outline" ? 1 : 0}
      />
      <path
        fill={plusFill}
        d="M81 68C81 68.1989 80.921 68.3897 80.7803 68.5303C80.6397 68.671 80.4489 68.75 80.25 68.75H72.75V76.25C72.75 76.4489 72.671 76.6397 72.5303 76.7803C72.3897 76.921 72.1989 77 72 77C71.8011 77 71.6103 76.921 71.4697 76.7803C71.329 76.6397 71.25 76.4489 71.25 76.25V68.75H63.75C63.5511 68.75 63.3603 68.671 63.2197 68.5303C63.079 68.3897 63 68.1989 63 68C63 67.8011 63.079 67.6103 63.2197 67.4697C63.3603 67.329 63.5511 67.25 63.75 67.25H71.25V59.75C71.25 59.5511 71.329 59.3603 71.4697 59.2197C71.6103 59.079 71.8011 59 72 59C72.1989 59 72.3897 59.079 72.5303 59.2197C72.671 59.3603 72.75 59.5511 72.75 59.75V67.25H80.25C80.4489 67.25 80.6397 67.329 80.7803 67.4697C80.921 67.6103 81 67.8011 81 68Z"
      />
    </svg>
  );
}

export function pillRowClass(h: "sm" | "md" = "md") {
  return h === "sm"
    ? "inline-flex h-8 max-w-full min-w-0 items-center justify-center gap-1.5 rounded-full px-3 text-[12px] font-semibold leading-none"
    : "inline-flex h-9 max-w-full min-w-0 items-center justify-center gap-1.5 rounded-full px-4 text-[13px] font-semibold leading-none";
}
