<script setup lang="ts">
   import { computed, nextTick, onMounted, ref } from 'vue'
   import { useAgentStore } from '@/stores/agentStore'
   import {useChatStore} from '@/stores/chatStore'
   import { useRoute } from 'vue-router'

   const agentStore = useAgentStore()
   const chatStore = useChatStore()
   const route = useRoute()

   const showAvatar = ref(false)
   const showChatBalloon = ref(true)
   const showDialog = ref(false)
   const body = ref(document.body)
   
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
      if (agentStore.agentActive?.side?.name == 'Direita') {
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

   const sendMessage = async() => {             

      if (chatStore.currentMessage) {
         chatStore.isLoading = true    
         await chatStore.sendMessage(chatStore.currentMessage)  
      }     
      chatStore.isLoading = false
   }

   onMounted( () => {   
      body.value.style.backgroundColor = '#0f172a'
      body.value.style.overflow = 'hidden'
      const agentId = route.params.chatbotId as string
      const userId =  route.params.userId as string

      agentStore.getAgentById(agentId,userId).then(() =>{
         showAvatar.value = true
         agentStore.sharedAgent = true  
         chatStore.startSession(agentId)
      }).catch(error => {
         console.log(error)            
     });       
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

            <div class="grid grid-rows-[1fr_min-content] rounded-b-xl bg-white pb-[10px]">
               
               <div class="flex flex-col content-start px-2 pb-1 overflow-x-hidden">
                  
                  <span
                     class="col-span-2 mb-4 mt-1 place-self-center rounded-lg bg-slate-400 px-4 py-0.5 text-white">
                     {{ today }}
                  </span>

                  
                  <div  class="col-span-full grid grid-cols-[min-content_77%] gap-x-2">
                     
                     <div
                        class="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-white">
                        <img
                           v-if="agentStore.agentActive.image_file"
                           :src="agentStore.agentActive.image_file"
                           class="w-full h-full object-cover " />
                        <MonoLogo v-else class="h-6 w-6 text-slate-500" />
                     </div>

                     <span
                        class="mb-[22px] mt-3 grid place-self-start self-start rounded-2xl rounded-tl-none px-3 py-1.5 text-base text-white"
                        :style="backgroundColor">
                        {{ welcomeMessage }}
                     </span>
                  </div>

                  <div v-for="message in chatStore?.sessionActive?.messages" :key="message">
                  
                     <!--message.type == bot -->
                     <div 
                     v-if="message.type == 'bot'"  style="max-width:100%"
                     class=" message-ballon col-span-full grid grid-cols-[min-content_77%] gap-x-2"> 
                        
                        <div
                           class="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-white">
                           <img
                              v-if="agentStore.agentActive.image_file"
                              :src="agentStore.agentActive.image_file"
                              class="w-full h-full object-cover " />
                           <MonoLogo v-else class="h-6 w-6 text-slate-500" />
                        </div>                 

                        <span
                           class="break-words mb-[22px] mt-3 grid place-self-start self-start rounded-2xl rounded-tl-none px-3 py-1.5 text-base text-white"
                           :style="backgroundColor">
                           {{ message.content }}
                        </span>              

                     </div>
                  
                     <!--message.type == user -->
                     <div  v-if="message.type == 'user'"
                     class="col-span-full grid grid-cols-[minmax(0,_90%)] justify-end gap-x-2">
                        <span
                           class="break-words relative mb-[10px] grid place-self-end rounded-2xl rounded-tr-none bg-surface-30 px-3 py-1.5 text-base before:bg-surface-30">
                           {{ message.content }}
                        </span>
                     </div>

                  </div>

                  <div v-if="chatStore.isLoading"  style="max-width:100%"
                     class=" message-ballon col-span-full grid grid-cols-[min-content_77%] gap-x-2"> 
                        
                        <div
                           class="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-white">
                           <img
                              v-if="agentStore.agentActive.image_file"
                              :src="agentStore.agentActive.image_file"
                              class="w-full h-full object-cover " />
                           <MonoLogo v-else class="h-6 w-6 text-slate-500" />
                        </div>                 

                        <span
                           class=" mb-[22px] mt-3 grid place-self-start self-start rounded-2xl rounded-tl-none px-3 py-1.5 text-base text-white"
                           :style="backgroundColor">
                           <AnimLoadingComp />
                        </span>            

                  </div>                 

               </div>
               

               <div
                  class="mx-2 z-20 flex items-center overflow-hidden rounded-lg border-on
                    has-[:focus]:ring-2 has-[:focus]:ring-primary-40" :style="borderColor" >
                  <input v-model.trim="chatStore.currentMessage" style="font-size: 16px;"
                     class=":focus:ring-2 block h-[40px] w-full rounded-l-lg border-0  pl-3 pr-2 text-base ring-0 placeholder:text-base placeholder:font-normal focus:border-0 focus:outline-0"
                     placeholder="Digite sua mensagem..." />

                  <button @click.stop="sendMessage" :style="backgroundColor" :disabled="!chatStore.currentMessage || chatStore.isLoading"
                     class="mr-[2px] flex h-[36px] w-[37px] shrink-0 items-center justify-center rounded-lg">
                     <MonoSend class="h-5 text-white" />
                  </button>
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
               class=" w-full h-full object-cover " />
            <MonoLogo v-else class="h-11 w-11 text-slate-600" />
         </div>
      </div>
   </div>
</template>

<style scoped>

.cursor-not-allowed {
  cursor: not-allowed;
}

.opacity-50 {
   opacity: 0.5;
}

.border-on{
   border-width: 0.15em;
   border-style: solid;
}
.break-words{
   word-wrap: break-word;
   word-break: break-word;
}
/* width */
::-webkit-scrollbar {
    width: 10px;
}
 
/* Track */
::-webkit-scrollbar-track {
    background: #f1f1f1;
}
 
/* Handle */
::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 5px;
}
 
/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: #555;
}
</style>