<script setup lang="ts">
   import { ref } from 'vue'
   import {    
      signOutFirebase,
   } from '@/services/handleFirebaseAuth'


   import { useRouter } from 'vue-router'
   import { useUserStore } from '@/stores/userStore'
   import { useInterfaceStore } from '@/stores/interfaceStore'
   const router = useRouter()
   const userStore = useUserStore()
   const interfaceStore = useInterfaceStore()

   const showBtnLoading = ref(false)
   const currentUserEmail = userStore.user?.email

   const onSubmit = async () => {
      showBtnLoading.value = true
      await userStore.EmailVerification()

         .then(async () => {            
            await signOutFirebase()  
            interfaceStore.notificationMessage = `Link de verificação enviado para ${currentUserEmail}. Por favor, verifique sua caixa de entrada.`
            interfaceStore.notificationType = 'success'
            interfaceStore.showNotification = true  
            router.push({ name: 'signIn' })
            interfaceStore.resetDialog()         
            
         })
         .catch((error) => {                 
            interfaceStore.notificationMessage = `${error}`
            interfaceStore.notificationType = 'alert'            
            interfaceStore.showNotification = true
         })
         .finally(() => {
            showBtnLoading.value = false
         })
   }

   const onSignOut = async () => {
      interfaceStore.partialReset()
      await signOutFirebase()
      router.push({ name: 'signIn' })
   }
</script>

<template>
   <div class="backdrop-dialog">
      <section class="card rounded-lg bg-surface-30">
         <div class="px-6 pb-6 pt-5">
            <div class="section-top items-center justify-between pb-5 font-bold">
               <span>Confirmação do e-mail</span>

               <div class="btn" @click="onSignOut()">
                  <MonoClose class="h-6 opacity-50" />
               </div>
            </div>

            <div class="section-core grid-cols-1">
               <p>
                  Enviamos um link de verificação para seu endereço de e-mail. Por favor, verifique sua caixa de entrada.
               </p>
               <p>
                  Se você não recebeu o e-mail, clique no botão abaixo para
                  pedir um novo link.
               </p>
               
            </div>

            <div class="section-bottom">
               <div class="btn btn-s" @click="onSignOut()">
                  <span>Login</span>
               </div>

               <div class="btn btn-p" @click="onSubmit()">
                  <MonoEmail />
                  <AnimLoadingBtn v-if="showBtnLoading" />
                  <span>Pedir um link</span>
               </div>
            </div>
         </div>
      </section>
   </div>
</template>
