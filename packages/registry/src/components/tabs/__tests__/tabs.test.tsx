import { jest } from '@jest/globals';
import { type ReactElement } from 'react';
import { AccessibilityInfo } from 'react-native';
import { Tabs } from '../tabs';
import { ThemeProvider } from '../../../foundation/theme-provider';
import { themes, type ThemeName } from '../../../foundation/tokens';
import { fireEvent, renderWithTheme, screen, waitFor } from '../../../../test/render';

/** Renders on a pinned theme so token-dependent styles can be asserted exactly. */
function renderOnTheme(name: ThemeName, ui: ReactElement) {
  return renderWithTheme(<ThemeProvider defaultName={name}>{ui}</ThemeProvider>);
}

/** Measures the segmented track so the thumb (which needs a width) renders. */
function layoutTrack(width: number) {
  fireEvent(screen.getByLabelText('Content tabs'), 'layout', {
    nativeEvent: { layout: { width } },
  });
}

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
    for (const appearance of ['plain', 'underline', 'filled', 'segmented'] as const) {
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

  it('wraps the tab row in a horizontal scroller when scrollable', () => {
    const { toJSON } = renderWithTheme(
      <Tabs value="one" onValueChange={() => {}} scrollable>
        <Tabs.Item value="one" label="One" />
        <Tabs.Item value="two" label="Two" />
      </Tabs>,
    );
    expect(JSON.stringify(toJSON())).toContain('"horizontal":true');
  });

  describe('segmented', () => {
    it('changes value on press', () => {
      const onValueChange = jest.fn();
      renderWithTheme(
        <Tabs value="one" onValueChange={onValueChange} appearance="segmented">
          <Tabs.Item value="one" label="One" />
          <Tabs.Item value="two" label="Two" />
        </Tabs>,
      );
      fireEvent.press(screen.getByRole('tab', { name: 'Two' }));
      expect(onValueChange).toHaveBeenCalledWith('two');
    });

    it('sizes the thumb to one segment once the track is measured', () => {
      const { toJSON } = renderWithTheme(
        <Tabs value="one" onValueChange={() => {}} appearance="segmented">
          <Tabs.Item value="one" label="One" />
          <Tabs.Item value="two" label="Two" />
        </Tabs>,
      );
      // No thumb before layout — its width would be 0.
      expect(JSON.stringify(toJSON())).not.toContain('"position":"absolute"');

      layoutTrack(300);
      // 4px of padding either side, split across two segments.
      expect(JSON.stringify(toJSON())).toContain('"width":146');
    });

    it('tints the thumb per theme', () => {
      for (const name of ['light', 'dark'] as const) {
        const { toJSON, unmount } = renderOnTheme(
          name,
          <Tabs value="one" onValueChange={() => {}} appearance="segmented">
            <Tabs.Item value="one" label="One" />
            <Tabs.Item value="two" label="Two" />
          </Tabs>,
        );
        layoutTrack(300);
        const expected =
          name === 'dark' ? themes.dark.colors.borderStrong : themes.light.colors.surface;
        expect(JSON.stringify(toJSON())).toContain(`"backgroundColor":"${expected}"`);
        unmount();
      }
    });

    it('still tracks selection when reduce-motion is on', async () => {
      jest.mocked(AccessibilityInfo.isReduceMotionEnabled).mockResolvedValueOnce(true);
      const onValueChange = jest.fn();
      renderWithTheme(
        <Tabs value="one" onValueChange={onValueChange} appearance="segmented">
          <Tabs.Item value="one" label="One" />
          <Tabs.Item value="two" label="Two" />
        </Tabs>,
      );

      await waitFor(() => {
        expect(screen.getByRole('tab', { name: 'One' }).props.accessibilityState).toMatchObject({
          selected: true,
        });
      });
      layoutTrack(300);
      fireEvent.press(screen.getByRole('tab', { name: 'Two' }));
      expect(onValueChange).toHaveBeenCalledWith('two');
    });
  });
});
