export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      collections: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "collections_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      prompts: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          category: string;
          tags: string[];
          content: string;
          copy_count: number;
          visibility: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          category: string;
          tags?: string[];
          content: string;
          copy_count?: number;
          visibility?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          category?: string;
          tags?: string[];
          content?: string;
          copy_count?: number;
          visibility?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "prompts_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      prompt_favorites: {
        Row: {
          user_id: string;
          prompt_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          prompt_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          prompt_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "prompt_favorites_prompt_id_fkey";
            columns: ["prompt_id"];
            isOneToOne: false;
            referencedRelation: "prompts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "prompt_favorites_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      prompt_copies: {
        Row: {
          user_id: string;
          prompt_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          prompt_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          prompt_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "prompt_copies_prompt_id_fkey";
            columns: ["prompt_id"];
            isOneToOne: false;
            referencedRelation: "prompts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "prompt_copies_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      collection_prompts: {
        Row: {
          collection_id: string;
          prompt_id: string;
          created_at: string;
        };
        Insert: {
          collection_id: string;
          prompt_id: string;
          created_at?: string;
        };
        Update: {
          collection_id?: string;
          prompt_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "collection_prompts_collection_id_fkey";
            columns: ["collection_id"];
            isOneToOne: false;
            referencedRelation: "collections";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "collection_prompts_prompt_id_fkey";
            columns: ["prompt_id"];
            isOneToOne: false;
            referencedRelation: "prompts";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      are_prompt_tags_valid: {
        Args: { tag_list: string[] };
        Returns: boolean;
      };
      generate_username_from_email: {
        Args: { email: string; user_id: string };
        Returns: string;
      };
      handle_new_user: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
      record_prompt_copy: {
        Args: { target_prompt_id: string };
        Returns: boolean;
      };
      set_updated_at: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
export type CollectionRow = Database["public"]["Tables"]["collections"]["Row"];
export type CollectionInsert =
  Database["public"]["Tables"]["collections"]["Insert"];
export type CollectionUpdate =
  Database["public"]["Tables"]["collections"]["Update"];
export type CollectionPromptRow =
  Database["public"]["Tables"]["collection_prompts"]["Row"];
export type PromptFavoriteRow =
  Database["public"]["Tables"]["prompt_favorites"]["Row"];
export type PromptCopyRow =
  Database["public"]["Tables"]["prompt_copies"]["Row"];
export type PromptRow = Database["public"]["Tables"]["prompts"]["Row"];
export type PromptInsert = Database["public"]["Tables"]["prompts"]["Insert"];
export type PromptUpdate = Database["public"]["Tables"]["prompts"]["Update"];
