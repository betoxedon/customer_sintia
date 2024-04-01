<script setup lang="ts">
   import FieldForm from '@/components/forms/FieldForm.vue'

   defineProps({
      errors: {
         type: Object,
         required: true,
      },
   })
</script>

<template>
   <div
      class="col-span-full mx-auto grid w-full max-w-[500px] grid-cols-12 place-content-start justify-center gap-x-3 gap-y-3 maxw:max-w-none maxw:gap-x-6">
      <FieldForm
         class="col-span-full maxw:col-span-6"
         labelField="Nome"
         nameField="nickname"
         placeholder="Nome do chatbot"
         stringHandler="stringToCapital"
         :errorsMessage="errors" />

      <FieldForm
         class="col-span-full maxw:col-span-6"
         labelField="Identificador"
         nameField="identifier"
         placeholder="Ex: vendas, suporte, atendimento, etc."
         :errorsMessage="errors" />
   </div>
</template>
