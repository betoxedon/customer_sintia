// agentServiceApi.ts

import apiAuth from './apiAuth';

export default {

    createSession(payload){
        //payload = {bot:1}
          return apiAuth.post('sessions/', payload) 
            .then(res => {
                return res;
            })
            .catch(error => {
                throw error;
            });
    },

    getSession(){        
          return apiAuth.get('sessions/') 
            .then(res => {
                return res;
            })
            .catch(error => {
                throw error;
            });
    },
    getSessionMessages(sessionId){
        return apiAuth.get(`sessions/${sessionId}`) 
            .then(res => {
                return res;
            })
            .catch(error => {
                throw error;
            });
    }
}
