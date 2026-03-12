"use client";

import { useMemo, useState } from "react";
import { PuzzleGame } from "@/components/Games/PuzzleGame";
import Image from "next/image";

type Difficulty = "easy" | "medium" | "hard";

const difficultyConfig: Record<Difficulty, { rows: number; cols: number }> = {
  easy: { rows: 3, cols: 2 },
  medium: { rows: 5, cols: 3 },
  hard: { rows: 7, cols: 4 },
};

const PuzzlePage = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [imageSrc, setImageSrc] = useState<string>("1");
  // On choisit l'image en fonction de la difficulté (et on la re-randomise quand elle change)
  const { rows, cols } = difficultyConfig[difficulty];

  const handleImageClick = (index: number) => {
    setImageSrc((index + 1).toString());
    setDifficulty(difficulty);
  }

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
            {`Facile (2x3)`}
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
            {`Moyen (3x5)`}
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
            {`Difficile (4x7)`}
          </button>
        </div>
        <div className="flex w-full justify-center gap-3">
{Array.from({ length: 4 }).map((_, index) => (
  <button
    type="button"
    onClick={() => handleImageClick(index)}
    className={`text-sm aspect-square overflow-hidden border border-blanc rounded-xl`}
  >
    <Image src={`/medias/img/puzzle/puzzle${index + 1}.png`} alt={`Puzzle ${index + 1}`} width={100} height={100} />
  </button>
))}
         
        </div>
      </div>

      <PuzzleGame imageSrc={`/medias/img/puzzle/puzzle${imageSrc}.png`} rows={rows} cols={cols} />
    </div>
  );
};

export default PuzzlePage;