
import apiAuth from './apiAuth';

export default {

        getMaterials(botId: string,){
            return apiAuth.get(`/chatbots/${botId}/all_materials/`) 
            .then(res => {
                console.log("materials", res.data)
                return res.data;
            })
            .catch(error => {
                throw error;
            });
        },
    
        createMaterial(botId: string, type:string, value:string | File){

            const fomdata = new FormData();
            const typeName = type

            const config = {
                headers: {
                    'Content-Type': 'application/json'
                },
                //onUploadProgress: progressEvent => console.log(progressEvent.loaded)

            };

            fomdata.append('type', type);
            fomdata.append(typeName, value);

            if (value !== null && value !== undefined && typeof value === 'object'){           
                config.headers = {              
                    'Content-Type': 'multipart/form-data'           
                };    
            }
        
            console.log(config)
            console.log(fomdata)
            return apiAuth.post(`/chatbots/${botId}/add_material/`, fomdata, config) 
            .then(res => {
                return res;
            })
            .catch(error => {
                throw error;
            });
        },
        
        updateMaterial(id:number, type:string, value:string){
            
            const payload = {
                id:id,
                type:type,
                value:value
            }
    
            return apiAuth.put('materials/', payload) 
            .then(res => {
                return res;
            })
            .catch(error => {
                throw error;
            });
        },
    
        deleteMaterial(botId:string, url:string){
            return apiAuth.delete(`/chatbots/${botId}/delete_material/`, {data: {url: url}}) 
            .then(res => {
                return res;
            })
            .catch(error => {
                throw error;
            });
        },

        deleteAllMaterials(botId:string){
            return apiAuth.delete(`/chatbots/${botId}/delete_all_materials/`) 
            .then(res => {
                return res;
            })
            .catch(error => {
                throw error;
            });
        }


}