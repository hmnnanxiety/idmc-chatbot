import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'
import { createServer } from 'vite'

let server, browser, origin
before(async () => {
  server = await createServer({
    server: { host: '127.0.0.1', port: 0 },
    clearScreen: false,
  })
  await server.listen()
  origin = `http://127.0.0.1:${server.httpServer.address().port}`
  browser = await chromium.launch({ headless: true })
  await mkdir('.output/qa', { recursive: true })
})
after(async () => {
  await browser?.close()
  await server?.close()
})
async function open(t, width = 1440) {
  const context = await browser.newContext({
    viewport: { width, height: 900 },
    reducedMotion: 'reduce',
  })
  t.after(() => context.close())
  const errors = []
  context.on('page', (page) =>
    page.on('pageerror', (error) => errors.push(error.message)),
  )
  t.after(() => assert.deepEqual(errors, []))
  await context.route('**/api/chat', (route) =>
    route.fulfill({
      json: {
        reply:
          '**Data DIY**\n\nJawaban untuk ' +
          route.request().postDataJSON().message,
      },
    }),
  )
  const page = await context.newPage()
  await page.goto(origin)
  await page.getByRole('heading', { name: 'Chatbot Data Publik' }).waitFor()
  return { page, context }
}
async function send(page, text) {
  await page.getByRole('textbox', { name: 'Tulis pesan' }).fill(text)
  await page.getByRole('textbox', { name: 'Tulis pesan' }).press('Enter')
  await page.locator('.idmc-message--assistant').last().waitFor()
}

test('full page persists, reopens and deletes real conversations', async (t) => {
  const { page } = await open(t)
  await page.screenshot({ path: '.output/qa/web-home.png' })
  await send(page, 'Data penduduk DIY')
  assert.equal(
    await page.locator('.idmc-message--assistant strong').textContent(),
    'Data DIY',
  )
  await page.screenshot({ path: '.output/qa/web-chat.png' })
  await page
    .getByRole('button', { name: 'Chat baru', exact: true })
    .first()
    .click()
  await page.getByRole('heading', { name: 'Chatbot Data Publik' }).waitFor()
  await page
    .locator('.web-history-button')
    .filter({ hasText: 'Data penduduk DIY' })
    .click()
  assert.equal(await page.locator('.idmc-message').count(), 2)
  await page.reload()
  await page
    .locator('.web-history-button')
    .filter({ hasText: 'Data penduduk DIY' })
    .click()
  assert.equal(await page.locator('.idmc-message').count(), 2)
  await page
    .getByRole('button', { name: 'Hapus percakapan Data penduduk DIY' })
    .click()
  assert.equal(await page.locator('.web-history-button').count(), 0)
  await page.reload()
  assert.equal(await page.locator('.web-history-button').count(), 0)
})

test('maximize opens the full page with the completed conversation', async (t) => {
  const { page, context } = await open(t)
  await page.goto(origin + '/?view=overlay')
  await page.getByRole('button', { name: 'Buka chatbot' }).click()
  await send(page, 'Data koperasi')
  const nextPage = context.waitForEvent('page')
  await page.getByRole('button', { name: 'Buka di tab baru' }).click()
  const expanded = await nextPage
  await expanded.waitForLoadState()
  await expanded.locator('.idmc-message--assistant').waitFor()
  assert.equal(await expanded.locator('.idmc-message').count(), 2)
  assert.equal(new URL(expanded.url()).hash, '')
  await send(expanded, 'Lanjutkan')
  assert.equal(await expanded.locator('.idmc-message--user').count(), 2)
})

test('mobile sidebar opens, closes with Escape and fits small viewports', async (t) => {
  const { page } = await open(t, 390)
  await page.screenshot({ path: '.output/qa/web-mobile.png' })
  await page.getByRole('button', { name: 'Buka atau tutup sidebar' }).click()
  await page.getByRole('dialog').waitFor()
  await page.screenshot({ path: '.output/qa/web-mobile-sidebar.png' })
  await page.keyboard.press('Escape')
  await page.getByRole('dialog').waitFor({ state: 'hidden' })
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 720 })
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
    )
  }
})

test('invalid handoff and unavailable API show feedback', async (t) => {
  const { page, context } = await open(t)
  await page.goto(origin + '/#conversation=invalid')
  await page.reload()
  await page
    .getByRole('status')
    .filter({ hasText: 'Percakapan gagal dibuka' })
    .waitFor()
  await context.route('**/api/chat', (route) =>
    route.fulfill({ status: 503, body: '{}' }),
  )
  await send(page, 'Coba lagi')
  await page.getByRole('alert').waitFor()
  assert.equal(
    await page.getByRole('textbox', { name: 'Tulis pesan' }).isEnabled(),
    true,
  )
})

test('switching during a request records cancellation and keeps other chats independent', async (t) => {
  const { page, context } = await open(t)
  await context.route('**/api/chat', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    await route
      .fulfill({ json: { reply: 'Balasan terlambat' } })
      .catch(() => {})
  })
  await page
    .getByRole('textbox', { name: 'Tulis pesan' })
    .fill('Pertanyaan lama')
  await page.getByRole('textbox', { name: 'Tulis pesan' }).press('Enter')
  await page
    .getByRole('button', { name: 'Chat baru', exact: true })
    .first()
    .click()
  await page
    .getByRole('button', { name: 'Pertanyaan lama', exact: true })
    .click()
  await page
    .getByRole('alert')
    .filter({ hasText: 'Jawaban dihentikan' })
    .waitFor()
  assert.equal(
    await page.getByText('Balasan terlambat', { exact: true }).count(),
    0,
  )
})

test('deleting a pending conversation does not restore it during cleanup', async (t) => {
  const { page, context } = await open(t)
  await context.route('**/api/chat', async route => {
    await new Promise(resolve => setTimeout(resolve, 800))
    await route.fulfill({ json: { reply: 'Terlambat' } }).catch(() => {})
  })
  await page.getByRole('textbox', { name: 'Tulis pesan' }).fill('Hapus saat berjalan')
  await page.getByRole('textbox', { name: 'Tulis pesan' }).press('Enter')
  await page.getByRole('button', { name: 'Hapus percakapan Hapus saat berjalan' }).click()
  await page.getByRole('heading', { name: 'Chatbot Data Publik' }).waitFor()
  assert.equal(await page.locator('.web-history-button').count(), 0)
  await page.reload()
  assert.equal(await page.locator('.web-history-button').count(), 0)
})
