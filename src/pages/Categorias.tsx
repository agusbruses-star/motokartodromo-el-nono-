import { CATEGORIES, href, img } from '@/data/site'
import { rankCategory } from '@/data/compute'
import { Layout, PageHero } from '@/components/Layout'
import { FlagAR } from '@/components/Flag'

export default function Categorias() {
  return (
    <Layout page="categorias">
      <PageHero kicker="7 categorías" title="Categorías" photo={img('foto-17.jpg')}>
        Desde los más chicos en la Escuela hasta la potencia de la Súper 150. Cada categoría tiene su grilla, su reglamento y su campeón.
      </PageHero>

      <section className="mx-auto max-w-7xl space-y-6 px-5 py-12 sm:px-6 sm:py-20 md:px-10">
        {CATEGORIES.map((c, i) => {
          const leader = rankCategory(c.slug)[0]
          const flip = i % 2 === 1
          return (
            <article key={c.slug} id={c.slug} className={`group grid items-stretch overflow-hidden bg-coal md:grid-cols-2 ${flip ? 'md:[&>*:first-child]:order-2' : ''}`}>
              <div data-reveal={flip ? 'right' : 'left'} className="relative min-h-[260px] overflow-hidden">
                <img src={img(c.photo)} alt={`Categoría ${c.name}`} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                <span className="absolute bottom-4 left-6 font-display text-7xl font-black text-white/20 italic">0{i + 1}</span>
                <div className={`stripes-red absolute top-0 h-full w-14 opacity-90 ${flip ? 'left-0' : 'right-0'}`} />
              </div>
              <div data-reveal className="flex flex-col justify-center p-6 sm:p-8 md:p-12">
                <p className="font-display text-[10px] font-bold tracking-[0.3em] text-red uppercase">
                  {c.engine} · {c.age}
                </p>
                <h2 className="mt-3 font-display text-3xl font-black text-white uppercase italic sm:text-4xl">{c.name}</h2>
                <p className="mt-4 max-w-md leading-relaxed text-white/65">{c.description}</p>
                {leader && (
                  <div className="mt-6 flex items-center gap-3 border-t border-line pt-5 text-sm">
                    <span className="font-display text-[10px] font-bold tracking-[0.2em] text-white/45 uppercase">Líder</span>
                    <FlagAR />
                    <span className="font-display font-bold text-white uppercase">{leader.name}</span>
                    <span className="ml-auto font-display font-black text-white">
                      {leader.total} <span className="text-[10px] text-red">PTS</span>
                    </span>
                  </div>
                )}
                <a
                  href={href(`posiciones/index.html?cat=${c.slug}`)}
                  className="clip-btn mt-6 inline-flex min-h-11 w-full items-center justify-center sm:w-fit gap-3 bg-red px-6 py-3 font-display text-[11px] font-bold tracking-[0.22em] text-white uppercase transition-colors hover:bg-white hover:text-ink"
                >
                  Tabla de posiciones →
                </a>
              </div>
            </article>
          )
        })}
      </section>
    </Layout>
  )
}
