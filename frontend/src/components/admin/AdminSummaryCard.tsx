type AdminSummaryCardProps = {
  title: string;
  value: string | number;
  description: string;
};

export default function AdminSummaryCard({ title, value, description }: AdminSummaryCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{title}</p>
      <p className="mt-4 text-3xl font-semibold text-slate-900">{value}</p>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}
