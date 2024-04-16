<script setup lang="ts">
   import NotificationComp from '@/components/NotificationComp.vue'
   import { useInterfaceStore } from '@/stores/interfaceStore'
   const interfaceStore = useInterfaceStore()
</script>

<template>
   <div class="layout layout-neutral">
      <main class="main">
         <RouterView />
      </main>
   </div>
   <WarningLoading v-if="interfaceStore.showScreenLoading" />
   <!--<WarningUseDesktop v-if="interfaceStore.showWidthMin1024" />-->
   <ConfirmationDialog v-if="interfaceStore.showDialogConfirmation" />
   <NotificationComp />
</template>
