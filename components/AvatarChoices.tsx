"use client";

import { AvatarChoice, MapChoice } from "@/models/User";
import { useEffect, useMemo, useRef, useState } from "react";
import { useUser } from "@/app/providers/UserProvider";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Button from "./UI/Button";
import Arrow from "./UI/Arrow";
import Check from "./UI/Check";
import { useToast } from "@/app/providers/ToastMessage";
import { useRouter } from "next/navigation";

type AvatarChoicesProps = {
    avatar: AvatarChoice;
    map: MapChoice;
};

type SliderItem = { id: string; name: string; image: string };

function ChoiceSlider({
  items,
  selectedId,
  onSelected,
}: {
  items: SliderItem[];
  selectedId: string | null;
  onSelected: (id: string) => void;
}) {
  const swiperRef = useRef<any>(null);
  const initialIndex = Math.max(
    0,
    items.findIndex((i) => i.id === (selectedId ?? items[0]?.id))
  );

  return (
    <div className="relative mx-auto mt-10 w-full">
      {/* Custom arrows */}

      <Swiper
        modules={[EffectCards]}
        effect="cards"
        grabCursor
        loop={false}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          if (initialIndex) swiper.slideTo(initialIndex, 0);
        }}
        onSlideChange={(swiper) => {
          const item = items[swiper.activeIndex];
          if (item) onSelected(item.id);
        }}
        className="w-full overflow-hidden"
      >
        {items.map((it) => (
          <SwiperSlide key={it.id} className={`overflow-hidden shadow-none! mx-auto ${initialIndex === items.indexOf(it) ? 'shadow-none!' : 'shadow-none!'}`}>
            <div className="w-[80vw]! max-w-xs transform translate-x-1/8 bg-vert border border-bleu rounded-3xl overflow-hidden shadow-none!">
              <Image
                src={it.image}
                alt={it.name}
                width={400}
                height={400}
                className="aspect-3/4 w-full object-contain"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

const AvatarChoices = () => {
    const { user, refreshUser } = useUser();
    const { showToast } = useToast();
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [username, setUsername] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
    // Initialise l'étape à partir du user uniquement au premier rendu
    if (currentStep !== 0) return;

    if (user?.username) {
      // Si un jour tu veux sauter directement à la fin quand avatar/map existent déjà :
      // if (user.avatar && user.map) setCurrentStep(4);
      // else
      setCurrentStep(2);
    } else {
      setCurrentStep(1);
    }
  }, [user, currentStep]);

    const handleNextStep = async () => {
      setCurrentStep((prev) => prev + 1);
    }

    const handlePreviousStep = () => {
        if(currentStep === 1) {
            return;
        }
        setCurrentStep((prev) => prev - 1);
    }

    

    const avatars = useMemo(
        () => [
        {
            id: "Avatar1",
            name: "Avatar1",
            image: "/medias/img/avatar1.png",
        },
        {
            id: "Avatar2",
            name: "Avatar2",
            image: "/medias/img/avatar2.png",
        },
        {
            id: "Avatar3",
            name: "Avatar3",
            image: "/medias/img/avatar3.png",
        },
        {
            id: "Avatar4",
            name: "Avatar4",
            image: "/medias/img/avatar4.png",
        },
        {
            id: "Avatar5",
            name: "Avatar5",
            image: "/medias/img/avatar5.png",
        },
    ],
    []
    );
    const [selectedAvatar, setSelectedAvatar] = useState<AvatarChoice>(
        user?.avatar ?? (avatars[0]?.id as AvatarChoice)
    );

    const maps = useMemo(
        () => [
        {
            id: "Map1",
            name: "Map1",
            image: "/medias/img/map1.png",
        },
        {
            id: "Map2",
            name: "Map2",
            image: "/medias/img/map2.png",
        },
        {
            id: "Map3",
            name: "Map3",
            image: "/medias/img/map3.png",
        },
        {
            id: "Map4",
            name: "Map4",
            image: "/medias/img/map4.png",
        },
    ],
    []
    );
    const [selectedMap, setSelectedMap] = useState<MapChoice>(
        user?.map ?? (maps[0]?.id as MapChoice)
    );
    
    const stepTitle =
      currentStep === 1
        ? "CHOISIS TON PSEUDO"
        : currentStep === 2
        ? "CHOISIS TON AVATAR"
        : "CHOISIS TON UNIVERS";

    const handleSubmitUsername = async (username: string) => {
      const value = username.trim();
      if (!value) {
        showToast("Merci de saisir un pseudo.", "error");
        return;
      }

      try {
        const res = await fetch("/api/auth/username-choice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: value }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok || data.error) {
          const code = data.error;
          if (code === "missing_username") {
            showToast("Le pseudo est obligatoire.", "error");
          } else if (code === "username_already_used") {
            showToast("Ce pseudo est déjà utilisé. Merci d'en choisir un autre.", "error");
          } else if (code === "non_autorise") {
            showToast("Vous devez être connecté pour choisir un pseudo.", "error");
          } else {
            showToast("Erreur lors de la soumission du pseudo.", "error");
          }
          return;
        }

        showToast("Pseudo soumis avec succès.", "success");
        refreshUser();
        setCurrentStep((prev) => prev + 1);
      } catch (error) {
        console.error(error);
        showToast("Erreur réseau lors de la soumission du pseudo.", "error");
      }
    }

    const handleSaveChoices = async () => {

        console.log("selectedAvatar", selectedAvatar);
        console.log("selectedMap", selectedMap);
        try {
           const res = await fetch("/api/avatar-choice", {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({ avatar: selectedAvatar, map: selectedMap }),
           });

           const data = await res.json().catch(() => ({}));

           if (!res.ok || data.error) {
             const code = data.error;
             if (code === "non_autorise") {
               showToast("Vous devez être connecté pour enregistrer vos choix.", "error");
             } else if (code === "missing_avatar_or_map") {
               showToast("Merci de choisir un personnage et un univers.", "error");
             } else {
               showToast("Erreur lors de la soumission du choix.", "error");
             }
             return;
           }

           setCurrentStep((prev) => prev + 1);
           refreshUser();
        } catch (error) {
            console.error(error);
           showToast("Erreur réseau lors de la soumission du choix.", "error");
           return;
        }
    }

    return (
      <div className="relative flex flex-col justify-start items-center h-screen w-screen overflow-hidden text-white bg-[#0B1C5A]">

        {/* Header */}
        <div className="relative w-full flex items-center justify-center py-10">
          <Image
            src="/medias/img/Logo-mirokai-exp-dark.png"
            alt="Mirokaï"
            width={180}
            height={60}
            className="h-auto w-44"
          />
        </div>

        {/* Content */}
        <div className="relative w-full flex flex-col items-center justify-start h-full">
            {currentStep !== 4 && (
                <>
                    <div className="w-14 h-14 shrink-0 relative shadow-[0px_4px_8px_0px_rgba(198,198,198,0.25)] rounded-full flex items-center justify-center bg-vert text-xl">
                        {currentStep}
                    </div>
                    <h1 className="mt-6 text-center text-3xl font-normal px-2 font-acumin font-stretch-condensed">
                        {stepTitle}
                    </h1>
                </>
            )}

          {currentStep === 1 &&
            (
              <div className="relative w-10/12 flex flex-col items-center justify-start mt-20">
                <input id="username" onChange={(e) => setUsername(e.target.value)} type="text" placeholder="" className="w-full h-11 rounded-xl border border-blanc px-3 py-2 text-base outline-none focus:ring-0 focus:outline-none" />
                <span className="block w-11/12 h-px bg-blanc absolute bottom-2 left-1/2 transform -translate-x-1/2"></span>
              </div>
            )}
          {currentStep === 2 &&
            (
              <ChoiceSlider
                items={avatars}
                selectedId={selectedAvatar}
                onSelected={(id) => setSelectedAvatar(id as AvatarChoice)}
              />
            )}

          {currentStep === 3 &&
            (
              <ChoiceSlider
                items={maps}
                selectedId={selectedMap}
                onSelected={(id) => setSelectedMap(id as MapChoice)}
              />
            )}
            {currentStep === 4 && (
              <div className="h-full flex flex-col items-center justify-between gap-4 mb-25">
                <div className="flex items-center justify-center rounded-full bg-vert p-3 w-fit">
                    <Check color="fill-white" />
                </div>
                <p className="text-white text-center">
                  PROFIL VALIDÉ
                </p>
                <p className="text-white text-center">
                Félicitations ! Ton profil a été créé avec succès. Tu es maintenant prêt à vivre l'expérience Miroki.
                </p>
                <Image
                  src="/medias/img/logo-mirokai-exp-dark.png"
                  alt="Mirokaï"
                  width={100}
                  height={100}
                  className="w-full h-auto"
                />
                <Button
                  variant="secondary"
                  onClick={() => {router.push("/jeux");}}
                >
                  Accéder à l'accueil
                </Button>
              </div>
            )}

          {/* Footer nav */}
          <div className={`absolute bottom-0 flex w-full px-6 pb-8 items-center ${currentStep === 1 ? 'justify-end' : 'justify-between'}`}>
            {currentStep !== 1 && currentStep !== 4 && (
            <button
                type="button"
                className="rounded-full bg-white/20 p-3 backdrop-blur"
                aria-label="Précédent"
                onClick={handlePreviousStep}
            >
                <Arrow direction="left" color="stroke-white" />
            </button>
            )}
            {currentStep !== 1 && currentStep !== 3 &&  currentStep !== 4 && (
            <button
                type="button"
                className="rounded-full bg-white/20 p-3 backdrop-blur"
                aria-label="Suivant"
                onClick={handleNextStep}
            >
                  <Arrow direction="right" color="stroke-white" />
              </button>
            )}
            {currentStep === 1 && (
            <button
                type="button"
                className="rounded-full bg-white/20 p-3 backdrop-blur"
                aria-label="Suivant"
                onClick={() => handleSubmitUsername(username)}
            >
                  <Arrow direction="right" color="stroke-white" />
              </button>
            )}
            {currentStep === 3 && (
               <button
               type="button"
               className="rounded-full bg-vert p-3 backdrop-blur"
               aria-label="Suivant"
               onClick={handleSaveChoices}
           >
                 <Check color="fill-white" />
             </button>
            )}
          </div>
        </div>
      </div>
    );
};

export default AvatarChoices;