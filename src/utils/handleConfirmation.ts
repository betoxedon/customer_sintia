import { ConfirmationData } from '@/models/globalModel'
import { signOutFirebase } from '@/services/handleFirebaseAuth'
import {
   getAgentsFirestore,
   deleteAgentFirestore,
} from '@/services/handleFirebaseFirestore'
import { useAgentStore } from '@/stores/agentStore'
import { useInterfaceStore } from '@/stores/interfaceStore'

export const setDataConfirmation = (confirmationData: ConfirmationData): void => {
   useInterfaceStore().confirmationData = confirmationData
   useInterfaceStore().showDialogConfirmation = true
}

export const resolveConfirmation = async () => {
   const confirmationData = useInterfaceStore().confirmationData
   const action = confirmationData?.action

   const resetConfirmation = () => {
      useAgentStore().partialReset()
      useInterfaceStore().showDialogConfirmation = false
      useInterfaceStore().confirmationData = undefined
   }

   const handleCancelForm = async () => {
      useAgentStore().$reset()
      await getAgentsFirestore()
      useInterfaceStore().showDialogConfirmation = false
      useInterfaceStore().confirmationData = undefined
   }

   const handleDeleteAgent = async () => {
      const docId = confirmationData?.param as string
      await deleteAgentFirestore(docId)
      resetConfirmation()
   }

   const handleSignOut = () => {
      signOutFirebase()
   }

   if (action === 'handleCancelForm') {
      await handleCancelForm()
   } else if (action === 'handleDeleteAgent') {
      await handleDeleteAgent()
   } else if (action === 'handleSignOut') {
      await handleSignOut()
   }
}
