import mongoose from 'mongoose'

const chatUserSchema = new mongoose.Schema({
    user_name: {
        type: String,
        trim: true,
        required: true
    }
})

export default mongoose.model('Chatusers', chatUserSchema)