"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const STORAGE_KEY = "arlo:shortcuts-toast-dismissed";

export function ShortcutsToast() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    setShow(true);
  }, []);

  function dismiss() {
    setShow(false);
    localStorage.setItem(STORAGE_KEY, "1");
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-full bg-ink px-[18px] py-2.5 text-[13px] text-canvas shadow-lg">
        <span>
          Press{" "}
          <kbd className="rounded bg-white/10 border border-white/15 px-1.5 py-0.5 font-mono text-[11px]">
            ⌘K
          </kbd>{" "}
          to search
        </span>
        <span className="opacity-40">·</span>
        <span>
          <kbd className="rounded bg-white/10 border border-white/15 px-1.5 py-0.5 font-mono text-[11px]">
            J K
          </kbd>{" "}
          to navigate
        </span>
        <span className="opacity-40">·</span>
        <span>
          <kbd className="rounded bg-white/10 border border-white/15 px-1.5 py-0.5 font-mono text-[11px]">
            ?
          </kbd>{" "}
          for shortcuts
        </span>
        <button onClick={dismiss} className="ml-1.5 opacity-50 hover:opacity-100">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
