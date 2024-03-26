<script setup lang="ts">
   import { useAgentStore } from '@/stores/agentStore'
   const agentStore = useAgentStore()
</script>

<template>
   <aside class="aside">
      <div class="aside-inner grid grid-rows-[min-content_minmax(0,_1fr)]">
         <AsideTop />
         <ChatMainAgent v-if="agentStore.agentActive.docId" />
         <ChatWelcomeAgent v-if="agentStore.agentActive.docId" />
         <AsideBottom v-if="!agentStore.agentActive.docId" class="place-self-end" />
      </div>
   </aside>
</template>
