// Thin-stroke line icons — replaces OS emoji in UI chrome so elements render
// identically on every platform (Mac/Windows/iOS/Android). Same style as the
// Login selector-card SVGs: 1.7px stroke, rounded caps, inherits currentColor.
// Usage: <IconAlert size={16} /> — color via parent `color` or style prop.

function Icon({ children, size = 18, style, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      style={{ flexShrink: 0, ...style }} {...rest}>
      {children}
    </svg>
  )
}

export const IconQr = (p) => (
  <Icon {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17.5 20H21"/>
  </Icon>
)

export const IconAlert = (p) => (
  <Icon {...p}>
    <path d="M12 3.5 2.5 20h19L12 3.5z"/><path d="M12 10v4.5"/><path d="M12 17.4v.1"/>
  </Icon>
)

export const IconEye = (p) => (
  <Icon {...p}>
    <path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12z"/>
    <circle cx="12" cy="12" r="2.8"/>
  </Icon>
)

export const IconEyeOff = (p) => (
  <Icon {...p}>
    <path d="M4 4l16 16"/>
    <path d="M9.9 5.8A10 10 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17.6 17.6 0 0 1-2.4 3.2M6.6 6.9C4 8.8 2.5 12 2.5 12s3.5 6.5 9.5 6.5c1.5 0 2.8-.4 4-1"/>
    <path d="M9.6 9.8a2.8 2.8 0 0 0 3.9 4"/>
  </Icon>
)

export const IconCheckCircle = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9"/><path d="m8.5 12.2 2.4 2.4 4.6-5"/>
  </Icon>
)

export const IconSparkle = (p) => (
  <Icon {...p}>
    <path d="M12 4.5l1.6 4.2 4.2 1.6-4.2 1.6L12 16.1l-1.6-4.2-4.2-1.6 4.2-1.6z"/>
    <path d="M19 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>
  </Icon>
)

export const IconInfo = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 7.9v.1"/>
  </Icon>
)

export const IconMail = (p) => (
  <Icon {...p}>
    <rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/>
  </Icon>
)
