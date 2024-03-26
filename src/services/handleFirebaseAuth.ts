import type { InitialFormUser, Credential } from '@/models/userModel'
import type { Email } from '@/models/globalModel'
import { credentialSchema, initialUserSchema, userSchema } from '@/models/userModel'
import { useInterfaceStore } from '@/stores/interfaceStore'
import { setInitialStore, resetUserStore } from '@/services/handleStore'
// import { createUserSolr } from '@/services/handleSolr'
import {
   createUserFirestore,
   updateUserFirestore,
   getUserByUidFirestore,
} from '@/services/handleFirebaseFirestore'

import {
   actionCreateAuthFirebase,
   actionSignInFirebase,
   actionSignOutFirebase,
   actionGetVerificationFirebase,
   actionResetPasswordFirebase,
} from '@/services/actions/firebase'

import router from '@/router'

export const createAuthFirebase = async (initialFormUser: InitialFormUser) => {
   const credential = credentialSchema.parse(initialFormUser)
   const user = await actionCreateAuthFirebase(credential)
   Object.assign(initialFormUser, { uid: user.uid })
   const initialUserParsed = initialUserSchema.parse(initialFormUser)
   await createUserFirestore(initialUserParsed)
   useInterfaceStore().showDialogEmailVerification = true
}

export const signInFirebase = async (credential: Credential) => {
   const authUser = await actionSignInFirebase(credential)
   const { uid, emailVerified } = authUser
   if (!emailVerified) return

   const user = await getUserByUidFirestore(uid)

   if (!user) {
      await signOutFirebase()
      return
   }

   const userParsed = userSchema.parse(user)

   if (!userParsed.emailVerified) {
      userParsed.emailVerified = emailVerified
      await updateUserFirestore(userParsed)
   }

   // if (!userParsed.userSolrCreated) {
   //    const userId = userParsed.uid
   //    const response = await createUserSolr(userId)
   //    if (response?.success) {
   //       userParsed.userSolrCreated = true
   //       await updateUserFirestore(userParsed)
   //    } else {
   //       await signOutFirebase()
   //       useInterfaceStore().notificationMessage =
   //          'Erro na conexão com o Solr. Por favor, tente mais tarde'
   //       useInterfaceStore().notificationType = 'alert'
   //       useInterfaceStore().notificationIsPersistent = true
   //       useInterfaceStore().showNotification = true
   //       return
   //    }
   // }

   await setInitialStore(userParsed)
}

export const signOutFirebase = async () => {
   await actionSignOutFirebase()
   localStorage.removeItem('apiToken')
   router.push({ name: 'signIn' })
   resetUserStore()
}

export const getVerificationFirebase = async () => {
   await actionGetVerificationFirebase()
   await signOutFirebase()
}

export const resetPasswordFirebase = async (email: Email) => {
   await actionResetPasswordFirebase(email)
}
