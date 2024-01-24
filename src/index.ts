import express, { json, urlencoded } from "express"
import 'dotenv/config'
import { confessModel, connectDB } from "./database"
import cookieParser from "cookie-parser"
import { main } from "./routes/main"
import apiRateLimit from "./apiRateLimit"
import { room } from "./models/room"
import cors from 'cors'
const app = express()
app.use(cors())
app.use(cookieParser(process.env.SECRET_APP_KEY || "secret"))
app.use(urlencoded({extended:true}))
app.use(json())

app.use("/api",main)


app.listen(process.env.APP_PORT || 3000, () => {
    console.log(`--- Example app listening on port ${process.env.APP_PORT}`)
    connectDB()
})
