import { Chip } from '../chip';
import { renderWithTheme, screen, fireEvent } from '../../../../test/render';

describe('Chip', () => {
  it('renders label text', () => {
    renderWithTheme(<Chip>React Native</Chip>);
    expect(screen.getByText('React Native')).toBeTruthy();
  });

  it('fires onPress', () => {
    const onPress = jest.fn();
    renderWithTheme(<Chip onPress={onPress}>Tag</Chip>);
    fireEvent.press(screen.getByText('Tag'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not fire onPress when disabled', () => {
    const onPress = jest.fn();
    renderWithTheme(<Chip onPress={onPress} disabled>Tag</Chip>);
    fireEvent.press(screen.getByText('Tag'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('renders selected filter chip', () => {
    renderWithTheme(<Chip type="filter" selected>Active</Chip>);
    expect(screen.getByText('Active')).toBeTruthy();
  });

  it('renders input chip with remove button', () => {
    const onRemove = jest.fn();
    renderWithTheme(<Chip type="input" onRemove={onRemove}>Token</Chip>);
    fireEvent.press(screen.getByLabelText('Remove Token'));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('does not fire onRemove when disabled', () => {
    const onRemove = jest.fn();
    renderWithTheme(<Chip type="input" onRemove={onRemove} disabled>Token</Chip>);
    fireEvent.press(screen.getByLabelText('Remove Token'));
    expect(onRemove).not.toHaveBeenCalled();
  });

  it('renders fill style selected chip', () => {
    renderWithTheme(<Chip chipStyle="fill" selected>Filled</Chip>);
    expect(screen.getByText('Filled')).toBeTruthy();
  });

  it('renders neutral accent selected chip', () => {
    renderWithTheme(<Chip accent="neutral" selected>Neutral</Chip>);
    expect(screen.getByText('Neutral')).toBeTruthy();
  });

  it('applies sm size', () => {
    renderWithTheme(<Chip size="sm">Small</Chip>);
    expect(screen.getByText('Small')).toBeTruthy();
  });

  it('renders assist type', () => {
    renderWithTheme(<Chip type="assist">Help</Chip>);
    expect(screen.getByText('Help')).toBeTruthy();
  });

  it('exposes selected state for filter chips', () => {
    renderWithTheme(
      <Chip type="filter" selected accessibilityLabel="Filter active">
        Active
      </Chip>,
    );
    expect(screen.getByLabelText('Filter active')).toBeTruthy();
  });
});
