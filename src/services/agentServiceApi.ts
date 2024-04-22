// agentServiceApi.ts

import { ImageFile, ApiUpdateAgent,ApiCreateAgent } from '@/models/agentModel';
import apiAuth from './apiAuth';

export default {

    createAgent(payload:ApiCreateAgent){
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
    updateAgent(payload:ApiUpdateAgent,chatId:number){
        return apiAuth.patch(`chatbots/${chatId}/`, payload)
            .then(res => {
                return res;
            })
            .catch(error => {
                throw error;
            });
    },
    deleteAgent(chatId:string){
        return apiAuth.delete(`chatbots/${chatId}`)
            .then(res => {
                return res;
            })
            .catch(error => {
                throw error;
            });
    },
    getChatbot(chatId:number){
        return apiAuth.get(`chatbots/${chatId}`)
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

    getChatbotById(chatId:string,userId:string){
        return apiAuth.get(`chatbots/${chatId}/chatbotByid/?userId=${userId}`)
            .then(res => {
                if (res.data) {                    
                    return res.data;
                } else {
                    throw new Error('Resposta da API vazia');
                }
            })
            .catch(error => {
                
                if (error.response && error.response.status === 401) {
                    throw new Error('Não autorizado - Falha na autenticação');
                } else {
                    throw error;
                }
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

    updateImageAgent(formData:ImageFile,chatId: number){

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
