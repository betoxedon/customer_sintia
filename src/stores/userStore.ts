import { User, UpdateUser,Credential,InitialFormUser } from '@/models/userModel'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import userApi from '@/services/userServiceApi'
import Axios from 'axios'
const { VITE_LOCAL_BASE_URL } = import.meta.env
// import { useInterfaceStore } from '@/stores/interfaceStore';
import { userSchema } from '@/models/userModel'
import { setInitialStore } from '@/services/handleStore'
import type { ImageFile } from '@/models/agentModel'


export const useUserStore = defineStore('user', () => {
   const user = ref({} as User)   

   const update = (supply: UpdateUser) => {
      Object.assign(user.value, supply)
   }

   const $reset = () => {
      user.value = {} as User
   }

   const setAuthUser = async (token:String) => {     
     
      const axiosLoggedIn = Axios.create({
         baseURL: `${VITE_LOCAL_BASE_URL}`,
         headers: {
           Authorization: `Token ${token}`
         }
       })
       return axiosLoggedIn.get('users/me').then(async (res) => {
         const user = res.data;
         const userParsed = userSchema.parse(user);

         update(userParsed);

         localStorage.setItem('uid', JSON.stringify(user.id));
         localStorage.setItem('apiToken', JSON.stringify({ token: user.token }));
                  
         await setInitialStore(userParsed);
                       
       }).catch((error) => {
         console.error(error);
         throw error;
       })

  };

   const login = async (payload:Credential) => {

      try {
         const modifiedPayload = {
             username: payload.email, // Altera email para username
             password: payload.password // Mantém a senha inalterada
         };
                  
         const res = await userApi.signin(modifiedPayload);

         localStorage.setItem('apiToken', JSON.stringify({ token: res.data.token }));
         
         if (res.data.token){
            await setAuthUser(res.data.token); 
           }
         return res;
      } catch (error) {
            console.error(error);
            throw error;
      }
   }

   const signup = async (payload: InitialFormUser) => {
      try {
        const res = await userApi.createUser(payload);
        await setAuthUser(res.data.token);
        return res;
      } catch (error) {
        console.error(error);
        throw error;
      }
    };

   const getUserById = async (userId:number) =>{
      
      return userApi.getUserById(userId).then((res)=>{
         return res
      }).catch((error) => {
         console.error(error);
         throw error;
       })
     
   }

   const updateUserPicture  = async (payload:ImageFile,userId:number) =>{
      
      let form_data = new FormData();
      form_data.append('profile_picture', payload);
      
      return userApi.updateImageUser(form_data,userId).then((res)=>{
         const user = res.data;
         const userParsed = userSchema.parse(user);
         update(userParsed);
         return res
      }).catch((error) => {
         console.error(error);
         throw error;
       })
     

   }

   return {
      user,
      update,
      $reset,
      login,
      setAuthUser,
      getUserById,
      updateUserPicture,
      signup
   }
})
