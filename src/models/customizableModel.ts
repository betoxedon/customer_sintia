import { z } from 'zod'
import { setNowUtcUnix } from '@/utils'
const now = setNowUtcUnix()

const createdAtSchema = z.number().default(now)
const updatedAtSchema = z.number().default(now)
const docIdSchema = z.string().min(20).max(24)
const screenSideSchema = z.record(
   z.object({ name: z.string(), prop: z.string(), value: z.string() }),
)
const colorSchema = z.record(
   z.object({ name: z.string(), prop: z.string(), value: z.string() }),
)
const fontFamilySchema = z.record(
   z.object({ name: z.string(), prop: z.string(), value: z.string() }),
)

const screenSidesSchema = z.record(screenSideSchema)
const colorsSchema = z.record(colorSchema)
const fontFamiliesSchema = z.record(fontFamilySchema)

const customizableSchema = z.object({
   createdAt: createdAtSchema,
   updatedAt: updatedAtSchema,
   docId: docIdSchema,
   screenSides: screenSidesSchema,
   colors: colorsSchema,
   fontFamilies: fontFamiliesSchema,
})

type ScreenSides = z.infer<typeof screenSidesSchema>
type FontFamilies = z.infer<typeof fontFamiliesSchema>
type Customizable = z.infer<typeof customizableSchema>

export { screenSideSchema, colorsSchema, fontFamilySchema, customizableSchema }
export type { ScreenSides, FontFamilies, Customizable }
