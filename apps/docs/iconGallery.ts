/** Matches SVG basenames: `outline-*` vs `solid-*` (filled). */
export type IconStyleTab = 'outline' | 'solid';

const PREFIX: Record<IconStyleTab, string> = {
  outline: 'outline-',
  solid: 'solid-',
};

/** Display label without `outline-` / `solid-` (files and components still use the full id). */
export function stripWeightPrefix(id: string): string {
  return id.replace(/^(outline|solid)-/, '');
}

export function filterIconsByTab(names: readonly string[], tab: IconStyleTab, query: string): string[] {
  const p = PREFIX[tab];
  const subset = names.filter((n) => n.startsWith(p));
  const q = query.trim().toLowerCase();
  if (!q) return subset;
  return subset.filter((n) => {
    const full = n.toLowerCase();
    const short = stripWeightPrefix(n).toLowerCase();
    return full.includes(q) || short.includes(q);
  });
}

/** Single value from `useLocalSearchParams` (string or first array entry). */
export function searchParamOne(param: string | string[] | undefined): string | undefined {
  if (param == null) return undefined;
  const v = Array.isArray(param) ? param[0] : param;
  return v === '' ? undefined : v;
}

/** `?weight=` query for `/icons` routes. */
export function iconsWeightQuery(tab: IconStyleTab): string {
  return tab === 'solid' ? 'solid' : 'outline';
}

/** Full icon basename for the detail sheet, or null if missing / wrong tab / unknown id. */
export function resolveDetailIconId(
  raw: string | undefined,
  allNames: readonly string[],
  tab: IconStyleTab,
): string | null {
  if (!raw || !allNames.includes(raw)) return null;
  return raw.startsWith(PREFIX[tab]) ? raw : null;
}
