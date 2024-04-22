import { SessionCreate } from '@/models/sessionModel';

import apiAuth from './apiAuth';

export default {

    createSession(payload:SessionCreate){
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
    getSessionMessages(sessionId:number){
        return apiAuth.get(`sessions/${sessionId}`) 
            .then(res => {
                return res;
            })
            .catch(error => {
                throw error;
            });
    }
}
