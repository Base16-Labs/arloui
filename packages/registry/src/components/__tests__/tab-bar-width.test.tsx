import { StyleSheet } from 'react-native';
import { TabBar, type TabBarWidth } from '../tab-bar/tab-bar';
import { renderWithTheme } from '../../../test/render';

/** The bar's own surface: the first node that sets a border radius. */
function barStyle(tree: unknown) {
  let found: Record<string, unknown> | undefined;
  const walk = (node: unknown): void => {
    if (found || !node || typeof node !== 'object') return;
    if (Array.isArray(node)) return node.forEach(walk);
    const element = node as { props?: { style?: unknown }; children?: unknown };
    const style = StyleSheet.flatten(element.props?.style as never) as Record<string, unknown> | undefined;
    if (style && 'borderRadius' in style && 'minHeight' in style) found = style;
    else walk(element.children);
  };
  walk(tree);
  return found!;
}

function bar(width: TabBarWidth, count: number) {
  const labels = ['Calculate', 'Explore', 'Settings', 'Inbox', 'Profile'].slice(0, count);
  return (
    <TabBar value={labels[0]!} onValueChange={() => {}} width={width} showLabels>
      {labels.map((label) => (
        <TabBar.Item key={label} value={label} label={label} />
      ))}
    </TabBar>
  );
}

describe('TabBar width="fit"', () => {
  it('sizes itself to its tabs rather than to the screen', () => {
    const three = barStyle(renderWithTheme(bar('fit', 3)).toJSON());
    const two = barStyle(renderWithTheme(bar('fit', 2)).toJSON());
    expect(typeof three.width).toBe('number');
    expect(three.width as number).toBeGreaterThan(two.width as number);
  });

  it('gives each tab room for its label and a full touch target', () => {
    const style = barStyle(renderWithTheme(bar('fit', 3)).toJSON());
    expect((style.width as number) / 3).toBeGreaterThanOrEqual(88);
  });

  it('never runs past the floating bar on a narrow screen', () => {
    expect(barStyle(renderWithTheme(bar('fit', 5)).toJSON()).maxWidth).toBe('92%');
  });

  it('is otherwise the floating pill: centred and fully rounded', () => {
    const fit = barStyle(renderWithTheme(bar('fit', 3)).toJSON());
    const floating = barStyle(renderWithTheme(bar('floating', 3)).toJSON());
    expect(fit.alignSelf).toBe('center');
    expect(fit.borderRadius).toBe(floating.borderRadius);
    expect(fit.marginBottom).toBe(floating.marginBottom);
  });

  it('leaves the floating bar at 92% of the screen', () => {
    expect(barStyle(renderWithTheme(bar('floating', 3)).toJSON()).width).toBe('92%');
  });
});
