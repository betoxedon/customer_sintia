<script setup lang="ts">
   import { computed } from 'vue'
   import { setDataConfirmation } from '@/utils'
   import { useRouter } from 'vue-router'
   import { useGlobalStore } from '@/stores/globalStore'
   import { useUserStore } from '@/stores/userStore'
   import { usePlanStore } from '@/stores/planStore'
   import { useAgentStore } from '@/stores/agentStore'
   const router = useRouter()
   const globalStore = useGlobalStore()
   const userStore = useUserStore()
   const planStore = usePlanStore()
   const agentStore = useAgentStore()

   const monthlyMessagesUsed = computed(() => {
      return userStore.user.monthlyMessagesUsed || 0
   })

   const maxMonthlyMessages = computed(() => {
      return planStore.planActive?.features.maxMonthlyMessages || 0
   })

   const monthlyMessagesUsedToLocale = computed(() => {
      if (!monthlyMessagesUsed.value) return 0
      return monthlyMessagesUsed.value.toLocaleString('pt-BR')
   })

   const maxMonthlyMessagesToLocale = computed(() => {
      if (!maxMonthlyMessages.value) return 0
      return maxMonthlyMessages.value.toLocaleString('pt-BR')
   })

   const agentStatus = computed(() => {
      const activeAgents = agentStore.agents.length
      const agentsLimit = planStore.planActive?.features.agentsLimit
      if (planStore.planActive) {
         return `${activeAgents}/${agentsLimit}`
      } else {
         return '0/0'
      }
   })

   const onSignOut = () => {
      setDataConfirmation({
         action: 'handleSignOut',
         message: 'Tem certeza que deseja sair?',
      })
   }
</script>

<template>
   <div class="aside-top select-none">
      <div class="flex items-center gap-x-2">
         <div
            class="flex h-[56px] w-full items-center justify-between rounded-lg bg-primary-30 px-5">
            <div class="flex items-center">
               <MonoClock class="mr-1 text-white" />
               <span class="text-white">
                  {{ monthlyMessagesUsedToLocale }}/{{ maxMonthlyMessagesToLocale }}
               </span>
            </div>

            <div class="relative flex items-center">
               <MonoBot class="-mt-[2.5px] mr-1 h-[27px] text-white" />
               <span class="text-white">{{ agentStatus }}</span>
            </div>
         </div>

         <div class="btn btn-p h-[56px] w-4 bg-error" @click="onSignOut()">
            <MonoSignOut class="h-8 hover:opacity-80" />
         </div>
      </div>
   </div>

   <div class="aside-core">
      <div class="flex flex-col">
         <div v-if="globalStore.isPlanDisabled" class="flex flex-col gap-y-3">
            <div class="tips">
               <MonoInfo />
               <span>Você não tem um plano ativo</span>
            </div>

            <div class="btn btn-p" @click="router.push({ name: 'plans' })">
               <MonoList />
               <span>Selecionar</span>
            </div>
         </div>
      </div>
   </div>
</template>
