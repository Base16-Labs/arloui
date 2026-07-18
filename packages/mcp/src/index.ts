import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { getEntry, getIndex, getMarkdown } from './client.js';
import { componentMarkdown, pagePathFor, searchMarkdown, tokenMarkdown } from './format.js';
import { SERVER_NAME, SERVER_VERSION } from './config.js';

type Result = { content: Array<{ type: 'text'; text: string }>; isError?: boolean };
const text = (s: string): Result => ({ content: [{ type: 'text', text: s }] });
const fail = (s: string): Result => ({ content: [{ type: 'text', text: s }], isError: true });

/** Run a tool body, turning fetch/parse errors into a readable tool error. */
async function guard(fn: () => Promise<Result>): Promise<Result> {
  try {
    return await fn();
  } catch (err) {
    return fail(`Arlo UI request failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}

const notYet = (kind: string, name: string, section: string) =>
  text(
    `No ${kind} named “${name}” is published yet.\n\nBrowse what exists with \`arlo_search\`, or check ${section} on arloui.com.`,
  );

const server = new McpServer({ name: SERVER_NAME, version: SERVER_VERSION });

server.tool(
  'arlo_search',
  'Search Arlo UI across components and foundations by natural-language query. Returns a ranked list with id, kind, summary, page url and markdown (md) url. Use the returned id with arlo_get_component.',
  { query: z.string().describe('natural-language query, e.g. "bottom sheet" or "form input"'), kind: z.string().optional().describe('optional filter: primitive | foundation | pattern | icon') },
  async ({ query, kind }) =>
    guard(async () => text(searchMarkdown((await getIndex()).items, query, kind))),
);

server.tool(
  'arlo_get_component',
  'Full spec for one Arlo UI component: description, variants/props, dependencies, the design tokens it uses, and the React Native source. Pass the component id (e.g. "button", "sheet").',
  { name: z.string().describe('component id, e.g. "button"') },
  async ({ name }) =>
    guard(async () => {
      const entry = await getEntry(name).catch(() => null);
      if (!entry) return notYet('component', name, '/docs/components');
      const prose = await getMarkdown(pagePathFor(entry)).catch(() => null);
      return text(componentMarkdown(entry, prose));
    }),
);

server.tool(
  'arlo_get_archetype',
  'Spec for one of the nine Arlo UI archetypes (question, decision, status, feed, detail, creation, settings, onboarding, empty): hierarchy mapping, primitive composition, examples and gotchas.',
  { name: z.string().describe('archetype slug, e.g. "question"') },
  async ({ name }) =>
    guard(async () => {
      const md = await getMarkdown(`docs/archetypes/${name}`);
      return md ? text(md) : notYet('archetype', name, '/docs/archetypes');
    }),
);

server.tool(
  'arlo_get_token',
  'Resolve an Arlo UI semantic colour token to its light and dark values (e.g. "surfaceInput", "interactiveSecondary").',
  { path: z.string().describe('token name, e.g. "surfaceInputActive" or "colors.interactivePrimary"') },
  async ({ path }) =>
    guard(async () => {
      const tokens = await getEntry('tokens').catch(() => null);
      if (!tokens?.files[0]) return fail('Could not load the tokens entry from the registry.');
      return text(tokenMarkdown(tokens.files[0].content, path));
    }),
);

server.tool(
  'arlo_get_foundation',
  'Pull a foundation topic as markdown — spacing, type, motion, color, effects, icons, or a facet essay (craft, fluidity, opinionated, detailed, extensible).',
  { topic: z.string().describe('foundation topic, e.g. "spacing" or "fluidity"') },
  async ({ topic }) =>
    guard(async () => {
      const md =
        (await getMarkdown(`docs/primitives/${topic}`)) ?? (await getMarkdown(`docs/foundations/${topic}`));
      return md ? text(md) : notYet('foundation topic', topic, '/docs/foundations');
    }),
);

server.tool(
  'arlo_get_recipe',
  'Spec for a block/recipe (a full-screen example): composition tree, primitives used, archetype, and React Native code.',
  { name: z.string().describe('recipe slug') },
  async ({ name }) =>
    guard(async () => {
      const md = await getMarkdown(`docs/recipes/${name}`);
      return md ? text(md) : notYet('recipe', name, '/docs/recipes');
    }),
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // Never write to stdout — it is the JSON-RPC channel. Logs go to stderr.
  process.stderr.write(`arloui-mcp ${SERVER_VERSION} ready\n`);
}

main().catch((err) => {
  process.stderr.write(`arloui-mcp failed to start: ${err instanceof Error ? err.stack : String(err)}\n`);
  process.exit(1);
});
