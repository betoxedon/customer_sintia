<script setup lang="ts">
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

      placeholder: {
         type: String,
      },
     
   })

   const { value } = useField(props.nameField)

   

</script>


<template>
    <div>
        <div v-if="labelField" class="label">
            <span>{{ labelField }}</span>
        </div>

        <div class="relative mt-2 ms-3">
            <input 
            type="color"            
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