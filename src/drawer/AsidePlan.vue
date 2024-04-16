<script setup lang="ts">
   import AsideTop from '@/components/AsideTop.vue'
   import AsideBottom from '@/components/AsideBottom.vue'
</script>

<template>
   <aside class="aside hidden">
      <div class="aside-inner grid grid-rows-[min-content_1fr_min-content]">
         <AsideTop />
         <AsideBottom />
      </div>
   </aside>
</template>
