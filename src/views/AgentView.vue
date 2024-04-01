<script setup lang="ts">
   import DrawerDefault from '@/drawer/DrawerDefault.vue'
   import HomeAgent from '@/components/agents/HomeAgent.vue'
   import FormCreateAgent from '@/components/agents/FormCreateAgent.vue'
   import FormUpdateAgent from '@/components/agents/FormUpdateAgent.vue'
   import AsideAgent from '@/drawer/AsideAgent.vue'
   import { computed, onMounted, onUnmounted } from 'vue'
   import { getAgentsFirestore } from '@/services/handleFirebaseFirestore'
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
      if (agentStore.agents.length === 0) {
         await getAgentsFirestore()
      }
   })
   onUnmounted(() => {
      agentStore.partialReset()
   })
</script>

<template>
   <main class="main">
      <DrawerDefault />

      <div class="main-inner grid-rows-[min-content_1fr_min-content]">
         <div class="main-top">
            <span class="container-inner">Chatbots</span>
         </div>

         <HomeAgent v-if="!agentStore.creatingAgent && !agentStore.updatingAgent" />
         <FormCreateAgent v-else-if="agentStore.creatingAgent" />
         <FormUpdateAgent v-else-if="agentStore.updatingAgent" />

         <div class="main-bottom">
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

      <AsideAgent />
   </main>
</template>
