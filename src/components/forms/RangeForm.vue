<script setup lang="ts">

import {computed,ref, onMounted} from 'vue'
import { useField } from 'vee-validate'
import { vMaska } from 'maska'

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
      prependIcon: {
         type: String,
      },
      minValue:{
        type:Number,
        required: true,
      },
      maxValue:{
        type:Number,
        required: true,
      },
      stepValue:{
        type:Number,
        required: true,
      }
   })
const { value } = useField<number>(props.nameField)

const parsedValue = computed(() => parseFloat(String(value.value)));

const backgroundSize = ref('')

const onChangeRange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      value.value = parseFloat(target.value); 
      updateSlider(event)   
   }

onMounted(() => {      
    backgroundSize.value = (parsedValue?.value - props?.minValue) * 100.5   / (props?.maxValue - props?.minValue) + '% 100%';
   })


const updateSlider = (e:Event) => {
    let clickedElement = e.target as HTMLInputElement,
    min = clickedElement.min,
    max = clickedElement.max,
    val = clickedElement.value;

    backgroundSize.value = (parseFloat(val) - parseFloat(min)) * 100.5 / (parseFloat(max) - parseFloat(min)) + '% 100%';
}


</script>
<template>
    <div>
        <div v-if="labelField" class="label">
         <span>{{ labelField }}</span>
      </div>

      <div class="relative flex items-center gap-3">
        <input class="input-range border-onsurface-10 bg-white placeholder:normal-case focus:border-[2px] focus:border-primary-40 focus:outline-transparent focus:ring-transparent" type="range" :id="nameField" :name="nameField" 
        :style="{backgroundSize: backgroundSize || 'auto'}"
        :min="minValue" 
        :max="maxValue" 
        :step="stepValue" 
        v-model.trim="parsedValue"
        @change="(event) => onChangeRange(event)"
        v-maska        
        list="markers"/>
        <span class="flex">{{value}}
            <span v-if="value == 0 || value == 1">.0</span>
         </span>   
      </div>

        <datalist id="markers">
            <option :value="minValue" label="Menos criativo"></option>      
            <option :value="maxValue" label="Mais criativo"></option>
        </datalist> 
        
        <div
         class="col-span-full min-h-[24px] overflow-hidden whitespace-nowrap pt-[px]">
         <div v-if="errorsMessage[nameField]" class="flex items-center text-error">
            <MonoAlert class="mr-[2px] h-4 w-4 text-error" />
            <span class="msg-error">{{ errorsMessage[nameField] }}</span>
         </div>
      </div>

    </div>
   

</template>

<style scoped>

datalist {
  display: flex;
  justify-content: space-between;

}

option {
  padding: 0;
}


/* Slider CSS */
input[type=range] {

    -webkit-appearance: none;
    display: block;
    width: 100%;
    margin: 12px 0;
    border-radius: 4px;
    border: 1px solid #94a3b8;
    background: #f9f9f9;
    background-image: -webkit-gradient(linear, 20% 0%, 20% 100%, color-stop(0%, #ADD8E6), color-stop(100%, #ADD8E6));
    background-image: -webkit-linear-gradient(left, #ADD8E6 0%,#536cbc 100%);
    background-image: -moz-linear-gradient(left, #ADD8E6 0%, #536cbc 100%);
    background-image: -o-linear-gradient(to right, #ADD8E6 0%,#536cbc 100%);
    background-image: linear-gradient(to right, #ADD8E6 0%,#536cbc 100%);
    background-repeat: no-repeat;
}

input[type=range]::-webkit-slider-runnable-track {
  width: 100%;
  height: 4px;
  cursor: pointer;
  box-shadow: none;
  background: transparent;
  border-radius: 4px;
 
}
input[type=range]::-webkit-slider-thumb {
  box-shadow: none;
  border: 4px solid #536cbc;
  height: 18px;
  width: 18px;
  border-radius: 50%;
  background: #ffffff;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -6px;
}
input[type=range]:focus::-webkit-slider-runnable-track {
  background: transparent;
}
input[type=range]::-moz-range-track {
  width: 100%;
  height: 4px;
  cursor: pointer;
  box-shadow: none;
  background: transparent;
  border-radius: 4px;
  
}
input[type=range]::-moz-range-thumb {
  box-shadow: none;
  border: 4px solid #536cbc;
  height: 16px;
  width: 16px;
  border-radius: 4px;
  background: #ffffff;
  cursor: pointer;
}
input[type=range]::-ms-track {
  width: 100%;
  height: 4px;
  cursor: pointer;
  background: transparent;
  border-color: transparent;
  color: transparent;
}
input[type=range]::-ms-fill-lower {
  background: transparent;
  border-radius: 4px;
  box-shadow: none;
}
input[type=range]::-ms-fill-upper {
  background: transparent;
  border-radius: 4px;
  box-shadow: none;
}
input[type=range]::-ms-thumb {
  box-shadow: none;
  border: 4px solid #536cbc;
  height: 16px;
  width: 16px;
  border-radius: 4px;
  background: #ffffff;
  cursor: pointer;
  height: 4px;
}
input[type=range]:focus::-ms-fill-lower {
  background: transparent;
}
input[type=range]:focus::-ms-fill-upper {
  background: transparent;
}
/* End Range Slider */

</style>