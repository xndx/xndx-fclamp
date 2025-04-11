'use client'

import { useState, useEffect, useRef } from 'react'

export default function HomePage() {
  const previewRef = useRef(null)

  const [copied, setCopied] = useState(false)

  const [inputs, setInputs] = useState({
    min: '16',
    max: '90',
    minSize: '320',
    maxSize: '1400',
  })

  const [previewText, setPreviewText] = useState(
    'This text resizes dynamically with the viewport'
  )

  // Load from localStorage on mount
  useEffect(() => {
    const savedInputs = localStorage.getItem('fclamp-inputs')
    if (savedInputs) setInputs(JSON.parse(savedInputs))

    const savedText = localStorage.getItem('fclamp-text')
    if (previewRef.current) {
      previewRef.current.textContent =
        savedText || 'Lorem ipsum dolor sit amet consectetur'
    }
  }, [])

  // Save inputs to localStorage on change
  useEffect(() => {
    localStorage.setItem('fclamp-inputs', JSON.stringify(inputs))
  }, [inputs])

  // Save previewText on change
  useEffect(() => {
    localStorage.setItem('fclamp-text', previewText)
  }, [previewText])

  const handleChange = (e) => {
    const { name, value } = e.target
    setInputs({ ...inputs, [name]: value })
  }

  const roundTo = (val) => Math.round(val * 1000) / 1000

  const getClamp = () => {
    const min = parseFloat(inputs.min)
    const max = parseFloat(inputs.max)
    const minSize = parseFloat(inputs.minSize)
    const maxSize = parseFloat(inputs.maxSize)

    if (isNaN(min) || isNaN(max) || isNaN(minSize) || isNaN(maxSize)) return ''

    const slope = (max - min) / (maxSize - minSize)
    const yIntercept = min - slope * minSize
    const sign = yIntercept < 0 ? '-' : '+'
    const intercept = roundTo(Math.abs(yIntercept))
    const slopePercent = roundTo(slope * 100)

    return `clamp(${min}px, ${slopePercent}vw ${sign} ${intercept}px, ${max}px)`
  }

  const clampValue = getClamp()

  return (
    <main
      style={{
        padding: '2rem',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      }}
    >
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.2rem' }}>
        Clamp generator
      </h1>
      <p style={{ marginBottom: '2rem' }}>
        Generate a responsive <code>clamp()</code> size based on your min and
        max values.
      </p>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: 400,
          gap: '0.5rem',
        }}
      >
        <label>
          Min font-size (px)
          <input
            type="number"
            name="min"
            value={inputs.min}
            onChange={handleChange}
          />
        </label>
        <label>
          Max font-size (px)
          <input
            type="number"
            name="max"
            value={inputs.max}
            onChange={handleChange}
          />
        </label>
        <label>
          Min viewport width (px)
          <input
            type="number"
            name="minSize"
            value={inputs.minSize}
            onChange={handleChange}
          />
        </label>
        <label>
          Max viewport width (px)
          <input
            type="number"
            name="maxSize"
            value={inputs.maxSize}
            onChange={handleChange}
          />
        </label>
      </div>

      {clampValue && (
        <div
          onClick={() => {
            navigator.clipboard.writeText(clampValue)
            setCopied(true)
            setTimeout(() => setCopied(false), 1000)
          }}
          style={{
            marginTop: '1rem',
            fontFamily: 'monospace',
            backgroundColor: '#212121',
            padding: '0.5em 1em',
            borderRadius: '3px',
            color: 'white',
            cursor: 'pointer',
            userSelect: 'all',
            display: 'inline-block',
          }}
          title="Click to copy"
        >
          {copied ? 'Copied!' : clampValue}
        </div>
      )}

      {clampValue && (
        <div
          ref={previewRef}
          contentEditable
          suppressContentEditableWarning
          onInput={(e) =>
            localStorage.setItem('fclamp-text', e.currentTarget.textContent)
          }
          style={{
            marginTop: '2rem',
            fontSize: clampValue,
            lineHeight: '1em',
            width: '100%',
            cursor: 'text',
            backgroundColor: '#212121',
            padding: '0.1em 0.3em',
            borderRadius: '10px',
          }}
        />
      )}
    </main>
  )
}
