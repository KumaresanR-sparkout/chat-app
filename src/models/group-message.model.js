import mongoose from 'mongoose'

//@description  creating group message schema
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
    seen_by: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }]
},
    {
        timestamps: true
    }
)

export default mongoose.model('groupMessage', groupMessageSchema)