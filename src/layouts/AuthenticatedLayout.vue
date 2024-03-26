<script setup lang="ts">
   import { onMounted, ref } from 'vue'
   import NotificationComp from '@/components/NotificationComp.vue'
   import { useUserStore } from '@/stores/userStore'
   import { useInterfaceStore } from '@/stores/interfaceStore'
   const userStore = useUserStore()
   const interfaceStore = useInterfaceStore()

   const currentYear = ref(new Date().getFullYear())

   onMounted(async () => {
      if (userStore.user.email && !userStore.user?.emailVerified) {
         interfaceStore.showDialogEmailVerification = true
      }
   })
</script>

<template>
   <div
      class="layout layout-authenticated"
      :class="{ 'has-backdrop-dialog': interfaceStore.hasBackdropDialog }">
      <RouterView />
      <div class="col-span-full mt-3 rounded-t-md bg-primary-10 px-3 py-1">
         <span
            class="container-inner block place-self-center text-center text-sm text-onsurface-30">
            Copyright © {{ currentYear }} - Sintia Chatbots - Todos os direitos
            reservados
         </span>
      </div>
   </div>

   <WarningLoading v-if="interfaceStore.showScreenLoading" />
   <WarningUseDesktop v-if="interfaceStore.showWidthMin1024" />
   <EmailVerificationDialog v-if="interfaceStore.showDialogEmailVerification" />
   <AgentImageDialog v-if="interfaceStore.showDialogAgentImage" />
   <ScriptDialog v-if="interfaceStore.showDialogScript" />
   <UserImageDialog v-if="interfaceStore.showDialogUserImage" />
   <TrainingAiByWebsiteDialog v-if="interfaceStore.showDialogTrainingAiByWebsite" />
   <ConfirmationDialog v-if="interfaceStore.showDialogConfirmation" />
   <NotificationComp />
</template>
