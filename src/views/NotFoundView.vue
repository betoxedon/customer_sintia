<script setup lang="ts">
   import { useRouter } from 'vue-router'
   const router = useRouter()
</script>

<template>
   <div class="view">
      <section class="card position-dialog rounded-lg bg-surface-30">
         <div class="px-6 pb-6 pt-5">
            <div class="section-top items-center justify-between pb-5 font-bold">
               <span>Erro 404</span>

               <div class="btn" @click="router.push({ name: 'dashboard' })">
                  <MonoClose class="h-6 opacity-50" />
               </div>
            </div>

            <div
               class="col-span-full mx-auto grid w-full max-w-[500px] grid-cols-12 justify-center gap-x-3 gap-y-3 place-self-end">
               <span class="col-span-full">
                  A página solicitada não foi encontrada.
               </span>
            </div>

            <div class="section-bottom">
               <div class="btn btn-s" @click="router.push({ name: 'dashboard' })">
                  <span>Voltar</span>
               </div>
            </div>
         </div>
      </section>
   </div>
</template>
