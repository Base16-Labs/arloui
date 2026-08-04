import { jest } from '@jest/globals';
import { Text, View } from 'react-native';
import { ActionCard } from '../action-card';
import { ListCard } from '../list-card';
import { MediaCard } from '../media-card';
import { StatCard } from '../stat-card';
import { fireEvent, renderWithTheme, screen } from '../../../../test/render';

const money = (v: number) => `$${v.toFixed(2)}`;
const hidden = { includeHiddenElements: true } as const;

describe('StatCard', () => {
  it('shows the label and the value on the rolling counter', () => {
    renderWithTheme(<StatCard label="Balance" value={1240.5} format={money} />);
    expect(screen.getByText('Balance')).toBeTruthy();
    // The counter renders per character and hides itself from assistive tech.
    expect(screen.getAllByText('$', hidden).length).toBeGreaterThan(0);
  });

  it('always signs the delta', () => {
    const { rerender } = renderWithTheme(
      <StatCard label="Balance" value={1240} delta={412.19} format={money} />,
    );
    expect(screen.getByText(/\+\$412\.19/)).toBeTruthy();

    rerender(<StatCard label="Balance" value={1240} delta={-412.19} format={money} />);
    // U+2212, not a hyphen.
    expect(screen.getByText(/−\$412\.19/)).toBeTruthy();
  });

  it('appends a signed percentage when given one', () => {
    renderWithTheme(
      <StatCard label="Revenue" value={5000} delta={250} deltaPercent={5.26} format={money} />,
    );
    expect(screen.getByText(/\+\$250\.00 \(\+5\.26%\)/)).toBeTruthy();
  });

  it('omits the delta row entirely when there is no delta, trend, or caption', () => {
    renderWithTheme(<StatCard label="Balance" value={10} format={money} />);
    expect(screen.queryByText(/[+−]/)).toBeNull();
  });

  it('becomes a button when pressable', () => {
    const onPress = jest.fn();
    renderWithTheme(<StatCard label="Balance" value={10} onPress={onPress} />);
    fireEvent.press(screen.getByRole('button', { name: 'Balance' }));
    expect(onPress).toHaveBeenCalled();
  });

  it('renders a caption and a trend without crashing', () => {
    renderWithTheme(
      <StatCard
        label="Spend"
        value={320}
        delta={-40}
        caption="vs last month"
        trend={[10, 14, 9, 6]}
        format={money}
      />,
    );
    expect(screen.getByText('vs last month')).toBeTruthy();
  });
});

describe('ListCard', () => {
  it('renders title, subtitle, and value', () => {
    renderWithTheme(<ListCard title="Spotify" subtitle="Yesterday" value="−$9.99" />);
    expect(screen.getByText('Spotify')).toBeTruthy();
    expect(screen.getByText('Yesterday')).toBeTruthy();
    expect(screen.getByText('−$9.99')).toBeTruthy();
  });

  it('is only a button when it has a press handler', () => {
    const { rerender } = renderWithTheme(<ListCard title="Static" />);
    expect(screen.queryByRole('button')).toBeNull();

    const onPress = jest.fn();
    rerender(<ListCard title="Tappable" onPress={onPress} />);
    fireEvent.press(screen.getByRole('button', { name: 'Tappable' }));
    expect(onPress).toHaveBeenCalled();
  });

  it('does not fire while disabled', () => {
    const onPress = jest.fn();
    renderWithTheme(<ListCard title="Row" onPress={onPress} disabled />);
    fireEvent.press(screen.getByRole('button', { name: 'Row' }));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('prefers an explicit trailing slot over the value text', () => {
    renderWithTheme(
      <ListCard title="Row" value="$10" trailing={<Text>custom</Text>} />,
    );
    expect(screen.getByText('custom')).toBeTruthy();
    expect(screen.queryByText('$10')).toBeNull();
  });

  it('renders leading content and a value caption', () => {
    renderWithTheme(
      <ListCard
        title="Transfer"
        leading={<View testID="avatar" />}
        value="+$1,200"
        valueCaption="Completed"
        valueTone="positive"
      />,
    );
    expect(screen.getByTestId('avatar')).toBeTruthy();
    expect(screen.getByText('Completed')).toBeTruthy();
  });

  describe('Group', () => {
    it('keeps every row interactive inside a group', () => {
      const first = jest.fn();
      const second = jest.fn();
      renderWithTheme(
        <ListCard.Group>
          <ListCard title="One" onPress={first} />
          <ListCard title="Two" onPress={second} />
        </ListCard.Group>,
      );

      fireEvent.press(screen.getByRole('button', { name: 'One' }));
      fireEvent.press(screen.getByRole('button', { name: 'Two' }));
      expect(first).toHaveBeenCalled();
      expect(second).toHaveBeenCalled();
    });

    it('renders a single row group without a separator', () => {
      renderWithTheme(
        <ListCard.Group>
          <ListCard title="Only" />
        </ListCard.Group>,
      );
      expect(screen.getByText('Only')).toBeTruthy();
    });
  });
});

describe('MediaCard', () => {
  it('renders media, title, and subtitle in the below layout', () => {
    renderWithTheme(
      <MediaCard media={<View testID="cover" />} title="Kyoto" subtitle="12 photos" />,
    );
    expect(screen.getByTestId('cover')).toBeTruthy();
    expect(screen.getByText('Kyoto')).toBeTruthy();
    expect(screen.getByText('12 photos')).toBeTruthy();
  });

  it('renders the overlay layout with its text over the media', () => {
    renderWithTheme(
      <MediaCard media={<View testID="cover" />} title="Kyoto" subtitle="12 photos" layout="overlay" />,
    );
    expect(screen.getByText('Kyoto')).toBeTruthy();
    expect(screen.getByText('12 photos')).toBeTruthy();
  });

  it('becomes a button labelled by its title when pressable', () => {
    const onPress = jest.fn();
    renderWithTheme(<MediaCard media={<View />} title="Kyoto" onPress={onPress} />);
    fireEvent.press(screen.getByRole('button', { name: 'Kyoto' }));
    expect(onPress).toHaveBeenCalled();
  });

  it('renders a badge and a footer', () => {
    renderWithTheme(
      <MediaCard
        media={<View />}
        title="Kyoto"
        badge={<Text>NEW</Text>}
        footer={<Text>footer</Text>}
      />,
    );
    expect(screen.getByText('NEW')).toBeTruthy();
    expect(screen.getByText('footer')).toBeTruthy();
  });
});

describe('ActionCard', () => {
  it('renders the pitch and both actions', () => {
    const primary = jest.fn();
    const secondary = jest.fn();
    renderWithTheme(
      <ActionCard
        title="Turn on 2FA"
        body="Add a second step when signing in."
        primaryAction={{ label: 'Enable', onPress: primary }}
        secondaryAction={{ label: 'Not now', onPress: secondary }}
      />,
    );

    expect(screen.getByText('Turn on 2FA')).toBeTruthy();
    expect(screen.getByText('Add a second step when signing in.')).toBeTruthy();

    fireEvent.press(screen.getByRole('button', { name: 'Enable' }));
    fireEvent.press(screen.getByRole('button', { name: 'Not now' }));
    expect(primary).toHaveBeenCalled();
    expect(secondary).toHaveBeenCalled();
  });

  it('only shows a dismiss affordance when it can be dismissed', () => {
    const onDismiss = jest.fn();
    const { rerender } = renderWithTheme(<ActionCard title="Notice" />);
    expect(screen.queryByRole('button', { name: 'Dismiss' })).toBeNull();

    rerender(<ActionCard title="Notice" onDismiss={onDismiss} />);
    fireEvent.press(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalled();
  });

  it('renders every tone without crashing', () => {
    for (const tone of ['default', 'info', 'success', 'warning', 'error'] as const) {
      const { unmount } = renderWithTheme(
        <ActionCard title={tone} icon={<View />} primaryAction={{ label: 'Go', onPress: () => {} }} />,
      );
      expect(screen.getByText(tone)).toBeTruthy();
      unmount();
    }
  });

  it('does not fire a disabled action', () => {
    const onPress = jest.fn();
    renderWithTheme(
      <ActionCard title="Notice" primaryAction={{ label: 'Go', onPress, disabled: true }} />,
    );
    fireEvent.press(screen.getByRole('button', { name: 'Go' }));
    expect(onPress).not.toHaveBeenCalled();
  });
});
