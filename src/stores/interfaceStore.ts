import { ConfirmationData } from '@/models/globalModel'
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useInterfaceStore = defineStore('interface', () => {
   const showScreenLoading = ref()
   const screenWidth = ref<Number>()
   const showWidthMin1024 = computed(() => {
      return screenWidth.value && Number(screenWidth.value) < 1024
   })

   const showDialogEmailVerification = ref<boolean>()
   const showDialogForgotPassword = ref<boolean>()
   const showDialogAgentImage = ref<boolean>()
   const showDialogScript = ref<boolean>()
   const showDialogUserImage = ref<boolean>()
   const showDialogTrainingAiByWebsite = ref<boolean>()
   const showDialogConfirmation = ref<boolean>()
   const confirmationData = ref<ConfirmationData>()

   const hasBackdropDialog = computed(() => {
      return (
         showDialogEmailVerification.value ||
         showDialogForgotPassword.value ||
         showDialogAgentImage.value ||
         showDialogUserImage.value ||
         showDialogScript.value ||
         showDialogTrainingAiByWebsite.value ||
         showDialogConfirmation.value
      )
   })

   const notificationMessage = ref<string>('Mensagem para você')
   const notificationMessageHandled = computed(() => {
      if (notificationMessage.value.length > 120) {
         return notificationMessage.value.substring(0, 120) + '...'
      } else {
         return notificationMessage.value
      }
   })
   const notificationType = ref<string>('info')
   const notificationIsPersistent = ref<boolean>(false)
   const showNotification = ref<boolean>()

   const setScreenLoading = (supply: boolean) => {
      if (supply === true) {
         setTimeout(() => {
            showScreenLoading.value = true
         }, 1000)
      } else {
         showScreenLoading.value = false
         setInterval(() => {
            showScreenLoading.value = notificationIsPersistent.value
         }, 1000)
      }
   }

   const resetDialog = () => {
      showDialogEmailVerification.value = undefined
      showDialogForgotPassword.value = undefined
      showDialogAgentImage.value = undefined
      showDialogUserImage.value = undefined
      showDialogScript.value = undefined
      showDialogTrainingAiByWebsite.value = undefined
      showDialogConfirmation.value = undefined
   }

   const resetNotification = () => {
      notificationMessage.value = 'Mensagem para você'
      notificationType.value = 'info'
      notificationIsPersistent.value = false
      showNotification.value = undefined
   }

   const partialReset = () => {
      showScreenLoading.value = undefined
      screenWidth.value = undefined
      resetDialog()
      resetNotification()
   }

   const $reset = () => {
      showScreenLoading.value = undefined
      screenWidth.value = 0
      resetDialog()
      confirmationData.value = undefined
      resetNotification()
   }

   return {
      showScreenLoading,
      screenWidth,
      showWidthMin1024,

      showDialogEmailVerification,
      showDialogForgotPassword,
      showDialogAgentImage,
      showDialogUserImage,
      showDialogScript,
      showDialogConfirmation,
      showDialogTrainingAiByWebsite,
      confirmationData,
      hasBackdropDialog,

      notificationMessage,
      notificationMessageHandled,
      notificationType,
      notificationIsPersistent,
      showNotification,

      resetDialog,
      resetNotification,
      setScreenLoading,
      partialReset,
      $reset,
   }
})
