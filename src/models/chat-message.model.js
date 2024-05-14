import mongoose from 'mongoose'
const chatMessageSchema=new mongoose.Schema({
    sender_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Chatusers'
    },
    receiver_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Chatusers'
    },
    timestamps: true  
})

export default mongoose.model('Chatmessage',chatMessageSchema)