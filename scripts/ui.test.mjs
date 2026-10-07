import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import { readFile, readdir } from 'node:fs/promises'

let server
const components = {}
const render = (name, props) => renderToStaticMarkup(createElement(components[name], props))

before(async () => {
  // Vite compiles existing TSX/CSS; no extra test framework or DOM dependency.
  server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
  for (const name of ['MarkdownContent', 'MessageList', 'HistoryView', 'HistoryItem', 'ChatInput', 'ChatHeader']) {
    const module = await server.ssrLoadModule(`/src/components/chatbot/${name}.tsx`)
    components[name] = module[name]
  }
})

after(async () => { await server?.close() })

test('cn composes conditional utilities and resolves property conflicts', async () => {
  const { cn } = await server.ssrLoadModule('/src/lib/utils.ts')
  assert.equal(cn('flex p-2', false && 'hidden', { 'items-center': true }, 'p-4'), 'flex items-center p-4')
  assert.equal(cn('[border-radius:999px]', '[border-radius:16px]'), '[border-radius:16px]')
  assert.equal(cn('mobile:[padding:12px]', 'short:[padding:8px]'), 'mobile:[padding:12px] short:[padding:8px]')
})

test('widget shells retain scoped tokens and inclusive responsive utilities', async () => {
  const { widgetClasses, viewClasses, footerClasses, visuallyHiddenClasses } = await server.ssrLoadModule('/src/components/chatbot/layout.ts')
  assert.ok(widgetClasses.includes('mobile:[--idmc-widget-padding-inline:var(--idmc-space-3)]'))
  assert.ok(widgetClasses.includes('short:[--idmc-header-height:40px]'))
  assert.ok(viewClasses.includes('[padding:var(--idmc-widget-padding-block)_var(--idmc-widget-padding-inline)]'))
  assert.ok(footerClasses.includes('flex-none'))
  assert.ok(visuallyHiddenClasses.includes('[clip-path:inset(50%)]'))
})

test('chatbot styling no longer depends on per-component stylesheets', async () => {
  const directory = new URL('../src/components/chatbot/', import.meta.url)
  const files = await readdir(directory)
  assert.deepEqual(files.filter(file => file.endsWith('.css')), [])
  for (const file of files.filter(file => file.endsWith('.tsx'))) {
    assert.doesNotMatch(await readFile(new URL(file, directory), 'utf8'), /import\s+['"][^'"]+\.css['"]/, file)
  }
  const globalCss = await readFile(new URL('../src/index.css', import.meta.url), 'utf8')
  assert.ok(globalCss.includes("@import 'tailwindcss/utilities.css'"))
  assert.doesNotMatch(globalCss, /@import\s+['"]tailwindcss(?:\/preflight\.css)?['"]/)
})

test('assistant Markdown renders headings, emphasis, lists, links and code', () => {
  const html = render('MarkdownContent', {
    text: '# Data DIY\n\n**Jumlah** dan `unit`\n\n- Satu\n- Dua\n\n[Sumber](https://idmc.jogjaprov.go.id/)\n\n```json\n{"jumlah": 2}\n```',
  })
  for (const markup of ['<h1>Data DIY</h1>', '<strong>Jumlah</strong>', '<ul>', '<li>Satu</li>', '<pre>', 'language-json']) {
    assert.ok(html.includes(markup), markup)
  }
  assert.match(html, /target="_blank"/)
  assert.match(html, /rel="noopener noreferrer"/)
})

test('GFM tables get an accessible scroll container and structured cells', () => {
  const html = render('MarkdownContent', { text: '| Wilayah | Jumlah |\n| --- | --- |\n| DIY | 42 |' })
  assert.match(html, /role="region" aria-label="Tabel jawaban" tabindex="0"/)
  assert.match(html, /<th>Wilayah<\/th>/)
  assert.match(html, /<td>42<\/td>/)
})

test('raw HTML, unsafe URL schemes and remote image requests are not rendered', () => {
  const html = render('MarkdownContent', {
    text: '<script>alert(1)</script>\n\n<img src="x" onerror="alert(1)">\n\n[unsafe](javascript:alert)\n\n![Camera](https://example.org/tracker.png)',
  })
  assert.doesNotMatch(html, /<script|<img|javascript:|onerror|tracker\.png/)
  assert.match(html, /Camera/)
})

test('user text stays literal while assistant messages render Markdown', () => {
  const html = render('MessageList', { messages: [
    { id: 'u', role: 'user', text: '**literal** <script>\nbaris' },
    { id: 'a', role: 'assistant', text: '**formatted**' },
  ] })
  assert.match(html, /\*\*literal\*\* &lt;script&gt;\nbaris/)
  assert.match(html, /<strong>formatted<\/strong>/)
  assert.match(html, /role="log"/)
})

test('empty, loading and request-error states remain distinguishable', () => {
  assert.match(render('MessageList', { messages: [] }), /Belum ada pesan/)
  const loading = render('MessageList', { messages: [], isAssistantLoading: true })
  assert.match(loading, /role="status"/)
  assert.doesNotMatch(loading, /Belum ada pesan/)
  const error = render('MessageList', { messages: [{ id: 'error', role: 'assistant', text: 'Gagal', status: 'error' }] })
  assert.match(error, /role="alert"/)
  assert.match(error, /data-status="error"/)
})

test('history selection and empty history keep their existing semantics', () => {
  assert.match(render('HistoryView', { items: [], onBack() {} }), /Belum ada riwayat percakapan/)
  const html = render('HistoryItem', { item: { id: 'one', title: 'Data DIY' }, selected: true })
  assert.match(html, /aria-current="true"/)
  assert.match(html, /title="Data DIY"/)
  assert.match(html, /type="button"/)
})

test('empty/pending composer disables send, not the draft field', () => {
  for (const submitDisabled of [false, true]) {
    const html = render('ChatInput', { submitDisabled })
    assert.match(html, /<button[^>]*disabled/)
    assert.doesNotMatch(html, /<input[^>]*disabled/)
  }
  assert.match(render('ChatInput', { submitDisabled: true }), /Menunggu jawaban asisten/)
})

test('shared header retains back/history/close labels and optional slots', () => {
  const html = render('ChatHeader', { title: 'Riwayat Chat', onBack() {}, onOpenHistory() {}, onClose() {} })
  for (const label of ['Kembali', 'Riwayat chat', 'Tutup chatbot']) assert.ok(html.includes(label))
  assert.match(html, /<h1[^>]*>Riwayat Chat<\/h1>/)
  assert.doesNotMatch(render('ChatHeader', {}), /<button|<h1/)
})
