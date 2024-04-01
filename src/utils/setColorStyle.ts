import { useCustomizableStore } from '@/stores/customizableStore'

export const setColorStyle = (colorId: string) => {
   const colorObj = useCustomizableStore().colors[colorId]
   const colorValue = colorObj.value

   const colorStyle = `background-color: ${colorValue}; outline-color: ${colorValue}; border-color: ${colorValue}; ring-color: ${colorValue}`

   return colorStyle
}
