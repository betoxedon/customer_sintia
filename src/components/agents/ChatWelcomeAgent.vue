<script setup lang="ts">
   import { computed, ref } from 'vue'
   import { useAgentStore } from '@/stores/agentStore'
   import { useInterfaceStore } from '@/stores/interfaceStore'
   import { useCustomizableStore } from '@/stores/customizableStore';

   const agentStore = useAgentStore()
   const interfaceStore = useInterfaceStore()
   const customizableStore = useCustomizableStore()

   const background = computed(() => {

   if(agentStore.agentActive.color.includes('background-color:')){
      return agentStore.agentActive.color
   }else{
      return 'background-color:'+agentStore.agentActive.color  
   }
   })


   const screenSideClasses = computed(() => {
   
      if (!agentStore.agentActive.side || agentStore.agentActive.side && agentStore.agentActive.side.name !== 'Esquerda') {
         return 'rounded-tr-none'
      } else {
         return 'order-last rounded-tl-none'
      }
   })
   const defaultFont = ref("font-family: ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'")
   
   const fontFamily = computed(() => {   
   return agentStore.agentActive.font?.property || agentStore.agentActive.font?.property_value||defaultFont.value
   })


</script>

<template>
   <div class="flex select-none flex-nowrap items-end justify-between gap-x-3">
      <div
         class="pointer-events-none flex w-full items-center gap-x-2 rounded-full bg-white px-5 py-2 drop-shadow-md"
         :class="screenSideClasses">
         <div class="flex w-full items-center justify-between gap-x-3">
            <div class="flex min-h-[48px] select-none items-center justify-center">
               <span :style="fontFamily">
                  {{ agentStore.agentActive.welcomeMessage }}
               </span>
            </div>
         </div>
      </div>

      <div
         class="m-1 flex aspect-square w-[59px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full"
         :style="background"
         @click="interfaceStore.showDialogAgentImage = true">
         <img
            v-if="agentStore.agentActive.image_file"
            :src="agentStore.agentActive.image_file"
            class="object-cover" />
            <MonoAddFile v-else class="h-10 text-white"/>
         
      </div>
   </div>
</template>
