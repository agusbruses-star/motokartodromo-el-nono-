import { SITE, href } from '@/data/site'

export const EMBLEM = href('brand/emblema-el-nono.webp')
export const EMBLEM_SM = href('brand/emblema-el-nono-160.png')

/** Emblema oficial del Motokartódromo El Nono + wordmark. */
export function Logo({ compact = false, size = 'md' }: { compact?: boolean; size?: 'md' | 'lg' }) {
  const s = size === 'lg' ? 'size-16' : 'size-10 lg:size-11'
  return (
    <span className="flex items-center gap-3 select-none">
      <img src={EMBLEM_SM} alt="Emblema de automovilismo El Nono" width={160} height={160} className={`${s} shrink-0 rounded-full object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]`} />
      {!compact && (
        <span className="leading-none">
          <span className={`block font-display font-black tracking-[0.1em] text-white ${size === 'lg' ? 'text-xl' : 'text-[15px]'}`}>{SITE.name}</span>
          <span className="mt-1.5 block font-display text-[8px] font-bold tracking-[0.34em] text-red uppercase">{SITE.subtitle}</span>
        </span>
      )}
    </span>
  )
}
