<script setup lang="ts">
   import type { AgentInitial } from '@/models/agentModel'
   import { agentInitialSchema } from '@/models/agentModel'
   import FieldsCreateAgent from '@/components/agents/FieldsCreateAgent.vue'

   import { computed, onUnmounted } from 'vue'
 
   import { setDataConfirmation } from '@/utils'
   import { useAgentStore } from '@/stores/agentStore'
   import { useInterfaceStore } from '@/stores/interfaceStore'
   import { toTypedSchema } from '@vee-validate/zod'
   import { useForm } from 'vee-validate'
   const agentStore = useAgentStore()
   const interfaceStore = useInterfaceStore()

   const { handleSubmit, errors, meta } = useForm<AgentInitial>({
      validationSchema: toTypedSchema(agentInitialSchema),
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

   const confirmCancelFormIsRequired = computed(() => {
      if (meta.value.dirty && interfaceStore.confirmationData && meta.value.valid) {
         return true
      }
   })


   const onSubmit = handleSubmit(async (form: AgentInitial) => {
      agentStore.isLoading = true

      try {
         await agentStore.createAgent(form)
         interfaceStore.notificationMessage = 'Chatbot criado com sucesso!'
         interfaceStore.notificationIsPersistent = false
         interfaceStore.notificationType = 'success'
         interfaceStore.confirmationData = undefined
         interfaceStore.showNotification = true
         agentStore.partialReset()

        // window.location.reload()
         
      } catch (error) {
         interfaceStore.notificationMessage = `Erro desconhecido. Por favor, tente novamente`
         interfaceStore.notificationType = 'alert'
         interfaceStore.showNotification = true
         console.error(error)
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
                  <span class="text-lg font-medium">Criar chatbot</span>
               </div>
               <tabs class="">
                  <tab name="Geral">
                     <FieldsCreateAgent :errors="errors" />
                  </tab>                  
               </tabs>

               <div
                  class="col-span-full mx-auto my-8 grid w-full max-w-[500px] grid-cols-12 content-start justify-center gap-x-6 gap-y-3 maxw:my-12 maxw:grid-cols-[repeat(2,_220px)]">
                  <div
                     class="btn btn-p col-span-full bg-positive maxw:col-span-1"
                     :class="{ 'btn-disabled': !meta.dirty || !meta.valid || agentStore.isLoading }"
                     @click="onSubmit()">
                     <MonoSave />
                     <AnimLoadingBtn  v-if="agentStore.isLoading"/>

                     <span v-else>Salvar</span>
                  </div>

                  <div class="col-span-full maxw:col-span-1">
                     <div class="btn btn-s" @click="confirmCancelForm()">
                        <span>Cancelar</span>
                     </div>
                  </div>
               </div>
            </div>
      

    
   </div>

</template>

<style scoped>

</style>
