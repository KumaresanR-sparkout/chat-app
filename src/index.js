import express from 'express'
import env from 'dotenv'
import * as db from './config/dbConfig'
import userRouter from './routes/user-route'
import groupRouter from './routes/group-route'
import messageRouter from './routes/message-route'

env.config()
const app = express()

db.dbConnection();

app.use(express.json())
app.use('/api/chat', userRouter)
app.use('/api/chat', groupRouter)
app.use('/api/chat', messageRouter)

export default app