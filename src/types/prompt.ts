import type {
  PROMPT_CATEGORIES,
  PROMPT_VISIBILITIES,
} from "@/lib/constants/prompts";

export type PromptCategory = (typeof PROMPT_CATEGORIES)[number];

export type PromptVisibility = (typeof PROMPT_VISIBILITIES)[number];

export type Profile = {
  id: string;
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Prompt = {
  id: string;
  userId: string;
  author: Profile | null;
  title: string;
  description: string | null;
  category: PromptCategory;
  tags: string[];
  content: string;
  visibility: PromptVisibility;
  createdAt: string;
  updatedAt: string;
};

export type PromptFormValues = {
  title: string;
  description?: string;
  category: PromptCategory | "";
  tags?: string | string[];
  content: string;
  visibility: PromptVisibility;
};
