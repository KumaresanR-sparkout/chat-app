import app from './index'
import env from 'dotenv'
import Io from 'socket.io'
// import { socketResponse } from '../src/sockets/common.socket'

env.config()

const server = app.listen(process.env.PORT, () => {
    console.log(`server started at port ${process.env.PORT}`)
})

const io = Io(server)
const user = {}

const socketResponse = (socket) => {
    console.log(socket.id, ' - has connected')
    const id = socket.handshake.query.id
    if (id) {
        const key = Object.keys(user)
        if (key.includes(id.toString())) {
            user[id] = [...user[id], socket.id]
        }
        else {
            user[id] = [socket.id]
        }
        console.log(user)
    }
    socket.on('chat', (msg) => {
        io.to(user[msg.recevier_id]).emit('rechat', msg)

    })
    socket.on('disconnect', () => console.log(socket.id, ' - has disconnected'))
}
io.on('connection', socketResponse)