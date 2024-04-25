import type { Email } from '@/models/globalModel'
import type { AgentInitial, Agent } from '@/models/agentModel'
import type { Credential } from '@/models/userModel'
import type { Plan } from '@/models/planModel'

import {
   //- auth
   auth,
   createUserWithEmailAndPassword,
   sendEmailVerification,
   sendPasswordResetEmail,
   signInWithEmailAndPassword,
   signOut,
   //- firestore
   firestore,
   doc,
   collection,
   addDoc,
   getDoc,
   getDocs,
   query,
   where,
   //- storage
   storage,
   ref,
   uploadBytes,
} from '@/services/configs/firebase-config'

import { useAgentStore } from '@/stores/agentStore'

//- auth
export const actionCreateAuthFirebase = async (authUser: Credential) => {
   const { email, password } = authUser
   const res = await createUserWithEmailAndPassword(auth, email, password)
   return res.user
}

export const actionSignInFirebase = async (credential: Credential) => {
   const { email, password } = credential
   const { user } = await signInWithEmailAndPassword(auth, email, password)
   return user
}

export const actionSignOutFirebase = async () => {
   await signOut(auth)
}

export const actionGetVerificationFirebase = async () => {
   if (!auth.currentUser) throw new Error()
   await sendEmailVerification(auth.currentUser)
}

export const actionResetPasswordFirebase = async (email: Email) => {
   await sendPasswordResetEmail(auth, email)
}

//- firestore
// //* user
// export const actionCreateUserFirestore = async (initialUser: InitialUser) => {
//    const docRef = await addDoc(collection(firestore, 'users'), initialUser)
//    return docRef.id
// }

// export const actionUpdateUserFirestore = async (user: UpdateUser) => {
//    const docId = user.id as string
//    try {
//       const docRef = doc(firestore, 'users', docId)
//       await updateDoc(docRef, user)
//    } catch (error) {
//       console.error(error)
//    }
// }

// export const actionGetUserByUidFirestore = async (uid: string) => {
//    const q = query(collection(firestore, 'users'), where('uid', '==', uid))
//    const querySnapshot = await getDocs(q)
//    const doc = querySnapshot.docs[0]
//    if (!doc) return
//    const docData = doc.data()
//    const docId = doc.id
//    const docUpdated = { ...docData, docId }
//    return docUpdated
// }

// export const actionGetUserByDocIdFirestore = async (docId: string) => {
//    const docRef = doc(firestore, 'users', docId)
//    const docSnap = await getDoc(docRef)
//    return docSnap.data()
// }

//* agent
export const actionCreateAgentFirestore = async (agentInitial: AgentInitial) => {
   const docRef = await addDoc(collection(firestore, 'agents'), agentInitial)
   return docRef.id
}

// export const actionUpdateAgentFirestore = async (agent: Agent) => {
//    // const docId = agent.id
//    // const docRef = doc(firestore, 'agents', docId)
//    // await updateDoc(docRef, agent)
// }

// export const actionDeleteAgentFirestore = async (docId: string) => {
//    // const docRef = doc(firestore, 'agents', docId)
//    // await deleteDoc(docRef)
// }

export const actionGetAgentsFirestore = async (userId: string) => {
   const q = query(collection(firestore, 'agents'), where('userId', '==', userId))
   const querySnapshot = await getDocs(q)
   const agents: Agent[] = []
   querySnapshot.forEach((item) => {
      const doc = item.data()
      doc.docId = item.id
      agents.push(doc as Agent)
   })
   return agents
}

//* plan
export const actionGetPlansFirestore = async () => {
   const q = query(collection(firestore, 'plans'))
   const querySnapshot = await getDocs(q)
   const plans: Plan[] = []
   querySnapshot.forEach((item) => {
      const doc = item.data()
      doc.docId = item.id
      plans.push(doc as Plan)
   })
   return plans
}

export const actionGetActivePlanFirestore = async (planId: string) => {
   const docId = planId
   try {
      const docRef = doc(firestore, 'plans', docId)
      const docSnap = await getDoc(docRef)
      return docSnap.data()
   } catch (error) {
      console.error(error)
   }
}

//* customizable
export const actionGetCustomizablesFirestore = async () => {
   const docId = 'customizables' as string
   const docRef = doc(firestore, 'customizables', docId)
   const docSnap = await getDoc(docRef)
   return docSnap.data()
}

//- storage
export const actionUploadAgentImageStorage = async (
   email: string,
   imageFile: File,
) => {
   const agentId = useAgentStore().agentActive.id
   const logoRef = `/agents/${email}/${agentId}/image`
   const pathRef = ref(storage, logoRef)
   const uploadResult = await uploadBytes(pathRef, imageFile)
   return uploadResult
}

export const actionUploadUserImageStorage = async (
   email: string,
   imageFile: File,
) => {
   const userId = auth.currentUser?.uid
   const logoRef = `/users/${email}/${userId}/image`
   const pathRef = ref(storage, logoRef)
   const uploadResult = await uploadBytes(pathRef, imageFile)
   return uploadResult
}
