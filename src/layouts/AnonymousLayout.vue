<script setup lang="ts">
   import NotificationComp from '@/components/NotificationComp.vue'
   import WarningLoading from '@/components/WarningLoading.vue'
   import WarningUseDesktop from '@/components/WarningUseDesktop.vue'
   import EmailVerificationDialog from '@/components/dialogs/EmailVerificationDialog.vue'
   import ConfirmationDialog from '@/components/dialogs/ConfirmationDialog.vue'
   import ForgotPasswordDialog from '@/components/dialogs/ForgotPasswordDialog.vue'
   import { useInterfaceStore } from '@/stores/interfaceStore'
   const interfaceStore = useInterfaceStore()
</script>

<template>
   <div class="layout layout-anonymous">
      <main class="main">
         <RouterView />
      </main>
   </div>
   <WarningLoading v-if="interfaceStore.showScreenLoading" />
   <WarningUseDesktop v-if="interfaceStore.showWidthMin1024" />
   <EmailVerificationDialog v-if="interfaceStore.showDialogEmailVerification" />
   <ConfirmationDialog v-if="interfaceStore.showDialogConfirmation" />
   <ForgotPasswordDialog v-if="interfaceStore.showDialogForgotPassword" />
   <NotificationComp />
</template>
