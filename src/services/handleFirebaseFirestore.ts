import type { InitialUser, UpdateUser } from '@/models/userModel'
import type { AgentInitial, Agent } from '@/models/agentModel'
import { userSchema } from '@/models/userModel'
import { agentInitialSchema, agentSchema } from '@/models/agentModel'
import { planSchema } from '@/models/planModel'
import { setNowUtcUnix, updateStyles } from '@/utils'
import { useUserStore } from '@/stores/userStore'
import { useAgentStore } from '@/stores/agentStore'
import { usePlanStore } from '@/stores/planStore'
import { useCustomizableStore } from '@/stores/customizableStore'

import {
   actionCreateUserFirestore,
   actionUpdateUserFirestore,
   actionGetUserByUidFirestore,
   actionGetUserByDocIdFirestore,
   actionCreateAgentFirestore,
   actionUpdateAgentFirestore,
   actionDeleteAgentFirestore,
   actionGetAgentsFirestore,
   actionGetPlansFirestore,
   actionGetActivePlanFirestore,
   actionGetCustomizablesFirestore,
} from '@/services/actions/firebase'

//* user
export const createUserFirestore = async (initialUser: InitialUser) => {
   const docId = await actionCreateUserFirestore(initialUser)
   if (!docId) return
   Object.assign(initialUser, { docId })
   const user = userSchema.parse(initialUser)
   const userParsed = userSchema.parse(user)
   await updateUserFirestore(userParsed)
}

export const updateUserFirestore = async (user: UpdateUser) => {
   user.updatedAt = setNowUtcUnix()
   try {
      await actionUpdateUserFirestore(user)
      useUserStore().update(user)
   } catch (error) {
      console.error(error)
   }
}

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

//* agent
export const createAgentFirestore = async (agentInitial: AgentInitial) => {
   const agentInitialParsed = agentInitialSchema.parse(agentInitial)
   const docId = await actionCreateAgentFirestore(agentInitialParsed)
   const userId = useUserStore().user.docId
   if (!docId || !userId) return
   const agent = Object.assign(agentInitialParsed, { docId }, { userId })
   const agentParsed = agentSchema.parse(agent)
   await updateAgentFirestore(agentParsed)
}

export const updateAgentFirestore = async (agent: Agent) => {
   agent.updatedAt = setNowUtcUnix()
   const agentStyleIds = [agent.colorId, agent.fontFamilyId, agent.screenSideId]
   const stylesUpdated = updateStyles(agentStyleIds)

   Object.assign(agent, stylesUpdated)
   const agentParsed = agentSchema.parse(agent)
   await actionUpdateAgentFirestore(agentParsed)

   if (useAgentStore().creatingAgent) {
      useAgentStore().agents.push(agentParsed)
   } else {
      useAgentStore().cloneAgentUpdated()
   }
   useAgentStore().partialReset()
}

export const deleteAgentFirestore = async (docId: string) => {
   await actionDeleteAgentFirestore(docId)
   useAgentStore().agents.length
   useAgentStore().spliceAgent(docId)
   useAgentStore().partialReset()
}

export const getAgentsFirestore = async () => {
   const userId = useUserStore().user.docId
   if (!userId) return
   const data = await actionGetAgentsFirestore(userId)
   data.forEach((item) => {
      const agent = agentSchema.parse(item)
      useAgentStore().agents.push(agent)
   })
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

//* customizable
export const getCustomizablesFirestore = async () => {
   const res = await actionGetCustomizablesFirestore()
   if (!res) return
   useCustomizableStore().screenSides = res.screenSides
   useCustomizableStore().colors = res.colors
   useCustomizableStore().fontFamilies = res.fontFamilies
}
