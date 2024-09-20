import { ConfirmationData } from '@/models/globalModel'
import { signOutFirebase } from '@/services/handleFirebaseAuth'
import { materiaStore } from '@/stores/materialStore'

import { useAgentStore } from '@/stores/agentStore'
import { useInterfaceStore } from '@/stores/interfaceStore'


export const setDataConfirmation = (confirmationData: ConfirmationData,): void => {
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
      //await getAgentsFirestore()
      useInterfaceStore().showDialogConfirmation = false
      useInterfaceStore().confirmationData = undefined
   }

   const handleDeleteAgent = async () => {
      const id = confirmationData?.param as string
      //await deleteAgentFirestore(id)
      await useAgentStore().deleteAgent(id)
      
      resetConfirmation()
      
   }

   const handleDeleteMaterial = async () => {
      const url = confirmationData?.param as string
      const botId = confirmationData?.param2 as string
      //await deleteMaterialFirestore(id)
      materiaStore().deleteMaterial(botId,url)

      useInterfaceStore().showDialogConfirmation = false
      useInterfaceStore().confirmationData = undefined
   }

   const handleDeleteAllMaterials = async () => {
      const botId = confirmationData?.param as string

      materiaStore().deleteAllMaterials(botId)

      useInterfaceStore().showDialogConfirmation = false
      useInterfaceStore().confirmationData = undefined
   }
   
   const handleDeleteFileMaterial = async () =>{
      const botId = confirmationData?.param2 as string
      const urls = confirmationData?.param3 as Array<string>

      materiaStore().deleteFileMaterial(botId,urls)

      useInterfaceStore().showDialogConfirmation = false
      useInterfaceStore().confirmationData = undefined



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
   else if (action === 'handleDeleteMaterial') {
      await handleDeleteMaterial()
   }
   else if (action === 'handleDeleteAllMaterials') {
      await handleDeleteAllMaterials()
   }
   else if (action === 'handleDeleteFileMaterial') {
      await handleDeleteFileMaterial()
   }
}
