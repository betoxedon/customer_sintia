<script setup>

import { computed, ref } from 'vue'
import { useField } from 'vee-validate'



const props = defineProps({
      appendBtn: {
         type: String,
      },
      appendText: {
         type: String,
      },
      className: {
         type: String,
         default: '',
      },
      errorsMessage: {
         type: Object,
         required: true,
      },
      readOnlyField: {
         type: Boolean,
      },
      stringHandler: {
         type: String,
      },
      hint: {
         type: String,
      },
      labelField: {
         type: String,
      },
      mask: {
         type: String,
      },
      maskTokens: {
         type: String,
      },
      nameField: {
         type: String,
         required: true,
      },
      placeholder: {
         type: String,
      },
      prependIcon: {
         type: String,
      },
      typeField: {
         type: String,
      },
      validations: {
         type: String,
      },
   })

   const { meta, value } = useField(props.nameField)
   const valueLength = ref(String(value).length)

   const maxValueLength = ref()

   const textValue = ref(value.value)


</script>

<template>

    <div>

        <div v-if="labelField" class="label">
            <span>{{ labelField }}</span>
        </div>

        <div class="relative">
            <textarea 
            class="peer h-[90px] w-full rounded-lg border-onsurface-10 bg-white placeholder:normal-case focus:border-[2px] focus:border-primary-40 focus:outline-transparent focus:ring-transparent maxw:h-[60px]"
            
            :placeholder="placeholder"
            v-model.trim="value"
            autocomplete="on"
            :id="nameField"
            :name="nameField"
            v-maska
            :data-maska="mask"
            :data-maska-tokens="maskTokens"
            :read-only-field="readOnlyField"
            @blur="isFocused = false"
            @focus="isFocused = true"
            @keyup.enter="onEnter()"           
            
            >
            </textarea>
        </div>

        <div
         class="col-span-full min-h-[24px] overflow-hidden whitespace-nowrap pt-[2px]">
         <div v-if="errorsMessage[nameField]" class="flex items-center text-error">
            <MonoAlert class="mr-[2px] h-4 w-4 text-error" />
            <span class="msg-error">{{ errorsMessage[nameField] }}</span>
         </div>

         <div
            v-else-if="messageIfMaxLength"
            class="flex items-center text-primary-30">
            <MonoInfo class="mr-[2px] h-4 w-4 text-primary-30" />
            <span class="msg-error">{{ messageIfMaxLength }}</span>
         </div>

         <div
            v-else-if="
               isFocused &&
               value &&
               leftValueLength &&
               !errorsMessage[nameField] &&
               maxValueLength
            "
            class="flex items-center text-positive">
            <MonoUpdate class="mr-[2px] h-3 text-positive" />
            {{ valueLength }}/{{ maxValueLength }}
         </div>

         <div
            v-else-if="!meta.touched && hint && !errorsMessage[nameField]"
            class="flex items-center text-primary-30">
            <MonoInfo class="mr-[2px] h-4 text-primary-30" />
            <span>{{ hint }}</span>
         </div>
      </div>

    </div>

</template>