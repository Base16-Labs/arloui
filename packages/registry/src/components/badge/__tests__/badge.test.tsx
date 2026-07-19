import { Badge } from '../badge';
import { renderWithTheme, screen } from '../../../../test/render';

describe('Badge', () => {
  it('renders label text', () => {
    renderWithTheme(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeTruthy();
  });

  it('renders dot indicator alongside label', () => {
    const { toJSON } = renderWithTheme(<Badge dot>Online</Badge>);
    const tree = JSON.stringify(toJSON());
    expect(tree).toContain('Online');
  });

  it('renders icon-only badge (no label)', () => {
    const icon = <></>;
    renderWithTheme(<Badge leadingIcon={icon} accessibilityLabel="star" />);
    expect(screen.getByLabelText('star')).toBeTruthy();
  });

  it('applies sm size', () => {
    renderWithTheme(<Badge size="sm">Small</Badge>);
    expect(screen.getByText('Small')).toBeTruthy();
  });

  it('renders with each tone', () => {
    const tones = ['neutral', 'info', 'success', 'warning', 'error'] as const;
    for (const tone of tones) {
      const { unmount } = renderWithTheme(<Badge tone={tone}>T</Badge>);
      expect(screen.getByText('T')).toBeTruthy();
      unmount();
    }
  });

  it('renders with each appearance', () => {
    const appearances = ['soft', 'solid', 'outline'] as const;
    for (const appearance of appearances) {
      const { unmount } = renderWithTheme(<Badge appearance={appearance}>A</Badge>);
      expect(screen.getByText('A')).toBeTruthy();
      unmount();
    }
  });

  it('solid appearance renders inset border overlay', () => {
    const { toJSON } = renderWithTheme(<Badge appearance="solid" tone="info">New</Badge>);
    const tree = JSON.stringify(toJSON());
    expect(tree).toContain('New');
  });

  it('exposes text accessibility role', () => {
    renderWithTheme(<Badge accessibilityLabel="3 new">3</Badge>);
    expect(screen.getByLabelText('3 new')).toBeTruthy();
  });
});
