import { jest } from '@jest/globals';
import { ScrollView, Text } from 'react-native';
import { TabBar, useTabBarScroll } from '../tab-bar';
import { fireEvent, renderWithTheme, screen } from '../../../../test/render';

describe('TabBar', () => {
  it('marks the current tab and changes selection on press', () => {
    const onValueChange = jest.fn();
    renderWithTheme(
      <TabBar value="home" onValueChange={onValueChange} width="floating" surface="filled">
        <TabBar.Item value="home" label="Home" />
        <TabBar.Item value="search" label="Search" />
        <TabBar.Item value="profile" label="Profile" />
      </TabBar>,
    );

    expect(screen.getByRole('tab', { name: 'Home' }).props.accessibilityState).toMatchObject({
      selected: true,
    });
    fireEvent.press(screen.getByRole('tab', { name: 'Search' }));
    expect(onValueChange).toHaveBeenCalledWith('search');
  });

  it('supports labels, badges, and disabled items', () => {
    renderWithTheme(
      <TabBar value="inbox" onValueChange={() => {}} showLabels surface="transparent">
        <TabBar.Item value="inbox" label="Inbox" badge={3} />
        <TabBar.Item value="settings" label="Settings" disabled />
      </TabBar>,
    );

    expect(screen.getByText('Inbox')).toBeTruthy();
    expect(screen.getByText('3')).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Settings' }).props.accessibilityState).toMatchObject({
      disabled: true,
    });
  });

  it('hides while scrolling down and returns near the top', () => {
    function ScrollProbe() {
      const scroll = useTabBarScroll({ threshold: 10, topOffset: 8 });
      return (
        <>
          <Text>{scroll.hidden ? 'hidden' : 'visible'}</Text>
          <ScrollView testID="feed" onScroll={scroll.onScroll} />
        </>
      );
    }

    renderWithTheme(<ScrollProbe />);
    fireEvent.scroll(screen.getByTestId('feed'), { nativeEvent: { contentOffset: { y: 20 } } });
    fireEvent.scroll(screen.getByTestId('feed'), { nativeEvent: { contentOffset: { y: 35 } } });
    expect(screen.getByText('hidden')).toBeTruthy();

    fireEvent.scroll(screen.getByTestId('feed'), { nativeEvent: { contentOffset: { y: 0 } } });
    expect(screen.getByText('visible')).toBeTruthy();
  });

  it('mounts the blur layer on a glass surface and keeps tabs selectable', () => {
    const onValueChange = jest.fn();
    renderWithTheme(
      <TabBar
        value="home"
        onValueChange={onValueChange}
        width="floating"
        surface="glass"
        blurComponent={<Text>blur</Text>}
      >
        <TabBar.Item value="home" label="Home" />
        <TabBar.Item value="search" label="Search" />
      </TabBar>,
    );

    expect(screen.getByText('blur', { includeHiddenElements: true })).toBeTruthy();
    fireEvent.press(screen.getByRole('tab', { name: 'Search' }));
    expect(onValueChange).toHaveBeenCalledWith('search');
  });

  it('renders a glass bar without a blur layer', () => {
    renderWithTheme(
      <TabBar value="home" onValueChange={() => {}} surface="glass" showLabels>
        <TabBar.Item value="home" label="Home" />
      </TabBar>,
    );
    expect(screen.getByText('Home')).toBeTruthy();
  });

  /**
   * A floating bar draws a 1px border on every side, so the outer view measures
   * 2px wider than the row the tabs are laid out in. Sizing the pill off the
   * outer width made every cell fractionally too wide, and the error compounded —
   * the pill sat flush on the first tab and visibly right of the last one.
   */
  it('sizes the selection pill from the row, not the bordered outer bar', () => {
    const ROW = 400;
    const PADDING = 4; // floating bars inset the row by this much
    const ITEMS = 4;

    renderWithTheme(
      <TabBar value="a" onValueChange={() => {}} width="floating" surface="filled">
        <TabBar.Item value="a" label="A" />
        <TabBar.Item value="b" label="B" />
        <TabBar.Item value="c" label="C" />
        <TabBar.Item value="d" label="D" />
      </TabBar>,
    );

    // The row is the only node that measures itself; the pill derives from it.
    const row = screen.UNSAFE_root
      .findAllByType('View' as never)
      .find((v) => typeof (v.props as { onLayout?: unknown }).onLayout === 'function');
    fireEvent(row as never, 'layout', {
      nativeEvent: { layout: { width: ROW, height: 56, x: 0, y: 0 } },
    });

    // The pill is the absolutely-positioned capsule behind the tabs.
    const pill = screen.UNSAFE_root
      .findAllByType('View' as never)
      .map(
        (v) =>
          (v.props as { style?: { position?: string; width?: number; borderRadius?: number } })
            .style,
      )
      .find((s) => s && s.position === 'absolute' && typeof s.width === 'number' && s.borderRadius);

    expect(pill).toBeDefined();
    // One cell of the row's own track — not of the 2px-wider bordered outer bar,
    // which would give 100.5 here and creep right across the four tabs.
    expect(pill?.width).toBeCloseTo((ROW - PADDING * 2) / ITEMS, 5);
  });
});
