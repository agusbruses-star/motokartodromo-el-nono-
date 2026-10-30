import { standings, type StandingRow } from './standings'

export type RankedRow = StandingRow & { pos: number; total: number; wins: number; gap: number }

export function rankCategory(slug: string): RankedRow[] {
  const rows = standings[slug] ?? []
  const ranked = rows
    .map((r) => ({
      ...r,
      total: r.points.reduce<number>((a, p) => a + (p ?? 0), 0),
      wins: r.points.filter((p) => p === 25).length,
    }))
    .sort((a, b) => b.total - a.total || b.wins - a.wins)
  const leader = ranked[0]?.total ?? 0
  return ranked.map((r, i) => ({ ...r, pos: i + 1, gap: leader - r.total }))
}
