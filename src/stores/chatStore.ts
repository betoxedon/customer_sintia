import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AxiosError } from 'axios';
import messageApi from '@/services/messageServiceApi'
import sessionApi from '@/services/sessionServiceApi'
import { Session,SessionCreate } from '@/models/sessionModel'


export const useChatStore = defineStore('chat', () => {

    
    const sessionActive = ref()
    const isLoading = ref(false)
    const currentMessage = ref('')
    const imageFile = ref()
    const currentUrlAudio = ref('') //variavel que armazena o audio gravado
    const currentAudioFile = ref()
    //variavel que verifica se foi gravado em audio
    const isAudioRecorded = ref(false)
    const durationAudio = ref(0) //variavel que armazena a duração do audio gravado
    const durationRecorded = ref(0) //variavel que armazena a duração do audio gravado

    const startSession = async (botId:string) => {

        isLoading.value = true

        const data = {
            bot:botId
        }
        //const storageSession = JSON.parse(localStorage.getItem('currentSession')) || null
        const storageSessionString = localStorage.getItem('currentSession');
        const storageSession = storageSessionString ? JSON.parse(storageSessionString) as Session : null;

        if (storageSession) sessionActive.value = storageSession
        
        if (!sessionActive.value || sessionActive.value.bot != botId){
          
            try {
                const newSession = await createSession(data)
                sessionActive.value = newSession
                localStorage.setItem('currentSession', JSON.stringify(sessionActive.value))

            } catch (error) {
                console.error('Erro ao iniciar a sessão:', error)
            }
        }
        isLoading.value = false
    }

    const createSession = async (payload:SessionCreate) => {
        try {
            isLoading.value = true
            const res = await sessionApi.createSession(payload)
            isLoading.value = false
            localStorage.setItem('currentSession', JSON.stringify(res.data))
            return res.data
        } catch (error) {
            console.error('Erro ao criar a sessão:', error)
            throw error
        }
    }

    const sendMessage = async (request:string) => {
        
        if (!sessionActive.value) {
            console.log(request)
            console.error('Não há uma sessão ativa para enviar mensagem.')
            return
        }

        try {
            // Adiciona a mensagem enviada à sessão ativa            

            sessionActive.value.messages.push({ 
                type: 'user',
                content: currentMessage.value, 
                audio_file:currentUrlAudio.value,
                duration:durationRecorded.value,
                image_file:imageFile.value
                })

            currentMessage.value = '' 
            currentUrlAudio.value = '' //reseta a variavel de audio gravado

            const __imageFile = imageFile.value

            imageFile.value = null
            
            console.log(isAudioRecorded.value)
            const response = await messageApi.createMessage(
                sessionActive.value.id, 
                request, 
                currentAudioFile.value,
                __imageFile,
                isAudioRecorded.value,
                
            )
           
            currentAudioFile.value = ''
            
            //para cada quebra de linha, adicionar uma nova mensagem

            //nesses casos a font só é adicionada na ultima mensagem e quando o conteudo é vazio a mensagem não é adicionada

            // const responseArray = response.data.response.split('\n\n')
            
            // for (let i = 0; i < responseArray.length; i++) {
            //     if (responseArray[i] != ''){
                    
            //         if (i == responseArray.length - 1){ //se for a ultima mensagem
            //             sessionActive.value.messages.push(
            //                 {   id: response.data.id,
            //                     type: 'bot', 
            //                     content: responseArray[i],
            //                     sources:response.data?.sources.split(', ') || []
            //                 }
            //             )
            //         }
            //         else{

            //             sessionActive.value.messages.push(
            //                 {   id: response.data.id,
            //                     type: 'bot', 
            //                     content: responseArray[i],
                                
            //                 }
            //             )
            //         }
            //     }
            // }
           
            //adidionar request_file no ultimo elemento da mensagem da sessão
            if (response.data.request_file){
                sessionActive.value.messages[sessionActive.value.messages.length - 1].audio_file = response.data.request_file
            }

            //adiciona a resposta do bot na sessão ativa
             sessionActive.value.messages.push(
                 {   id: response.data.id,
                     type: 'bot', 
                     content: response.data.response,
                     sources:response.data?.sources.split(', ') || [],
                     audio_file:response.data?.audio_file || null,
                     is_audio_recorder:isAudioRecorded.value,
                     duration:response.data?.audio_file_duration || 0
                 }
            )
            
            // Atualiza a sessão ativa no localStorage
            localStorage.setItem('currentSession', JSON.stringify(sessionActive.value))
            
        } catch (error) {
            // Verifique se o erro é do tipo AxiosError, por exemplo
            if (error instanceof AxiosError && error.response) {
              const data_error = error.response.data as { error?: string };
          
              if (data_error?.error === 'Não há créditos suficientes') {
                // Adiciona a resposta do bot na sessão ativa
                sessionActive.value.messages.push({
                  id: sessionActive.value.messages.length + 1,
                  type: 'bot',
                  content: 'Nos desculpe pelo inconveniente, mas no momento nossos serviços estão indisponíveis.',
                  sources: [],
                  audio_file: null,
                  is_audio_recorder: false,
                  duration: 0,
                });
              }
          
              console.log(data_error);
            } else {
              console.error('Erro desconhecido:', error);
            }
            sessionActive.value.messages.push({
                id: 'error' + sessionActive.value.messages.length + 1 ,
                type: 'bot',
                content: 'Desculpe, ocorreu um problema ao processar sua solicitação. Por favor, tente novamente mais tarde.',
                sources: [],
                audio_file: null,
                is_audio_recorder: false,
                duration: 0,
              });
            console.error('Erro ao enviar mensagem:', error);
        }
    }
    const updateMessages = async () => {
        if (!sessionActive.value) {
            console.error('Não há uma sessão ativa para atualizar as mensagens.')
            return
        }

        try {
            // Obter a lista atualizada de mensagens da sessão do servidor
            const updatedMessages = await sessionApi.getSessionMessages(sessionActive.value.id)
            
            // Atualizar as mensagens na sessão ativa localmente
            sessionActive.value.messages = updatedMessages

            // Atualizar a sessão ativa no localStorage
            localStorage.setItem('currentSession', JSON.stringify(sessionActive.value))
        } catch (error) {
            console.error('Erro ao atualizar mensagens:', error)
            // Tratar o erro conforme necessário
        }
    }
    
    const rateMessage = async (rate:boolean, messageId:number) => {
        try {
            await messageApi.RatingMessage(rate, messageId)
            // Atualizar a mensagem avaliada da sessão ativa 
            const message = sessionActive.value.messages.find((m:any) => m.id === messageId)
            if (message) message.rating = rate

            // Atualizar a sessão ativa no localStorage
            localStorage.setItem('currentSession', JSON.stringify(sessionActive.value))

        } catch (error) {
            console.error('Erro ao avaliar mensagem:', error)
            // Tratar o erro conforme necessário
        }
    }

    return {
        sessionActive,
        startSession,
        createSession,
        sendMessage,
        updateMessages,
        isLoading,
        currentMessage,
        currentUrlAudio,
        currentAudioFile,
        rateMessage,
        isAudioRecorded,
        durationAudio,
        durationRecorded,
        imageFile
     }
  })