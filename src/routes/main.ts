import { Request, Response, Router } from "express"
import { body,param,validationResult } from "express-validator"
import { IServerResponse, Iconfess, Iroom } from "../types"
import { v1 } from "uuid"
import { room } from "../models/room"
import { auth_token } from "../models/auth_token"
import { confess } from "../models/confess"
import { roomValidate } from "../midlewares/roomValidate"
import apiRateLimit from "../apiRateLimit"
export const main = Router()

main.post('/create/room',[
    body("roomName").exists().isString().isLength({min:3,max:30}),
    body("roomPassword").exists().isString().isLength({min:3,max:20})
],apiRateLimit,(req:Request, res:Response) => {
    if(validationResult(req).isEmpty()){
        //creo la nueva room
        let thisRoom:Iroom = {
            _id:v1(),
            roomName:req.body.roomName,
            roomPassword:req.body.roomPassword
        }
        //empiezo a crear la room
        room.create(thisRoom).then((result)=> {
            if(result) {
                res.json({
                    code:200,
                    context:"Sala de confesiones creada correctamente",
                    data:auth_token.generate(thisRoom)
                } as IServerResponse)
            }
            else {
                res.status(400).end("Error al crear la sala, intenta con otro nombre")
            }

        })
        .catch((error) => {
            res.status(500).end("Ocurrio un error en el servidor")
        })
    }
    else {
        res.status(400).end("Parametros invalidos")
    }
})
main.post('/create/confess',apiRateLimit,[
    body("confess").exists().isString().isLength({min:5,max:400}),
    body("roomName").exists().isString().isLength({min:3,max:30})
], function (req:Request, res:Response) {
    if(validationResult(req).isEmpty()){
        let thisConfess = {
            confessId:v1(),
            confess:req.body.confess,
            roomName:req.body.roomName
        } as Iconfess
        confess.create(thisConfess)
        .then((result) => {
            if(result) {
                res.json({
                    code:200,
                    context:"Confesion creada correctamente"
                } as IServerResponse)
            }
            else {
                res.status(400).end("Nombre de la sala invalido")
            } 
        })
        .catch((err) => {
            res.status(500).end("Ocurrio un error en el servidor")
        })
    }
    else {
        res.status(400).end("Parametros invalidos")
    }
})
main.get('/get/confess/:page',...roomValidate,param("page").exists().isInt(),(req:Request, res:Response) => {

        confess.getByRoomPaginated(res.locals.room.roomName,Number.parseInt(req.params.page))
        .then((r) => {
            res.json({
                code:200,
                context:"Datos solicitados correctamente",
                data:r
            } as IServerResponse)
        })
        .catch(() => {
            res.status(500).end("Hubo un error en el servidor")
        })

})
main.post('/delete/room',...roomValidate,apiRateLimit, function (req:Request, res:Response) {
    room.deleteByName(res.locals.room.roomName)
    .then((result) => {
        if(result){
            res.json({
                code:200,
                context:"sala eliminada correctamente"
            } as IServerResponse  )
        }
        else {
            res.status(400).end("Parametros invalidos")
        }
    })
    .catch((err) => {
        res.status(500).end("Hubo un error en el servidor")
    })
})
main.get("/room/:room",param("room").exists(),function (req:Request,res:Response){
    if(validationResult(req).isEmpty()) {
        room.getByName(req.params.room)
        .then((result) => {
          if(result) {
            res.json({
                code:200,
                context:"sala encontrada"
            } as IServerResponse)
          }
          else {
            res.status(404).end("sala no encontrada")
          }  
        })
        .catch((err) => {
            res.status(500).end("Error en el servidor")
        })
    }
    else {
        res.status(400).end("Es necesario el parametro room")
    }
})