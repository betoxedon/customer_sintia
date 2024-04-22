<script setup lang="ts">
   import { useAgentStore } from '@/stores/agentStore'
   import { useInterfaceStore } from '@/stores/interfaceStore'
   const agentStore = useAgentStore()
   const interfaceStore = useInterfaceStore()
   const currentOrigin = window.location.origin
   const agentId = agentStore.agentActive.id
   const userId = agentStore?.agentActive?.user?.id

   const onCopyUrl = () => {
      navigator.clipboard.writeText(currentOrigin + '/share/' + agentId + '/' + userId)
      interfaceStore.notificationMessage = 'Copiado para a área de transferência'
      interfaceStore.notificationType = 'success'
      interfaceStore.showNotification = true
   }
</script>

<template>
   <div class="backdrop-dialog">
      <section class="card rounded-lg bg-surface-30">
         <div class="px-6 pb-6 pt-5">
            <div class="section-top items-center justify-between pb-5 font-bold">
               <span>Compartilhe</span>

               <div class="btn" @click="interfaceStore.partialReset()">
                  <MonoClose class="h-6 opacity-50" />
               </div>
            </div>

            <div
               class="col-span-full mx-auto grid w-full max-w-[500px] grid-cols-12 justify-center gap-x-3 gap-y-3 place-self-end">
               <div class="col-span-full">
                  <div class="label mb-1 ml-[2px]">
                     <span>Clique para copiar.</span>
                  </div>

                  <div
                     class="col-span-full grid min-h-[52px] cursor-pointer grid-cols-[43px_1fr] rounded-lg bg-primary-10 px-3 py-5"
                     @click="onCopyUrl()">
                     <MonoCopy class="h-7 text-primary-30" />
                     <span
                        class="select-all overflow-x-auto whitespace-nowrap leading-7"
                        @click="onCopyUrl()">
                        {{ currentOrigin }}/share/{{ agentId }}/{{ userId }}
                     </span>
                  </div>
               </div>
            </div>
         </div>
      </section>
   </div>
</template>