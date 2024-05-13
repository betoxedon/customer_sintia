<script setup lang="ts">
   //import DrawerDefault from '@/drawer/DrawerDefault.vue'
   import HomeAgent from '@/components/agents/HomeAgent.vue'
   import FormCreateAgent from '@/components/agents/FormCreateAgent.vue'
   import FormUpdateAgent from '@/components/agents/FormUpdateAgent.vue'
   import AsideAgent from '@/drawer/AsideAgent.vue'
   import { computed, onMounted, onUnmounted } from 'vue'
   import SideBar from '@/components/sidebars/SideBar.vue'
   import { useGlobalStore } from '@/stores/globalStore'
   import { useAgentStore } from '@/stores/agentStore'
   import { usePlanStore } from '@/stores/planStore'  
   const globalStore = useGlobalStore()
   const agentStore = useAgentStore()
   const planStore = usePlanStore()

   const planAgentsLimit = computed(() => {
      return planStore.planActive?.features.agentsLimit || 0
   })

   onMounted(async () => {
      agentStore.isLoading = true          
      agentStore.getAgents()     
      agentStore.getDatas()
   })
   onUnmounted(() => {
      agentStore.partialReset()
   })

   const btnDisabledClass = computed(() => {
      if (
         agentStore.creatingAgent ||
         agentStore.updatingAgent
         // globalStore.isPlanDisabled ||
         // agentStore.agents.length >= planAgentsLimit.value
      ) {
         return 'btn-disabled hidden'
      }
   })

   const onCreateAgent = () => {
      agentStore.partialReset()
      agentStore.creatingAgent = true
      agentStore.updatingAgent = false
   }

</script>

<template>
   <main class="main_home">      
      <SideBar />     
    


      <div class="main-inner grid-rows-[min-content_1fr_min-content]" >
         <div class="main-top flex items-center" >
            <span class="container-inner page_title">Chatbots</span>

            <div
               class="btn flex items-center gap-2 rounded-lg bg-primary-30 hover:opacity-90 text-white p-2 items-center"
               :class="btnDisabledClass"
               @click="onCreateAgent()">

               <MonoAdd class="" style="width:18px;margin-top:0;"/>
               <span
                  class="text-lg font-medium text-white hidden">
                  Consulte nossos planos
               </span>

               <span class="text-lg font-normal text-white" style="font-weight:400;"
                  >
                  Adicionar chatbot
               </span>
               
            </div>

         </div>

         <div class="flex justify-center items-center w-full" v-if="agentStore.isLoading">
            <AnimLoadingBtn class="text-primary-30 h-[36px]" />
         </div>
       
         <HomeAgent v-if="!agentStore.isLoading && !agentStore.creatingAgent && !agentStore.updatingAgent" />
         <FormCreateAgent v-else-if="!agentStore.isLoading &&  agentStore.creatingAgent" />
         <FormUpdateAgent v-else-if="!agentStore.isLoading &&  agentStore.updatingAgent" />

         
         <div class="main-bottom hidden">
            <div class="container-inner">
               <ul class="list-inside list-disc gap-y-3 px-4 py-4 leading-none">
                  <li v-if="globalStore.isPlanDisabled">Nenhum plano ativo</li>
                  <li
                     v-else-if="
                        planAgentsLimit === 1 && agentStore.agents.length === 1
                     ">
                     O limite de chatbots do seu plano foi atingido.
                  </li>

                  <li
                     v-else-if="
                        agentStore.agents.length === planAgentsLimit &&
                        planAgentsLimit !== 1
                     ">
                     O limite de {{ planAgentsLimit }} chatbots do seu plano foi
                     atingido
                  </li>

                  <li v-else-if="agentStore.agents.length < planAgentsLimit">
                     Utilizando {{ agentStore.agents.length }} de
                     {{ planAgentsLimit }} chatbots disponíveis
                  </li>
               </ul>
            </div>
         </div>
      </div>

      <AsideAgent v-if="agentStore.updatingAgent && agentStore.tabActive =='Customização'"/>
   </main>
</template>

<style>

.bg-primary-30 {
   background: #4f8aff;
}
</style>
