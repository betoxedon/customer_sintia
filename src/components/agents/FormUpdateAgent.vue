<script setup lang="ts">
   import { agentSchema } from '@/models/agentModel'
   import type { Agent } from '@/models/agentModel'
   import FieldsUpdateAgent from '@/components/agents/FieldsUpdateAgent.vue'
   import FieldsCreateAgent from '@/components/agents/FieldsCreateAgent.vue'

   import { computed, onUnmounted, watch } from 'vue'
   import { setDataConfirmation, updateStyles } from '@/utils'
   import { useAgentStore } from '@/stores/agentStore'
   import { useInterfaceStore } from '@/stores/interfaceStore'
   import { toTypedSchema } from '@vee-validate/zod'
   import { useForm } from 'vee-validate'
   const agentStore = useAgentStore()
   const interfaceStore = useInterfaceStore()
   import MaterialsAgent from '@/components/agents/MaterialsAgent.vue'
   import IntegrationAgent from '@/components/agents/IntegrationAgent.vue'
   import ConversationsAgent from '@/components/agents/ConversationsAgent.vue'

   import Tabs from 'primevue/tabs';
   import TabList from 'primevue/tablist';
   import Tab from 'primevue/tab';
   import TabPanels from 'primevue/tabpanels';
   import TabPanel from 'primevue/tabpanel';

   const { values, errors, handleSubmit, meta, resetForm } = useForm<Agent>({
      validationSchema: toTypedSchema(agentSchema),
      initialValues: agentStore.agentActive,
   })
   
   resetForm({
      values: agentStore.agentActive,
   })

   const confirmCancelForm = async () => {
      if (meta.value.dirty && meta.value.valid) {
         setDataConfirmation({
            action: 'handleCancelForm',
            param: 'onCancelAgentForm',
            message:
               'Existe uma ou mais alterações no formulário sem salvar. Confirma o cancelamento?',
         })
         return
      } else {
         agentStore.partialReset()
      }
   }

   const onDeleteAgent = async () => {
      setDataConfirmation({
         action: 'handleDeleteAgent',
         param: agentStore.agentActive.id.toString(),
         message: 'Tem certeza que deseja apagar ',
      })
      return
   }

   const changeTab = async (name: string, value: string) => {
      agentStore.tabActive = name
      agentStore.tabValueActive = value
      
   }

   const onSubmit = handleSubmit(async (form: Agent) => {
      try {
         //await updateAgentFirestore(form as Agent)
         await agentStore.updateAgent(form as Agent,agentStore?.agentActive?.id)

         resetForm({
            values: agentStore.agentActive,
         })
         console.log(meta.value.initialValues)
         meta.value.initialValues = agentStore.agentActive

         console.log(meta.value.initialValues)
        // agentStore.partialReset()
         interfaceStore.notificationMessage = 'Chatbot atualizado com sucesso!'
         interfaceStore.notificationIsPersistent = false
         interfaceStore.notificationType = 'success'
         interfaceStore.confirmationData = undefined
         interfaceStore.showNotification = true
      } catch (error) {
         console.error(error)
         interfaceStore.notificationMessage = `Erro desconhecido. Por favor, tente novamente`
         interfaceStore.notificationType = 'alert'
         interfaceStore.showNotification = true
         console.error(error)
      }
      
      
      
   })

   watch(
      () => [values.name,
            values.hello_message, 
            values.welcome_message,
            values.audio_response, 
            values.prompt,
            values.audio_response_type,
            values.tools,
            values.temperature,
            values.model,
            values.voice,
            values.tone

         ],
      () => {
         agentStore.agentActive.name = values.name
        // agentStore.agentActive.identifier = values.identifier
         agentStore.agentActive.welcome_message = values.welcome_message
         agentStore.agentActive.audio_response = values.audio_response
         agentStore.agentActive.prompt = values.prompt
         agentStore.agentActive.hello_message = values.hello_message
         agentStore.agentActive.audio_response_type = values.audio_response_type
         agentStore.agentActive.tools = values.tools
         agentStore.agentActive.temperature = values.temperature
         agentStore.agentActive.voice = values.voice
         agentStore.agentActive.model = values.model
         agentStore.agentActive.tone = values.tone



         

      },
      { immediate: true },
   )
   
   
   watch(
      () => [values.color, values.font, values.side],
      (newValues) => {
         const stylesUpdated = updateStyles(newValues)
         const idsUpdated = {
            color: values.color,
            font: values.font,
            side: values.side,
         }
         console.log(stylesUpdated)
         Object.assign(agentStore.agentActive, stylesUpdated, idsUpdated)
      },
      { immediate: true },
   )

   const confirmCancelFormIsRequired = computed(() => {
      if (meta.value.dirty && interfaceStore.confirmationData && meta.value.valid) {
         return true
      }
   })

   onUnmounted(() => {
      if (confirmCancelFormIsRequired.value) {
         confirmCancelForm()
      }
   })

   type Tab = {
      tab: {
         name: string
      }
   }
   
   // const tabChanged = (tab: Tab) => {
   //    const name = tab?.tab.name

   //    if (name === 'Geral') {
   //       agentStore.tabActive = 'Geral'
      
   //    }
   //    else if (name === 'Customização') {
   //       agentStore.tabActive = 'Customização' 
   //    }        
   // }

   const showBts = computed(() => {
      console.log(agentStore.tabActive)
      if (agentStore.tabActive == 'Geral' || agentStore.tabActive == 'Customização' ) {
         return true
      }
   })

</script>

<template>
   <div class="main-core">
      
      <span v-if="errors && Object.keys(errors).length > 0 && showBts " class="text-red-500 flex flex-col gap-2">
         <span class="text-red-500" v-for="(errorMessage, fieldName) in errors" :key="fieldName">
            Erro no campo {{ fieldName }}: {{ errorMessage }}
         </span>
      </span>
      <div
         class="container-inner grid-rows-auto  place-content-stretch content-start gap-y-3">

         
         
   
         <Tabs :value="agentStore?.tabValueActive" >
            
            <TabList>
               <a href="#" class="back" @click=" agentStore.partialReset()">
                  <ion-icon name="arrow-back-outline"></ion-icon>
               </a>
               <Tab value="0" @click="changeTab('Geral', '0')">Geral</Tab>
               <Tab value="1" @click="changeTab('Customização', '1')">Customização</Tab>
               <Tab value="2" @click="changeTab('Materiais', '2')">Base de conhecimento</Tab>
               <Tab value="3" @click="changeTab('Conversas', '3')">Conversas</Tab>
               <Tab value="4" @click="changeTab('Integração', '4')">Integração</Tab>
            </TabList>

            <TabPanels >
               <TabPanel value="0" class="px-8">
                  <FieldsCreateAgent :errors="errors" />
               </TabPanel>

               <TabPanel value="1" class="px-8">
                  <FieldsUpdateAgent :errors="errors" />
               </TabPanel>

               <TabPanel value="2" >
                  <div>
                   <MaterialsAgent />
                  </div>
               </TabPanel>
               <TabPanel value="3" >
                  <div>
                     <ConversationsAgent/>
                  </div>
               </TabPanel>

               <TabPanel value="4" >
                  <div>
                   <IntegrationAgent />
                  </div>
               </TabPanel>

               
               
            </TabPanels>
         </Tabs>

         <div v-if="showBts"
            class="col-span-full mx-auto my-8 grid w-full max-w-[500px] grid-cols-12 content-start justify-center gap-x-6 gap-y-3 maxw:my-12 maxw:grid-cols-[repeat(3,_220px)]">
            <div class="col-span-full maxw:col-span-1">
               <div
                  class="btn btn-p bg-positive"
                 
                  :class="{ 'btn-disabled': !meta.dirty || !meta.valid || agentStore.isLoading }"
                  @click="onSubmit()">
                  <MonoSave />
                  <AnimLoadingBtn  v-if="agentStore.isLoading"/>
                  <span v-else>Salvar</span>
               </div>
            </div>

            <div class="col-span-full maxw:col-span-1">
               <div class="btn btn-s" @click="confirmCancelForm()">
                  <span>Cancelar</span>
               </div>
            </div>

            <div
               class="col-span-full maxw:col-span-1"
               :class="{ 'btn-disabled': !agentStore.updatingAgent }">
               <div class="btn btn-p bg-error ring-0" @click="onDeleteAgent()">
                  <MonoTrash />
                  <span>Excluir</span>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>
