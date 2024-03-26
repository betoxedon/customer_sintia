import { z } from 'zod'
import { setNowUtcUnix } from '@/utils'
const now = setNowUtcUnix()

const createdAtSchema = z.number().default(now)
const updatedAtSchema = z.number().default(now)
const emailSchema = z.string().email().min(10).max(45)
const firstNameSchema = z.string().min(3).max(30)
const lastNameSchema = z.string().min(3).max(30)
const passwordSchema = z.string().min(6).max(30)
const passwordConfirmationSchema = z.string().min(6).max(30)
const uidSchema = z.string().length(28)
const planIdSchema = z.string().nullable().default(null)
const isAdminSchema = z.boolean().default(false)
const emailVerifiedSchema = z.boolean().default(false)
const userSolrCreatedSchema = z.boolean().default(false)
const imagemUrlSchema = z.string().default('')

const docIdSchema = z.string().min(20).max(24)
const addDaysToPlanAtSchema = z.number().nullable().default(null)
const planExpiresAtSchema = z.number().nullable().default(null)
const monthlyMessagesUsedSchema = z.number().default(0)

export const initialFormUserSchema = z.object({
   email: emailSchema,
   firstName: firstNameSchema,
   lastName: lastNameSchema,
   password: passwordSchema,
   passwordConfirmation: passwordConfirmationSchema,
})
export type InitialFormUser = z.infer<typeof initialFormUserSchema>

export const initialUserSchema = initialFormUserSchema
   .extend({
      createdAt: createdAtSchema,
      updatedAt: updatedAtSchema,
      uid: uidSchema,
      planId: planIdSchema,
      isAdmin: isAdminSchema,
      emailVerified: emailVerifiedSchema,
      userSolrCreated: userSolrCreatedSchema,
      imageUrl: imagemUrlSchema,
   })
   .omit({
      password: true,
      passwordConfirmation: true,
   })
export type InitialUser = z.infer<typeof initialUserSchema>

export const credentialSchema = initialFormUserSchema.omit({
   firstName: true,
   lastName: true,
   passwordConfirmation: true,
})
export type Credential = z.infer<typeof credentialSchema>

export const userSchema = initialUserSchema.extend({
   docId: docIdSchema,
   addDaysToPlanAt: addDaysToPlanAtSchema,
   planExpiresAt: planExpiresAtSchema,
   monthlyMessagesUsed: monthlyMessagesUsedSchema,
})
export type User = z.infer<typeof userSchema>

export const updateUserSchema = userSchema.partial()
export type UpdateUser = z.infer<typeof updateUserSchema>
