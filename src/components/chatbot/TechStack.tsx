import type { TechItem } from './types'
import './TechStack.css'

export interface TechStackProps {
  title: string
  items: TechItem[]
}

export function TechStack({ title, items }: TechStackProps) {
  return (
    <section className="idmc-tech-stack" aria-label={title}>
      <p className="idmc-tech-stack__title">{title}</p>
      <ul className="idmc-tech-stack__list">
        {items.map(({ name, src, size = 51 }) => (
          <li key={name} className="idmc-tech-stack__item">
            <img
              className="idmc-tech-stack__logo"
              src={src}
              alt={name}
              width={size}
              height={size}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
