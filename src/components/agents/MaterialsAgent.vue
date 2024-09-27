<script setup lang="ts">

   import {  ref,onMounted} from 'vue'
   import { useRouter } from 'vue-router'

   import MaterialForm from '@/components/forms/MaterialForm.vue'
   import { useUserStore } from '@/stores/userStore'
   import { useAgentStore } from '@/stores/agentStore'
   import {setDataConfirmation} from '@/utils'
   import { Material, materiaStore } from '@/stores/materialStore'
   
   
   const usematerialStore = materiaStore()
   const agentStore = useAgentStore()
   const userStore = useUserStore()
   const router = useRouter()
   const botId = ref<string>('')
   const isLoadingMaterial = ref<boolean>(false)


   onMounted(() => {
      console.log("agentStore.agentActive.id",agentStore?.agentActive?.id)
   
      if (! userStore.user) {
         router.push({ name: 'login' })
      }
      if (!agentStore.agentActive) {
         router.push({ name: 'agent' })
      }
     
      isLoadingMaterial.value = true
      usematerialStore.getMaterias(agentStore?.agentActive?.id).then(() => {
         console.log('materias', usematerialStore.materias)
         isLoadingMaterial.value = false
      }).catch((error) => {
         console.log('error', error)
         isLoadingMaterial.value = false
      })
      
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
   <div class="col-span-full mt-3 mx-auto w-full gap-x-3 h-full  maxw:max-w-none maxw:gap-x-6 flex flex-col justify-between gap-y-20">
      <MaterialForm  :botId="agentStore.agentActive.id" v-if="!agentStore.isLoading && !isLoadingMaterial"/>
      
       <!--lista materiais do bot-->
      <div class="materials py-4" v-if="!agentStore.isLoading && !isLoadingMaterial">

                           
            <div class="flex justify-between items-center"> 


               <span class="text-lg font-medium">Base de conhecimento do bot</span>

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
                        <td class="px-4 py-2 border-b text-center" colspan="7">
                           Nenhum material cadastrado
                        </td>
                     </tr>
                  </tbody>
               </table>
               </div>
            </div>

      </div>

     <div v-else class="loading-materials h-full flex justify-center items-center mt-3">
       <AnimLoadingBtn  class="text-primary-30 h-[42px]" />
     </div>


   </div>

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