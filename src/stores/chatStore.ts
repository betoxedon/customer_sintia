import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import messageApi from '@/services/messageServiceApi'
import sessionApi from '@/services/sessionServiceApi'



export const useChatStore = defineStore('chat', () => {

    
    const sessionActive = ref()
    const isLoading = ref(false)
    const currentMessage = ref('')

    const startSession = async (botId) => {

        isLoading.value = true
        const data = {
            bot:botId
        }
        const storageSession = JSON.parse(localStorage.getItem('currentSession')) || null
        
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

    const createSession = async (payload) => {
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

    const sendMessage = async (request) => {
        
        if (!sessionActive.value) {
            console.log(request)
            console.error('Não há uma sessão ativa para enviar mensagem.')
            return
        }

        try {
            // Adiciona a mensagem enviada à sessão ativa

            sessionActive.value.messages.push({ type: 'user', content: currentMessage.value })

            currentMessage.value = '' 
            const response = await messageApi.createMessage(sessionActive.value.id, request)
    
            
            sessionActive.value.messages.push({ type: 'bot', content: response.data.response })

            // Atualiza a sessão ativa no localStorage
            localStorage.setItem('currentSession', JSON.stringify(sessionActive.value))
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error)
            // Tratar o erro conforme necessário
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
 

    return {
        sessionActive,
        startSession,
        createSession,
        sendMessage,
        updateMessages,
        isLoading,
        currentMessage
     }
  })