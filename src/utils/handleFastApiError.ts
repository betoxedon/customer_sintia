import type { FastApiError } from '@/models/serviceModel'

export const handleFastApiError = (err: FastApiError) => {
   let messageError = 'Erro. Por favor, tente novamente'
   if (err.response && err.response.data?.detail) {
      messageError = err.response.data.detail
   } else if (err.response && err.response.data?.message) {
      messageError = Object.values(err.response.data)[0][0]
   }
   return messageError
}
