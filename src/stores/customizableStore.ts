import { Colors } from '@/models/globalModel'
import {Side,Font} from '@/models/agentModel'
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

   const fontFamilies = ref([] as Font[])
   
   const fontFamilyIdActive = ref<string>('')

   const screenSides = ref([] as Side[])
   const screenSideIdActive = ref<string>('')

   const welcomeMessageActive = ref<string>('')

   const $reset = () => {
      colors.value = {} as Colors
      colorIdActive.value = ''
      fontFamilies.value = [] as Font[]
      fontFamilyIdActive.value = ''
      screenSides.value = [] as Side[]
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
