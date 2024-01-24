import ratelimit from 'express-rate-limit'
import { IServerResponse } from './types'
const apiRateLimit = ratelimit({
    windowMs: 60 * 1000,
    limit:5,
    message:"Pasaste el numero maximo de peticiones",
    legacyHeaders:true
})

export default apiRateLimit