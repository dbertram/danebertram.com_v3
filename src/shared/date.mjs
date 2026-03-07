const monthYearFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

export function formatMonthYear(value) {
  if (!value) {
    return ''
  }

  const match = /^(\d{4})-(\d{2})$/.exec(value)
  if (!match) {
    return value
  }

  const year = Number(match[1])
  const month = Number(match[2])
  if (month < 1 || month > 12) {
    return value
  }

  return monthYearFormatter.format(new Date(Date.UTC(year, month - 1, 1)))
}
