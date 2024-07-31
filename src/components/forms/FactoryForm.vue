<script setup lang="ts">

    import {ref} from 'vue'
    import { useField } from 'vee-validate'

   const props = defineProps({

        limit :{
            type:Number,
            required:true
        },
        labelField:{
            type: String,
        },
        errorsMessage: {
         type: Object,
         required: true,
        },
        nameField: {
         type: String,
         required: true,
        },
        placeholder: {
         type: String,
      },
      initialCount:{
          type:Number,
          default:0
      },
      initialValues:{
          type:Array,
          default:[],
      }

   })

   const { value } = useField(props.nameField)


    const countInputs = ref(props.initialCount)
   
    const materials = ref(props.initialValues||[])

    const addInput = () => {
    if (countInputs.value < props.limit) {
        countInputs.value += 1
    }
    }

    const removeInput = (index: number) => {
    countInputs.value -= 1
    materials.value.splice(index - 1, 1)
    onchangeMaterials()    
    }


    const onchangeMaterials = () => {        
        value.value = materials.value
    }


  

</script>


<template>
    <div class="flex flex-col hidden">        
        
      <div v-if="labelField" class="label col-span-full mb-3">
         <span>{{ labelField }}</span>
      </div>
      
      <div v-if="countInputs < props.limit" class="mb-3 text-end">
        <button :disabled="countInputs >= props.limit" class="btn p-2 rounded text-white col-span-full bg-primary-30" @click="addInput">Adicionar domínios</button>
      </div>
      
      <span class="mt-3 text-gray-400" v-if="countInputs<=0">Se nenhum domínio for adicionado as respostas serão com base em toda a internet</span>
      <div v-for="index in initialCount ||countInputs" :key="index" class="flex gap-3 w-full items-center mb-3">
        
        <input :name="nameField" @blur="onchangeMaterials"  v-model="materials[index-1]" :id="index+'material'"  type="url" :placeholder="placeholder" class="w-full block w-full rounded-md border-0 py-1.5  pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 ">
        <button @click="removeInput(index)" class="p-2" ><MonoTrash  class="text-red-600"/></button>
              
      </div>
      <div
         class="col-span-full min-h-[24px] overflow-hidden whitespace-nowrap pt-[2px]">
         <div v-if="errorsMessage[nameField]" class="flex items-center text-error">
            <MonoAlert class="mr-[2px] h-4 w-4 text-error" />
            <span class="msg-error">{{ errorsMessage[nameField] }}</span>
         </div>
      </div>


    </div>
  </template>