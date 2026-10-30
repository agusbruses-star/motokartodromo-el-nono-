import { CALENDAR, CATEGORIES, GALLERY, SITE, SPONSORS, href, img } from '@/data/site'
import { rankCategory } from '@/data/compute'
import { Layout, RedButton, SectionTitle } from '@/components/Layout'
import { TrackMap } from '@/components/TrackMap'
import { CategoryRail } from '@/components/CategoryRail'
import { FlagAR } from '@/components/Flag'
import { EMBLEM } from '@/components/Logo'
import { useScrollY } from '@/components/useScrollEffects'
import { ScrollRow } from '@/components/ScrollRow'

function Hero() {
  const y = useScrollY()
  return (
    <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-ink pt-[var(--header-h)]">
      <img
        src={img('foto-13.jpg')}
        alt="Piloto con el kart número 30 acelerando en plena curva"
        className="hero-zoom absolute inset-0 -z-20 h-[115%] w-full object-cover object-[44%_35%] lg:object-[50%_40%]"
        style={{ transform: `translate3d(0, ${y * 0.3}px, 0) scale(${1 + y * 0.0002})` }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/50 to-ink/20 lg:bg-gradient-to-r lg:from-ink/95 lg:via-ink/50 lg:to-ink/10" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-ink to-transparent" />
      <div className="absolute top-[var(--header-h)] right-0 -z-10 hidden h-[calc(100%-var(--header-h))] w-[22vw] origin-top-right skew-x-[-14deg] bg-red/85 mix-blend-multiply lg:block" />

      <div className="absolute top-[calc(var(--header-h)+28px)] right-6 hidden items-center gap-4 md:flex md:right-10" data-reveal="right">
        <span className="text-right font-display leading-tight">
          <span className="block text-[10px] font-bold tracking-[0.3em] text-red uppercase">{SITE.subtitle}</span>
          <span className="block text-sm font-black tracking-[0.15em] text-white">
            {SITE.name} <span className="text-red">2026</span>
          </span>
        </span>
        <img src={EMBLEM} alt="" className="size-24 drop-shadow-[0_8px_24px_rgba(0,0,0,0.7)] lg:size-28" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-5 pt-16 pb-16 sm:px-6 md:px-10 md:pb-32" style={{ transform: `translate3d(0, ${y * -0.12}px, 0)`, opacity: Math.max(0, 1 - y / 700) }}>
        <p data-reveal className="font-display text-sm font-bold tracking-[0.24em] text-red uppercase sm:text-base">{SITE.season}</p>
        <h1 data-reveal style={{ ['--d' as string]: '100ms' }} className="mt-3 font-display text-[12.5vw] leading-[0.92] font-black text-white uppercase sm:text-7xl lg:text-[104px]">
          Pasión
          <br />
          <span className="italic">sobre tierra</span>
        </h1>
        <p data-reveal style={{ ['--d' as string]: '200ms' }} className="mt-6 max-w-md text-base text-white/75 sm:text-lg">
          Siete categorías, ocho fechas y un solo objetivo: cruzar primero la bandera a cuadros.
        </p>
        <div data-reveal style={{ ['--d' as string]: '300ms' }} className="mt-8 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap [&>a]:justify-center">
          <RedButton href={href('posiciones/index.html')}>Ver posiciones</RedButton>
          <RedButton href={href('calendario/index.html')} variant="outline">
            Calendario
          </RedButton>
        </div>
      </div>

    </section>
  )
}

function EventStrip() {
  const next = CALENDAR.find((r) => r.status === 'next') ?? CALENDAR[CALENDAR.length - 1]
  return (
    <section className="relative grid lg:grid-cols-[1.35fr_1fr]">
      <div className="relative bg-white text-ink">
        <div className="grid gap-6 px-5 py-10 sm:grid-cols-[auto_1fr] sm:gap-8 sm:px-6 md:px-10 lg:py-14 lg:pr-28">
          <div data-reveal="left">
            <h2 className="font-display text-2xl font-black tracking-tight">Próxima fecha</h2>
            <TrackMap className="mt-4 w-full max-w-64 text-red sm:mt-6" />
          </div>
          <div data-reveal style={{ ['--d' as string]: '120ms' }} className="self-center">
            <p className="font-sans text-sm font-semibold text-red italic">
              {next.weekday} {next.date} · 9:00 hs
            </p>
            <h3 className="mt-2 font-display text-xl leading-snug font-black">
              Fecha {next.round} · {SITE.season}
              <br />
              {next.layout}
            </h3>
            <p className="mt-3 flex items-center gap-2 text-sm text-ink/60">
              <FlagAR className="h-3 w-[18px]" />
              {SITE.address}
            </p>
            <div className="mt-6">
              <RedButton href={href('calendario/index.html')}>Detalles</RedButton>
            </div>
          </div>
        </div>
        <div className="absolute top-0 -right-px bottom-0 hidden w-28 lg:block" aria-hidden>
          <div className="h-full w-full bg-[linear-gradient(110deg,white_0_40%,var(--color-red)_40%_48%,white_48%_56%,var(--color-red)_56%_64%,transparent_64%)]" />
        </div>
      </div>
      <div className="relative isolate overflow-hidden bg-graphite">
        <img src={img('foto-30.jpg')} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30 grayscale" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/70 to-ink/30" />
        <div data-reveal="right" className="px-5 py-10 sm:px-6 md:px-10 lg:py-14">
          <p className="font-display text-sm font-bold tracking-[0.2em] text-red uppercase">Sobre</p>
          <h2 className="font-display text-2xl font-black text-white uppercase">El kartódromo</h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
            Un circuito de tierra con tres trazados, paddock techado y una comunidad de familias, mecánicos y pilotos que cada fecha llenan la grilla. Del primer día en la
            Escuela hasta la Súper 150, acá se corre en serio.
          </p>
          <div className="mt-6 grid max-w-sm grid-cols-3 gap-4 border-t border-white/15 pt-5">
            {[
              ['7', 'Categorías'],
              ['8', 'Fechas'],
              ['80+', 'Pilotos'],
            ].map(([n, l]) => (
              <div key={l}>
                <p className="font-display text-2xl font-black text-white">{n}</p>
                <p className="text-[11px] tracking-[0.18em] text-white/50 uppercase">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Leaders() {
  return (
    <section className="relative overflow-hidden bg-ink py-16 sm:py-24">
      <div className="hairline-red absolute top-0 left-0 h-px w-2/3" />
      <div className="mx-auto max-w-7xl px-5 sm:px-6 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionTitle
            kicker="Tras 5 fechas"
            title={
              <>
                Líderes del
                <br />
                campeonato
              </>
            }
          />
          <div data-reveal>
            <RedButton href={href('posiciones/index.html')} variant="outline">
              Tabla completa
            </RedButton>
          </div>
        </div>
        <div className="mt-12 border-t border-line">
          {CATEGORIES.map((c, i) => {
            const top = rankCategory(c.slug)
            const l = top[0]
            return (
              <a
                key={c.slug}
                href={href(`posiciones/index.html?cat=${c.slug}`)}
                data-reveal
                style={{ ['--d' as string]: `${i * 60}ms` }}
                className="group grid min-h-16 grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-line py-3 active:bg-graphite sm:gap-4 sm:py-4 transition-colors hover:bg-graphite sm:grid-cols-[150px_auto_1fr_auto_auto] sm:gap-6 sm:px-4"
              >
                <span className="hidden font-display text-[11px] font-bold tracking-[0.2em] text-white/50 uppercase sm:block">{c.name}</span>
                <span className="clip-btn grid h-9 w-12 place-items-center bg-red font-display text-sm font-black text-white italic">{l.number}</span>
                <span className="min-w-0">
                  <span className="flex items-center gap-3">
                    <FlagAR />
                    <span className="truncate font-display text-sm font-bold text-white uppercase sm:text-base">{l.name}</span>
                  </span>
                  <span className="mt-1 block text-xs text-white/45 sm:hidden">{c.name}</span>
                </span>
                <span className="hidden text-xs text-white/40 md:block">+{top[1]?.gap ?? 0} pts sobre el 2.º</span>
                <span className="text-right font-display text-lg font-black text-white">
                  {l.total}
                  <span className="ml-1 text-[10px] font-bold text-red">PTS</span>
                </span>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function GalleryStrip() {
  return (
    <section className="overflow-hidden bg-coal py-16 sm:py-24">
      <div className="mx-auto mb-8 flex max-w-7xl flex-wrap items-end justify-between gap-6 px-5 sm:mb-12 sm:px-6 md:px-10">
        <SectionTitle kicker="Galería" title="Desde el paddock" />
        <div data-reveal>
          <RedButton href={href('galeria/index.html')}>Ver galería</RedButton>
        </div>
      </div>
      <ScrollRow label="Fotos del paddock">
        <div className="flex w-max gap-3 px-5 sm:gap-4 sm:px-6 md:px-10">
          {GALLERY.map((p, i) => (
            <a key={p.src} href={href('galeria/index.html')} className="block shrink-0 snap-start scroll-ml-5 overflow-hidden">
              <img src={img(p.src)} alt={p.alt} loading="lazy" className={`h-56 w-[80vw] max-w-[30rem] object-cover transition duration-700 hover:scale-105 sm:h-80 ${i % 2 ? 'sm:mt-10' : ''}`} />
            </a>
          ))}
        </div>
      </ScrollRow>
    </section>
  )
}

function Sponsors() {
  return (
    <section className="border-y border-line bg-ink py-14">
      <p className="text-center font-display text-[11px] font-bold tracking-[0.32em] text-white/50 uppercase">Nuestros sponsors</p>
      <div className="mt-8 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
        <div className="marquee flex w-max gap-16">
          {[...SPONSORS, ...SPONSORS].map((s, i) => (
            <span key={i} className="font-display text-2xl font-black whitespace-nowrap text-white/35 uppercase italic transition-colors hover:text-white">
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="relative isolate overflow-hidden bg-red">
      <img src={img('foto-21.jpg')} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-25 mix-blend-multiply" />
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-5 py-16 sm:px-6 sm:py-20 md:flex-row md:items-center md:px-10">
        <h2 data-reveal className="font-display text-3xl leading-tight font-black text-white uppercase italic sm:text-5xl">
          ¿Listo para
          <br />
          largar?
        </h2>
        <div data-reveal style={{ ['--d' as string]: '120ms' }} className="max-w-sm">
          <p className="text-white/85">Inscripciones abiertas para todas las categorías. Consultá por alquiler de karts y días de prueba.</p>
          <div className="mt-6">
            <RedButton href={href('contacto/index.html')} variant="dark">
              Contactanos
            </RedButton>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function App() {
  return (
    <Layout page="inicio">
      <Hero />
      <EventStrip />
      <CategoryRail />
      <Leaders />
      <GalleryStrip />
      <Sponsors />
      <CTA />
    </Layout>
  )
}
