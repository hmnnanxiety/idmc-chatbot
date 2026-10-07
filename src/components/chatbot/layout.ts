// Shared widget shell utilities. Exact Figma tokens; no utility-scale rounding.
export const widgetClasses = [
  '[font:var(--idmc-type-b2)] [letter-spacing:0] [color-scheme:light]',
  '[--idmc-motion-duration-fast:140ms] [--idmc-motion-duration-base:200ms]',
  '[--idmc-motion-ease-out:cubic-bezier(0.22,_1,_0.36,_1)]',
  '[--idmc-widget-padding-inline:var(--idmc-space-4)] [--idmc-widget-padding-block:var(--idmc-space-4)]',
  '[--idmc-header-height:44px] [--idmc-header-action-size:30px] [--idmc-header-gap:var(--idmc-space-2)]',
  '[--idmc-content-gap:var(--idmc-space-2)] [--idmc-composer-height:56px]',
  'mobile:[--idmc-widget-padding-inline:var(--idmc-space-3)]',
  'mobile:[--idmc-widget-padding-block:var(--idmc-space-3)]',
  'short:[--idmc-widget-padding-block:var(--idmc-space-2)] short:[--idmc-header-height:40px]',
].join(' ')

export const viewClasses = [
  'flex flex-col [inline-size:100%] [block-size:100%] [min-block-size:0] [min-inline-size:0]',
  '[padding:var(--idmc-widget-padding-block)_var(--idmc-widget-padding-inline)] overflow-hidden',
  '[background:var(--idmc-color-neutral-200)]',
].join(' ')

export const footerClasses = [
  'flex flex-none flex-col [gap:var(--idmc-content-gap)] [inline-size:100%]',
].join(' ')

export const visuallyHiddenClasses = [
  'absolute [inline-size:1px] [block-size:1px] [margin:-1px] [padding:0] overflow-hidden [border:0]',
  '[clip-path:inset(50%)] whitespace-nowrap',
].join(' ')
