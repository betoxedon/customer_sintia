export const setStringToId = (param: string) => {
   return param
      .normalize('NFD')
      .replace(/\p{Mn}/gu, '')
      .replace(/[^a-zA-Z0-9]/g, '')
      .toLowerCase()
}
