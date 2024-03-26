import { z } from 'zod'
import { setNowUtcUnix } from '@/utils'
const now = setNowUtcUnix()

const createdAtSchema = z.number().default(now)
const updatedAtSchema = z.number().default(now)
const docIdSchema = z.string().min(20).max(24)
const planNameSchema = z.string().min(3).max(15)
const planValueSchema = z.number().min(0).max(1000)
const descriptionSchema = z.string().min(3).max(100)
const featuresSchema = z.object({
   agentsLimit: z.number().min(1).max(100),
   maxMonthlyMessages: z.number().min(1000).max(100000),
   maxMonthlyMessagesToLocaleString: z.string().optional(),
})

const initialPlanSchema = z.object({
   createdAt: createdAtSchema,
   updatedAt: updatedAtSchema,
   docId: docIdSchema,
   planName: planNameSchema,
   description: descriptionSchema,
   planValue: planValueSchema,
   features: featuresSchema,
})

const planSchema = initialPlanSchema.required({
   docId: true,
})

type InitialPlan = z.infer<typeof initialPlanSchema>
type Plan = z.infer<typeof planSchema>

export { initialPlanSchema, planSchema }
export type { InitialPlan, Plan }
