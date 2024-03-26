<script setup lang="ts">
   import { computed } from 'vue'
   import { useAgentStore } from '@/stores/agentStore'
   import { useInterfaceStore } from '@/stores/interfaceStore'
   const agentStore = useAgentStore()
   const interfaceStore = useInterfaceStore()

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
      class="pointer-events-none flex select-none flex-nowrap items-end justify-between gap-x-3">
      <div
         class="flex w-full items-center gap-x-2 rounded-full bg-white px-5 py-2"
         :class="screenSideClasses">
         <div class="flex w-full items-center justify-between gap-x-3">
            <div class="flex min-h-[48px] select-none items-center justify-center">
               <span :style="agentStore.agentActive.fontFamilyStyle">
                  {{ agentStore.agentActive.welcomeMessage }}
               </span>
            </div>
         </div>
      </div>

      <div
         class="m-1 flex aspect-square w-[59px] shrink-0 items-center justify-center overflow-hidden rounded-full"
         :style="agentStore.agentActive.colorStyle"
         @click="interfaceStore.showDialogAgentImage = true">
         <img
            v-if="agentStore.agentActive.imageUrl"
            :src="agentStore.agentActive.imageUrl"
            class="object-cover" />
         <MonoLogo v-else class="h-10 text-white" />
      </div>
   </div>
</template>
