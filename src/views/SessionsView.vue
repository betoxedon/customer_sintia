<script setup lang="ts">

    import SideBar from '@/components/sidebars/SideBar.vue'
    import { useRouter } from 'vue-router'
    import {computed, ref,onMounted} from 'vue'
    import DatePicker from 'primevue/datepicker';
    import InputText from 'primevue/inputtext';
    import Paginator from 'primevue/paginator';
 
    import { useAgentStore } from '@/stores/agentStore'
    import { useUserStore } from '@/stores/userStore'

    const router = useRouter()
    const userStore = useUserStore()
    const agentStore = useAgentStore()
    const botId = ref<string>()
   

    onMounted(() => {
        const params = router.currentRoute.value.params

        if (params.id) {
         console.log('id', params.id)
         botId.value = params.id as string
        }

        console.log(agentStore.agentActive)
        agentStore.getSessionsByBot(Number(botId.value)).then((res)=>{
            console.log('getSessionsByBot')
            console.log(res)
        })

        if (botId.value) {
         agentStore.getAgentById(botId.value, userStore.user.id.toString()).then(() => {
            console.log('agent', agentStore.agentActive)
         }).catch((error) => {
            console.log('error', error)
            router.push({ name: 'agent' })
            
         })
        
      }

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



</script>

<template>
     <main class="main_home">
        <SideBar />     

        <div class="main-inner ">

            <div class="main-top">
                <div class="title">
                <a href="/agente" class="back">
                <ion-icon name="arrow-back-outline"></ion-icon>
                
                </a>
                <span class="container-inner page_title">Conversas</span>
                </div>
            </div>

            <div class="main-core gap-y-12 pt-0" >

                <div class="flex h-screen p-8 max-h-[820px]">

                    <div class="w-screen lg:w-1/3 p-6 rounded-3xl bg-white shadow-lg overflow-hidden flex flex-col" >

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
                            
                            <div v-for="(session) in agentStore.sessions" 
                            class="conversation-card flex justify-between items-center gap-3 p-4 border-b border-gray-300"
                            @click="selecSession(session.id)"
                            :class="{'bg-blue-300':agentStore.sessionActive && agentStore.sessionActive.id == session.id}"
                            >
                                
                                <div class="flex gap-2">
                                    <MonoLogo  class=" w-6 h-6 object-cover inline-block text-white bg-blue-300 rounded-full" />
                                <span class="font-bold">Conversa {{ session?.uuid?.substring(0, 4) }}</span>

                                </div>
                                <div>
                                    <span class="text-gray-500 text-xs">{{ session.created_on }}</span>
                                </div>

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
                            <img src="../assets/../Img/select_conversation.svg" alt="selecione uma converesa" style="width: 333.53px;">
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
                                    <img src="@/assets/Img/no_messages.svg" alt="Nenhuma mensagem" style="width: 136px;">
                                    <span class="col-span-2 mb-4 mt-1 place-self-center rounded-lg px-4 py-0.5 font-semibold">Nenhuma mensagem </span>

                                </div>
                            </div>
                                    

                            <div v-for="message in agentStore.sessionActive?.messages" :key="message.id">

                                <!--User-->
                                <div  class="mb-[22px] col-span-full grid grid-cols-[minmax(0,_90%)] justify-end gap-x-2 ">
                                    
                                    <div class="flex gap-2 justify-end">
                                        
                                        <div class="flex flex-col justify-end"> 
                                            <span 
                                                class="break-words relative  grid place-self-end rounded-2xl rounded-tr-none bg-surface-30 px-3 py-1.5 text-base before:bg-surface-30">
                                                {{ message.request }}
                                                
                                                
                                                <!-- <div v-if="message.image_file" class="mt-3">
                                                    <img  :src="getUlrImage(message.image_file)" class="w-64 h-64 object-cover rounded-2xl" />
                                                </div> -->
                                                
                                            </span>
                                            <span class="time-msg text-end text-xxs text-gray-500 leading-none mt-1 mr-1">{{ message.created_on }}</span>
                                        </div>
                                        
                                        <div class=" flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-white">
                                            <MonoUser  class="h-10 w-10 text-slate-500"/>
                                        </div>

                                        <!-- <audio  class="audio_controlls user" v-else :src="message.audio_file" controls></audio> -->
                                        <!-- <AudioPlayer 
                                        class="audio_controlls" 
                                        type="user"
                                        backgroundColor="#e7e9f1"
                                        :duration="message.duration"
                                        :color="agentStore.agentActive?.color"
                                        :audioSource="message.audio_file" v-else />      -->
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
                                    
                                
                                    <div class="">                          
                                                            
                                        <vue-markdown                                                 
                                            class="bot_message_markdown bot_message break-words grid place-self-start self-start rounded-2xl rounded-tl-none px-3 py-1.5 text-base text-white"
                                            :source="message?.response"
                                            :style="backgroundColor"                               
                                            :options="{breaks: true, linkify: true, typographer: false, html:true,xhtmlOut:true}">
                                            >
                                        </vue-markdown>         
                                        <span class="time-msg text-start text-xxs text-gray-500 leading-none mt-1 mr-1">{{ message.created_on }}</span>

                                    <!--Sources-->       
                                    <!-- <div class="flex mt-4 gap-2 sources bg-white mb-[12px] items-center overflow-x-auto"
                                    v-if="message.sources && message.sources.length > 0 && message.sources[0] != '' " >
                                        <span>Sources: </span>
                                        <a :href="source" target="_blank" v-for="(source, index) in message.sources" :key="index" class="bg-blue-300 flex gap-2 items-center rounded">
                                            <MonoLink class="h-4 w-4" />
                                            <span >
                                                <span>{{ truncateText(source,20) }}</span> 
                                            </span>
                                        </a>
                                    </div> -->

                                    </div>
                                

                                </div>
        
                            </div>

                        
                        </div>
                    
                    </div>
                </div>
                
            </div>
            
            
        </div>

    </main>
  
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

</style>