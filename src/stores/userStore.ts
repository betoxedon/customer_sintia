import { User, UpdateUser } from '@/models/userModel'
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
   const user = ref({} as User)

   const update = (supply: UpdateUser) => {
      Object.assign(user.value, supply)
   }

   const $reset = () => {
      user.value = {} as User
   }

   return {
      user,
      update,
      $reset,
   }
})
