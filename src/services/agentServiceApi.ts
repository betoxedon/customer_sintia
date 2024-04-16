// agentServiceApi.ts

import apiAuth from './apiAuth';

export default {

    createAgent(payload){
          return apiAuth.post('chatbots/', payload) 
            .then(res => {
                return res;
            })
            .catch(error => {
                throw error;
            });
    },
    getDataSources(){
        return apiAuth.get('chatbots/bot_data')
            .then(res => {
                if (res.data) {                    
                    return res.data;
                } else {
                    throw new Error('Resposta da API vazia');
                }
            })
            .catch(error => {
                // Trate qualquer erro que ocorra durante a chamada à API
                console.error(error);
                throw error;
            });
    },
    updateAgent(payload,chatId){
        return apiAuth.patch(`chatbots/${chatId}/`, payload)
            .then(res => {
                return res;
            })
            .catch(error => {
                throw error;
            });
    },
    deleteAgent(chatId){
        return apiAuth.delete(`chatbots/${chatId}`)
            .then(res => {
                return res;
            })
            .catch(error => {
                throw error;
            });
    },
    getChatbot(chatId){
        return apiAuth.get(`chatbot/${chatId}`)
            .then(res => {
                if (res.data) {                    
                    return res.data;
                } else {
                    throw new Error('Resposta da API vazia');
                }
            })
            .catch(error => {
                // Trate qualquer erro que ocorra durante a chamada à API
                console.error(error);
                throw error;
            });
    },

    getChatbots(){
        return apiAuth.get(`chatbots`)
            .then(res => {
                if (res.data) {                    
                    return res.data;
                } else {
                    throw new Error('Resposta da API vazia');
                }
            })
            .catch(error => {
                // Trate qualquer erro que ocorra durante a chamada à API
                console.error(error);
                throw error;
            });
    },

    updateImageAgent(formData,chatId){

        // Configuração do cabeçalho para o tipo de conteúdo

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };
        return apiAuth.patch(`chatbots/${chatId}/`, formData,config)
            .then(res => {
                return res;
            })
            .catch(error => {
                throw error;
            });
    },

}
