<script setup lang="ts">
   import type { ForgotPassword } from '@/models/globalModel'
   import { forgotPasswordSchema } from '@/models/globalModel'

   import { resetPasswordFirebase } from '@/services/handleFirebaseAuth'
   import { useInterfaceStore } from '@/stores/interfaceStore'
   import { toTypedSchema } from '@vee-validate/zod'
   import { useForm } from 'vee-validate'
   const interfaceStore = useInterfaceStore()

   const { handleSubmit, errors } = useForm<ForgotPassword>({
      validationSchema: toTypedSchema(forgotPasswordSchema),
   })

   const onSubmit = handleSubmit(async (form: ForgotPassword) => {
      const { email } = form
      await resetPasswordFirebase(email)
         .then(() => {
            interfaceStore.notificationMessage = `Link para redefinir a senha enviada para ${email}. Após a redefinição, faça login com a sua nova senha.`
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
            interfaceStore.showDialogForgotPassword = false
         })
   })
</script>

<template>
   <div class="backdrop-dialog">
      <section class="card rounded-lg bg-surface-30">
         <div class="px-6 pb-6 pt-5">
            <div class="section-top items-center justify-between pb-5 font-bold">
               <span>Esqueceu a senha?</span>

               <div
                  class="btn"
                  @click="interfaceStore.showDialogForgotPassword = false">
                  <MonoClose class="h-6 opacity-50" />
               </div>
            </div>

            <div class="section-core grid-cols-1">
               <FieldForm
                  class="col-span-full w-full"
                  labelField="E-mail"
                  nameField="email"
                  hint="Digite seu e-mail e redefina sua senha"
                  :errorsMessage="errors" />
            </div>

            <div class="section-bottom">
               <div
                  class="btn btn-s"
                  @click="interfaceStore.showDialogForgotPassword = false">
                  <span class="whitespace-nowrap pb-[1px]">Voltar</span>
               </div>

               <div class="btn btn-p" @click="onSubmit()">
                  <MonoSend />
                  <span>Redefinir senha</span>
               </div>
            </div>
         </div>
      </section>
   </div>
</template>
