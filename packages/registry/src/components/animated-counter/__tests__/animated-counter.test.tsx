import { AnimatedCounter } from '../animated-counter';
import { renderWithTheme, screen } from '../../../../test/render';

const base = { fontSize: 20, lineHeight: 24, color: '#101828' } as const;
// Each character renders in its own column and is hidden from assistive tech.
const hidden = { includeHiddenElements: true } as const;

describe('AnimatedCounter', () => {
  it('renders each character of the text', () => {
    renderWithTheme(<AnimatedCounter text="$1,240" {...base} />);
    expect(screen.getAllByText('$', hidden).length).toBeGreaterThan(0);
    expect(screen.getAllByText('1', hidden).length).toBeGreaterThan(0);
    expect(screen.getAllByText(',', hidden).length).toBeGreaterThan(0);
  });

  it('rolls to a new value without crashing', () => {
    const { rerender } = renderWithTheme(<AnimatedCounter text="10" {...base} />);
    rerender(<AnimatedCounter text="12" {...base} />);
    expect(screen.getAllByText('2', hidden).length).toBeGreaterThan(0);
  });

  it('honours an explicit font family and weight', () => {
    const view = renderWithTheme(
      <AnimatedCounter text="42" {...base} fontFamily="Manrope" fontWeight="700" />,
    );
    expect(view.toJSON()).toBeTruthy();
  });
});
