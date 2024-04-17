<script setup lang="ts">
   import AsideTop from '@/components/AsideTop.vue'
   import ChatMainAgent from '@/components/agents/ChatMainAgent.vue'
   import ChatWelcomeAgent from '@/components/agents/ChatWelcomeAgent.vue'
   import AsideBottom from '@/components/AsideBottom.vue'
   import { useAgentStore } from '@/stores/agentStore'
   const agentStore = useAgentStore()
</script>

<template>
   <aside class="aside">
      <div class="aside-inner grid grid-rows-[min-content_minmax(0,_1fr)]">
         <AsideTop />
         
         <ChatMainAgent v-if="agentStore.agentActive.id" />
         <ChatWelcomeAgent v-if="agentStore.agentActive.id"class="" />

         <AsideBottom v-if="!agentStore.agentActive.id" class="place-self-end " />
      </div>
   </aside>
</template>
