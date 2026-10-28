import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'wxt'

export default defineConfig({
  srcDir: 'src',
  manifestVersion: 3,
  modules: ['@wxt-dev/module-react'],
  imports: false,
  manifest: {
    name: 'IDMC Chatbot',
    description: 'Chatbot Data Publik untuk portal IDMC Daerah Istimewa Yogyakarta.',
    minimum_chrome_version: '120',
  },
  vite: () => ({ plugins: [tailwindcss()] }),
  webExt: { startUrls: ['https://idmc.jogjaprov.go.id/'] },
})
