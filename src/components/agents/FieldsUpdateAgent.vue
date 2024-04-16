<script setup lang="ts">
   import FieldForm from '@/components/forms/FieldForm.vue'
   import RadioForm from '@/components/forms/RadioForm.vue'
   import ColorPickerForm from '@/components/forms/ColorPickerForm.vue'
   import { useAgentStore } from '@/stores/agentStore'
   import { useCustomizableStore } from '@/stores/customizableStore'

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
      class="col-span-full mx-auto grid w-full max-w-[500px] grid-cols-12 place-content-start justify-center gap-y-3 maxw:max-w-none maxw:gap-x-6">
      <FieldForm
         class="col-span-full maxw:col-span-6 hidden"
         labelField="Nome"
         nameField="name"
         placeholder="Nome do chatbot"
         stringHandler="stringToCapital"
         :errorsMessage="errors" />

      <FieldForm
         class="col-span-full maxw:col-span-6 hidden"
         labelField="Identificador"
         nameField="identifier"
         placeholder="Ex: vendas, suporte, atendimento, etc."
         :errorsMessage="errors" />

      <FieldForm
         class="col-span-full maxw:col-span-6"
         labelField="Edite a mensagem de boas-vindas"
         nameField="welcomeMessage"
         :placeholder="agentStore.agentActive.welcomeMessage"
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
