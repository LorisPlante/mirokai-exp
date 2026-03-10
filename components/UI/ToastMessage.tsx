// components/ToastMessage.tsx
"use client";
import React from "react";
import { useToast } from "@/app/providers/ToastMessage";

const toastStylesBackground = {
  success: "border-success bg-white",
  error: "border-error bg-white",
  info: "border-info bg-white",
  warning: "border-warning bg-white",
};

const toastStylesForeground = {
  success: "bg-success/10 text-success",
  error: "bg-error/10 text-error",
  info: "bg-info/10 text-info",
  warning: "bg-warning/10 text-warning",
};

const toastStylesSVG = {
  success: "stroke-success",
  error: "stroke-error",
  info: "stroke-info",
  warning: "stroke-warning",
};

const ToastMessage: React.FC = () => {
  const { toast, clearToast } = useToast();

  if (!toast) return null;

  return (
    <div
      className={`z-[99999999999999999999999999999999999999999] fixed top-4 sm:top-8 right-1/2 sm:right-8 translate-x-1/2 sm:translate-0 rounded-lg shadow-lg flex items-center justify-between gap-11 w-[90%] sm:w-auto max-w-md border ${
        toastStylesBackground[toast.type]
      }`}>
      <div className={`w-full flex items-center justify-between gap-11 px-4 py-2.5 ${toastStylesForeground[toast.type]}`}>
        <div className={`flex justify-center items-center gap-2`}>
          {toast.type === "success" ? (
            <svg viewBox="0 0 24 24" fill="none" className={`size-6 ${toastStylesSVG[toast.type]} shrink-0`}>
              <path d="M7 11.25L11.1667 15L17 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
            </svg>
          ) : toast.type === "error" ? (
            <svg viewBox="0 0 24 24" fill="none" className={`size-6 ${toastStylesSVG[toast.type]} shrink-0`}>
              <path
                d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : toast.type === "info" ? (
            <svg viewBox="0 0 24 24" fill="none" className={`size-6 ${toastStylesSVG[toast.type]} shrink-0`}>
              <path
                d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" className={`size-6 ${toastStylesSVG[toast.type]} shrink-0 text-nowrap`}>
              <path
                d="M11.9998 7.99996V12M11.9998 16H12.0098M10.2898 2.85996L1.81978 17C1.64514 17.3024 1.55274 17.6453 1.55177 17.9945C1.55079 18.3437 1.64127 18.6871 1.8142 18.9905C1.98714 19.2939 2.2365 19.5467 2.53748 19.7238C2.83847 19.9009 3.18058 19.9961 3.52978 20H20.4698C20.819 19.9961 21.1611 19.9009 21.4621 19.7238C21.7631 19.5467 22.0124 19.2939 22.1854 18.9905C22.3583 18.6871 22.4488 18.3437 22.4478 17.9945C22.4468 17.6453 22.3544 17.3024 22.1798 17L13.7098 2.85996C13.5315 2.56607 13.2805 2.32308 12.981 2.15444C12.6814 1.98581 12.3435 1.89722 11.9998 1.89722C11.656 1.89722 11.3181 1.98581 11.0186 2.15444C10.7191 2.32308 10.468 2.56607 10.2898 2.85996Z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          <span className="block w-auto font-semibold">{toast.message}</span>
        </div>

        <svg onClick={clearToast} viewBox="0 0 24 24" fill="none" className={`size-6 ${toastStylesSVG[toast.type]} shrink-0 cursor-pointer`}>
          <path
            d="M15 9L9 15M9 9L15 15M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default ToastMessage;
