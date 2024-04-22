
import { userSchema } from '@/models/userModel'
import { planSchema } from '@/models/planModel'
import { useUserStore } from '@/stores/userStore'
import { usePlanStore } from '@/stores/planStore'

import {  
   actionGetUserByUidFirestore,
   actionGetUserByDocIdFirestore, 
   actionGetPlansFirestore,
   actionGetActivePlanFirestore,
} from '@/services/actions/firebase'

//* user
// export const createUserFirestore = async (initialUser: InitialUser) => {
//    const docId = await actionCreateUserFirestore(initialUser)
//    if (!docId) return
//    Object.assign(initialUser, { docId })
//    const user = userSchema.parse(initialUser)
//    const userParsed = userSchema.parse(user)
//    await updateUserFirestore(userParsed)
// }

// export const updateUserFirestore = async (user: UpdateUser) => {
//    user.updatedAt = setNowUtcUnix()
//    try {
//       await actionUpdateUserFirestore(user)
//       useUserStore().update(user)
//    } catch (error) {
//       console.error(error)
//    }
// }

export const getUserByUidFirestore = async (uid: string) => {
   const res = await actionGetUserByUidFirestore(uid)
   if (!res) return
   const user = userSchema.parse(res)
   useUserStore().update(user)
   return user
}

export const getUserByDocIdFirestore = async (docId: string) => {
   const res = await actionGetUserByDocIdFirestore(docId)
   const user = userSchema.parse(res)
   useUserStore().update(user)
}


//* plan

export const getPlansFirestore = async () => {
   const response = await actionGetPlansFirestore()
   response.forEach((item) => {
      const plan = planSchema.parse(item)
      plan.features.maxMonthlyMessagesToLocaleString =
         plan.features.maxMonthlyMessages.toLocaleString('pt-BR')
      usePlanStore().plans.push(plan)
   })
}

export const getActivePlanFirestore = async (planId: string | null) => {
   if (!planId) return
   try {
      const response = await actionGetActivePlanFirestore(planId)
      if (response) {
         const plan = planSchema.parse(response)
         usePlanStore().planActive = plan
      }
   } catch (error) {
      console.error()
   }
}
