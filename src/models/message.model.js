import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    content: {
        type: String,
        trim: true,
    },
    chat_ref: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chats'
    }
},
    {
        timestamps: true
    }
)

export default mongoose.model('Message', messageSchema)