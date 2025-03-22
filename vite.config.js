import { fileURLToPath, URL } from 'node:url'

import { defineConfig,loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'


// https://vite.dev/config/
export default defineConfig(({mode})=>{
  const env = loadEnv(mode, process.cwd());
  return{
  plugins: [
    vue(),
    // vueDevTools(),
    VitePWA({
      injectRegister:false,
      fileName: 'manifest.webmanifest',
      publicPath: '/',
      basePath: '/assets/',
      selfDestroying:true,
      workbox: {
        runtimeCaching: []
      },
      manifest: {
        id: "ostore",
        name: "Ostore",
        short_name: "OStore",
        description: "Orange app store for kaios 3.1",
        lang: "en-US",
        theme_color: "#FFFFFF",
        orientation: "natural",
        start_url: "/index.html",
        display: "standalone",
        icons: [
          {
            src: "/ostore_56.png",
            type: "image/png",
            sizes: "56x56"
          },
          {
            src: "/ostore_112.png",
            type: "image/png",
            sizes: "112x112"
          }
        ],
        b2g_features: {
          // type: "privileged",
          permissions: {
            "device-storage:sdcard": { access: "readwrite" },
            "systemXHR": {},
          },
          version: env.VITE_APP_VERSION,
          origin: "ostore"
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    target: "firefox84"
  }
}
})
