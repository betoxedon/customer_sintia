import { computed, shallowRef } from 'vue'
import { Plan } from '@/models/planModel'
import { defineStore } from 'pinia'

export const usePlanStore = defineStore('plan', () => {
   const plans = shallowRef<Plan[]>([])
   const planActive = shallowRef<Plan | null>(null)

   const plansSorted = computed(() => {
      return [...plans.value].sort((a, b) => a.planValue - b.planValue)
   })

   const $reset = () => {
      plans.value.length = 0
      planActive.value = null
   }

   return {
      plans,
      planActive,
      plansSorted,
      $reset,
   }
})
