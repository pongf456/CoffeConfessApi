import mongose, { PaginateModel } from "mongoose"
import {Iconfess, IconfessDocument, Iroom } from "./types"
import paginate from 'mongoose-paginate-v2'

const createSchemaRoom = () => {
    const schema = new mongose.Schema<Iroom>({
        _id:{
            type:String,
            required:true
        },
        roomName:{
            type:String,
            required:true
        },
        roomPassword:{
            type:String,
            required:true
        }
    })
    return mongose.model("Room",schema)
}
const createSchemaConfess = () =>{
    const schema = new mongose.Schema<IconfessDocument>({
        confess:{
            type:String,
            required:true
        },
        roomName:{
            type:String,
            required:true
        },
        confessId:{
            type:String,
            required:true
        }
    })
    schema.plugin(paginate)
    return mongose.model<IconfessDocument,PaginateModel<IconfessDocument>>("Confess",schema)
}
export const roomModel = createSchemaRoom()
export const confessModel = createSchemaConfess()
export async function connectDB() {
    try{
        await mongose.connect(`mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.meurcdi.mongodb.net/?retryWrites=true&w=majority`)
        console.log("--- connected db")
    }   
    catch (err){
        console.log(process.env.MONGO_DB_USERNAME,process.env.MONGO_DB_PASSWORD)
        console.log("-- error to connect db")
    }
}   