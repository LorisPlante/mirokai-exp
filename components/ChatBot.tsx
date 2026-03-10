"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useUser } from "@/app/providers/UserProvider";
import Button from "./UI/Button";
import { useRouter } from "next/navigation";
import { BotChoice } from "@/models/User";

type Message = {
    id: number;
    content: string;
    role: "user" | "bot";
};

const ChatBot = () => {
    const { user, refreshUser } = useUser();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const chatBotContainerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        if(isOpen) {
        if(!user) {
            setTimeout(() => {
                setMessages([{ id: 1, content: "Veuillez vous connecter pour commencer à discuter avec moi", role: "bot" }]);
            }, 500);
        } else if (user && !user.bot) {
            setTimeout(() => {
                setMessages([{ id: 1, content: "Bonjour, à qui veux-tu parler ?", role: "bot" }]);
            }, 500);
        } else if (user && user.bot) {
            setTimeout(() => {
                setMessages([{ id: 1, content: "Bonjour, je suis " + user?.bot + " ! Comment vas-tu ?", role: "bot" }]);
            }, 500);
        }
    }
    }, [isOpen]);

    const handleSendMessage = () => {
        if(input.length === 0) {
            return;
        }
        setIsLoading(true);
        const content = input;
        setMessages((prev) => {
            const lastId = prev.length ? prev[prev.length - 1].id : 0;
            return [...prev, { id: lastId + 1, content, role: "user" }];
        });
        setInput("");
        setTimeout(() => {
            setMessages((prev) => {
                const lastId = prev.length ? prev[prev.length - 1].id : 0;
                return [
                    ...prev,
                    {
                        id: lastId + 1,
                        content: "Je suis désolé, je ne peux pas répondre à cette question",
                        role: "bot",
                    },
                ];
            });
            setIsLoading(false);
        }, 500);
    };

    // Scroll automatique après ajout de message / changement du loader
    useEffect(() => {
        messagesContainerRef.current?.scrollTo({
            top: messagesContainerRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages, isLoading]);
    
    // Gestionnaire de clic à l'extérieur du chatbot
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isOpen &&
                chatBotContainerRef.current &&
                !chatBotContainerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleBotChoice = async (bot: BotChoice) => {
        try {
            const res = await fetch("/api/bot-choice", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bot }),
            });
            if(res.ok) {
                refreshUser();
                setMessages([{ id: 1, content: "Bonjour, je suis " + bot + " ! Comment vas-tu ?", role: "bot" }]);
            }
        } catch (error) {
            console.error(error);
        }
    };
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        <button onClick={() => setIsOpen(!isOpen)} className="bg-primary text-white rounded-full p-2">
            <Image src="/medias/img/miroki.webp" alt="ChatBot" width={50} height={50} />
        </button>
        {isOpen && (    
            <div className="absolute -top-98 right-0" ref={chatBotContainerRef}>
                <div className="w-96 h-96 bg-white border border-secondary rounded-lg overflow-hidden">
                    <div className="w-full bg-secondary p-2 flex flex-col gap-2">
                        <p className="text-white">Hello</p>
                    </div>
                    <div className="relative w-full p-2 flex flex-col gap-2 overflow-y-auto h-[288px]" ref={messagesContainerRef}>
                        {messages.map((message) => (
                            <div key={message.id} className={`w-11/12 ${message.role === "user" ? "bg-primary text-white ml-auto" : "bg-gray-200 text-secondary mr-auto"} rounded-lg p-2`}>
                                <b>{message.role === "bot" && user?.bot === "Miroka" ? "Miroka" : message.role === "bot" && user?.bot === "Miroki" ? "Miroki" : null}</b>
                                <b>{message.role === "user" && user?.username}</b>
                                <p>{message.content}</p>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="w-full p-2 flex items-center justify-start h-11">
                                <svg viewBox="0 0 64 16" fill="none" className="h-2" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="8" cy="8" r="8" className="fill-gray-600"/>
                                    <circle cx="32" cy="8" r="8" className="fill-gray-600"/>
                                    <circle cx="56" cy="8" r="8" className="fill-gray-600"/>
                                </svg>
                            </div>
                        )}
                    </div>
                    {user && user.bot ? (
                    <div className="w-full p-2 flex items-center justify-between gap-2 absolute bottom-0 left-0">
                        <input type="text" className="w-full p-2 rounded-lg border border-secondary text-base" placeholder="Message" value={input} onChange={(e) => setInput(e.target.value)} />
                        <button className="bg-primary text-white rounded-lg p-2" onClick={handleSendMessage}>Send</button>
                    </div>
                    ) : user && !user.bot ? (
                        <div className="w-full p-2 flex flex-col items-center justify-center gap-2 absolute bottom-0 left-0">
                            <div className="w-full flex items-center justify-center gap-2">
                                <Button variant="primary" size="full" onClick={() => handleBotChoice("Miroka")}> <Image src="/medias/img/miroka.webp" alt="Miroka" width={30} height={30} /> <span className="text-base">Miroka</span></Button>
                                <Button variant="primary" size="full" onClick={() => handleBotChoice("Miroki")}> <Image src="/medias/img/miroki.webp" alt="Miroki" width={30} height={30} /> <span className="text-base">Miroki</span></Button>
                            </div>
                        </div>
                    ) : !user ? (
                        <div className="w-full p-2 flex items-center justify-center gap-2 absolute bottom-0 left-0">
                            <Button variant="primary" size="full" onClick={() => {router.push("/login"); setIsOpen(false);}}>Login</Button>
                        </div>
                    ) : null}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ChatBot;