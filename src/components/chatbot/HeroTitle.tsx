import { cn } from '../../lib/utils'

export interface HeroTitleProps {
  title: string
  tagline: string
}

export function HeroTitle({ title, tagline }: HeroTitleProps) {
  return (
    <hgroup className={cn('idmc-hero-title', '[margin:0] [color:var(--idmc-color-primary-500)]')}>
      <h1
        className={cn(
          'idmc-hero-title__heading',
          '[margin:0] [font:var(--idmc-type-h5)] [letter-spacing:0] [text-wrap:balance]',
          'narrow:[font:var(--idmc-type-h6)] narrow:[letter-spacing:0]',
          '[animation:idmc-content-in_var(--idmc-motion-duration-enter)_var(--idmc-motion-ease-out)_80ms_backwards]',
        )}
      >
        {title}
      </h1>
      <p
        className={cn(
          'idmc-hero-title__tagline',
          '[margin:0] [font:var(--idmc-type-b1)] [letter-spacing:0]',
          '[animation:idmc-content-in_var(--idmc-motion-duration-enter)_var(--idmc-motion-ease-out)_140ms_backwards]',
        )}
      >
        {tagline}
      </p>
    </hgroup>
  )
}
