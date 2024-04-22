export type Session = {
    bot: number
    uuid?: string
    id: number
    user: number
    messages: Array<string>   
 }
 

 export type SessionCreate = {
    bot: string
 }
 