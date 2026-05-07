const app = document.querySelector('#app');

const state = {
  route: location.hash.replace('#', '') || 'components',
  icons: [],
  iconTab: 'outline',
  iconQuery: '',
  activeIcon: null,
  registry: null,
  activeComponent: 'button',
  activeFile: null,
};

const componentFallbacks = {
  button: {
    title: 'Button',
    description:
      'Action primitive with tone, appearance, size, icons, loading, and disabled states.',
    command: 'npx arloui add button',
    files: [
      {
        target: 'button.tsx',
        content: `import { Button } from '@/components/ui/button';

<Button label="Continue" onPress={onSubmit} />
<Button label="Cancel" appearance="outline" tone="neutral" />`,
      },
    ],
  },
  card: {
    title: 'Card',
    description: 'Layered surface primitive with compound header, body, and footer slots.',
    command: 'npx arloui add card',
    files: [
      {
        target: 'card.tsx',
        content: `import { Card } from '@/components/ui/card';

<Card>
  <Card.Header>
    <Card.Title>Payment method</Card.Title>
    <Card.Subtitle>Choose a saved card.</Card.Subtitle>
  </Card.Header>
  <Card.Body>{children}</Card.Body>
</Card>`,
      },
    ],
  },
  input: {
    title: 'Input',
    description:
      'Filled text input with label, helper/error text, leading and trailing slots, compact inset label, password mode, disabled state, and web focus ring.',
    command: 'npx arloui add input',
    files: [
      {
        target: 'input.tsx',
        content: `import { Input, InputAction } from '@/components/ui/input';

<Input placeholder="Email" leadingIcon={<MailIcon />} />
<Input insetLabel label="Username" defaultValue="@allanthomas" />
<Input errorText="Username taken" />`,
      },
    ],
  },
};

function setRoute(route) {
  state.route = route;
  location.hash = route;
  render();
}

function copyText(value, label = 'Copied') {
  navigator.clipboard?.writeText(value).then(
    () => showToast(label),
    () => showToast('Copy failed'),
  );
}

let toastTimer = null;
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.append(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
}

function stripWeightPrefix(name) {
  return name.replace(/^(outline|solid)-/, '');
}

function componentName(fileBase) {
  return fileBase
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');
}

function iconUsage(name) {
  const component = componentName(name);
  return `import { ${component} } from '@arloui/icons';

<${component} width={24} height={24} color={t.colors.textSecondary} />`;
}

async function copySvg(name) {
  const res = await fetch(`/arloui-icons/${name}.svg`);
  if (!res.ok) return showToast('SVG not found');
  copyText(await res.text(), 'SVG copied');
}

async function loadData() {
  try {
    const icons = await fetch('/icon-names.json');
    state.icons = icons.ok ? await icons.json() : [];
  } catch {
    state.icons = [];
  }

  try {
    const registry = await fetch('/r/index.json');
    state.registry = registry.ok ? await registry.json() : null;
  } catch {
    state.registry = null;
  }
}

function navButton(route, label) {
  return `<button type="button" data-route="${route}" aria-current="${state.route === route ? 'page' : 'false'}">${label}</button>`;
}

function shell(content) {
  return `
    <div class="shell">
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-title">Arlo UI</div>
          <div class="brand-subtitle">Copy-paste React Native components with a web-native browsing experience.</div>
        </div>
        <nav class="nav" aria-label="Primary">
          ${navButton('components', 'Components')}
          ${navButton('icons', 'Icons')}
          ${navButton('install', 'Install')}
        </nav>
      </aside>
      <main class="main">
        ${content}
      </main>
    </div>
  `;
}

function hero() {
  return `
    <section class="hero">
      <div class="hero-inner">
        <div class="eyebrow">React Native source, browser-native docs</div>
        <h1>Copy components without fighting the docs.</h1>
        <p class="lead">The public site is normal web UI for search, tabs, code blocks, and clipboard actions. The code you copy remains React Native.</p>
        <div class="quickstart">
          <span class="pill">npx arloui init</span>
          <span class="pill">npx arloui add button</span>
          <span class="pill">pnpm add @arloui/icons react-native-svg</span>
        </div>
      </div>
    </section>
  `;
}

function componentEntries() {
  const items = state.registry?.items?.filter((item) => item.kind !== 'foundation') ?? [];
  if (items.length > 0) return items;
  return Object.entries(componentFallbacks).map(([name, value]) => ({ name, ...value }));
}

async function ensureComponentFile(name) {
  if (componentFallbacks[name]?.resolved) return componentFallbacks[name];

  try {
    const res = await fetch(`/r/${name}.json`);
    if (!res.ok) throw new Error('missing registry file');
    const entry = await res.json();
    componentFallbacks[name] = {
      title: entry.title,
      description: entry.description,
      command: `npx arloui add ${entry.name}`,
      files: entry.files ?? [],
      resolved: true,
    };
  } catch {
    componentFallbacks[name] ??= componentFallbacks.button;
  }
}

function componentExamples(name) {
  if (name === 'input') {
    return [
      {
        title: 'Email with leading icon',
        description: 'Use a visual cue for field intent.',
        preview: `<label class="demo-field"><span>Email</span><div class="demo-input"><span>mail</span><input placeholder="Email" /></div></label>`,
        code: `import { Input } from '@/components/ui/input';

<Input label="Email" placeholder="Email" leadingIcon={<MailIcon />} />`,
      },
      {
        title: 'Phone with leading action',
        description: 'Place country code or picker actions before the input.',
        preview: `<label class="demo-field"><span>Phone</span><div class="demo-input split"><button type="button">+447</button><input value="020-293-9393" /></div></label>`,
        code: `import { Input, InputAction } from '@/components/ui/input';

<View style={{ flexDirection: 'row', gap: 8 }}>
  <InputAction accessibilityLabel="Select country code">
    <Text>+447</Text>
  </InputAction>
  <Input containerStyle={{ flex: 1 }} label="Phone" keyboardType="phone-pad" />
</View>`,
      },
      {
        title: 'Validation',
        description: 'Show error copy under the field and highlight the label/border.',
        preview: `<label class="demo-field error"><span>Username</span><div class="demo-input"><input value="@allanthomas" /></div><small>Username taken</small></label>`,
        code: `import { Input } from '@/components/ui/input';

<Input
  insetLabel
  label="Username"
  defaultValue="@allanthomas"
  errorText="Username taken"
/>`,
      },
      {
        title: 'Search with clear action',
        description: 'Use trailing actions for clearing or revealing content.',
        preview: `<label class="demo-field"><span>Search</span><div class="demo-input"><span>search</span><input value="Query" /><span>x</span></div></label>`,
        code: `import { Input, InputAction } from '@/components/ui/input';

<Input
  value={query}
  onChangeText={setQuery}
  leadingIcon={<SearchIcon />}
  trailingAction={
    query ? (
      <InputAction accessibilityLabel="Clear query" onPress={() => setQuery('')}>
        <CloseIcon />
      </InputAction>
    ) : undefined
  }
/>`,
      },
    ];
  }

  if (name === 'card') {
    return [
      {
        title: 'Default surface',
        description: 'Use for grouping related content.',
        preview: `<div class="demo-card"><span class="demo-kicker">Default</span><h3>Payment method</h3><p class="muted">Choose the card used for your next renewal.</p></div>`,
        code: `import { Card } from '@/components/ui/card';

<Card>
  <Card.Header>
    <Card.Title>Payment method</Card.Title>
    <Card.Subtitle>Choose a saved card.</Card.Subtitle>
  </Card.Header>
  <Card.Body>{children}</Card.Body>
</Card>`,
      },
      {
        title: 'Raised surface',
        description: 'Use when the content needs a subtle step up.',
        preview: `<div class="demo-card raised"><span class="demo-kicker">Raised</span><h3>Wallet balance</h3><p class="muted">$12,840.00 available across three accounts.</p></div>`,
        code: `import { Card } from '@/components/ui/card';

<Card tone="raised">
  <Card.Header>
    <Card.Title>Wallet balance</Card.Title>
    <Card.Subtitle>$12,840.00 available</Card.Subtitle>
  </Card.Header>
</Card>`,
      },
      {
        title: 'With footer actions',
        description: 'Compose buttons or links in the footer slot.',
        preview: `<div class="demo-card floating"><span class="demo-kicker">Floating</span><h3>Confirm payout</h3><p class="muted">Send settlement to the selected bank account.</p><div class="preview-stack"><button class="demo-button">Confirm</button><button class="demo-button outline">Cancel</button></div></div>`,
        code: `import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

<Card tone="floating">
  <Card.Header>
    <Card.Title>Confirm payout</Card.Title>
  </Card.Header>
  <Card.Body>{details}</Card.Body>
  <Card.Footer>
    <Button label="Cancel" tone="neutral" appearance="outline" />
    <Button label="Confirm" />
  </Card.Footer>
</Card>`,
      },
    ];
  }

  return [
    {
      title: 'Tone and appearance',
      description: 'Compose tone and appearance instead of memorizing variant names.',
      preview: `<div class="button-demo-matrix compact"><button class="demo-button">Primary</button><button class="demo-button soft">Soft</button><button class="demo-button ghost">Ghost</button><button class="demo-button outline">Outline</button><button class="demo-button danger">Danger</button><button class="demo-button danger outline">Danger outline</button></div>`,
      code: `import { Button } from '@/components/ui/button';

<Button label="Continue" tone="primary" appearance="solid" />
<Button label="Learn more" tone="primary" appearance="ghost" />
<Button label="Delete" tone="danger" appearance="outline" />`,
    },
    {
      title: 'Sizes',
      description: 'Use size for density and hierarchy.',
      preview: `<div class="preview-stack"><button class="demo-button sm">Small</button><button class="demo-button">Medium</button><button class="demo-button lg">Large</button></div>`,
      code: `import { Button } from '@/components/ui/button';

<Button label="Small" size="sm" />
<Button label="Medium" size="md" />
<Button label="Large" size="lg" />`,
    },
    {
      title: 'Icon-only and loading',
      description: 'Keep labels for accessibility even when the button only renders an icon.',
      preview: `<div class="preview-stack"><button class="demo-button icon-only">+</button><button class="demo-button loading">Loading</button><button class="demo-button" disabled>Disabled</button></div>`,
      code: `import { Button } from '@/components/ui/button';

<Button label="Add item" iconOnly leadingIcon={<PlusIcon />} />
<Button label="Saving" loading />
<Button label="Continue" disabled />`,
    },
  ];
}

function renderComponentExamples(name) {
  const examples = componentExamples(name);
  return `
    ${examples
      .map(
        (example) => `
          <section class="example-section">
            <div class="example-section-header">
              <h2>${example.title}</h2>
              <p>${example.description}</p>
            </div>
            <div class="preview-code-card">
              <div class="preview-pane">
                <div class="pane-label">Preview</div>
                <div class="preview-stage">${example.preview}</div>
              </div>
              <div class="code-pane">
                <div class="code-pane-header">
                  <span>Code</span>
                  <button class="copy-button secondary" type="button" data-copy="${escapeAttr(example.code)}">Copy</button>
                </div>
                <pre><code>${escapeHtml(example.code)}</code></pre>
              </div>
            </div>
          </section>
        `,
      )
      .join('')}
  `;
}

function renderUsageSnippet(name) {
  if (name === 'input') {
    return `import { Input, InputAction } from '@/components/ui/input';

<Input label="Email" placeholder="Email" leadingIcon={<MailIcon />} />
<Input insetLabel label="Username" defaultValue="@allanthomas" errorText="Username taken" />
<Input
  secureTextEntry
  trailingAction={<InputAction accessibilityLabel="Show password"><EyeOffIcon /></InputAction>}
/>`;
  }

  if (name === 'card') {
    return `import { Card } from '@/components/ui/card';

<Card tone="raised">
  <Card.Header>
    <Card.Title>Payment method</Card.Title>
    <Card.Subtitle>Choose a saved card.</Card.Subtitle>
  </Card.Header>
  <Card.Body>{children}</Card.Body>
  <Card.Footer>{actions}</Card.Footer>
</Card>`;
  }

  return `import { Button } from '@/components/ui/button';

<Button label="Continue" tone="primary" appearance="solid" />
<Button label="Cancel" tone="neutral" appearance="outline" />
<Button label="Delete" tone="danger" appearance="ghost" />`;
}

function renderComponents() {
  const entries = componentEntries();
  const activeName = entries.some((entry) => entry.name === state.activeComponent)
    ? state.activeComponent
    : (entries[0]?.name ?? 'button');
  const active = componentFallbacks[activeName] ?? componentFallbacks.button;
  const files = active.files?.length ? active.files : (componentFallbacks[activeName]?.files ?? []);
  const activeFile =
    state.activeFile && files.some((file) => file.target === state.activeFile)
      ? state.activeFile
      : files[0]?.target;
  const file = files.find((item) => item.target === activeFile) ?? files[0];
  const importSnippet = `import { ${active.title} } from '@/components/ui/${active.name ?? activeName}';`;

  return shell(`
    <section class="component-docs hero-style-docs">
      <aside class="component-rail">
        <div class="eyebrow">Components</div>
        <div class="component-list" role="tablist" aria-label="Components">
          ${entries
            .map(
              (entry) => `
                <button class="component-list-item" role="tab" type="button" data-component="${entry.name}" aria-selected="${entry.name === activeName}">
                  <strong>${entry.title ?? entry.name}</strong>
                </button>
              `,
            )
            .join('')}
        </div>
      </aside>

      <article class="component-main">
        <div class="component-hero">
          <div>
            <h1>${active.title}</h1>
            <p class="lead">${active.description}</p>
          </div>
        </div>

        <section class="quick-doc-grid">
          <div class="quick-doc-card">
            <div class="eyebrow">Installation</div>
            <code>${active.command}</code>
            <button class="copy-button secondary" type="button" data-copy="${active.command}">Copy command</button>
          </div>
          <div class="quick-doc-card">
            <div class="eyebrow">Import</div>
            <code>${escapeHtml(importSnippet)}</code>
            <button class="copy-button secondary" type="button" data-copy="${escapeAttr(importSnippet)}">Copy import</button>
          </div>
        </section>

        ${renderComponentExamples(activeName)}

        <section class="example-section">
          <div class="example-section-header">
            <h3>Usage</h3>
            <p>A compact starting point after running the install command.</p>
          </div>
          <div class="code-pane standalone">
            <div class="code-pane-header">
              <span>Code</span>
              <button class="copy-button secondary" type="button" data-copy="${escapeAttr(renderUsageSnippet(activeName))}">Copy</button>
            </div>
            <pre><code>${escapeHtml(renderUsageSnippet(activeName))}</code></pre>
          </div>
        </section>

        <section class="example-section">
          <div class="example-section-header">
            <h3>Source</h3>
            <p>These are the files copied into the consumer project.</p>
          </div>
          <div class="source-card">
            <div class="code-pane-header">
            <div>
              <p class="muted">Files copied by ${active.command}</p>
            </div>
            <select class="search" data-file-select aria-label="Component file">
              ${files.map((item) => `<option value="${item.target}" ${item.target === activeFile ? 'selected' : ''}>${item.target}</option>`).join('')}
            </select>
            <button class="copy-button secondary" type="button" data-copy-file>Copy code</button>
            </div>
            <pre><code>${escapeHtml(file?.content ?? 'Run pnpm registry:build to generate registry JSON.')}</code></pre>
          </div>
        </section>
      </article>
    </section>
  `);
}

function filteredIcons() {
  const prefix = state.iconTab === 'solid' ? 'solid-' : 'outline-';
  const q = state.iconQuery.trim().toLowerCase();
  return state.icons
    .filter((name) => name.startsWith(prefix))
    .filter(
      (name) =>
        !q || name.toLowerCase().includes(q) || stripWeightPrefix(name).toLowerCase().includes(q),
    );
}

function renderIcons() {
  const icons = filteredIcons();
  return shell(`
    <section class="section icon-browser">
      <div class="icon-browser-inner">
        <div class="eyebrow">Icons</div>
        <div class="toolbar">
          <div>
            <h1>Click, inspect, copy.</h1>
            <p class="lead">Raw SVG copy and React Native usage snippets are handled by browser-native clipboard APIs.</p>
          </div>
        </div>
        <div class="toolbar">
          <div class="tabs" role="tablist" aria-label="Icon style">
            <button class="tab" type="button" data-icon-tab="outline" aria-selected="${state.iconTab === 'outline'}">Outline</button>
            <button class="tab" type="button" data-icon-tab="solid" aria-selected="${state.iconTab === 'solid'}">Filled</button>
          </div>
          <input class="search" data-icon-search value="${escapeAttr(state.iconQuery)}" placeholder="Search icons" />
        </div>
        <p class="muted">${icons.length} icons ${state.iconQuery ? `matching "${escapeHtml(state.iconQuery)}"` : ''}</p>
        <div class="icon-grid" style="margin-top: 16px">
          ${icons
            .map(
              (name) => `
                <button class="icon-card" type="button" data-icon="${name}">
                  <img src="/arloui-icons/${name}.svg" alt="" loading="lazy" />
                  <span class="icon-name">${stripWeightPrefix(name)}</span>
                </button>
              `,
            )
            .join('')}
        </div>
      </div>
    </section>
    ${state.activeIcon ? renderIconModal(state.activeIcon) : ''}
  `);
}

function renderIconModal(name) {
  return `
    <div class="modal-backdrop" data-close-modal>
      <section class="modal icon-modal" role="dialog" aria-modal="true" aria-label="${stripWeightPrefix(name)}" data-modal>
        <div class="modal-titlebar">
          <div>
            <div class="eyebrow">Icon</div>
            <h2>${stripWeightPrefix(name)}</h2>
          </div>
          <button class="icon-close-button" type="button" data-close-modal aria-label="Close icon details">
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div class="modal-preview"><img src="/arloui-icons/${name}.svg" alt="" /></div>
        <div class="modal-actions">
          <button class="copy-button" type="button" data-copy-svg="${name}">Copy SVG</button>
          <button class="copy-button secondary" type="button" data-copy="${escapeAttr(iconUsage(name))}">Copy React Native usage</button>
        </div>
      </section>
    </div>
  `;
}

function renderInstall() {
  return shell(`
    ${hero()}
    <section class="section">
      <div class="eyebrow">Install</div>
      <h2>Consumer flow</h2>
      <p class="lead">The CLI writes tokens, theme provider, and component source into the user's app. Icons stay as a small package.</p>
      <div class="component-layout">
        <div class="panel">
          <div class="panel-header">
            <h3>Start</h3>
            <button class="copy-button secondary" type="button" data-copy="npx arloui init&#10;npx arloui add button card">Copy</button>
          </div>
          <pre><code>npx arloui init
npx arloui add button card</code></pre>
        </div>
        <div class="panel">
          <div class="panel-header">
            <h3>Icons</h3>
            <button class="copy-button secondary" type="button" data-copy="pnpm add @arloui/icons react-native-svg">Copy</button>
          </div>
          <pre><code>pnpm add @arloui/icons react-native-svg</code></pre>
        </div>
      </div>
    </section>
  `);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("'", '&#39;');
}

async function render() {
  if (state.route === 'icons') app.innerHTML = renderIcons();
  else if (state.route === 'install') app.innerHTML = renderInstall();
  else {
    await ensureComponentFile(state.activeComponent);
    app.innerHTML = renderComponents();
  }
  bindEvents();
}

function bindEvents() {
  app.querySelectorAll('[data-route]').forEach((button) => {
    button.addEventListener('click', () => setRoute(button.dataset.route));
  });

  app.querySelectorAll('[data-component]').forEach((button) => {
    button.addEventListener('click', async () => {
      state.activeComponent = button.dataset.component;
      state.activeFile = null;
      await ensureComponentFile(state.activeComponent);
      render();
    });
  });

  app.querySelector('[data-file-select]')?.addEventListener('change', (event) => {
    state.activeFile = event.target.value;
    render();
  });

  app.querySelector('[data-copy-file]')?.addEventListener('click', () => {
    const active = componentFallbacks[state.activeComponent] ?? componentFallbacks.button;
    const file = active.files.find((item) => item.target === state.activeFile) ?? active.files[0];
    copyText(file?.content ?? '', 'Code copied');
  });

  app.querySelectorAll('[data-copy]').forEach((button) => {
    button.addEventListener('click', () => copyText(button.dataset.copy, 'Copied'));
  });

  app.querySelectorAll('[data-icon-tab]').forEach((button) => {
    button.addEventListener('click', () => {
      state.iconTab = button.dataset.iconTab;
      state.activeIcon = null;
      render();
    });
  });

  app.querySelector('[data-icon-search]')?.addEventListener('input', (event) => {
    const cursor = event.target.selectionStart ?? event.target.value.length;
    state.iconQuery = event.target.value;
    render();
    const search = app.querySelector('[data-icon-search]');
    search?.focus();
    search?.setSelectionRange?.(cursor, cursor);
  });

  app.querySelectorAll('[data-icon]').forEach((button) => {
    button.addEventListener('click', () => {
      state.activeIcon = button.dataset.icon;
      render();
    });
  });

  app.querySelectorAll('[data-close-modal]').forEach((node) => {
    node.addEventListener('click', (event) => {
      if (event.target.closest('[data-modal]') && !event.target.matches('[data-close-modal]'))
        return;
      state.activeIcon = null;
      render();
    });
  });

  app.querySelectorAll('[data-copy-svg]').forEach((button) => {
    button.addEventListener('click', () => copySvg(button.dataset.copySvg));
  });
}

window.addEventListener('hashchange', () => {
  state.route = location.hash.replace('#', '') || 'components';
  render();
});

await loadData();
await ensureComponentFile(state.activeComponent);
render();
