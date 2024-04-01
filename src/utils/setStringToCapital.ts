const checkIsSkipped = (param: string) => {
   const skipPattern = /\b(sem|com|por|dos|das)\b/
   if (param.match(skipPattern)) {
      return true
   } else if (param.length < 3 && param.endsWith('.')) {
      return false
   } else if (param.length < 3) {
      return true
   } else {
      return false
   }
}

const capsFirst = (param: string) => {
   return param.charAt(0).toUpperCase() + param.slice(1)
}

const checkIsRomanNumerals = (param: string) => {
   const romanNumerals = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/gi
   const match = param.match(romanNumerals)
   if (!match) return false
   return true
}

export const setStringToCapital = (param: string) => {
   const toLowerCase = param.toLowerCase()
   const normalized = toLowerCase.replace(/[^\wÀ-ÿ\s[,.:;]]/g, '')
   const singleSpaceBetween = normalized.replace(/\s+/g, ' ')
   let stringSplitted = singleSpaceBetween.split(' ')
   const handleStringSplitted = () => {
      return stringSplitted.map((word) => {
         const hasHyphen = word.includes('-')
         const isRomanNumerals = checkIsRomanNumerals(word)
         const isSkipped = checkIsSkipped(word)
         if (hasHyphen) {
            stringSplitted = word.split('-')
            let words = stringSplitted.map((item) => {
               return capsFirst(item)
            })
            word = words.join('-')
         } else if (isRomanNumerals) {
            word = word.toUpperCase()
         } else if (!isSkipped) {
            word = capsFirst(word)
         }
         return word
      })
   }
   const textSplitted = handleStringSplitted()
   return textSplitted.join(' ')
}
