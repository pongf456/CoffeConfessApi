import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "./types"
import { Server } from "socket.io"
import * as http from 'http'
import { auth_token } from "./models/auth_token"
function socketDef(server:http.Server) {
    const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
      >(server,{
        transports: ['websocket',"polling"],
        cors:{
            origin:"*"
        }
      })
    io.use(async (socket,next) => {
        if(socket.handshake.auth.token) {
            let verify = await auth_token.isValid(socket.handshake.auth.token)
            if(verify) {
                console.log(verify)
                socket.join(verify.roomName)
                next()
            }
            else {
                next(new Error("Autenticacion invalida"))
            }
        }
        else {
            next(new Error("No posee autenticacion"))
        }
    })
    io.on("connection",(socket) => {

    })
    return io
}
export default socketDef