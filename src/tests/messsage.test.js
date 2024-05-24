import supertest from 'supertest'
import app from '../index'
import * as db from '../config/dbConfig'
import env from 'dotenv'
env.config()

beforeAll(() => {
    return db.dbConnection()
})
afterAll(() => {
    return db.dbConnection()
})
const baseUrl = '/api/chat'

describe('Testing user-chat endpoints', () => {
    test('test-case for getting user-chat lists', (done) => {
        supertest(app).get(`${baseUrl}/user-chat?userId=66471e3b9fa50773ae8b1647`)
            .set('Authorization', `Bearer ${process.env.TOKEN}`)
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .end((error, response) => {
                expect(response.status).toBe(200)
                expect(response.body.status).toBeTruthy()
                expect(response.body).toHaveProperty('message', 'last send message and unread count data')
                if (error) {
                    return done(error)
                }
                done()
            })
    })

    test('test-case for sending without userId', (done) => {
        supertest(app).get(`${baseUrl}/user-chat`)
            .set('Authorization', `Bearer ${process.env.TOKEN}`)
            .end((error, response) => {
                expect(response.status).toBe(404)
                expect(response.body.status).toBeFalsy()
                expect(response.body).toHaveProperty('message', 'pass id to get your chat')

                if (error) {
                    return done(error)
                }
                else {
                    return done()
                }
            })
    })
})


describe('Testing user-chat-loop endpoints', () => {
    test('test-case for getting user-chat-loop lists', (done) => {
        supertest(app).get(`${baseUrl}/user-chat?userId=66471e3b9fa50773ae8b1647`)
            .set('Authorization', `Bearer ${process.env.TOKEN}`)
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .end((error, response) => {
                expect(response.status).toBe(200)
                expect(response.body.status).toBeTruthy()
                expect(response.body).toHaveProperty('message', 'last send message and unread count data')
                if (error) {
                    return done(error)
                }
                done()
            })
    })

    test('test-case for sending without userId', (done) => {
        supertest(app).get(`${baseUrl}/user-chat-loop`)
            .set('Authorization', `Bearer ${process.env.TOKEN}`)
            .end((error, response) => {
                expect(response.status).toBe(404)
                expect(response.body.status).toBeFalsy()
                expect(response.body).toHaveProperty('message', 'pass id to get your chat')

                if (error) {
                    return done(error)
                }
                else {
                    return done()
                }
            })
    })
})


describe('Testing private-chat endpoints', () => {
    test('test-case for sending without userId', (done) => {
        supertest(app).get(`${baseUrl}/private-chat`)
            .set('Authorization', `Bearer ${process.env.TOKEN}`)
            .end((error, response) => {
                expect(response.status).toBe(400)
                expect(response.body.status).toBeFalsy()
                expect(response.body).toHaveProperty('message', 'bad request')

                if (error) {
                    return done(error)
                }
                else {
                    return done()
                }
            })
    })

    test('test-case for getting one-to-to chat lists', (done) => {
        supertest(app).get(`${baseUrl}/private-chat?senderId=66471e3b9fa50773ae8b1647&receiverId=66471e7c9fa50773ae8b164a`)
            .set('Authorization', `Bearer ${process.env.TOKEN}`)
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .end((error, response) => {
                expect(response.status).toBe(200)
                expect(response.body.status).toBeTruthy()
                expect(response.body).toHaveProperty('message', 'one-to-one chat list')
                if (error) {
                    return done(error)
                }
                done()
            })
    })


})

describe('Testing group-chat endpoints', () => {
    test('test-case for sending Invalid group-key', (done) => {
        supertest(app).get(`${baseUrl}/group-chat/664c8164cf510e96f7adf8a2`)
            .set('Authorization', `Bearer ${process.env.TOKEN}`)
            .end((error, response) => {
                expect(response.status).toBe(401)
                expect(response.body.status).toBeFalsy()
                expect(response.body).toHaveProperty('message', 'provide valid groupKey')

                if (error) {
                    return done(error)
                }
                else {
                    return done()
                }
            })
    })

    test('test-case for getting individual-group-chat lists', (done) => {
        supertest(app).get(`${baseUrl}/group-chat/664c8164cf510e96f7adf8a1`)
            .set('Authorization', `Bearer ${process.env.TOKEN}`)
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .end((error, response) => {
                expect(response.status).toBe(200)
                expect(response.body.status).toBeTruthy()
                expect(response.body).toHaveProperty('message', 'data fetched by the group based on key')
                if (error) {
                    return done(error)
                }
                done()
            })
    })

})

describe('Testing private-status endpoints', () => {
    test('test-case for sending without ids', (done) => {
        supertest(app).patch(`${baseUrl}/private-status`)
            .set('Authorization', `Bearer ${process.env.TOKEN}`)
            .end((error, response) => {
                expect(response.status).toBe(400)
                expect(response.body.status).toBeFalsy()
                expect(response.body).toHaveProperty('message', 'bad request')

                if (error) {
                    return done(error)
                }
                else {
                    return done()
                }
            })
    })

    test('test-case for updating one-to-one seen status', (done) => {
        supertest(app).patch(`${baseUrl}/private-status?senderId=66471e3b9fa50773ae8b1647&receiverId=664b4eba81d8fe4d35c10156`)
            .set('Authorization', `Bearer ${process.env.TOKEN}`)
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .end((error, response) => {
                expect(response.status).toBe(200)
                expect(response.body.status).toBeTruthy()
                expect(response.body).toHaveProperty('message', 'message status has been updated')
                if (error) {
                    return done(error)
                }
                done()
            })
    })

})