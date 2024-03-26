<script setup lang="ts">
   import { setUtcUnixToLocaleString } from '@/utils'
   import { useUserStore } from '@/stores/userStore'
   import { useGlobalStore } from '@/stores/globalStore'
   const userStore = useUserStore()
   const globalStore = useGlobalStore()
</script>

<template>
   <div class="aside-bottom w-full select-none">
      <div
         v-if="!globalStore.isPlanDisabled"
         class="flex h-[56px] w-full items-center rounded-lg bg-primary-30 px-5">
         <MonoSmiley class="mr-1 text-white" />
         <span class="text-white">
            Plano ativo até
            {{ setUtcUnixToLocaleString(userStore.user.planExpiresAt as number) }}
         </span>
      </div>

      <div
         v-else
         class="btn pointer-events-none mb-2 flex h-[56px] w-full items-center justify-start rounded-lg bg-primary-20 px-5">
         <MonoSad class="mr-1 text-white" />
         <span class="text-white">Nenhum plano ativo</span>
      </div>
   </div>
</template>
