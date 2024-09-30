<script setup lang="ts">
   // import DrawerDefault from '@/drawer/DrawerDefault.vue'
   import AsidePlan from '@/drawer/AsidePlan.vue'
   import SideBar from '@/components/sidebars/SideBar.vue'
   
   import {useDashboardStore} from '@/stores/dashboardStore'
   //import { usePlanStore } from '@/stores/planStore'  
   import Card from 'primevue/card';
   import { onMounted } from 'vue';

   const dashboardStore = useDashboardStore()

   onMounted(async () => {
         
      await dashboardStore.fetchDashboardNumbers()
   })


</script>

<template>
   <main class="main_home">
      <!-- <<DrawerDefault />> -->
      <SideBar />
      <div class="main-inner grid-rows-[min-content_1fr]">
         <div class="main-top">
            <span class="container-inner page_title">Painel</span>
         </div>

         <div class="main-core">
            <div class="container-inner grid-cols-12 gap-3">

               <Card
               class="col-span-full flex h-32 cursor-pointer flex-col rounded-lg border border-l-4 border-l-primary-30 bg-primary-10 px-4 py-4 transition hover:scale-[101%] hover:opacity-90 hover:shadow-lg desk:col-span-6 maxw:col-span-4">

               >
                  <template #title>
                    <div>
                     Bots
                    </div>
                  </template>
                  <template #content>
                     <div class="flex justify-between items-center">
                        
                        <span>{{ dashboardStore.bots }}</span>
                        <MonoBot />
                     </div>
                  </template>
               </Card>

               <Card 
               class="col-span-full flex h-32 cursor-pointer flex-col rounded-lg border border-l-4 border-l-primary-30 bg-primary-10 px-4 py-4 transition hover:scale-[101%] hover:opacity-90 hover:shadow-lg desk:col-span-6 maxw:col-span-4">

               >
                  <template #title>
                    <div>
                     Conversas
                    </div>
                  </template>
                  <template #content>
                     <div class="flex justify-between items-center">
                        
                        <span>{{ dashboardStore.conversations }}</span>
                        <MonoChats />
                     </div>
                  </template>
               </Card>
              
            </div>
         </div>
      </div>

      <AsidePlan />
   </main>
</template>
