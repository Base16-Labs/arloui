/**
 * The variant matrix each component is exported across.
 *
 * One entry per Figma component set. `axes` are the variant properties the set
 * will expose, named the way they should read in Figma's variant picker; the
 * generator takes the cartesian product and renders the real component once per
 * combination.
 *
 * Only *visual* axes belong here. Props that carry content (a tab's label, a
 * sheet's children) or that only affect behaviour (`onClose`, `scrollable`) are
 * fixed in `sample` instead — they would multiply the matrix without changing
 * what a designer sees.
 */
import type { ReactElement } from 'react';
import { Text } from 'react-native';
import { Sheet } from '../../src/components/sheet';
import { Tabs } from '../../src/components/tabs';

export type Axis = {
  /** Figma variant property name, e.g. `Appearance`. */
  property: string;
  /** Code prop name, e.g. `appearance`. */
  prop: string;
  /** Figma variant value → code prop value. */
  values: Record<string, string | boolean>;
};

export type ComponentSpec = {
  /** Registry entry this belongs to. */
  component: string;
  /** Figma component-set name to create or update. */
  set: string;
  axes: Axis[];
  /** Render one combination. `props` is the resolved code props for that cell. */
  sample: (props: Record<string, unknown>) => ReactElement;
  /** Which node in the rendered tree is the component itself, if it is wrapped. */
  note?: string;
};

const noop = () => {};

export const MATRIX: ComponentSpec[] = [
  {
    component: 'sheet',
    set: 'Sheet',
    axes: [
      {
        property: 'Backdrop',
        prop: 'backdrop',
        values: { Scrim: 'scrim', Passthrough: 'passthrough' },
      },
      {
        property: 'Surface',
        prop: 'surface',
        values: { Solid: 'solid', Glass: 'glass' },
      },
      {
        property: 'Width',
        prop: 'width',
        values: { Default: 'default', Stack: 'stack' },
      },
    ],
    // An explicit height matters: the sheet otherwise measures itself via
    // `onLayout`, which never fires without a layout engine, so `translateY`
    // never settles and the scrim — whose opacity interpolates from it — would
    // export at 0, mid-transition.
    sample: (props) => (
      <Sheet visible onClose={noop} height={280} {...props}>
        <Sheet.Header title="Delivery options" />
        <Sheet.Body>
          <Text>Choose how you'd like this order to arrive.</Text>
        </Sheet.Body>
      </Sheet>
    ),
    note: 'Rendered open at a fixed height; the scrim and drag layers are part of the tree.',
  },
  {
    component: 'tabs',
    set: 'Tabs',
    axes: [
      {
        property: 'Appearance',
        prop: 'appearance',
        values: {
          Plain: 'plain',
          Underline: 'underline',
          Filled: 'filled',
          Segmented: 'segmented',
        },
      },
      { property: 'Tone', prop: 'tone', values: { Neutral: 'neutral', Accent: 'accent' } },
      { property: 'Layout', prop: 'layout', values: { Content: 'content', Equal: 'equal' } },
    ],
    sample: (props) => (
      <Tabs value="all" onValueChange={noop} {...props}>
        <Tabs.Item value="all" label="All" />
        <Tabs.Item value="unread" label="Unread" />
        <Tabs.Item value="archived" label="Archived" />
      </Tabs>
    ),
    note: 'First item selected so both selected and unselected states appear in one cell.',
  },
];
