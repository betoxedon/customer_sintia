export const setNowUtcUnix = (): number => {
   const utcTime = new Date()
   const unixTimestamp = utcTime.getTime() / 1000
   return Math.floor(unixTimestamp)
}
