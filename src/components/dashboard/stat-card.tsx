type StatCardProps = {
  label: string;
  value: number;
  description: string;
};

export function StatCard({ label, value, description }: StatCardProps) {
  return (
    <div className="rounded-2xl border bg-card p-5 text-card-foreground">
      <p className="font-mono text-xs uppercase tracking-[0.16em]">{label}</p>
      <p className="mt-4 text-4xl font-medium tracking-tight">{value}</p>
      <p className="mt-2 text-sm leading-6">{description}</p>
    </div>
  );
}
