"use client";

import { AvatarChoice, MapChoice, ClothesChoice } from "@/models/User";
import { useMemo, useState } from "react";
import { useUser } from "@/app/providers/UserProvider";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Button from "./UI/Button";

type AvatarChoicesProps = {
    avatar: AvatarChoice;
    map: MapChoice;
    clothes: ClothesChoice;
};

const AvatarChoices = () => {
    const { user, refreshUser } = useUser();

    const [currentStep, setCurrentStep] = useState<number>(1);

    const handleNextStep = () => {
        setCurrentStep(currentStep + 1);
    }

    const handlePreviousStep = () => {
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
    
    return (
        <div className="flex flex-col gap-4 w-screen h-screen">
            <h1>Avatar Choices</h1>
            {currentStep === 1 && (
                <div className="flex flex-col gap-4 w-full h-full bg-red-500">
                <Swiper
                  modules={[Navigation, Pagination, A11y]}
                  spaceBetween={0}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true }}
                  initialSlide={avatars.findIndex(a => a.id === selectedAvatar) || 0}
                  onSlideChange={(swiper) => {
                    const idx = swiper.activeIndex;
                    const avatar = avatars[idx];
                    if (avatar) {
                      setSelectedAvatar(avatar.id as AvatarChoice);
                    }
                  }}
                  className="w-full h-full"
                >
                    {avatars.map((avatar) => (
                        <SwiperSlide key={avatar.id}>
                            <Image src={avatar.image} alt={avatar.name} width={100} height={100} className="w-full h-full object-cover" />
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="z-10 absolute bottom-0 left-0 right-0 flex flex-row items-center justify-end gap-4 p-6">
                    <Button variant="primary" onClick={handleNextStep}>Next</Button>
                </div>
            </div>
            )}
            {currentStep === 2 && (
                <div className="flex flex-col gap-4 w-full h-full bg-blue-500">
                <Swiper
                  modules={[Navigation, Pagination, A11y]}
                  spaceBetween={0}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true }}
                  initialSlide={maps.findIndex(m => m.id === selectedMap) || 0}
                  onSlideChange={(swiper) => {
                    const idx = swiper.activeIndex;
                    const map = maps[idx];
                    if (map) {
                      setSelectedMap(map.id as MapChoice);
                    }
                  }}
                  className="w-full h-full"
                >
                    {maps.map((map) => (
                        <SwiperSlide key={map.id}>
                            <Image src={map.image} alt={map.name} width={100} height={100} className="w-full h-full object-cover" />
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="z-10 absolute bottom-0 left-0 right-0 flex flex-row items-center justify-between gap-4 p-6">
                    <Button variant="primary" onClick={handlePreviousStep}>Previous</Button>
                    <Button variant="primary" onClick={handleNextStep}>Next</Button>
                </div>
            </div>
            )}
            {currentStep === 3 && (
                <div className="flex flex-col gap-4 w-full h-full bg-green-500">
                <Image src={clothes.find(c => c.id === selectedClothes)?.image ?? ""} alt={clothes.find(c => c.id === selectedClothes)?.name ?? ""} width={100} height={100} className="w-full h-full object-cover" />
                    <div className="w-full flex flex-wrap items-center justify-center gap-4 mb-10">
                        {clothes.map((c) => (
                            <Image src={c.image} alt={c.name} width={100} height={100} className="w-30% aspect-square object-cover bg-black" />
                        ))}
                    </div>
                <div className="z-10 absolute bottom-0 left-0 right-0 flex flex-row items-center justify-between gap-4 p-6">
                    <Button variant="primary" onClick={handlePreviousStep}>Previous</Button>
                    <Button variant="primary" onClick={handleNextStep}>Next</Button>
                </div>
            </div>
            )}
        </div>
    );
};

export default AvatarChoices;