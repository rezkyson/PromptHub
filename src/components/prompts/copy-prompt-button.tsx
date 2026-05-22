"use client";

import { CopyIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

type CopyPromptButtonProps = {
  content: string;
  iconOnly?: boolean;
  label?: string;
};

export function CopyPromptButton({
  content,
  iconOnly,
  label = "Copy prompt",
}: CopyPromptButtonProps) {
  async function handleCopy() {
    if (!navigator.clipboard) {
      toast.error("Browser tidak mendukung clipboard.");
      return;
    }

    try {
      await navigator.clipboard.writeText(content);
      toast.success("Copied!");
    } catch {
      toast.error("Prompt gagal disalin.");
    }
  }

  return (
    <Button
      aria-label={label}
      className="rounded-full"
      onClick={handleCopy}
      size={iconOnly ? "icon-lg" : "default"}
      title={label}
      type="button"
    >
      <CopyIcon />
      {iconOnly ? null : label}
    </Button>
  );
}
