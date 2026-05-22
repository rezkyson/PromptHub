"use client";

import { BookmarkIcon } from "lucide-react";
import Link from "next/link";
import { useOptimistic, useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

type FavoritePromptButtonProps = {
  iconOnly?: boolean;
  isAuthenticated: boolean;
  isFavorited?: boolean;
  promptId: string;
};

export function FavoritePromptButton({
  iconOnly,
  isAuthenticated,
  isFavorited,
  promptId,
}: FavoritePromptButtonProps) {
  const [saved, setSaved] = useState(Boolean(isFavorited));
  const [optimisticSaved, setOptimisticSaved] = useOptimistic(
    saved,
    (_currentState, nextState: boolean) => nextState
  );
  const [isPending, startTransition] = useTransition();
  const label = optimisticSaved ? "Tersimpan" : "Simpan";

  function handleToggleFavorite() {
    if (isPending) {
      return;
    }

    const nextSavedState = !optimisticSaved;

    startTransition(async () => {
      setOptimisticSaved(nextSavedState);

      try {
        const response = await fetch("/api/favorites", {
          body: JSON.stringify({
            isFavorited: nextSavedState,
            promptId,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        });
        const data = (await response.json()) as {
          error?: string;
          isFavorited?: boolean;
        };

        if (!response.ok) {
          throw new Error(data.error || "Favorite gagal diperbarui.");
        }

        setSaved(Boolean(data.isFavorited));
      } catch (error) {
        setSaved(!nextSavedState);
        toast.error(
          error instanceof Error
            ? error.message
            : "Favorite gagal diperbarui."
        );
      }
    });
  }

  if (!isAuthenticated) {
    return (
      <Button
        asChild
        className="rounded-full"
        size={iconOnly ? "icon-lg" : "default"}
        title="Login untuk menyimpan favorite"
        variant="secondary"
      >
        <Link
          aria-label="Login untuk menyimpan favorite"
          href={`/login?error=${encodeURIComponent(
            "Silakan login untuk menyimpan favorite."
          )}`}
        >
          <BookmarkIcon aria-hidden="true" />
          {iconOnly ? null : "Simpan"}
        </Link>
      </Button>
    );
  }

  return (
    <Button
      aria-label={
        optimisticSaved ? "Hapus dari favorite" : "Simpan ke favorite"
      }
      aria-pressed={optimisticSaved}
      className={
        optimisticSaved
          ? "rounded-full border-foreground/10 bg-amber-300 text-black hover:bg-amber-300/90 disabled:opacity-80 dark:bg-amber-400 dark:text-black"
          : "rounded-full disabled:opacity-80"
      }
      disabled={isPending}
      onClick={handleToggleFavorite}
      size={iconOnly ? "icon-lg" : "default"}
      title={optimisticSaved ? "Hapus dari favorite" : "Simpan ke favorite"}
      type="button"
      variant="secondary"
    >
      <BookmarkIcon
        aria-hidden="true"
        className={optimisticSaved ? "fill-current" : undefined}
      />
      {iconOnly ? null : label}
    </Button>
  );
}
