# @arloui/mcp

A read-only [Model Context Protocol](https://modelcontextprotocol.io) server that
gives coding agents live access to **Arlo UI** components, design tokens, and docs.

The server holds no content of its own — every tool call resolves to a fetch of a
canonical Arlo UI URL, so an agent always sees exactly what is published on the
site. It runs locally over stdio; your agent launches it as a subprocess.

## Connect

**Claude Code**

```bash
claude mcp add arloui -- npx -y @arloui/mcp
```

**Claude Desktop** (`claude_desktop_config.json`), **Cursor** (`.cursor/mcp.json`),
or any MCP client:

```json
{
  "mcpServers": {
    "arloui": {
      "command": "npx",
      "args": ["-y", "@arloui/mcp"]
    }
  }
}
```

## Tools

| Tool | What it returns |
| --- | --- |
| `arlo_search` | Ranked components + foundations for a natural-language query |
| `arlo_get_component` | Full spec for one component: variants, deps, tokens, and RN source |
| `arlo_get_token` | A semantic colour token resolved to its light + dark values |
| `arlo_get_archetype` | One of the nine screen archetypes: hierarchy, composition, gotchas |
| `arlo_get_foundation` | A foundation topic as markdown (spacing, type, motion, color, …) |
| `arlo_get_recipe` | A block/recipe: composition tree, primitives, archetype, and code |

## Configuration

| Env var | Default | Purpose |
| --- | --- | --- |
| `ARLO_BASE_URL` | `https://arloui.com` | Site the tools fetch from |
| `ARLO_REGISTRY_URL` | `<base>/r` | Registry index + component entries |

Point these at a local site to develop against unreleased components.

## License

MIT
