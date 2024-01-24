import { response } from "express";
import { roomModel } from "../database";
import { Iroom } from "../types";
import cron from 'node-cron'
import { confess } from "./confess";
import bcrypt from 'bcrypt'
export class room {
    static create(room:Iroom):Promise<boolean> {
        return new Promise((res,rej) => {
            roomModel.find({roomName:room.roomName})
            .then(verify => {
                if(verify.length == 0) {
                    let passwordHashed = bcrypt.hashSync(room.roomPassword,10) 
                    const newRom = new roomModel({_id:room._id, roomName:room.roomName, roomPassword: passwordHashed})
                    newRom.save().then(()=> {
                        res(true)
                        console.log("--- executed created rom: "+ room.roomName)
                        cron.schedule(`59 ${new Date().getHours() - 1} * * * "`, () => this.deleteByName(room.roomName),{
                            scheduled:false,
                            name:room.roomName
                        })
                    })
                    .catch((err)=> {
                        rej(err)
                    })
                }   
                else {
                    res(false)
                }
           })
           .catch((err)=> {
            rej(err)
           })
        })
    }
    static getAll():Promise<Iroom[]> {
        return new Promise((res,rej) => {
            roomModel.find()
            .then((rooms) => {
                res(rooms)
            })
            .catch((err) => {
                rej(err)
            })
        })
    }
    static deleteAll():Promise<boolean> {
        return new Promise((res,rej) => {
            roomModel.deleteMany()
            .then(()=> {
                res(true)
                console.log("--- deleted all rooms")
                confess.deleteAllConfess()
                .then(() => {
                    console.log("--- delete all confess by rooms deleted")
                })
                .catch(() => {
                    console.log("--- failed to delete all confess")
                })
            })
            .catch((err) => {
                rej(err)
            })
        })
    }
    static getByName(name:string):Promise<Iroom | null> {
        return new Promise((res,rej) => {
            roomModel.find({roomName:name})
            .then((response) => {
                if(response.length != 0) {
                    res(response[0])
                }
                else {
                    res(null)
                }
            })
            .catch((err) => {
                rej(err)
            })
        })
    }
    static getById(_id:string):Promise<Iroom | null> {
        return new Promise((res,rej) => {
            roomModel.find({_id:_id})
            .then((response) => {
                if(response.length != 0) {
                    res(response[0])
                }
                else {
                    res(null)
                }
            })
            .catch((err) => {
                rej(err)
            })
        })
    }
    static deleteById(_id:string):Promise<boolean> {
        return new Promise((res,rej) => {
            roomModel.deleteMany({_id:_id})
            .then(() => {
                res(true)
                console.log("--- executed Deleted rom: "+ _id)
                confess.deleteById(_id)
                .then(() => {
                    console.log("--- Deleted confess by deleted room")
                })
                .catch(() => {
                    console.log("--- failed to delete confess by deleted room")
                })
            })
            .catch((err) => {
                rej(err)
            })
        })
    }
    static deleteByName(name:string):Promise<boolean> {
        return new Promise((res,rej) => {
            roomModel.deleteMany({roomName:name})
            .then(() => {
                res(true)
                console.log("--- executed deleted rom: "+ name)
                confess.deleteByRoomName(name)
                .then(()=>{
                    console.log("--- Deleted confess by deleted room")
                })
                .catch(() => {
                    console.log("--- Error to delete confess by deleted room")
                })
                cron.getTasks().get(name)?.stop()
            })
            .catch((err) => {
                rej(err)
            })
        })
    }
    static async roomIsValid (roomName:string,roomPasswordNoHashed:string):Promise<boolean>{
        try {
            let data = await roomModel.findOne({roomName:roomName})
            if(data) {
                let compare = bcrypt.compareSync(roomPasswordNoHashed,data.roomPassword)
                return compare
            }else {
                return false
            }
        }
        catch{
            return false
        }
    }
    static async roomExist(roomName:string):Promise<boolean>{
        let data = await roomModel.findOne({roomName:roomName})
        if(data) {
            return true
        }else {
            return false
        }
    }
}