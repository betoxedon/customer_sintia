import axios from 'axios'
const { VITE_FASTAPI_API } = import.meta.env

const fastApi = VITE_FASTAPI_API

export const updateTrainingByWebsite = async (url: string) => {
   if (!url.length) return
   const res = await axios.post(
      fastApi + '/get_website_links',
      {},
      {
         params: {
            url: url,
         },
      },
   )
   return res
}
