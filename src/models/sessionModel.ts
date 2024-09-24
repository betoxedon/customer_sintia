
 export type Message = {
   id:number
   request: string
   response: string
   session: number
   created_on?: string
 }

 export type Session = {
   bot?: number
   uuid?: string
   id: number
   user: number
   messages?: Array<Message>   
   created_on?: string
}
 
 export type SessionsList = {
   uuid?: string
   id: number
   user: number
   messages?: Array<Message> 
   created_on: string

 }

 export type SessionCreate = {
    bot: string
 }
 