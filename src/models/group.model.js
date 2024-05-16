import mongoose from 'mongoose'

const groupSchema = new mongoose.Schema({
    group_name: {
        type: String,
        trim: true,
        default: 'lik'
    },
    date: {
        type: Date,
        default: new Date()
    }

})

export default mongoose.model('Groups', groupSchema)