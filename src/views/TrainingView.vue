<script setup lang="ts">
 
   import SideBar from '@/components/sidebars/SideBar.vue'
   import {  ref,onMounted} from 'vue'
   import { useRouter } from 'vue-router'
   import MaterialForm from '@/components/forms/MaterialForm.vue'
   import { materiaStore } from '@/stores/materialStore'
   import { useUserStore } from '@/stores/userStore'
   import { useAgentStore } from '@/stores/agentStore'

   const usematerialStore = materiaStore()
   const agentStore = useAgentStore()
   const userStore = useUserStore()
   const router = useRouter()
   const botId = ref<string>('')
   console

   onMounted(() => {
      const params = router.currentRoute.value.params

      if (! userStore.user) {
         router.push({ name: 'login' })
      }

      if (params.id) {
         console.log('id', params.id)
         botId.value = params.id as string
      }

      else if (params.id === undefined) {
         console.log('id', params.id)
         router.push({ name: 'agent' })
      }

      if (botId.value) {
         agentStore.getAgentById(botId.value, userStore.user.id.toString()).then(() => {
            console.log('agent', agentStore.agentActive)
         }).catch((error) => {
            console.log('error', error)
            router.push({ name: 'agent' })
            
         })
         //usematerialStore.getMaterials(botId.value)
      }
   })

  
</script>

<template>
   <main class="main_home">
      <SideBar />     

      <div class="main-inner ">

         <div class="main-top">
            <div class="title">
               <a href="/agente" class="back">
               <ion-icon name="arrow-back-outline"></ion-icon>
               
               </a>
            <span class="container-inner page_title">Materiais</span>
            </div>
         </div>

         

         <div class="main-core gap-y-12">

            <div class="flex justify-center items-center w-full" v-if="agentStore.isLoading">
               <AnimLoadingBtn class="text-primary-30 h-[36px]" />
            </div>

            <div class="bot-detail" v-if="agentStore.agentActive && !agentStore.isLoading">
               <span class="text-lg font-medium">Informações do bot</span>
               <div class="bot-info p-3">
                  
                  <div class="mt-4">
                     <img v-if="agentStore.agentActive.image_file && agentStore.agentActive.image_file !== 'null'" 
                     class="h-14 w-14 rounded-full"
                     :src="agentStore.agentActive.image_file"
                     alt="bot avatar">
                     <MonoLogo v-else class="h-7 text-blue-300 bg-white-700" />
                  </div>
                  <div>
                     <span class="text-lg font-medium">{{ agentStore.agentActive.name }}</span>
                     <span>{{ agentStore.agentActive?.type?.name }}</span>
                  </div>
                 
               </div>

            </div>


            <!--Adicinonar novo material-->
            <MaterialForm  :botId="botId" v-if="!agentStore.isLoading"/>

            <!--lista materiais do bot-->
            <div class="materials py-4" v-if="!agentStore.isLoading">

               
                  
                  <span class="text-lg font-medium">Materiais do bot</span>

                  <div class="overflow-x-auto">
                     <table class="min-w-full bg-white border border-gray-300">
                        <thead>
                           <tr>
                              <th class="px-4 py-2 border-b">Material</th>
                              <th class="px-4 py-2 border-b">Tipo</th>
                              <th class="px-4 py-2 border-b">Status</th>
                              <th class="px-4 py-2 border-b">Ações</th>
                           </tr>
                        </thead>
                        <tbody>
                           <tr 
                              v-for="material in usematerialStore.materias"
                              :key="material.id"
                           >
                        
                              <td class="px-4 py-2 border-b text-center">{{ material?.url }}</td>
                              <td class="px-4 py-2 border-b text-center">
                                 <span v-if="material.type == 'application/pdf' ">
                                    PDF
                                 </span>
                                 <span v-else-if="material.type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ">
                                    Docx 
                                 </span>
                                 <span v-else-if="material.type == 'text/html'">
                                    HTML
                                 </span>
                              </td>
                              <td class="px-4 py-2 border-b text-center">
                                 <span class="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Enviado</span>
                              </td>
      
                              <td class="px-4 py-2 border-b text-center">
                                 <!--Delete-->
                                 <button class="text-red-500 hover:underline">
                                    <ion-icon name="trash-outline"></ion-icon>
                                 </button>

                                 <!--Edit-->
                                 <button class="text-blue-500 hover:underline">
                                    <ion-icon name="create-outline"></ion-icon>
                                 </button>

                                 
                              </td>
                           </tr>
                           <tr v-if="usematerialStore.materias.length == 0">
                              <td class="px-4 py-2 border-b text-center" colspan="4">
                                 Nenhum material cadastrado
                              </td>
                           </tr>
                        </tbody>
                     </table>
                  </div>
               
            </div>

         </div>
      </div> 
   </main>
</template>

<style scoped>

.materials {
   padding: 20px;
   box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
   display: flex;
   flex-direction: column;
   gap: 20px;
}
div.title {
   display: flex;
   justify-content: space-between;
   align-items: center;
   gap: 20px;
}
.back {
   display: flex;
   gap: 10px;
   align-items: center;
   color: #1a365d;
   text-decoration: none;
   background-color: #f0f4f8;
   padding: 10px;
   border-radius: 8px;
}

.bot-info {
   display: flex;
   gap: 20px;
   align-items: center;
}
</style>
