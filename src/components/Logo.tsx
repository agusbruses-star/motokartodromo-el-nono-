import { SITE } from '@/data/site'

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5 select-none">
      <span className="relative grid size-9 place-items-center bg-white text-ink">
        <span className="font-display text-lg font-black italic leading-none">K</span>
        <span className="checker absolute -right-1.5 -bottom-1.5 size-3.5 bg-ink" />
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="block font-display text-[15px] font-black tracking-[0.12em] text-white">{SITE.name}</span>
          <span className="mt-1 block font-display text-[8px] font-bold tracking-[0.42em] text-white/70 uppercase">Racing club</span>
        </span>
      )}
    </span>
  )
}
