import { describe, expect, it } from 'vitest'
import { enhanceOngoingDurations } from './main.js'

class FakeElement {
  constructor(tagName) {
    this.tagName = tagName
    this.children = []
    this.className = ''
    this.attributes = new Map()
    this.hidden = true
    this._textContent = ''
    this.style = {
      properties: new Map(),
      setProperty: (name, value) => {
        this.style.properties.set(name, value)
      },
    }
    this.classList = {
      classes: new Set(),
      add: (name) => {
        this.classList.classes.add(name)
      },
      contains: (name) => this.classList.classes.has(name),
    }
  }

  set textContent(value) {
    this._textContent = value
    this.children = []
  }

  get textContent() {
    return `${this._textContent}${this.children.map((child) => child.textContent).join('')}`
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value))
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null
  }

  append(...nodes) {
    for (const node of nodes) {
      if (typeof node === 'string') {
        const textNode = new FakeElement('#text')
        textNode.textContent = node
        this.children.push(textNode)
        continue
      }

      this.children.push(node)
    }
  }
}

class FakeDocument {
  constructor(nodes) {
    this.nodes = nodes
  }

  createElement(tagName) {
    return new FakeElement(tagName)
  }

  querySelectorAll(selector) {
    if (selector === '.duration--ongoing[data-start]') {
      return this.nodes
    }

    return []
  }
}

function createDurationNode(startValue) {
  const node = new FakeElement('span')
  node.className = 'duration duration--ongoing'
  node.setAttribute('data-start', startValue)
  return node
}

describe('enhanceOngoingDurations', () => {
  it('renders reduced-motion text for ongoing durations', () => {
    const node = createDurationNode('2025-02')
    const document = new FakeDocument([node])

    enhanceOngoingDurations({
      document,
      now: new Date('2026-04-18T15:45:00.000Z'),
      prefersReducedMotion: true,
    })

    expect(node.hidden).toBe(false)
    expect(node.textContent).toBe('(1 year, 2 months and counting...)')
  })

  it('renders accessible text plus animated markup when motion is allowed', () => {
    const node = createDurationNode('2025-02')
    const document = new FakeDocument([node])
    let animationScheduled = false

    enhanceOngoingDurations({
      document,
      now: new Date('2026-04-18T15:45:00.000Z'),
      requestAnimationFrame: (callback) => {
        animationScheduled = true
        callback()
      },
    })

    expect(node.hidden).toBe(false)
    expect(node.children).toHaveLength(2)
    expect(node.children[0].className).toBe('visually-hidden')
    expect(node.children[0].textContent).toBe('(1 year, 2 months and counting...)')
    expect(node.children[1].className).toBe('duration-display')
    expect(node.children[1].attributes.get('aria-hidden')).toBe('true')
    expect(node.classList.contains('is-visible')).toBe(true)
    expect(animationScheduled).toBe(true)
  })
})
