import { cn } from '@/lib/cn'

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn('inline-block rounded-full bg-brand-green/10 text-brand-green px-2 py-0.5 text-xs font-medium', className)}>{children}</span>
}


