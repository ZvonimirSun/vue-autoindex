import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Unocss from 'unocss/vite'
import { presetAttributify, presetIcons, presetUno } from 'unocss'
import AutoImport from 'unplugin-auto-import/vite'

// https://vitejs.dev/config/
export default defineConfig({
  server: { port: 3000, https: false },
  plugins: [
    vue({
      reactivityTransform: true,
    }),
    AutoImport({
      resolvers: [
        ElementPlusResolver(),
      ],
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
        'vue/macros',
      ],
      eslintrc: {
        enabled: true,
      },
      vueTemplate: true,
      dts: './src/auto-imports.d.ts',
    }),
    Unocss({
      mode: 'vue-scoped',
      presets: [presetUno(), presetAttributify(), presetIcons({
        mode: 'auto',
        extraProperties: {
          display: 'inline-block',
        },
      })],
    }),
    Components({
      dirs: ['src/components'],
      extensions: ['vue'],
      dts: './src/components.d.ts',
      resolvers: [
        ElementPlusResolver(),
      ],
    }),
  ],
})
