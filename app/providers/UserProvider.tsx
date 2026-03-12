"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { AvatarChoice, MapChoice } from "@/models/User";

type UserData = {
  avatar: string | null;
  map: string | null;
  level: number;
};

type User = {
  id: string;
  username: string;
  avatar: AvatarChoice | null;
  map: MapChoice | null;
  level: number;
  email: string;
  role: string;
};

type UserContextType = {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const loadUser = async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.authenticated && data.user) {
        const u = data.user as User;
        setUser(u);

        let avatarUrl: string | null = null;
        let mapUrl: string | null = null;

        switch (u.avatar) {
          case "Avatar1":
            avatarUrl = "/medias/img/avatar1.png";
            break;
          case "Avatar2":
            avatarUrl = "/medias/img/avatar2.png";
            break;
          case "Avatar3":
            avatarUrl = "/medias/img/avatar3.png";
            break;
          case "Avatar4":
            avatarUrl = "/medias/img/avatar4.png";
            break;
          case "Avatar5":
            avatarUrl = "/medias/img/avatar5.png";
            break;
        }

        switch (u.map) {
          case "Map1":
            mapUrl = "/medias/img/map1.png";
            break;
          case "Map2":
            mapUrl = "/medias/img/map2.png";
            break;
          case "Map3":
            mapUrl = "/medias/img/map3.png";
            break;
          case "Map4":
            mapUrl = "/medias/img/map4.png";
            break;
        }

        setUserData({
          avatar: avatarUrl,
          map: mapUrl,
          level: u.level ?? 1,
        });
      } else {
        setUser(null);
        setUserData(null);
      }
    } catch {
      setUser(null);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: UserContextType = {
    user,
    userData,
    loading,
    refreshUser: loadUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return ctx;
};

