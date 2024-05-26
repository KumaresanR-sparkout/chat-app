import mongoose from "mongoose"
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongod = undefined
export const dbConnection = async () => {
    try {
        mongod = await MongoMemoryServer.create()
        const uri = mongod.getUri();
        await mongoose.connect(uri);
        console.log('Database connected');
    } catch (error) {
        console.log('Connection error:', error);
    }
}


export const dbDisconnect = async () => {
    try {
        await mongoose.connection.dropDatabase()
        await mongoose.connection.close();
        await mongod.stop();
        console.log('Database disconnected');
    } catch (error) {
        console.error('Disconnection error:', error);
    }
}