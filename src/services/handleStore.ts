import type { InitialUser } from '@/models/userModel'
import {
   getCustomizablesFirestore,
   getPlansFirestore,
   getAgentsFirestore,
   getActivePlanFirestore,
} from '@/services/handleFirebaseFirestore'

import { useGlobalStore } from '@/stores/globalStore'
import { useUserStore } from '@/stores/userStore'
import { useAgentStore } from '@/stores/agentStore'
import { usePlanStore } from '@/stores/planStore'
import { useInterfaceStore } from '@/stores/interfaceStore'

export const setInitialStore = async (initialUserParsed: InitialUser) => {
   await getCustomizablesFirestore()
   await getPlansFirestore()
   await getAgentsFirestore()
   if (initialUserParsed.planId)
      await getActivePlanFirestore(initialUserParsed.planId)
   useGlobalStore().userRoles.isAnonymous = !initialUserParsed.uid
   useGlobalStore().userRoles.isAuthenticated = !!initialUserParsed.uid
   useGlobalStore().userRoles.isAdmin = !!initialUserParsed.isAdmin
}

export const resetUserStore = () => {
   useAgentStore().$reset()
   useGlobalStore().$reset()
   useInterfaceStore().$reset()
   usePlanStore().$reset()
   useUserStore().$reset()
}
