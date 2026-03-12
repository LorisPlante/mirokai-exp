"use client";

import { useMemo, useState } from "react";
import { PuzzleGame } from "@/components/Games/PuzzleGame";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/providers/UserProvider";

type Difficulty = "easy" | "medium" | "hard";

const difficultyConfig: Record<Difficulty, { rows: number; cols: number }> = {
  easy: { rows: 3, cols: 2 },
  medium: { rows: 5, cols: 3 },
  hard: { rows: 7, cols: 4 },
};

const MirokaiLingoPage = () => {
  const [gameContent, setGameContent] = useState<number>(1);
  const router = useRouter();
  const { refreshUser } = useUser();
  const getGameContent = () => {
    switch(gameContent) {
        case 1:
            return "On va apprendre la langue des Mirokai !";
        case 2:
            return "Répète après moi.";
        case 3:
            return "Bravo ! Ça veut dire bonjour.";
        default:
            return "On va apprendre la langue des Mirokai !";
    }
  }
  
  const handleNextGame = async () => {
    try {
      const res = await fetch("/api/update-level", {
        method: "POST",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.error) {
        console.error("Erreur lors de la mise à jour du niveau :", data.error);
        return;
      }

      await refreshUser();
      router.push("/jeux");
    } catch (error) {
      console.error("Erreur réseau lors de la mise à jour du niveau :", error);
    }
  }

  return (
    <div className="min-h-screen w-screen bg-[#0B1C5A]">
        <div className="relative w-screen h-screen flex flex-col gap-12 items-center justify-start pt-16 bg-[url('/medias/img/Etoiles1.png')] bg-cover bg-no-repeat bg-center">
            <Image src="/medias/img/Logo-mirokai-exp-dark.png" alt="Mirokaï" width={600} height={100} className="w-[120px] h-auto"/>
            <img src="/medias/img/personnage.png" alt="Logo" className="w-full h-auto" />
            <div onClick={() => gameContent < 3 ? setGameContent(gameContent + 1) : handleNextGame()} className="absolute bottom-0 left-0 right-0 bg-noir h-[30vh] flex items-center justify-center px-8 rounded-t-[20px]">
                <p className="text-white text-center text-[30px] font-bold leading-[110%] font-espeak">{getGameContent()}</p>
            </div>
      </div>
    </div>
  );
};

export default MirokaiLingoPage;