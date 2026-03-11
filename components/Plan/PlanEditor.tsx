"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { PLAN_HEIGHT, PLAN_WIDTH } from "@/lib/planDefaults";
import type { PlanModulePosition } from "./PlanView";
import Button from "@/components/UI/Button";

type DragState =
  | null
  | {
      key: string;
      offsetX: number;
      offsetY: number;
    };

export function PlanEditor({
  initialModules,
}: {
  initialModules: PlanModulePosition[];
}) {
  const planRef = useRef<HTMLDivElement>(null);
  const didInitFromPropsRef = useRef(false);
  const safeInitialModules = Array.isArray(initialModules) ? initialModules : [];
  const [modules, setModules] = useState<PlanModulePosition[]>(
    safeInitialModules
  );
  const [drag, setDrag] = useState<DragState>(null);
  const [saving, setSaving] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(
    initialModules[0]?.key ?? null
  );

  const [newKey, setNewKey] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);

  const modulesByKey = useMemo(() => {
    const map = new Map<string, PlanModulePosition>();
    for (const m of modules) map.set(m.key, m);
    return map;
  }, [modules]);

  const selected = selectedKey ? modulesByKey.get(selectedKey) ?? null : null;

  // Hydrate le state interne une seule fois quand le parent charge les modules en async
  useEffect(() => {
    if (didInitFromPropsRef.current) return;
    if (!Array.isArray(initialModules) || initialModules.length === 0) {
        console.log("initialModules is not an array or is empty");
        return;
    }

    setModules(initialModules);
    setSelectedKey(initialModules[0]?.key ?? null);
    didInitFromPropsRef.current = true;
    console.log("initialModules", initialModules);
  }, [initialModules]);

  useEffect(() => {
    if (selectedKey && modulesByKey.has(selectedKey)) return;
    setSelectedKey(modules[0]?.key ?? null);
  }, [modules, modulesByKey, selectedKey]);

  const onPointerDownModule = (
    e: React.PointerEvent<HTMLDivElement>,
    key: string
  ) => {
    const plan = planRef.current;
    if (!plan) return;
    const module = modulesByKey.get(key);
    if (!module) return;

    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    setDrag({
      key,
      offsetX: e.clientX - (plan.getBoundingClientRect().left + module.x),
      offsetY: e.clientY - (plan.getBoundingClientRect().top + module.y),
    });
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag) return;
    const plan = planRef.current;
    if (!plan) return;
    const rect = plan.getBoundingClientRect();

    const nextX = e.clientX - rect.left - drag.offsetX;
    const nextY = e.clientY - rect.top - drag.offsetY;

    setModules((prev) =>
      prev.map((m) =>
        m.key === drag.key
          ? {
              ...m,
              x: Math.max(0, Math.min(PLAN_WIDTH - 1, Math.round(nextX))),
              y: Math.max(0, Math.min(PLAN_HEIGHT - 1, Math.round(nextY))),
            }
          : m
      )
    );
  };

  const onPointerUp = () => {
    setDrag(null);
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/plan-modules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modules: modules.map((m) => ({
            key: m.key,
            label: m.label,
            description: m.description,
            x: m.x,
            y: m.y,
          })),
        }),
      });
      if (!res.ok) {
        console.error(await res.text());
      }
    } finally {
      setSaving(false);
    }
  };

  const createModule = async () => {
    const key = newKey.trim();
    const label = newLabel.trim();
    const description = newDescription.trim();
    if (!key || !label || !description) return;

    setCreating(true);
    try {
      const res = await fetch("/api/admin/plan-modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, label, description, x: 40, y: 40 }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error(data);
        return;
      }
      const created = data.module as PlanModulePosition;
      setModules((prev) => [...prev, created]);
      setSelectedKey(created.key);
      setNewKey("");
      setNewLabel("");
      setNewDescription("");
    } finally {
      setCreating(false);
    }
  };

  const updateSelected = async (patch: {
    label?: string;
    description?: string;
  }) => {
    if (!selected) return;
    const next = {
      ...selected,
      ...(typeof patch.label === "string" ? { label: patch.label } : {}),
      ...(typeof patch.description === "string"
        ? { description: patch.description }
        : {}),
    };
    setModules((prev) => prev.map((m) => (m.key === next.key ? next : m)));
  };

  const deleteModule = async (key: string) => {
    setDeletingKey(key);
    try {
      const res = await fetch(`/api/admin/plan-modules?key=${encodeURIComponent(key)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        console.error(await res.text());
        return;
      }
      setModules((prev) => prev.filter((m) => m.key !== key));
      if (selectedKey === key) {
        setSelectedKey(null);
      }
    } finally {
      setDeletingKey(null);
    }
  };

  return (
    <div className="flex flex-col">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-3">
        <div className="text-sm text-zinc-700">
          Drag & drop les modules puis sauvegarde.
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={save} size="fit">
            {saving ? "Sauvegarde..." : "Sauvegarder"}
          </Button>
        </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 p-4">
      <div className="w-full sm:w-80 h-auto sm:h-[calc(100vh-100px)] overflow-auto shrink-0 rounded-xl border border-zinc-200 bg-white p-4">
          <div className="mb-3 text-sm font-medium text-zinc-900">
            Modules
          </div>

          <div className="mb-4 space-y-2 max-h-60 overflow-y-auto border border-tertiary rounded-md p-2">
            {modules.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => setSelectedKey(m.key)}
                className={`w-full rounded-md border px-3 py-2 text-left text-sm ${
                  selectedKey === m.key
                    ? "border-zinc-900 bg-zinc-50"
                    : "border-zinc-200 hover:bg-zinc-50"
                }`}
              >
                <div className="font-medium text-zinc-900">{m.label}</div>
                <div className="text-xs text-zinc-500">{m.key}</div>
              </button>
            ))}
          </div>

          <div className="border-t border-zinc-200 pt-4">
            <div className="mb-2 text-sm font-medium text-zinc-900">
              Éditer le module
            </div>
            {!selected ? (
              <div className="text-sm text-zinc-500">Aucun module sélectionné</div>
            ) : (
              <div className="space-y-2">
                <div className="text-xs text-zinc-500">Key: {selected.key}</div>
                <input
                  value={selected.label}
                  onChange={(e) =>
                    updateSelected({ label: e.target.value })
                  }
                  className="w-full rounded-md px-3 py-2 text-sm ring-1 ring-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                />
                <textarea
                  value={selected.description}
                  onChange={(e) =>
                    updateSelected({ description: e.target.value })
                  }
                  className="w-full resize-none rounded-md px-3 py-2 text-sm ring-1 ring-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                  rows={3}
                />
                <Button
                  variant="secondary"
                  size="full"
                  onClick={() => deleteModule(selected.key)}
                >
                  {deletingKey === selected.key ? "Suppression..." : "Supprimer"}
                </Button>
              </div>
            )}
          </div>

          <div className="mb-4 border-t border-zinc-200 pt-4">
            <div className="mb-2 text-sm font-medium text-zinc-900">
              Créer un module
            </div>
            <div className="space-y-2">
              <input
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="key (ex: module-12)"
                className="w-full rounded-md px-3 py-2 text-sm ring-1 ring-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500"
              />
              <input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="label"
                className="w-full rounded-md px-3 py-2 text-sm ring-1 ring-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500"
              />
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="description"
                className="w-full resize-none rounded-md px-3 py-2 text-sm ring-1 ring-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                rows={3}
              />
              <Button
                variant="primary"
                size="full"
                onClick={createModule}
              >
                {creating ? "Création..." : "Créer"}
              </Button>
            </div>
          </div>

          
        </div>
        
    <div className="w-full sm:w-[calc(100%-320px)] h-[calc(100vh-100px)] overflow-auto bg-background border border-primary rounded-xl p-4">
      <div
          ref={planRef}
          className="relative rounded-xl bg-white shadow"
          style={{ width: PLAN_WIDTH, height: PLAN_HEIGHT, touchAction: "none" }}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="absolute inset-0 rounded-xl border border-zinc-200" />

          {modules.map((m) => (
            <div
              key={m.key}
              className="absolute cursor-move select-none rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 shadow-sm active:opacity-80"
              style={{ left: m.x, top: m.y }}
              onPointerDown={(e) => onPointerDownModule(e, m.key)}
              onClick={() => setSelectedKey(m.key)}
            >
              <div className="font-medium">{m.label}</div>
              <div className="text-xs text-zinc-600">{m.description}</div>
              <div className="mt-1 text-[10px] text-zinc-500">
                x:{m.x} y:{m.y}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
}

