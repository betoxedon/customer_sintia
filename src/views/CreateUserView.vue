<script setup lang="ts">
   import { initialFormUserSchema } from '@/models/userModel'
   import { ref } from 'vue'
   import FieldForm from '@/components/forms/FieldForm.vue'
   import { createAuthFirebase } from '@/services/handleFirebaseAuth'
   import userApi from '@/services/userServiceApi'

   import { useRouter } from 'vue-router'
   import { useInterfaceStore } from '@/stores/interfaceStore'
   import { useForm } from 'vee-validate'
   import { toTypedSchema } from '@vee-validate/zod'
   const router = useRouter()
   const interfaceStore = useInterfaceStore()
   const currentYear = ref(new Date().getFullYear())
   const showBtnLoading = ref(false)

   const validationSchema = toTypedSchema(initialFormUserSchema)
   const form = useForm({
      validationSchema,
   })
   const handleSubmit = form.handleSubmit
   const errors = form.errors

   const onSubmit = handleSubmit(async (form) => {
      if (form.password !== form.passwordConfirmation) {
         interfaceStore.notificationMessage = `As senhas não conferem`
         interfaceStore.notificationType = 'alert'
         interfaceStore.showNotification = true
         return
      }

      showBtnLoading.value = true

      await userApi.createUser(form)
         .then(()=>{
            interfaceStore.notificationMessage = `Conta criada com sucesso`
            interfaceStore.notificationType = 'success'
            interfaceStore.showNotification = true
            router.push({ name: 'dashboard' })

         }).catch((error) =>{
            let error_msg = 'Falha ao tentar criar a conta. Por favor, verifique os campos e tente novamente.';

               if (error.response && error.response.data) {
                  if (error.response.data.email) {
                     error_msg = error.response.data.email[0];
                  } else if (error.response.data.password) {
                     error_msg = error.response.data.password[0];
                  }
               }
               interfaceStore.notificationMessage = `${error_msg}`
               interfaceStore.notificationType = 'alert'
               interfaceStore.showNotification = true

         })
         .finally(() => {
            showBtnLoading.value = false
         })
      /*
      await createAuthFirebase(form)
         .then(() => {
            router.push({ name: 'dashboard' })
         })
         .catch((error) => {
            if (error.code === 'auth/email-already-in-use') {
               interfaceStore.notificationMessage = `${form.email} já possui uma conta`
               interfaceStore.notificationType = 'alert'
               interfaceStore.showNotification = true
            } else {
               const errorCode = error.code ? error.code : error
               interfaceStore.notificationMessage = `Erro [${errorCode}]. Por favor, tente novamente`
               interfaceStore.notificationType = 'alert'
               interfaceStore.showNotification = true
            }
         })
         .finally(() => {
            showBtnLoading.value = false
         })
         */
   })
</script>

<template>
   
   <div class="view grid-cols-[min-content_1fr]">
      <div class="max-w-xl w-screen bg-white">
         <section class="form flex  flex-col rounded-none px-6">
            <div class="px-4 py-4">
               <span class="text-lg font-bold flex justify-center items-center gap-1 mb-8">                     
                  <MonoBot  class="text-primary-20 group-hover:text-primary-30"/>
                  SINTIA 
                     
               </span>
               <div class="section-top mb-6 items-baseline justify-center">
                  <span class="text-lg font-bold">Crie a sua conta</span>
               </div>

               <div class="section-core">
                  <FieldForm
                     class="col-span-full"
                     labelField="Email"
                     nameField="email"
                     stringHandler="stringToLower"
                     :errorsMessage="errors" />

                  <FieldForm
                     class="col-span-6"
                     labelField="Nome"
                     nameField="first_name"
                     :errorsMessage="errors" /> 

                  <FieldForm
                     class="col-span-6"
                     labelField="Sobrenome"
                     nameField="last_name"
                     :errorsMessage="errors" />

                  <FieldForm
                     class="col-span-full"
                     labelField="Senha"
                     nameField="password"
                     typeField="password"
                     appendBtn="pass"
                     :errorsMessage="errors" />

                  <FieldForm
                     class="col-span-full"
                     labelField="Repetir senha"
                     nameField="passwordConfirmation"
                     typeField="password"
                     appendBtn="pass"
                     :errorsMessage="errors"
                     @keyup.enter="onSubmit()" />
               </div>

               <div class="section-bottom">
                  <div class="btn btn-p cadastrar" @click="onSubmit()">
                     <AnimLoadingBtn v-if="showBtnLoading" />
                     <MonoSend v-else />
                     <span>Cadastrar</span>
                  </div>
               </div>

               <div
                  class="col-span-full mt-8 flex items-center justify-center gap-x-3">
                  <span>Já possui uma conta?</span>
                  <div class="btn btn-link" @click="router.push({ name: 'signIn' })">
                     <span>Clique aqui</span>
                  </div>
               </div>
            </div>

            <div class="flex grow flex-col items-center justify-end pb-2 hidden">
               <span class="grid text-sm opacity-60">
                  Copyright © {{ currentYear }} - Sintia Chatbots - Todos os
                  direitos reservados
               </span>
            </div>
         </section>
      </div>
   </div>
</template>


<style  scoped>

.btn-p.cadastrar{
   width: 100%;
}
</style>