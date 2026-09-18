import { Carousel } from '../carousel';
import { fireEvent } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import { renderWithTheme, screen } from '../../../../test/render';

describe('Carousel', () => {
  it('keeps icon arrows labelled and navigable', () => {
    const onIndexChange = jest.fn();
    renderWithTheme(
      <Carousel arrows onIndexChange={onIndexChange}>
        <View><Text>First</Text></View>
        <View><Text>Last</Text></View>
      </Carousel>,
    );

    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    fireEvent.press(screen.getByRole('button', { name: 'Next' }));
    expect(onIndexChange).toHaveBeenLastCalledWith(1);
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    fireEvent.press(screen.getByRole('button', { name: 'Previous' }));
    expect(onIndexChange).toHaveBeenLastCalledWith(0);
  });

  it('renders children and pagination dots', () => {
    renderWithTheme(
      <Carousel>
        <View accessibilityLabel="slide-1"><Text>Slide 1</Text></View>
        <View accessibilityLabel="slide-2"><Text>Slide 2</Text></View>
        <View accessibilityLabel="slide-3"><Text>Slide 3</Text></View>
      </Carousel>,
    );

    expect(screen.getByText('Slide 1')).toBeTruthy();
    expect(screen.getByText('Slide 2')).toBeTruthy();
    expect(screen.getByText('Slide 3')).toBeTruthy();
    expect(screen.getAllByRole('button', { name: /Go to item/ })).toHaveLength(3);
  });

  it('hides dots when indicator is none', () => {
    renderWithTheme(
      <Carousel indicator="none">
        <View><Text>A</Text></View>
        <View><Text>B</Text></View>
      </Carousel>,
    );

    expect(screen.queryAllByRole('button', { name: /Go to item/ })).toHaveLength(0);
  });

  it('hides dots when there is only one child', () => {
    renderWithTheme(
      <Carousel>
        <View><Text>Only</Text></View>
      </Carousel>,
    );

    expect(screen.queryAllByRole('button', { name: /Go to item/ })).toHaveLength(0);
  });
});
