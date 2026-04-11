const monthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  timeZone: 'UTC',
})

function getYearMonthIndex(yearMonth) {
  return yearMonth.year * 12 + (yearMonth.month - 1)
}

function normalizeDisplayMonthCount(totalMonths) {
  return Math.max(1, totalMonths)
}

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

  return { year, month }
}

function formatYearMonthValue(yearMonth) {
  const monthName = monthFormatter.format(
    new Date(Date.UTC(yearMonth.year, yearMonth.month - 1, 1)),
  )
  return `${monthName} ${yearMonth.year}`
}

export function formatMonthYear(value) {
  if (!value) {
    return ''
  }

  const yearMonth =
    typeof value === 'string'
      ? parseYearMonth(value)
      : value && typeof value.year === 'number' && typeof value.month === 'number'
        ? value
        : null

  if (!yearMonth) {
    return value
  }

  return formatYearMonthValue(yearMonth)
}

export function diffInMonths(start, end) {
  const totalMonths = getYearMonthIndex(end) - getYearMonthIndex(start)

  if (totalMonths < 0) {
    throw new Error('End date must not be earlier than start date')
  }

  return totalMonths
}

export function getDurationParts(totalMonths) {
  const normalizedMonths = normalizeDisplayMonthCount(totalMonths)
  const years = Math.floor(normalizedMonths / 12)
  const months = normalizedMonths % 12
  const parts = []

  if (years) {
    parts.push({
      unit: 'year',
      value: years,
      label: years === 1 ? 'year' : 'years',
    })
  }

  if (months || !parts.length) {
    const monthValue = months || 1

    parts.push({
      unit: 'month',
      value: monthValue,
      label: monthValue === 1 ? 'month' : 'months',
    })
  }

  return parts
}

export function formatDuration(totalMonths) {
  return getDurationParts(totalMonths)
    .map(({ value, label }) => `${value} ${label}`)
    .join(', ')
}

export function formatDurationRange(startValue, endValue) {
  const startDate = parseYearMonth(startValue)

  if (!startDate) {
    throw new Error(`Invalid start date: ${startValue}`)
  }

  if (!endValue) {
    return ''
  }

  const endDate = parseYearMonth(endValue)

  if (!endDate) {
    throw new Error(`Invalid end date: ${endValue}`)
  }

  return formatDuration(diffInMonths(startDate, endDate))
}

export function getCurrentLocalYearMonth(now = new Date()) {
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  }
}
