import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createServer } from 'node:http'
import { spawnSync } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rm } from 'node:fs/promises'
import { basename, dirname, join, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { setTimeout as delay } from 'node:timers/promises'
import { chromium } from 'playwright'
import { createServer as createViteServer } from 'vite'

let backend, placeholder, configured
const contexts = [], profiles = [], received = [], errors = []
let cancelled = 0
const origin = 'https://idmc.jogjaprov.go.id'
const answer = '**Data DIY**\n\n| Wilayah | Jumlah |\n| --- | --- |\n| DIY | 42 |'

function build(mode, endpoint) {
  const result = spawnSync(process.execPath, ['node_modules/wxt/bin/wxt.mjs', 'build', '--mode', mode], {
    cwd: resolve('.'), encoding: 'utf8', timeout: 120_000,
    env: { ...process.env, WXT_CHAT_API_URL: endpoint },
  })
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
  return resolve(`.output/chrome-mv3${mode === 'production' ? '' : '-test'}`)
}

async function launch(extension) {
  const profile = await mkdtemp(join(tmpdir(), 'idmc-extension-test-'))
  profiles.push(profile)
  const context = await chromium.launchPersistentContext(profile, {
    channel: 'chromium', headless: true, reducedMotion: 'reduce',
    viewport: { width: 1280, height: 900 },
    args: [`--disable-extensions-except=${extension}`, `--load-extension=${extension}`],
  })
  contexts.push(context)
  await context.route(`${origin}/**`, route => route.fulfill({ contentType: 'text/html', body:
    `<!doctype html><html><head><style>html{font-size:10px}body{margin:37px;background:#eef2f8;font-family:serif}
    button{background:lime!important;font-size:60px!important}</style></head><body>
    <h1>IDMC portal isolation fixture</h1><button id="portal-button" onclick="window.portalClicks=(window.portalClicks||0)+1">Portal</button>
    ${new URL(route.request().url()).pathname === '/frame' ? '' : '<iframe hidden src="/frame"></iframe>'}
    <script>window.portalKeys=0;document.addEventListener('keydown',()=>window.portalKeys++)</script></body></html>`,
  }))
  return context
}

async function portal(context, t, media) {
  const page = await context.newPage()
  page.on('pageerror', error => errors.push(error.message))
  t.after(() => page.close())
  if (media) await page.emulateMedia(media)
  await page.goto(`${origin}/`)
  await page.getByRole('button', { name: 'Buka chatbot' }).click()
  return page
}

async function waitFor(predicate) {
  for (let i = 0; i < 100; i++) { if (predicate()) return; await delay(20) }
  assert.fail('Expected asynchronous condition did not occur')
}

async function settleMotion(locator) {
  await locator.evaluate(async element => {
    await Promise.allSettled(element.getAnimations({ subtree: true })
      .filter(animation => animation.effect.getTiming().iterations !== Infinity)
      .map(animation => animation.finished))
  })
}

before(async () => {
  await mkdir('.output/qa', { recursive: true })
  backend = createServer(async (req, res) => {
    let body = ''
    for await (const chunk of req) body += chunk
    const { message } = JSON.parse(body)
    received.push({ message, method: req.method, cookie: req.headers.cookie })
    res.setHeader('Content-Type', 'application/json')
    if (message === 'status') { res.writeHead(503).end('{}'); return }
    if (message === 'slow') {
      const timer = setTimeout(() => res.end(JSON.stringify({ reply: answer })), 1500)
      res.on('close', () => { clearTimeout(timer); if (!res.writableEnded) cancelled++ })
      return
    }
    res.end(JSON.stringify({ reply: answer }))
  })
  await new Promise(resolve => backend.listen(0, '127.0.0.1', resolve))
  placeholder = await launch(build('production', ''))
  configured = await launch(build('test', `http://127.0.0.1:${backend.address().port}/chat`))
}, { timeout: 180_000 })

after(async () => {
  for (const context of contexts) await context.close()
  backend?.closeAllConnections()
  await new Promise(resolve => backend ? backend.close(resolve) : resolve())
  for (const profile of profiles) {
    assert.equal(dirname(resolve(profile)), resolve(tmpdir()))
    assert.ok(basename(profile).startsWith('idmc-extension-test-'))
    await rm(profile, { recursive: true, force: true, maxRetries: 3 })
  }
  assert.deepEqual(errors, [], 'Browser page errors')
})

test('production manifest restricts injection and grants no API host for the placeholder', async () => {
  const manifest = JSON.parse(await readFile('.output/chrome-mv3/manifest.json', 'utf8'))
  assert.equal(manifest.manifest_version, 3)
  assert.deepEqual(manifest.content_scripts[0].matches, [`${origin}/*`])
  assert.equal(manifest.content_scripts[0].all_frames, false)
  assert.deepEqual(manifest.host_permissions ?? [], [])
  assert.ok(manifest.background.service_worker)
  assert.ok(manifest.icons['128'])
})

test('Shadow DOM isolates styles, preserves portal input, and keeps keyboard focus', async t => {
  const page = await portal(placeholder, t)
  await page.evaluate(() => document.fonts.ready)
  assert.deepEqual(await page.getByRole('dialog').evaluate(panel => ({
    width: panel.getBoundingClientRect().width, height: panel.getBoundingClientRect().height,
    fontSize: getComputedStyle(panel).fontSize, bodyMargin: getComputedStyle(document.body).margin,
  })), { width: 380, height: 600, fontSize: '16px', bodyMargin: '37px' })
  await page.locator('#portal-button').click()
  assert.equal(await page.evaluate(() => window.portalClicks), 1)
  await page.getByRole('button', { name: 'Riwayat chat', exact: true }).click()
  await page.getByText('Belum ada riwayat percakapan').waitFor()
  await page.getByRole('button', { name: 'Kembali', exact: true }).click()
  await page.getByRole('textbox', { name: 'Tulis pesan' }).fill('draft')
  await page.screenshot({ path: '.output/qa/extension-desktop.png' })
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'Buka chatbot' }).waitFor()
  assert.equal(await page.getByRole('button', { name: 'Buka chatbot' }).evaluate(button => button === button.getRootNode().activeElement), true)
  assert.equal(await page.evaluate(() => window.portalKeys), 0)
})

test('placeholder displays unavailable without calling the backend', async t => {
  const page = await portal(placeholder, t)
  const count = received.length
  await page.getByRole('textbox', { name: 'Tulis pesan' }).fill('Data penduduk DIY')
  await page.getByRole('textbox', { name: 'Tulis pesan' }).press('Enter')
  await page.getByRole('alert').filter({ hasText: 'Layanan chatbot belum tersedia.' }).waitFor()
  assert.equal(received.length, count)
})

test('configured worker sends the contract and renders Markdown', async t => {
  const page = await portal(configured, t)
  await page.getByRole('textbox', { name: 'Tulis pesan' }).fill('Data penduduk DIY')
  await page.getByRole('textbox', { name: 'Tulis pesan' }).press('Enter')
  await page.getByRole('cell', { name: '42', exact: true }).waitFor()
  assert.deepEqual(received.at(-1), { message: 'Data penduduk DIY', method: 'POST', cookie: undefined })
  assert.equal(await page.getByRole('textbox', { name: 'Tulis pesan' }).evaluate(input => input === input.getRootNode().activeElement), true)
  await page.screenshot({ path: '.output/qa/extension-conversation.png' })
})

test('pending requests preserve drafts and prevent duplicate sends', async t => {
  const page = await portal(configured, t)
  const count = received.length
  const input = page.getByRole('textbox', { name: 'Tulis pesan' })
  await input.fill('slow')
  await input.press('Enter')
  await page.getByRole('status').waitFor()
  await waitFor(() => received.length > count)
  await input.fill('next draft')
  await input.press('Enter')
  assert.equal(await page.getByRole('button', { name: 'Kirim pesan' }).isDisabled(), true)
  assert.equal(received.length, count + 1)
  await page.getByRole('cell', { name: '42', exact: true }).waitFor()
  assert.equal(await input.inputValue(), 'next draft')
})

test('closing cancels the fetch and reopening starts fresh', async t => {
  const page = await portal(configured, t)
  const count = received.length, previousCancelled = cancelled
  await page.getByRole('textbox', { name: 'Tulis pesan' }).fill('slow')
  await page.getByRole('textbox', { name: 'Tulis pesan' }).press('Enter')
  await waitFor(() => received.length > count)
  await page.getByRole('button', { name: 'Tutup chatbot' }).click()
  await waitFor(() => cancelled > previousCancelled)
  await page.getByRole('button', { name: 'Buka chatbot' }).click()
  assert.equal(await page.getByRole('log').count(), 0)
})

test('backend failures end loading and show the existing error state', async t => {
  const page = await portal(configured, t)
  await page.getByRole('textbox', { name: 'Tulis pesan' }).fill('status')
  await page.getByRole('textbox', { name: 'Tulis pesan' }).press('Enter')
  await page.getByRole('alert').filter({ hasText: 'Maaf, terjadi kesalahan' }).waitFor()
  assert.equal(await page.getByRole('status').count(), 0)
})

test('overlay fits narrow, portrait and landscape viewports', async t => {
  const page = await portal(placeholder, t)
  for (const [width, height] of [[390, 844], [320, 568], [844, 390]]) {
    await page.setViewportSize({ width, height })
    const box = await page.getByRole('dialog').boundingBox()
    assert.ok(box.x >= 0 && box.y >= 0 && box.x + box.width <= width && box.y + box.height <= height)
  }
  await page.setViewportSize({ width: 390, height: 844 })
  await page.screenshot({ path: '.output/qa/extension-mobile.png' })
})

test('entrance rises with staggered content and closing remains usable during motion', async t => {
  const page = await portal(placeholder, t, { reducedMotion: 'no-preference' })
  const panel = page.getByRole('dialog')
  const motion = await panel.evaluate(element => {
    const animations = element.getAnimations({ subtree: true })
    const entrance = animations.find(animation => animation.effect.target === element)
    const content = animations.filter(animation => animation.effect.target !== element)
    for (const animation of animations) animation.pause()
    entrance.currentTime = 0
    const start = getComputedStyle(element)
    const startOpacity = Number(start.opacity)
    const startY = new DOMMatrixReadOnly(start.transform).m42
    const delays = content.map(animation => Number(animation.effect.getTiming().delay))
    for (const animation of animations) animation.finish()
    return { startOpacity, startY, endOpacity: Number(getComputedStyle(element).opacity), delays }
  })
  assert.equal(motion.startOpacity, 0)
  assert.ok(motion.startY > 0, 'Panel starts below its resting position')
  assert.equal(motion.endOpacity, 1)
  assert.ok(new Set(motion.delays).size >= 3, 'Greeting, capsules and composer enter in stages')
  await page.getByRole('textbox', { name: 'Tulis pesan' }).fill('draft')
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'Buka chatbot' }).waitFor()
  assert.equal(await page.getByRole('button', { name: 'Buka chatbot' }).evaluate(button => button === button.getRootNode().activeElement), true)

  // Close before the delayed child animations end; they must not finish the panel's exit.
  await page.getByRole('button', { name: 'Buka chatbot' }).click()
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'Buka chatbot' }).waitFor()
  assert.equal(await panel.count(), 0)
  await page.getByRole('button', { name: 'Buka chatbot' }).click()
  await panel.evaluate(async element => {
    await Promise.allSettled(element.getAnimations({ subtree: true }).map(animation => animation.finished))
  })
  assert.equal(await page.getByRole('textbox', { name: 'Tulis pesan' }).inputValue(), '')
  assert.equal(await panel.getAttribute('data-state'), 'open')
})

test('reduced motion shows content immediately and capsules remain reachable at narrow widths', async t => {
  const page = await portal(placeholder, t)
  assert.equal(await page.getByRole('dialog').evaluate(element => element.getAnimations({ subtree: true }).length), 0)
  for (const [width, height] of [[1280, 900], [390, 844], [320, 568], [844, 390]]) {
    await page.setViewportSize({ width, height })
    const bounds = await page.locator('.idmc-suggestion-list').evaluate(list => ({
      width: list.clientWidth, scrollWidth: list.scrollWidth,
      height: list.clientHeight, scrollHeight: list.scrollHeight,
    }))
    assert.ok(bounds.scrollWidth <= bounds.width, 'Capsules do not disappear off the right edge')
    assert.ok(bounds.scrollHeight <= bounds.height, 'The three supplied suggestions fit without scrolling')
    assert.equal(await page.locator('.idmc-hero-title').evaluate(element => getComputedStyle(element).opacity), '1')
  }
  await page.getByRole('button', { name: 'Statistik pendidikan', exact: true }).click()
  await page.getByRole('alert').filter({ hasText: 'Layanan chatbot belum tersedia.' }).waitFor()
})

test('other origins and portal iframes do not receive the chatbot', async t => {
  const page = await portal(placeholder, t)
  assert.equal(await page.frameLocator('iframe').locator('idmc-chatbot-extension').count(), 0)
  await placeholder.route('https://example.org/**', route => route.fulfill({ contentType: 'text/html', body: '<h1>Other site</h1>' }))
  await page.goto('https://example.org/extension-test', { waitUntil: 'networkidle' })
  assert.equal(await page.locator('idmc-chatbot-extension').count(), 0)
})

test('view motion preserves the conversation, stationary gradient and reduced-motion behavior', async t => {
  const page = await portal(configured, t, { reducedMotion: 'no-preference' })
  const panel = page.getByRole('dialog')
  await settleMotion(panel)
  const surface = await page.locator('.idmc-view').evaluate(view => getComputedStyle(view).backgroundImage)
  assert.match(surface, /linear-gradient/)
  assert.match(surface, /rgb\(255, 255, 255\)/)
  assert.match(surface, /rgb\(255, 243, 207\)/)

  const input = page.getByRole('textbox', { name: 'Tulis pesan' })
  await input.fill('slow')
  await input.press('Enter')
  await page.getByRole('status').waitFor()
  const composition = await page.locator('.idmc-conversation').evaluate(view => ({
    surface: getComputedStyle(view).backgroundImage,
    transform: getComputedStyle(view).transform,
    readingSurface: getComputedStyle(view.querySelector('.idmc-message-list')).backgroundColor,
    motion: ['.idmc-top-bar', '.idmc-message-list', '.idmc-chat-input'].map(selector =>
      getComputedStyle(view.querySelector(selector)).animationName),
  }))
  assert.equal(composition.surface, surface)
  assert.equal(composition.transform, 'none', 'The gradient does not slide when views change')
  assert.equal(composition.readingSurface, 'rgb(255, 255, 255)')
  assert.ok(composition.motion.every(name => name !== 'none'))
  await page.getByRole('cell', { name: '42', exact: true }).waitFor()
  await settleMotion(panel)

  await input.fill('slow')
  await input.press('Enter')
  await page.getByRole('status').waitFor()
  assert.equal(await page.locator('.idmc-message--user').first().evaluate(message => message.getAnimations().length), 0,
    'Appending a message does not replay an existing message entrance')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  assert.equal(await panel.evaluate(element => element.getAnimations({ subtree: true }).length), 0,
    'Reduced motion also stops the loading dots and composer transition')
  await page.getByRole('status').waitFor({ state: 'detached' })

  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.getByRole('button', { name: 'Riwayat chat', exact: true }).click()
  await page.getByText('Belum ada riwayat percakapan.').waitFor()
  await settleMotion(panel)
  assert.equal(await page.locator('.idmc-history').evaluate(view => getComputedStyle(view).backgroundImage), surface)
  await page.screenshot({ path: '.output/qa/extension-history.png' })
  await page.getByRole('button', { name: 'Kembali', exact: true }).click()
  await settleMotion(panel)
  assert.equal(await page.locator('.idmc-message--user').count(), 2)
  assert.equal(await input.evaluate(element => element === element.getRootNode().activeElement), true)
})

test('preview history rows stagger once and selection remains usable on small screens', async t => {
  const preview = await createViteServer({ server: { host: '127.0.0.1', port: 0 }, clearScreen: false })
  await preview.listen()
  t.after(() => preview.close())
  const page = await placeholder.newPage()
  page.on('pageerror', error => errors.push(error.message))
  t.after(() => page.close())
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto(`http://127.0.0.1:${preview.httpServer.address().port}`)
  await page.getByRole('button', { name: 'Buka chatbot' }).click()
  await page.getByRole('button', { name: 'Riwayat chat', exact: true }).click()
  const rows = page.locator('.idmc-history__list > li')
  assert.equal(await rows.count(), 4)
  const delays = await rows.evaluateAll(items => items.map(item => parseFloat(getComputedStyle(item).animationDelay)))
  assert.ok(delays.every((value, index) => index === 0 || value > delays[index - 1]))
  await settleMotion(page.getByRole('dialog'))
  await page.getByRole('button', { name: 'Data penduduk DIY', exact: true }).click()
  assert.equal(await page.getByRole('button', { name: 'Data penduduk DIY', exact: true }).getAttribute('aria-current'), 'true')
  assert.ok((await rows.evaluateAll(items => items.map(item => item.getAnimations().length))).every(count => count === 0))
  await page.screenshot({ path: '.output/qa/preview-history-populated.png' })
  await page.setViewportSize({ width: 320, height: 568 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  assert.equal(await page.getByRole('dialog').evaluate(element => element.getAnimations({ subtree: true }).length), 0)
  await page.getByRole('button', { name: 'Data kesehatan Yogyakarta', exact: true }).click()
  await page.screenshot({ path: '.output/qa/preview-history-mobile.png' })
  await page.getByRole('button', { name: 'Kembali', exact: true }).click()
  await page.getByRole('heading', { name: 'Chatbot Data Publik' }).waitFor()
})
