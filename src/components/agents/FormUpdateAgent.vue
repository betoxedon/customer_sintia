<script setup lang="ts">
   import { agentSchema } from '@/models/agentModel'
   import type { Agent } from '@/models/agentModel'

   import { computed, onUnmounted, watch } from 'vue'
   import { updateAgentFirestore } from '@/services/handleFirebaseFirestore'
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
         param: agentStore.agentActive.docId as string,
         message: 'Tem certeza que deseja apagar ',
      })
      return
   }

   const onSubmit = handleSubmit(async (form: Agent) => {
      try {
         await updateAgentFirestore(form as Agent)
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
      () => [values.nickname, values.identifier, values.welcomeMessage],
      () => {
         agentStore.agentActive.nickname = values.nickname
         agentStore.agentActive.identifier = values.identifier
         agentStore.agentActive.welcomeMessage = values.welcomeMessage
      },
      { immediate: true },
   )

   watch(
      () => [values.colorId, values.fontFamilyId, values.screenSideId],
      (newValues) => {
         const stylesUpdated = updateStyles(newValues)
         const idsUpdated = {
            colorId: values.colorId,
            fontFamilyId: values.fontFamilyId,
            screenSideId: values.screenSideId,
         }
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
      <div
         class="container-inner grid-rows-auto grid-cols-12 place-content-stretch content-start gap-y-3">
         <div class="tips col-span-full mb-3 flex text-lg">
            <MonoBot />
            <span class="text-lg font-medium">Editar chatbot</span>
         </div>

         <FieldsUpdateAgent :errors="errors" />

         <div
            class="col-span-full mx-auto my-8 grid w-full max-w-[500px] grid-cols-12 content-start justify-center gap-x-6 gap-y-3 maxw:my-12 maxw:grid-cols-[repeat(3,_220px)]">
            <div class="col-span-full maxw:col-span-1">
               <div
                  class="btn btn-p bg-positive"
                  :class="{ 'btn-disabled': !meta.dirty }"
                  @click="onSubmit()">
                  <MonoSave />
                  <span>Salvar</span>
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
