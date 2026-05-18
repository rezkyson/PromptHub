export const PROMPT_CATEGORIES = [
  "Programming",
  "Writing",
  "Marketing",
  "Business",
  "Education",
  "Design",
  "Image Generation",
  "Productivity",
  "Social Media",
  "Other",
] as const;

export const PROMPT_VISIBILITIES = ["public", "private"] as const;

export const DEFAULT_PROMPT_VISIBILITY = "private";

export const PROMPT_LIMITS = {
  titleMin: 3,
  titleMax: 100,
  descriptionMax: 300,
  contentMin: 10,
  contentMax: 10_000,
  tagsMax: 5,
  tagLengthMax: 30,
} as const;
