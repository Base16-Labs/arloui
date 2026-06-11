import type { ReactNode } from 'react';

const SHADE_ORDER = [
  '50',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
  '950',
] as const;
const ALPHA_STEPS = ['0', '10', '20', '30', '40', '50', '60', '70', '80', '90'] as const;

const CHECKERBOARD = {
  backgroundImage:
    'linear-gradient(45deg, #E5E7EB 25%, transparent 25%, transparent 75%, #E5E7EB 75%), linear-gradient(45deg, #E5E7EB 25%, transparent 25%, transparent 75%, #E5E7EB 75%)',
  backgroundSize: '8px 8px',
  backgroundPosition: '0 0, 4px 4px',
} as const;

export type ColorScale = Record<string, string>;

function formatScaleName(key: string) {
  return key.charAt(0).toUpperCase() + key.slice(1);
}

function orderedShades(scale: ColorScale) {
  return SHADE_ORDER.filter((shade) => shade in scale).map((shade) => ({
    shade,
    value: scale[shade]!,
  }));
}

function cornerClass(isFirst: boolean, isLast: boolean) {
  if (isFirst) return 'rounded-l-md';
  if (isLast) return 'rounded-r-md';
  return '';
}

function Swatch({
  shade,
  value,
  isFirst,
  isLast,
  checkerboard = false,
}: {
  shade: string;
  value: string;
  isFirst: boolean;
  isLast: boolean;
  checkerboard?: boolean;
}) {
  return (
    <div className="group relative min-w-0">
      <div
        className={`relative h-8 w-full overflow-hidden sm:h-10 ${cornerClass(isFirst, isLast)}`}
      >
        {checkerboard ? <div className="absolute inset-0" style={CHECKERBOARD} /> : null}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: value === 'transparent' ? undefined : value }}
        />
      </div>
      <div className="pointer-events-none absolute bottom-[calc(100%+4px)] left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 font-mono text-[10px] leading-none text-canvas opacity-0 shadow-md transition-opacity group-hover:opacity-100">
        {value}
      </div>
      <div className="mt-1 text-center font-mono text-[9px] text-ink-3 sm:text-[10px]">{shade}</div>
    </div>
  );
}

function ShadeStrip({ children, columns }: { children: ReactNode; columns: number }) {
  return (
    <div
      className="relative grid w-full overflow-visible rounded-md border border-line"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {children}
    </div>
  );
}

export function TailwindColorRow({ name, scale }: { name: string; scale: ColorScale }) {
  const shades = orderedShades(scale);

  return (
    <div className="grid gap-2 sm:grid-cols-[72px_minmax(0,1fr)] sm:gap-3">
      <div className="pt-1 text-[13px] font-medium text-ink">{name}</div>
      <ShadeStrip columns={shades.length}>
        {shades.map(({ shade, value }, index) => (
          <Swatch
            key={shade}
            shade={shade}
            value={value}
            isFirst={index === 0}
            isLast={index === shades.length - 1}
          />
        ))}
      </ShadeStrip>
    </div>
  );
}

export function TailwindBaseRow({ white, black }: { white: string; black: string }) {
  const swatches = [
    { shade: 'white', value: white },
    { shade: 'black', value: black },
  ];

  return (
    <div className="grid gap-2 sm:grid-cols-[72px_minmax(0,1fr)] sm:gap-3">
      <div className="pt-1 text-[13px] font-medium text-ink">Base</div>
      <div className="relative grid max-w-[180px] grid-cols-2 overflow-visible rounded-md border border-line">
        {swatches.map(({ shade, value }, index) => (
          <Swatch
            key={shade}
            shade={shade}
            value={value}
            isFirst={index === 0}
            isLast={index === swatches.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

export function TailwindPaletteGrid({
  scales,
  includeBase,
}: {
  scales: Record<string, ColorScale>;
  includeBase?: { white: string; black: string };
}) {
  return (
    <div className="space-y-4">
      {includeBase ? <TailwindBaseRow white={includeBase.white} black={includeBase.black} /> : null}
      {Object.entries(scales).map(([key, scale]) => (
        <TailwindColorRow key={key} name={formatScaleName(key)} scale={scale} />
      ))}
    </div>
  );
}

export function TailwindAlphaRamp({
  white,
  black,
  whiteBase,
  blackBase,
}: {
  white: Record<string, string>;
  black: Record<string, string>;
  whiteBase: string;
  blackBase: string;
}) {
  const ramps = [
    { name: 'White', base: whiteBase, steps: white },
    { name: 'Black', base: blackBase, steps: black },
  ];

  return (
    <div className="space-y-4">
      {ramps.map(({ name, base, steps }) => (
        <div key={name} className="grid gap-2 sm:grid-cols-[72px_minmax(0,1fr)] sm:gap-3">
          <div className="pt-1">
            <div className="text-[13px] font-medium text-ink">{name}</div>
            <div className="mt-0.5 font-mono text-[10px] text-ink-3">{base}</div>
          </div>
          <ShadeStrip columns={ALPHA_STEPS.length}>
            {ALPHA_STEPS.map((step, index) => (
              <Swatch
                key={step}
                shade={step}
                value={steps[step]!}
                isFirst={index === 0}
                isLast={index === ALPHA_STEPS.length - 1}
                checkerboard
              />
            ))}
          </ShadeStrip>
        </div>
      ))}
    </div>
  );
}
