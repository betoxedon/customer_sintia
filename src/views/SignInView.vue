<script setup lang="ts">
   import { ref } from 'vue'
   import FieldForm from '@/components/forms/FieldForm.vue'
   import { credentialSchema } from '@/models/userModel'
   import { signInFirebase } from '@/services/handleFirebaseAuth'
   import { useRouter } from 'vue-router'
   import { useInterfaceStore } from '@/stores/interfaceStore'
   import { useForm } from 'vee-validate'
   import { toTypedSchema } from '@vee-validate/zod'
   const router = useRouter()
   const interfaceStore = useInterfaceStore()
   const currentYear = ref(new Date().getFullYear())
   const showBtnLoading = ref(false)

   const validationSchema = toTypedSchema(credentialSchema)
   const form = useForm({
      validationSchema,
   })
   const handleSubmit = form.handleSubmit
   const errors = form.errors

   const onSubmit = handleSubmit(async (form) => {
      showBtnLoading.value = true
      await signInFirebase(form)
         .then(() => {
            router.push({ name: 'dashboard' })
         })
         .catch((error) => {
            if (error.code === 'auth/user-not-found') {
               interfaceStore.notificationMessage = `${form.email} não possui conta`
               interfaceStore.notificationType = 'alert'
               interfaceStore.showNotification = true
            } else if (error.code === 'auth/wrong-password') {
               interfaceStore.notificationMessage = `Senha incorreta`
               interfaceStore.notificationType = 'alert'
               interfaceStore.showNotification = true
            } else if (error.code === 'auth/invalid-credential') {
               interfaceStore.notificationMessage = 'Credenciais inválidas'
               interfaceStore.notificationType = 'alert'
               interfaceStore.showNotification = true
            } else {
               const errorCode = error.code ? error.code : 'desconhecido'
               interfaceStore.notificationMessage = `Erro [${errorCode}]. Por favor, tente novamente`
               interfaceStore.notificationType = 'alert'
               interfaceStore.showNotification = true
            }
         })
         .finally(() => {
            showBtnLoading.value = false
         })
   })
</script>

<template>
   <div class="view grid-cols-[min-content_1fr]">
      <div class="w-screen max-w-xl bg-surface-30">
         <section class="form flex h-full min-h-screen flex-col rounded-none px-6">
            <div class="px-4 py-4">
               <div class="section-top mb-6 items-baseline justify-center">
                  <span class="text-lg font-bold">Sintia Chatbots</span>
               </div>

               <div class="section-core">
                  <FieldForm
                     class="col-span-full"
                     labelField="Email"
                     nameField="email"
                     stringHandler="stringToLower"
                     placeholder=""
                     :errorsMessage="errors" />

                  <FieldForm
                     class="col-span-full"
                     labelField="Senha"
                     nameField="password"
                     typeField="password"
                     appendBtn="pass"
                     :errorsMessage="errors"
                     @keyup.enter="onSubmit()" />
               </div>

               <div class="section-bottom">
                  <div
                     class="btn btn-s"
                     @click="interfaceStore.showDialogForgotPassword = true">
                     <span>Esqueceu a senha?</span>
                  </div>

                  <div class="btn btn-p" @click="onSubmit()">
                     <AnimLoadingBtn v-if="showBtnLoading" />
                     <MonoSend v-else />
                     <span>Acessar</span>
                  </div>
               </div>

               <div
                  class="col-span-full mt-8 flex items-center justify-center gap-x-3">
                  <span>Ainda não tem uma conta?</span>
                  <div
                     class="btn btn-link"
                     @click="router.push({ name: 'createUser' })">
                     <span>Clique aqui</span>
                  </div>
               </div>
            </div>

            <div class="flex grow flex-col items-center justify-end pb-2">
               <span class="grid text-sm opacity-60">
                  Copyright © {{ currentYear }} - Sintia Chatbots - Todos os
                  direitos reservados
               </span>
            </div>
         </section>
      </div>
   </div>
</template>
