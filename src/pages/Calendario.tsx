import { CALENDAR, SITE, href, img } from '@/data/site'
import { Layout, PageHero, RedButton, SectionTitle } from '@/components/Layout'
import { FlagAR } from '@/components/Flag'
import { TrackMap } from '@/components/TrackMap'

const statusLabel = { done: 'Finalizada', next: 'Próxima', upcoming: 'Programada' }

export default function Calendario() {
  const next = CALENDAR.find((r) => r.status === 'next')
  return (
    <Layout page="calendario">
      <PageHero kicker={SITE.season} title={<>Calendario</>} photo={img('foto-16.jpg')}>
        Ocho fechas, todas en Argentina. Seguí el campeonato de punta a punta y no te pierdas ninguna largada.
      </PageHero>

      <section className="mx-auto grid max-w-7xl gap-14 px-5 py-12 sm:px-6 sm:py-20 md:px-10 lg:grid-cols-[1fr_360px]">
        <div>
          <SectionTitle
            kicker="Fechas 1–8"
            title={
              <>
                Temporada <span className="text-celeste">2026</span>
              </>
            }
          />
          <p data-reveal className="mt-4 font-display text-[11px] font-bold tracking-[0.24em] text-celeste uppercase">
            Domingos · Pruebas 8:00 · Finales desde 13:00
          </p>
          <ol className="mt-8 border-t border-line">
            {CALENDAR.map((r, i) => (
              <li
                key={r.round}
                data-reveal
                style={{ ['--d' as string]: `${i * 50}ms` }}
                className={`grid min-h-16 grid-cols-[56px_auto_1fr] items-center gap-3 border-b border-line py-4 sm:grid-cols-[90px_60px_auto_1fr_auto] sm:gap-6 ${
                  r.status === 'next' ? 'bg-amarillo/10 shadow-[inset_3px_0_0_var(--color-amarillo)]' : ''
                } ${r.status === 'done' ? 'opacity-70' : ''}`}
              >
                <span className="pl-3 font-display text-xs font-bold text-white/80 sm:text-sm">{r.date}</span>
                <span className="hidden font-display text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase sm:block">F{r.round}</span>
                <FlagAR />
                <span className="min-w-0">
                  <span className="block truncate font-display text-sm font-black text-white uppercase">{r.city}</span>
                  <span className="block truncate text-xs text-white/50 sm:inline">{r.layout}</span>
                </span>
                <span
                  className={`clip-btn col-start-3 mr-3 w-fit px-3 py-1 font-display sm:col-start-auto text-[9px] font-bold tracking-[0.18em] uppercase ${
                    r.status === 'next' ? 'bg-amarillo text-ink' : r.status === 'done' ? 'text-verde shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25)]' : 'bg-white/10 text-white/80'
                  }`}
                >
                  {statusLabel[r.status]}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm text-white/45">Las fechas pueden modificarse por condiciones climáticas. Cualquier cambio se comunica por nuestras redes.</p>
        </div>

        {next && (
          <aside data-reveal="right" className="self-start lg:sticky lg:top-28">
            <div className="clip-card bg-white p-6 text-ink sm:p-8">
              <p className="font-display text-[10px] font-bold tracking-[0.3em] text-red uppercase">Próxima fecha</p>
              <p className="mt-3 font-display text-5xl font-black italic">{next.date}</p>
              <p className="mt-2 font-display text-sm font-bold uppercase">
                Fecha {next.round} · {next.layout}
              </p>
              <TrackMap className="mt-6 w-full text-red" />
              <p className="mt-4 flex items-center gap-2 text-sm text-ink/60">
                <FlagAR className="h-3 w-[18px]" />
                {SITE.address}
              </p>
            </div>
            <div className="mt-6">
              <RedButton href={href('posiciones/index.html')}>Ver posiciones</RedButton>
            </div>
          </aside>
        )}
      </section>
    </Layout>
  )
}
