import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

function Arrow({ dir }: { dir: 'l' | 'r' }) {
  return (
    <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth={2.4}>
      <path d={dir === 'l' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
    </svg>
  )
}

/**
 * Horizontal scroller with large touch buttons (44px+), snap points and edge fades.
 * `controls="overlay"` puts the buttons over the edges; `"bar"` renders them below.
 */
export function ScrollRow({
  children,
  label,
  className = '',
  innerClassName = '',
  controls = 'bar',
  step = 0.8,
}: {
  children: ReactNode
  label: string
  className?: string
  innerClassName?: string
  controls?: 'bar' | 'overlay'
  step?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [state, setState] = useState({ prev: false, next: false, p: 0 })

  const update = useCallback(() => {
    const el = ref.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setState({ prev: el.scrollLeft > 4, next: el.scrollLeft < max - 4, p: max > 0 ? el.scrollLeft / max : 0 })
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    update()
    el.addEventListener('scroll', update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    if (el.firstElementChild) ro.observe(el.firstElementChild)
    return () => {
      el.removeEventListener('scroll', update)
      ro.disconnect()
    }
  }, [update])

  const go = (d: 1 | -1) => ref.current?.scrollBy({ left: d * ref.current.clientWidth * step, behavior: 'smooth' })
  const scrollable = state.prev || state.next

  const btn = (d: 1 | -1, enabled: boolean, extra = '') => (
    <button
      type="button"
      onClick={() => go(d)}
      disabled={!enabled}
      aria-label={`${d < 0 ? 'Anterior' : 'Siguiente'}: ${label}`}
      className={`clip-btn grid h-11 w-14 shrink-0 place-items-center bg-red text-white transition active:scale-95 active:bg-red-dark disabled:bg-white/10 disabled:text-white/30 ${extra}`}
    >
      <Arrow dir={d < 0 ? 'l' : 'r'} />
    </button>
  )

  return (
    <div className={`relative ${className}`} role="region" aria-label={label}>
      <div ref={ref} className={`no-scrollbar snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth ${innerClassName}`}>
        {children}
      </div>
      {controls === 'overlay' && scrollable && (
        <>
          <div className={`pointer-events-none absolute inset-y-0 left-0 flex items-center bg-gradient-to-r from-ink to-transparent pr-6 transition-opacity ${state.prev ? 'opacity-100' : 'opacity-0'}`}>
            {btn(-1, state.prev, 'pointer-events-auto')}
          </div>
          <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center bg-gradient-to-l from-ink to-transparent pl-6 transition-opacity ${state.next ? 'opacity-100' : 'opacity-0'}`}>
            {btn(1, state.next, 'pointer-events-auto')}
          </div>
        </>
      )}
      {controls === 'bar' && scrollable && (
        <div className="mt-5 flex items-center gap-4 px-5 sm:px-6 md:px-10">
          <div className="relative h-[3px] flex-1 overflow-hidden bg-white/10">
            <div className="absolute inset-y-0 left-0 w-1/4 bg-red transition-[left] duration-150" style={{ left: `${state.p * 75}%` }} />
          </div>
          <div className="flex gap-2">
            {btn(-1, state.prev)}
            {btn(1, state.next)}
          </div>
        </div>
      )}
    </div>
  )
}
