import { cn } from '../../lib/utils'
import Markdown from 'react-markdown'
import type { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Keep default safe URL filtering and skip raw HTML; never use innerHTML.
const components: Components = {
  a: ({ children, href, title }) =>
    href ? (
      <a href={href} title={title} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ) : (
      <span>{children}</span>
    ),
  table: ({ children }) => (
    <div
      className={cn(
        'idmc-markdown__table',
        '[max-inline-size:100%] [margin-block:var(--idmc-space-3)] overflow-x-auto',
        '[overscroll-behavior-inline:contain]',
      )}
      role="region"
      aria-label="Tabel jawaban"
      tabIndex={0}
    >
      <table>{children}</table>
    </div>
  ),
  // Replies should not load arbitrary remote images/tracking pixels.
  img: ({ alt }) => (alt ? <span>{alt}</span> : null),
}

export interface MarkdownContentProps {
  text: string
}

export function MarkdownContent({ text }: MarkdownContentProps) {
  return (
    <div
      className={cn(
        'idmc-markdown',
        '[min-inline-size:0] [overflow-wrap:anywhere] [&_>_:first-child]:[margin-block-start:0]',
        '[&_>_:last-child]:[margin-block-end:0]',
        '[&_:is(p,_ul,_ol,_pre,_blockquote,_h1,_h2,_h3,_h4,_h5,_h6)]:[margin-block:var(--idmc-space-3)]',
        '[&_:is(h1,_h2,_h3,_h4,_h5,_h6)]:[font:var(--idmc-type-b1)]',
        '[&_:is(h1,_h2,_h3,_h4,_h5,_h6)]:[&]:[font-weight:700]',
        '[&_:is(ul,_ol)]:[padding-inline-start:var(--idmc-space-6)]',
        '[&_li_+_li]:[margin-block-start:var(--idmc-space-1)] [&_li_>_p]:[margin-block:var(--idmc-space-1)]',
        '[&_a]:[color:var(--idmc-color-primary-700)] [&_a]:[text-underline-offset:3px]',
        '[&_:is(a,_.idmc-markdown__table):focus-visible]:[outline:var(--idmc-stroke-1)_solid_var(--idmc-color-primary-500)]',
        '[&_:is(a,_.idmc-markdown__table):focus-visible]:[outline-offset:var(--idmc-space-0)]',
        '[&_code]:[padding:var(--idmc-space-0)_var(--idmc-space-1)]',
        '[&_code]:[border-radius:var(--idmc-radius-1)] [&_code]:[background:var(--idmc-color-neutral-200)]',
        '[&_code]:[font-family:ui-monospace,_Consolas,_monospace] [&_code]:[font-size:0.875em]',
        '[&_pre]:[max-inline-size:100%] [&_pre]:[padding:var(--idmc-space-3)] [&_pre]:overflow-x-auto',
        '[&_pre]:[border-radius:var(--idmc-radius-2)] [&_pre]:[background:var(--idmc-color-neutral-200)]',
        '[&_pre]:[overscroll-behavior-inline:contain] [&_pre_code]:[padding:0] [&_pre_code]:whitespace-pre',
        '[&_pre_code]:[overflow-wrap:normal] [&_blockquote]:[margin-inline:0]',
        '[&_blockquote]:[padding-inline-start:var(--idmc-space-3)]',
        '[&_blockquote]:[border-inline-start:var(--idmc-stroke-1)_solid_var(--idmc-color-secondary-400)]',
        '[&_blockquote]:[color:var(--idmc-color-neutral-700)] [&_table]:[inline-size:100%]',
        '[&_table]:border-collapse [&_table]:[font:var(--idmc-type-b3)] [&_:is(th,_td)]:[min-inline-size:80px]',
        '[&_:is(th,_td)]:[padding:var(--idmc-space-2)]',
        '[&_:is(th,_td)]:[border:var(--idmc-stroke-0)_solid_var(--idmc-color-neutral-400)]',
        '[&_:is(th,_td)]:align-top [&_:is(th,_td)]:text-start [&_:is(th,_td)]:[overflow-wrap:normal]',
        '[&_th]:[background:var(--idmc-color-secondary-200)] [&_th]:[font-weight:700] [&_hr]:[border:0]',
        // Top border must survive Tailwind's shorthand/longhand utility ordering.
        '[&_hr]:[border-block-start:var(--idmc-stroke-0)_solid_var(--idmc-color-neutral-400)]!',
        '[&_.contains-task-list]:[padding-inline-start:var(--idmc-space-1)] [&_.contains-task-list]:list-none',
        "[&_input[type='checkbox']]:[margin-inline-end:var(--idmc-space-2)]",
        "[&_input[type='checkbox']]:[accent-color:var(--idmc-color-primary-500)]",
      )}
    >
      <Markdown remarkPlugins={[remarkGfm]} components={components} skipHtml>
        {text}
      </Markdown>
    </div>
  )
}
