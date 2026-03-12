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
  level: string | null;
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
        let levelUrl: string | null = null;

        switch (u.avatar) {
          case "Avatar1":
            avatarUrl = "/medias/img/avatars/avatar1.png";
            break;
          case "Avatar2":
            avatarUrl = "/medias/img/avatars/avatar2.png";
            break;
          case "Avatar3":
            avatarUrl = "/medias/img/avatars/avatar3.png";
            break;
          case "Avatar4":
            avatarUrl = "/medias/img/avatars/avatar4.png";
            break;
          case "Avatar5":
            avatarUrl = "/medias/img/avatars/avatar5.png";
            break;
        }

        switch (u.map) {
          case "Map1":
            mapUrl = "/medias/img/maps/map1.png";
            break;
          case "Map2":
            mapUrl = "/medias/img/maps/map2.png";
            break;
          case "Map3":
            mapUrl = "/medias/img/maps/map3.png";
            break;
          case "Map4":
            mapUrl = "/medias/img/maps/map4.png";
            break;
        }

        switch (u.level) {
          case 1:
            levelUrl = "/medias/img/levels/level1.png";
            break;
          case 2:
            levelUrl = "/medias/img/levels/level2.png";
            break;
          case 3:
            levelUrl = "/medias/img/levels/level3.png";
            break;
          case 4:
            levelUrl = "/medias/img/levels/level4.png";
            break;
          case 5:
            levelUrl = "/medias/img/levels/level5.png";
            break;
          default:
            levelUrl = "/medias/img/levels/level1.png";
            break;
        }

        setUserData({
          avatar: avatarUrl,
          map: mapUrl,
          level: levelUrl,
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

