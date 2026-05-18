type AuthMessageProps = {
  error?: string;
  message?: string;
};

export function AuthMessage({ error, message }: AuthMessageProps) {
  if (!error && !message) {
    return null;
  }

  return (
    <div
      className={
        error
          ? "rounded-2xl bg-block-coral px-4 py-3 text-sm"
          : "rounded-2xl bg-block-mint px-4 py-3 text-sm"
      }
      role={error ? "alert" : "status"}
    >
      {error || message}
    </div>
  );
}
