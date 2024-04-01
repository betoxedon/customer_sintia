import { Colors, FontFamilies, ScreenSides } from '@/models/globalModel'
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useCustomizableStore = defineStore('customizable', () => {
   const colors = ref({} as Colors)
   const colorIdActive = ref<string>('')
   const colorPickerStyle = computed(() => {
      const colorsObj = Object.values(colors.value)
      const cssValues = colorsObj.map((item) => {
         const cssProp = item.prop
         const cssValue = item.value
         return `${cssProp}: ${cssValue};`
      })
      return cssValues
   })

   const fontFamilies = ref({} as FontFamilies)
   const fontFamilyIdActive = ref<string>('')

   const screenSides = ref({} as ScreenSides)
   const screenSideIdActive = ref<string>('')

   const welcomeMessageActive = ref<string>('')

   const $reset = () => {
      colors.value = {} as Colors
      colorIdActive.value = ''
      fontFamilies.value = {} as FontFamilies
      fontFamilyIdActive.value = ''
      screenSides.value = {} as ScreenSides
      screenSideIdActive.value = ''
      welcomeMessageActive.value = ''
   }

   return {
      colors,
      colorIdActive,
      colorPickerStyle,
      fontFamilies,
      fontFamilyIdActive,
      screenSides,
      screenSideIdActive,
      welcomeMessageActive,
      $reset,
   }
})
