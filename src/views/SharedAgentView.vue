<script setup lang="ts">
   import { computed, nextTick, onMounted, ref } from 'vue'
   import { useAgentStore } from '@/stores/agentStore'
   import {useChatStore} from '@/stores/chatStore'
   import { useRoute } from 'vue-router'
   //import { useSpeechRecognition } from '@vueuse/core'
   import AudioPlayer from '@/components/player/AudioPlayer.vue' 
  
   //audio recognition
   //const transcript = ref('')
   const audioRecorded = ref('')
   //const iconsRecord = ref()
   //const audioFile = ref<File>()
   const showRecordsAudio = ref(false)
   const showPlayer = ref(false)
   const imageFile = ref<File | null>(null)
   const imageUrl = ref<string | null>(null);
   const inputMessage = ref<HTMLInputElement | null>(null)
   const isRecording = ref(false)  
   const is_Recording  = ref(false)
   const is_Paused  = ref(false)
   const bolinha = ref<HTMLElement | null>(null)

   import { RecordsAudio, } from "vue-record-audio"

   const base64ToBlob = (base64: string, type: string) => {
      const byteCharacters = atob(base64.split(',')[1]); // Decodifica a string base64
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
         byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: type });
   };

   const saveRecord = async (data: any) => {
      
    // Acessar a string base64 do áudio
    const audioBase64 = data.base64;

    is_Recording.value = false
    is_Paused.value = false
    
    // Verificar se a string base64 está presente
    if (audioBase64) {
        // Criar um Blob a partir da string base64
        const audioBlob = base64ToBlob(audioBase64, 'audio/wav'); // Mude para 'audio/wav' se o áudio for WAV
        const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' }); // Crie um arquivo WAV

        // Log do arquivo de áudio
        console.log("Audio File:", audioFile);  

        // Criar um URL para o Blob
        const audioUrl = URL.createObjectURL(audioBlob);
        audioRecorded.value = audioUrl;

         chatStore.currentAudioFile = audioFile;
         chatStore.currentUrlAudio = audioRecorded.value;
         chatStore.durationRecorded = data.time; // Usando o tempo da gravação

        // Enviar a mensagem com o arquivo de áudio
        await sendMessage();
    } else {   
        console.error("No audio data found in the provided object.");
    }
};

   const listenEventsRecord = (data:any)=>{
      console.log("listen record",data)

      if (!data.record && !data.false && !data.stop){
         showRecordsAudio.value = false
      }

      // Atualiza o estado da gravação
    if (data.record && !data.pause) {
        is_Recording.value = true;  // Gravando
        is_Paused.value = false;    // Não está pausado
    } else if (data.pause && data.record) {
        is_Recording.value = true;   // Gravando (mas pausado)
        is_Paused.value = true;      // Está pausado
    } else if (data.pause) {
        is_Recording.value = false;   // Pausado
        is_Paused.value = true;       // Está pausado
    } else if (data.stop) {
        is_Recording.value = false;   // Parado
        is_Paused.value = false;      // Não está pausado
    } else {
        is_Recording.value = false;   // Qualquer outro estado que não seja gravação
        is_Paused.value = false;      // Não está pausado
    }

    // Controle da bolinha
    if (bolinha.value) {
        if (is_Recording.value && !is_Paused.value) {
            bolinha.value.classList.remove('hidden');  // Mostra a bolinha quando a gravação começa
            bolinha.value.classList.add('piscando');   // Adiciona classe de piscar
        } else if (is_Paused.value) {
            bolinha.value.classList.remove('hidden');   // Mostra a bolinha quando está pausado
            bolinha.value.classList.remove('piscando');     // Adiciona classe de piscar mesmo pausado
        } else {
            bolinha.value.classList.add('hidden');       // Oculta a bolinha quando a gravação para, pausa ou para
            bolinha.value.classList.remove('piscando');  // Remove a classe de piscar
        }
        

    } else {
        console.error("A bolinha ainda não foi criada.");
        createBall();
        
    }

   }

   const listenEventsPlayer = (data:any)=>{
      console.log("listen player",data)
   }

   const stopRecordingPlay = (ControllerRecord: any) => {
      console.log(ControllerRecord)
      chatStore.isAudioRecorded = true
      ControllerRecord.stopRecord();
      scrollMessage() 
      showPlayer.value = false;  // Esconde o player após a gravação
      showRecordsAudio.value = false
   };

   const handleFileChange = (event: Event) => {

   const target = event.target as HTMLInputElement;
   if (target.files && target.files[0]) {
      imageFile.value = target.files[0];
      chatStore.imageFile = imageFile.value
      imageUrl.value = URL.createObjectURL(imageFile.value);
   }

   }
   const fileInput = ref<HTMLInputElement | null>(null)

   const triggerFileInput = () => {
      if (fileInput.value) {
         fileInput.value.click()
      }
   }

   const getUlrImage = (image: File | null) => {
      if (!image || !(image instanceof File)) return ''
      return URL.createObjectURL(image)
   }

   const auto_height = (element: EventTarget | null) => {
  if (element instanceof HTMLTextAreaElement) {
    element.style.height = 'auto';
    element.style.height = element.scrollHeight + 'px';
  }
};

   // const speech = useSpeechRecognition({
   //    continuous: true,
   //    lang: 'pt-BR',
   // })


   // function start() {     
   //    speech.result.value = ''      
   //    speech.start()
   //    startRecording();
   // }

   //const { isListening, isSupported, result } = speech

   // function stop() {
   //    transcript.value = result.value     
   //    chatStore.currentMessage = transcript.value
   //    chatStore.isAudioRecorded = true
   //    speech.stop()
   //    stopRecording();
   // }

   //let mediaRecorder: MediaRecorder | null;

   // function startRecording() {
   //    navigator.mediaDevices.getUserMedia({ audio: true })
   //       .then(function onSuccess(stream) {
   //          mediaRecorder = new MediaRecorder(stream);
   //          const chunks: BlobPart[] = [];
   //          mediaRecorder.start();

   //          const startTime = Date.now(); // Início da gravação
            
   //          mediaRecorder.addEventListener('dataavailable', function onDataAvailable(event) {
   //          chunks.push(event.data);
   //          });

   //          mediaRecorder.addEventListener('stop', function onStop() {

   //          const stopTime = Date.now(); // Fim da gravação
   //          chatStore.durationRecorded = (stopTime - startTime) / 1000; // Duração da gravação em segundos

   //          const blob = new Blob(chunks, { type: 'audio/wav; codecs=opus' });
            
   //          audioFile.value = new File([blob], 'audio_recording.wav', { type: 'audio/wav; codecs=opus' });  

   //          chatStore.currentAudioFile = audioFile.value         
   //          const audioUrl = URL.createObjectURL(blob);            
   //          //const audioElement = new Audio(audioUrl);                         
   //          audioRecorded.value = audioUrl
   //          chatStore.currentUrlAudio = audioRecorded.value
   //          //audioElement.controls = true;
   //          //document.body.appendChild(audioElement);
   //          });
   //       })
   //       .catch(function onError(err) {
   //          console.log('The following error occurred:', err);
   //       });
   // }

   // Função para parar a gravação de áudio
   // async function stopRecording() {
   //  if (mediaRecorder && mediaRecorder.state === 'recording') {
   //      mediaRecorder.addEventListener('stop', async () => {
   //          // Chama sendMessage após o evento 'stop'
   //          await sendMessage();
   //      });
   //      // Para a gravação
   //      await mediaRecorder.stop();
   //  }
   // }

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

   const textareaHeight = computed(() => {
      if (chatStore.currentMessage.length > 0) {
         return 'max-content'
         return 
      }
      return '40px'
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
   console.log('scrollMessage')
      if (!scrollElement.value) return  
      scrollElement.value.scrollTop = scrollElement.value?.scrollHeight
   }

   const sendMessage = async() => {         
      
    
      if (chatStore.currentMessage || chatStore.currentAudioFile) {
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
      chatStore.isAudioRecorded = false
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

   onMounted(async () => {         
      console.log('onMounted')
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

       await nextTick();
      //shadown

      // Chama a função createBall
      await createBall();
        
   })

   const waitForElement = async (selector: string, timeout = 5000) => {
    const start = Date.now();
    let element = document.querySelector(selector);

    while (!element && (Date.now() - start) < timeout) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Espera 100ms antes de tentar novamente
        element = document.querySelector(selector);
    }

    return element;
};
const createBall = async () => {
    await nextTick();  // Garante que os elementos no DOM estejam prontos

    const timeElement = await waitForElement('#time'); // Espera o elemento #time ser encontrado

    if (timeElement && timeElement.parentNode) {
        if (!bolinha.value) {
            bolinha.value = document.createElement('span');
            bolinha.value.classList.add('bolinha', 'hidden');
            timeElement.parentNode.insertBefore(bolinha.value, timeElement);
        }
        console.log('Bolinha criada:', bolinha.value);
    } else {
        console.warn('Elemento #time não encontrado ou não tem um elemento pai após o tempo de espera.');
    }
};

   const addLinkTarget = () => {
      
      scrollElement.value = document.getElementById('messages_list') as HTMLElement   
      links.value = scrollElement.value?.querySelectorAll('.bot_message_markdown a') as NodeListOf<Element>  

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

      //Se mesmo com o audio_response o audio_response_type tivr com valor = Sem resposta por audio, exibir versao de texto

      if (!agentStore.agentActive.audio_response_type){
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

   const markdownOptions = {
      linkify: true,
      typographer: true,
      html: true,
   };


   import VueMarkdown from 'vue-markdown-render'
   import MarkdownItAnchor from 'markdown-it-anchor'
   //import markdownItAttrs from 'markdown-it-attrs'
   const plugins = [MarkdownItAnchor];

</script>

<template>

<div>
      
    </div>
 
   <div
   
      class="text-onsurface fixed shared-agent-view bottom-5 max-h-[100vh] min-h-[66px] w-[100vh] max-w-[420px]"
      :class="screenSideClass">
      
      <div v-show="showDialog" class="chat-main grid content-end">
         <div
            class="grid w-full grid-rows-[min-content_minmax(0px,_570px)] overflow-hidden rounded-xl grid-rows-responsive "
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

                     <div class="flex items-center gap-x-1" v-if="agentStore.agentActive.available">
                        <span
                           class="mb-[0.5px] h-[9px] w-[9px] rounded-full bg-[#02fe04]"></span>
                        <span class="text-sm font-medium text-white">Online</span>
                     </div>

                     <div v-else class="flex items-center gap-x-1">
                        <span
                           class="mb-[0.5px] h-[9px] w-[9px] rounded-full bg-[#F4696B]"></span>
                        <span class="text-sm font-medium text-white">Offline</span>

                     </div>

                  </div>

                  <div class="absolute right-1 top-0 flex gap-x-2">
                     <span class="cursor-pointer" @click="onCloseChatDialog()">
                        <MonoClose class="h-5 text-white bg-white rounded-sm" />
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
                        class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-white">
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

                     <!-- <span v-else
                        class="mb-[22px] mt-3 grid place-self-start self-start rounded-2xl rounded-tl-none px-3 py-1.5 text-base text-white"
                        :style="backgroundColor"
                     >
                     Desculpe pelo inconveniente! No momento, nossos serviços estão indisponíveis. Por favor, tente novamente mais tarde. ⏳😊

                     </span> -->

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
                                 v-if="showTextVersion(message.is_audio_recorder) || !message.audio_file"                                                    
                                 class="bot_message_markdown bot_message break-words grid place-self-start self-start rounded-2xl rounded-tl-none px-3 py-1.5 text-base text-white"
                                 :source="message.content"
                                 :style="backgroundColor" 
                                 :plugins="plugins"                          
                                 :options="markdownOptions">
                                 >
                              </vue-markdown>      

                              <AudioPlayer 
                              class="audio_controlls" 
                              type="bot"
                              :backgroundColor="agentStore.agentActive?.color"
                              color="#ffffff"
                              :duration="message.duration"
                              :audioSource="message.audio_file" v-else />                 

                              <!-- <audio  class="audio_controlls" v-else :src="message.audio_file" controls></audio> -->
                        
                           <!--Rating Message buttons-->
                           <div class="rating-btns flex justify-end" v-if="message.id">

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
                        class="mb-53 col-span-full grid grid-cols-[minmax(0,_90%)] justify-end gap-x-2 ">
                        
                           <span v-if="message.audio_file == ''"
                              class="break-words relative  grid place-self-end rounded-2xl rounded-tr-none bg-surface-30 px-3 py-1.5 text-base before:bg-surface-30">
                              {{ message.content }}
                             
                            
                              <div v-if="message.image_file" class="mt-3">
                                 <img  :src="getUlrImage(message.image_file)" class="w-64 h-64 object-cover rounded-2xl" />
                              </div>
                              
                           </span>

                           <!-- <audio  class="audio_controlls user" v-else :src="message.audio_file" controls></audio> -->
                           <AudioPlayer 
                              class="audio_controlls" 
                              type="user"
                              backgroundColor="#e7e9f1"
                              :duration="message.duration"
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
               

               <div v-if="agentStore.agentActive.available" class="mx-2 mt-5 z-20 flex flex-col items-center overflow-hidden rounded-lg border-on
                    has-[:focus]:ring-2 has-[:focus]:ring-primary-40" :style="borderColor" >


                  <div v-if="chatStore.imageFile" class="imageselected">

                     <button class="close-btn">
                        <MonoClose class="h-4 w-4 text-red " @click="chatStore.imageFile = null" />
                     </button>

                     <img :src="getUlrImage(chatStore.imageFile)" alt="Selected Image" class="mt-4 ImageFileSelected" />
                  
                  </div>
                  
                  <RecordsAudio v-show="showRecordsAudio" color="#0c96f2" :saveRecord="saveRecord" @listenEventsRecord="listenEventsRecord" @listenEventsPlayer="listenEventsPlayer">

                     <!-- control de grabador -->
                     <template #btnCancelRecord="{ControllerRecord}">
                           <button class="btn btn-sm btn-transparent" @click="ControllerRecord.cancelRecord">
                           <MonoClose class="h-6 text-white"/>
                          
                           </button>
                     </template>

                     <template #btnRecord="{ControllerRecord}">
                        <button class="btn btn-primary" 
                        @click="ControllerRecord.playAudio"
                        >
                        <MonoMicrophone  class="h-6 text-white"  v-if="!ControllerRecord.record"/>
                        <MonoPause class="h-4 text-white" color="#ffffff" v-else-if="!ControllerRecord.pause" />
                        <MonoPlay class="h-4 text-white" color="#ffffff" v-else/>
                        </button>
                     </template>

                        <template #btnStopRecord="{ControllerRecord}">
                        <button class="btn btn-sm btn-transparent" @click="stopRecordingPlay(ControllerRecord)">
                        <!-- <IconStop color="#536cbc" class="h-6"/> -->
                        <MonoStop  class="h-6 text-white"  />
                        
                        </button>
                     </template>
                     
                     <div v-if="showPlayer">

                     
                     <!-- control de player -->
                     <!-- <template #btnPlayerCancel="{ControllerPlayer}">
                        <button class="btn btn-sm btn-transparent" @click="ControllerPlayer.cancelPlay">
                           <IconClose color="#536cbc" class="h-5"/>
                        </button>
                     </template>

                     <template #btnPlayer="{ControllerPlayer}">
                        <button class="btn btn-primary" @click="ControllerPlayer.playRecord">
                           <IconPause color="#ffffff" v-if="ControllerPlayer.play"/>
                           <IconPlay color="#ffffff" v-else-if="ControllerPlayer.pause" />
                           <IconPlay color="#ffffff" v-else/>
                        </button>
                     </template>

                     <template #btnPlayerStop="{ControllerPlayer}">
                     <button class="btn btn-sm btn-transparent" @click="ControllerPlayer.stopPlay">
                     <IconStop/>
                     </button>
                     </template> -->
                     </div>
                  </RecordsAudio>
                  
                  <div v-if="!showRecordsAudio" class="flex items-end py-1 w-full"> 

                     <button 
                        v-if="agentStore.agentActive?.model?.name == 'GPT 4 128k'"
                        @click="triggerFileInput"
                        class="audio_btn flex h-[36px] ms-3 shrink-0 items-center justify-center rounded-lg">
                        <MonoAddFile class="text-slate-500" />
                        <input class="hidden" ref="fileInput" type="file" @change="handleFileChange" accept="image/*" />
                     </button>
                        
                     <div class="flex min-w-0 flex-1 flex-col">    
                       
                        
                        <textarea @keydown.enter.stop.prevent="sendMessage" v-model.trim="chatStore.currentMessage" 
                           :style="{ height: textareaHeight }" 
                           rows="1"
                           @input="auto_height($event.target)"  
                           ref="inputMessage"                          
                           class="msg_input  block w-full rounded-l-lg border-0 ring-0 
                           pl-3 pr-2 text-base ring-0 placeholder:text-base placeholder:font-normal 
                           focus:border-0 focus:outline-0 focus:ring-0 "
                           placeholder="Digite sua mensagem..." 
                           >
                        </textarea>

                     </div>
                     
                     <div class="flex mr-3  gap-2 items-end"> 

                        <button
                           class= "audio_btn flex h-[36px]  shrink-0 items-center hover:bg-gray-200 rounded-md p-2 justify-center rounded-lg" >
                           <MonoMicrophone class="h-6 text-slate-500" 
                           :class="{ 'cursor-not-allowed text-red-500': isRecording }" 
                           @click="showRecordsAudio = !showRecordsAudio"
                           />
                        
                        </button>
               

                        <button  @click.stop="sendMessage" :style="backgroundColor" :disabled="!chatStore.currentMessage || chatStore.isLoading"
                           class=" flex h-[36px] w-[37px] shrink-0 items-center justify-center rounded-lg">
                           <MonoSend class="h-5 text-white" />
                        </button>

                     </div>

                  </div>
               </div>

               <div class="p-4" v-if="!agentStore.agentActive.available">
                  ⚠️ Desculpe pelo inconveniente! No momento, nossos serviços estão indisponíveis.
               </div>
               <span class="mt-4 text-sm text-[#71737c] text-center hidden">&copy; Sintia Chatbots 2024.</span>
            </div>
         </div>
      </div>

      <!--SHOW AVATAR-->
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

                  <!-- <span v-else class="text-center" :style="fontFamily">
                     ⚠️ Desculpe pelo inconveniente! No momento, nossos serviços estão indisponíveis.
                  </span> -->

               </div>
            </div>

            <div
               class="absolute top-[0.5px] cursor-pointer rounded-full border border-white bg-red-300 p-0.5"
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

.mb-53{
   margin-bottom: 53px;
}


div.imageselected {
   position: relative;
   width: 100%;  
   overflow: hidden;
   border-radius: 0.375rem;
   display: flex;
   justify-content: flex-start;
}

div.imageselected button.close-btn {
   position: absolute;
   top: 0.5rem;
   left: 5.5rem;
   z-index: 1;
   background-color: rgba(255, 255, 255, 0.8);
   border-radius: 50%;
   padding: 0.25rem;
   cursor: pointer;
   transition: color 0.2s;
}

.ImageFileSelected {
   width: 75px;
   margin-inline-start: 0.75rem;
   max-height: 75px;
   object-fit: contain;
}

textarea.msg_input {
   resize: none;    
   max-height: 25dvh;
   min-height: 40px;
}
.audio_controlls {
  display: flex;
  align-items: center;
  width: auto; /* ou defina uma largura fixa, se necessário */
}

.rating-btns {
  display: flex;
  justify-content: flex-start; /* Alinha os botões no início */
  gap: 10px; /* Espaçamento entre os botões */
  margin-top: 10px; /* Ajuste o espaço conforme necessário */
}

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


@media (max-width: 1023px) and (min-width: 768px) {
   .grid-rows-responsive {
        grid-template-rows: min-content minmax(0, 92vh);
        border-radius: 0;
    }
    .shared-agent-view{
   /* width: 90vw; */
  
   bottom:0;
   right: 0;
   max-width: 100%;
 }
}
@media (max-width: 767px) {
 .shared-agent-view{
   /* width: 90vw; */
  
   bottom:0;
   right: 0;
   max-width: 100%;
 }
 .grid-rows-responsive {
    grid-template-rows: min-content minmax(0, 90vh); /* Também ocupa a altura total da tela em celulares */
    border-radius: 0;
  }
  div#messages_list {
    max-height: 80vh;
}

}

</style>