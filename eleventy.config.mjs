import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import EleventyVitePlugin from '@11ty/eleventy-plugin-vite'
import { formatDurationRange, formatMonthYear } from './src/shared/date.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const siteData = JSON.parse(fs.readFileSync(path.join(__dirname, '_data', 'site.json'), 'utf8'))
const deployOrigin =
  process.env.DEPLOY_PRIME_URL ?? // Netlify branch deploys and deploy previews
  process.env.URL ?? // Netlify production deploys
  (process.env.ELEVENTY_ENV === 'development' ? 'http://localhost:8080/' : siteData.url)

function toAbsoluteUrl(pathname, origin = deployOrigin) {
  if (!pathname) {
    return origin
  }

  return new URL(pathname, origin).href
}

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyVitePlugin, {
    viteOptions: {
      resolve: {
        alias: {
          '@shared': path.join(__dirname, 'src', 'shared'),
        },
      },
    },
  })

  eleventyConfig.addGlobalData('deployOrigin', deployOrigin)
  eleventyConfig.addFilter('absoluteUrl', (pathname, origin = deployOrigin) => {
    return toAbsoluteUrl(pathname, origin)
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
  eleventyConfig.addFilter('durationText', (startValue, endValue) => {
    return formatDurationRange(startValue, endValue)
  })

  eleventyConfig.addPassthroughCopy('assets')
  eleventyConfig.ignores.add('README.md')
}
