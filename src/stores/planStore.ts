import { ref } from 'vue'
import { Plan } from '@/models/planModel'
import { defineStore } from 'pinia'

export const usePlanStore = defineStore('plan', () => {
   const plans = ref<Plan[]>([])
   const planActive = ref<Plan | null>(null)

   const $reset = () => {
      plans.value = []
      planActive.value = null
   }

   return {
      plans,
      planActive,
      $reset,
   }
})
