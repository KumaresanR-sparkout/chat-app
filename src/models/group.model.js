import mongoose from 'mongoose'

const groupSchema = new mongoose.Schema({
    group_name: {
        type: String,
        trim: true,
        default: 'lik'
    }
})

export default mongoose.model('Groups', groupSchema)