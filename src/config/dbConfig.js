import mongoose from 'mongoose'
import env from 'dotenv'
env.config()

//@description  Handling Database connection
export const dbConnection = async () => {
    await mongoose.connect(process.env.MONG0)
        .then((db) => console.log('Mongodb connected'))
        .catch(error => console.log(error.message))
}