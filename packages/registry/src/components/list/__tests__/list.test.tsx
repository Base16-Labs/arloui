import { jest } from '@jest/globals';
import { Text, View } from 'react-native';
import { List } from '../list';
import { fireEvent, renderWithTheme, screen } from '../../../../test/render';

describe('List.Row', () => {
  it('renders title, subtitle, and value', () => {
    renderWithTheme(
      <List>
        <List.Row title="Spotify" subtitle="Yesterday" value="−$9.99" />
      </List>,
    );
    expect(screen.getByText('Spotify')).toBeTruthy();
    expect(screen.getByText('Yesterday')).toBeTruthy();
    expect(screen.getByText('−$9.99')).toBeTruthy();
  });

  it('renders a node subtitle, e.g. an inline badge', () => {
    renderWithTheme(
      <List>
        <List.Row title="Route" subtitle={<Text>Easy</Text>} />
      </List>,
    );
    expect(screen.getByText('Easy')).toBeTruthy();
  });

  it('shows a trailing value and a trailing icon together', () => {
    renderWithTheme(
      <List>
        <List.Row title="Spotify" value="−$9.99" trailing={<Text>chev</Text>} />
      </List>,
    );
    expect(screen.getByText('−$9.99')).toBeTruthy();
    expect(screen.getByText('chev')).toBeTruthy();
  });

  it('renders leading content and a value caption', () => {
    renderWithTheme(
      <List>
        <List.Row
          title="Transfer"
          leading={<View testID="media" />}
          value="+$1,200"
          valueCaption="Completed"
          valueTone="positive"
        />
      </List>,
    );
    expect(screen.getByTestId('media')).toBeTruthy();
    expect(screen.getByText('Completed')).toBeTruthy();
  });

  it('is only a button when it has a press handler', () => {
    const { rerender } = renderWithTheme(
      <List>
        <List.Row title="Static" />
      </List>,
    );
    expect(screen.queryByRole('button')).toBeNull();

    const onPress = jest.fn();
    rerender(
      <List>
        <List.Row title="Tappable" onPress={onPress} />
      </List>,
    );
    fireEvent.press(screen.getByRole('button', { name: 'Tappable' }));
    expect(onPress).toHaveBeenCalled();
  });

  it('does not fire while disabled', () => {
    const onPress = jest.fn();
    renderWithTheme(
      <List>
        <List.Row title="Row" onPress={onPress} disabled />
      </List>,
    );
    fireEvent.press(screen.getByRole('button', { name: 'Row' }));
    expect(onPress).not.toHaveBeenCalled();
  });
});

describe('List', () => {
  it('keeps every row interactive', () => {
    const first = jest.fn();
    const second = jest.fn();
    renderWithTheme(
      <List>
        <List.Row title="One" onPress={first} />
        <List.Row title="Two" onPress={second} />
      </List>,
    );

    fireEvent.press(screen.getByRole('button', { name: 'One' }));
    fireEvent.press(screen.getByRole('button', { name: 'Two' }));
    expect(first).toHaveBeenCalled();
    expect(second).toHaveBeenCalled();
  });

  it('renders separated and every divider setting without crashing', () => {
    for (const divider of ['inset', 'balanced', 'edge', 'none'] as const) {
      const { unmount } = renderWithTheme(
        <List divider={divider}>
          <List.Row title={`${divider}-a`} />
          <List.Row title={`${divider}-b`} />
        </List>,
      );
      expect(screen.getByText(`${divider}-a`)).toBeTruthy();
      unmount();
    }

    renderWithTheme(
      <List separated>
        <List.Row title="sep-a" />
        <List.Row title="sep-b" />
      </List>,
    );
    expect(screen.getByText('sep-a')).toBeTruthy();
    expect(screen.getByText('sep-b')).toBeTruthy();
  });

  it('renders both densities without crashing', () => {
    for (const density of ['comfortable', 'compact'] as const) {
      const { unmount } = renderWithTheme(
        <List density={density}>
          <List.Row title={`${density}-row`} />
        </List>,
      );
      expect(screen.getByText(`${density}-row`)).toBeTruthy();
      unmount();
    }
  });

  it('renders a single-row list', () => {
    renderWithTheme(
      <List>
        <List.Row title="Only" />
      </List>,
    );
    expect(screen.getByText('Only')).toBeTruthy();
  });
});
