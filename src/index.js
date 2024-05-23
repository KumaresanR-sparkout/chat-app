import express from 'express'
import env from 'dotenv'
import * as db from './config/dbConfig'
import userRouter from '../src/routes/user.route'
import groupRouter from '../src/routes/group.route'
import messageRouter from '../src/routes/message.route'

env.config()
const app = express()

db.dbConnection();

app.use(express.json())
app.use('/api', userRouter)
app.use('/api',groupRouter)
app.use('/api',messageRouter)

export default app