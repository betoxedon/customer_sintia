// agentServiceApi.ts

import apiAuth from './apiAuth';
import { User,InitialFormUser,ApiCredetial } from '@/models/userModel';
import { ImageFile} from '@/models/agentModel';


export default {

    createUser(payload:InitialFormUser){
        return apiAuth.post('users/', payload) 
        .then(res => {           
            return res;
        })
        .catch(error => {
            throw error;
        });
    },

    updateUser(payload:User,userId:number){
        return apiAuth.patch(`users/${userId}/`, payload)
            .then(res => {
                return res;
            })
            .catch(error => {
                throw error;
            });
    },

    deleteUser(userId:number){
        return apiAuth.delete(`users/${userId}`)
            .then(res => {
                return res;
            })
            .catch(error => {
                throw error;
            });
    },

    getUserById(userId: number){
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
    signin(payload:ApiCredetial){
        return apiAuth.post('login/', payload) 
        .then(res => {
            return res;
        })
        .catch(error => {
            throw error;
        });
    },

    updateImageUser(formData:ImageFile,userId:number){        
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
