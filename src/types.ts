import {JwtPayload } from "jsonwebtoken"
import { Document, PaginateModel, PaginateOptions, PaginateResult, Types } from "mongoose"

export interface Iroom {
    roomName:string
    roomPassword:string
    _id:string
}
export interface IroomJWT extends Iroom, JwtPayload {

}
export interface IroomToken extends  JwtPayload, Iroom{
    
}
export interface Iconfess {
    confess:string
    roomName:string
    confessId:string
}
export interface IconfessDocument extends Document, Iconfess {}
export type IconfessPaginateResult = PaginateResult<Document<unknown, PaginateOptions, IconfessDocument> & IconfessDocument & {
    _id: Types.ObjectId;
}>
export interface IServerResponse {
    code:number
    context:string
    data?:any
}

export interface ServerToClientEvents {
    confess: (message:string) => void
    acceed: () => void
  }
  
  export interface ClientToServerEvents {
    hello: (data:string) => void;
  }
  
  export interface InterServerEvents {
    ping: () => void;
  }
  
  export interface SocketData {
    name: string;
    age: number;
  }
