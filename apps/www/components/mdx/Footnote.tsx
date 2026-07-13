"use client";

import { createContext, useContext, useRef } from "react";

type FootnoteEntry = {
  n: number;
  content: React.ReactNode;
};

const FootnoteContext = createContext<FootnoteEntry[]>([]);

export function FootnoteRef({ n }: { n: number }) {
  return (
    <a
      href={`#fn-${n}`}
      id={`fnref-${n}`}
      className="text-[11px] text-ink-3 align-super leading-none"
    >
      {n}
    </a>
  );
}

export function Footnotes({
  notes,
}: {
  notes: { n: number; content: React.ReactNode }[];
}) {
  if (notes.length === 0) return null;

  return (
    <div className="mt-20 max-w-[580px] border-t border-line pt-8">
      <div className="mb-4 text-[11px] font-medium uppercase tracking-[0.1em] text-ink-3">
        Notes
      </div>
      <ol className="m-0 list-none space-y-3 p-0">
        {notes.map((note) => (
          <li key={note.n} id={`fn-${note.n}`} className="grid grid-cols-[24px_1fr] gap-2">
            <span className="pt-0.5 text-[11px] text-ink-3">{note.n}.</span>
            <span className="text-sm leading-relaxed text-ink-2">
              {note.content}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
