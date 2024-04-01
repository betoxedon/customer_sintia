<script setup lang="ts">
   import DrawerDefault from '@/drawer/DrawerDefault.vue'
   import AsidePlan from '@/drawer/AsidePlan.vue'
   import { setNowUtcUnix, setPlanExpiresUtcUnix } from '@/utils'
   import {
      getActivePlanFirestore,
      updateUserFirestore,
   } from '@/services/handleFirebaseFirestore'
   import { useUserStore } from '@/stores/userStore'
   import { usePlanStore } from '@/stores/planStore'
   import { useAgentStore } from '@/stores/agentStore'
   import { useInterfaceStore } from '@/stores/interfaceStore'
   import { updateUserSchema } from '@/models/userModel'
   const userStore = useUserStore()
   const planStore = usePlanStore()
   const agentStore = useAgentStore()
   const interfaceStore = useInterfaceStore()

   const onSelectPlan = async (docId: string) => {
      if (docId === planStore.planActive?.docId) return
      const agentsLimitPlanSelected = planStore.plans.filter(
         (item) => item.docId === docId,
      )[0].features.agentsLimit
      if (agentStore.agents.length > agentsLimitPlanSelected) {
         interfaceStore.notificationMessage =
            'A quantidade de agentes que você possui é maior que a do seu novo plano. Por favor, exclua alguns agentes e tente novamente.'
         interfaceStore.notificationType = 'alert'
         interfaceStore.showNotification = true
         interfaceStore.notificationIsPersistent = true
         return
      } else {
         userStore.user.planId = docId
         let planExpiresAt = userStore.user.planExpiresAt
         if (!planExpiresAt || planExpiresAt < setNowUtcUnix()) {
            planExpiresAt = setNowUtcUnix()
         }
         userStore.user.planExpiresAt = setPlanExpiresUtcUnix(planExpiresAt, 30)
         userStore.user.addDaysToPlanAt = setNowUtcUnix()
         const userParsed = updateUserSchema.parse(userStore.user)
         await updateUserFirestore(userParsed)
         const planId = useUserStore().user.planId
         await getActivePlanFirestore(planId as string)
      }
   }
</script>

<template>
   <main class="main">
      <DrawerDefault />

      <div class="main-inner grid-rows-[min-content_1fr_min-content]">
         <div class="main-top">
            <span class="container-inner">Planos</span>
         </div>

         <div class="main-core">
            <div
               class="container-inner grid-rows-[min-content_1fr grid-cols-12 gap-y-3">
               <div
                  class="tips col-span-full mx-auto flex w-full flex-col pt-5 text-lg">
                  <span class="text-lg font-medium">
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
                  class="col-span-full mx-auto grid w-full grid-cols-12 place-items-center gap-y-12 px-1 py-4 maxw:w-[940px] maxw:gap-x-8">
                  <div
                     v-for="(item, index) in planStore.plansSorted"
                     :key="index"
                     class="col-span-full flex w-full max-w-[340px] flex-col rounded-lg border border-primary-30 bg-white px-4 py-6 hover:bg-primary-5 maxw:col-span-4 maxw:max-w-[300px]"
                     :class="{
                        'outline-dotted outline-offset-2 outline-primary-30 hover:bg-white':
                           item.docId === planStore.planActive?.docId,
                     }">
                     <span
                        class="col-span-full mb-6 block border-b border-b-primary-30 font-bold">
                        {{ item.planName }}
                     </span>

                     <div
                        class="col-span-8 mb-6 flex items-center justify-center gap-x-1 rounded-lg bg-surface-10 px-3 py-2 maxw:col-span-full">
                        <MonoBot class="pb-[1px]" />
                        <span v-if="item.features.agentsLimit == 1" class="text-lg">
                           {{ item.features.agentsLimit }} Chatbot
                        </span>
                        <span v-else>{{ item.features.agentsLimit }} Chatbots</span>
                     </div>

                     <span
                        class="col-span-4 flex h-14 justify-center text-[30px] font-bold leading-9 maxw:col-span-full">
                        R${{ item.planValue }},
                        <span class="text-sm">00</span>
                     </span>

                     <div
                        v-if="item.docId === planStore.planActive?.docId"
                        class="btn btn-p pointer-events-none col-span-full mb-6 bg-primary-30"
                        @click="onSelectPlan(item.docId)">
                        <span>Seu plano</span>
                     </div>

                     <div
                        v-else
                        class="btn btn-p col-span-full mb-6 bg-primary-30"
                        :class="{
                           'btn-disabled pointer-events-none': userStore.user.planId,
                        }"
                        @click="onSelectPlan(item.docId)">
                        <span>Assinar</span>
                     </div>

                     <div class="col-span-6 flex flex-col gap-x-3">
                        <span
                           v-if="item.features.agentsLimit == 1"
                           class="flex gap-x-2 truncate">
                           <MonoCheck class="text-positive" />
                           Disponível:
                           {{ item.features.agentsLimit }}
                           Chatbot
                        </span>

                        <span v-else class="flex gap-x-2 truncate">
                           <MonoCheck class="text-positive" />
                           Disponível: {{ item.features.agentsLimit }} Chatbots
                        </span>

                        <span class="flex gap-x-2 truncate">
                           <MonoCheck class="text-positive" />
                           {{ item.features.maxMonthlyMessagesToLocaleString }}
                           créditos
                        </span>

                        <span
                           class="mt-5 block truncate rounded-lg py-2 text-center text-sm">
                           • Créditos válidos por 30 dias
                        </span>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div class="main-bottom">
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
