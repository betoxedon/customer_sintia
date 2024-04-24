<script setup lang="ts">

import { ref } from 'vue'

defineProps({
    to: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    is_expanded: {
        type: Boolean,
        required: true,
        default: true
    }
})

const hoved = ref(false)

</script>

<template>

   <div class="mb-4 flex"> 

    <router-link 
        @mouseenter="hoved = true"
      @mouseleave="hoved = false"
    :to="to" class="button flex gap-2" :class="{ active: $route.path === to, is_expanded:!is_expanded }">
        <slot name="icon"></slot>
        <span class="text" v-if="is_expanded">{{text}}</span>
    </router-link> 
 
    <router-link  
    v-show="hoved && !is_expanded" 
        @mouseenter="hoved = true"
        @mouseleave="hoved = false"
        :to="to" 
        class="bg-white p-2 z-20 absolute mx-16 rounded drop-shadow-md legend" :class="{ 'active-legend': $route.path === to, is_expanded:!is_expanded }">
        <span>{{text}}</span>
    </router-link>

   </div>    

</template>

<style scoped>

.button {
    display: flex;    
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    color: #2c3e50;  
    transition: background-color 0.2s;
    width: 100%;
    cursor: pointer;
    align-items: center;
    
}

.button:hover {
    background-color: #ecf0f1;
}

.button.active {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    color: #fff ;
    background-color: #4f8aff;
    transition: background-color 0.2s;
    font-weight: bold;
}

.button.is_expanded {
    width: max-content;
}

.legend {   
    position: absolute;
    background-color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    color: #2c3e50;
    transition: background-color 0.2s;
    cursor: pointer;
}

.active-legend {
    background-color: #4f8aff;
    font-weight: bold;
    padding: 0.5rem 1rem;
    color: #fff;
    transition: background-color 0.2s;
    border-radius: 0.5rem;
}

.button.active span {
    color: #fff;
}


</style>