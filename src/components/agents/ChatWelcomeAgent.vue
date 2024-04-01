<script setup lang="ts">
   import { computed } from 'vue'
   import { useAgentStore } from '@/stores/agentStore'
   import { useInterfaceStore } from '@/stores/interfaceStore'
   const agentStore = useAgentStore()
   const interfaceStore = useInterfaceStore()

   const closeChatBalloonStyle = computed(() => {
      if (agentStore.agentActive.screenSideId === 'id01') {
         return 'left: -1.5px;'
      } else {
         return 'right: -1.5px;'
      }
   })

   const screenSideClasses = computed(() => {
      if (agentStore.agentActive.screenSideId === 'id01') {
         return 'rounded-tr-none'
      } else if (agentStore.agentActive.screenSideId === 'id02') {
         return 'order-last rounded-tl-none'
      }
   })
</script>

<template>
   <div
      class="flex h-[74px] flex-nowrap items-start gap-x-3 overflow-hidden p-[3px]">
      <div
         class="chat-balloon show-in pointer-events-none relative flex w-full items-center gap-x-2 rounded-full bg-white px-5 py-2 shadow-md"
         :class="screenSideClasses">
         <div class="flex w-full items-center justify-between gap-x-3">
            <div class="flex min-h-[48px] select-none items-center justify-center">
               <span
                  class="text-center"
                  :style="agentStore.agentActive.fontFamilyStyle">
                  {{ agentStore.agentActive.welcomeMessage }}
               </span>
            </div>
         </div>

         <div
            class="absolute top-[0.5px] rounded-full border border-white bg-slate-500 p-0.5"
            :style="closeChatBalloonStyle">
            <MonoClose class="h-4 w-4 text-white" />
         </div>
      </div>

      <div
         class="relative m-1 flex h-[66px] w-[66px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-white bg-white shadow-md hover:bg-slate-50"
         @click="interfaceStore.showDialogAgentImage = true">
         <img
            v-if="agentStore.agentActive.imageUrl"
            :src="agentStore.agentActive.imageUrl"
            class="h-full w-full" />
         <MonoLogo v-else class="h-11 w-11 text-slate-600" />
      </div>
   </div>
</template>
