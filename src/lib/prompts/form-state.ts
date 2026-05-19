export type PromptActionState = {
  status: "idle" | "error";
  message?: string;
  errors?: {
    title?: string;
    description?: string;
    category?: string;
    tags?: string;
    content?: string;
    visibility?: string;
  };
  values?: {
    title?: string;
    description?: string;
    category?: string;
    tags?: string;
    content?: string;
    visibility?: string;
  };
};

export const initialPromptActionState: PromptActionState = {
  status: "idle",
};
