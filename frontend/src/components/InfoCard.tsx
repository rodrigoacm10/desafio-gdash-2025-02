type InfoCardProps = {
  title: string
  main: string
  lines?: string[]
}

export const InfoCard = ({ title, main, lines }: InfoCardProps) => {
  return (
    <div className="rounded-2xl border border-sidebar-border/70 bg-background p-4 dark:border-sidebar-border">
      <p className="text-xs font-medium text-muted-foreground">{title}</p>

      <p className="mt-2 text-3xl font-semibold text-[#25a9e0]">{main}</p>

      {lines?.map((line, index) => (
        <p key={index} className="mt-1 text-xs text-muted-foreground">
          {line}
        </p>
      ))}
    </div>
  )
}
