import {
  diffInMonths,
  formatDuration,
  getCurrentLocalYearMonth,
  getDurationParts,
  parseYearMonth,
} from '@shared/date.mjs'

function buildAnimatedNumber(document, value, { startAt = 0 } = {}) {
  const number = document.createElement('span')
  number.className = 'duration-number'
  number.style.setProperty('--duration-digits', String(String(value).length))

  const track = document.createElement('span')
  track.className = 'duration-number-track'
  track.style.setProperty('--duration-target', String(value - startAt))

  for (let currentValue = startAt; currentValue <= value; currentValue += 1) {
    const cell = document.createElement('span')
    cell.className = 'duration-number-cell'
    cell.textContent = String(currentValue)
    track.append(cell)
  }

  number.append(track)
  return number
}

function buildAnimatedDuration(document, totalMonths) {
  const display = document.createElement('span')
  display.className = 'duration-display'
  display.setAttribute('aria-hidden', 'true')
  display.append('(')

  getDurationParts(totalMonths).forEach((part, index) => {
    if (index > 0) {
      display.append(', ')
    }

    const partNode = document.createElement('span')
    partNode.className = 'duration-part'
    partNode.append(
      buildAnimatedNumber(document, part.value, {
        startAt: 1,
      }),
    )
    partNode.append(` ${part.label}`)
    display.append(partNode)
  })

  display.append(' and counting...')
  display.append(')')
  return display
}

function setReducedMotionDuration(node, durationLabel) {
  node.textContent = durationLabel
}

function setAnimatedDuration(document, node, durationLabel, totalMonths) {
  const srText = document.createElement('span')
  srText.className = 'visually-hidden'
  srText.textContent = durationLabel

  node.append(srText, buildAnimatedDuration(document, totalMonths))
}

function enhanceOngoingDurationNode(
  node,
  { document, currentMonth, prefersReducedMotion, requestAnimationFrame },
) {
  const startDate = parseYearMonth(node.getAttribute('data-start'))

  if (!startDate) {
    return
  }

  const totalMonths = diffInMonths(startDate, currentMonth)
  const durationLabel = `(${formatDuration(totalMonths)} and counting...)`
  node.textContent = ''

  if (prefersReducedMotion) {
    setReducedMotionDuration(node, durationLabel)
  } else {
    setAnimatedDuration(document, node, durationLabel, totalMonths)
  }

  node.hidden = false

  if (!prefersReducedMotion) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        node.classList.add('is-visible')
      })
    })
  }
}

export function enhanceOngoingDurations({
  document,
  now = new Date(),
  prefersReducedMotion = false,
  requestAnimationFrame = (callback) => callback(),
} = {}) {
  const currentMonth = getCurrentLocalYearMonth(now)

  for (const node of document.querySelectorAll('.duration--ongoing[data-start]')) {
    enhanceOngoingDurationNode(node, {
      document,
      currentMonth,
      prefersReducedMotion,
      requestAnimationFrame,
    })
  }
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  enhanceOngoingDurations({
    document,
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    requestAnimationFrame: window.requestAnimationFrame.bind(window),
  })
}
