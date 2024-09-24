import '@/assets/styles/responsive.css'
import '@/assets/styles/tailwind.css'
import '@/assets/styles/additional.css'
import '@/assets/styles/tabs.css'
import VueMarkdown from 'vue-markdown-render'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import i18next from 'i18next'
import { z } from 'zod'
import { zodI18nMap } from 'zod-i18n-map'
import translation from 'zod-i18n-map/locales/pt/zod.json'
import router from '@/router'

import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

import {Tabs, Tab} from 'vue3-tabs-component';

import markdownit from 'markdown-it'

const md = markdownit()

md.set({ breaks: true, linkify: true, typographer: true, html:true, xhtmlOut:true })
md.linkify.set({ fuzzyLink: false, fuzzyEmail: false})

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
app.use(PrimeVue, {
   theme: {
       preset: Aura,
       options: {
         prefix: 'p',
         darkModeSelector: 'white',
         cssLayer: false
     }
   },
   locale: {
      accept: 'Aceptar',
      reject: 'Rechazar',
      monthNames:['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
      monthNamesShort:['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      
      dayName:['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
      dayNamesShort:['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
      dayNamesMin:['Do', 'Se', 'Te', 'Qa', 'Qi', 'Se', 'Sá']
      
      //...
  }
});

app.component('mytabs', Tabs)
app.component('mytab', Tab)
app.component('VueMarkdown', VueMarkdown)
   
app.mount('#app')
