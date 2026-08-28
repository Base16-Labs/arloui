import { jest } from '@jest/globals';
import { Text } from 'react-native';
import { Card } from '../card';
import { fireEvent, renderWithTheme, screen } from '../../../../test/render';

describe('Card', () => {
  it('renders its children', () => {
    renderWithTheme(
      <Card>
        <Text>Inside</Text>
      </Card>,
    );
    expect(screen.getByText('Inside')).toBeTruthy();
  });

  it('renders the compound header/title/subtitle/body/footer', () => {
    renderWithTheme(
      <Card>
        <Card.Header>
          <Card.Title>Title</Card.Title>
          <Card.Subtitle>Subtitle</Card.Subtitle>
        </Card.Header>
        <Card.Body>
          <Text>Body</Text>
        </Card.Body>
        <Card.Footer>
          <Text>Footer</Text>
        </Card.Footer>
      </Card>,
    );
    expect(screen.getByText('Title')).toBeTruthy();
    expect(screen.getByText('Subtitle')).toBeTruthy();
    expect(screen.getByText('Body')).toBeTruthy();
    expect(screen.getByText('Footer')).toBeTruthy();
  });

  it('renders each surface without crashing', () => {
    for (const surface of ['default', 'elevated', 'bleed', 'inverse'] as const) {
      const { unmount } = renderWithTheme(
        <Card surface={surface}>
          <Text>{surface}</Text>
        </Card>,
      );
      expect(screen.getByText(surface)).toBeTruthy();
      unmount();
    }
  });

  it('renders each elevation without crashing', () => {
    for (const elevation of ['none', 'sm', 'md', 'lg'] as const) {
      const { unmount } = renderWithTheme(
        <Card elevation={elevation}>
          <Text>{elevation}</Text>
        </Card>,
      );
      expect(screen.getByText(elevation)).toBeTruthy();
      unmount();
    }
  });

  it('applies the border width as a literal px on the content layer', () => {
    // The border sits on the inner (clipped) layer, not the outer shadow layer.
    const borderOf = (node: { props: { style: unknown } }) =>
      (Object.assign({}, ...[node.props.style].flat(Infinity).filter(Boolean)) as {
        borderWidth?: number;
      }).borderWidth;

    const view = renderWithTheme(
      <Card border={4}>
        <Text>b</Text>
      </Card>,
    );
    // The Text's nearest card ancestor with a border is the inner content layer.
    expect(view.getByText('b')).toBeTruthy();
    const json = view.toJSON() as { children?: unknown[] };
    const inner = (json.children as { props: { style: unknown } }[])[0];
    expect(borderOf(inner)).toBe(4);
  });

  it('flips the title ink on an inverse surface', () => {
    const colorOf = (node: { props: { style: unknown } }) =>
      (Object.assign({}, ...[node.props.style].flat(Infinity).filter(Boolean)) as { color: string })
        .color;

    const def = renderWithTheme(
      <Card surface="default">
        <Card.Title>T</Card.Title>
      </Card>,
    );
    const defaultColor = colorOf(def.getByText('T'));
    def.unmount();

    const inv = renderWithTheme(
      <Card surface="inverse">
        <Card.Title>T</Card.Title>
      </Card>,
    );
    // The inverse surface must not paint the title in the default (primary) ink.
    expect(colorOf(inv.getByText('T'))).not.toBe(defaultColor);
  });

  it('renders as a button with press feedback when onPress is given', () => {
    const onPress = jest.fn();
    renderWithTheme(
      <Card onPress={onPress} accessibilityLabel="Open order">
        <Text>Order</Text>
      </Card>,
    );

    fireEvent.press(screen.getByRole('button', { name: 'Open order' }));
    expect(onPress).toHaveBeenCalled();
  });

  it('does not fire onPress while disabled', () => {
    const onPress = jest.fn();
    renderWithTheme(
      <Card onPress={onPress} disabled accessibilityLabel="Open order">
        <Text>Order</Text>
      </Card>,
    );

    fireEvent.press(screen.getByRole('button', { name: 'Open order' }));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('renders media edge-to-edge with padding="none"', () => {
    renderWithTheme(
      <Card padding="none">
        <Card.Media height={120}>
          <Text>Cover</Text>
        </Card.Media>
        <Card.Body>
          <Text>Caption</Text>
        </Card.Body>
      </Card>,
    );
    expect(screen.getByText('Cover')).toBeTruthy();
    expect(screen.getByText('Caption')).toBeTruthy();
  });
});

/**
 * Geometry reads off the token scales rather than raw numbers, so these assert the
 * mapping — a card that invents its own 14px radius is the thing to catch.
 */
describe('Card — geometry variants', () => {
  /** The outer (shadow/radius) layer is the render root. */
  const rootStyle = (json: unknown) => {
    const node = json as { props?: { style?: unknown } };
    return Object.assign({}, ...[node.props?.style].flat(Infinity).filter(Boolean)) as Record<
      string,
      number
    >;
  };
  /** Padding and border live on the inner (clipped content) layer. */
  const innerStyle = (json: unknown) => {
    const inner = (json as { children: unknown[] }).children[0];
    return rootStyle(inner);
  };

  it('maps the padding scale onto spacing tokens, with no two steps alike', () => {
    const values: number[] = [];
    for (const padding of ['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const) {
      const view = renderWithTheme(
        <Card padding={padding}>
          <Text>body</Text>
        </Card>,
      );
      values.push(innerStyle(view.toJSON()).padding);
      view.unmount();
    }
    expect(values[0]).toBe(0);
    expect(values).toEqual([...values].sort((a, b) => a - b));
    expect(new Set(values).size).toBe(values.length);
  });

  it('maps the radius scale onto radii tokens', () => {
    const none = renderWithTheme(
      <Card radius="none">
        <Text>body</Text>
      </Card>,
    );
    expect(rootStyle(none.toJSON()).borderRadius).toBe(0);
    none.unmount();

    const full = renderWithTheme(
      <Card radius="full">
        <Text>body</Text>
      </Card>,
    );
    expect(rootStyle(full.toJSON()).borderRadius).toBe(9999);
  });

  it('defaults to the standard card radius', () => {
    const view = renderWithTheme(
      <Card>
        <Text>body</Text>
      </Card>,
    );
    expect(rootStyle(view.toJSON()).borderRadius).toBe(16);
  });

  it('keeps geometry working on a pressable card', () => {
    const view = renderWithTheme(
      <Card onPress={() => {}} radius="sm" accessibilityLabel="card">
        <Text>body</Text>
      </Card>,
    );
    expect(rootStyle(view.toJSON()).borderRadius).toBe(4);
  });
});
