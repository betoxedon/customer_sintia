<script setup lang="ts">
   import type { Agent } from '@/models/agentModel'
   import { computed } from 'vue'
   import { setColorStyle } from '@/utils'
   import { useGlobalStore } from '@/stores/globalStore'
   import { useAgentStore } from '@/stores/agentStore'
   import { usePlanStore } from '@/stores/planStore'
   import { useInterfaceStore } from '@/stores/interfaceStore'
   const globalStore = useGlobalStore()
   const agentStore = useAgentStore()
   const planStore = usePlanStore()
   const interfaceStore = useInterfaceStore()

   const planAgentsLimit = computed(() => {
      return planStore.planActive?.features.agentsLimit || 0
   })

   const btnDisabledClass = computed(() => {
      if (
         agentStore.creatingAgent ||
         agentStore.updatingAgent ||
         globalStore.isPlanDisabled ||
         agentStore.agents.length >= planAgentsLimit.value
      ) {
         return 'btn-disabled'
      }
   })

   const onCreateAgent = () => {
      agentStore.partialReset()
      agentStore.creatingAgent = true
      agentStore.updatingAgent = false
   }

   const onUpdateAgent = (agent: Agent) => {
      agentStore.partialReset()
      agentStore.agentActive = agent
      agentStore.updatingAgent = true
      agentStore.creatingAgent = false
   }

   const onshowDialogScript = (agent: Agent) => {
      agentStore.partialReset()
      agentStore.agentActive = agent
      interfaceStore.showDialogScript = true
   }
</script>

<template>
   <div class="main-core">
      <div class="container-inner grid-cols-12 grid-rows-[min-content_1fr]">
         <div
            v-if="
               !agentStore.creatingAgent &&
               !agentStore.updatingAgent &&
               agentStore.agents.length > 0
            "
            class="col-span-full mx-auto mb-6 grid w-full gap-y-3">
            <div
               v-if="agentStore.agents.length"
               class="tips col-span-full mb-3 flex text-lg">
               <span class="text-lg font-medium">
                  Edite ou copie o script de instalação
               </span>
            </div>
            <div
               v-for="(item, index) in agentStore.agents"
               :key="index"
               class="flex w-full flex-col items-center justify-between gap-x-2">
               <div
                  class="flex w-full max-w-[560px] justify-stretch gap-x-2 rounded-lg"
                  @click="onUpdateAgent(item as Agent)">
                  <div class="btn btn-p grow justify-start bg-white/70 pl-4">
                     <span
                        class="flex aspect-square w-14 items-center justify-center overflow-hidden rounded-full border-2 border-white"
                        :style="setColorStyle(item.colorId)">
                        <img
                           v-if="item.imageUrl"
                           :src="item.imageUrl"
                           class="object-cover" />

                        <MonoLogo v-else class="h-10 text-white" />
                     </span>

                     <span class="truncate font-normal !text-onsurface-30/80">
                        {{ item.nickname }}
                     </span>
                  </div>

                  <div class="flex gap-x-2">
                     <div class="btn btn-p bg-primary-5">
                        <span class="!text-onsurface-30/80">Editar</span>
                     </div>

                     <div
                        class="btn btn-p bg-primary-5"
                        @click.stop="onshowDialogScript(item as Agent)">
                        <span class="!text-onsurface-30/80">Script</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div class="col-span-12 mx-auto grid w-full max-w-[560px]">
            <div
               class="btn h-[68px] w-full rounded-lg bg-primary-30 hover:opacity-90"
               :class="btnDisabledClass"
               @click="onCreateAgent()">
               <span
                  class="text-lg font-medium text-white"
                  v-if="globalStore.isPlanDisabled">
                  Consulte nossos planos
               </span>
               <span
                  class="text-lg font-medium text-white"
                  v-else-if="agentStore.agents.length">
                  Adicionar chatbot
               </span>
               <span v-else class="text-lg font-medium text-white">
                  Crie seu primeiro chatbot
               </span>
            </div>
         </div>
      </div>
   </div>
</template>
