import './Glyph.css'

export interface GlyphProps {
  /** Exported Figma SVG for the icon artwork. */
  src: string
  /** Size of the square icon box in px (the Figma icon frame). */
  size: number
  /** CSS inset of the artwork inside the icon box, copied from the Figma layer. */
  inset: string
  /** Optional inset applied inside the artwork frame (Figma stroke bleed). */
  bleed?: string
}

/**
 * Places an exported Figma icon SVG inside its icon box exactly as the HiFi
 * does (box size + artwork inset), so the SVG is never redrawn or resized.
 */
export function Glyph({ src, size, inset, bleed = '0' }: GlyphProps) {
  return (
    <span
      className="idmc-glyph"
      style={{ inlineSize: size, blockSize: size }}
      aria-hidden="true"
    >
      <span className="idmc-glyph__frame" style={{ inset }}>
        <span className="idmc-glyph__bleed" style={{ inset: bleed }}>
          <img className="idmc-glyph__image" src={src} alt="" />
        </span>
      </span>
    </span>
  )
}
