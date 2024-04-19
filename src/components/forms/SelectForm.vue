<script setup>
import { useField } from 'vee-validate'
import { ref,watch } from 'vue'
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'

const props = defineProps({
      options: {
         type: Array,
         required: true,
      },
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
         default:'Selecione uma opção'
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
const valueSelected = ref(value.value)


const onSelected = () => {
    // Atualiza o valor do campo com o valor da opção selecionada
    value.value = valueSelected.value
}

watch(() => valueSelected.value, (newValue, oldValue) => {
    // Executa a função onSelected quando a opção selecionada muda
    if (newValue !== oldValue) {
        onSelected()
    }
})



</script>

<template>

    <Listbox as="div" v-model="valueSelected">
      
        <div v-if="labelField" class="label">
         <span>{{ labelField }}</span>
      </div>          
      
      <div class="relative">   
              
        <ListboxButton class="relative w-full h-[42px] cursor-default rounded-lg bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-onsurface-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
          <span class="flex items-center">
            <span class="ml-3 block truncate" v-if="valueSelected && valueSelected !== undefined && valueSelected?.name !== undefined">{{ valueSelected.name}}</span>
            <span class="ml-3 block truncate text-gray-400" v-else>{{ placeholder }}</span>
           
          </span>
          <span class="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
            <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </ListboxButton>
  
        <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
          <ListboxOptions class="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            
            <ListboxOption as="template" v-for="option in options" :key="option.id" :value="option" v-slot="{ active, selected }">
              
               <li :class="[active ? 'bg-indigo-600 text-white' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
                
                  <div class="flex items-center">
                  <span :class="[selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate']">{{ option.name }}</span>
                </div>

                <span v-if="selected || value && option?.id == value?.id" :class="[active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                </span>

              </li>

            </ListboxOption>

          </ListboxOptions>
        </transition>
      </div>
      <div
         class="col-span-full min-h-[24px] overflow-hidden whitespace-nowrap pt-[2px]">
         <div v-if="errorsMessage[nameField]" class="flex items-center text-error">
            <MonoAlert class="mr-[2px] h-4 w-4 text-error" />
            <span class="msg-error">{{ errorsMessage[nameField] }}</span>
         </div>
      </div>
    </Listbox>

    
  </template>
  
