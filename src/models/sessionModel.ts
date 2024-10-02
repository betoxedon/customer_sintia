
 export type Message = {
   id:number
   request: string
   response: string
   session: number
   created_on?: string
   rating?:boolean
   request_file?: string
   audio_file?: string
   duration?: string
   audio_file_duration?:number
   sources?:string
   image_file?: string
   is_recording?:boolean

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
 