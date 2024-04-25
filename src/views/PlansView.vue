<script setup lang="ts">

   import PlanCard from '@/components/cards/PlanCard.vue'
   // import DrawerDefault from '@/drawer/DrawerDefault.vue'
   import AsidePlan from '@/drawer/AsidePlan.vue'
   import { onMounted, ref } from 'vue'
   import { Plan } from '@/models/planModel'
   import { setNowUtcUnix, setPlanExpiresUtcUnix } from '@/utils'
   // import {
   //    getActivePlanFirestore,   
   // } from '@/services/handleFirebaseFirestore'
   import { useUserStore } from '@/stores/userStore'
   import { usePlanStore } from '@/stores/planStore'
   import { useAgentStore } from '@/stores/agentStore'
   import { useInterfaceStore } from '@/stores/interfaceStore'
   const userStore = useUserStore()
   const planStore = usePlanStore()
   const agentStore = useAgentStore()
   const interfaceStore = useInterfaceStore()
   import SideBar from '@/components/sidebars/SideBar.vue'
   const planActive = ref()
   const planIds = ref<string[]>([])
   const plansSorted = ref<Plan[]>([])

   const onSelectPlan = async (index: number) => {
      if (index === planActive.value) return
      const newActivePlan = plansSorted.value[index].features.agentsLimit
      if (agentStore.agents.length > newActivePlan) {
         interfaceStore.notificationMessage =
            'A quantidade de agents que você possui é maior que a do seu novo plano. Por favor, exclua alguns agents e tente novamente.'
         interfaceStore.notificationType = 'alert'
         interfaceStore.showNotification = true
         interfaceStore.notificationIsPersistent = true
         return
      } else {
         userStore.user.planId = planIds.value[index]
         let planExpiresAt = userStore.user.planExpiresAt
         if (!planExpiresAt || planExpiresAt < setNowUtcUnix()) {
            planExpiresAt = setNowUtcUnix()
         }
         userStore.user.planExpiresAt = setPlanExpiresUtcUnix(planExpiresAt, 30)
         userStore.user.addDaysToPlanAt = setNowUtcUnix()
         //const userParsed = updateUserSchema.parse(userStore.user)
         //await updateUserFirestore(userParsed)
         // const planId = useUserStore().user.planId
         // await getActivePlanFirestore(planId as string)
      }
   }

   onMounted(async () => {
      plansSorted.value = planStore.plans.sort((a, b) => {
         return a.planValue - b.planValue
      })
      if (!userStore.user.planId) return
      planIds.value = plansSorted.value.map((plan) => plan.docId)
      planActive.value = planIds.value.indexOf(userStore.user.planId)
   })
</script>

<template>
   <main class="main_home">
      <!-- <DrawerDefault /> -->
      <SideBar />
      <div class="main-inner ">
         <div class="main-top">
            <span class="container-inner page_title">Planos</span>
         </div>

         <div v-if="plansSorted.length>0" class="main-core" style="display:flex; flex-direction:column; justify-content: center;">
            <div
               class="container-inner gap-y-3">
               <div class="tips col-span-full mx-auto flex w-full flex-col pt-5 text-lg justify-center">

                  <span class="text-lg font-medium text-center">
                     Domine o futuro do atendimento ao cliente, desbloqueie todo o
                     potencial dos chatbots para impulsionar seu negócio
                  </span>

                  <span
                     class="mt-2 rounded-md bg-primary-5 px-3 py-2 text-center text-onsurface-30">
                     Aumente as vendas com conversões mais altas e leads
                     qualificados!
                  </span>
                  
               </div>

               <div
                  class="flex gap-6 justify-center">

                  <PlanCard 
                     v-for="(item, index) in plansSorted"
                     :key="index" :item="item" :index="index" :planActive="planActive" @onSelectPlan="onSelectPlan"
                     />   

               </div>
            </div>
         </div>

         <div v-else class="main-core" style="display:flex; flex-direction:column; justify-content: center;">
            <span>
               Planos ainda não disponíveis
            </span>
         </div>

         <div class=" hidden main-bottom">
            <div class="container-inner">
               <ul
                  class="flex list-inside list-disc flex-col gap-y-3 px-4 py-4 leading-none">
                  <li>
                     Melhore a experiência do cliente com suporte 24 horas por dia, 7
                     dias por semana, e respostas personalizadas
                  </li>
               </ul>
            </div>
         </div>
      </div>

      <AsidePlan />
   </main>
</template>
