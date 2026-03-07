import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import EleventyVitePlugin from '@11ty/eleventy-plugin-vite'
import { formatMonthYear } from './src/shared/date.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const siteData = JSON.parse(fs.readFileSync(path.join(__dirname, '_data', 'site.json'), 'utf8'))
const isDevServer = process.env.ELEVENTY_ENV === 'development'

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyVitePlugin, {
    viteOptions: {
      base: isDevServer ? '/' : siteData.url, // ensures og:image meta tag uses an absolute URL instead of relative
    },
  })

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
  eleventyConfig.addPassthroughCopy('css')
  eleventyConfig.ignores.add('README.md')
}
