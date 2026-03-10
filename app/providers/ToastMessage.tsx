// context/ToastContext.tsx
"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: Toast | null;
  showToast: (message: string, type?: ToastType) => void;
  clearToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (message: string, type: ToastType = "info") => {
    setToast({ message, type });

    // auto-dismiss après 5s
    setTimeout(() => setToast(null), 5000);
  };

  const clearToast = () => setToast(null);

  return <ToastContext.Provider value={{ toast, showToast, clearToast }}>{children}</ToastContext.Provider>;
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};
