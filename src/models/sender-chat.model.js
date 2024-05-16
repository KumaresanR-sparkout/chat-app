import mongoose from 'mongoose'
const chatSchema = new mongoose.Schema({
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    receiver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    message: {
        type: String,
        trim: true,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
})

export default mongoose.model('Chats', chatSchema)