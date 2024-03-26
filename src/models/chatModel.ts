import { z } from 'zod'
import { setNowUtcUnix } from '@/utils'
const now = setNowUtcUnix()

const createdAtSchema = z.number().default(now)
const docIdSchema = z.string().min(20).max(24)
const ownerActionIdSchema = z.string().min(20).max(24)

const actionSchema = z.object({
   time: z.number().default(now),
   ownerAction: z.enum(['user', 'agent']),
   message: z.string().min(1).max(255),
   ownerActionId: ownerActionIdSchema.nullable().default(null),
})

const chatActionSchema = z.object({
   createdAt: createdAtSchema,
   docId: docIdSchema,
   action: actionSchema,
})

type Action = z.infer<typeof actionSchema>
type ChatAction = z.infer<typeof chatActionSchema>

export { actionSchema, chatActionSchema }
export type { Action, ChatAction }
