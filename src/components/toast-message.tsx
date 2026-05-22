"use client";

import { useEffect } from "react";
import { toast } from "sonner";

type ToastMessageProps = {
  error?: string;
  message?: string;
};

export function ToastMessage({ error, message }: ToastMessageProps) {
  useEffect(() => {
    const currentPath = window.location.pathname;

    if (message) {
      toast.success(message, {
        id: `route-message:${currentPath}:${message}`,
      });
    }

    if (error) {
      toast.error(error, {
        id: `route-error:${currentPath}:${error}`,
      });
    }

    if (message || error) {
      const url = new URL(window.location.href);

      url.searchParams.delete("message");
      url.searchParams.delete("error");
      window.history.replaceState(
        window.history.state,
        "",
        `${url.pathname}${url.search}${url.hash}`
      );
    }
  }, [error, message]);

  return null;
}
