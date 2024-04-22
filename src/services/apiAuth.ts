// apiAuth.ts

import axios, { AxiosInstance } from 'axios';
const { VITE_LOCAL_BASE_URL } = import.meta.env


// Crie uma instância do axios
const api: AxiosInstance = axios.create({
   baseURL:VITE_LOCAL_BASE_URL

});



api.interceptors.request.use(async config => {
   
   const apiTokenStorage = localStorage.getItem('apiToken')
   const apiToken  = apiTokenStorage ? JSON.parse(apiTokenStorage) : null;

      if (config.headers && config.headers['Content-Type']) {
         config.headers['Content-Type'] = config.headers['Content-Type'];
      } else {
            // Caso contrário, usa o valor padrão 'application/json'
            config.headers['Content-Type'] = 'application/json';
      }


      if (apiToken){
         config.headers['Authorization'] = `Token ${apiToken.token}`;
      }

   return config
})


export default api; // Exporta api como um objeto padrão
