import React from "react";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";

export const AktivitetToastManager: React.FC = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className: "",
        duration: 5000,
        style: {
          borderRadius: "10px",
          background: "#d4edda",
          color: "#155724",
        },
      }}
    />
  );
};

export default class Toast {
  static Info(message: string) {
    toast(message);
  }

  static Success(message: string, data: any) {
    toast.success(message);
  }

  static Error(message: string, error: any) {
    toast.error(message, error);
  }
}
