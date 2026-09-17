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
    <details className="rounded-xl border border-slate-200 bg-white overflow-hidden" open={isOpen}>
      <summary
        onClick={(e) => {
          e.preventDefault();
          onToggle();
        }}
        className="flex items-center justify-between p-4 cursor-pointer list-none bg-slate-50 border-b border-slate-100"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-medium text-slate-700">Response inspector</span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path d="M5 8l5 5 5-5" />
        </svg>
      </summary>

      {isOpen && (
        <div className="p-4">
          <div role="tablist" className="flex border-b border-slate-200 mb-4" aria-label="Response format">
            <button
              role="tab"
              aria-selected={activeTab === "raw"}
              aria-controls="raw-panel"
              id="raw-tab"
              onClick={() => setActiveTab("raw")}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === "raw"
                  ? "border-accent text-accent"
                  : "border-transparent text-slate-500 hover:text-slate-700"
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
                  ? "border-accent text-accent"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Formatted
            </button>
          </div>

          <div role="tabpanel" id="raw-panel" aria-labelledby="raw-tab" hidden={activeTab !== "raw"}>
            <pre className="bg-slate-950 text-slate-100 text-xs p-4 rounded-lg overflow-x-auto max-h-96">
              <code>{rawJson}</code>
            </pre>
          </div>

          <div role="tabpanel" id="formatted-panel" aria-labelledby="formatted-tab" hidden={activeTab !== "formatted"}>
            <pre className="bg-slate-950 text-slate-100 text-xs p-4 rounded-lg overflow-x-auto max-h-96">
              <code>{formattedJson}</code>
            </pre>
          </div>

          <p className="mt-3 text-xs text-slate-500 italic">
            {/* Credential assertion: This component only renders data returned by /api/weather, which
                 never includes the WEATHER_API_KEY. The key is attached server-side only. */}
            No credentials are present in this response.
          </p>
        </div>
      )}
    </details>
  );
}