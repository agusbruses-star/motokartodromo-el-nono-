export function TrackMap({ className = '' }: { className?: string }) {
  const d =
    'M30 120 C30 90 60 86 90 88 L170 92 C200 94 206 70 190 58 C176 48 182 26 206 26 L300 30 C330 32 336 60 312 72 L268 92 C250 102 262 122 286 118 L330 110 C356 106 362 140 336 146 L90 152 C56 154 30 148 30 120 Z'
  return (
    <svg viewBox="0 0 380 180" className={className} fill="none" aria-hidden>
      <path d={d} stroke="currentColor" strokeOpacity="0.15" strokeWidth="14" strokeLinejoin="round" />
      <path d={d} stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" />
      <path d={d} stroke="white" strokeWidth="1" strokeDasharray="4 8" strokeLinejoin="round" opacity="0.6" />
      <g transform="translate(20 92)">
        <rect width="3" height="30" fill="currentColor" />
        <rect x="3" width="20" height="14" fill="white" stroke="currentColor" strokeWidth="1.5" />
        <rect x="3" width="5" height="3.5" fill="currentColor" />
        <rect x="13" width="5" height="3.5" fill="currentColor" />
        <rect x="8" y="3.5" width="5" height="3.5" fill="currentColor" />
        <rect x="18" y="3.5" width="5" height="3.5" fill="currentColor" />
        <rect x="3" y="7" width="5" height="3.5" fill="currentColor" />
        <rect x="13" y="7" width="5" height="3.5" fill="currentColor" />
        <rect x="8" y="10.5" width="5" height="3.5" fill="currentColor" />
        <rect x="18" y="10.5" width="5" height="3.5" fill="currentColor" />
      </g>
    </svg>
  )
}
