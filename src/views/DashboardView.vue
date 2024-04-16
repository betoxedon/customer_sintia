<script setup lang="ts">
   import DrawerDefault from '@/drawer/DrawerDefault.vue'
   import AsidePlan from '@/drawer/AsidePlan.vue'
</script>

<template>
   <main class="main_home">
      <DrawerDefault />

      <div class="main-inner grid-rows-[min-content_1fr]">
         <div class="main-top">
            <span class="container-inner">Painel</span>
         </div>

         <div class="main-core">
            <div class="container-inner grid-cols-12 gap-3">
               <div
                  v-for="n in 4"
                  :key="n"
                  class="col-span-full flex h-32 cursor-pointer flex-col rounded-lg border border-l-4 border-l-primary-30 bg-primary-10 px-4 py-4 transition hover:scale-[101%] hover:opacity-90 hover:shadow-lg desk:col-span-6 maxw:col-span-4">
                  <p>Lorem</p>
                  <code class="text-xl font-bold">000{{ n }}</code>
               </div>

               <div
                  v-for="n in 4"
                  :key="n"
                  class="hover:opcaity-90 col-span-6 flex h-32 cursor-pointer flex-col rounded-lg border border-l-4 border-l-primary-30 bg-primary-10 p-4 transition hover:scale-[101%] hover:shadow-lg desk:col-span-4 maxw:col-span-2">
                  <p>Ipsum</p>
                  <code class="text-xl font-bold">000{{ n }}</code>
               </div>
            </div>
         </div>
      </div>

      <AsidePlan />
   </main>
</template>
