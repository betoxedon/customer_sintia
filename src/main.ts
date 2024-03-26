import '@/assets/styles/tailwind.css'
import '@/assets/styles/additional.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import i18next from 'i18next'
import { z } from 'zod'
import { zodI18nMap } from 'zod-i18n-map'
import translation from 'zod-i18n-map/locales/pt/zod.json'
import router from '@/router'
const pinia = createPinia()
i18next.init({
   lng: 'pt',
   resources: {
      pt: {
         zod: translation,
      },
   },
})
z.setErrorMap(zodI18nMap)
const app = createApp(App)
app.use(pinia)
app.use(router)
const modules = import.meta.glob('@/components/icons/*.vue', {
   eager: true,
}) as any
for (const path in modules) {
   const pattern = /icons\/(.*).vue/
   const match = path.match(pattern)
   if (match) {
      const name = match[1]
      app.component(name, modules[path].default)
   }
}
app.mount('#app')
