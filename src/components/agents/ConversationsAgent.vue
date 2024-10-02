<script setup lang="ts">

    import {computed, ref,onMounted} from 'vue'
    import DatePicker from 'primevue/datepicker';
    import InputText from 'primevue/inputtext';
    import Paginator from 'primevue/paginator';
 
    import { useAgentStore } from '@/stores/agentStore'
    import AnimLoadingBtn from '../icons/AnimLoadingBtn.vue';
    //import { useUserStore } from '@/stores/userStore'
    import AudioPlayer from '@/components/player/AudioPlayer.vue' 
    
   //const userStore = useUserStore()
    const agentStore = useAgentStore()
    const loadingSessions = ref(false)

    onMounted(() => {
       
        console.log(agentStore.agentActive)
        loadingSessions.value = true
        agentStore.getSessionsByBot(Number(agentStore?.agentActive?.id)).then((res)=>{
            loadingSessions.value = false
            console.log('getSessionsByBot')
            console.log(res)
        })

    
    })

    const backgroundColor = computed(() => {
      if(agentStore.agentActive?.color && agentStore.agentActive?.color.includes('background-color:')){
         return agentStore?.agentActive?.color
      }else{
         return 'background-color:'+ agentStore.agentActive?.color+';'  
      }
   })

    const welcomeMessage = computed(() => {

        if (agentStore.agentActive?.welcome_message) {
        return agentStore.agentActive?.welcome_message
        }      
        return 'Olá!👋 Como posso te ajudar?'
    })

    const selecSession = (id: number) => {
        agentStore.selectSession(id)
    }

    const truncateText = (text: string, length: number) => {
      if (text.length > length) {
         return text.slice(0, length) + '...'
      }
      return text
   }

   const showTextVersion = (is_audio_recorder?:boolean) => {

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

</script>

<template>
    
    <div class="main-core my-container pt-0">

        <div class="flex items-center h-screen p-8 max-h-[40rem] md:p-6">

            <div class="w-screen h-full lg:w-1/3 p-6 rounded-3xl bg-white shadow-lg overflow-hidden flex flex-col" >

                <form class="mb-3">

                                                
                        
                    <div class="w-full">
                        <InputText class="w-full"  placeholder="Pesquisar conversas" id="username" v-model="agentStore.filterParams.term" />
                    </div>
                            
                    
                    
                    <div class="flex gap-3 mt-3">
                        <DatePicker class="bg-white-300" placeholder="Data de início" v-model="agentStore.filterParams.start_date" showIcon fluid iconDisplay="input"  dateFormat="dd/mm/yy" />
                        <DatePicker class="bg-white-300" placeholder="Data final" v-model="agentStore.filterParams.end_date" showIcon fluid iconDisplay="input"  dateFormat="dd/mm/yy" />

                    </div>

                </form>



                <div class="rounded conversation-list flex-grow overflow-auto shadow-lg">
                    <div v-if="loadingSessions" class="flex justify-center items-center h-full">
                        <AnimLoadingBtn class="h-10"/>
                    </div>
                    <div v-else-if="agentStore.sessions && agentStore.sessions.length > 0" v-for="(session) in agentStore.sessions" 
                        class="conversation-card flex justify-between items-center gap-3 p-4 border-b border-gray-300"
                        @click="selecSession(session.id)"
                        :class="{'bg-blue-300': agentStore.sessionActive && agentStore.sessionActive.id == session.id}">
                        <div class="flex gap-2">
                            <MonoLogo class="w-6 h-6 object-cover inline-block text-white bg-blue-300 rounded-full" />
                            <span class="font-bold">Conversa {{ session?.uuid?.substring(0, 4) }}</span>
                        </div>
                        <div>
                            <span class="text-gray-500 text-xs">{{ session.created_on }}</span>
                        </div>
                    </div>
                    <div v-else class="flex justify-center items-center h-full">
                        <span>Nenhuma sessão disponível</span>
                    </div>
                </div>

                <div class="mt-2">
                    <Paginator :rows="agentStore.rowsPerPage" 
                    :pageLinkSize="3" 
                    template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                    :totalRecords="agentStore.totalRecords" :rowsPerPageOptions="[10]"
                    @page="agentStore.onPageChange" ></Paginator>
                </div>
            </div>

            <div class="messages w-screen h-full lg:w-2/3 rounded-3xl bg-white shadow-lg overflow-auto ml-8 flex flex-col p-6">
                
                <div class="p-4 rounded-lg mb-3" :style="backgroundColor">
                <span class="text-white font-bold ">{{agentStore?.agentActive?.name}}</span>
                </div>

                <div v-if="!agentStore.sessionActive" class=" h-full flex flex-col justify-center items-center gap-6 mt-3">
                    <!-- <img src="@/img/select_conversation.svg" alt="selecione uma converesa" style="width: 333.53px;"> -->
                    <SelectecChat class="h-[333px]" style="width: 333.53px;"/>

                    <span class="font-semibold">Selecione uma conversa para ver as mensagens</span>
                </div>


                <div v-else class="chat-history flex flex-col flex-grow h-0 pb-24 px-3 overflow-auto">
                
                
                    <!--DATA INICIAL-->
                    <span class="col-span-2 mb-4 mt-1 place-self-center rounded-lg bg-slate-400 px-4 py-0.5 text-white">
                        {{ agentStore.sessionActive.created_on }}
                    </span>  

                    <!--Welcome Message-->
                
                    <div v-if="agentStore.sessionActive?.messages && agentStore.sessionActive?.messages.length > 0"  class="col-span-full grid grid-cols-[min-content_77%] gap-x-2">
                        
                        <div
                            class="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-white">
                            <img
                            v-if="agentStore.agentActive.image_file"
                            :src="agentStore.agentActive.image_file"
                            class="w-full h-full object-cover " />
                            <MonoLogo v-else class="h-12 w-12 text-slate-500" />
                        </div>

                        <span
                            class="mb-[22px] mt-3 grid place-self-start self-start rounded-2xl rounded-tl-none px-3 py-1.5 text-base text-white"
                            :style="backgroundColor">
                            {{ welcomeMessage }}
                        </span>
                    </div>

                    <!--Sem mensagem ainda-->
                    <div v-else class="h-full ">
                        <div class="h-full flex flex-col justify-center items-center gap-3 mt-3">
                            <!-- <img src="@/img/no_messages.svg" alt="Nenhuma mensagem" style="width: 136px;"> -->
                            <NoMsg class="h-[136px]" style="width: 136px;"/>

                            <span class="col-span-2 mb-4 mt-1 place-self-center rounded-lg px-4 py-0.5 font-semibold">Nenhuma mensagem </span>

                        </div>
                    </div>
                            

                    <div v-for="message in agentStore.sessionActive?.messages" :key="message.id">

                        <!--User-->
                        <div  class="mb-[22px] col-span-full grid grid-cols-[minmax(0,_90%)] justify-end gap-x-2 ">
                            
                            <div class="flex gap-2 justify-end">
                                
                                <div class="flex flex-col justify-end"> 
                                    <div v-if="message?.request_file" class="">
                                        <AudioPlayer 
                                        v-if="message?.request_file"
                                    class="audio_controlls" 
                                    type="user"
                                    backgroundColor="#e7e9f1"
                                    :duration="message?.audio_file_duration"
                                    :color="agentStore?.agentActive?.color"
                                    :audioSource="message?.request_file" /> 
                                    <span class="text-sm mt-2">
                                        <strong> 📝Transcrição: </strong>
                                        "{{ message.request }}"
                                    </span>
                                    </div>

                                    <span  v-if="!message?.request_file"
                                        class="break-words relative  grid place-self-end rounded-2xl rounded-tr-none bg-surface-30 px-3 py-1.5 text-base before:bg-surface-30">
                                        {{ message.request }}
                                        
                                        
                                        <div v-if="message.image_file" class="mt-3">
                                            <img :src="message.image_file" class="w-64 h-64 object-cover rounded-2xl" />
                                        
                                        </div>
                                        
                                    </span>
                                    
                                    <span class="time-msg text-end text-xxs text-gray-500 leading-none mt-1 mr-1">{{ message.created_on }}</span>
                                </div>
                                
                                <div class=" flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-white">
                                    <MonoUser  class="h-10 w-10 text-slate-500"/>
                                </div>

                            </div>
                            
                        </div>
                    
                        <!--BOT-->
                        <div style="max-width:100%" class="mb-[22px] message-ballon col-span-full grid grid-cols-[min-content_77%] gap-x-2"> 
                        
                            <!-- BOT PICTURE-->

                            <div class="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-white">
                                <img
                                    v-if="agentStore.agentActive.image_file"
                                    :src="agentStore.agentActive.image_file"
                                    class="w-full h-full object-cover " />
                                    <MonoLogo v-else class="h-14 w-14 text-slate-500" />
                            </div>      
                            
                        
                            <div class="bot-msg"> 
                                
                                <vue-markdown    
                                    v-if="showTextVersion(message?.is_recording) || !message.audio_file"                                           
                                    class="bot_message_markdown bot_message break-words grid place-self-start self-start rounded-2xl rounded-tl-none px-3 py-1.5 text-base text-white"
                                    :source="message?.response"
                                    :style="backgroundColor"                               
                                    :options="{breaks: true, linkify: true, typographer: false, html:true,xhtmlOut:true}">
                                    >
                                </vue-markdown>   


                                <div v-else class="">
                                    
                                    <AudioPlayer 
                                        v-if="message.audio_file"
                                        class="audio_controlls"  
                                        type="bot"
                                        :backgroundColor="agentStore.agentActive?.color"
                                        color="#ffffff"
                                        :duration="message.audio_file_duration"
                                        :audioSource="message.audio_file"  /> 

                                        <span class="text-sm mt-2">
                                            <strong> 📝Transcrição: </strong>
                                            "{{ message.request }}"
                                        </span>

                                </div>     

                                

                                <div class="flex items-center ">
                                <span class="time-msg text-start text-xxs text-gray-500 leading-none mt-1 mr-1">{{ message.created_on }}</span>

                                <!--Rating-->

                                <div class="flex justify-start" v-if="message.id">

                                    <button 
                                    :disabled="message.rating === true"
                                    v-if="message.rating === true"
                                
                                    :class="{active: message.rating === true}"
                                    class="btn-raiting btn-like">
                                        <MonoLike class="h-4 w-4"/>
                                    </button>

                                    <button
                                    :disabled="message.rating === false"
                                    v-if="message.rating === false"
                                    :class="{active: message.rating === false}"
                                    class="btn-raiting btn-unlike">
                                    <MonoUnlike class="h-4 w-4"/>
                                    </button>
                                </div>

                            </div>

                                <!--Sources-->       
                                <div class="flex flex-col mt-4 gap-2 sources bg-white mb-[12px] overflow-x-auto"
                                    v-if="message.sources && message.sources.length > 0 && message.sources[0] != '' " >
                                    <span>Sources: </span>
                                    <a :href="source" target="_blank" v-for="(source, index) in message.sources" :key="index" class="bg-blue-300 flex gap-2 items-center max-w-[50%] rounded">
                                        <MonoLink class="h-4 w-4" />
                                        <span >
                                            <span>{{ truncateText(source,20) }}</span> 
                                        </span>
                                    </a>
                                </div>

                            </div>
                        

                        </div>

                    </div>

                </div>
            
            </div>
        </div>

    </div>

  
</template>

<style scoped>

.text-xxs{
    font-size: .75rem;
}

.conversation-card{
    cursor: pointer;
    border-radius: 4px;
}   
.conversation-list{
    display: flex;
    flex-direction: column;
}
.conversation-card:hover{
    background-color: #a5c3ff;
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

</style>