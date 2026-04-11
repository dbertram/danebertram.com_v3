import fs from 'node:fs'
import path from 'node:path'
import nunjucks from 'nunjucks'
import { describe, expect, it } from 'vitest'
import { formatDurationRange, formatMonthYear } from '../../src/shared/date.mjs'

const templatePath = path.join(process.cwd(), '_includes', 'sections', 'experience.njk')
const templateSource = fs.readFileSync(templatePath, 'utf8')

const env = new nunjucks.Environment(
  new nunjucks.FileSystemLoader(path.join(process.cwd(), '_includes')),
)
env.addFilter('monthYear', (value) => formatMonthYear(value))
env.addFilter('monthYearOrPresent', (value) => (value ? formatMonthYear(value) : 'Present'))
env.addFilter('durationText', (startValue, endValue) => formatDurationRange(startValue, endValue))

describe('experience template', () => {
  it('renders ended and ongoing duration markup correctly', () => {
    const html = env.renderString(templateSource, {
      resume: {
        experience: [
          {
            id: 'ended-role',
            title: 'Engineer',
            start: '2021-06',
            end: '2022-06',
            company: { name: 'Ended Co' },
            highlights: ['Shipped feature'],
          },
          {
            id: 'ongoing-role',
            title: 'Lead Engineer',
            start: '2024-01',
            company: { name: 'Ongoing Co' },
            highlights: ['Running team'],
          },
        ],
      },
    })

    expect(html).toContain('<span class="duration">(1 year)</span>')
    expect(html).toContain(
      '<span class="duration duration--ongoing" data-start="2024-01" hidden></span>',
    )
    expect(html).toContain('June 2021')
    expect(html).toContain('Present')
  })
})
