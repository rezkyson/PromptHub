"use client";

import { SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { PROMPT_CATEGORIES } from "@/lib/constants/prompts";
import type { PromptCategory } from "@/types/prompt";

type PromptFilterControlsProps = {
  category: PromptCategory | "";
  onCategoryChange: (category: PromptCategory | "") => void;
  onSearchChange: (search: string) => void;
  search: string;
  searchPlaceholder: string;
};

export function PromptFilterControls({
  category,
  onCategoryChange,
  onSearchChange,
  search,
  searchPlaceholder,
}: PromptFilterControlsProps) {
  return (
    <div className="mt-8 grid gap-3 rounded-3xl bg-block-cream p-4 sm:grid-cols-[1fr_240px]">
      <div className="relative">
        <SearchIcon
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-foreground/55"
        />
        <Input
          aria-label="Cari prompt"
          className="h-12 rounded-2xl border-border/70 bg-background/95 pl-11 pr-4 text-base text-foreground shadow-sm placeholder:text-muted-foreground/80 focus-visible:border-primary focus-visible:ring-primary/20 dark:border-white/15 dark:bg-card dark:placeholder:text-muted-foreground"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          value={search}
        />
      </div>
      <select
        aria-label="Filter kategori"
        className="h-12 rounded-2xl border border-border/70 bg-background/95 px-4 text-base text-foreground shadow-sm outline-none transition-colors focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20 dark:border-white/15 dark:bg-card"
        value={category}
        onChange={(event) =>
          onCategoryChange(event.target.value as PromptCategory | "")
        }
      >
        <option value="">Semua kategori</option>
        {PROMPT_CATEGORIES.map((promptCategory) => (
          <option key={promptCategory} value={promptCategory}>
            {promptCategory}
          </option>
        ))}
      </select>
    </div>
  );
}
