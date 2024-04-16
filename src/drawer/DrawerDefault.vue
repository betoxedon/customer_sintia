<script setup lang="ts">
   import { useRouter } from 'vue-router'
   import { useInterfaceStore } from '@/stores/interfaceStore'
   import { useUserStore } from '@/stores/userStore'
   import ProfileDropdown from '@/components/dropdowns/ProfileDropdown.vue'


   const interfaceStore = useInterfaceStore()
   const router = useRouter()
   const userStore = useUserStore()
</script>

<template>
   <aside class="aside">
      <div class="aside-inner grid grid-rows-[min-content_1fr_min-content] bg-white border-2	">
         <div class="aside-top select-none">
            <div
               class="flex h-[56px] w-full items-center justify-center rounded-lg ">
               <span class="text-lg font-bold text-primary-30 flex justify-center items-center gap-1">
                                       
                  <MonoBot  class="text-primary-20 group-hover:text-primary-30"/>
                  SINTIA                      
              
               </span>
            </div>
            
         </div>

         <div class="aside-core mt-5">
            <div class="flex flex-col gap-y-4">
               <div
                  class="btn group flex cursor-pointer justify-start gap-x-4 rounded-lg px-3 py-2 font-normal transition hover:bg-primary-5"
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
                  <span class="truncate text-primary-30"
                  :class="{'font-bold':router.currentRoute.value.name === 'dashboard', }"
                  >Dashboard</span>
               </div>

               <div
                  class="btn group flex cursor-pointer justify-start gap-x-4 rounded-lg px-3 py-2 font-normal transition hover:bg-primary-5"
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
                  <span class="truncate text-primary-30"
                  :class="{'font-bold':router.currentRoute.value.name === 'agent', }"
                  >Chatbots</span>
               </div>

               <div
                  class="btn hidden group flex cursor-pointer justify-start gap-x-4 rounded-lg px-3 py-2 font-normal transition hover:bg-primary-5"
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
                  <span class="truncate text-primary-30"
                  :class="{'font-bold':router.currentRoute.value.name === 'training', }"
                  >Treinamento</span>
               </div>

               <div
                  class="btn group flex cursor-pointer justify-start gap-x-4 rounded-lg px-3 py-2 font-normal transition hover:bg-primary-5"
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
                  <span class="truncate text-primary-30"
                  :class="{'font-bold':router.currentRoute.value.name === 'plans', }"
                  >Planos</span>
               </div>
            </div>
         </div>

         <div class="aside-bottom ">
            <div class="flex w-full items-center gap-x-1 pt-3 border-t-2">
               <div
                  class="m-1 flex aspect-square w-14 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full outline outline-1 outline-offset-2 outline-primary-40"
                  @click="interfaceStore.showDialogUserImage = true">
                  <img
                     v-if="userStore.user.profile_picture"
                     :src="userStore.user.profile_picture"
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

               <ProfileDropdown/>
            </div>
         </div>
      </div>
   </aside>
</template>

<style scoped>

   @media only screen and (max-width: 768px) {
  /* For mobile phones: */
  .aside {
    display: none;
  }
}
</style>