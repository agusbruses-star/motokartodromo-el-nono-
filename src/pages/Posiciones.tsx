import { useEffect, useMemo, useRef, useState } from 'react'
import { CALENDAR, CATEGORIES, SITE, TOTAL_ROUNDS, img } from '@/data/site'
import { rankCategory, type RankedRow } from '@/data/compute'
import { Layout, PageHero } from '@/components/Layout'
import { FlagAR } from '@/components/Flag'
import { ScrollRow } from '@/components/ScrollRow'

function initialCat() {
  const q = new URLSearchParams(window.location.search).get('cat')
  return CATEGORIES.some((c) => c.slug === q) ? q! : CATEGORIES[0].slug
}

const podiumStyle = ['bg-amarillo text-ink', 'bg-white text-ink', 'bg-celeste text-ink']

function Podium({ rows }: { rows: RankedRow[] }) {
  const order = [rows[1], rows[0], rows[2]].filter(Boolean)
  return (
    <div className="grid grid-cols-3 items-end gap-2 sm:gap-4">
      {order.map((r) => {
        const h = r.pos === 1 ? 'pt-10 sm:pt-14' : r.pos === 2 ? 'pt-6 sm:pt-8' : 'pt-3 sm:pt-4'
        return (
          <div key={r.number} data-reveal style={{ ['--d' as string]: `${(3 - r.pos) * 90}ms` }} className={`clip-card relative overflow-hidden ${podiumStyle[r.pos - 1]} ${h} px-3 pb-5 sm:px-6`}>
            <span className="absolute top-2 right-4 font-display text-5xl font-black opacity-15 italic sm:text-7xl">{r.pos}</span>
            <FlagAR className="h-4 w-6 sm:h-5 sm:w-[30px]" />
            <p className="mt-3 font-display text-[10px] font-bold tracking-[0.2em] uppercase opacity-60">#{r.number}</p>
            <p className="mt-1 font-display text-[11px] leading-tight font-black break-words uppercase sm:text-base">{r.name}</p>
            <p className="mt-3 font-display text-xl font-black sm:text-4xl">
              {r.total}
              <span className="ml-1 text-[10px] font-bold opacity-70">PTS</span>
            </p>
          </div>
        )
      })}
    </div>
  )
}

export default function Posiciones() {
  const [cat, setCat] = useState(initialCat)
  const rows = useMemo(() => rankCategory(cat), [cat])
  const category = CATEGORIES.find((c) => c.slug === cat)!
  const played = CALENDAR.filter((r) => r.status === 'done').length
  const tabsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('cat', cat)
    window.history.replaceState(null, '', url)
    tabsRef.current?.querySelector<HTMLElement>('[aria-selected="true"]')?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [cat])

  const select = (slug: string) => {
    setCat(slug)
    document.getElementById('tabla')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <Layout page="posiciones">
      <PageHero
        kicker={`${SITE.season} · Fecha ${played} de ${TOTAL_ROUNDS}`}
        title={
          <>
            Tabla de
            <br />
            posiciones
          </>
        }
        photo={img('foto-14.jpg')}
      >
        Puntos por fecha de cada piloto en las siete categorías del campeonato.
      </PageHero>

      <div id="tabla" className="sticky top-[var(--header-h)] z-30 border-y border-line bg-ink/95 backdrop-blur-md">
        <ScrollRow label="Categorías" controls="overlay" className="mx-auto max-w-7xl" step={0.6}>
        <div ref={tabsRef} role="tablist" aria-label="Categorías" className="flex w-max gap-1 px-5 py-2.5 sm:px-6 md:px-10">
          {CATEGORIES.map((c, i) => (
            <button
              key={c.slug}
              role="tab"
              aria-selected={cat === c.slug}
              onClick={() => select(c.slug)}
              className={`clip-btn min-h-11 shrink-0 snap-center px-4 py-2 font-display text-[11px] font-bold tracking-[0.16em] whitespace-nowrap uppercase transition-colors ${
                cat === c.slug ? 'bg-red text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="mr-2 opacity-50">0{i + 1}</span>
              {c.name}
            </button>
          ))}
        </div>
        </ScrollRow>
      </div>

      <section key={cat} className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-16 md:px-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-end">
          <div data-reveal>
            <p className="font-display text-[11px] font-bold tracking-[0.3em] text-celeste uppercase">
              {category.engine} · {category.age}
            </p>
            <h2 className="mt-3 font-display text-[2.2rem] leading-none font-black break-words text-white uppercase italic sm:text-6xl">{category.name}</h2>
            <p className="mt-4 max-w-md text-white/60">{category.description}</p>
          </div>
          <Podium rows={rows} />
        </div>

        <ol className="mt-10 space-y-2 md:hidden" aria-label={`Posiciones ${category.name}`}>
          {rows.map((r) => (
            <li key={r.number} className={`border-l-[3px] bg-coal p-4 ${r.pos === 1 ? 'border-amarillo' : r.pos === 2 ? 'border-white' : r.pos === 3 ? 'border-celeste' : 'border-line'}`}>
              <div className="flex items-center gap-3">
                <span className={`clip-btn grid h-9 w-11 shrink-0 place-items-center font-display text-sm font-black ${r.pos === 1 ? 'bg-amarillo text-ink' : r.pos === 2 ? 'bg-white text-ink' : r.pos === 3 ? 'bg-celeste text-ink' : 'bg-white/10 text-white'}`}>{r.pos}</span>
                <FlagAR className="h-4 w-6" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-[13px] font-bold text-white uppercase">{r.name}</p>
                  <p className="truncate text-xs text-white/45">
                    #{r.number} · {r.city}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-xl leading-none font-black text-white tabular-nums">{r.total}</p>
                  <p className="mt-1 text-[10px] text-white/40 tabular-nums">{r.gap === 0 ? 'PTS · líder' : `PTS · -${r.gap}`}</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-8 gap-1">
                {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => {
                  const p = r.points[i]
                  const future = i >= played
                  return (
                    <div key={i} className={`py-1 text-center ${p === 25 ? 'bg-verde/15' : 'bg-white/[0.04]'}`}>
                      <p className="text-[9px] text-white/35">F{i + 1}</p>
                      <p className={`text-xs tabular-nums ${p === 25 ? 'font-bold text-verde' : future ? 'text-white/20' : 'text-white/80'}`}>{future ? '·' : p == null ? '—' : p}</p>
                    </div>
                  )
                })}
              </div>
            </li>
          ))}
        </ol>

        <ScrollRow label={`Tabla ${category.name}`} className="mt-14 hidden md:block" innerClassName="border border-line bg-coal snap-none">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="bg-black font-display text-[10px] tracking-[0.18em] text-white/50 uppercase">
                <th className="w-14 py-3 pl-4 text-left font-bold">Pos</th>
                <th className="w-16 py-3 text-left font-bold">N.º</th>
                <th className="py-3 text-left font-bold">Piloto</th>
                {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => (
                  <th key={i} className={`w-11 py-3 text-center font-bold ${i < played ? '' : 'opacity-40'}`}>
                    F{i + 1}
                  </th>
                ))}
                <th className="w-20 bg-red py-3 text-center font-bold text-white">Pts</th>
                <th className="w-16 py-3 pr-4 text-right font-bold">Dif.</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.number} className={`border-t border-line transition-colors hover:bg-white/[0.04] ${r.pos <= 3 ? 'bg-white/[0.02]' : ''}`}>
                  <td className="py-3 pl-4">
                    <span
                      className={`clip-btn inline-grid h-7 w-9 place-items-center font-display text-xs font-black ${
                        r.pos === 1 ? 'bg-amarillo text-ink' : r.pos === 2 ? 'bg-white text-ink' : r.pos === 3 ? 'bg-celeste text-ink' : 'text-white/70'
                      }`}
                    >
                      {r.pos}
                    </span>
                  </td>
                  <td className="py-3 font-display text-xs font-bold text-white/60 italic">#{r.number}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <FlagAR />
                      <div className="min-w-0">
                        <p className="truncate font-display text-[13px] font-bold text-white uppercase">{r.name}</p>
                        <p className="text-xs text-white/40">{r.city}</p>
                      </div>
                    </div>
                  </td>
                  {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => {
                    const p = r.points[i]
                    const future = i >= played
                    return (
                      <td key={i} className={`py-3 text-center tabular-nums ${p === 25 ? 'font-bold text-verde' : 'text-white/70'}`}>
                        {future ? <span className="text-white/15">·</span> : p == null ? <span className="text-white/25">—</span> : p}
                      </td>
                    )
                  })}
                  <td className="bg-red/10 py-3 text-center font-display text-base font-black text-white tabular-nums">{r.total}</td>
                  <td className="py-3 pr-4 text-right text-xs text-white/45 tabular-nums">{r.gap === 0 ? '—' : `-${r.gap}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollRow>
        <p className="mt-4 text-xs text-white/40">
          Puntaje por fecha: 25 · 20 · 16 · 13 · 11 · 10 · 9 · 8 · 7 · 6 · 5 · 4 · 3. En verde, victorias. "—" indica que el piloto no participó.
        </p>
      </section>
    </Layout>
  )
}
