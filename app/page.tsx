"use client";

import Image from "next/image";
import { useI18n } from "@/locales/client";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import Button from "@/components/UI/Button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/app/providers/ToastMessage";
import { useUser } from "@/app/providers/UserProvider";
import { PlanModulePosition, PlanView } from "@/components/Plan/PlanView";
import AvatarChoices from "@/components/AvatarChoices";
import Arrow from "@/components/UI/Arrow";

export default function Home() {
  const t = useI18n();
  const { showToast } = useToast();
  const { user } = useUser();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [modules, setModules] = useState<PlanModulePosition[]>([]);
  const [onBoardingStep, setOnBoardingStep] = useState<number>(1);

  const handleNextStep = () => {
    if((onBoardingStep + 1) === 4) {
      router.push("/login");
    }
    setOnBoardingStep(onBoardingStep + 1);
  }

  const handlePreviousStep = () => {
    if(onBoardingStep === 1) {
      return;
    }
    setOnBoardingStep(onBoardingStep - 1);
  }

  // Adaptation de type pour pouvoir utiliser des clés d'erreur dynamiques sans erreur de typage
  const translate = t as (key: string) => string;

  useEffect( () => {
    const loadModules = async () => {
      const res =  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/plan-modules`, {
        cache: "no-store",
      });
      const data =  await res.json();
      setModules(data.modules ?? []);
    }
    loadModules();
  }, [t]);

  const getHomePage = () => {
    return (
      <>
        {onBoardingStep === 1 && (
          <div className="w-screen h-screen bg-[#0B1C5A]">
            <div onClick={handleNextStep} className="w-screen h-screen flex flex-col items-center justify-between pt-20 px-6 bg-[url('/medias/img/Etoiles1.png')] bg-cover bg-no-repeat bg-center">
              <Image src="/medias/img/Logo_Enchanted_Tools_central.png" alt="Enchanted Tools" width={600} height={100} className="w-[100px] h-auto" />
              <Image src="/medias/img/Logo-mirokai-exp-dark.png" alt="Mirokaï" width={600} height={100} className="w-[250px] h-auto"/>
              <Image src="/medias/img/Miorka.png" alt="Miroka" width={600} height={100} className="w-[190px] h-auto"/>
            </div>
          </div>
        )}
        {onBoardingStep === 2 && (
          <div className="w-screen h-screen bg-[#0B1C5A]">
            <div className="w-screen h-screen flex flex-col gap-12 items-center justify-start pt-22 px-6 bg-[url('/medias/img/Etoiles1.png')] bg-cover bg-no-repeat bg-center">
            <Image src="/medias/img/Logo-mirokai-exp-dark.png" alt="Mirokaï" width={600} height={100} className="w-[120px] h-auto"/>
              <p className="text-white w-full text-center text-[17px] leading-[110%] font-espeak">Sur la planète Nimira vivent les <strong>Mirokaï</strong>. <br/><br/> Des êtres guidés par le <strong>Mirium</strong>, une énergie née des rêves, de l’imagination et de la créativité.</p>
              <Image src="/medias/img/e100_s040_poster__compo__miroka_w003_1.png" alt="Miroki" width={600} height={100} className="w-[190px] h-auto"/>
            </div>
          </div>
        )}
        {onBoardingStep === 3 && (
          <div className="w-screen h-screen bg-[#0B1C5A]">
            <div className="w-screen h-screen flex flex-col gap-12 items-center justify-start pt-22 px-6 bg-[url('/medias/img/Etoiles1.png')] bg-cover bg-no-repeat bg-center">
            <Image src="/medias/img/Logo-mirokai-exp-dark.png" alt="Mirokaï" width={600} height={100} className="w-[120px] h-auto"/>
              <p className="text-white w-full text-center text-[17px] leading-[110%] font-espeak">Sur notre <strong>Terre</strong>, cette énergie existe aussi.<br/><br/>À chaque fois que quelqu’un <strong>crée</strong>,  <strong>danse</strong> ou  <strong>rêve</strong>, le Mirium apparaît...<br/><br/>Et c’est là que <strong>l’aventure commence !</strong></p>
              <Image src="/medias/img/e100_s040_poster__compo__miroki_w003_2.png" alt="Miroki" width={600} height={100} className="w-[190px] h-auto"/>
            </div>
          </div>
        )}
      </>
    );
  }

  

  return (
    <div className="flex w-full min-h-screen items-start justify-start font-sans">
      <main className="flex min-h-screen w-full flex-col items-center justify-start">
        {getHomePage()}
        <div className={`absolute bottom-0 flex w-full px-6 pb-8 items-center ${onBoardingStep === 2 ? 'justify-end' : 'justify-between'}`}>
            {onBoardingStep !== 1 && onBoardingStep !== 2 && (
            <button
                type="button"
                className="rounded-full bg-white/20 p-3 backdrop-blur"
                aria-label="Précédent"
                onClick={handlePreviousStep}
            >
                <Arrow direction="left" color="stroke-white" />
            </button>
            )}
            {onBoardingStep !== 1 && (
            <button
                type="button"
                className="rounded-full bg-white/20 p-3 backdrop-blur"
                aria-label="Suivant"
                onClick={handleNextStep}
            >
                  <Arrow direction="right" color="stroke-white" />
              </button>
            )}
          </div>
      </main>
    </div>
  );
}
