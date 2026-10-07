import { cn } from '../../lib/utils'

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
      className={cn('idmc-glyph', 'relative block flex-none')}
      style={{ inlineSize: size, blockSize: size }}
      aria-hidden="true"
    >
      <span className={cn('idmc-glyph__frame', 'absolute')} style={{ inset }}>
        <span className={cn('idmc-glyph__bleed', 'absolute')} style={{ inset: bleed }}>
          <img
            className={cn(
              'idmc-glyph__image',
              'block [inline-size:100%] [block-size:100%] [max-inline-size:none]',
            )}
            src={src}
            alt=""
          />
        </span>
      </span>
    </span>
  )
}
