import mongoose from 'mongoose'

const groupUserSchema = new mongoose.Schema({
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
    }
})

export default mongoose.model('Groupusers', groupUserSchema)