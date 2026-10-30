type P = { className?: string }
const base = 'fill-none stroke-current'

export const IconArrow = ({ className = 'size-4' }: P) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeWidth={2.2}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)
export const IconMail = ({ className = 'size-4' }: P) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeWidth={2}>
    <rect x="3" y="5" width="18" height="14" />
    <path d="m3 6 9 7 9-7" />
  </svg>
)
export const IconPin = ({ className = 'size-4' }: P) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeWidth={2}>
    <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
)
export const IconPhone = ({ className = 'size-4' }: P) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeWidth={2}>
    <path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z" />
  </svg>
)
export const IconClock = ({ className = 'size-4' }: P) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeWidth={2}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
)
export const IconInstagram = ({ className = 'size-4' }: P) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeWidth={2}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
  </svg>
)
export const IconFacebook = ({ className = 'size-4' }: P) => (
  <svg viewBox="0 0 24 24" className={`fill-current ${className}`}>
    <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8.5c0-.3.2-.5.5-.5Z" />
  </svg>
)
export const IconYoutube = ({ className = 'size-4' }: P) => (
  <svg viewBox="0 0 24 24" className={`fill-current ${className}`}>
    <path d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12 31 31 0 0 0 2 15.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .4-3.8 31 31 0 0 0-.4-3.8ZM10 15V9l5.2 3L10 15Z" />
  </svg>
)
export const IconMenu = ({ className = 'size-6' }: P) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeWidth={2.2}>
    <path d="M3 7h18M3 12h18M3 17h18" />
  </svg>
)
export const IconClose = ({ className = 'size-6' }: P) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeWidth={2.2}>
    <path d="M5 5l14 14M19 5 5 19" />
  </svg>
)
