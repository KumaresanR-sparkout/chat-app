import mongoose from 'mongoose'

const groupMessageSchema = new mongoose.Schema({
    group_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Groups'
    },
    sender_id: {
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

export default mongoose.model('groupMessage', groupMessageSchema)