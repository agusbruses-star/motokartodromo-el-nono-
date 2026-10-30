import { useEffect, useRef, useState, type ReactNode } from 'react'
import { NAV, SITE, href, type PageKey } from '@/data/site'
import { Logo } from './Logo'
import { IconClose, IconFacebook, IconInstagram, IconMail, IconPin, IconYoutube } from './Icons'
import { useReveal, useScrollY } from './useScrollEffects'

function Header({ page }: { page: PageKey }) {
  const y = useScrollY()
  const [open, setOpen] = useState(false)
  const solid = y > 40 || page !== 'inicio'
  const floating = y > 40
  // Hide while scrolling down, reveal while scrolling up (with a small threshold).
  const [hidden, setHidden] = useState(false)
  const last = useRef(0)
  useEffect(() => {
    const d = y - last.current
    if (Math.abs(d) < 6) return
    setHidden(d > 0 && y > 160)
    last.current = y
  }, [y])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <>
      {/* Solid strip behind the iPhone notch / status bar so content never shows through */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-[var(--safe-top)] bg-ink" aria-hidden />
      <header
        className={`header-anim fixed inset-x-0 top-[var(--safe-top)] z-50 transition-[transform,padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          hidden && !open ? 'header-hidden' : ''
        } ${floating ? 'px-3 pt-2 lg:px-6 lg:pt-3' : 'px-0 pt-0'}`}
      >
        <div
          className={`relative mx-auto overflow-hidden transition-[max-width,height,background-color,box-shadow,backdrop-filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            floating
              ? 'h-14 bg-ink/75 shadow-[0_20px_45px_-18px_rgba(0,0,0,0.9),inset_0_0_0_1px_rgba(255,255,255,0.08)] backdrop-blur-xl backdrop-saturate-150 lg:h-16'
              : solid
                ? 'h-16 bg-ink/95 shadow-[0_1px_0_var(--color-line)] lg:h-[72px]'
                : 'h-16 bg-ink/60 backdrop-blur-md lg:h-[72px] lg:bg-transparent lg:backdrop-blur-none'
          }`}
          style={{ maxWidth: floating ? '80rem' : '100%' }}
        >
          <div className="flex h-full items-stretch">
            <a href={href()} className="clip-slant-r relative flex items-center bg-red pr-12 pl-3 sm:pl-5 lg:pr-16" aria-label="Inicio · El Nono">
              {/* dark plate keeps the municipal emblem colors clean; red edge keeps the racing look */}
              <span className="clip-slant-r absolute inset-y-0 left-0 right-[5px] bg-coal" aria-hidden />
              <span className="relative">
                <Logo />
              </span>
            </a>
            <nav className="ml-auto hidden items-center gap-0.5 pr-3 lg:flex xl:pr-4" aria-label="Principal">
              {NAV.map((n) => {
                const active = page === n.key
                return (
                  <a
                    key={n.key}
                    href={href(n.path)}
                    aria-current={active ? 'page' : undefined}
                    className={`group relative px-3.5 py-2 font-display text-[11px] font-bold tracking-[0.18em] uppercase transition-colors xl:px-4 ${active ? 'text-white' : 'text-white/60 hover:text-white'}`}
                  >
                    {n.label}
                    <span
                      className={`absolute inset-x-3.5 bottom-0.5 h-[2px] origin-left bg-red transition-transform duration-300 xl:inset-x-4 ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
                    />
                  </a>
                )
              })}
              <a
                href={href('contacto/index.html')}
                className="clip-btn ml-4 bg-red px-5 py-2.5 font-display text-[11px] font-bold tracking-[0.18em] text-white uppercase transition-colors hover:bg-white hover:text-ink"
              >
                Inscribite
              </a>
            </nav>
            <button
              className="ml-auto grid w-14 place-items-center text-white transition-colors active:bg-white/10 lg:hidden"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-label="Abrir menú"
            >
              <span className="flex w-6 flex-col items-end gap-[5px]" aria-hidden>
                <span className="h-[2px] w-6 bg-white" />
                <span className="h-[2px] w-4 bg-red" />
                <span className="h-[2px] w-6 bg-white" />
              </span>
            </button>
          </div>
        </div>

      {open && (
        <div className="page-enter fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-ink pt-[var(--safe-top)] pb-[env(safe-area-inset-bottom)] lg:hidden">
          <div className="flex h-16 shrink-0 items-stretch">
            <span className="flex items-center pl-3">
              <Logo />
            </span>
            <button className="ml-auto grid w-16 place-items-center text-white" onClick={() => setOpen(false)} aria-label="Cerrar menú">
              <IconClose />
            </button>
          </div>
          <nav className="flex flex-1 flex-col justify-center gap-1 px-6 py-6" aria-label="Principal móvil">
            {NAV.map((n, i) => (
              <a
                key={n.key}
                href={href(n.path)}
                className={`flex min-h-14 items-center gap-4 border-b border-line py-3 font-display text-xl sm:text-2xl font-black uppercase italic ${page === n.key ? 'text-red' : 'text-white'}`}
              >
                <span className="font-sans text-xs text-white/40 not-italic">0{i + 1}</span>
                {n.label}
              </a>
            ))}
            <a href={href('contacto/index.html')} className="clip-btn mt-8 bg-red py-4 text-center font-display text-xs font-bold tracking-[0.22em] text-white uppercase">
              Inscribite
            </a>
          </nav>
        </div>
      )}
    </header>
    </>
  )
}

function Footer() {
  return (
    <footer className="relative border-t-4 border-red bg-black">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:px-10">
        <div>
          <Logo size="lg" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">
            Pista, paddock y comunidad. El campeonato que reúne a pilotos de todo el NOA en siete categorías, fecha a fecha.
          </p>
        </div>
        <div>
          <h3 className="font-display text-[11px] font-bold tracking-[0.28em] text-red uppercase">Secciones</h3>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {NAV.map((n) => (
              <li key={n.key}>
                <a href={href(n.path)} className="text-white/70 transition-colors hover:text-white">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display text-[11px] font-bold tracking-[0.28em] text-red uppercase">Contacto</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li className="flex items-center gap-3">
              <IconMail className="size-4 text-red" />
              {SITE.email}
            </li>
            <li className="flex items-start gap-3">
              <IconPin className="mt-0.5 size-4 text-red" />
              {SITE.address}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:px-10">
          <p className="font-display text-[10px] tracking-[0.2em] text-white/40 uppercase">
            © {new Date().getFullYear()} {SITE.name} · {SITE.season}
          </p>
          <div className="flex items-center gap-3">
            <span className="font-display text-[10px] font-bold tracking-[0.3em] text-white/70 uppercase">Seguinos</span>
            {[
              { I: IconInstagram, l: 'Instagram', h: SITE.instagram },
              { I: IconFacebook, l: 'Facebook', h: SITE.facebook },
              { I: IconYoutube, l: 'YouTube', h: SITE.youtube },
            ].map(({ I, l, h }) => (
              <a key={l} href={h} aria-label={l} className="clip-btn grid h-11 w-12 place-items-center bg-red text-white transition-colors hover:bg-white hover:text-ink">
                <I />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export function Layout({ page, children }: { page: PageKey; children: ReactNode }) {
  useReveal()
  return (
    <>
      <Header page={page} />
      <main className="page-enter">{children}</main>
      <Footer />
    </>
  )
}

/** Section heading in the style "PEQUEÑO / GRANDE" with a red accent. */
export function SectionTitle({ kicker, title, className = '', align = 'left' }: { kicker: string; title: ReactNode; className?: string; align?: 'left' | 'center' }) {
  return (
    <div data-reveal className={`${align === 'center' ? 'text-center' : ''} ${className}`}>
      <p className={`flex items-center gap-3 font-display text-[11px] font-bold tracking-[0.32em] text-red uppercase ${align === 'center' ? 'justify-center' : ''}`}>
        <span className="h-[2px] w-8 bg-red" />
        {kicker}
      </p>
      <h2 className="mt-3 font-display text-3xl leading-[1.05] font-black text-white uppercase italic sm:text-4xl lg:text-5xl">{title}</h2>
    </div>
  )
}

/** Hero for inner pages: dark photo, red slanted bars (reference 2 style). */
export function PageHero({ kicker, title, photo, children }: { kicker: string; title: ReactNode; photo: string; children?: ReactNode }) {
  const y = useScrollY()
  return (
    <section className="clip-hero relative isolate overflow-hidden bg-ink pt-[var(--header-h)]">
      <img
        src={photo}
        alt=""
        className="absolute inset-0 -z-20 h-[120%] w-full object-cover opacity-40 grayscale-[35%]"
        style={{ transform: `translate3d(0, ${y * 0.25}px, 0)` }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/80 to-ink/30" />
      <div className="absolute inset-y-0 right-0 -z-10 hidden w-[18vw] origin-bottom skew-x-[-14deg] translate-x-1/3 bg-red md:block" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-px bg-gradient-to-r from-red via-red/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-5 pt-12 pb-20 sm:px-6 md:px-10 md:pt-28 md:pb-36">
        <p data-reveal className="flex items-center gap-3 font-display text-xs font-bold tracking-[0.32em] text-red uppercase">
          <span className="h-[2px] w-10 bg-red" />
          {kicker}
        </p>
        <h1 data-reveal style={{ ['--d' as string]: '80ms' }} className="mt-4 max-w-4xl font-display text-[2.4rem] leading-[0.98] break-words font-black text-white uppercase italic sm:text-6xl lg:text-7xl">
          {title}
        </h1>
        {children && (
          <div data-reveal style={{ ['--d' as string]: '160ms' }} className="mt-6 max-w-xl text-base leading-relaxed text-white/70">
            {children}
          </div>
        )}
      </div>
    </section>
  )
}

export function RedButton({ href: h, children, variant = 'red' }: { href: string; children: ReactNode; variant?: 'red' | 'outline' | 'dark' }) {
  const styles = {
    red: 'bg-red text-white hover:bg-white hover:text-ink',
    dark: 'bg-ink text-white hover:bg-red',
    outline: 'text-white shadow-[inset_0_0_0_1.5px_white] hover:bg-white hover:text-ink',
  }[variant]
  return (
    <a href={h} className={`clip-btn group inline-flex items-center gap-3 px-6 py-3 font-display text-[11px] font-bold tracking-[0.22em] uppercase transition-colors ${styles}`}>
      {children}
      <span className="transition-transform group-hover:translate-x-1">→</span>
    </a>
  )
}
