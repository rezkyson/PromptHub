import type { Prompt } from "@/types/prompt";

export type Collection = {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  promptCount: number;
  createdAt: string;
  updatedAt: string;
};

export type CollectionWithPrompts = Collection & {
  prompts: Prompt[];
};

export type CollectionFormValues = {
  name: string;
  description?: string;
};
