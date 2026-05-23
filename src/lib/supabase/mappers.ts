import {
  PROMPT_CATEGORIES,
  PROMPT_VISIBILITIES,
} from "@/lib/constants/prompts";
import type {
  Profile,
  Prompt,
  PromptCategory,
  PromptVisibility,
} from "@/types/prompt";
import type { Collection } from "@/types/collection";
import type { CollectionRow, ProfileRow, PromptRow } from "@/types/database";

type PromptRowWithProfile = PromptRow & {
  profiles?: ProfileRow | ProfileRow[] | null;
};

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

export function mapCollectionRow(
  row: CollectionRow,
  promptCount = 0
): Collection {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    description: row.description,
    promptCount,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapPromptAuthor(row: PromptRowWithProfile) {
  const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;

  return profile ? mapProfileRow(profile) : null;
}

export function mapPromptRow(row: PromptRowWithProfile): Prompt {
  return {
    id: row.id,
    userId: row.user_id,
    author: mapPromptAuthor(row),
    title: row.title,
    description: row.description,
    category: toPromptCategory(row.category),
    tags: row.tags,
    content: row.content,
    copyCount: row.copy_count,
    visibility: toPromptVisibility(row.visibility),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
