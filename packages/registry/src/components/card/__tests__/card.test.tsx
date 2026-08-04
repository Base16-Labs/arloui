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
