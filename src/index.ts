import express, { json, urlencoded } from "express"
import 'dotenv/config'
import { confessModel, connectDB } from "./database"
import cookieParser from "cookie-parser"
import { main } from "./routes/main"
import apiRateLimit from "./apiRateLimit"
import { room } from "./models/room"
import cors from 'cors'
import * as http from "http";
import socketDef from "./socketDef"

const app = express()
app.use(cors())
app.use(cookieParser(process.env.SECRET_APP_KEY || "secret"))
app.use(urlencoded({extended:true}))
app.use(json())
app.get('/', (req, res) => {
  res.send('GET request to the homepage')
})
app.use("/api",main)
const server = http.createServer(app)
export const io = socketDef(server)
server.listen(process.env.APP_PORT || 3000, () => {
    console.log(`--- Example app listening on port ${process.env.APP_PORT}`)
    connectDB()
})
