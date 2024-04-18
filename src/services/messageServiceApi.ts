// agentServiceApi.ts

import apiAuth from './apiAuth';

export default {

    createMessage(session,message){
        const payload = {
            request:message,
            session:session
        }

        return apiAuth.post('messages/', payload) 
        .then(res => {
            return res;
        })
        .catch(error => {
            throw error;
        });
    }
}
