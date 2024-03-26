<script setup lang="ts">
   import { ref } from 'vue'
   import { useField } from 'vee-validate'
   import { useGlobalStore } from '@/stores/globalStore'
   const globalStore = useGlobalStore()
   const fileInput = ref()

   const props = defineProps({
      errorsMessage: {
         type: Object,
         required: true,
      },
      nameField: {
         type: String,
         required: true,
      },
      imageUrl: {
         type: String,
      },
      hint: {
         type: String,
      },
      labelField: {
         type: String,
      },
   })

   const { value } = useField(props.nameField)

   const onImageUpdate = () => {
      fileInput.value.click()
   }

   const onInput = (event: Event) => {
      const eventTarget = event.target as HTMLInputElement
      const file = eventTarget.files?.[0]
      if (file) {
         const objectURL = window.URL.createObjectURL(file)
         globalStore.imageUrlActive = objectURL
      }
      value.value = file || null
   }
</script>

<template>
   <div class="avatar-picker-form">
      <div
         class="flex w-full cursor-pointer items-center justify-center"
         @click="onImageUpdate()">
         <div
            class="mb-4 mt-3 flex aspect-square h-24 items-center justify-center overflow-hidden rounded-full outline-2 outline-offset-2 outline-onsurface-20"
            :class="imageUrl ? 'outline' : 'outline-dotted'">
            <img
               v-if="imageUrl"
               :src="imageUrl"
               class="aspect-square min-w-10 object-cover" />
            <MonoAddFile v-else class="mx-auto h-12 text-slate-500" />
         </div>
      </div>

      <div v-if="labelField" class="label">
         <span>{{ labelField }}</span>
      </div>

      <div class="mt-1 overflow-hidden whitespace-nowrap text-sm">
         <div v-if="errorsMessage[nameField]" class="flex items-center text-error">
            <MonoAlert class="h-4 text-error" />
            <span>{{ errorsMessage[nameField] }}</span>
         </div>

         <div v-else class="flex items-center text-primary-30">
            <MonoInfo class="mr-[2px] h-4 w-4 text-primary-30" />
            <span>{{ hint }}</span>
         </div>
      </div>

      <input
         ref="fileInput"
         :id="nameField"
         :name="nameField"
         type="file"
         class="sr-only"
         @change="(event) => onInput(event)" />
   </div>
</template>
