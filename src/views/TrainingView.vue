<script setup lang="ts">
   import DrawerDefault from '@/drawer/DrawerDefault.vue'
   import AsidePlan from '@/drawer/AsidePlan.vue'
   import { setColorStyle } from '@/utils'
   import { useAgentStore } from '@/stores/agentStore'
   import { useInterfaceStore } from '@/stores/interfaceStore'
   const agentStore = useAgentStore()
   const interfaceStore = useInterfaceStore()
</script>

<template>
   <main class="main">
      <DrawerDefault />

      <div class="main-inner grid-rows-[min-content_1fr]">
         <div class="main-top">
            <span class="container-inner">Treinamento</span>
         </div>

         <div class="main-core">
            <div v-if="agentStore.agents.length" class="container-inner">
               <div class="col-span-full mx-auto mb-6 grid w-full gap-y-3">
                  <div class="grid gap-y-4 rounded-xl">
                     <div
                        class="grid grid-cols-2 rounded-xl bg-white/70 px-8 pb-6 pt-4">
                        <div class="flex flex-col gap-y-2">
                           <span class="font-semibold">Enviar treino</span>
                           <div class="flex gap-x-3">
                              <div
                                 class="btn w-28 rounded-md bg-primary-30 py-1"
                                 @click="
                                    interfaceStore.showDialogTrainingAiByWebsite = true
                                 ">
                                 <MonoGlobe class="h-5 pt-[2px] text-white" />
                                 <span class="text-white">Website</span>
                              </div>

                              <div class="btn w-28 rounded-md bg-primary-30 py-1">
                                 <MonoFile class="h-5 pt-[2px] text-white" />
                                 <span class="text-white">Arquivo</span>
                              </div>

                              <div class="btn w-28 rounded-md bg-primary-30 py-1">
                                 <MonoUpdate class="h-5 pt-[2px] text-white" />
                                 <span class="text-white">Texto</span>
                              </div>
                           </div>
                        </div>
                     </div>

                     <table
                        class="w-full table-auto border-separate border-spacing-x-3 border-spacing-y-4 rounded-xl border-2 border-slate-100 bg-surface-30">
                        <thead>
                           <tr>
                              <th>
                                 <span
                                    class="rounded-md bg-primary-5 px-3 py-2 font-normal">
                                    Chatbot
                                 </span>
                              </th>
                              <th>
                                 <span
                                    class="rounded-md bg-primary-5 px-3 py-2 font-normal">
                                    Tipo
                                 </span>
                              </th>
                              <th>
                                 <span
                                    class="rounded-md bg-primary-5 px-3 py-2 font-normal">
                                    Caracteres
                                 </span>
                              </th>
                              <th>
                                 <span
                                    class="rounded-md bg-primary-5 px-3 py-2 font-normal">
                                    Status
                                 </span>
                              </th>
                              <th>
                                 <span
                                    class="rounded-md bg-primary-5 px-3 py-2 font-normal">
                                    Data
                                 </span>
                              </th>
                              <th>
                                 <span
                                    class="rounded-md bg-primary-5 px-3 py-2 font-normal">
                                    Retreinar
                                 </span>
                              </th>
                              <th>
                                 <span
                                    class="rounded-md bg-primary-5 px-3 py-2 font-normal">
                                    Apagar
                                 </span>
                              </th>
                           </tr>
                        </thead>

                        <tbody class="text-center">
                           <tr>
                              <td
                                 class="border-b border-dotted border-primary-20 pb-4">
                                 <div class="flex grow items-center gap-x-2 px-3">
                                    <span
                                       class="flex aspect-square w-14 items-center justify-center overflow-hidden rounded-full border-2 border-white"
                                       :style="
                                          setColorStyle(agentStore.agents[1].colorId)
                                       ">
                                       <img
                                          v-if="agentStore.agents[1].imageUrl"
                                          :src="agentStore.agents[1].imageUrl"
                                          class="object-cover" />

                                       <MonoLogo v-else class="h-10 text-white" />
                                    </span>

                                    <span
                                       class="truncate font-normal !text-onsurface-30/80">
                                       {{ agentStore.agents[1].nickname }} -
                                       {{ agentStore.agents[1].identifier }}
                                    </span>
                                 </div>
                              </td>

                              <td
                                 class="border-b border-dotted border-primary-20 pb-4">
                                 <span>Arquivo</span>
                              </td>

                              <td
                                 class="border-b border-dotted border-primary-20 pb-4">
                                 <span class="px-3 text-right">925</span>
                              </td>

                              <td
                                 class="border-b border-dotted border-primary-20 pb-4">
                                 <div
                                    class="btn btn-success mx-auto h-8 shrink-0 rounded-md px-2 py-1">
                                    <span>Treinado</span>
                                 </div>
                              </td>

                              <td
                                 class="border-b border-dotted border-primary-20 pb-4">
                                 <span>10/01/2024</span>
                              </td>

                              <td
                                 class="border-b border-dotted border-primary-20 pb-4">
                                 <div
                                    class="btn mx-auto h-8 max-w-12 shrink-0 rounded-md border border-primary-30 bg-primary-5 px-2 py-1">
                                    <MonoTraining class="h-5 text-primary-30" />
                                 </div>
                              </td>

                              <td
                                 class="border-b border-dotted border-primary-20 pb-4">
                                 <div
                                    class="btn mx-auto h-8 max-w-12 shrink-0 rounded-md bg-error px-2 py-1">
                                    <MonoTrash class="h-5 text-white" />
                                 </div>
                              </td>
                           </tr>
                           <tr>
                              <td
                                 class="border-b border-dotted border-primary-20 pb-4">
                                 <div class="flex grow items-center gap-x-2 px-3">
                                    <span
                                       class="flex aspect-square w-14 items-center justify-center overflow-hidden rounded-full"
                                       :style="
                                          setColorStyle(agentStore.agents[0].colorId)
                                       ">
                                       <img
                                          v-if="agentStore.agents[0].imageUrl"
                                          :src="agentStore.agents[0].imageUrl"
                                          class="object-cover" />

                                       <MonoLogo v-else class="h-10 text-white" />
                                    </span>

                                    <span
                                       class="truncate font-normal !text-onsurface-30/80">
                                       {{ agentStore.agents[0].nickname }} -
                                       {{ agentStore.agents[0].identifier }}
                                    </span>
                                 </div>
                              </td>

                              <td
                                 class="border-b border-dotted border-primary-20 pb-4">
                                 <span>Website</span>
                              </td>

                              <td
                                 class="border-b border-dotted border-primary-20 pb-4">
                                 <span class="px-3 text-right">5.302</span>
                              </td>

                              <td
                                 class="border-b border-dotted border-primary-20 pb-4">
                                 <div
                                    class="btn btn-warning mx-auto h-8 shrink-0 rounded-md px-2 py-1">
                                    <span>Treinando</span>
                                 </div>
                              </td>

                              <td
                                 class="border-b border-dotted border-primary-20 pb-4">
                                 <span>10/01/2024</span>
                              </td>

                              <td
                                 class="border-b border-dotted border-primary-20 pb-4">
                                 <div
                                    class="btn btn-disabled mx-auto h-8 max-w-12 shrink-0 rounded-md border border-primary-20/80 bg-white !px-2 py-1">
                                    <MonoTraining class="h-5 text-primary-30" />
                                 </div>
                              </td>

                              <td
                                 class="border-b border-dotted border-primary-20 pb-4">
                                 <div
                                    class="btn mx-auto h-8 max-w-12 shrink-0 rounded-md bg-error px-2 py-1">
                                    <MonoTrash class="h-5 text-white" />
                                 </div>
                              </td>
                           </tr>
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>

            <div v-else class="container-inner">
               <span
                  class="grid cursor-pointer grid-cols-[37px_1fr] rounded-lg bg-white/70 px-5 py-3">
                  <MonoAlert class="-mt-[2px] h-[25px] text-primary-30" />
                  Primeiro crie um chatbot, para enviar poder enviar o material de
                  treinamento
               </span>
            </div>
         </div>
      </div>

      <AsidePlan />
   </main>
</template>
