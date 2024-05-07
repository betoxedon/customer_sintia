// agentServiceApi.ts

import apiAuth from './apiAuth';

export default {

    createMessage(session:number, message:string, request_file:File){

        const formData = new FormData()
        formData.append('request', message)     
        formData.append('session', session.toString());

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (request_file !== null && request_file !== undefined && typeof request_file === 'object'){           
            formData.append('request_file', request_file, request_file.name)
            config.headers = {              
                    'Content-Type': 'multipart/form-data'           
            };    
        }    
        
        // const payload = {
        //     request:message,
        //     session:session
        // }

        return apiAuth.post('messages/', formData, config) 
        .then(res => {
            return res;
        })
        .catch(error => {
            throw error;
        });
    },
    
    RatingMessage(rate:boolean, message:number){
        
        const payload = {
            rate:rate,
            message:message
        }

        return apiAuth.post('/messages/rate_message/', payload) 
        .then(res => {
            return res;
        })
        .catch(error => {
            throw error;
        });
    }
}
