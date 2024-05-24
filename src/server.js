import app from './index'
import env from 'dotenv'
import Io from 'socket.io'
import { commonSocket } from './sockets/common-config-socket'
env.config()

const server = app.listen(process.env.PORT, () => {
    console.log(`server started at port ${process.env.PORT}`)
})

const io = Io(server)
commonSocket(io)
