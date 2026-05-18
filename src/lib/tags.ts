import { PROMPT_LIMITS } from "@/lib/constants/prompts";

export function parseTagsInput(value: string | string[] | undefined) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  return value.split(",");
}

export function normalizeTags(value: string | string[] | undefined) {
  const uniqueTags = new Set<string>();

  for (const rawTag of parseTagsInput(value)) {
    const tag = rawTag.trim();

    if (!tag || tag.length > PROMPT_LIMITS.tagLengthMax) {
      continue;
    }

    uniqueTags.add(tag);

    if (uniqueTags.size >= PROMPT_LIMITS.tagsMax) {
      break;
    }
  }

  return Array.from(uniqueTags);
}
