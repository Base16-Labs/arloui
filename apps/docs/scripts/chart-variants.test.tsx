import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react-native';
import Line from '../app/chart/index';
import Bar from '../app/chart/bar';
import Donut from '../app/chart/donut';
import Meter from '../app/chart/meter';
import Sparkline from '../app/chart/sparkline';
import Heatmap from '../app/chart/heatmap';

jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
  useRouter: () => ({ replace: jest.fn() }),
}));
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: require('react-native').View,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0 }),
}));
jest.mock('@/components/playground/chart-canvas', () => ({
  ChartCanvas: require('react-native').View,
}));
jest.mock('@/components/playground/variant-sheet', () => ({
  VariantSheet: require('react-native').View,
}));
jest.mock('@/components/playground/canvas-pill', () => ({ CanvasPill: () => null }));
jest.mock('@/components/playground/live-badge', () => ({ LiveBadge: () => null }));
jest.mock('@/components/playground/theme-toggle', () => ({ ThemeToggle: () => null }));
jest.mock('@/components/playground/variant-controls', () => {
  const React = require('react');
  const { View, Pressable, Text } = require('react-native');
  return {
    VariantControlRow: ({ label, children }) => <View testID={`row:${label}`}>{children}</View>,
    VariantChip: ({ label, active, disabled, onPress }) => (
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: active, disabled }}
        disabled={disabled}
        onPress={onPress}
      >
        <Text>{label}</Text>
      </Pressable>
    ),
  };
});
jest.mock('@arloui/registry', () => {
  const React = require('react');
  const { View } = require('react-native');
  const part =
    (name) =>
    ({ children, ...props }) => (
      <View testID={name} {...props}>
        {children}
      </View>
    );
  const Chart = part('Line');
  for (const name of [
    'Empty',
    'Value',
    'Delta',
    'Plot',
    'Crosshair',
    'Baseline',
    'Reference',
    'Legend',
    'Periods',
  ])
    Chart[name] = part(name);
  for (const name of ['Bar', 'Donut', 'Meter', 'Sparkline', 'Heatmap']) {
    Chart[name] = part(name);
    for (const child of [
      'Value',
      'Label',
      'Legend',
      'Series',
      'Values',
      'Categories',
      'Baseline',
      'Reference',
      'Ring',
      'Fill',
      'EndDot',
      'Extremes',
    ]) {
      Chart[name][child] = part(`${name}.${child}`);
    }
  }
  return {
    Chart,
    seriesColorAt: (_, index) => `color-${index}`,
    useTokens: () => ({
      name: 'light',
      colors: {},
      fontFamilies: { sans: 'Manrope' },
      typography: { bodySm: { fontSize: 12 }, headingLarge: { fontSize: 20 } },
    }),
  };
});

const choose = (row: string, value: string) =>
  fireEvent.press(within(screen.getByTestId(`row:${row}`)).getByText(value));
const prop = (part: string, name: string) => screen.getByTestId(part).props[name];
const absent = (row: string) => expect(screen.queryByTestId(`row:${row}`)).toBeNull();

it.each([
  {
    Component: Line,
    part: 'Line',
    row: 'Tone',
    name: 'tone',
    options: ['auto', 'positive', 'negative', 'brand', 'neutral'],
  },
  {
    Component: Line,
    part: 'Line',
    row: 'Density',
    name: 'density',
    options: ['default', 'compact'],
  },
  { Component: Line, part: 'Plot', row: 'Curve', name: 'curve', options: ['steep', 'smooth'] },
  {
    Component: Bar,
    part: 'Bar',
    row: 'Tone',
    name: 'tone',
    options: ['brand', 'series', 'auto', 'positive', 'negative', 'neutral'],
  },
  {
    Component: Bar,
    part: 'Bar',
    row: 'Spacing',
    name: 'spacing',
    options: ['tight', 'default', 'loose'],
  },
  {
    Component: Bar,
    part: 'Bar',
    row: 'Layout',
    name: 'layout',
    options: ['vertical', 'horizontal'],
  },
  { Component: Bar, part: 'Bar', row: 'Density', name: 'density', options: ['default', 'compact'] },
  { Component: Meter, part: 'Meter', row: 'Shape', name: 'shape', options: ['bar', 'ring', 'arc'] },
  {
    Component: Meter,
    part: 'Meter',
    row: 'Tone',
    name: 'tone',
    options: ['brand', 'positive', 'negative', 'neutral'],
  },
  {
    Component: Meter,
    part: 'Meter',
    row: 'Density',
    name: 'density',
    options: ['default', 'compact'],
  },
  {
    Component: Sparkline,
    part: 'Sparkline',
    row: 'Tone',
    name: 'tone',
    options: ['auto', 'positive', 'negative', 'brand', 'neutral'],
  },
  {
    Component: Sparkline,
    part: 'Sparkline',
    row: 'Curve',
    name: 'curve',
    options: ['steep', 'smooth'],
  },
])('$part $row options reach the component', ({ Component, part, row, name, options }) => {
  render(<Component />);
  for (const option of options) {
    choose(row, option);
    expect(prop(part, name)).toBe(option);
    expect(
      within(screen.getByTestId(`row:${row}`)).getByRole('button', { name: option }).props
        .accessibilityState.selected,
    ).toBe(true);
  }
});

it('line sample shapes actually change the series', () => {
  render(<Line />);
  for (const shape of ['rising', 'falling', 'flat', 'volatile']) {
    choose('Shape', shape);
    const values = prop('Line', 'data');
    if (shape === 'rising') expect(values.at(-1)).toBeGreaterThan(values[0]);
    if (shape === 'falling') expect(values.at(-1)).toBeLessThan(values[0]);
    if (shape === 'flat') expect(new Set(values).size).toBe(1);
    if (shape === 'volatile')
      expect(Math.max(...values) - Math.min(...values)).toBeGreaterThan(200);
  }
});

it('sparkline direction changes the data rather than just the label', () => {
  render(<Sparkline />);
  choose('Direction', 'rising');
  const rising = prop('Sparkline', 'data');
  expect(rising.at(-1)).toBeGreaterThan(rising[0]);
  choose('Direction', 'falling');
  const falling = prop('Sparkline', 'data');
  expect(falling.at(-1)).toBeLessThan(falling[0]);
});

it.each([
  ['Line', Line],
  ['Bar', Bar],
  ['Donut', Donut],
  ['Meter', Meter],
  ['Sparkline', Sparkline],
  ['Heatmap', Heatmap],
] as const)(
  '%s exposes only state and functioning motion controls while loading',
  (_, Component) => {
    render(<Component />);
    expect(prop(_, 'animated')).toBe(true);
    choose('State', 'loading');
    expect(prop(_, 'loading')).toBe(true);
    expect(screen.getAllByTestId(/^row:/).map((node) => node.props.testID)).toEqual([
      'row:State',
      'row:Motion',
    ]);
    choose('Motion', 'off');
    expect(prop(_, 'animated')).toBe(false);
    choose('State', 'default');
    expect(prop(_, 'loading')).toBe(false);
  },
);

it.each([Line, Bar, Donut, Sparkline, Heatmap])(
  'empty state removes all data-only controls',
  (Component) => {
    render(<Component />);
    choose('State', 'empty');
    expect(screen.getAllByTestId(/^row:/).map((node) => node.props.testID)).toEqual(['row:State']);
    choose('State', 'default');
    expect(screen.getAllByTestId(/^row:/).length).toBeGreaterThan(1);
  },
);

it.each([
  ['Line', Line],
  ['Bar', Bar],
  ['Donut', Donut],
  ['Meter', Meter],
  ['Sparkline', Sparkline],
  ['Heatmap', Heatmap],
] as const)('%s exposes only visually distinct states', (part, Component) => {
  render(<Component />);
  const row = within(screen.getByTestId('row:State'));
  const names = part === 'Meter' ? ['default', 'loading'] : ['default', 'loading', 'empty'];
  expect(row.getAllByRole('button')).toHaveLength(names.length);
  for (const name of names) expect(row.getByRole('button', { name })).toBeTruthy();
  expect(row.queryByRole('button', { name: 'refreshing' })).toBeNull();
});

it('line tooltip, guides, and series work independently', () => {
  render(<Line />);
  choose('Tooltip', 'on');
  choose('Series', 'comparison');
  choose('Guides', 'min / max');
  expect(prop('Plot', 'tooltip')).toBe(true);
  expect(prop('Plot', 'compare')).toBeDefined();
  expect(screen.getAllByTestId('Reference')).toHaveLength(2);
  choose('Series', 'stacked');
  expect(prop('Plot', 'stack')).toHaveLength(2);
  const colors = prop('Plot', 'stackColors');
  expect(colors).toHaveLength(3);
  expect(colors[1]).toBe('#14B8A6');
  expect(colors[2]).toBe('#FACC15');
  expect(prop('Legend', 'items').map((item) => item.color)).toEqual(colors);
  expect(prop('Plot', 'fill')).toBe(true);
  absent('Tone');
  absent('Fill');
  absent('Extras');
  choose('Shape', 'flat');
  absent('Curve');
  choose('Series', 'single');
  choose('Fill', 'line');
  expect(prop('Plot', 'fill')).toBe(false);
  choose('Guides', 'none');
  expect(screen.queryByTestId('Reference')).toBeNull();
});

it('bar keeps signed data and stacking compatible and hides overridden controls', () => {
  render(<Bar />);
  choose('Series', 'stacked');
  absent('Tone');
  expect(prop('Bar', 'variant')).toBe('stacked');
  choose('Data', 'with negatives');
  expect(prop('Bar', 'variant')).toBe('grouped');
  expect(screen.getAllByTestId('Bar.Series')[0].props.data.some((d) => d.value < 0)).toBe(true);
  choose('Series', 'stacked');
  expect(screen.getAllByTestId('Bar.Series')[0].props.data.every((d) => d.value >= 0)).toBe(true);
  choose('Density', 'compact');
  absent('Labels');
  choose('Layout', 'horizontal');
  choose('Labels', 'hide');
  expect(screen.queryByTestId('Bar.Categories')).toBeNull();
  choose('Values', 'always');
  expect(screen.getByTestId('Bar.Values')).toBeTruthy();
  choose('Values', 'on tap');
  expect(screen.queryByTestId('Bar.Values')).toBeNull();
});

it('donut exposes category count and thickness without an overridden density control', () => {
  render(<Donut />);
  absent('Density');
  for (const n of [1, 3, 4, 5]) {
    choose('Data', `${n} ${n === 1 ? 'category' : 'categories'}`);
    expect(prop('Donut', 'data')).toHaveLength(n);
  }
  for (const [name, value] of [
    ['thin', 16],
    ['default', 26],
    ['thick', 38],
  ] as const) {
    choose('Stroke', name);
    expect(prop('Donut', 'thickness')).toBe(value);
  }
  choose('Center', 'hidden');
  expect(screen.queryByTestId('Donut.Value')).toBeNull();
  choose('Legend', 'hide');
  expect(screen.queryByTestId('Donut.Legend')).toBeNull();
});

it('meter shows rings only for round shapes and tone only when thresholds do not override it', () => {
  render(<Meter />);
  absent('Rings');
  choose('Shape', 'ring');
  choose('Rings', 'concentric');
  expect(screen.getAllByTestId('Meter.Ring')).toHaveLength(2);
  choose('Shape', 'bar');
  absent('Rings');
  expect(screen.queryByTestId('Meter.Ring')).toBeNull();
  choose('Level', '90%');
  absent('Tone');
  expect(prop('Meter', 'value')).toBe(90);
  expect(prop('Meter', 'warnAt')).toBe(0.75);
  choose('Colour', 'tone');
  choose('Tone', 'neutral');
  expect(prop('Meter', 'warnAt')).toBeUndefined();
  expect(prop('Meter', 'tone')).toBe('neutral');
});

it('sparkline size presets control height and density and only expanded supports min/max', () => {
  render(<Sparkline />);
  absent('Density');
  absent('Min/max');
  expect(prop('Sparkline', 'height')).toBe(28);
  expect(prop('Sparkline', 'density')).toBe('compact');
  choose('Size', 'expanded');
  choose('Min/max', 'on');
  expect(prop('Sparkline', 'height')).toBe(88);
  expect(prop('Sparkline', 'density')).toBe('default');
  expect(screen.getByTestId('Sparkline.Extremes')).toBeTruthy();
  choose('Fill', 'on');
  choose('End dot', 'on');
  expect(screen.getByTestId('Sparkline.Fill')).toBeTruthy();
  expect(screen.getByTestId('Sparkline.EndDot')).toBeTruthy();
  choose('Size', 'compact');
  expect(screen.queryByTestId('Sparkline.Extremes')).toBeNull();
});

it('heatmap levels change the actual quantization prop', () => {
  render(<Heatmap />);
  for (const level of [2, 3, 4]) {
    choose('Levels', String(level));
    expect(prop('Heatmap', 'levels')).toBe(level);
  }
});
