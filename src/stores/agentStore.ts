import type { Agent } from '@/models/agentModel'
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useAgentStore = defineStore('agent', () => {
   const creatingAgent = ref<boolean>(false)
   const updatingAgent = ref<boolean>(false)
   const allowedForms = computed(() => {
      return creatingAgent.value || updatingAgent.value
   })

   const agents = ref<Agent[]>([])
   const docIdAgentSelected = ref<string>('')
   const agentActive = ref({} as Agent)

   const agentScript = computed(() => {
      return `<start-sintia id=${agentActive.value.docId}></start-sintia> <script src='https://start-sintia.netlify.app/script.js' defer></script>`
   })

   // on update
   const cloneAgentUpdated = () => {
      agents.value.some((agent) => {
         if (agent.docId === docIdAgentSelected.value) {
            Object.assign(agentActive.value)
            Object.assign(agent, agentActive.value)
            return true
         }
      })
   }

   // on delete
   const spliceAgent = (docId: string) => {
      const docIds = agents.value.map((agent) => agent.docId)
      const agentIndex = docIds.indexOf(docId)
      agents.value.splice(agentIndex, 1)
   }

   const partialReset = () => {
      creatingAgent.value = false
      updatingAgent.value = false
      docIdAgentSelected.value = ''
      agentActive.value = {} as Agent
   }

   const $reset = () => {
      partialReset()
      agents.value = []
   }

   return {
      creatingAgent,
      updatingAgent,
      allowedForms,
      agents,
      docIdAgentSelected,
      agentActive,
      agentScript,
      spliceAgent,
      cloneAgentUpdated,
      partialReset,
      $reset,
   }
})
