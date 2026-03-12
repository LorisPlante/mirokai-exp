"use client";
import { useState } from "react";
import Arrow from "@/components/UI/Arrow";
import Check from "@/components/UI/Check";
import Image from "next/image";
import Button from "@/components/UI/Button";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/providers/UserProvider";

const QuizzPage = () => {
    const [currentQuestion, setCurrentQuestion] = useState<number | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [validated, setValidated] = useState<boolean>(false);
    const router = useRouter();
    const { refreshUser } = useUser();
    const quizzQuestions = [
        {
            id: 1,
            question: "Comment s’appelle la planète où vit les Mirokai ?",
            answers: [
                "Nimira",
                "Mars",
                "La planète pizza",
                "La Terre"
            ],
            correctAnswer: "Nimira"
        },
        ]
    const handleAnswerSelect = (answer: string) => {
        setSelectedAnswer(answer);
        setValidated(false);
    };

    const handleValidate = () => {
        if (currentQuestion === null) return;
        if (!selectedAnswer) return;
        setValidated(true);
    };

    const handleNextQuestion = () => {
        if (currentQuestion === null) {
            // On passe de l'écran d'intro à la première question
            setCurrentQuestion(0);
            setSelectedAnswer(null);
            setValidated(false);
        } else if (currentQuestion < quizzQuestions.length - 1) {
            // Question suivante
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setValidated(false);
        }
        // Si on est sur la dernière question, on ne fait rien pour l'instant
    };

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
    };

    return (
        <div className="min-h-screen w-screen text-white bg-[#0B1C5A]">
            <div className="relative w-screen h-screen flex flex-col gap-8 items-center justify-start pt-16 bg-[url('/medias/img/Etoiles1.png')] bg-cover bg-no-repeat bg-center">
            <Image src="/medias/img/Logo-mirokai-exp-dark.png" alt="Mirokaï" width={600} height={100} className="w-[120px] h-auto"/>
            {currentQuestion === null && (
                <>
                <div className="flex flex-col gap-4 items-center justify-center bg-blanc text-noir rounded-3xl w-[300px] px-3 py-6 text-center text-[20px] font-bold leading-[110%] font-espeak">
                    <p className="text-center text-[17px] leading-[110%] font-espeak">C'est l'heure du quizz !</p>
                </div>
                <Image src="/medias/img/e100_s040_poster__compo__w001_1.png" alt="Quizz" width={600} height={300} className="w-[400px] h-auto"/>
            </>
            )}
            {currentQuestion !== null && !validated && currentQuestion < quizzQuestions.length && (
                <>
                    <div className="flex flex-col gap-4 items-center justify-center bg-blanc text-noir rounded-3xl w-[300px] px-3 py-6 text-center text-[20px] font-bold leading-[110%] font-espeak">
                        <p className="text-center text-[17px] leading-[110%] font-espeak">Question {currentQuestion + 1}</p>
                        <h1 className="text-center text-[20px] font-bold leading-[110%] font-espeak">{quizzQuestions[currentQuestion].question}</h1>
                    </div>
                    <div className="flex flex-col gap-4 items-center justify-center">
                    {quizzQuestions[currentQuestion].answers.map((answer) => (
                            <div key={answer} onClick={() => handleAnswerSelect(answer)} className={`text-noir ${selectedAnswer === answer ? "bg-vert" : "bg-blanc"} rounded-[100px] w-[300px] p-3 text-center text-[20px] font-bold leading-[110%] font-espeak`}>{answer}</div>
                        ))}
                        {/* Valider la réponse */}
                        <button onClick={handleValidate} className="p-3 flex items-center justify-center bg-vert rounded-full self-end">
                            <Check color="fill-white" />
                        </button>
                        <Image src="/medias/img/e100_s040_poster__compo__miroki_w003_8.png" alt="Quizz" width={600} height={300} className="absolute bottom-0 left-0 w-50"/>
                    </div>
                </>
            )}
            {currentQuestion === null && (
                <button onClick={handleNextQuestion} className="absolute bottom-8 right-6 rounded-full bg-white/20 p-3 backdrop-blur">
                    <Arrow direction="right" color="stroke-white" />
                </button>
            )}
            {currentQuestion !== null &&
             currentQuestion < quizzQuestions.length &&
             validated &&
             quizzQuestions[currentQuestion].correctAnswer === selectedAnswer && (
                <div className="flex flex-col gap-4 items-center justify-center bg-blanc text-noir rounded-3xl w-[300px] px-3 py-6 text-center">
                    <Image src="/medias/img/Bonne_reponse.png" alt="Quizz" width={600} height={300} className="w-25 h-auto"/>
                    <p className="text-center text-[17px] font-bold leading-[110%] font-espeak">Bonne réponse</p>
                    <p className="text-center text-[17px] font-normal leading-[110%] font-espeak">Les Mirokaï vivent sur Nimira, une planète où circule le Mirium, une énergie née des rêves et de l’imagination.</p>
                    <Button variant="secondary" onClick={handleNextGame}>Niveau suivant</Button>
                </div>
            )}
        </div>
        </div>
    )
}

export default QuizzPage;