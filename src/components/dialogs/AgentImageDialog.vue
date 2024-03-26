<script setup lang="ts">
   import { imageFileSchema } from '@/models/globalModel'
   import { onUnmounted } from 'vue'

   import { uploadAgentImageStorage } from '@/services/handleFirebaseStorage'
   import { useGlobalStore } from '@/stores/globalStore'
   import { useAgentStore } from '@/stores/agentStore'
   import { useInterfaceStore } from '@/stores/interfaceStore'
   import { useForm } from 'vee-validate'
   import { toTypedSchema } from '@vee-validate/zod'
   const globalStore = useGlobalStore()
   const agentStore = useAgentStore()
   const interfaceStore = useInterfaceStore()

   const { handleSubmit, errors } = useForm({
      validationSchema: toTypedSchema(imageFileSchema),
   })

   const onSubmit = handleSubmit(async ({ imageFile }) => {
      await uploadAgentImageStorage(imageFile)
         .then(() => {
            interfaceStore.notificationMessage = 'Imagem enviada com sucesso'
            interfaceStore.notificationType = 'info'
            interfaceStore.showNotification = true
         })
         .catch((error) => {
            const errorCode = error.code ? error.code : error
            interfaceStore.notificationMessage = `Erro [${errorCode}]. Por favor, tente novamente`
            interfaceStore.notificationType = 'alert'
            interfaceStore.showNotification = true
            console.error(error)
         })
         .finally(() => {
            interfaceStore.showDialogAgentImage = false
         })
   })

   onUnmounted(() => {
      globalStore.imageUrlActive = ''
   })
</script>

<template>
   <div class="backdrop-dialog">
      <section class="card rounded-lg bg-surface-30">
         <div class="px-6 pb-6 pt-5">
            <div class="section-top items-center justify-between pb-5 font-bold">
               <span>Atualizar imagem do chatbot</span>

               <div class="btn" @click="interfaceStore.showDialogAgentImage = false">
                  <MonoClose class="h-6 opacity-50" />
               </div>
            </div>

            <div class="section-core grid-cols-1">
               <ImagePickerForm
                  class="col-span-full w-full"
                  labelField="Clique na imagem para atualizar a imagem do chatbot"
                  nameField="imageFile"
                  :imageUrl="
                     globalStore.imageUrlActive
                        ? globalStore.imageUrlActive
                        : agentStore.agentActive.imageUrl
                  "
                  hint="Use PNG ou JPEG (2MB no máximo)"
                  :errorsMessage="errors" />
            </div>

            <div class="section-bottom">
               <div
                  class="btn btn-s"
                  @click="interfaceStore.showDialogAgentImage = false">
                  <span>Cancelar</span>
               </div>
               <div class="btn btn-p" @click="onSubmit()">
                  <MonoSave />
                  <span>Salvar</span>
               </div>
            </div>
         </div>
      </section>
   </div>
</template>
