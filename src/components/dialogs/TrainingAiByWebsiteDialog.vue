<script setup lang="ts">
   import type { TrainingAiByWebsite } from '@/models/serviceModel'
   import { trainingAiByWebsiteSchema } from '@/models/serviceModel'
   import FieldForm from '@/components/forms/FieldForm.vue'
   import { updateTrainingByWebsite } from '@/services/handleFastApi'
   import { useInterfaceStore } from '@/stores/interfaceStore'
   import { toTypedSchema } from '@vee-validate/zod'
   import { useForm } from 'vee-validate'
   const interfaceStore = useInterfaceStore()

   const { handleSubmit, errors } = useForm<TrainingAiByWebsite>({
      validationSchema: toTypedSchema(trainingAiByWebsiteSchema),
   })

   const onSubmit = handleSubmit(async (form: TrainingAiByWebsite) => {
      const { website } = form
      await updateTrainingByWebsite(website)
         .then(() => {
            interfaceStore.notificationMessage = 'Treino enviado com sucesso'
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
            interfaceStore.showDialogTrainingAiByWebsite = false
         })
   })
</script>

<template>
   <div class="backdrop-dialog">
      <section class="card rounded-lg bg-surface-30">
         <div class="px-6 pb-6 pt-5">
            <div class="section-top items-center justify-between pb-5 font-bold">
               <span>Enviar treino</span>

               <div
                  class="btn"
                  @click="interfaceStore.showDialogTrainingAiByWebsite = false">
                  <MonoClose class="h-6 opacity-50" />
               </div>
            </div>

            <div class="section-core grid-cols-1">
               <FieldForm
                  class="col-span-full w-full"
                  labelField="Enviar treino"
                  nameField="website"
                  :errorsMessage="errors" />
            </div>

            <div class="section-bottom">
               <div
                  class="btn btn-s"
                  @click="interfaceStore.showDialogTrainingAiByWebsite = false">
                  <span class="whitespace-nowrap pb-[1px]">Voltar</span>
               </div>

               <div class="btn btn-p" @click="onSubmit()">
                  <MonoSend />
                  <span>Enviar</span>
               </div>
            </div>
         </div>
      </section>
   </div>
</template>
