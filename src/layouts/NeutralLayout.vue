<script setup lang="ts">
   import NotificationComp from '@/components/NotificationComp.vue'
   import { useInterfaceStore } from '@/stores/interfaceStore'
   import { useAgentStore } from '@/stores/agentStore'

   const interfaceStore = useInterfaceStore()
   const agentStore = useAgentStore()
</script>

<template>
   <div class="layout layout-neutral" :class="{'shared-agent':agentStore.sharedAgent,'has-backdrop-dialog': interfaceStore.hasBackdropDialog}">
      <main class="main">
         <RouterView />
      </main>
   </div>
   <WarningLoading v-if="interfaceStore.showScreenLoading" />
   <ConfirmationDialog v-if="interfaceStore.showDialogConfirmation" />
   <NotificationComp />
</template>
