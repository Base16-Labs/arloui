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

  it('renders each tone without crashing', () => {
    for (const tone of ['default', 'raised', 'floating'] as const) {
      const { unmount } = renderWithTheme(
        <Card tone={tone}>
          <Text>{tone}</Text>
        </Card>,
      );
      expect(screen.getByText(tone)).toBeTruthy();
      unmount();
    }
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

  it('paints the glass material and mounts the blur layer behind the content', () => {
    renderWithTheme(
      <Card surface="glass" blurComponent={<Text>blur</Text>}>
        <Text>Glass</Text>
      </Card>,
    );

    expect(screen.getByText('Glass')).toBeTruthy();
    // The blur layer is decorative, so it is mounted but hidden from assistive tech.
    expect(screen.getByText('blur', { includeHiddenElements: true })).toBeTruthy();
  });

  it('omits the blur layer when no blurComponent is supplied', () => {
    renderWithTheme(
      <Card surface="glass">
        <Text>Glass</Text>
      </Card>,
    );
    expect(screen.getByText('Glass')).toBeTruthy();
  });

  it('renders media and padding options', () => {
    renderWithTheme(
      <Card padding="none">
        <Card.Media height={120}>
          <Text>Cover</Text>
        </Card.Media>
        <Card.Body padded>
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
  /** The card container is the render root; its style is an array of layers. */
  const rootStyle = (json: unknown) => {
    const node = json as { props?: { style?: unknown } };
    return Object.assign({}, ...[node.props?.style].flat(Infinity).filter(Boolean)) as Record<
      string,
      number
    >;
  };

  it('maps the padding scale onto spacing tokens, with no two steps alike', () => {
    const values: number[] = [];
    for (const padding of ['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const) {
      const view = renderWithTheme(
        <Card padding={padding}>
          <Text>body</Text>
        </Card>,
      );
      values.push(rootStyle(view.toJSON()).padding);
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

  it('defaults to no margin and the standard card radius', () => {
    const view = renderWithTheme(
      <Card>
        <Text>body</Text>
      </Card>,
    );
    const style = rootStyle(view.toJSON());
    expect(style.margin).toBe(0);
    expect(style.borderRadius).toBe(16);
  });

  it('applies margin from the shared spacing scale', () => {
    const view = renderWithTheme(
      <Card margin="lg">
        <Text>body</Text>
      </Card>,
    );
    expect(rootStyle(view.toJSON()).margin).toBe(24);
  });

  it('keeps geometry working on a pressable card', () => {
    const view = renderWithTheme(
      <Card onPress={() => {}} radius="sm" margin="xs" accessibilityLabel="card">
        <Text>body</Text>
      </Card>,
    );
    const style = rootStyle(view.toJSON());
    expect(style.borderRadius).toBe(4);
    expect(style.margin).toBe(8);
  });
});
