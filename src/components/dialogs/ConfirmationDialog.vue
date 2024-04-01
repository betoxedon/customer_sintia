<script setup lang="ts">
   import { resolveConfirmation } from '@/utils'
   import { useInterfaceStore } from '@/stores/interfaceStore'
   const interfaceStore = useInterfaceStore()

   const onCancel = () => {
      interfaceStore.showDialogConfirmation = false
      interfaceStore.confirmationData = undefined
   }

   const onConfirmation = () => {
      resolveConfirmation()
   }
</script>

<template>
   <div class="backdrop-dialog">
      <section class="card rounded-lg bg-surface-30">
         <div class="px-6 pb-6 pt-5">
            <div class="section-top items-center justify-between pb-5 font-bold">
               <span>Confirma?</span>

               <div class="btn" @click="onCancel()">
                  <MonoClose class="h-6 opacity-50" />
               </div>
            </div>

            <div class="section-core flex grid-cols-1 items-center gap-x-1">
               <span>{{ interfaceStore.confirmationData?.message }}</span>
            </div>

            <div class="section-bottom">
               <div class="btn btn-s" @click="onCancel()">
                  <span>Cancelar</span>
               </div>
               <div class="btn btn-p" @click="onConfirmation()">
                  <span>Confirmar</span>
               </div>
            </div>
         </div>
      </section>
   </div>
</template>
