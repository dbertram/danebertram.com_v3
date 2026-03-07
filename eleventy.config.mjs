import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const monthYearFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function formatMonthYear(value) {
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

export default function (eleventyConfig) {
  const iconsDirectory = path.join(__dirname, '_includes', 'icons')
  const iconCache = new Map()

  eleventyConfig.addShortcode('inlineIcon', (iconName) => {
    if (!iconName) {
      return ''
    }

    let iconSource = iconCache.get(iconName)
    if (!iconSource) {
      const iconPath = path.join(iconsDirectory, `${iconName}.svg`)
      if (!fs.existsSync(iconPath)) {
        throw new Error(`Unknown icon: ${iconName}`)
      }

      iconSource = fs.readFileSync(iconPath, 'utf8').trim()
      iconCache.set(iconName, iconSource)
    }
    return iconSource
  })

  eleventyConfig.addFilter('monthYear', (value) => formatMonthYear(value))

  eleventyConfig.addFilter('monthYearOrPresent', (value) => {
    if (!value) {
      return 'Present'
    }

    return formatMonthYear(value)
  })

  eleventyConfig.addPassthroughCopy('favicon.ico')
  eleventyConfig.addPassthroughCopy('images/*')
  eleventyConfig.addPassthroughCopy('css/*.css')
  eleventyConfig.ignores.add('README.md')
}
