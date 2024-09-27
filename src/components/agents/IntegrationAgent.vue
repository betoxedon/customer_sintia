<script setup lang="ts">
import type { Agent } from '@/models/agentModel'
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';

import { useUserStore } from '@/stores/userStore'
import { useAgentStore } from '@/stores/agentStore'

import { useInterfaceStore } from '@/stores/interfaceStore'

const agentStore = useAgentStore()
const userStore = useUserStore()
const interfaceStore = useInterfaceStore()


const onshowDialogScript = (agent: Agent) => {
      //agentStore.partialReset()
      agentStore.agentActive = agent
      interfaceStore.showDialogScript = true
      
   }

const onshowDialogShare = (agent: Agent) => {
    //agentStore.partialReset()
    agentStore.agentActive = agent
    interfaceStore.showDialogShare = true
}
const currentOrigin = window.location.origin


</script>

<template>
 <div>
    
    <div class="card">
        <Accordion value="0" expandIcon="pi pi-plus" collapseIcon="pi pi-minus">
            <AccordionPanel value="0">
                <AccordionHeader>
                    <span class="flex items-center gap-2 w-full">
                        <span class="font-bold whitespace-nowrap">Compartilhar bot</span>
                    </span>
                </AccordionHeader>
                <AccordionContent>

                    <div>
                        <span> Para compartilhar seu bot com outros usuários, copie e utilize a URL abaixo. Esta URL permite o acesso direto ao bot configurado.</span>
                    </div>
                    
                    <div class="shared flex mt-3">

                        <pre class="bg-gray-100 rounded py-4 px-2 text-sm text-gray-800 overflow-x-auto">{{ currentOrigin }}/share/{{ agentStore.agentActive.id }}/{{ userStore.user.id }}</pre>

                        <button @click="onshowDialogShare(agentStore.agentActive)"
                        class="flex items-center gap-2 border-2 px-5  ml-4 rounded-lg text-themeGreen mr-4 hover:bg-green-50 border-themeGreen font-bold">
                            <MonoCopy class="h-6 text-primary-30" />
                            <span>Copiar</span>
                        </button>
                    </div>
                
                </AccordionContent>
            </AccordionPanel>
        </Accordion>
  </div>

  <div class="card">
        <Accordion value="0" expandIcon="pi pi-plus" collapseIcon="pi pi-minus">
            <AccordionPanel value="0">
                <AccordionHeader>
                    <span class="flex items-center gap-2 w-full">
                        <span class="font-bold whitespace-nowrap">Adicionar ao site</span>
                    </span>
                </AccordionHeader>
                <AccordionContent>

                    <div class="">
                        <span>
                            Para <strong>incorporar</strong> seu bot em seu site, copie e cole este snippet no arquivo HTML do seu site, logo antes da tag body de fechamento <strong>'< /body>'</strong>.
                        </span>
                    </div>

                    <div class="script flex mt-3">

                        <pre class="bg-gray-100 rounded py-4 px-2 text-sm text-gray-800 overflow-x-auto">{{ agentStore.agentScript }}</pre>
                        
                        <button @click="onshowDialogScript(agentStore.agentActive)"
                         class="flex items-center gap-2 border-2 px-5  ml-4 rounded-lg text-themeGreen mr-4 hover:bg-green-50 border-themeGreen font-bold">
                            <MonoCopy class="h-6 text-primary-30" />
                            <span>Copiar</span>
                        </button>
                    </div>
                
                </AccordionContent>
            </AccordionPanel>
        </Accordion>
  </div>

 </div>
</template>

<style scoped>

</style>