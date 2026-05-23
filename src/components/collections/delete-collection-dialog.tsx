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
import { deleteCollectionAction } from "@/lib/collections/actions";

type DeleteCollectionDialogProps = {
  collectionId: string;
};

export function DeleteCollectionDialog({
  collectionId,
}: DeleteCollectionDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          aria-label="Hapus collection"
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
            Hapus collection?
          </DialogTitle>
          <DialogDescription>
            Prompt di dalamnya tidak akan terhapus, hanya dikeluarkan dari
            collection ini.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Batal</Button>
          </DialogClose>
          <form action={deleteCollectionAction}>
            <input name="id" type="hidden" value={collectionId} />
            <Button aria-label="Konfirmasi hapus collection" type="submit">
              <Trash2Icon aria-hidden="true" />
              Hapus
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
