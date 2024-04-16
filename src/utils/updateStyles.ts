import { useCustomizableStore } from '@/stores/customizableStore'

export const updateStyles = (newValues: string[]) => {

   const colorValue = newValues[0]
   const fontValue = newValues[1]
   const screenSideValue = newValues[2]


   const stylesUpdated = {
      color: colorValue,
      fontFamily: fontValue,
      screenSide: screenSideValue
   }
   return stylesUpdated
}
