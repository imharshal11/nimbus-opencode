"use client";

import { useState, useMemo } from "react";
import { WeatherResponse } from "@/lib/types";

interface ResponseInspectorProps {
  data: WeatherResponse;
  isOpen: boolean;
  onToggle: () => void;
}

export function ResponseInspector({ data, isOpen, onToggle }: ResponseInspectorProps) {
  const [activeTab, setActiveTab] = useState<"raw" | "formatted">("raw");

  const formattedJson = useMemo(() => JSON.stringify(data, null, 2), [data]);
  const rawJson = useMemo(() => JSON.stringify(data), [data]);

  return (
    <details className="rounded-panel overflow-hidden" open={isOpen}>
      <summary
        onClick={(e) => {
          e.preventDefault();
          onToggle();
        }}
        className="flex items-center justify-between px-4 py-3 cursor-pointer list-none bg-white/[0.04] border border-white/10"
        aria-expanded={isOpen}
      >
        <span className="text-inspector-trigger opacity-45">Response inspector</span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={`text-white/40 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path d="M5 8l5 5 5-5" />
        </svg>
      </summary>

      {isOpen && (
        <div className="p-4 bg-white/[0.04] border-t border-white/10">
          <div role="tablist" className="flex border-b border-white/10 mb-4" aria-label="Response format">
            <button
              role="tab"
              aria-selected={activeTab === "raw"}
              aria-controls="raw-panel"
              id="raw-tab"
              onClick={() => setActiveTab("raw")}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === "raw"
                  ? "border-[var(--accent-current)] text-[var(--accent-current)]"
                  : "border-transparent text-white/50 hover:text-white/70"
              }`}
            >
              Raw
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "formatted"}
              aria-controls="formatted-panel"
              id="formatted-tab"
              onClick={() => setActiveTab("formatted")}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === "formatted"
                  ? "border-[var(--accent-current)] text-[var(--accent-current)]"
                  : "border-transparent text-white/50 hover:text-white/70"
              }`}
            >
              Formatted
            </button>
          </div>

          <div role="tabpanel" id="raw-panel" aria-labelledby="raw-tab" hidden={activeTab !== "raw"}>
            <pre className="bg-white/[0.02] text-white/90 text-inspector-code p-4 rounded-panel overflow-x-auto max-h-96 border border-white/5">
              <code>{rawJson}</code>
            </pre>
          </div>

          <div role="tabpanel" id="formatted-panel" aria-labelledby="formatted-tab" hidden={activeTab !== "formatted"}>
            <pre className="bg-white/[0.02] text-white/90 text-inspector-code p-4 rounded-panel overflow-x-auto max-h-96 border border-white/5">
              <code>{formattedJson}</code>
            </pre>
          </div>

          <p className="mt-3 text-[11px] text-white/40 italic">
            No credentials are present in this response.
          </p>
        </div>
      )}
    </details>
  );
}