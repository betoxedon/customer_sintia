<script setup lang="ts">
   import { ref } from 'vue'
   type Icon = { name: string; icon: any }
   import { useInterfaceStore } from '@/stores/interfaceStore'
   const interfaceStore = useInterfaceStore()

   const monoIcons = ref<Icon[]>([])

   const modules = import.meta.glob('@/components/icons/*.vue', {
      eager: true,
   }) as any

   for (const path in modules) {
      const pattern = /icons\/(.*).vue/
      const match = path.match(pattern)
      if (match) {
         const name = match[1]
         const icon = modules[path].default
         monoIcons.value.push({ name, icon } as Icon)
      }
   }

   const onSelect = (name: string) => {
      navigator.clipboard.writeText('<' + name + ' />')
      interfaceStore.notificationMessage = `${name} copiado com sucesso.`
      interfaceStore.notificationType = 'info'
      interfaceStore.showNotification = true
   }
</script>

<template>
   <div class="mx-auto grid min-h-screen w-full max-w-4xl grid-cols-8 gap-3 pt-8">
      <div
         v-for="(item, index) in monoIcons"
         :key="index"
         class="flex flex-col items-center justify-center gap-y-2 overflow-hidden px-2">
         <component
            :is="{ ...item.icon }"
            class="h-16 w-16 cursor-pointer rounded-lg border p-2 hover:bg-blue-100"
            @click="onSelect(item.name)" />

         <code class="block w-full truncate text-left text-sm">
            {{ item.name }}
         </code>
      </div>
   </div>
</template>
