import { confessModel, roomModel } from "../database";
import { Iconfess, IconfessPaginateResult } from "../types";

export class confess {
    static create(confess:Iconfess):Promise<boolean> {
        return new Promise((res,rej) => {
            roomModel.find({roomName:confess.roomName})
            .then((search) => {
                if(search.length != 0) {
                    let newConfess = new confessModel(confess)
                    newConfess.save()
                    .then(() => {
                        res(true)
                        console.log(`--- new confess added to ${confess.roomName}`)
                    })
                    .catch((err) => {
                        rej(err)
                    })
                }else{
                    res(false)
                }
            })
            .catch((err) => {
                rej(err)
            })
        })
    }
    static viewAllConfess():Promise<Iconfess[]> {
        return new Promise((res,rej)=> {
            confessModel.find()
            .then((response) => {
                res(response)
            })
            .catch((err) => {
                rej(err)
            })
        })
    }
    static deleteAllConfess():Promise<boolean> {
        return new Promise((res,rej) => {
            confessModel.deleteMany()
            .then(() => {
                res(true)
            })
            .catch((err) => {
                rej(err)
            })
        })
    }
    static getByRoomName(roomName:string):Promise<Iconfess[]> {
        return new Promise((res,rej) => {
            confessModel.find({roomName:roomName})
            .then((search) => {
                res(search)
            })
            .catch((err) => {
                rej(err)
            })
        })
    }
    static getByRoomPaginated(roomName:string,page:number = 1):Promise<IconfessPaginateResult>{
        return new Promise((res,rej) => {
            confessModel.paginate({roomName:roomName},{page:page,limit:3, select:"confess confessId -_id"})
            .then((result) => {
               res(result)
            })
            .catch((err) => {
                rej(err)
            })
        })
    }
    static getById(_id:string):Promise<Iconfess | null> {
        return new Promise((res,rej) => {
            confessModel.findOne({confessId:_id})
            .then((search) => {
                res(search)
            })
            .catch((err) => {
                rej(err)
            })
        })
    }
    static deleteByRoomName(roomName:string):Promise<boolean> {
        return new Promise((res,rej) => {
            confessModel.deleteMany({roomName:roomName})
            .then(() => {
                res(true)
            })
            .catch((err) => {
                rej(err)
            })
        })
    }
    static deleteById(_id:string):Promise<boolean> {
        return new Promise((res,rej) => {
            confessModel.deleteMany({confessId:_id})
            .then(() => {
                res(true)
            })
            .catch((err) => {
                rej(err)
            })
        })
    }
}