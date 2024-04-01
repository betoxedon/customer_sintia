<script setup lang="ts">
   import { imageFileSchema } from '@/models/globalModel'
   import { onUnmounted } from 'vue'
   import ImagePickerForm from '@/components/forms/ImagePickerForm.vue'
   import { uploadUserImageStorage } from '@/services/handleFirebaseStorage'
   import { useGlobalStore } from '@/stores/globalStore'
   import { useUserStore } from '@/stores/userStore'
   import { useInterfaceStore } from '@/stores/interfaceStore'
   import { useForm } from 'vee-validate'
   import { toTypedSchema } from '@vee-validate/zod'
   const globalStore = useGlobalStore()
   const interfaceStore = useInterfaceStore()
   const userStore = useUserStore()

   const { handleSubmit, errors } = useForm({
      validationSchema: toTypedSchema(imageFileSchema),
   })

   const onSubmit = handleSubmit(async ({ imageFile }) => {
      await uploadUserImageStorage(imageFile)
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
            interfaceStore.showDialogUserImage = false
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
               <span>Atualizar a imagem do perfil</span>

               <div class="btn" @click="interfaceStore.showDialogUserImage = false">
                  <MonoClose class="h-6 opacity-50" />
               </div>
            </div>

            <div class="section-core grid-cols-1">
               <ImagePickerForm
                  class="col-span-full w-full"
                  labelField="Clique para atualizar sua imagem do perfil"
                  nameField="imageFile"
                  :imageUrl="
                     globalStore.imageUrlActive
                        ? globalStore.imageUrlActive
                        : userStore.user.imageUrl
                  "
                  hint="Use PNG ou JPEG (2MB no máximo)"
                  :errorsMessage="errors" />
            </div>

            <div class="section-bottom">
               <div
                  class="btn btn-s"
                  @click="interfaceStore.showDialogUserImage = false">
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
