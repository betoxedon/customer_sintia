import { z } from 'zod'
// solr
export const userCreatedSolrSchema = z.object({
   success: z.boolean(),
   url: z.string(),
   basicAuth: z.string(),
})
export type UserCreatedSolr = z.infer<typeof userCreatedSolrSchema>

// fastApi
const websiteSchema = z.string().min(8).max(255)
const trainingAiByWebsiteSchema = z.object({
   website: websiteSchema,
})
type TrainingAiByWebsite = z.infer<typeof trainingAiByWebsiteSchema>
type Website = z.infer<typeof websiteSchema>

const fastApiErrorSchema = z
   .object({
      response: z
         .object({
            data: z
               .object({
                  detail: z.string(),
                  message: z.string(),
               })
               .partial(),
         })
         .partial(),
   })
   .partial()
type FastApiError = z.infer<typeof fastApiErrorSchema>

export { trainingAiByWebsiteSchema }
export type { TrainingAiByWebsite, Website, FastApiError }
