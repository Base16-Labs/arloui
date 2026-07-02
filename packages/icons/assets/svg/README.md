Drop **production SVG exports** from Figma here — one icon per file, **kebab-case** names.

- **chevron-right.svg** → generates **ChevronRight** in `src/generated/`
- Prefer a consistent **viewBox** (e.g. `0 0 24 24`) and **rounded** stroke caps where the design system uses them.
- **Outline / stroke-based** icons map cleanly to `react-native-svg`. Flat fills work too, but keep stroke weight consistent across the set.

Then from the repo root:

```bash
npm run icons:build
```

Icons are **not** hand-edited under `src/generated/` — that folder is build output.
