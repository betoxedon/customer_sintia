// agentServiceApi.ts

import apiAuth from './apiAuth';

export default {

    createUser(payload){
        return apiAuth.post('users/', payload) 
        .then(res => {
            return res;
        })
        .catch(error => {
            throw error;
        });
    },

    updateUser(payload,userId){
        return apiAuth.patch(`users/${userId}/`, payload)
            .then(res => {
                return res;
            })
            .catch(error => {
                throw error;
            });
    },

    deleteUser(userId){
        return apiAuth.delete(`users/${userId}`)
            .then(res => {
                return res;
            })
            .catch(error => {
                throw error;
            });
    },

    getUserById(userId){
        return apiAuth.get(`users/${userId}`)
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

    getUsers(){
        return apiAuth.get(`users/`)
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
    getUser(){
        return apiAuth.get(`users/me`)
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

    //Auth
    signin(payload){
        return apiAuth.post('login/', payload) 
        .then(res => {
            return res;
        })
        .catch(error => {
            throw error;
        });
    },
    updateImageUser(formData,userId){
        
        // Configuração do cabeçalho para o tipo de conteúdo
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };
        return apiAuth.patch(`users/${userId}/`, formData, config)        
            .then(res => {
                return res;
            })
            .catch(error => {
                throw error;
            });
    },

}
