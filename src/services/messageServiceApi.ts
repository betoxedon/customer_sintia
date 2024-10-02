// agentServiceApi.ts

import apiAuth from './apiAuth';

export default {

    createMessage(session:number, message:string, request_file:File,image_file:File, is_recording?:boolean){

        const formData = new FormData()
        formData.append('request', message)     
        formData.append('session', session.toString());
        
         // Converter o booleano para string 'true' ou 'false'
        if (is_recording !== undefined) {
            formData.append('is_recording', is_recording ? 'true' : 'false');
        }

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        console.log('image_file', image_file)

        if (image_file !== null && image_file !== undefined && typeof image_file === 'object'){           
            formData.append('image_file', image_file, image_file.name)
            config.headers = {              
                    'Content-Type': 'multipart/form-data'           
            };    
        }

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
