<script setup lang="ts">

import {ref} from 'vue'
import { useField } from 'vee-validate'


const props = defineProps({

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
      refValue:{}

})


const { value } = useField(props.nameField)

const checkvalue = ref(value)

const emits = defineEmits(['update:modelValue'])

const onCheck = () => {    
    console.log('nameField',props.nameField)
    emits('update:modelValue', value.value) // Invertendo o valor e emitindo o evento
    value.value = checkvalue.value
}

</script>

<template>
    <div>
        <div v-if="labelField" class="label mb-2">
            <span>{{ labelField }}</span>
        </div>

        
        <div class="relative flex items-center gap-2">  
            <input class="outline-none" type="checkbox" :id="nameField" :name="nameField" v-model="checkvalue" @change="onCheck"/>
            <label for="checkbox">{{placeholder}}</label>
        </div>

    </div>
    
</template>

<style scoped>
[type='checkbox']{
    border-radius: 4px;
}

[type='checkbox']:focus{
    box-shadow: none;
}

[type='checkbox']:checked, [type='radio']:checked {
    border-color: transparent;
    background-color: #536cbc;
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
}

</style>