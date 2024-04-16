<script setup>
import { useField } from 'vee-validate'

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

   

</script>


<template>
    <div>
        <div v-if="labelField" class="label">
            <span>{{ labelField }}</span>
        </div>

        <div class="relative mt-2 ms-3">
            <input 
            type="color" 
            @input="(event) => onInput(event)" 
            v-model="value" 
            :id="nameField" 
            :name="nameField">
        </div>
    
    
    </div>
</template>

<style scoped>
input[type="color"] {
	-webkit-appearance: none;
	border: none;
	width: 32px;
	height: 32px;
}
input[type="color"]::-webkit-color-swatch-wrapper {
	padding: 0;
}
input[type="color"]::-webkit-color-swatch {
	border: none;
}
</style>