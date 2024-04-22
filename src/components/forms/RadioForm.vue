<script setup lang="ts">

   //import { FontFamilies, ScreenSides } from '@/models/globalModel'
   import { Font, Side } from '@/models/agentModel'

   import type { PropType } from 'vue'
   import { useField } from 'vee-validate'
   
   const props = defineProps({
      errorsMessage: {
         type: Object,
         required: true,
      },
      labelField: {
         type: String,
      },
      nameField: {
         type: String,
         required: true,
      },
      options: {
         type: Array as PropType<Font[] | Side[]>,
         required: true,
      },
   })

   const { value } = useField(props.nameField)

   const onSelectItem = (item: Font | Side) => {
      console.log(item)
      value.value = item
   }
</script>

<template>
   <div class="grid grid-cols-12">
      <div v-if="labelField" class="label col-span-full">
         <span>{{ labelField }}</span>
      </div>

      <div class="col-span-full flex flex-row-reverse gap-x-3">

         <div
            v-for="(option, index) in options"
            :key="index"
            class="flex h-[52px] w-full items-center gap-x-2 rounded-lg bg-white px-3 outline outline-1 outline-onsurface-10 maxw:h-[60px]">
            
            <span
               class="hover:ring-primary-100 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-slate-500 bg-slate-100 hover:ring-2 hover:ring-offset-2"
               :class="{ 'option-selected': value === option }"
               @click="onSelectItem(option)"></span>
            <span>{{ option.name }}</span>
            
         </div>

      </div>

      <div
         class="col-span-full min-h-[24px] overflow-hidden whitespace-nowrap text-sm">
         <div v-if="errorsMessage[nameField]" class="flex items-center text-error">
            <MonoAlert class="h-4 text-error" />
            <span>{{ errorsMessage[nameField] }}</span>
         </div>
      </div>
   </div>
</template>
