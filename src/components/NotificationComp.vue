<script setup lang="ts">
   import { storeToRefs } from 'pinia'
   import { useInterfaceStore } from '@/stores/interfaceStore'
   import { ref, computed, watchEffect } from 'vue'
   const interfaceStore = useInterfaceStore()
   const { notificationIsPersistent, showNotification } = storeToRefs(interfaceStore)
   const ready = ref(false)

   const notificationClass = computed(() => {
      if (ready.value && showNotification.value) {
         return 'notification-entrance ' + interfaceStore.notificationType
      } else if (ready.value && !showNotification.value) {
         return 'notification-exit ' + interfaceStore.notificationType
      }
      return ''
   })

   const notificationBarTimeoutClass = computed(() => {
      if (ready.value && !notificationIsPersistent.value && showNotification.value) {
         return 'notification-bar-timeout-decrease'
      } else if (
         ready.value &&
         !notificationIsPersistent.value &&
         !showNotification.value
      ) {
         return 'hidden'
      }
      return ''
   })

   const onShowNotification = () => {
      if (!ready.value) ready.value = true
      if (!notificationIsPersistent.value) {
         setTimeout(() => {
            showNotification.value = false
         }, 5000)
      } else {
         setTimeout(() => {
            showNotification.value = false
         }, 15000)
      }
   }

   watchEffect(() => {
      if (showNotification.value) onShowNotification()
   })
</script>

<template>
   <div class="notification border border-primary-30" :class="notificationClass">
      <div class="notification-inner">
         <div class="notification-icon-w">
            <span class="notification-icon">
               <MonoAlert
                  v-if="interfaceStore.notificationType === 'alert'"
                  class="text-error-700" />
               <MonoBot
                  v-else-if="interfaceStore.notificationType === 'success'"
                  class="text-primary-30" />
               <MonoInfo v-else class="text-primary-30" />
            </span>
         </div>

         {{ interfaceStore.notificationMessageHandled }}
      </div>

      <div class="notification-close">
         <div
            class="btn btn-link bg-surface-10-200"
            @click="interfaceStore.showNotification = false">
            <MonoClose class="h-6 opacity-50" />
         </div>
      </div>

      <div
         class="notification-bar-timeout"
         :class="notificationBarTimeoutClass"></div>
   </div>
</template>
