"use client";

import { PLAN_HEIGHT, PLAN_WIDTH } from "@/lib/planDefaults";

export type PlanModulePosition = {
  key: string;
  label: string;
  description: string;
  x: number;
  y: number;
};

export function PlanView({ modules }: { modules: PlanModulePosition[] }) {
  return (
    <div className="w-full h-[calc(100vh-150px)] overflow-auto bg-background border border-primary rounded-xl mt-4 p-4">
      <div
        className="relative"
        style={{ width: PLAN_WIDTH, height: PLAN_HEIGHT }}
      >
        <div className="absolute" />

        {modules.map((m) => (
          <div
            key={m.key}
            className="absolute flex flex-col max-w-50 select-none rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 shadow-sm"
            style={{ left: m.x, top: m.y }}
          >
            <span className="font-medium">{m.label}</span>
            <span className="text-xs text-zinc-500">{m.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

