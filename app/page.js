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

  useEffect(() => {
    const savedInputs = sessionStorage.getItem('fclamp-inputs')
    if (savedInputs) setInputs(JSON.parse(savedInputs))

    const savedText =
      sessionStorage.getItem('fclamp-text') ||
      'This text resizes dynamically with the viewport'

    setPreviewText(savedText)

    if (previewRef.current) {
      previewRef.current.textContent = savedText
    }
  }, [])

  useEffect(() => {
    sessionStorage.setItem('fclamp-inputs', JSON.stringify(inputs))
  }, [inputs])

  useEffect(() => {
    sessionStorage.setItem('fclamp-text', previewText)
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

    const slope = (max - min) / (maxSize - minSize)
    const yIntercept = min - slope * minSize
    const sign = yIntercept < 0 ? '-' : '+'
    const intercept = roundTo(Math.abs(yIntercept))
    const slopePercent = roundTo(slope * 100)

    return `clamp(${min}px, ${slopePercent}vw ${sign} ${intercept}px, ${max}px)`
  }

  const clampValue = getClamp()

  return (
    <main>
      <h1
        style={{ fontSize: '50px', lineHeight: '0.9', marginBottom: '0.3em' }}
      >
        Clamp generator
      </h1>
      <h2 style={{ fontSize: '18px', marginBottom: '2em' }}>
        Generate a responsive <code>clamp()</code> size based on your min and
        max values.
      </h2>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1em',
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
            backgroundColor: '#0a2144',
            padding: '0.5em 1em',
            borderRadius: '6px',
            cursor: 'pointer',
            userSelect: 'all',
            display: 'inline-block',
            width: '100%',
            maxWidth: '400px',
          }}
          title="Click to copy"
        >
          {copied ? 'Copied!' : clampValue}
        </div>
      )}

      {clampValue && (
        <div
          ref={previewRef}
          className="font-sans font-semibold"
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => setPreviewText(e.currentTarget.textContent || '')}
          style={{
            marginTop: '100px',
            fontSize: clampValue,
            lineHeight: '1.1em',
            width: '100%',
            cursor: 'text',
            backgroundColor: '#212121',
            padding: 10,
          }}
        />
      )}
      <div className="links" style={{ marginTop: '2em' }}>
        <a href="https://copychar.cc">COPYCHAR</a>
      </div>
    </main>
  )
}
