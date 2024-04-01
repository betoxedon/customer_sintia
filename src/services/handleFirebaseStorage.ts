import type { Agent } from '@/models/agentModel'
import { updateUserSchema } from '@/models/userModel'
import { setStringToId, generateInvalidator } from '@/utils'
import { useUserStore } from '@/stores/userStore'
import { useAgentStore } from '@/stores/agentStore'
import {
   updateAgentFirestore,
   updateUserFirestore,
} from '@/services/handleFirebaseFirestore'

import {
   actionUploadAgentImageStorage,
   actionUploadUserImageStorage,
} from '@/services/actions/firebase'

const { VITE_FIREBASE_STORAGE_BUCKET } = import.meta.env

const defaultStorageURL = `https://firebasestorage.googleapis.com/v0/b/${VITE_FIREBASE_STORAGE_BUCKET}/o/`

export const uploadAgentImageStorage = async (imageFile: File) => {
   const email = useUserStore().user.email
   const emailParsed = setStringToId(email)
   if (!emailParsed) return

   const uploadResult = await actionUploadAgentImageStorage(emailParsed, imageFile)
   const fullPath = uploadResult.ref.fullPath
   const codeInvalidator = generateInvalidator(12)
   const imageUrl =
      defaultStorageURL +
      encodeURIComponent(fullPath) +
      '?alt=media&code=' +
      codeInvalidator
   const newAgent = useAgentStore().agentActive
   newAgent.imageUrl = imageUrl
   if (useAgentStore().updatingAgent) {
      await updateAgentFirestore(newAgent as Agent)
   }
}

export const uploadUserImageStorage = async (imageFile: File) => {
   const email = useUserStore().user.email
   const emailParsed = setStringToId(email)

   if (!emailParsed) return
   const uploadResult = await actionUploadUserImageStorage(emailParsed, imageFile)
   const fullPath = uploadResult.ref.fullPath
   const codeInvalidator = generateInvalidator(12)
   const imageUrl =
      defaultStorageURL +
      encodeURIComponent(fullPath) +
      '?alt=media&code=' +
      codeInvalidator
   const user = useUserStore().user
   user.imageUrl = imageUrl

   const userParsed = updateUserSchema.parse(user)
   await updateUserFirestore(userParsed)
}
