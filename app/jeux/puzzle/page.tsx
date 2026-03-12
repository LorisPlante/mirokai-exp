"use client";

import { useMemo, useState } from "react";
import { PuzzleGame } from "@/components/Games/PuzzleGame";

type Difficulty = "easy" | "medium" | "hard";

const difficultyConfig: Record<Difficulty, { rows: number; cols: number }> = {
  easy: { rows: 3, cols: 2 },
  medium: { rows: 5, cols: 3 },
  hard: { rows: 7, cols: 4 },
};

const PUZZLE_IMAGES = [
  "/medias/img/puzzle/puzzle1.png",
  "/medias/img/puzzle/puzzle2.png",
  "/medias/img/puzzle/puzzle3.png",
  "/medias/img/puzzle/puzzle4.png",
];

const PuzzlePage = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  // On choisit l'image en fonction de la difficulté (et on la re-randomise quand elle change)
  const imageSrc = useMemo(() => {
    const idx = Math.floor(Math.random() * PUZZLE_IMAGES.length);
    return PUZZLE_IMAGES[idx];
  }, [difficulty]);

  const { rows, cols } = difficultyConfig[difficulty];

  return (
    <div className="min-h-screen w-screen bg-[#0B1C5A] py-10">
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 px-4 pb-6 text-white">
        <h1 className="text-2xl font-semibold">Choisis ta difficulté</h1>
        <div className="flex w-full justify-center gap-3">
          <button
            type="button"
            onClick={() => setDifficulty("easy")}
            className={`rounded-full px-4 py-2 text-sm ${
              difficulty === "easy"
                ? "bg-white text-[#0B1C5A]"
                : "bg-white/10 text-white"
            }`}
          >
            Facile (2×3)
          </button>
          <button
            type="button"
            onClick={() => setDifficulty("medium")}
            className={`rounded-full px-4 py-2 text-sm ${
              difficulty === "medium"
                ? "bg-white text-[#0B1C5A]"
                : "bg-white/10 text-white"
            }`}
          >
            Moyen (3×5)
          </button>
          <button
            type="button"
            onClick={() => setDifficulty("hard")}
            className={`rounded-full px-4 py-2 text-sm ${
              difficulty === "hard"
                ? "bg-white text-[#0B1C5A]"
                : "bg-white/10 text-white"
            }`}
          >
            Difficile (4×7)
          </button>
        </div>
      </div>

      <PuzzleGame imageSrc={imageSrc} rows={rows} cols={cols} />
    </div>
  );
};

export default PuzzlePage;