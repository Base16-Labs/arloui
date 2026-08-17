/**
 * Arlo UI — Chart formatters
 *
 * Every chart takes a `format` and none of them ship one, which is how the docs
 * ended up demonstrating a `money` helper that never existed. These are that
 * helper, made real and locale-aware.
 *
 *   <Chart data={points} format={formatMoney('USD')} />
 *   <Chart.Meter value={0.62} format={formatPercent()} />
 *
 * Both are factories rather than bare functions: currency and locale are decided
 * once at the call site, and what comes back is the `(value: number) => string`
 * every chart's `format` prop already accepts.
 *
 * `Intl` is in every JS engine React Native ships on — Hermes has had full ICU
 * since RN 0.73. Passing `locale: undefined` (the default) uses the device's
 * locale, which is what you want for a number the user reads as money.
 */

export type FormatMoneyOptions = {
  /** BCP-47 tag. Defaults to the device locale. */
  locale?: string;
  /**
   * Fraction digits. Defaults to the currency's own convention (2 for USD, 0 for
   * JPY). Pass `0` for the axis-free, glanceable case where cents are noise.
   */
  fractionDigits?: number;
  /** Render 12_400 as "$12.4K". Off by default — an exact number is the honest one. */
  compact?: boolean;
};

/**
 * Currency formatter. The currency code is required because there is no sane
 * default: a chart that guesses USD is wrong everywhere else, silently.
 *
 *   const money = formatMoney('USD');            // $1,240.50
 *   const tight = formatMoney('USD', { fractionDigits: 0, compact: true });  // $1.2K
 */
export function formatMoney(
  currency: string,
  { locale, fractionDigits, compact = false }: FormatMoneyOptions = {},
): (value: number) => string {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    notation: compact ? 'compact' : 'standard',
    ...(fractionDigits != null
      ? { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits }
      : null),
  });
  return (value: number) => formatter.format(value);
}

export type FormatPercentOptions = {
  locale?: string;
  /** Decimal places. Defaults to 1 — enough to show movement, short enough to read. */
  fractionDigits?: number;
  /**
   * Whether the input is already a percentage. `Intl` expects a fraction (0.62 →
   * "62%"), but chart series are just as often stored as 62. Say which you have.
   */
  scale?: 'fraction' | 'percent';
};

/**
 *   formatPercent()                       // 0.6234 -> "62.3%"
 *   formatPercent({ scale: 'percent' })   // 62.34  -> "62.3%"
 */
export function formatPercent({
  locale,
  fractionDigits = 1,
  scale = 'fraction',
}: FormatPercentOptions = {}): (value: number) => string {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
  return (value: number) => formatter.format(scale === 'percent' ? value / 100 : value);
}

/**
 * Plain number with grouping separators, for series that aren't money or a rate.
 * Here so `format` is never left off just because the value is a count.
 */
export function formatNumber({
  locale,
  fractionDigits,
  compact = false,
}: FormatMoneyOptions = {}): (value: number) => string {
  const formatter = new Intl.NumberFormat(locale, {
    notation: compact ? 'compact' : 'standard',
    ...(fractionDigits != null
      ? { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits }
      : null),
  });
  return (value: number) => formatter.format(value);
}
