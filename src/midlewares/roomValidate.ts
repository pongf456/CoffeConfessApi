import { NextFunction, Request, Response } from "express";
import { header, param, validationResult } from "express-validator";
import { IServerResponse, Iroom, IroomToken } from "../types";
import { auth_token } from "../models/auth_token";
import jwt from 'jsonwebtoken'
export const roomValidate = [[
    header("auth_token").exists().isString()
],(req:Request,res:Response,next:NextFunction) => {
    if(validationResult(req).isEmpty()){
        auth_token.isValid(req.headers.auth_token as string)
        .then((result) => {
            if(result) {
                try {
                    let decodedRoom = jwt.decode(req.headers.auth_token as string) as Iroom
                    res.locals.room = decodedRoom
                    next()
                }
                catch {
                    res.status(500).end("Hubo un error en el servidor")
                }
            }
            else {
                res.status(400).end("Autenticacion invalida")
            }
        })
    }
    else {
        res.status(400).end("Parametros invalidos")
    }
}]