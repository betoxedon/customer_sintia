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

   const onSubmit = handleSubmit(async (form: Agent) => {
      try {
         //await updateAgentFirestore(form as Agent)
         await agentStore.updateAgent(form as Agent,agentStore.agentActive.id)
         agentStore.partialReset()
         interfaceStore.notificationMessage = 'Chatbot atualizado com sucesso!'
         interfaceStore.notificationIsPersistent = false
         interfaceStore.notificationType = 'success'
         interfaceStore.confirmationData = undefined
         interfaceStore.showNotification = true
      } catch (error) {
         interfaceStore.notificationMessage = `Erro desconhecido. Por favor, tente novamente`
         interfaceStore.notificationType = 'alert'
         interfaceStore.showNotification = true
         console.error(error)
      }
   })

   watch(
      () => [values.name,values.hello_message, values.welcome_message,values.audio_response, values.prompt],
      () => {
         agentStore.agentActive.name = values.name
        // agentStore.agentActive.identifier = values.identifier
         agentStore.agentActive.welcome_message = values.welcome_message
         agentStore.agentActive.audio_response = values.audio_response
         agentStore.agentActive.prompt = values.prompt
         agentStore.agentActive.hello_message = values.hello_message

         

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
</script>

<template>
   <div class="main-core">
      <span v-if="errors" class="text-red-500 flex flex-col gap-2">
         <span class="text-red-500" v-for="(errorMessage, fieldName) in errors" :key="fieldName">
            Erro no campo {{ fieldName }}: {{ errorMessage }}
         </span>
      </span>
      <div
         class="container-inner grid-rows-auto  place-content-stretch content-start gap-y-3">
         <div class="tips col-span-full mb-3 flex text-lg">
            <MonoBot />
            <span class="text-lg font-medium">Editar chatbot</span>
         </div>
        
         <tabs cache-lifetime="0" :options="{ useUrlFragment: false, defaultTabHash:'Geral' }">
               <tab name="Geral">
                  <FieldsCreateAgent :errors="errors" />
               </tab>   

               <tab name="Customização">                 
                  <FieldsUpdateAgent :errors="errors" />
               </tab>    
               
               <!--<tab name="Dominios" class="hidden">                 
                  dominios
               </tab>  

               -->
         </tabs>


         <div
            class="col-span-full mx-auto my-8 grid w-full max-w-[500px] grid-cols-12 content-start justify-center gap-x-6 gap-y-3 maxw:my-12 maxw:grid-cols-[repeat(3,_220px)]">
            <div class="col-span-full maxw:col-span-1">
               <div
                  class="btn btn-p bg-positive"
                  :class="{ 'btn-disabled': !meta.dirty }"
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
