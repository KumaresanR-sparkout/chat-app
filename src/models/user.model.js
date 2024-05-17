import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    user_name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    }
},
    {
        timestamps: true
    }
)

export default mongoose.model('Users', userSchema)