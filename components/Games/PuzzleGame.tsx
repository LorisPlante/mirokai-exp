"use client";

import React, { useEffect, useState } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Tile = {
  id: string; // string pour dnd-kit
  correctIndex: number;
};

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function SortableTile({
  tile,
  idx,
  rows,
  cols,
  imageSrc,
  solved,
}: {
  tile: Tile;
  idx: number;
  rows: number;
  cols: number;
  imageSrc: string;
  solved: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tile.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundImage: `url(${imageSrc})`,
    backgroundSize: `${cols * 100}% ${rows * 100}%`,
    backgroundRepeat: "no-repeat",
  };

  const correct = tile.correctIndex;
  const r = Math.floor(correct / cols);
  const c = correct % cols;
  style.backgroundPosition = `${(c / (cols - 1 || 1)) * 100}% ${
    (r / (rows - 1 || 1)) * 100
  }%`;

  return (
    <button
      type="button"
      ref={setNodeRef}
      style={style}
      className={`relative border border-white/10 transition ${
        solved
          ? "opacity-95"
          : isDragging
          ? "z-10 scale-105 ring-2 ring-white"
          : "hover:border-white/40"
      }`}
      aria-label={`Pièce ${idx + 1}`}
      {...attributes}
      {...listeners}
    />
  );
}

export function PuzzleGame({
  imageSrc,
  rows = 5,
  cols = 3,
}: {
  imageSrc: string;
  rows?: number;
  cols?: number;
}) {
  const total = rows * cols;
  const [tiles, setTiles] = useState<Tile[]>([]);

  useEffect(() => {
    const initial: Tile[] = Array.from({ length: total }).map((_, i) => ({
      id: String(i + 1),
      correctIndex: i,
    }));
    let shuffled = shuffle(initial);
    if (
      shuffled.every((t, idx) => t.correctIndex === idx) &&
      shuffled.length > 1
    ) {
      shuffled = [shuffled[1], shuffled[0], ...shuffled.slice(2)];
    }
    setTiles(shuffled);
  }, [total]);

  const solved =
    tiles.length === total &&
    tiles.every((t, idx) => t.correctIndex === idx);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setTiles((prev) => {
      const oldIndex = prev.findIndex((t) => t.id === active.id);
      const newIndex = prev.findIndex((t) => t.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="w-full max-w-md text-center text-white">
        <h1 className="text-2xl font-semibold">Puzzle</h1>
        <p className="mt-1 text-sm text-white/80">
          Glisse-dépose les pièces pour reconstituer l’image.
        </p>
      </div>

      <div className="w-full px-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={tiles.map((t) => t.id)}
            strategy={rectSortingStrategy}
          >
            <div
              className="relative mx-auto aspect-3/5 w-full max-w-md overflow-hidden rounded-2xl border border-white/15 bg-white/5 shadow"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gridTemplateRows: `repeat(${rows}, 1fr)`,
                touchAction: "none",
              }}
            >
              {tiles.map((tile, idx) => (
                <SortableTile
                  key={tile.id}
                  tile={tile}
                  idx={idx}
                  rows={rows}
                  cols={cols}
                  imageSrc={imageSrc}
                  solved={solved}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {solved && (
        <div className="rounded-xl bg-white/10 px-4 py-3 text-center text-white">
          <div className="text-lg font-semibold">Bravo !</div>
          <div className="text-sm text-white/80">Tu as reconstitué l’image.</div>
        </div>
      )}
    </div>
  );
}

