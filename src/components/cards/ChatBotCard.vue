<script setup lang="ts">

import type { Agent } from '@/models/agentModel'

import ChatDropdown from '@/components/dropdowns/ChatDropdown.vue'

import {setDataConfirmation} from '@/utils'
import { useInterfaceStore } from '@/stores/interfaceStore'
import { useAgentStore } from '@/stores/agentStore'

const agentStore = useAgentStore()
const interfaceStore = useInterfaceStore()


 defineProps({
    item: {
        type: Object,
        required: true,
    },
})

   
    const onDeleteAgent = async (agent: Agent) => {
        agentStore.agentActive = agent
        setDataConfirmation({
            action: 'handleDeleteAgent',
            param: agentStore.agentActive.id.toString(),
            message: 'Tem certeza que deseja apagar ',
        })
        return
    }

   const onUpdateAgent = (agent: Agent) => {
      agentStore.partialReset()
    
      agentStore.agentActive = agent
      agentStore.updatingAgent = true
      agentStore.creatingAgent = false
   }

   const onUpdateAgentCard = (agent: Agent) => {
        agentStore.partialReset()
        agentStore.tabActive = 'Conversas'
        agentStore.tabValueActive = '3'
        agentStore.agentActive = agent
        agentStore.updatingAgent = true
        agentStore.creatingAgent = false
   }



   const onshowDialogScript = (agent: Agent) => {
      agentStore.partialReset()
      agentStore.agentActive = agent
      interfaceStore.showDialogScript = true
      
   }
   
   const onshowDialogShare = (agent: Agent) => {
      agentStore.partialReset()
      agentStore.agentActive = agent
      interfaceStore.showDialogShare = true
   }

</script>

<template>
    <div class="my-bot bg-white p-3  rounded border-2 items-center  rounded-lg
    transition hover:scale-[101%]  desk:col-span-6 maxw:col-span-4
    " @click="onUpdateAgentCard(item as Agent)">

        <div class="flex justify-between items-center">

            <div class=" bot-body flex items-center gap-2 ">
                <img
                v-if="item.image_file"
                :src="item.image_file"
                class="object-cover inline-block h-12 w-12 rounded-full ring-2 ring-white" />

                <MonoLogo v-else class="object-cover inline-block h-12 w-12  text-white bg-blue-300 rounded-full" />

                <span class="font-normal !text-onsurface-30/80">
                {{ item.name }}
                </span>
                <span v-if="item?.type" class=" truncate inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">{{ item?.type?.name }}</span>            
            </div>

        </div>       

        <ChatDropdown :identify="(item as Agent)"  
        @UpdateAgent="onUpdateAgent(item as Agent)"
         @copyScriptAgent="onshowDialogScript(item as Agent)" 
         @shareAgent="onshowDialogShare(item as Agent)"
         @deleteAgent="onDeleteAgent(item as Agent)"/>
           
    </div>
    
</template>

<style >

.my-bot{
    display: flex;
    /* flex: 1 1 300px; */
    min-width: 300px;
    min-height: 90px;
    justify-content: space-between;   
    cursor: pointer;
    
}
.my-bot:hover{
    background-color: #f4f4f4;

}
.shadow{
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

</style>