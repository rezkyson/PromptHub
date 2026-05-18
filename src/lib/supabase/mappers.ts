import {
  PROMPT_CATEGORIES,
  PROMPT_VISIBILITIES,
} from "@/lib/constants/prompts";
import type { Profile, Prompt, PromptCategory, PromptVisibility } from "@/types/prompt";
import type { ProfileRow, PromptRow } from "@/types/database";

function toPromptCategory(value: string): PromptCategory {
  if (PROMPT_CATEGORIES.includes(value as PromptCategory)) {
    return value as PromptCategory;
  }

  return "Other";
}

function toPromptVisibility(value: string): PromptVisibility {
  if (PROMPT_VISIBILITIES.includes(value as PromptVisibility)) {
    return value as PromptVisibility;
  }

  return "private";
}

export function mapProfileRow(row: ProfileRow): Profile {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    bio: row.bio,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapPromptRow(row: PromptRow): Prompt {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    description: row.description,
    category: toPromptCategory(row.category),
    tags: row.tags,
    content: row.content,
    visibility: toPromptVisibility(row.visibility),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
