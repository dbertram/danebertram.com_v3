const monthYearFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

export function parseYearMonth(value) {
  if (!value) {
    return null
  }

  const match = /^(\d{4})-(\d{2})$/.exec(value)
  if (!match) {
    return null
  }

  const year = Number(match[1])
  const month = Number(match[2])
  if (month < 1 || month > 12) {
    return null
  }

  return new Date(Date.UTC(year, month - 1, 1))
}

export function formatMonthYear(value) {
  if (!value) {
    return ''
  }

  const date = value instanceof Date ? value : parseYearMonth(value)
  if (!date) {
    return value
  }

  return monthYearFormatter.format(date)
}
