export const setPlanExpiresUtcUnix = (
   planExpiresAt: number,
   days: number,
): number => {
   const daysInSeconds = days * 24 * 60 * 60
   return Math.floor(planExpiresAt + daysInSeconds)
}
