   import { z } from 'zod'
   import { setNowUtcUnix } from '@/utils'    
  
   const now = setNowUtcUnix()

   // [file]
   const maxFileSize = 1000 * 1000 * 2
   const acceptedImageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png']
   const imageFileSchema = z
      .any()
      .refine((files) => {
         return files?.imageFile?.size <= maxFileSize
      }, `2MB no máximo.`)
      .refine(
         (files) => acceptedImageMimeTypes.includes(files?.imageFile?.type),
         'Extensões aceitas .jpg, .jpeg, .png.',
      )

   // [initial]
   const nicknameSchema = z.string().min(3).max(15)

   //CHAT WEB CONVERSATION

   const sourcesSchema = z.number().default(3)

   const languageSchema = z.string().default('português brasileiro')
   const querySchema = z.string().default('Olá')

   const modelSchema = z.object({
      name: z.string(),
      id: z.number(), 

   });

   const typeSchema = z.object({
      name: z.string(),
      id: z.number(),
      
   });

   const toneSchema = z.object({
      name: z.string(),
      id: z.number(),
   
   });

   const voiceSchema = z.object({
      name: z.string(),
      id: z.number(),
      }
   ).optional()


   const promptSchema = z.string().min(5).max(1000)



   const audio_responseSchema = z.boolean().default(false)
      

   const temperatureSchema = z.number().min(0.0).max(1.0).default(0.3)

   //const api_keySchema = z.number().default(1)
   //const buscaSchema = z.number()
   //const identifierSchema = z.string().min(3).max(15)

   const materialCoreSchema = z.array(z.string()).nullable().default([])



   const agentInitialSchema = z.object({
      name: nicknameSchema,
      temperature:temperatureSchema,
      audio_response:audio_responseSchema,
      material_core:materialCoreSchema,
      model:modelSchema,
      tone:toneSchema,
      prompt:promptSchema,
      voice: voiceSchema,
      language:languageSchema,
      sources:sourcesSchema,
      query:querySchema,
      type:typeSchema   
   })



   // [additional]
   const createdAtSchema = z.number().default(now)
   const updatedAtSchema = z.number().default(now)
   const idSchema = z.number()   
   const welcomeMessageSchema = z
      .string()
      .min(3)
      .max(40)
      .default('Olá!👋 Como posso te ajudar?')


   const colorStyleSchema = z.string().max(255).default('')

   const fontFamilyStyleSchema = z.object({
      name: z.string(),
      id: z.number(), 
      property_value: z.string(),
   });     

   const screenSideStyleSchema = z.object({
      name: z.string(),
      id: z.number(),
      property_value: z.string(),
      
   });

   const userSchema = z.object({
      first_name: z.string(),
      last_name: z.string(),
      email: z.string(),
      email_verified: z.boolean(),
      id: z.number(),
      profile_picture: z.string().nullable().default(null),
      is_superuser: z.boolean(),
      token: z.string(),
   }).nullable().default(null)

   const imageUrlSchema = z.string().default('').nullable().optional()
   const allowedDomainsSchema = z.array(z.string()).default([])
   const agentAdditionalSchema = z.object({
      createdAt: createdAtSchema,
      updatedAt: updatedAtSchema,
      id: idSchema,
      //userId: userIdSchema,
      welcome_message: welcomeMessageSchema,
      color: colorStyleSchema,
      font: fontFamilyStyleSchema,
      side: screenSideStyleSchema,
      image_file: imageUrlSchema,
      allowedDomains: allowedDomainsSchema,
      user:userSchema

   })

   const agentSchema = z.object({
      ...agentInitialSchema.shape,
      ...agentAdditionalSchema.shape,
   })

   // [type]
   type ImageFile = z.infer<typeof imageFileSchema>
   type AgentInitial = z.infer<typeof agentInitialSchema>
   type AgentAdditional = z.infer<typeof agentAdditionalSchema>
   type Agent = z.infer<typeof agentSchema>

   export { agentInitialSchema, agentAdditionalSchema, agentSchema }
   export type { ImageFile, AgentInitial, AgentAdditional, Agent }

   export type Font = {
      id: number
      name: string
      property_value: string    
   }

   export type Side = {   
      id: number
      name: string
      property_value: string 
   }

   export type SelecObjects = {
      id: number
      name: string        
   }

   export type ApiCreateAgent = {    
      name: string
      temperature: number
      audio_response: boolean
      material_core: string | null; // Aceita null
      model: number
      tone: number
      prompt: string
      voice: number | undefined;
      language: string
      sources: number
      query: string
      type: number 
   }
   export type ApiUpdateAgent = {    
      name: string
      temperature: number
      audio_response: boolean
      material_core: string | null; // Aceita null
      model: number
      tone: number
      prompt: string
      voice: number | undefined;
      language: string
      sources: number
      query: string
      type: number  
      font: number
      side: number       
   }

   export type PropertyValue = string | { id: number; name: string; property_value: string; };

