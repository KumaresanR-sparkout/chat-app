import express from 'express'
import env from 'dotenv'
import router from '../src/routes/socket.route'
env.config()
const app=express()

app.use('/api/socket',express.static('htmls'))
app.use('/api/socket',router)
export default app