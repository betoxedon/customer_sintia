import type { InitialUser } from '@/models/userModel'
import { 
   getPlansFirestore,
   getActivePlanFirestore,
} from '@/services/handleFirebaseFirestore'

import { useGlobalStore } from '@/stores/globalStore'
import { useUserStore } from '@/stores/userStore'
import { useAgentStore } from '@/stores/agentStore'
import { usePlanStore } from '@/stores/planStore'
import { useInterfaceStore } from '@/stores/interfaceStore'


export const setInitialStore = async (initialUserParsed: InitialUser) => {  
   await getPlansFirestore()  
   useAgentStore().getAgents()
   if (initialUserParsed.planId)
      await getActivePlanFirestore(initialUserParsed.planId)

   useGlobalStore().userRoles.isAnonymous = !initialUserParsed.id
   useGlobalStore().userRoles.isAuthenticated = !!initialUserParsed.id
   useGlobalStore().userRoles.isAdmin = !!initialUserParsed.is_superuser
}

export const resetUserStore = () => {
   useAgentStore().$reset()
   useGlobalStore().$reset()
   useInterfaceStore().$reset()
   usePlanStore().$reset()
   useUserStore().$reset()
}
