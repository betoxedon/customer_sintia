export const setUtcUnixToLocaleString = (utcUnix: number) => {
   const date = new Date(utcUnix * 1000)

   const dataString = new Intl.DateTimeFormat('pt-br', {
      day: 'numeric',
      month: 'numeric',
      year: '2-digit',
      hour12: false,
      timeZone: 'America/Sao_Paulo',
   }).format(date)

   return dataString
}
