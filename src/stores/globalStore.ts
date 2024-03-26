import { ImageUrl, UserRoles } from '@/models/globalModel'
import { ref, watch } from 'vue'
import { setNowUtcUnix } from '@/utils'
import { defineStore } from 'pinia'
import { useUserStore } from '@/stores/userStore'
import { usePlanStore } from '@/stores/planStore'
import { useAgentStore } from '@/stores/agentStore'

export const useGlobalStore = defineStore('global', () => {
   const userStore = useUserStore()
   const planStore = usePlanStore()
   const agentStore = useAgentStore()

   const imageUrlActive = ref<ImageUrl>('')
   const isPlanDisabled = ref<boolean>(true)
   const userRoles = ref<UserRoles>({
      isAnonymous: true,
      isAuthenticated: false,
      isAdmin: false,
   })

   const $reset = () => {
      imageUrlActive.value = ''
      isPlanDisabled.value = true
      userRoles.value = {
         isAnonymous: true,
         isAuthenticated: false,
         isAdmin: false,
      }
   }

   watch(
      planStore,
      () => {
         if (planStore.planActive) {
            if (
               agentStore.agents.length > planStore.planActive.features.agentsLimit
            ) {
               return (isPlanDisabled.value = true)
            } else if (
               userStore.user.monthlyMessagesUsed >=
               planStore.planActive.features.maxMonthlyMessages
            ) {
               return (isPlanDisabled.value = true)
            } else if (
               userStore.user.planExpiresAt &&
               userStore.user.planExpiresAt < setNowUtcUnix()
            ) {
               return (isPlanDisabled.value = true)
            } else {
               return (isPlanDisabled.value = false)
            }
         }
      },
      { immediate: true },
   )

   return {
      imageUrlActive,
      isPlanDisabled,
      userRoles,
      $reset,
   }
})
