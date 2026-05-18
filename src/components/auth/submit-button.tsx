"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

type SubmitButtonProps = {
  children: React.ReactNode;
  pendingLabel: string;
};

export function SubmitButton({ children, pendingLabel }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      className="h-11 w-full rounded-full"
      disabled={pending}
      type="submit"
    >
      {pending ? pendingLabel : children}
    </Button>
  );
}
