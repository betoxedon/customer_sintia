<script setup lang="ts">
   import { useAgentStore } from '@/stores/agentStore'
   import {ref,computed} from 'vue'
   const agentStore = useAgentStore()

   const today = new Date().toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'short',
   })

   const backgroundColor = computed(() => {

      if(agentStore.agentActive.color.includes('background-color:')){
         return agentStore.agentActive.color
      }else{
         return 'background-color:'+agentStore.agentActive.color  
      }
   })
   const defaultFont = ref("font-family: ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'")

   const fontFamily = computed(() => {   
      return agentStore.agentActive.font?.property_value || defaultFont.value
   })

</script>

<template>
   <div class="grid content-end">
      <div
         class="pointer-events-none grid w-full select-none grid-rows-[min-content_minmax(0px,_480px)] overflow-hidden rounded-lg drop-shadow-md"
         :style="fontFamily">
         <div
            class="flex min-h-[74px] flex-col rounded-t-xl py-4 pl-5 pr-3"
            :style="backgroundColor">
            <div
               class="relative grid grid-cols-[1fr_min-content_min-content] items-center gap-x-2">
               <div class="flex flex-col truncate">
                  <span
                     v-if="agentStore.agentActive.name"
                     class="text-xl font-bold text-white">
                     {{ agentStore.agentActive.name }}
                  </span>
                  <span v-else class="text-xl font-bold text-white">Sintia</span>

                  <div class="flex items-center gap-x-1">
                     <span
                        class="mb-[0.5px] aspect-square h-[9px] rounded-full bg-[#02fe04]"></span>
                     <span class="text-sm font-medium text-white">Online</span>
                  </div>
               </div>

               <div class="absolute right-2 top-0 flex gap-x-2">
                  <span>
                     <MonoClose class="h-5 text-white" />
                  </span>
               </div>
            </div>
         </div>

         <div class="grid grid-rows-[1fr_min-content] bg-white pb-[6px]">
            <div class="grid grid-cols-2 content-start px-2 pb-1">
               <span
                  class="col-span-2 mb-4 mt-1 place-self-center rounded-lg bg-surface-10 px-4 py-0.5 text-base">
                  {{ today }}
               </span>

               <div class="col-span-full grid grid-cols-[min-content_77%] gap-x-2">
                  <div
                     class="flex aspect-square w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-30"
                     :style="backgroundColor">
                     <img
                        v-if="agentStore.agentActive.image_file"
                        :src="agentStore.agentActive.image_file"
                        class="object-cover" />
                     <MonoLogo v-else class="h-7 text-white" />
                  </div>

                  <span
                     class="mb-[22px] mt-3 grid place-self-start self-start rounded-2xl rounded-tl-none px-3 py-1.5 text-base text-white"
                     :style="backgroundColor">
                     {{ agentStore.agentActive.welcomeMessage }}
                  </span>
               </div>

               <div
                  class="col-span-full grid grid-cols-[minmax(0,_90%)] justify-end gap-x-2">
                  <span
                     class="relative mb-[10px] grid place-self-end rounded-2xl rounded-tr-none bg-surface-30 px-3 py-1.5 text-base before:bg-surface-30">
                     Olá! Eu gostaria qual horário vocês atendem hoje?
                  </span>
               </div>

               <div class="col-span-full grid grid-cols-[min-content_77%] gap-x-2">
                  <div
                     class="flex aspect-square w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-30"
                     :style="backgroundColor">
                     <img
                        v-if="agentStore.agentActive.image_file"
                        :src="agentStore.agentActive.image_file"
                        class="object-cover" />
                     <MonoLogo v-else class="h-7 text-white" />
                  </div>

                  <span
                     class="mb-[22px] mt-3 grid place-self-start self-start rounded-2xl rounded-tl-none px-3 py-1.5 text-base text-white"
                     :style="backgroundColor">
                     Hoje atendemos até as 18h.
                  </span>
               </div>

               <div
                  class="col-span-full grid grid-cols-[minmax(0,_90%)] justify-end gap-x-2">
                  <span
                     class="relative grid place-self-end rounded-2xl rounded-tr-none bg-surface-30 px-3 py-1.5 text-base before:bg-surface-30">
                     Ok, obrigado!
                  </span>
               </div>
            </div>

            <div class="mx-2 flex items-center overflow-hidden rounded-lg border">
               <input
                  id="chatMessage"
                  class="h-[40px] w-full border border-transparent bg-surface-10 text-base ring-transparent placeholder:text-base focus:border-primary-40"
                  type="text"
                  placeholder="Digite sua mensagem..." />

               <div
                  class="border-transparente flex aspect-square h-[40px] shrink-0 items-center justify-center rounded-r-lg bg-surface-10">
                  <MonoSend class="h-6 text-onsurface-20" />
               </div>
            </div>
         </div>
      </div>
   </div>
</template>
