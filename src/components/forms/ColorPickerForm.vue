<script setup lang="ts">
   import { Colors } from '@/models/globalModel'
   import type { PropType } from 'vue'
   import { useField } from 'vee-validate'
   import { useCustomizableStore } from '@/stores/customizableStore'

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
         type: Object as PropType<Colors>,
         required: true,
      },
   })

   const { value } = useField(props.nameField)

   const onSelectItem = (itemId: string) => {
      value.value = itemId
   }
</script>

<template>
   <div class="grid grid-cols-7">
      <div v-if="labelField" class="label col-span-full">
         <span>{{ labelField }}</span>
      </div>

      <div class="relative col-span-full flex h-[52px] rounded-lg maxw:h-[60px]">
         <div
            v-for="(_, itemId, index) in options"
            :key="index"
            class="col-span-1 flex w-full cursor-pointer items-center justify-start overflow-hidden rounded-lg pl-2"
            :class="{ '!outline-error': errorsMessage[nameField] }"
            @click="onSelectItem(itemId)">
            <div
               class="flex aspect-square h-8 w-8 shrink-0 items-center justify-center rounded-full ring-1 ring-slate-500 ring-offset-4"
               :style="useCustomizableStore().colorPickerStyle[index]">
               <MonoDot v-if="value === itemId" class="h-6 text-white/80" />
            </div>
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
