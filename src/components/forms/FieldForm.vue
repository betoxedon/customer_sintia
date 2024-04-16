<script setup lang="ts">
   import { computed, ref } from 'vue'
   import { vMaska } from 'maska'
   import { useField } from 'vee-validate'
   import {
      setStringToCapital,
      setStringToId,
      setStringToUpper,
      setStringToLower,
   } from '@/utils'

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

   const showPassword = ref(false)
   const isFocused = ref(false)
   const valueLength = ref(String(value).length)
   const maxValueLength = ref()
   const leftValueLength = ref()
   const messageIfMaxLength = ref('')

   const typeFieldHandler = computed(() => {
      if (props.typeField === 'password') {
         return showPassword.value ? 'text' : 'password'
      }
   })

   const inputClasses = computed(() => {
      let classes = ''
      if (props.readOnlyField) {
         classes += '!bg-slate-200 text-slate-500 border-0'
      }
      if (props.prependIcon) {
         classes += 'pl-10 '
      }
      if (props.appendBtn) {
         classes += 'pr-12'
      }
      if (props.appendText) {
         classes += '!col-span-8 rounded-r-none border-r-0'
      }
      if (props.className) {
         classes += `${props.className} `
      }
      if (props.errorsMessage[props.nameField]) {
         classes += `!border-error !focus:ring-error`
      }
      return classes
   })

   const emit = defineEmits(['handleNext', 'handleTab'])
   const onEnter = () => {
      if (!props.errorsMessage && meta.touched) {
         if (props.appendBtn === 'next') {
            emit('handleNext')
         } else {
            emit('handleTab')
         }
      }
   }

   const setValue = async (newValue: string) => {
      value.value = newValue.replace(/\s{2,}/g, ' ')

      if (props.stringHandler) {
         if (props.stringHandler === 'stringToId') {
            value.value = setStringToId(newValue)
         } else if (props.stringHandler === 'stringToUpper') {
            value.value = setStringToUpper(newValue)
         } else if (props.stringHandler === 'stringToLower') {
            value.value = setStringToLower(newValue)
         } else if (props.stringHandler === 'stringToCapital') {
            value.value = setStringToCapital(newValue)
         }
      }
   }

   const onInput = (event: Event) => {
      const inputEvent = event as InputEvent
      const target = inputEvent.target as HTMLInputElement
      let targetValue = target.value
      setValue(targetValue)
   }
</script>

<template>
   <div>
      <div v-if="labelField" class="label">
         <span>{{ labelField }}</span>
      </div>

      <div class="relative">
         <input
            class="peer h-[42px] w-full rounded-lg border-onsurface-10 bg-white placeholder:normal-case focus:border-[2px] focus:border-primary-40 focus:outline-transparent focus:ring-transparent maxw:h-[60px]"
            :class="inputClasses"
            v-model.trim="value"
            autocomplete="on"
            :id="nameField"
            :name="nameField"
            v-maska
            :data-maska="mask"
            :data-maska-tokens="maskTokens"
            :type="typeFieldHandler"
            :placeholder="placeholder"
            :read-only-field="readOnlyField"
            @blur="isFocused = false"
            @focus="isFocused = true"
            @keyup.enter="onEnter()"
            @input="(event) => onInput(event)" />

         <span class="relative">
            <MonoEmail v-if="prependIcon === 'email'" />
            <MonoSearch v-if="prependIcon === 'search'" />
            <MonoSmiley v-if="prependIcon === 'smiley'" />
            <MonoLock v-if="prependIcon === 'lock'" />
         </span>

         <span
            v-if="appendBtn"
            class="absolute right-0 top-0 flex h-full w-12 justify-center rounded-lg rounded-l-none border border-l-0 border-onsurface-10 peer-focus:border-[2px] peer-focus:border-l-0 peer-focus:border-primary-40">
            <div v-if="appendBtn === 'next'" class="btn" @click="onEnter()">
               <MonoAdd class="h-6 text-slate-600" />
            </div>

            <div v-if="appendBtn === 'copy'" class="btn">
               <MonoCopy class="h-6 text-slate-600" />
            </div>

            <div
               v-if="appendBtn === 'pass' && showPassword"
               class="btn"
               @click="showPassword = !showPassword">
               <MonoHidePassword class="h-6 text-slate-600" />
            </div>

            <div
               v-if="appendBtn === 'pass' && !showPassword"
               class="btn"
               @click="showPassword = !showPassword">
               <MonoShowPassword class="h-6 text-slate-600" />
            </div>
         </span>

         <span
            v-if="appendText"
            class="col-span-4 items-center rounded-r-md border border-l-0 border-onsurface-10 bg-surface-30 pb-[13px] pr-3 pt-[13px] text-right peer-focus:border-primary-40 peer-focus:outline-transparent peer-focus:ring-transparent"
            :class="{ '!border-error': errorsMessage[nameField] }">
            {{ appendText }}
         </span>
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

<style scoped>
   span.msg-error{
      text-wrap: wrap;
   }
</style>