import jwt from 'jsonwebtoken'
import { Iroom, IroomJWT, IroomToken } from '../types';
import { room } from './room';
export class auth_token {
    static generate(room:Iroom):string | null{
        try{
            let token = jwt.sign(room,process.env.SECRET_APP_KEY || "secret")
            return token
        }
        catch {
            return null
        }
    }
    static async isValid(token:string):Promise<IroomJWT | null>{
        try{
            let decoded = jwt.verify(token,process.env.SECRET_APP_KEY || "secret") as IroomToken
            let isRoomVaild =  await room.roomIsValid(decoded.roomName,decoded.roomPassword)
            return decoded
        }
        catch{
            return null
        }
    }
}