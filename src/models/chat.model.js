import mongoose from 'mongoose'
const chatSchema = new mongoose.Schema({
    chat_name: {
        type: String,
        trim: true,
        required: true
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }]
},
    {
        timestamps: true
    }
)

export default mongoose.model('Chats', chatSchema)