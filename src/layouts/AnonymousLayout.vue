<script setup lang="ts">
   import { ref } from 'vue'

   import WarningLoading from '@/components/WarningLoading.vue'  
   import EmailVerificationDialog from '@/components/dialogs/EmailVerificationDialog.vue'
   import ConfirmationDialog from '@/components/dialogs/ConfirmationDialog.vue'
   import ForgotPasswordDialog from '@/components/dialogs/ForgotPasswordDialog.vue'
   import NotificationComp from '@/components/NotificationComp.vue'
   import { useInterfaceStore } from '@/stores/interfaceStore'
   const interfaceStore = useInterfaceStore()
   const currentYear = ref(new Date().getFullYear())
</script>

<template>
   <div class="layout layout-anonymous">
      
      <main class="main">
         

         <RouterView />

         <span class="grid text-sm opacity-60 hidden">
            Copyright © {{ currentYear }} - Sintia Chatbots - Todos os direitos reservados
         </span>
      </main>
   </div>
   <WarningLoading v-if="interfaceStore.showScreenLoading" />   
   <EmailVerificationDialog v-if="interfaceStore.showDialogEmailVerification" />
   <ConfirmationDialog v-if="interfaceStore.showDialogConfirmation" />
   <ForgotPasswordDialog v-if="interfaceStore.showDialogForgotPassword" />
   <NotificationComp />
</template>

<style scoped>

.main{
   display: flex;
   justify-content: center;
   align-items: center;
   flex-direction: column;
}

</style>
