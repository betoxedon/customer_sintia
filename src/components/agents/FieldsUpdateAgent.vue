<script setup lang="ts">
   import FieldForm from '@/components/forms/FieldForm.vue'
   import RadioForm from '@/components/forms/RadioForm.vue'
   import ColorPickerForm from '@/components/forms/ColorPickerForm.vue'
   import { useAgentStore } from '@/stores/agentStore'
   import { useCustomizableStore } from '@/stores/customizableStore'
   import TextAreaForm from '@/components/forms/TextAreaForm.vue'

   import ColorForm from '@/components/forms/ColorForm.vue'

   const agentStore = useAgentStore()
   const customizableStore = useCustomizableStore()

   defineProps({
      errors: {
         type: Object,
         required: true,
      },
   })
</script>

<template>
   <div
      class="col-span-full mx-auto  w-full max-w-[500px] grid-cols-12 place-content-start justify-center gap-y-3 maxw:max-w-none maxw:gap-x-6">
      <FieldForm
         class="col-span-full maxw:col-span-6 hidden"
         labelField="Nome"
         nameField="name"
         placeholder="Nome do chatbot"
         :errorsMessage="errors" />

      <FieldForm
         class="col-span-full maxw:col-span-6 hidden"
         labelField="Identificador"
         nameField="identifier"
         placeholder="Ex: vendas, suporte, atendimento, etc."
         :errorsMessage="errors" />
         
      <TextAreaForm
         class="col-span-full maxw:col-span-6"
         labelField="Mensagem de boas-vindas"
         nameField="welcome_message"
         :placeholder="agentStore.agentActive.welcome_message"
         :errorsMessage="errors" />

       
         <FieldForm
         class="col-span-full maxw:col-span-6"
         labelField="Mensagem de saudação"
         nameField="hello_message"
         :placeholder="agentStore.agentActive.hello_message"
         :errorsMessage="errors" />

      <RadioForm
         class="col-span-full maxw:col-span-6"
         labelField="Posição"
         nameField="side"
         :options="customizableStore.screenSides"
         :errorsMessage="errors" />

      <RadioForm
         class="col-span-full maxw:col-span-6"
         labelField="Estilo de fonte"
         nameField="font"
         :options="customizableStore.fontFamilies"
         :errorsMessage="errors" />

      <ColorPickerForm
         class="col-span-full maxw:col-span-6 hidden"
         labelField="Tema"
         nameField="colorId"
         :options="customizableStore.colors"
         :errorsMessage="errors" />

      <ColorForm 
      labelField="Cor do chatbot"
      nameField="color"
      class="col-span-full maxw:col-span-6"
      :errorsMessage="errors" />
         
   </div>
</template>
