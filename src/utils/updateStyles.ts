import { PropertyValue } from '@/models/agentModel'

export const updateStyles = (newValues: PropertyValue[]) => {
  

   const colorValue = newValues[0]
   const fontValue = newValues[1]
   const screenSideValue = newValues[2]


   const stylesUpdated = {
      color: colorValue,
      font: fontValue,
      side: screenSideValue
   }
   return stylesUpdated
}
