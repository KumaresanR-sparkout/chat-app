import supertest from "supertest"
import app from '../index'
import mongoose from "mongoose"
import env from 'dotenv'
env.config()

beforeAll(() => {
    return mongoose.connect(process.env.MONG0).then(db => console.log('connected'))
        .catch(error => console.log('connection error:', error.message))
})
afterAll(() => {
    return mongoose.connection.close()
})
const baseUrl = '/api/chat'
const senderId = '6652f5e1655b4d2ed25993f4'
const receiverId = '6652cd946290174b90405027'
const userId = '6652cd946290174b90405027'
const groupKey = '66533587a3af6f6c36950251'

const userChatDetails = async (method, resource, senderId, receiverId) => {
    const response = await supertest(app)[method](`${baseUrl}/${resource}?senderId=${senderId}&receiverId=${receiverId}`)
        .set('Authorization', `Bearer ${process.env.TOKEN}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
    return response
}

const withoutQuery = async (method, resource) => {
    const response = await supertest(app)[method](`${baseUrl}/${resource}`)
        .set('Authorization', `Bearer ${process.env.TOKEN}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
    return response
}

const userIdChatLists = async (method, resource, userId) => {
    const response = await supertest(app)[method](`${baseUrl}/${resource}?userId=${userId}`)
        .set('Authorization', `Bearer ${process.env.TOKEN}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
    return response
}

describe('Testing group endpoints', () => {
    test('should handle request without query string', async () => {
        const response = await withoutQuery('get', 'private-chat')
        expect(response.status).toBe(400)
        expect(response.body.status).toBeFalsy()
        expect(response.body).toHaveProperty('message', 'bad request')
    })

    test('should return one-to-one chat lists', async () => {
        const response = await userChatDetails('get', 'private-chat', senderId, receiverId)
        expect(response.status).toBe(200)
        expect(response.body.status).toBeTruthy()
        expect(response.body).toHaveProperty('message', 'one-to-one chat list')
        expect(response.body.data).toEqual(expect.any(Array))
    })

    test('should return group chat lists', async () => {
        const response = await supertest(app).get(`${baseUrl}/group-chat/${groupKey}`)
            .set('Authorization', `Bearer ${process.env.TOKEN}`)
        expect(response.status).toBe(200)
        expect(response.body.status).toBeTruthy()
        expect(response.body).toHaveProperty('message', 'data fetched by the group based on key')
        expect(response.body.data).toEqual(expect.any(Array))
    })

    test('should return request for user-chat lists', async () => {
        const response = await userIdChatLists('get', 'user-chat', userId)
        expect(response.status).toBe(200)
        expect(response.body.status).toBeTruthy()
        expect(response.body).toHaveProperty('message', 'last send message and unread count data')
        expect(response.body.data).toEqual(expect.any(Array))
    })

    test('should return request for user-chat-loop lists', async () => {
        const response = await userIdChatLists('get', 'user-chat-loop', userId)
        expect(response.status).toBe(200)
        expect(response.body.status).toBeTruthy()
        expect(response.body).toHaveProperty('message', 'last send message and unread count data')
        expect(response.body.data).toEqual(expect.any(Array))
    })
})