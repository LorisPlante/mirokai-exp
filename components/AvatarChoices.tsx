"use client";

import { AvatarChoice, MapChoice, ClothesChoice } from "@/models/User";
import { useMemo, useRef, useState } from "react";
import { useUser } from "@/app/providers/UserProvider";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Button from "./UI/Button";
import Arrow from "./UI/Arrow";

type AvatarChoicesProps = {
    avatar: AvatarChoice;
    map: MapChoice;
    clothes: ClothesChoice;
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
      <button
        type="button"
        className="absolute left-[14px] top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 p-3 backdrop-blur"
        aria-label="Précédent"
        onClick={() => swiperRef.current?.slidePrev()}
      >
        <Arrow direction="left" color="stroke-white" />
      </button>
      <button
        type="button"
        className="absolute right-[14px] top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 p-3 backdrop-blur"
        aria-label="Suivant"
        onClick={() => swiperRef.current?.slideNext()}
      >
        <Arrow direction="right" color="stroke-white" />
      </button>

      <Swiper
        modules={[Navigation, Pagination, A11y]}
        spaceBetween={0}
        slidesPerView={1}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          if (initialIndex) swiper.slideTo(initialIndex, 0);
        }}
        onSlideChange={(swiper) => {
          const item = items[swiper.activeIndex];
          if (item) onSelected(item.id);
        }}
        className="w-full"
      >
        {items.map((it) => (
          <SwiperSlide key={it.id}>
            <div className="mx-auto flex w-[80vw] items-center justify-center overflow-hidden rounded-2xl bg-black/20 border border-bleu ">
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

    const [currentStep, setCurrentStep] = useState<number>(1);

    const handleNextStep = () => {
        if(currentStep === 3) {
            return;
        }
        setCurrentStep(currentStep + 1);
    }

    const handlePreviousStep = () => {
        if(currentStep === 1) {
            return;
        }
        setCurrentStep(currentStep - 1);
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
    ],
    []
    );
    const [selectedMap, setSelectedMap] = useState<MapChoice>(
        user?.map ?? (maps[0]?.id as MapChoice)
    );

    const clothes = useMemo(
        () => [
        {
            id: "Clothes1",
            name: "Clothes1",
            image: "/medias/img/clothes1.png",
        },
        {
            id: "Clothes2",
            name: "Clothes2",
            image: "/medias/img/clothes2.png",
        },
        {
            id: "Clothes3",
            name: "Clothes3",
            image: "/medias/img/clothes3.png",
        },
        {
            id: "Clothes4",
            name: "Clothes4",
            image: "/medias/img/clothes4.png",
        },
        {
            id: "Clothes5",
            name: "Clothes5",
            image: "/medias/img/clothes5.png",
        },
        {
            id: "Clothes6",
            name: "Clothes6",
            image: "/medias/img/clothes6.png",
        },
    ],
    []
    );
    const [selectedClothes, setSelectedClothes] = useState<ClothesChoice>(
        user?.clothes ?? (clothes[0]?.id as ClothesChoice)
    );
    
    const stepTitle =
      currentStep === 1
        ? "CHOISIS TON PERSONNAGE"
        : currentStep === 2
        ? "CHOISIS TON UNIVERS"
        : "CHOISIS TA TENUE";

    return (
      <div className="relative min-h-screen w-screen overflow-hidden text-white">
        {/* Background gradient */}
        <div className="pointer-events-none absolute inset-0 bg-[#0B1C5A]" />

        {/* Header */}
        <div className="relative flex items-center justify-center py-10">
          <Image
            src="/medias/img/Logo-mirokai-exp-dark.png"
            alt="Mirokaï"
            width={180}
            height={60}
            className="h-auto w-44"
          />
        </div>

        {/* Content */}
        <div className="relative flex flex-col items-center pb-10">
          <div className="w-14 h-14 relative shadow-[0px_4px_8px_0px_rgba(198,198,198,0.25)] rounded-full flex items-center justify-center bg-[#0EAA92] text-xl">
            {currentStep}
          </div>
          <h1 className="mt-6 text-center text-3xl font-normal px-2 font-acumin font-stretch-condensed">
            {stepTitle}
          </h1>

          {currentStep === 1 &&
            (
              <ChoiceSlider
                items={avatars}
                selectedId={selectedAvatar}
                onSelected={(id) => setSelectedAvatar(id as AvatarChoice)}
              />
            )}

          {currentStep === 2 &&
            (
              <ChoiceSlider
                items={maps}
                selectedId={selectedMap}
                onSelected={(id) => setSelectedMap(id as MapChoice)}
              />
            )}

          {currentStep === 3 && (
            <>
              <div className="mx-auto mt-10 w-[min(520px,92vw)] rounded-2xl bg-white/10 p-6">
                <div className="rounded-2xl bg-black/10 p-6">
                  <div className="flex items-center justify-center">
                    <Image
                      src={
                        clothes.find((c) => c.id === selectedClothes)?.image ??
                        ""
                      }
                      alt={
                        clothes.find((c) => c.id === selectedClothes)?.name ??
                        ""
                      }
                      width={500}
                      height={500}
                      className="h-[300px] w-auto object-contain"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex w-[min(520px,92vw)] flex-wrap items-center justify-center gap-3">
                {clothes.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedClothes(c.id as ClothesChoice)}
                    className={`overflow-hidden rounded-xl ring-2 ${
                      selectedClothes === c.id
                        ? "ring-white"
                        : "ring-white/20"
                    }`}
                  >
                    <Image
                      src={c.image}
                      alt={c.name}
                      width={120}
                      height={120}
                      className="h-20 w-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Footer nav */}
          <div className="mt-10 flex w-[min(520px,92vw)] items-center justify-between">
            <Button
              variant="secondary"
              onClick={handlePreviousStep}
              size="fit"
            >
              Previous
            </Button>
            <Button variant="primary" onClick={handleNextStep} size="fit">
              Next
            </Button>
          </div>
        </div>
      </div>
    );
};

export default AvatarChoices;