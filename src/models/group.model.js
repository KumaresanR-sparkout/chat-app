import mongoose from 'mongoose'

const groupSchema = new mongoose.Schema({
    group_name: {
        type: String,
        trim: true,
        default: 'lik'
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

export default mongoose.model('Groups', groupSchema)