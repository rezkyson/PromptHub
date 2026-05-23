import { FolderIcon, SaveIcon, TextIcon } from "lucide-react";

import { SubmitButton } from "@/components/auth/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Collection } from "@/types/collection";

type CollectionFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  collection?: Collection;
};

export function CollectionForm({ action, collection }: CollectionFormProps) {
  const isEditMode = Boolean(collection);

  return (
    <form
      action={action}
      className="space-y-6 rounded-3xl border bg-card p-6 text-card-foreground sm:p-8"
    >
      {collection ? <input name="id" type="hidden" value={collection.id} /> : null}

      <div className="space-y-2">
        <Label htmlFor="name">
          <FolderIcon aria-hidden="true" />
          Nama collection
        </Label>
        <Input
          defaultValue={collection?.name ?? ""}
          id="name"
          maxLength={80}
          minLength={2}
          name="name"
          placeholder="Contoh: Prompt copywriting"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          <TextIcon aria-hidden="true" />
          Deskripsi
        </Label>
        <Textarea
          defaultValue={collection?.description ?? ""}
          id="description"
          maxLength={200}
          name="description"
          placeholder="Catatan singkat tentang isi collection ini."
        />
        <p className="text-xs leading-5 text-muted-foreground">
          Opsional, maksimal 200 karakter.
        </p>
      </div>

      <div className="sm:w-48">
        <SubmitButton pendingLabel="Menyimpan...">
          <SaveIcon aria-hidden="true" />
          {isEditMode ? "Simpan" : "Buat collection"}
        </SubmitButton>
      </div>
    </form>
  );
}
