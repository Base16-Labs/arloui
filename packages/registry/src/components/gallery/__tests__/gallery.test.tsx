import { Gallery } from '../gallery';
import { Text, View } from 'react-native';
import { renderWithTheme, screen } from '../../../../test/render';

describe('Gallery', () => {
  it('renders all children', () => {
    renderWithTheme(
      <Gallery columns={2}>
        <View><Text>Item 1</Text></View>
        <View><Text>Item 2</Text></View>
        <View><Text>Item 3</Text></View>
      </Gallery>,
    );

    expect(screen.getByText('Item 1')).toBeTruthy();
    expect(screen.getByText('Item 2')).toBeTruthy();
    expect(screen.getByText('Item 3')).toBeTruthy();
  });

  it('mounts masonry container without crashing', () => {
    const { unmount } = renderWithTheme(
      <Gallery columns={3} masonry>
        <View><Text>A</Text></View>
        <View><Text>B</Text></View>
        <View><Text>C</Text></View>
        <View><Text>D</Text></View>
      </Gallery>,
    );

    expect(screen.getByLabelText('Gallery')).toBeTruthy();
    unmount();
  });

  it('accepts different column counts', () => {
    for (const cols of [1, 2, 3, 4] as const) {
      const { unmount } = renderWithTheme(
        <Gallery columns={cols}>
          <View><Text>{`cols-${cols}`}</Text></View>
          <View><Text>B</Text></View>
        </Gallery>,
      );
      expect(screen.getByText(`cols-${cols}`)).toBeTruthy();
      unmount();
    }
  });
});
