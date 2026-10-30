import { useEffect, useState } from 'react'
import { GALLERY, img } from '@/data/site'
import { Layout, PageHero } from '@/components/Layout'
import { IconClose } from '@/components/Icons'

export default function Galeria() {
  const [open, setOpen] = useState<number | null>(null)

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') setOpen((o) => (o === null ? o : (o + 1) % GALLERY.length))
      if (e.key === 'ArrowLeft') setOpen((o) => (o === null ? o : (o - 1 + GALLERY.length) % GALLERY.length))
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <Layout page="galeria">
      <PageHero kicker="Paddock & pista" title="Galería" photo={img('foto-21.jpg')}>
        Las mejores imágenes del campeonato: largadas, boxes y la gente que hace posible cada fecha.
      </PageHero>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-20 md:px-10">
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {GALLERY.map((g, i) => (
            <button
              key={g.src}
              data-reveal
              style={{ ['--d' as string]: `${(i % 3) * 90}ms` }}
              onClick={() => setOpen(i)}
              className="group relative mb-4 block w-full overflow-hidden break-inside-avoid"
              aria-label={`Ampliar: ${g.alt}`}
            >
              <img src={img(g.src)} alt={g.alt} loading="lazy" className={`w-full object-cover transition duration-700 group-hover:scale-105 ${i % 3 === 1 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`} />
              <span className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="absolute bottom-0 left-0 h-1 w-0 bg-red transition-all duration-500 group-hover:w-full" />
              <span className="absolute bottom-4 left-4 translate-y-2 text-left font-display text-xs font-bold text-white uppercase opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                {g.alt}
              </span>
            </button>
          ))}
        </div>
      </section>

      {open !== null && (
        <div className="page-enter fixed inset-0 z-[80] flex items-center justify-center bg-black/95 p-4" onClick={() => setOpen(null)} role="dialog" aria-modal="true" aria-label={GALLERY[open].alt}>
          <button className="absolute top-[max(1rem,env(safe-area-inset-top))] right-4 grid size-12 place-items-center bg-red text-white" aria-label="Cerrar">
            <IconClose />
          </button>
          <img src={img(GALLERY[open].src)} alt={GALLERY[open].alt} className="max-h-[85vh] max-w-full object-contain" onClick={(e) => e.stopPropagation()} />
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-display text-[11px] tracking-[0.2em] text-white/60 uppercase">
            {open + 1} / {GALLERY.length} · {GALLERY[open].alt}
          </p>
        </div>
      )}
    </Layout>
  )
}
