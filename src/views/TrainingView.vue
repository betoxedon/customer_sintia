<script setup lang="ts">
 
   import SideBar from '@/components/sidebars/SideBar.vue'
   import {  ref,onMounted} from 'vue'
   import { useRouter } from 'vue-router'
   import MaterialForm from '@/components/forms/MaterialForm.vue'
   import { Material, materiaStore } from '@/stores/materialStore'
   import { useUserStore } from '@/stores/userStore'
   import { useAgentStore } from '@/stores/agentStore'
   import {setDataConfirmation} from '@/utils'


   const usematerialStore = materiaStore()
   const agentStore = useAgentStore()
   const userStore = useUserStore()
   const router = useRouter()
   const botId = ref<string>('')
   const isLoadingMaterial = ref<boolean>(false)


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
         isLoadingMaterial.value = true
         usematerialStore.getMaterias(Number(botId.value)).then(() => {
            console.log('materias', usematerialStore.materias)
            isLoadingMaterial.value = false
         }).catch((error) => {
            console.log('error', error)
            isLoadingMaterial.value = false
         })
      }
   })

   const deleteMaterial = (urls: string[], material:Material) => {

      console.log('delete', urls)

      if(material && material?.multiple){
         deleteFileMaterial(material?.urls)
      }
      else{

         setDataConfirmation({
            action: 'handleDeleteMaterial',
            param: urls[0],
            param2: botId.value,
            message: 'Tem certeza que deseja apagar o material?',
         })

      }

      
   }

   const deleteFileMaterial = (urls: string[]) => {
      
      // const baseName = url.replace(/_\d+\.pdf$/, '');
      console.log('urls', urls)

      // const urls = usematerialStore.materias
      // .filter(material => material.url.startsWith(baseName)) 
      // .map(material => material.url);

      setDataConfirmation({
          action: 'handleDeleteFileMaterial',
          param3: urls,
          param2: botId.value,
          message: 'Tem certeza que deseja apagar o arquivo?',
       })

   }

   const deleteAllMaterials = () => {
      console.log('delete all')
      setDataConfirmation({
          action: 'handleDeleteAllMaterials',
          param: botId.value,
          message: 'Tem certeza que deseja apagar todos os materiais?',
       })
   }

  
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

            <div class="flex justify-center items-center w-full" v-if="agentStore.isLoading || isLoadingMaterial">
               <AnimLoadingBtn class="text-primary-30 h-[36px]" />
            </div>

            <div class="bot-detail" v-if="agentStore.agentActive && !agentStore.isLoading && !isLoadingMaterial">
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
            <MaterialForm  :botId="Number(botId)" v-if="!agentStore.isLoading && !isLoadingMaterial"/>

            <!--lista materiais do bot-->
            <div class="materials py-4" v-if="!agentStore.isLoading  && !isLoadingMaterial">

               
                  <div class="flex justify-between items-center"> 

                  
                     <span class="text-lg font-medium">Materiais do bot</span>

                     <button @click="deleteAllMaterials"class="flex bg-red-500 items-center p-2 gap-2 rounded	justify-center text-white hover:bg-red-700">
                        <ion-icon name="trash-outline"></ion-icon>
                        Deletar todos
                     </button>

                  </div>

                  <div class="overflow-x-auto">
                     <div class="max-h-80 overflow-y-auto materials-content">
                     <div class="flex materials-loading justify-center items-center w-full" v-if="usematerialStore.isLoading">
                        <AnimLoadingBtn class="text-primary-30 h-[36px]" />
                     </div>
                     <table class="material-table min-w-full bg-white border border-gray-300"
                     :style="{ opacity: usematerialStore.isLoading ? 0.5 : 1 }"
                     >
                        <thead>
                           <tr>
                              <th class="px-4 py-2 border-b">#</th>
                              <th class="px-4 py-2 border-b">Nome</th>
                              <th class="px-4 py-2 border-b">Tipo</th>
                              <th class="px-4 py-2 border-b">Tamanho</th>
                              <th class="px-4 py-2 border-b">Data</th>
                              <th class="px-4 py-2 border-b">Status</th>
                              <th class="px-4 py-2 border-b">Ações</th>
                           </tr>
                        </thead>
                      
                        <tbody>
                           <tr 
                              v-for="(material, index) in usematerialStore.materias"
                              :key="material.id"
                           >
                              <td class="px-4 py-2 border-b text-center">{{ index + 1 }}</td>
                              <td class="px-4 py-2 border-b text-center">{{ material?.name }}</td>
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

                              <td class="px-4 py-2 border-b text-center">{{ material?.size }}</td>

                              <td class="px-4 py-2 border-b text-center">{{ material?.timestamp }}</td>

                              <td class="px-4 py-2 border-b text-center">
                                 <span class="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Enviado</span>
                              </td>
      
                              <td class="px-4 py-2 border-b text-center actions">
                                 <!--Delete-->
                                 <button class="text-red-500 hover:underline"
                                    @click="deleteMaterial(material.urls, material)"
                                 >
                                    <ion-icon name="trash-outline"></ion-icon>
                                 </button>
                                 <!--DELETE FILE-->

                                 <!-- <button
                                    v-if="material.type == 'application/pdf' || material.type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' "
                                       class="text-red-500 hover:underline"
                                       @click="deleteFileMaterial(material.url)">
                                       
                                       <ion-icon name="close-circle-outline"></ion-icon>
                                       
                                 </button> -->

                                 <!-- Edit
                                 <button class="text-blue-500 hover:underline">
                                    <ion-icon name="create-outline"></ion-icon>
                                 </button> -->

                                 
                              </td>
                           </tr>
                           <tr v-if="usematerialStore.materias.length == 0">
                              <td class="px-4 py-2 border-b text-center" colspan="5">
                                 Nenhum material cadastrado
                              </td>
                           </tr>
                        </tbody>
                     </table>
                     </div>
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

table.material-table {
   border-collapse: collapse;
}
table.material-table th {
   
   padding: 10px;
   border-bottom: 1px solid #e2e8f0;
   background-color: #f0f4f8;
}
table.material-table td {
   padding: 10px;
   border-bottom: 1px solid #e2e8f0;
}
table.material-table tr:last-child td {
   border-bottom: none;
}
.materials-loading {
   position: absolute;
    z-index: 10;
    top: 50%;
}
.materials-content {
   position: relative;
}
td.actions {
   display: flex;
   justify-content: center;
}

td.actions button{
   padding: 12px;
   display: flex;
   border-radius: 50%;
   
}
td.actions button:hover{
   background-color: #ededed;
}
</style>
