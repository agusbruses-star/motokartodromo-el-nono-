// Datos generales del kartódromo. Editá estos valores para personalizar el sitio.
export const BASE = import.meta.env.BASE_URL
export const href = (path = '') => `${BASE}${path}`
export const img = (name: string) => `${BASE}img/${name}`

export const SITE = {
  name: 'KARTÓDROMO',
  season: 'Campeonato 2026',
  email: 'info@kartodromo.com.ar',
  phone: '+54 9 381 000-0000',
  address: 'Ruta 9, Km 1290 — Tucumán, Argentina',
  hours: 'Sábados y domingos · 8:00 a 19:00',
  instagram: '#',
  facebook: '#',
  youtube: '#',
}

export type PageKey = 'inicio' | 'calendario' | 'categorias' | 'posiciones' | 'galeria' | 'contacto'

export const NAV: { key: PageKey; label: string; path: string }[] = [
  { key: 'inicio', label: 'Inicio', path: 'index.html' },
  { key: 'calendario', label: 'Calendario', path: 'calendario/index.html' },
  { key: 'categorias', label: 'Categorías', path: 'categorias/index.html' },
  { key: 'posiciones', label: 'Posiciones', path: 'posiciones/index.html' },
  { key: 'galeria', label: 'Galería', path: 'galeria/index.html' },
  { key: 'contacto', label: 'Contacto', path: 'contacto/index.html' },
]

// Las 7 categorías del campeonato (nombres provisorios, reemplazables).
export type Category = {
  slug: string
  name: string
  engine: string
  age: string
  description: string
  photo: string
}

export const CATEGORIES: Category[] = [
  { slug: 'escuela', name: 'Escuela', engine: '4T · 6.5 HP', age: '6 a 9 años', description: 'El primer paso en el karting: técnica, seguridad y diversión sobre la pista.', photo: 'foto-115.jpg' },
  { slug: 'cadete', name: 'Cadete', engine: '2T · 60 cc', age: '9 a 12 años', description: 'Primeras peleas de pista y la base para dar el salto a categorías mayores.', photo: 'foto-17.jpg' },
  { slug: 'junior', name: 'Junior', engine: '2T · 125 cc', age: '12 a 15 años', description: 'Más potencia y más estrategia. Donde se forman los futuros campeones.', photo: 'foto-13.jpg' },
  { slug: 'senior', name: 'Senior', engine: '2T · 150 cc', age: '15+ años', description: 'La categoría más competitiva del parque, con grillas completas en cada fecha.', photo: 'foto-14.jpg' },
  { slug: 'master', name: 'Master', engine: '2T · 150 cc', age: '30+ años', description: 'Experiencia y velocidad. Pilotos con trayectoria que siguen buscando el récord.', photo: 'foto-19.jpg' },
  { slug: 'pro-4t', name: 'Pro 4T', engine: '4T · 15 HP', age: '16+ años', description: 'Motores de cuatro tiempos preparados, paridad mecánica y carreras cerradas.', photo: 'foto-16.jpg' },
  { slug: 'super-150', name: 'Súper 150', engine: '2T · 150 cc Libre', age: '18+ años', description: 'La categoría reina: chasis y motores al máximo de su desarrollo.', photo: 'foto-30.jpg' },
]

export const TOTAL_ROUNDS = 8

export type Round = {
  round: number
  date: string
  weekday: string
  layout: string
  city: string
  status: 'done' | 'next' | 'upcoming'
}

export const CALENDAR: Round[] = [
  { round: 1, date: '15 MAR', weekday: 'Domingo', layout: 'Trazado Largo', city: 'Tucumán', status: 'done' },
  { round: 2, date: '12 ABR', weekday: 'Domingo', layout: 'Trazado Corto', city: 'Tucumán', status: 'done' },
  { round: 3, date: '10 MAY', weekday: 'Domingo', layout: 'Trazado Largo', city: 'Tucumán', status: 'done' },
  { round: 4, date: '07 JUN', weekday: 'Domingo', layout: 'Trazado Mixto', city: 'Tucumán', status: 'done' },
  { round: 5, date: '05 JUL', weekday: 'Domingo', layout: 'Trazado Largo', city: 'Tucumán', status: 'done' },
  { round: 6, date: '09 AGO', weekday: 'Domingo', layout: 'Trazado Invertido', city: 'Tucumán', status: 'next' },
  { round: 7, date: '13 SEP', weekday: 'Domingo', layout: 'Trazado Corto', city: 'Tucumán', status: 'upcoming' },
  { round: 8, date: '15 NOV', weekday: 'Domingo', layout: 'Gran Final · Trazado Largo', city: 'Tucumán', status: 'upcoming' },
]

export const SPONSORS = ['Despertares', 'Avícola Don Jorge', 'RGB Rótulos', 'FD Racing', 'Tu marca aquí', 'Kart Parts NOA']

export const GALLERY = [
  { src: 'foto-13.jpg', alt: 'Kart número 30 en plena curva' },
  { src: 'foto-19.jpg', alt: 'Piloto con el kart número 15 en boxes' },
  { src: 'foto-115.jpg', alt: 'Dos karts sobre la pista de tierra' },
  { src: 'foto-16.jpg', alt: 'Grilla de karts lista para largar' },
  { src: 'foto-21.jpg', alt: 'Detalle de la carrocería de un kart con calcos' },
  { src: 'foto-14.jpg', alt: 'Kart rojo número 45 con piloto de casco verde' },
  { src: 'foto-30.jpg', alt: 'Mecánicos ajustando el kart número 13' },
  { src: 'foto-17.jpg', alt: 'Parque cerrado bajo las carpas' },
]
