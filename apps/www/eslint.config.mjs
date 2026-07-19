import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // OpenNext / Cloudflare build output — generated, never hand-authored.
    ".open-next/**",
  ]),
  // This app was previously unlinted (`next lint` broke under Next 16). These newly
  // introduced strict rules surface pre-existing patterns; keep them visible as
  // warnings for now and ratchet back to "error" after a dedicated cleanup pass.
  {
    // Scope these overrides to the same file globs next registers its plugins
    // under, so the plugin-qualified rules below resolve.
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
]);

export default eslintConfig;
