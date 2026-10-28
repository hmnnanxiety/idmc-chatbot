/** Public build configuration, shared by manifest generation and tests. */
export function parseChatEndpoint(value: string | undefined, allowLocalHttp: boolean): string {
  const endpoint = value?.trim()
  if (!endpoint) return ''
  const url = new URL(endpoint)
  const localHttp = url.protocol === 'http:' && ['127.0.0.1', 'localhost'].includes(url.hostname)
  if (url.protocol !== 'https:' && !(allowLocalHttp && localHttp)) {
    throw new Error('WXT_CHAT_API_URL must use HTTPS (loopback HTTP is allowed in development/test).')
  }
  if (url.username || url.password || url.hash) {
    throw new Error('WXT_CHAT_API_URL cannot contain credentials or a fragment.')
  }
  return url.href
}

export function chatHostPermissions(endpoint: string): string[] {
  if (!endpoint) return []
  const url = new URL(endpoint)
  // Browser match patterns grant the scheme/host, independent of its port.
  return [`${url.protocol}//${url.hostname}/*`]
}
