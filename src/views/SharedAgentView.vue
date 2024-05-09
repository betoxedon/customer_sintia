<script setup lang="ts">
   import { computed, nextTick, onMounted, ref } from 'vue'
   import { useAgentStore } from '@/stores/agentStore'
   import {useChatStore} from '@/stores/chatStore'
   import { useRoute } from 'vue-router'
   import { useSpeechRecognition } from '@vueuse/core'
   import AudioPlayer from '@/components/player/AudioPlayer.vue' 
      
   //audio recognition
   const transcript = ref('')
   const audioRecorded = ref('')
   const audioFile = ref<File>()

   const isRecording = ref(false)  
   
   const speech = useSpeechRecognition({
      continuous: true,
      lang: 'pt-BR',
   })


   function start() {     
      speech.result.value = ''      
      speech.start()
      startRecording();
     
   }

   const { isListening, isSupported, result } = speech

   function stop() {
      transcript.value = result.value     
      chatStore.currentMessage = transcript.value
      chatStore.isAudioRecorded = true
      speech.stop()
      stopRecording();
     
      
   }

   let mediaRecorder: MediaRecorder | null;

   function startRecording() {
      navigator.mediaDevices.getUserMedia({ audio: true })
         .then(function onSuccess(stream) {
            mediaRecorder = new MediaRecorder(stream);
            const chunks: BlobPart[] = [];
            mediaRecorder.start();
            mediaRecorder.addEventListener('dataavailable', function onDataAvailable(event) {
            chunks.push(event.data);
            });
            mediaRecorder.addEventListener('stop', function onStop() {
            const blob = new Blob(chunks, { type: 'audio/wav; codecs=opus' });
            audioFile.value = new File([blob], 'audio_recording.wav', { type: 'audio/wav; codecs=opus' });  

            chatStore.currentAudioFile = audioFile.value         
            const audioUrl = URL.createObjectURL(blob);            
            const audioElement = new Audio(audioUrl);                         
            audioRecorded.value = audioUrl
            chatStore.currentUrlAudio = audioRecorded.value
            audioElement.controls = true;
            document.body.appendChild(audioElement);
            });
         })
         .catch(function onError(err) {
            console.log('The following error occurred:', err);
         });
   }

   // Função para parar a gravação de áudio
   async function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.addEventListener('stop', async () => {
            // Chama sendMessage após o evento 'stop'
            await sendMessage();
        });
        // Para a gravação
        await mediaRecorder.stop();
    }
   }



   const agentStore = useAgentStore()
   const chatStore = useChatStore()
   const route = useRoute()

   const scrollElement = ref<HTMLElement | null>(null)
   const showAvatar = ref(false)
   const showChatBalloon = ref(true)
   const showDialog = ref(false)
   const body = ref(document.body)
   const links = ref<NodeListOf<Element>>()

   
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

      if (agentStore.agentActive?.welcome_message) {
         return agentStore.agentActive?.welcome_message
      }      
       return 'Olá!👋 Como posso te ajudar?'
   })

   const onAvatar = () => {
      showAvatar.value = false
      showChatBalloon.value = false
      showDialog.value = true
     
      
      nextTick(() => {
         addLinkTarget() 
         scrollMessage() 
         const inputElement = document.querySelector('input')
         if (!inputElement) return
         inputElement.focus()
      })
   }

   const onCloseChatDialog = () => {
      showDialog.value = false
      showAvatar.value = true
   }

   const scrollMessage = () => {
      if (!scrollElement.value) return  
      scrollElement.value.scrollTop = scrollElement.value?.scrollHeight
   }

   const sendMessage = async() => {         
      
    
      if (chatStore.currentMessage) {
         chatStore.isLoading = true  

         nextTick(() => {
            scrollMessage()      
         })
        

         await chatStore.sendMessage(chatStore.currentMessage)

          nextTick(() => {
            addLinkTarget()
            scrollMessage()      
         }) 
         
      }     
      chatStore.isLoading = false
   }

   const truncateText = (text: string, length: number) => {
      if (text.length > length) {
         return text.slice(0, length) + '...'
      }
      return text
   }

   const rateMessage = (rate: boolean, messageId: number) => {
      chatStore.rateMessage(rate, messageId)
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

   const addLinkTarget = () => {
      
      scrollElement.value = document.getElementById('messages_list') as HTMLElement   
      links.value = scrollElement.value?.querySelectorAll('.bot_message_markdown p a') as NodeListOf<Element>  

      links.value?.forEach((link) => {         
         nextTick(() => {
            link.setAttribute('rel', 'noopener noreferrer')
            link.setAttribute('target', '_blank');
         })         
      }) 
   }

   const showTextVersion = (is_audio_recorder:boolean) => {

      // se o bot não tiver permissão para responder com áudio exibe a versão em texto

      if (!agentStore.agentActive.audio_response) {
         return true;
      }

      // se o bot tiver permissão para responder com áudio apenas para perguntas com áudio e a pergunta não for um áudio

      if (
         agentStore.agentActive.audio_response && 
         agentStore.agentActive.audio_response_type?.name === 'Áudio apenas para perguntas com áudio' && 
         !is_audio_recorder
      ) {
         return true;
      }
      //caso contrário exibe a versão em áudio sempre que houver

      return false;
   }

</script>

<template>
 
   <div
   
      class="text-onsurface fixed bottom-5 max-h-[100vh] min-h-[66px] w-[100vh] max-w-[326px]"
      :class="screenSideClass">
      
      <div v-show="showDialog" class="chat-main grid content-end">
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
               
               <div class="flex flex-col content-start px-2 pb-1 overflow-x-hidden" id="messages_list" ref="scrollElement" >
                  
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
                     <div v-if="message.type == 'bot'"  style="max-width:100%"
                        class="mb-[22px] message-ballon col-span-full grid grid-cols-[min-content_77%] gap-x-2"> 
                        
                        <!-- BOT PICTURE-->
                        <div
                           class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-white">
                           <img
                              v-if="agentStore.agentActive.image_file"
                              :src="agentStore.agentActive.image_file"
                              class="w-full h-full object-cover " />
                           <MonoLogo v-else class="h-6 w-6 text-slate-500" />
                        </div>      
                        
                        
                        <div class="">                          
                                                   
                              <vue-markdown 
                                 v-if="showTextVersion(message.is_audio_recorder)"                                                    
                                 class="bot_message_markdown bot_message break-words grid place-self-start self-start rounded-2xl rounded-tl-none px-3 py-1.5 text-base text-white"
                                 :source="message.content"
                                 :style="backgroundColor"                               
                                 :options="{breaks: true, linkify: true, typographer: false, html:true,xhtmlOut:true}">
                                 >
                              </vue-markdown>      

                              <AudioPlayer 
                              class="audio_controlls" 
                              type="bot"
                              :backgroundColor="agentStore.agentActive?.color"
                              color="#ffffff"
                              :audioSource="message.audio_file" v-else />                 

                              <!-- <audio  class="audio_controlls" v-else :src="message.audio_file" controls></audio> -->
                          
                        <!--Rating Message buttons-->
                        <div class="flex justify-end" v-if="message.id">

                           <button 
                              :disabled="message.rating === true"
                              v-if="message.rating !== false || message.rating === true"
                              @click="rateMessage(true, message.id)"
                              :class="{active: message.rating === true}"
                              class="btn-raiting btn-like">
                                 <MonoLike class="h-4 w-4"/>
                           </button>

                           <button
                              :disabled="message.rating === false"
                              v-if="message.rating !== true || message.rating === false"
                              :class="{active: message.rating === false}"
                              @click="rateMessage(false, message.id)"
                              class="btn-raiting btn-unlike">
                              <MonoUnlike class="h-4 w-4"/>
                           </button>
                        </div>

                        <!--Sources-->       
                        <div class="flex mt-4 gap-2 sources bg-white mb-[12px] items-center overflow-x-auto"
                           v-if="message.sources && message.sources.length > 0 && message.sources[0] != '' " >
                              <span>Sources: </span>
                              <a :href="source" target="_blank" v-for="(source, index) in message.sources" :key="index" class="bg-blue-300 flex gap-2 items-center rounded">
                                 <MonoLink class="h-4 w-4" />
                                 <span >
                                    <span>{{ truncateText(source,20) }}</span> 
                                 </span>
                              </a>
                        </div>

                     </div>
                        

                     </div>
                  
                     <!--message.type == user -->
                     <div  v-if="message.type == 'user'"
                        class="mb-[22px] col-span-full grid grid-cols-[minmax(0,_90%)] justify-end gap-x-2 ">
                        
                           <span v-if="message.audio_file == ''"
                              class="break-words relative  grid place-self-end rounded-2xl rounded-tr-none bg-surface-30 px-3 py-1.5 text-base before:bg-surface-30">
                              {{ message.content }}
                           </span>

                           <!-- <audio  class="audio_controlls user" v-else :src="message.audio_file" controls></audio> -->
                           <AudioPlayer 
                              class="audio_controlls" 
                              type="user"
                              backgroundColor="#e7e9f1"
                              :color="agentStore.agentActive?.color"
                              :audioSource="message.audio_file" v-else />     

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
                  class="mx-2 mt-5 z-20 flex items-center overflow-hidden rounded-lg border-on
                    has-[:focus]:ring-2 has-[:focus]:ring-primary-40" :style="borderColor" >
                  <input @keydown.enter.stop.prevent="sendMessage" v-model.trim="chatStore.currentMessage" style="font-size: 16px;"
                     class=":focus:ring-2 block h-[40px] w-full rounded-l-lg border-0  pl-3 pr-2 text-base ring-0 placeholder:text-base placeholder:font-normal focus:border-0 focus:outline-0"
                     placeholder="Digite sua mensagem..." />
                 
                  <button v-if="isSupported && !isListening" class="audio_btn mr-[2px] flex h-[36px] w-[37px] shrink-0 items-center justify-center rounded-lg" >
                     <MonoMicrophone class="h-5 text-slate-500" 
                     :class="{ 'cursor-not-allowed text-red-500': isRecording }" @click="start"
                     />
                  </button>

                  <button v-if="isSupported && isListening" class="audio_btn mr-[2px] flex h-[36px] w-[37px] shrink-0 items-center justify-center rounded-lg" >
                     <MonoStop class="h-5 text-slate-500" @click="stop"
                     />                      
                  </button>

                  <button  @click.stop="sendMessage" :style="backgroundColor" :disabled="!chatStore.currentMessage || chatStore.isLoading"
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
                     {{ agentStore.agentActive.hello_message || 'Olá!👋 Como posso te ajudar?'}}
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

.btn-raiting{
   border-radius: 50%;
   padding: 0.5rem;
   cursor: pointer;
   transition: color 0.2s;
}

.btn-like:hover{
   color: #28a52d;  
}

.btn-like.active{
   color: #28a52d;  
}


.btn-unlike:hover{
   color: #ff0000;
}

.btn-unlike.active{
   color: #ff0000;
}

.sources span{
   font-size: 12px;
   font-weight: 400;
   color: #4a5568;
   text-wrap: nowrap;

}

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

.sources::-webkit-scrollbar {
    width: 2px;
}

.sources::-webkit-scrollbar-track {
    background: #f1f1f1;
}
.sources::-webkit-scrollbar-thumb {
    background: #445360;
    border-radius: 4px;
}
.sources::-webkit-scrollbar-thumb:hover {
    background: #283037;
}


</style>