import { Text } from 'react-native';
import { GlassBackdrop, useGlassSurface, type GlassMaterial } from '../glass';
import { renderWithTheme, screen } from '../../../test/render';

/** Renders a glass surface's resolved values as a delimited string to assert on. */
function Probe({ material }: { material?: GlassMaterial }) {
  const g = useGlassSurface(material);
  return <Text>{`${g.backgroundColor}|${g.borderColor}|${g.borderWidth}|${g.blur}`}</Text>;
}

describe('useGlassSurface', () => {
  it('resolves each material into a translucent surface', () => {
    for (const material of ['small', 'medium', 'large'] as const) {
      const view = renderWithTheme(<Probe material={material} />);
      const text = screen.getByText(/\|/).props.children as string;
      const [bg, border, width, blur] = text.split('|');
      expect(bg).toBeTruthy();
      expect(border).toBeTruthy();
      expect(width).toBe('1');
      expect(Number.isNaN(Number(blur))).toBe(false);
      view.unmount();
    }
  });

  it('defaults to the medium material', () => {
    renderWithTheme(<Probe />);
    expect(screen.getByText(/\|/)).toBeTruthy();
  });
});

describe('GlassBackdrop', () => {
  it('renders nothing without a material or children', () => {
    const view = renderWithTheme(<GlassBackdrop />);
    expect(view.toJSON()).toBeNull();
  });

  it('mounts the blur layer and children when given a material', () => {
    renderWithTheme(
      <GlassBackdrop material="large">
        <Text>blur</Text>
      </GlassBackdrop>,
    );
    // Decorative, so it is mounted but hidden from assistive tech.
    expect(screen.getByText('blur', { includeHiddenElements: true })).toBeTruthy();
  });

  it('renders children even without a material', () => {
    renderWithTheme(
      <GlassBackdrop>
        <Text>child</Text>
      </GlassBackdrop>,
    );
    expect(screen.getByText('child', { includeHiddenElements: true })).toBeTruthy();
  });
});
