<script setup lang="ts">
   import type { Agent } from '@/models/agentModel'
   import { computed } from 'vue'
   import { setColorStyle } from '@/utils'
   import { useGlobalStore } from '@/stores/globalStore'
   import { useAgentStore } from '@/stores/agentStore'
   import { usePlanStore } from '@/stores/planStore'
   import { useInterfaceStore } from '@/stores/interfaceStore'
   import {setDataConfirmation} from '@/utils'
   import ChatDropdown from '@/components/dropdowns/ChatDropdown.vue'

   import ChatBotCard from '@/components/cards/ChatBotCard.vue' 

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

   const onDeleteAgent = async (agent: Agent) => {
      agentStore.agentActive = agent
      setDataConfirmation({
         action: 'handleDeleteAgent',
         param: agentStore.agentActive.id as string,
         message: 'Tem certeza que deseja apagar ',
      })
      return
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
               class="tips col-span-full mb-3 flex text-lg hidden ">
               <span class="text-lg font-medium h">
                  Edite ou copie o script de instalação
               </span>
            </div>

            <!-- LISTA EM CARD-->
            <div class="flex flex-wrap gap-6 "> 
               <ChatBotCard 
               v-for="(item, index) in agentStore.agents"                
               :key="index" :item="item"
               />                        
               
               <!-- 
               <div
               class="my-bot bg-white p-3 drop-shadow-md rounded"
               v-for="(item, index) in agentStore.agents" 
               :key="index"
               >

               <div class="flex justify-between items-center"> 
               <div class="flex justify-between items-center"> 
                  <div class=" bot-body flex items-center gap-2 ">
                     <img
                     v-if="item.imageUrl"
                     :src="item.imageUrl"
                     class="object-cover inline-block h-12 w-12 rounded-full ring-2 ring-white" />
                     
                     <span class="font-normal !text-onsurface-30/80">
                        {{ item.name }}
                     </span>
                     <span class="truncate inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">{{ item.identifier }}</span>
                                 
                  
                  </div>

                  <div class="hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-dots-vertical "><path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path><path d="M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path><path d="M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path></svg>
                     </div>
                  
               </div>

               <ChatDropdown @UpdateAgent="onUpdateAgent(item as Agent)" @shareAgent="onshowDialogScript(item as Agent)" @deleteAgent="onDeleteAgent(item as Agent)"/>
               </div>

                  <div class="bot-footer flex items-center gap-2 mt-4 hidden  ">

                     
                     <div class="btn btn-p bg-primary-5" style="width:50%">
                        <span class="!text-onsurface-30/80">Editar</span>
                     </div>

                     <div
                        class="btn btn-p bg-primary-5" style="width:50%"
                        @click.stop="onshowDialogScript(item as Agent)">
                        <span class="!text-onsurface-30/80">Compartilhar</span>
                     </div>
                        


                  </div>             

               </div>
               -->
            </div>
          

            <!-- 
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
                        {{ item.name }}
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
           -->
         </div>

         <div class="col-span-12 mx-auto grid w-full max-w-[560px]">
            <div
               class="btn h-[68px] w-full rounded-lg bg-primary-30 hover:opacity-90 items-center btn-disabled"
               :class="btnDisabledClass"   
               v-if="globalStore.isPlanDisabled  || agentStore.agents.length == 0"           
               @click="onCreateAgent()">

               <span    
               v-if="globalStore.isPlanDisabled"               
                  class="text-lg font-medium text-white">
                  Consulte nossos planos
               </span>
               <span 
               v-else-if="agentStore.agents.length == 0"
               class="text-lg font-medium text-white">
                  Crie seu primeiro chatbot
               </span>

             
            </div>
         </div>
      </div>
   </div>
</template>
