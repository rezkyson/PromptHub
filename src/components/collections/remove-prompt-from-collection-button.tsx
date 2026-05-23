import { XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { removePromptFromCollectionAction } from "@/lib/collections/actions";

type RemovePromptFromCollectionButtonProps = {
  collectionId: string;
  promptId: string;
};

export function RemovePromptFromCollectionButton({
  collectionId,
  promptId,
}: RemovePromptFromCollectionButtonProps) {
  return (
    <form action={removePromptFromCollectionAction}>
      <input name="collectionId" type="hidden" value={collectionId} />
      <input name="promptId" type="hidden" value={promptId} />
      <Button
        aria-label="Keluarkan prompt dari collection"
        className="rounded-full"
        type="submit"
        variant="secondary"
      >
        <XIcon aria-hidden="true" />
        Keluarkan
      </Button>
    </form>
  );
}
