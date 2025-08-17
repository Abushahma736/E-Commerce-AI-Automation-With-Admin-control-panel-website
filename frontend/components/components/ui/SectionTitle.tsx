export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-2xl sm:text-3xl font-serif">{title}</h2>
      {subtitle ? <p className="text-slate-600">{subtitle}</p> : null}
    </div>
  )
}


