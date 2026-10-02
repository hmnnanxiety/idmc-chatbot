import './HeroTitle.css'

export interface HeroTitleProps {
  title: string
  tagline: string
}

export function HeroTitle({ title, tagline }: HeroTitleProps) {
  return (
    <hgroup className="idmc-hero-title">
      <h1 className="idmc-hero-title__heading">{title}</h1>
      <p className="idmc-hero-title__tagline">{tagline}</p>
    </hgroup>
  )
}
