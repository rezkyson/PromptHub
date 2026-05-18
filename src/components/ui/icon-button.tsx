import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type IconButtonProps = ComponentProps<typeof Button>;

export function IconButton({ className, size = "icon-lg", ...props }: IconButtonProps) {
  return (
    <Button
      className={cn("rounded-full", className)}
      size={size}
      variant="secondary"
      {...props}
    />
  );
}
