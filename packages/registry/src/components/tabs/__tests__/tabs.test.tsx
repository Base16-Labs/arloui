import { jest } from '@jest/globals';
import { Tabs } from '../tabs';
import { fireEvent, renderWithTheme, screen } from '../../../../test/render';

describe('Tabs', () => {
  it('marks the selected tab and changes value on press', () => {
    const onValueChange = jest.fn();
    renderWithTheme(
      <Tabs value="posts" onValueChange={onValueChange}>
        <Tabs.Item value="posts" label="Posts" />
        <Tabs.Item value="saved" label="Saved" />
      </Tabs>,
    );

    expect(screen.getByRole('tab', { name: 'Posts' }).props.accessibilityState).toMatchObject({
      selected: true,
    });
    fireEvent.press(screen.getByRole('tab', { name: 'Saved' }));
    expect(onValueChange).toHaveBeenCalledWith('saved');
  });

  it('supports every appearance and tone', () => {
    for (const appearance of ['plain', 'underline', 'filled'] as const) {
      for (const tone of ['neutral', 'accent'] as const) {
        const { unmount } = renderWithTheme(
          <Tabs value="one" onValueChange={() => {}} appearance={appearance} tone={tone}>
            <Tabs.Item value="one" label={`${appearance}-${tone}`} />
            <Tabs.Item value="two" label="Two" />
          </Tabs>,
        );
        expect(screen.getByRole('tab', { name: `${appearance}-${tone}` })).toBeTruthy();
        unmount();
      }
    }
  });

  it('does not select a disabled tab', () => {
    const onValueChange = jest.fn();
    renderWithTheme(
      <Tabs value="one" onValueChange={onValueChange} layout="equal">
        <Tabs.Item value="one" label="One" />
        <Tabs.Item value="two" label="Two" disabled />
      </Tabs>,
    );
    fireEvent.press(screen.getByRole('tab', { name: 'Two' }));
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
