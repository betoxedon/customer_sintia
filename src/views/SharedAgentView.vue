<script setup lang="ts">
   import { computed, nextTick, onMounted, ref } from 'vue'
   import { useAgentStore } from '@/stores/agentStore'
   import { useRoute } from 'vue-router'

   const agentStore = useAgentStore()
   const route = useRoute()

   const showAvatar = ref(false)
   const showChatBalloon = ref(true)
   const showDialog = ref(false)
   
   const today = new Date().toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'short',
   })

   
   const chatBallonClass = computed(() => {
      if (agentStore.agentActive?.side?.name === 'Direita') {
         return 'rounded-tr-none pl-5'
      } else {
         return 'rounded-tl-none pl-5 order-last'
      }
   })

   const closeChatBalloonClass = computed(() => {
      if (agentStore.agentActive?.side.name == 'Direita') {
         return '-left-1'
      } else {
         return '-right-1'
      }
   })

   const screenSideClass = computed(() => {
       if (agentStore.agentActive && agentStore.agentActive?.side?.name === 'Direita') {
          return 'right-6'
      } else {
         return 'left-6'
       }
   })
   
   const backgroundColor = computed(() => {
      if(agentStore.agentActive?.color && agentStore.agentActive?.color.includes('background-color:')){
         return agentStore?.agentActive?.color
      }else{
         return 'background-color:'+ agentStore.agentActive?.color+';'  
      }
   })

   const borderColor = computed(() => {     
         return 'border-color:'+ agentStore.agentActive?.color+';'  
   })

   const defaultFont = ref("font-family: ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'")

   const fontFamily = computed(() => {   
   return agentStore.agentActive?.font &&  agentStore.agentActive?.font?.property_value || defaultFont.value
   })

   const welcomeMessage = computed(() => {
       return 'Olá!👋 Como posso te ajudar?'
   })


   const onAvatar = () => {
      showAvatar.value = false
      showChatBalloon.value = false
      showDialog.value = true
      nextTick(() => {
         const inputElement = document.querySelector('input')
         if (!inputElement) return
         inputElement.focus()
      })
   }

   const onCloseChatDialog = () => {
      showDialog.value = false
      showAvatar.value = true
   }

   onMounted(async () => {   
      const agentId = route.params.chatbotId as string
     // const userId =  route.params.userId as string

      await agentStore.getAgentById(agentId)
      showAvatar.value = true
      agentStore.sharedAgent = true
      

   })
</script>

<template>
   <div
      class="text-onsurface fixed bottom-5 max-h-[100vh] min-h-[66px] w-[100vh] max-w-[326px]"
      :class="screenSideClass">
      <div v-if="showDialog" class="chat-main grid content-end">
         <div
            class="grid w-full grid-rows-[min-content_minmax(0px,_480px)] overflow-hidden rounded-xl"
            :style="fontFamily">
            <div
               class="flex min-h-[74px] flex-col py-4 pl-5 pr-3"
               :style="backgroundColor">
               <div
                  class="relative grid grid-cols-[1fr_min-content_min-content] items-center gap-x-2">
                  <div class="flex flex-col truncate">
                     <span class="text-xl font-bold text-white">
                        {{ agentStore.agentActive.name }}
                     </span>

                     <div class="flex items-center gap-x-1">
                        <span
                           class="mb-[0.5px] h-[9px] w-[9px] rounded-full bg-[#02fe04]"></span>
                        <span class="text-sm font-medium text-white">Online</span>
                     </div>
                  </div>

                  <div class="absolute right-1 top-0 flex gap-x-2">
                     <span class="cursor-pointer" @click="onCloseChatDialog()">
                        <MonoClose class="h-5 text-white" />
                     </span>
                  </div>
               </div>
            </div>

            <div
               class="grid grid-rows-[1fr_min-content] rounded-b-xl bg-white pb-[10px]">
               <div class="grid grid-cols-2 content-start px-2 pb-1">
                  <span
                     class="col-span-2 mb-4 mt-1 place-self-center rounded-lg bg-slate-400 px-4 py-0.5 text-white">
                     {{ today }}
                  </span>

                  <div
                     class="col-span-full grid grid-cols-[min-content_77%] gap-x-2">
                     <div
                        class="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-white">
                        <img
                           v-if="agentStore.agentActive.image_file"
                           :src="agentStore.agentActive.image_file"
                           class="w-full" />
                        <MonoLogo v-else class="h-6 w-6 text-slate-500" />
                     </div>

                     <span
                        class="mb-[22px] mt-3 grid place-self-start self-start rounded-2xl rounded-tl-none px-3 py-1.5 text-base text-white"
                        :style="backgroundColor">
                        {{ welcomeMessage }}
                     </span>
                  </div>
               </div>

               <div
                  class="mx-2 flex items-center overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-400 has-[:focus]:ring-2 has-[:focus]:ring-primary-40">
                  <input
                     class=":focus:ring-2 block h-[40px] w-full rounded-l-lg border-0 bg-slate-100 pl-3 pr-2 text-base ring-0 placeholder:text-base focus:border-0 focus:outline-0"
                     placeholder="Digite sua mensagem..." />

                  <div
                     class="mr-[2px] flex h-[36px] w-[37px] shrink-0 items-center justify-center rounded-lg bg-slate-400">
                     <MonoSend class="h-5 text-white" />
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div
         v-if="showAvatar"
         class="flex min-h-[56px] flex-nowrap items-end gap-x-3 overflow-hidden p-[3px]"
         :class="{ 'justify-end':  agentStore.agentActive?.side?.name === 'Direita' }">
         <div
            v-if="showChatBalloon"
            class="chat-balloon show-in relative flex w-full gap-x-2 rounded-full border bg-white px-6 py-2 opacity-0"
            :class="chatBallonClass">
            <div class="flex w-full items-center justify-between gap-x-3">
               <div class="flex select-none items-center justify-center">
                  <span
                     class="text-center"
                     :style="fontFamily">
                     {{ welcomeMessage }}
                  </span>
               </div>
            </div>

            <div
               class="absolute top-[0.5px] cursor-pointer rounded-full border border-white bg-slate-500 p-0.5"
               :class="closeChatBalloonClass"
               @click="showChatBalloon = false">
               <MonoClose class="h-4 w-4 text-white" />
            </div>
         </div>

         <div
            class="show-in relative flex h-[66px] w-[66px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 bg-white opacity-0 hover:bg-slate-50"
            @click="onAvatar()" :style="borderColor">
            <img
               v-if="agentStore.agentActive.image_file"
               :src="agentStore.agentActive.image_file"
               class=" w-full" />
            <MonoLogo v-else class="h-11 w-11 text-slate-600" />
         </div>
      </div>
   </div>
</template>