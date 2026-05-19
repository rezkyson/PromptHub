import { Trash2Icon, TriangleAlertIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deletePromptAction } from "@/lib/prompts/actions";

type DeletePromptDialogProps = {
  promptId: string;
};

export function DeletePromptDialog({ promptId }: DeletePromptDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          aria-label="Hapus prompt"
          className="rounded-full"
          variant="secondary"
        >
          <Trash2Icon aria-hidden="true" />
          Hapus
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TriangleAlertIcon aria-hidden="true" className="size-5" />
            Hapus prompt?
          </DialogTitle>
          <DialogDescription>
            Yakin ingin menghapus prompt ini? Aksi ini tidak bisa dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Batal</Button>
          </DialogClose>
          <form action={deletePromptAction}>
            <input name="id" type="hidden" value={promptId} />
            <Button aria-label="Konfirmasi hapus prompt" type="submit">
              <Trash2Icon aria-hidden="true" />
              Hapus
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
