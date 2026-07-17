// "Add to calendar" helpers for equipment bookings — Phase 1 of calendar
// integration. No OAuth, no APIs: Google/Outlook use their public template
// URLs, and the .ics download covers Apple Calendar, desktop Outlook and
// everything else. All times are emitted in UTC (Z) — calendar apps convert
// to the user's local zone.

function toCalUtc(iso) {
  // 2026-07-17T14:30:00.000Z -> 20260717T143000Z
  return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

function bookingSummary(booking, eqName) {
  return `Lab booking: ${eqName || 'Equipment'}`
}

function bookingDescription(booking) {
  const parts = []
  if (booking.title) parts.push(`Purpose: ${booking.title}`)
  if (booking.notes) parts.push(`Notes: ${booking.notes}`)
  parts.push('Booked via LabHive — https://labhive.app')
  return parts.join('\n')
}

export function googleCalUrl(booking, eqName) {
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: bookingSummary(booking, eqName),
    dates: `${toCalUtc(booking.start_time)}/${toCalUtc(booking.end_time)}`,
    details: bookingDescription(booking),
  })
  return `https://calendar.google.com/calendar/render?${p.toString()}`
}

export function outlookCalUrl(booking, eqName) {
  const p = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: bookingSummary(booking, eqName),
    startdt: new Date(booking.start_time).toISOString(),
    enddt: new Date(booking.end_time).toISOString(),
    body: bookingDescription(booking),
  })
  // outlook.office.com handles work/school accounts; personal accounts get
  // redirected by Microsoft to outlook.live.com automatically.
  return `https://outlook.office.com/calendar/0/deeplink/compose?${p.toString()}`
}

// Escape per RFC 5545: backslash, semicolon, comma, newline
function icsEscape(s) {
  return String(s || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n')
}

export function downloadIcs(booking, eqName) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//LabHive//Equipment Booking//EN',
    'BEGIN:VEVENT',
    `UID:booking-${booking.id}@labhive.app`,
    `DTSTAMP:${toCalUtc(new Date().toISOString())}`,
    `DTSTART:${toCalUtc(booking.start_time)}`,
    `DTEND:${toCalUtc(booking.end_time)}`,
    `SUMMARY:${icsEscape(bookingSummary(booking, eqName))}`,
    `DESCRIPTION:${icsEscape(bookingDescription(booking))}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `labhive-booking-${(eqName || 'equipment').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.ics`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
