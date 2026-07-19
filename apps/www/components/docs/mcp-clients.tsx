"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { CodeBlock } from "@/components/ui/CodeBlock";

const JSON_MCP_SERVERS = `{
  "mcpServers": {
    "arloui": {
      "command": "npx",
      "args": ["-y", "@arloui/mcp"]
    }
  }
}`;

// VS Code uses the "servers" key (not "mcpServers").
const JSON_SERVERS = `{
  "servers": {
    "arloui": {
      "command": "npx",
      "args": ["-y", "@arloui/mcp"]
    }
  }
}`;

const TOML_CODEX = `[mcp_servers.arloui]
command = "npx"
args = ["-y", "@arloui/mcp"]`;

type Client = {
  id: string;
  label: string;
  file: string;
  language: string;
  code: string;
  note?: string;
};

const CLIENTS: Client[] = [
  {
    id: "claude-code",
    label: "Claude Code",
    file: ".mcp.json",
    language: "json",
    code: JSON_MCP_SERVERS,
    note: "Or run: claude mcp add arloui -- npx -y @arloui/mcp",
  },
  {
    id: "cursor",
    label: "Cursor",
    file: ".cursor/mcp.json",
    language: "json",
    code: JSON_MCP_SERVERS,
  },
  {
    id: "vscode",
    label: "VS Code",
    file: ".vscode/mcp.json",
    language: "json",
    code: JSON_SERVERS,
  },
  {
    id: "codex",
    label: "Codex",
    file: "~/.codex/config.toml",
    language: "toml",
    code: TOML_CODEX,
  },
  {
    id: "claude-desktop",
    label: "Claude Desktop",
    file: "claude_desktop_config.json",
    language: "json",
    code: JSON_MCP_SERVERS,
  },
];

export function McpClientTabs() {
  const [activeId, setActiveId] = useState(CLIENTS[0].id);
  const active = CLIENTS.find((c) => c.id === activeId)!;

  return (
    <div>
      <div
        role="tablist"
        aria-label="MCP client"
        className="flex flex-wrap gap-1 border-b border-line"
      >
        {CLIENTS.map((c) => (
          <button
            key={c.id}
            role="tab"
            aria-selected={c.id === activeId}
            onClick={() => setActiveId(c.id)}
            className={cn(
              "relative -mb-px border-b-2 px-3.5 py-2 text-[14px] font-medium transition-colors",
              c.id === activeId
                ? "border-ink text-ink"
                : "border-transparent text-ink-3 hover:text-ink-2",
            )}
            style={{ transitionDuration: "var(--dur-fast)" }}
          >
            {c.label}
          </button>
        ))}
      </div>

      <p className="mt-4 mb-3 text-[15px] leading-relaxed text-ink-2">
        Add to{" "}
        <code className="rounded bg-surface-sunken px-1.5 py-0.5 font-mono text-[13px] text-ink dark:bg-surface-raised">
          {active.file}
        </code>
        :
      </p>
      <CodeBlock language={active.language}>{active.code}</CodeBlock>

      {active.note ? (
        <p className="mt-3 text-[14px] leading-relaxed text-ink-3">
          {active.note}
        </p>
      ) : null}
    </div>
  );
}
