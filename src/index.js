import express from 'express'
import mongoose from 'mongoose'
import env from 'dotenv'
import userRouter from '../src/routes/user.route'
import { connectUser } from './utils/user-message.utils'

env.config()
const app = express()

mongoose.connect(process.env.MONG0)
    .then((db) => console.log('Mongodb connected'))
    .catch(error => console.log(error.message))



app.use(express.json())
app.use('/api', userRouter)

export default app