import { userCreatedSolrSchema } from '@/models/serviceModel'
const { VITE_X_CONECTA_AUTH } = import.meta.env
import axios from 'axios'
const axiosSolr = axios.create({
   baseURL: 'https://webhook-n8n.dev.hopchat.com.br/webhook/',
})

export const createUserSolr = async (userId: string) => {
   console.log('tryCreateUserSolr')
   try {
      const { data } = await axiosSolr.post(
         '3fa58a41-e17e-4e60-8f89-c604241aed11',
         {
            user_id: userId,
         },
         {
            headers: {
               'Content-Type': 'application/json',
               'X-Conecta-Auth': VITE_X_CONECTA_AUTH,
            },
         },
      )
      const dataParsed = userCreatedSolrSchema.parse(data)
      return dataParsed
   } catch (error) {
      console.error(error)
   }
}
