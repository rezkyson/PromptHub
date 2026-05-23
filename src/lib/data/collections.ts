import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mapCollectionRow, mapPromptRow } from "@/lib/supabase/mappers";
import type {
  CollectionPromptRow,
  CollectionRow,
  PromptRow,
} from "@/types/database";
import type { Collection } from "@/types/collection";
import type { Prompt } from "@/types/prompt";

type CollectionRowWithPrompts = CollectionRow & {
  collection_prompts?: Pick<CollectionPromptRow, "prompt_id">[];
};

type CollectionPromptWithPrompt = Pick<
  CollectionPromptRow,
  "created_at" | "prompt_id"
> & {
  prompts?: PromptRow | null;
};

const MAX_COLLECTIONS = 100;

function getPromptCount(row: CollectionRowWithPrompts) {
  return row.collection_prompts?.length ?? 0;
}

export async function getUserCollections(userId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("collections")
    .select("*, collection_prompts(prompt_id)")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(MAX_COLLECTIONS);

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as CollectionRowWithPrompts[]).map((row) =>
    mapCollectionRow(row, getPromptCount(row))
  );
}

export async function getCollectionById(userId: string, collectionId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("collections")
    .select("*, collection_prompts(prompt_id)")
    .eq("id", collectionId)
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    return null;
  }

  const row = data as CollectionRowWithPrompts;

  return mapCollectionRow(row, getPromptCount(row));
}

export async function getPromptCollectionIds(userId: string, promptId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("collection_prompts")
    .select("collection_id, collections!inner(user_id)")
    .eq("prompt_id", promptId)
    .eq("collections.user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => row.collection_id);
}

export async function getCollectionPrompts(
  userId: string,
  collectionId: string
) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("collection_prompts")
    .select("prompt_id, created_at, prompts(*)")
    .eq("collection_id", collectionId)
    .eq("prompts.user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as CollectionPromptWithPrompt[])
    .map((row) => (row.prompts ? mapPromptRow(row.prompts) : null))
    .filter((prompt): prompt is Prompt => Boolean(prompt));
}

export async function getCollectionWithPrompts(
  userId: string,
  collectionId: string
) {
  const [collection, prompts] = await Promise.all([
    getCollectionById(userId, collectionId),
    getCollectionPrompts(userId, collectionId),
  ]);

  if (!collection) {
    return null;
  }

  return {
    ...collection,
    prompts,
  };
}

export async function syncPromptCollections(
  userId: string,
  promptId: string,
  collectionIds: string[]
) {
  const uniqueCollectionIds = [...new Set(collectionIds)].filter(Boolean);
  const userCollections = await getUserCollections(userId);
  const validCollectionIds = new Set(
    userCollections.map((collection) => collection.id)
  );
  const nextCollectionIds = uniqueCollectionIds.filter((collectionId) =>
    validCollectionIds.has(collectionId)
  );
  const supabase = await createSupabaseServerClient();

  if (userCollections.length > 0) {
    const { error: deleteError } = await supabase
      .from("collection_prompts")
      .delete()
      .eq("prompt_id", promptId)
      .in(
        "collection_id",
        userCollections.map((collection) => collection.id)
      );

    if (deleteError) {
      throw new Error(deleteError.message);
    }
  }

  if (nextCollectionIds.length === 0) {
    return;
  }

  const { error: insertError } = await supabase.from("collection_prompts").insert(
    nextCollectionIds.map((collectionId) => ({
      collection_id: collectionId,
      prompt_id: promptId,
    }))
  );

  if (insertError) {
    throw new Error(insertError.message);
  }
}

export function findCollectionName(
  collections: Collection[],
  collectionId: string
) {
  return collections.find((collection) => collection.id === collectionId)?.name;
}
