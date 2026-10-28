import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createServer as createHttpServer } from 'node:http'
import { setTimeout as delay } from 'node:timers/promises'
import { createServer } from 'vite'

let vite, backend, endpoint, requestChatReply, ChatServiceUnavailableError
let parseChatEndpoint, chatHostPermissions, isPortalSender, handleChatPort
const received = []
let cancelled = 0

const waitFor = async predicate => {
  for (let i = 0; i < 100; i++) { if (predicate()) return; await delay(10) }
  assert.fail('Expected asynchronous condition did not occur')
}

before(async () => {
  vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
  ;({ requestChatReply, ChatServiceUnavailableError } = await vite.ssrLoadModule('/src/api/chatRequest.ts'))
  ;({ parseChatEndpoint, chatHostPermissions } = await vite.ssrLoadModule('/src/config/chatEndpoint.ts'))
  ;({ isPortalSender, handleChatPort } = await vite.ssrLoadModule('/src/extension/handleChatPort.ts'))
  backend = createHttpServer(async (req, res) => {
    let body = ''
    for await (const chunk of req) body += chunk
    const { message } = JSON.parse(body)
    received.push({ method: req.method, message, contentType: req.headers['content-type'] })
    res.setHeader('Content-Type', 'application/json')
    if (message === 'status') { res.writeHead(503).end('{}'); return }
    if (message === 'bad-json') { res.end('invalid'); return }
    if (message === 'empty') { res.end('{"reply":" "}'); return }
    if (message === 'slow') {
      const timer = setTimeout(() => res.end('{"reply":"late"}'), 500)
      res.on('close', () => { clearTimeout(timer); cancelled++ })
      return
    }
    res.end(JSON.stringify({ reply: `Reply to ${message}` }))
  })
  await new Promise(resolve => backend.listen(0, '127.0.0.1', resolve))
  endpoint = `http://127.0.0.1:${backend.address().port}/chat`
})

after(async () => {
  backend?.closeAllConnections()
  await new Promise(resolve => backend ? backend.close(resolve) : resolve())
  await vite?.close()
})

test('blank endpoint stays unconfigured and permissions cover only the configured host', () => {
  assert.equal(parseChatEndpoint('', false), '')
  assert.deepEqual(chatHostPermissions(''), [])
  const url = parseChatEndpoint(' https://rag.example.org/chat ', false)
  assert.equal(url, 'https://rag.example.org/chat')
  assert.deepEqual(chatHostPermissions(url), ['https://rag.example.org/*'])
})

test('endpoint rejects insecure hosts, credentials, fragments and production localhost', () => {
  for (const value of ['http://rag.example.org/chat', 'https://user:pass@example.org/chat',
    'https://example.org/chat#secret', 'javascript:alert(1)', '/chat']) {
    assert.throws(() => parseChatEndpoint(value, true), value)
  }
  assert.throws(() => parseChatEndpoint('http://127.0.0.1:8000/chat', false))
  assert.equal(parseChatEndpoint(endpoint, true), endpoint)
})

test('worker accepts only the extension content script in the IDMC top frame', () => {
  const sender = { id: 'extension-id', frameId: 0, tab: { id: 42 }, url: 'https://idmc.jogjaprov.go.id/dashboard' }
  assert.equal(isPortalSender(sender, 'extension-id'), true)
  for (const change of [{ frameId: 1 }, { id: 'other' }, { tab: undefined },
    { url: 'http://idmc.jogjaprov.go.id/' }, { url: 'https://idmc.jogjaprov.go.id.evil.org/' }, { url: 'invalid' }]) {
    assert.equal(isPortalSender({ ...sender, ...change }, 'extension-id'), false)
  }
})

test('HTTP adapter preserves the POST message/reply contract', async () => {
  assert.equal(await requestChatReply({ endpoint, message: 'data' }), 'Reply to data')
  assert.deepEqual(received.at(-1), { method: 'POST', message: 'data', contentType: 'application/json' })
})

test('HTTP adapter rejects unavailable, non-2xx, malformed and empty responses', async () => {
  await assert.rejects(requestChatReply({ endpoint: '', message: 'x' }), ChatServiceUnavailableError)
  for (const message of ['status', 'bad-json', 'empty']) {
    await assert.rejects(requestChatReply({ endpoint, message }))
  }
})

test('HTTP adapter enforces deadlines and supports caller cancellation', async () => {
  await assert.rejects(requestChatReply({ endpoint, message: 'slow', timeoutMs: 20 }), { name: 'TimeoutError' })
  const controller = new AbortController()
  controller.abort()
  await assert.rejects(requestChatReply({ endpoint, message: 'slow', signal: controller.signal }), { name: 'AbortError' })
})

function fakePort() {
  const messages = [], disconnects = [], responses = []
  return {
    responses,
    onMessage: { addListener: callback => messages.push(callback) },
    onDisconnect: { addListener: callback => disconnects.push(callback) },
    postMessage: value => responses.push(value),
    send: value => messages.forEach(callback => callback(value)),
    disconnect: () => disconnects.forEach(callback => callback()),
  }
}

test('worker returns unavailable without a network request and rejects invalid payloads', () => {
  const count = received.length
  const placeholder = fakePort()
  handleChatPort(placeholder, '')
  placeholder.send({ type: 'chat', message: 'hello' })
  assert.deepEqual(placeholder.responses, [{ ok: false, code: 'unavailable' }])
  assert.equal(received.length, count)
  for (const payload of [null, { type: 'fetch', message: 'x' }, { type: 'chat', message: ' ' },
    { type: 'chat', message: 'x'.repeat(20_001) }]) {
    const port = fakePort()
    handleChatPort(port, endpoint)
    port.send(payload)
    assert.deepEqual(port.responses, [{ ok: false, code: 'invalid' }])
  }
})

test('worker handles one request per port and returns typed failures', async () => {
  const port = fakePort()
  handleChatPort(port, endpoint)
  port.send({ type: 'chat', message: 'once' })
  port.send({ type: 'chat', message: 'duplicate' })
  await waitFor(() => port.responses.length === 1)
  assert.deepEqual(port.responses, [{ ok: true, reply: 'Reply to once' }])
  assert.equal(received.filter(request => request.message === 'duplicate').length, 0)
  const failure = fakePort()
  handleChatPort(failure, endpoint)
  failure.send({ type: 'chat', message: 'status' })
  await waitFor(() => failure.responses.length === 1)
  assert.deepEqual(failure.responses, [{ ok: false, code: 'failed' }])
})

test('disconnecting a chat port aborts the pending fetch without a late reply', async () => {
  const port = fakePort()
  const count = received.length, previousCancelled = cancelled
  handleChatPort(port, endpoint)
  port.send({ type: 'chat', message: 'slow' })
  await waitFor(() => received.length > count)
  port.disconnect()
  await waitFor(() => cancelled > previousCancelled)
  assert.deepEqual(port.responses, [])
})
