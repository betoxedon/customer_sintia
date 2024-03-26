<script setup lang="ts">
   import { useRouter } from 'vue-router'
   import { useInterfaceStore } from '@/stores/interfaceStore'
   import { useUserStore } from '@/stores/userStore'
   const interfaceStore = useInterfaceStore()
   const router = useRouter()
   const userStore = useUserStore()
</script>

<template>
   <aside class="aside">
      <div class="aside-inner grid grid-rows-[min-content_1fr_min-content]">
         <div class="aside-top select-none">
            <div
               class="flex h-[56px] w-full items-center justify-center rounded-lg bg-primary-30">
               <span class="text-lg font-bold text-white">Sintia Chatbots</span>
            </div>
         </div>

         <div class="aside-core mt-5">
            <div class="flex flex-col gap-y-5">
               <div
                  class="btn group flex cursor-pointer justify-start gap-x-4 rounded-lg px-3 py-2 font-light transition hover:bg-primary-5"
                  :class="{
                     'pointer-events-none bg-primary-5':
                        router.currentRoute.value.name === 'dashboard',
                  }"
                  @click="router.push({ name: 'dashboard' })">
                  <MonoDashboard
                     class="text-primary-20 group-hover:text-primary-30"
                     :class="{
                        'pointer-events-none !text-primary-30':
                           router.currentRoute.value.name === 'dashboard',
                     }" />
                  <span class="truncate text-onsurface-30">Dashboard</span>
               </div>

               <div
                  class="btn group flex cursor-pointer justify-start gap-x-4 rounded-lg px-3 py-2 font-light transition hover:bg-primary-5"
                  :class="{
                     'pointer-events-none bg-primary-5':
                        router.currentRoute.value.name === 'agent',
                  }"
                  @click="router.push({ name: 'agent' })">
                  <MonoBot
                     class="text-primary-20 group-hover:text-primary-30"
                     :class="{
                        'pointer-events-none !text-primary-30':
                           router.currentRoute.value.name === 'agent',
                     }" />
                  <span class="truncate text-onsurface-30">Chatbots</span>
               </div>

               <div
                  class="btn group flex cursor-pointer justify-start gap-x-4 rounded-lg px-3 py-2 font-light transition hover:bg-primary-5"
                  :class="{
                     'pointer-events-none bg-primary-5':
                        router.currentRoute.value.name === 'training',
                  }"
                  @click="router.push({ name: 'training' })">
                  <MonoTraining
                     class="text-primary-20 group-hover:text-primary-30"
                     :class="{
                        'pointer-events-none !text-primary-30':
                           router.currentRoute.value.name === 'training',
                     }" />
                  <span class="truncate text-onsurface-30">Treinamento</span>
               </div>

               <div
                  class="btn group flex cursor-pointer justify-start gap-x-4 rounded-lg px-3 py-2 font-light transition hover:bg-primary-5"
                  :class="{
                     'pointer-events-none bg-primary-5':
                        router.currentRoute.value.name === 'plans',
                  }"
                  @click="router.push({ name: 'plans' })">
                  <MonoBox
                     class="text-primary-20 group-hover:!text-primary-30"
                     :class="{
                        'pointer-events-none !text-primary-30':
                           router.currentRoute.value.name === 'plans',
                     }" />
                  <span class="truncate text-onsurface-30">Planos</span>
               </div>
            </div>
         </div>

         <div class="aside-bottom overflow-hidden">
            <div class="flex w-full items-center gap-x-1 pt-3">
               <div
                  class="m-1 flex aspect-square w-14 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full outline outline-1 outline-offset-2 outline-primary-40"
                  @click="interfaceStore.showDialogUserImage = true">
                  <img
                     v-if="userStore.user.imageUrl"
                     :src="userStore.user.imageUrl"
                     class="object-cover transition duration-700" />

                  <MonoUser v-else class="h-10 p-1.5 text-primary-30" />
               </div>

               <div class="flex w-full flex-col overflow-hidden">
                  <span class="truncate pl-2 font-bold">
                     {{ userStore.user.firstName }} {{ userStore.user.lastName }}
                  </span>
                  <span class="truncate pl-2 text-base">
                     {{ userStore.user?.email }}
                  </span>
               </div>
            </div>
         </div>
      </div>
   </aside>
</template>
