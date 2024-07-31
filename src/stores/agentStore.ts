import type { Agent,ImageFile,AgentInitial } from '@/models/agentModel'
const { VITE_AGENT_BASE_URL } = import.meta.env
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import agentApi from '@/services/agentServiceApi'
import { useInterfaceStore } from '@/stores/interfaceStore'

import { useCustomizableStore } from '@/stores/customizableStore'
//import { agentInitialSchema, agentSchema } from '@/models/agentModel'


export const useAgentStore = defineStore('agent', () => {
   const creatingAgent = ref<boolean>(false)
   const updatingAgent = ref<boolean>(false)
   const tabActive = ref<string>('geral')
   const sharedAgent = ref<boolean>(false)

   const allowedForms = computed(() => {
      return creatingAgent.value || updatingAgent.value
   })

   const agents = ref<Agent[]>([])
   const docIdAgentSelected = ref<number>()
   const agentActive = ref({} as Agent)
   const isLoading = ref(false) 
   const hasAgentResponse = ref(false)
   const linkTest = ref()
   const tons = ref([
      {
        id: 1,
        name: 'Formal',
        value:'formal',
      },
      {
        id: 2,
        name: 'Informal',
        value:'informal'
      }
          
       ])
   
   const voices = ref( [    
      
   ])

   const models = ref([

      {
      id: 1,
      name:'GPT 3.5 16k',
      value: 'standard',
      },
      {
      id: 2,
      name:'Anthropic claude3 haiku 200k',
      value: 'claude3_haiku',
      },

   ])
   
   const searches = ref( [
      {
         id: 1,
         name:'Brave',
         value: 'brave',
      },
   ])

   const types = ref([
      {
         id:1,
         name:'Chatbot Web Conversation'
      },
      {
         id:2,
         name:'Chatbot GPT Conversation'
      },
      {
         id:3,
         name:'Chatbot Conversation'
      },

   ])

   const keys = ref([])

   const voiceResponse = ref([])

   const agentScript = computed(() => {
    
      const agentBaseUrl = VITE_AGENT_BASE_URL

      console.log('agentBaseUrl',agentBaseUrl)

      linkTest.value = `<start-sintia id=${agentActive?.value?.id} userId=${agentActive.value?.user?.id}></start-sintia> <script src='${agentBaseUrl}script.js' defer></script>`;
      
      return `<start-sintia id=${agentActive?.value?.id} userId=${agentActive?.value?.user?.id}></start-sintia> <script src='${agentBaseUrl}script.js' defer></script>`;
   })

   // on update
   const cloneAgentUpdated = () => {
      agents.value.some((agent) => {
         if (agent.id === docIdAgentSelected.value) {
            Object.assign(agentActive.value)
            Object.assign(agent, agentActive.value)
            return true
         }
      })
   }

   // on delete
   const spliceAgent = (docId: number) => {
      const docIds = agents.value.map((agent) => agent.id)
      const agentIndex = docIds.indexOf(docId)
      agents.value.splice(agentIndex, 1)
   }

   const partialReset = () => {
      creatingAgent.value = false
      updatingAgent.value = false
      docIdAgentSelected.value = undefined
      agentActive.value = {} as Agent
      //getAgents()
   }

   const $reset = () => {
      partialReset()
      agents.value = []
   }

   const getDatas = () => {
      agentApi.getDataSources().then(res => {      

         tons.value = res.tones
         voices.value = res.voices
         models.value = res.model
         types.value = res.types
         searches.value = res.search
         keys.value = res.api_keys
         voiceResponse.value = res.audio_response_preferences
         
         useCustomizableStore().fontFamilies = res.fonts
         useCustomizableStore().colors = res.colors
         useCustomizableStore().screenSides = res.sides

      }).catch(error => {
         // Trate qualquer erro que ocorra durante a chamada à API
         console.error(error);
         throw error;
     });
   }

   const getAgents = () =>{
      isLoading.value= true
      agentApi.getChatbots().then(res =>{
         agents.value = res.results
         isLoading.value= false         
      }).catch(error => {
         throw error;
     });
   }

   const getAgentById = (id:string, userId:string) => {     
      isLoading.value= true
      return agentApi.getChatbotById(id, userId)
          .then(res => {
               isLoading.value= false
              agentActive.value = res      
              return res        
          })
          .catch(error => {
               isLoading.value= false
              throw error;
          });
   }

   const updateAgent = (data:Agent,id:number) => {
      // Modificações nos dados antes de enviar
   
      const modifiedData = {
         ...data,
         // Substitui 'side' pelo ID, se 'side' for um objeto
         side: typeof data.side === 'object' ? data.side.id : data.side,
         // Substitui 'font' pelo ID, se 'font' for um objeto
         font: typeof data.font === 'object' ? data.font.id : data.font,

         model: typeof data.model === 'object' ? data.model.id : data.model,
         type: typeof data.type === 'object' ? data.type.id : data.type,
         tone: typeof data.tone === 'object' ? data.tone.id : data.tone,
         voice: typeof data.voice === 'object' ? data.voice.id : data.voice,
         audio_response_type: typeof data.audio_response_type === 'object' ? data.audio_response_type.id : data.audio_response_type,
         
         material_core: typeof data.material_core !== 'undefined' ? (Array.isArray(data.material_core) ? data.material_core.join(',') : data.material_core) : ''

         
     };
     //remover image_file
      if ('image_file' in modifiedData) {
         delete modifiedData.image_file;
      }
      
      agentApi.updateAgent(modifiedData,id).then((res)=>{
         return res
      }).catch(error => {
         throw error;
     });
   }

   const createAgent = (data:AgentInitial) => {
      isLoading.value= true   

      const modifiedData = {
         ...data,
         // // Substitui 'side' pelo ID, se 'side' for um objeto
         // side: typeof data?.side === 'object' ? data?.side.id : data?.side,
         // // Substitui 'font' pelo ID, se 'font' for um objeto
         // font: typeof data?.font === 'object' ? data?.font.id : data?.font,
         
         model: typeof data.model === 'object' ? data.model.id : data.model,
         type: typeof data.type === 'object' ? data.type.id : data.type,
         tone: typeof data.tone === 'object' ? data.tone.id : data.tone,
         voice: typeof data.voice === 'object' ? data.voice.id : data.voice,
         audio_response_type: typeof data.audio_response_type === 'object' ? data.audio_response_type.id : data.audio_response_type,

         // Verifica se material_core não é indefinido antes de tratá-lo
         material_core: typeof data.material_core !== 'undefined' ? 
         (Array.isArray(data.material_core) ? data.material_core.join(',') : data.material_core) : ''

     };   

      agentApi.createAgent(modifiedData).then((res)=>{
         isLoading.value= false 
         getAgents()
         return res
                 

      }).catch(error => {
         throw error;
     });
   }

   const deleteAgent = (id:string) => {
      isLoading.value= true      

      agentApi.deleteAgent(id).then(()=>{      
         getAgents()
         useInterfaceStore().notificationMessage = 'Chatbot deletado com sucesso!'
         useInterfaceStore().notificationIsPersistent = false
         useInterfaceStore().notificationType = 'success'
         useInterfaceStore().confirmationData = undefined
         useInterfaceStore().showNotification = true
         
      }).catch(error => {
         throw error;
     });
   }

   const updateAgentPicture  = async (payload:ImageFile,agentId:number) =>{
      
      console.log('updateAgentPicture',payload)
      let form_data = new FormData();
      form_data.append('image_file', payload);
      
      return agentApi.updateImageAgent(form_data,agentId).then((res)=>{
         const agent = res.data;
         
         if (useAgentStore().updatingAgent) {
            agentActive.value.image_file = agent.image_file
         }

         return res
      }).catch((error) => {
         console.error(error);
         throw error;
       })
     

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
      tons,
      types,
      models,
      voices,
      searches,
      getDatas,
      getAgents,
      updateAgent,
      tabActive,
      createAgent,
      deleteAgent,
      isLoading, 
      updateAgentPicture,
      hasAgentResponse,
      getAgentById,
      sharedAgent,
      voiceResponse
   }
})
