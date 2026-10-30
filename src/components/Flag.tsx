// Bandera argentina en SVG (celeste, blanco, celeste con Sol de Mayo simplificado).
export function FlagAR({ className = 'h-4 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 20" className={`${className} shrink-0 shadow-[0_0_0_1px_rgba(255,255,255,0.12)]`} role="img" aria-label="Argentina">
      <rect width="30" height="20" fill="#74ACDF" />
      <rect y="6.67" width="30" height="6.67" fill="#fff" />
      <g fill="#F6B40E">
        <circle cx="15" cy="10" r="1.7" />
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={i} x="14.7" y="6.9" width="0.6" height="1.4" transform={`rotate(${i * 45} 15 10)`} />
        ))}
      </g>
    </svg>
  )
}
