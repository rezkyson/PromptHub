"use client";

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
    <div className="mt-8 grid gap-3 rounded-3xl bg-block-cream p-4 sm:grid-cols-[1fr_220px]">
      <Input
        aria-label="Cari prompt"
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={searchPlaceholder}
        value={search}
      />
      <select
        aria-label="Filter kategori"
        className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
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
