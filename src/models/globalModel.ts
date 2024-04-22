import { z } from 'zod'

const emailSchema = z.string().email().min(10).max(45)
export const forgotPasswordSchema = z.object({
   email: emailSchema,
})
export type ForgotPassword = z.infer<typeof forgotPasswordSchema>
export type Email = z.infer<typeof emailSchema>

const websiteSchema = z.string().min(8).max(255)
export const trainingAiByWebsiteSchema = z.object({
   website: websiteSchema,
})
export type TrainingAiByWebsite = z.infer<typeof trainingAiByWebsiteSchema>
export type Website = z.infer<typeof websiteSchema>

const maxFileSize = 1000 * 1000 * 2
const acceptedImageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png']
export const imageFileSchema = z
   .any()
   .refine((files) => {
      return files?.imageFile?.size <= maxFileSize
   }, `2MB no máximo.`)
   .refine(
      (files) => acceptedImageMimeTypes.includes(files?.imageFile?.type),
      'Extensões aceitas .jpg, .jpeg, .png.',
   )
export type ImageFile = z.infer<typeof imageFileSchema>

//

export const colorSchema = z.record(
   z.object({ name: z.string(), value: z.string() }),
)
export const colorsSchema = z.record(colorSchema)
export type Color = z.infer<typeof colorSchema>
export type Colors = z.infer<typeof colorsSchema>
export const fontFamilySchema = z.record(
   z.object({ name: z.string(), value: z.string() }),
)
export const fontFamiliesSchema = z.record(fontFamilySchema)
export type FontFamily = z.infer<typeof fontFamilySchema>
export type FontFamilies = z.infer<typeof fontFamiliesSchema>
export const screenSideSchema = z.record(
   z.object({ name: z.string(), value: z.string() }),
)
export const screenSidesSchema = z.record(screenSideSchema)
export type ScreenSide = z.infer<typeof screenSideSchema>
export type ScreenSides = z.infer<typeof screenSidesSchema>

export const imageUrlSchema = z.string().default('')
export const userRolesSchema = z.record(z.boolean())

export const confirmationDataSchema = z.object({
   message: z.string().min(5).max(100),
   action: z
      .enum(['handleCancelForm', 'handleDeleteAgent', 'handleSignOut'])
      .optional(),
   param: z.string().or(z.number()).optional(),
})
export type ImageUrl = z.infer<typeof imageUrlSchema>
export type UserRoles = z.infer<typeof userRolesSchema>
export type ConfirmationData = z.infer<typeof confirmationDataSchema>

// const userIdSchema = z.string().min(20).max(24)
// const planIdSchema = z.string().min(20).max(24)

//type DocId = z.infer<typeof docIdSchema>
