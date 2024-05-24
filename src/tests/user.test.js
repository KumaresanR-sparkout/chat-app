import supertest from 'supertest'
import app from '../index'
import env from 'dotenv'
env.config()
import * as db from '../config/dbConfig'


beforeAll(() => {
    return db.dbConnection()
})
afterAll(() => {
    return db.dbConnection()
})
const baseUrl = '/api/chat'

describe('Testing registration user endpoints', () => {
    test('test-case for user exists in database', (done) => {
        const user = {
            "user_name": "gopi",
            "email": "gopi@gmail.com",
            "password": "Gopi@?123456"
        }
        supertest(app).post(`${baseUrl}/user`).send(user)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end((error, response) => {

                expect(response.status).toBe(400)
                expect({
                    "status_code": 400,
                    "status": false,
                    "message": "user already exist"
                }).toEqual(response.body)
                if (error) {
                    done(error)
                }
                done()
            })
    })

    test('test-case for empty body content to register', (done) => {
        const user = {
        }
        supertest(app).post(`${baseUrl}/user`).send(user)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404)
            .end((error, response) => {
                expect(response.status).toBe(404)
                expect({
                    "status_code": 404,
                    "status": false,
                    "message": "no content found to register"
                }).toEqual(response.body)
                if (error) {
                    done(error)
                }
                done()
            })
    })

    test.skip('test-case for registering user', (done) => {
        const user = {
            "user_name": "sudhan",
            "email": "sudhan@gmail.com",
            "password": "Sudhan@?123456"
        }
        supertest(app).post(`${baseUrl}/user`).send(user)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .end((error, response) => {
                expect(response.status).toBe(201)
                expect(response.body.status).toBeTruthy()
                if (error) {
                    done(error)
                }
                done()
            })
    })
})



describe('Testing login user endpoints', () => {
    test('test-case for empty body content to login', (done) => {
        supertest(app).get(`${baseUrl}/user`).send({})
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .end((error, response) => {
                expect(response.status).toBe(404)
                expect(response.body.status).toBeFalsy()
                expect(response.body).toEqual({
                    "status_code": 404,
                    "status": false,
                    "message": "no content found please send credientials"
                })

                if (error) {
                    return done(error)
                }
                else {
                    return done()
                }
            })
    })

    test('test-case for sending in-valid credientials to login', (done) => {
        supertest(app).get(`${baseUrl}/user`).send({
            "email": "john@gmail.com",
            "password": "John?123456"
        })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .end((error, response) => {
                expect(response.status).toBe(401)
                expect(response.body.status).toBeFalsy()
                expect(response.body).toEqual({
                    "status_code": 401,
                    "status": false,
                    "message": "use valid login credientials"
                })

                if (error) {
                    return done(error)
                }
                else {
                    return done()
                }
            })
    })
})

describe('Testing update user endpoints', () => {
    test('test-case for empty body content to login', (done) => {
        supertest(app).patch(`${baseUrl}/user?userId=66471e3b9fa50773ae8b1647`).send({})
            .set('Authorization', `Bearer ${process.env.TOKEN}`)
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .end((error, response) => {
                console.log(response.status)
                expect(response.status).toBe(400)
                expect(response.body.status).toBeFalsy()
                expect(response.body).toHaveProperty('message', 'no body content find to update')

                if (error) {
                    return done(error)
                }
                else {
                    return done()
                }
            })
    })

    test('test-case for sending invalid userId to update', (done) => {
        supertest(app).patch(`${baseUrl}/user?userId=66471e3b9fa50773ae8b1648`).send(
            {
                "email": "mohan@gmail.com"
            })
            .set('Authorization', `Bearer ${process.env.TOKEN}`)
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .end((error, response) => {
                expect(response.status).toBe(401)
                expect(response.body.status).toBeFalsy()
                expect(response.body).toHaveProperty('message', 'you are not the user to update the details')

                if (error) {
                    return done(error)
                }
                else {
                    return done()
                }
            })
    })

    test('test-case for sending valid userId to update', (done) => {
        supertest(app).patch(`${baseUrl}/user?userId=66471e3b9fa50773ae8b1647`).send(
            {
                "email": "mohan@gmail.com"
            })
            .set('Authorization', `Bearer ${process.env.TOKEN}`)
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .end((error, response) => {
                expect(response.status).toBe(201)
                expect(response.body.status).toBeTruthy()
                expect(response.body).toHaveProperty('message', 'updated your details')

                if (error) {
                    return done(error)
                }
                else {
                    return done()
                }
            })
    })
})


describe('Testing delete user endpoints', () => {
    test('test-case for sending without userId to delete', (done) => {
        supertest(app).delete(`${baseUrl}/user`)
            .set('Authorization', `Bearer ${process.env.TOKEN}`)
            .end((error, response) => {
                expect(response.status).toBe(404)
                expect(response.body.status).toBeFalsy()
                expect(response.body).toHaveProperty('message', 'pass id to delete your details')

                if (error) {
                    return done(error)
                }
                else {
                    return done()
                }
            })
    })

    test('test-case for sending invalid userId to delete', (done) => {
        supertest(app).delete(`${baseUrl}/user?userId=66471e3b9fa50773ae8b1648`)
            .set('Authorization', `Bearer ${process.env.TOKEN}`)
            .end((error, response) => {
                expect(response.status).toBe(401)
                expect(response.body.status).toBeFalsy()
                expect(response.body).toHaveProperty('message', 'you are not the user to delete the details')

                if (error) {
                    return done(error)
                }
                else {
                    return done()
                }
            })
    })

    test.skip('test-case for sending valid userId to delete', (done) => {
        supertest(app).patch(`${baseUrl}/user?userId=66503f4060acebbb50b6c004`)
            .set('Authorization', `Bearer ${process.env.TOKEN}`)
            .end((error, response) => {
                expect(response.status).toBe(201)
                expect(response.body.status).toBeTruthy()
                expect(response.body).toHaveProperty('message', 'deleted your details')
                if (error) {
                    return done(error)
                }
                else {
                    return done()
                }
            })
    })
})