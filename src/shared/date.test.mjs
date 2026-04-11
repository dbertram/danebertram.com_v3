import { describe, expect, it } from 'vitest'
import {
  diffInMonths,
  formatDuration,
  formatDurationRange,
  formatMonthYear,
  getCurrentLocalYearMonth,
  getDurationParts,
  parseYearMonth,
} from './date.mjs'

describe('parseYearMonth', () => {
  it('parses valid year-month strings', () => {
    expect(parseYearMonth('2021-06')).toEqual({ year: 2021, month: 6 })
  })

  it('returns null for invalid values', () => {
    expect(parseYearMonth('2021-13')).toBeNull()
    expect(parseYearMonth('2021-6')).toBeNull()
    expect(parseYearMonth(null)).toBeNull()
  })
})

describe('diffInMonths', () => {
  it('returns zero for the same month', () => {
    expect(diffInMonths(parseYearMonth('2021-06'), parseYearMonth('2021-06'))).toBe(0)
  })

  it('returns month differences across boundaries', () => {
    expect(diffInMonths(parseYearMonth('2021-06'), parseYearMonth('2021-07'))).toBe(1)
    expect(diffInMonths(parseYearMonth('2015-04'), parseYearMonth('2021-05'))).toBe(73)
  })

  it('throws when the end date is earlier than the start date', () => {
    expect(() => diffInMonths(parseYearMonth('2021-07'), parseYearMonth('2021-06'))).toThrow(
      /earlier/,
    )
  })
})

describe('getDurationParts', () => {
  it('normalizes zero months to a one-month display minimum', () => {
    expect(getDurationParts(0)).toEqual([{ unit: 'month', value: 1, label: 'month' }])
  })

  it('returns a month-only duration when under a year', () => {
    expect(getDurationParts(1)).toEqual([{ unit: 'month', value: 1, label: 'month' }])
    expect(getDurationParts(2)).toEqual([{ unit: 'month', value: 2, label: 'months' }])
  })

  it('omits zero-month tails for whole years', () => {
    expect(getDurationParts(12)).toEqual([{ unit: 'year', value: 1, label: 'year' }])
  })

  it('returns years and months for mixed durations', () => {
    expect(getDurationParts(16)).toEqual([
      { unit: 'year', value: 1, label: 'year' },
      { unit: 'month', value: 4, label: 'months' },
    ])
  })
})

describe('formatDuration', () => {
  it('formats singular and plural durations for display', () => {
    expect(formatDuration(1)).toBe('1 month')
    expect(formatDuration(12)).toBe('1 year')
    expect(formatDuration(16)).toBe('1 year, 4 months')
  })
})

describe('formatDurationRange', () => {
  it('formats a complete date range for display', () => {
    expect(formatDurationRange('2021-06', '2022-06')).toBe('1 year')
  })

  it('returns an empty string for ongoing ranges', () => {
    expect(formatDurationRange('2021-06')).toBe('')
  })

  it('returns plain text rather than HTML markup', () => {
    expect(formatDurationRange('2021-06', '2021-08')).toBe('2 months')
    expect(formatDurationRange('2021-06', '2021-08')).not.toMatch(/<[^>]+>/)
  })
})

describe('formatMonthYear', () => {
  it('formats a parsed date in month-year form', () => {
    expect(formatMonthYear('2021-06')).toBe('June 2021')
  })
})

describe('getCurrentLocalYearMonth', () => {
  it('returns the current local year and month', () => {
    const result = getCurrentLocalYearMonth(new Date(2026, 3, 18, 15, 45, 0))
    expect(result).toEqual({ year: 2026, month: 4 })
  })

  it('uses the local calendar month rather than the UTC month near boundaries', () => {
    const result = getCurrentLocalYearMonth(new Date(2026, 4, 1, 0, 30, 0))
    expect(result).toEqual({ year: 2026, month: 5 })
  })
})
