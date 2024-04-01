import { useCustomizableStore } from '@/stores/customizableStore'

export const updateStyles = (newValues: string[]) => {
   const colorObj = useCustomizableStore().colors[newValues[0]]
   const fontFamilyObj = useCustomizableStore().fontFamilies[newValues[1]]
   const screenSideObj = useCustomizableStore().screenSides[newValues[2]]

   const colorProp = colorObj.prop
   const fontFamilyProp = fontFamilyObj.prop
   const screenSideProp = screenSideObj.prop

   const colorValue = colorObj.value
   const fontFamilyValue = fontFamilyObj.value
   const screenSideValue = screenSideObj.value

   const stylesUpdated = {
      colorStyle: `${colorProp}: ${colorValue};`,
      fontFamilyStyle: `${fontFamilyProp}: ${fontFamilyValue};`,
      screenSideStyle: `${screenSideProp}: ${screenSideValue};`,
   }
   return stylesUpdated
}
