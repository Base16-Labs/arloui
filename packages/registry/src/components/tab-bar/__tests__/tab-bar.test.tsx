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
});
