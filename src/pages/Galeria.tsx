import { useEffect, useMemo, useState } from 'react'
import { CALENDAR, GALLERY, img, type Photo } from '@/data/site'
import { Layout, PageHero } from '@/components/Layout'
import { IconClose } from '@/components/Icons'
import { ScrollRow } from '@/components/ScrollRow'

type TypeFilter = 'todas' | Photo['type']

const norm = (t: string) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
const roundOf = (n: number) => CALENDAR.find((r) => r.round === n)
const describe = (p: Photo) => {
  const r = roundOf(p.round)
  return `Fecha ${p.round} · ${p.type === 'carrera' ? 'Carrera' : 'Prueba'}${r ? ` · ${r.date}` : ''}`
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth={2.2} aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  )
}

const chip = (active: boolean) =>
  `clip-btn min-h-11 shrink-0 snap-start px-4 font-display text-[11px] font-bold tracking-[0.16em] whitespace-nowrap uppercase transition-colors ${
    active ? 'bg-red text-white' : 'bg-white/5 text-white/65 hover:text-white active:bg-white/10'
  }`

export default function Galeria() {
  const [open, setOpen] = useState<number | null>(null)
  const [query, setQuery] = useState('')
  const [type, setType] = useState<TypeFilter>('todas')
  const [round, setRound] = useState<number | null>(null)

  // Only offer dates that actually have photos.
  const rounds = useMemo(() => [...new Set(GALLERY.map((g) => g.round))].sort((a, b) => a - b), [])

  const photos = useMemo(() => {
    const q = norm(query.trim())
    return GALLERY.filter((p) => {
      if (type !== 'todas' && p.type !== type) return false
      if (round !== null && p.round !== round) return false
      if (!q) return true
      const r = roundOf(p.round)
      const hay = norm(`${p.alt} fecha ${p.round} f${p.round} ${p.type} ${r?.date ?? ''} ${r?.layout ?? ''}`)
      return q.split(/\s+/).every((w) => hay.includes(w))
    })
  }, [query, type, round])

  const count = (t: TypeFilter) => GALLERY.filter((p) => (t === 'todas' || p.type === t) && (round === null || p.round === round)).length
  const reset = () => {
    setQuery('')
    setType('todas')
    setRound(null)
  }
  const filtered = query !== '' || type !== 'todas' || round !== null

  useEffect(() => {
    if (open === null) return
    const n = photos.length
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') setOpen((o) => (o === null ? o : (o + 1) % n))
      if (e.key === 'ArrowLeft') setOpen((o) => (o === null ? o : (o - 1 + n) % n))
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, photos.length])

  const current = open !== null ? photos[open] : null

  return (
    <Layout page="galeria">
      <PageHero kicker="Paddock & pista" title="Galería" photo={img('foto-21.jpg')}>
        Las mejores imágenes del campeonato: largadas, boxes y la gente que hace posible cada fecha.
      </PageHero>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-16 md:px-10">
        <div data-reveal className="space-y-4 border border-line bg-coal p-4 sm:p-6">
          <label className="flex items-center gap-3 border-b-2 border-line bg-ink px-4 transition-colors focus-within:border-red">
            <span className="text-red">
              <SearchIcon />
            </span>
            <span className="sr-only">Buscar fotos</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por fecha, carrera o prueba (ej: fecha 3, prueba, 10 may)"
              className="min-h-12 w-full bg-transparent text-base text-white placeholder:text-white/30 focus:outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')} className="grid size-10 shrink-0 place-items-center text-white/60 hover:text-white" aria-label="Borrar búsqueda">
                <IconClose className="size-5" />
              </button>
            )}
          </label>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Tipo de sesión">
            {(['todas', 'carrera', 'prueba'] as TypeFilter[]).map((t) => (
              <button key={t} onClick={() => setType(t)} aria-pressed={type === t} className={chip(type === t)}>
                {t === 'todas' ? 'Todas' : t === 'carrera' ? 'Carreras' : 'Pruebas'}
                <span className="ml-2 opacity-60">{count(t)}</span>
              </button>
            ))}
          </div>

          <ScrollRow label="Filtrar por fecha" controls="overlay" step={0.6}>
            <div className="flex w-max gap-2" role="group" aria-label="Fecha">
              <button onClick={() => setRound(null)} aria-pressed={round === null} className={chip(round === null)}>
                Todas las fechas
              </button>
              {rounds.map((n) => (
                <button key={n} onClick={() => setRound(round === n ? null : n)} aria-pressed={round === n} className={chip(round === n)}>
                  F{n} <span className="ml-1 opacity-60">{roundOf(n)?.date}</span>
                </button>
              ))}
            </div>
          </ScrollRow>
        </div>

        <div className="mt-6 flex min-h-11 items-center justify-between gap-4">
          <p className="font-display text-[11px] font-bold tracking-[0.2em] text-white/55 uppercase" aria-live="polite">
            {photos.length} {photos.length === 1 ? 'foto' : 'fotos'}
          </p>
          {filtered && (
            <button onClick={reset} className="min-h-11 font-display text-[11px] font-bold tracking-[0.2em] text-red uppercase hover:text-white">
              Limpiar filtros
            </button>
          )}
        </div>

        {photos.length === 0 ? (
          <div className="mt-4 border border-dashed border-line px-6 py-16 text-center">
            <p className="font-display text-lg font-black text-white uppercase italic">Sin resultados</p>
            <p className="mt-2 text-sm text-white/50">No hay fotos para esa búsqueda. Probá con otra fecha o tipo de sesión.</p>
            <button onClick={reset} className="clip-btn mt-6 min-h-11 bg-red px-6 font-display text-[11px] font-bold tracking-[0.2em] text-white uppercase">
              Ver todas
            </button>
          </div>
        ) : (
          <div className="mt-4 columns-1 gap-4 sm:columns-2 lg:columns-3">
            {photos.map((g, i) => (
              <button
                key={g.src}
                onClick={() => setOpen(i)}
                className="page-enter group relative mb-4 block w-full overflow-hidden break-inside-avoid"
                aria-label={`Ampliar: ${g.alt}`}
              >
                <img src={img(g.src)} alt={g.alt} loading="lazy" className={`w-full object-cover transition duration-700 group-hover:scale-105 ${i % 3 === 1 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`} />
                <span className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />
                <span className={`clip-btn absolute top-3 left-3 px-3 py-1 font-display text-[9px] font-bold tracking-[0.18em] uppercase ${g.type === 'carrera' ? 'bg-red text-white' : 'bg-white text-ink'}`}>
                  {g.type === 'carrera' ? 'Carrera' : 'Prueba'}
                </span>
                <span className="absolute bottom-0 left-0 h-1 w-0 bg-red transition-all duration-500 group-hover:w-full" />
                <span className="absolute inset-x-4 bottom-4 text-left">
                  <span className="block font-display text-[10px] font-bold tracking-[0.2em] text-red uppercase">{describe(g)}</span>
                  <span className="mt-1 block font-display text-xs font-bold text-white uppercase">{g.alt}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      {current && (
        <div className="page-enter fixed inset-0 z-[80] flex items-center justify-center bg-black/95 p-4" onClick={() => setOpen(null)} role="dialog" aria-modal="true" aria-label={current.alt}>
          <button className="absolute top-[max(1rem,env(safe-area-inset-top))] right-4 grid size-12 place-items-center bg-red text-white" aria-label="Cerrar">
            <IconClose />
          </button>
          <img src={img(current.src)} alt={current.alt} className="max-h-[80vh] max-w-full object-contain" onClick={(e) => e.stopPropagation()} />
          <p className="absolute inset-x-4 bottom-[max(1.5rem,env(safe-area-inset-bottom))] text-center font-display text-[11px] tracking-[0.2em] text-white/60 uppercase">
            {open! + 1} / {photos.length} · {describe(current)}
          </p>
        </div>
      )}
    </Layout>
  )
}
