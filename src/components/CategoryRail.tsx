import { useEffect, useRef, useState } from 'react'
import { CATEGORIES, href, img } from '@/data/site'
import { prefersReducedMotion } from './useScrollEffects'
import { ScrollRow } from './ScrollRow'

export const BADGE = ['bg-red text-white', 'bg-celeste text-ink', 'bg-verde text-ink', 'bg-amarillo text-ink']

/**
 * Pinned section where vertical scroll drives a horizontal rail of the 7 categories.
 * Falls back to native horizontal scrolling on small screens / reduced motion.
 */
export function CategoryRail() {
  const outer = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | null>(null)
  const [x, setX] = useState(0)
  const [pinned, setPinned] = useState(false)

  useEffect(() => {
    const measure = () => {
      const enable = window.innerWidth >= 1024 && !prefersReducedMotion()
      setPinned(enable)
      if (!enable || !track.current) return setHeight(null)
      const dist = track.current.scrollWidth - window.innerWidth
      setHeight(window.innerHeight + Math.max(0, dist))
    }
    const onScroll = () => {
      if (!outer.current || !track.current) return
      const r = outer.current.getBoundingClientRect()
      const dist = track.current.scrollWidth - window.innerWidth
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight)))
      setX(-p * dist)
    }
    measure()
    onScroll()
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <section ref={outer} className="relative bg-coal" style={pinned && height ? { height } : undefined}>
      <div className={`${pinned ? 'sticky top-0 h-screen pt-[var(--header-h)]' : 'py-16 sm:py-20'} flex flex-col justify-center overflow-hidden`}>
        <div className="mx-auto mb-8 flex w-full max-w-7xl items-end justify-between gap-6 px-5 sm:px-6 md:px-10">
          <div>
            <p className="flex items-center gap-3 font-display text-[11px] font-bold tracking-[0.32em] text-celeste uppercase">
              <span className="h-[2px] w-8 bg-amarillo" />7 categorías
            </p>
            <h2 className="mt-3 font-display text-3xl leading-[1.05] font-black text-white uppercase italic sm:text-5xl">
              Elegí tu
              <br />
              grilla
            </h2>
          </div>
          <a href={href('categorias/index.html')} className="hidden font-display text-[11px] font-bold tracking-[0.22em] text-white/70 uppercase hover:text-white sm:block">
            Ver todas →
          </a>
        </div>
        {pinned ? (
          <div ref={track} className="flex w-max gap-5 px-10 will-change-transform" style={{ transform: `translate3d(${x}px,0,0)` }}>
            {CATEGORIES.map((c, i) => (
              <a
                key={c.slug}
                href={href(`posiciones/index.html?cat=${c.slug}`)}
                className="clip-card group relative block h-[380px] w-[74vw] max-w-[340px] shrink-0 snap-start scroll-ml-5 overflow-hidden bg-graphite sm:h-[460px]"
              >
                <img src={img(c.photo)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-60 grayscale transition duration-700 group-hover:scale-105 group-hover:opacity-80 group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                <span className={`absolute top-0 left-0 grid h-10 w-12 place-items-center font-display text-sm font-black ${BADGE[i % BADGE.length]}`}>0{i + 1}</span>
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="font-display text-[10px] font-bold tracking-[0.28em] text-celeste uppercase">{c.engine}</p>
                  <h3 className="mt-2 font-display text-2xl font-black text-white uppercase italic">{c.name}</h3>
                  <p className="mt-2 text-sm text-white/60">{c.age}</p>
                  <span className="mt-5 inline-block h-[3px] w-10 bg-amarillo transition-all duration-500 group-hover:w-full" />
                </div>
              </a>
            ))}
          </div>
        ) : (
          <ScrollRow label="Categorías">
            <div ref={track} className="flex w-max gap-4 px-5 sm:px-6 md:px-10">
            {CATEGORIES.map((c, i) => (
              <a
                key={c.slug}
                href={href(`posiciones/index.html?cat=${c.slug}`)}
                className="clip-card group relative block h-[380px] w-[74vw] max-w-[340px] shrink-0 snap-start scroll-ml-5 overflow-hidden bg-graphite sm:h-[460px]"
              >
                <img src={img(c.photo)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-60 grayscale transition duration-700 group-hover:scale-105 group-hover:opacity-80 group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                <span className={`absolute top-0 left-0 grid h-10 w-12 place-items-center font-display text-sm font-black ${BADGE[i % BADGE.length]}`}>0{i + 1}</span>
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="font-display text-[10px] font-bold tracking-[0.28em] text-celeste uppercase">{c.engine}</p>
                  <h3 className="mt-2 font-display text-2xl font-black text-white uppercase italic">{c.name}</h3>
                  <p className="mt-2 text-sm text-white/60">{c.age}</p>
                  <span className="mt-5 inline-block h-[3px] w-10 bg-amarillo transition-all duration-500 group-hover:w-full" />
                </div>
              </a>
            ))}
            </div>
          </ScrollRow>
        )}
      </div>
    </section>
  )
}
