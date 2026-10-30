import { useState, type FormEvent } from 'react'
import { CATEGORIES, SITE, img } from '@/data/site'
import { Layout, PageHero } from '@/components/Layout'
import { IconClock, IconMail, IconPhone, IconPin } from '@/components/Icons'

const field = 'w-full border-0 border-b-2 border-line bg-transparent px-0 py-3 text-white placeholder:text-white/30 focus:border-red focus:outline-none text-base rounded-none'

export default function Contacto() {
  const [sent, setSent] = useState(false)
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const d = new FormData(e.currentTarget)
    const body = `Nombre: ${d.get('nombre')}\nTeléfono: ${d.get('telefono')}\nCategoría: ${d.get('categoria')}\n\n${d.get('mensaje')}`
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent('Consulta desde la web')}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  const info = [
    { I: IconPin, l: 'Dirección', v: SITE.address },
    { I: IconMail, l: 'Email', v: SITE.email },
    { I: IconPhone, l: 'Teléfono', v: SITE.phone },
    { I: IconClock, l: 'Horarios', v: SITE.hours },
  ]

  return (
    <Layout page="contacto">
      <PageHero kicker="Inscripciones abiertas" title="Contacto" photo={img('foto-19.jpg')}>
        Inscribite al campeonato, consultá por días de prueba o sumate como sponsor.
      </PageHero>

      <section className="mx-auto grid max-w-7xl gap-14 px-5 py-12 sm:px-6 sm:py-20 md:px-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          {info.map(({ I, l, v }, i) => (
            <div key={l} data-reveal="left" style={{ ['--d' as string]: `${i * 70}ms` }} className="flex items-start gap-4 border-l-2 border-red bg-coal p-5 break-words sm:gap-5 sm:p-6">
              <I className="mt-0.5 size-5 text-red" />
              <div>
                <p className="font-display text-[10px] font-bold tracking-[0.28em] text-white/45 uppercase">{l}</p>
                <p className="mt-1 text-white">{v}</p>
              </div>
            </div>
          ))}
        </div>

        <form data-reveal onSubmit={submit} className="clip-card bg-graphite p-6 sm:p-10">
          <h2 className="font-display text-2xl font-black text-white uppercase italic">Escribinos</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className="font-display text-[10px] font-bold tracking-[0.24em] text-white/50 uppercase">Nombre</span>
              <input name="nombre" required className={field} placeholder="Tu nombre" />
            </label>
            <label className="block">
              <span className="font-display text-[10px] font-bold tracking-[0.24em] text-white/50 uppercase">Teléfono</span>
              <input name="telefono" className={field} placeholder="381 ..." />
            </label>
            <label className="block sm:col-span-2">
              <span className="font-display text-[10px] font-bold tracking-[0.24em] text-white/50 uppercase">Categoría</span>
              <select name="categoria" className={`${field} [&>option]:bg-graphite`}>
                {CATEGORIES.map((c) => (
                  <option key={c.slug}>{c.name}</option>
                ))}
                <option>Sponsor / Otro</option>
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className="font-display text-[10px] font-bold tracking-[0.24em] text-white/50 uppercase">Mensaje</span>
              <textarea name="mensaje" rows={4} required className={`${field} resize-none`} placeholder="Contanos en qué te podemos ayudar" />
            </label>
          </div>
          <button className="clip-btn mt-8 inline-flex w-full items-center justify-center gap-3 sm:w-auto bg-red px-8 py-3.5 font-display text-[11px] font-bold tracking-[0.22em] text-white uppercase transition-colors hover:bg-white hover:text-ink">
            Enviar consulta →
          </button>
          {sent && <p className="mt-4 text-sm text-white/60">Se abrió tu aplicación de correo con el mensaje listo para enviar.</p>}
        </form>
      </section>
    </Layout>
  )
}
