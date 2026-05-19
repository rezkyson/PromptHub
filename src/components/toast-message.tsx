"use client";

import { useEffect } from "react";
import { toast } from "sonner";

type ToastMessageProps = {
  error?: string;
  message?: string;
};

export function ToastMessage({ error, message }: ToastMessageProps) {
  useEffect(() => {
    if (message) {
      toast.success(message);
    }

    if (error) {
      toast.error(error);
    }
  }, [error, message]);

  return null;
}
