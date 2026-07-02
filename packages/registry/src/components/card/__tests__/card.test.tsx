import { Text } from 'react-native';
import { Card } from '../card';
import { renderWithTheme, screen } from '../../../../test/render';

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
});
