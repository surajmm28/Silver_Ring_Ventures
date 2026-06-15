'use client'

const TEXT = 'INTEGRATED EXCELLENCE · BANGALORE · EST. 2025 · LAND · CONSTRUCTION · DESIGN · ADVISORY · INTERIORS · '

export default function MarqueeTicker() {
  return (
    <div className="marquee-strip" aria-hidden="true">
      <div className="marquee-inner">
        <span className="marquee-content">{TEXT}</span>
        <span className="marquee-content">{TEXT}</span>
      </div>
    </div>
  )
}
