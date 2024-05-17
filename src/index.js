import express from 'express'
import env from 'dotenv'
import * as db from './config/dbConfig'
import userRouter from '../src/routes/user.route'
env.config()
const app = express()

db.dbConnection();

app.use(express.json())
app.use('/api', userRouter)

export default app