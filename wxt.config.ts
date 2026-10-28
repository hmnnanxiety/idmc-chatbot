import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'wxt'
import { chatHostPermissions, parseChatEndpoint } from './src/config/chatEndpoint'

export default defineConfig({
  srcDir: 'src',
  manifestVersion: 3,
  modules: ['@wxt-dev/module-react'],
  imports: false,
  manifest: ({ mode }) => ({
    name: 'IDMC Chatbot',
    description: 'Chatbot Data Publik untuk portal IDMC Daerah Istimewa Yogyakarta.',
    minimum_chrome_version: '120',
    host_permissions: chatHostPermissions(parseChatEndpoint(import.meta.env.WXT_CHAT_API_URL, mode !== 'production')),
  }),
  vite: () => ({ plugins: [tailwindcss()] }),
  webExt: { startUrls: ['https://idmc.jogjaprov.go.id/'] },
})
