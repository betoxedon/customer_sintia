<script setup lang="ts">

   import {ref} from 'vue'
   import FieldForm from '@/components/forms/FieldForm.vue'
   import RangeForm from '@/components/forms/RangeForm.vue'
   import SelectForm from '@/components/forms/SelectForm.vue'
   import CheckboxForm from '@/components/forms/CheckboxForm.vue'
   import FactoryForm from '@/components/forms/FactoryForm.vue'
   import TextAreaForm from '@/components/forms/TextAreaForm.vue'

   import { useAgentStore } from '@/stores/agentStore'

   const agentStore = useAgentStore()


   defineProps({
      errors: {
         type: Object,
         required: true,
      },
   })

  
   const voiceResponse = ref(false)
   const useMYApiKey = ref(false)

</script>

<template>
   <div
      class="col-span-full mx-auto  grid w-full  px-24 gap-x-3 gap-y-3 maxw:max-w-none maxw:gap-x-6">
      
      <div class="flex gap-3"> 
      <FieldForm
         class="col-span-full maxw:col-span-6 w-full"
         labelField="Nome"
         nameField="name"
         placeholder="Nome do chatbot"
         stringHandler="stringToCapital"
         :errorsMessage="errors" />

      <SelectForm
      class="col-span-full maxw:col-span-6 w-full"
      :options="agentStore.types"
      labelField="Tipo"
      nameField="type"
      :errorsMessage="errors"
      />
        

      <FieldForm
         class="col-span-full maxw:col-span-6 w-full hidden"
         labelField="Identificador"
         nameField="identifier"
         placeholder="Ex: vendas, suporte, atendimento, etc."
         :errorsMessage="errors" />
      </div>

   
      <TextAreaForm
         class="col-span-full maxw:col-span-6"
         labelField="Propmpt"
         nameField="prompt"
         placeholder="Ex: Você é um assistente de perguntas."
         :errorsMessage="errors"/>

      <SelectForm
         class="col-span-full maxw:col-span-6"
         :options="agentStore.models"
         labelField="Modelo"
         nameField="model"
         :errorsMessage="errors"
         />

      <CheckboxForm
         class="col-span-full maxw:col-span-6 hidden"
         labelField="Chave de acesso"
         nameField="useMYApiKey"
         :errorsMessage="errors"
         :modelValue="useMYApiKey"
         placeholder="Usar minha própria chave"
         @update:modelValue="useMYApiKey = $event"
         />

      <FieldForm
         v-if="useMYApiKey"
         class="col-span-full maxw:col-span-6 hidden"
         labelField="Chave de acesso"
         nameField="api_key"
         placeholder="Insira sua chave de acesso para o modelo selecionado"
         :errorsMessage="errors" />


      <RangeForm 
         class="col-span-full maxw:col-span-6"
         labelField="Temperatura"
         nameField="temperature"
         maxValue="1.0"
         minValue="0.0"
         stepValue="0.1"
         :errorsMessage="errors"/>

      <div class="flex gap-3"> 
      <SelectForm
         class="col-span-full maxw:col-span-6 w-full"
         :options="agentStore.tons"
         labelField="Tom"
         nameField="tone"
         :errorsMessage="errors"
      />

         
      <SelectForm
         class="col-span-full maxw:col-span-6 w-full hidden"
         :options="agentStore.searches"
         labelField="Busca"
         nameField="busca"
         :errorsMessage="errors"
         />
      
      </div>

      <FactoryForm v-if="agentStore.agentActive " :initialCount="agentStore.agentActive && agentStore.agentActive.material_core ? agentStore.agentActive.material_core.length : 0" :initialValues="agentStore.agentActive && agentStore.agentActive.material_core ? agentStore.agentActive.material_core : []" placeholder="Ex: jusbrasil.com.br"  nameField="material_core" labelField="Domínios de pesquisa"  class="col-span-full maxw:col-span-6" limit="3" :errorsMessage="errors"/>
      
      <CheckboxForm
         class="col-span-full maxw:col-span-6"
         labelField="Resposta de audio"
         nameField="audio_response"
         :errorsMessage="errors"
         :modelValue="voiceResponse"
         placeholder="Permitir respostas de áudio"
         @update:modelValue="voiceResponse = $event"
         />
               
      <SelectForm
         v-if="voiceResponse || (agentStore.agentActive && agentStore.agentActive.audio_response)"
         class="col-span-full maxw:col-span-6"
         :options="agentStore.voices"
         labelField="Voz"
         nameField="voice"
         :errorsMessage="errors"
         />
      </div>

</template>
