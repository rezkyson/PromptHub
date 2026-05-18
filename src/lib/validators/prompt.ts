import {
  PROMPT_CATEGORIES,
  PROMPT_LIMITS,
  PROMPT_VISIBILITIES,
} from "@/lib/constants/prompts";
import { normalizeTags, parseTagsInput } from "@/lib/tags";
import type { PromptFormValues } from "@/types/prompt";

export type PromptValidationErrors = Partial<
  Record<keyof PromptFormValues | "tags", string>
>;

export function validatePromptForm(values: PromptFormValues) {
  const errors: PromptValidationErrors = {};
  const title = values.title.trim();
  const description = values.description?.trim() ?? "";
  const content = values.content.trim();
  const parsedTags = parseTagsInput(values.tags).map((tag) => tag.trim());
  const filledTags = parsedTags.filter(Boolean);
  const tags = normalizeTags(values.tags);

  if (title.length < PROMPT_LIMITS.titleMin) {
    errors.title = "Judul minimal 3 karakter.";
  }

  if (title.length > PROMPT_LIMITS.titleMax) {
    errors.title = "Judul maksimal 100 karakter.";
  }

  if (description.length > PROMPT_LIMITS.descriptionMax) {
    errors.description = "Deskripsi maksimal 300 karakter.";
  }

  if (!PROMPT_CATEGORIES.includes(values.category as never)) {
    errors.category = "Pilih kategori yang tersedia.";
  }

  if (filledTags.length > PROMPT_LIMITS.tagsMax) {
    errors.tags = "Tag maksimal 5 item.";
  }

  if (filledTags.some((tag) => tag.length > PROMPT_LIMITS.tagLengthMax)) {
    errors.tags = "Setiap tag maksimal 30 karakter.";
  }

  if (content.length < PROMPT_LIMITS.contentMin) {
    errors.content = "Isi prompt minimal 10 karakter.";
  }

  if (content.length > PROMPT_LIMITS.contentMax) {
    errors.content = "Isi prompt maksimal 10.000 karakter.";
  }

  if (!PROMPT_VISIBILITIES.includes(values.visibility)) {
    errors.visibility = "Pilih visibility public atau private.";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
    data: {
      title,
      description: description || null,
      category: values.category,
      tags,
      content,
      visibility: values.visibility,
    },
  };
}
