import { Sparkline } from '../sparkline';
import { renderWithTheme } from '../../../../test/render';

describe('Sparkline', () => {
  it('renders for each tone without crashing', () => {
    for (const tone of ['auto', 'positive', 'negative', 'brand', 'neutral'] as const) {
      const view = renderWithTheme(<Sparkline data={[1, 3, 2, 5, 4]} tone={tone} height={24} />);
      expect(view.toJSON()).toBeTruthy();
      view.unmount();
    }
  });

  it('renders an end dot and a fill gradient when asked', () => {
    const view = renderWithTheme(
      <Sparkline data={[1, 2, 3, 2, 6]} showEndDot fill accessibilityLabel="Balance trend" />,
    );
    expect(view.toJSON()).toBeTruthy();
  });

  it('handles a flat single-point series', () => {
    const view = renderWithTheme(<Sparkline data={[5]} />);
    expect(view.toJSON()).toBeTruthy();
  });

  it('honours density and curve overrides', () => {
    const view = renderWithTheme(
      <Sparkline data={[3, 1, 4, 1, 5]} density="comfortable" curve="linear" strokeWidth={3} />,
    );
    expect(view.toJSON()).toBeTruthy();
  });
});
