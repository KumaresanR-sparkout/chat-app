import supertest from "supertest"
import env from 'dotenv'
import app from '../index'
import * as db from '../config/dbConfig'
env.config()

beforeAll(() => {
    return db.dbConnection()
})
afterAll(() => {
    return db.dbConnection()
})
const baseUrl = '/api/chat'

describe('Testing group endpoints', () => {
    test('test-case for checking if group exists in database or not', (done) => {
        supertest(app).post(`${baseUrl}/group`).send({
            "group_name": "school-friends"
        })
            .set('Authorization', `Bearer ${process.env.TOKEN}`)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401)
            .end((error, response) => {
                expect(response.status).toBe(401)
                expect(response.body.status).toBeFalsy()
                expect(response.body).toHaveProperty('message', 'already group has been created')
                if (error) {
                    done(error)
                }
                done()
            })
    })

    test('test-case for checking  to pass empty body content to create group or not', (done) => {

        supertest(app).post(`${baseUrl}/group`).send({})
            .set('Authorization', `Bearer ${process.env.TOKEN}`)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end((error, response) => {
                expect(response.status).toBe(400)
                expect(response.status.body).toBeFalsy()
                expect(response.body).toHaveProperty('message', 'no body found')
                if (error) {
                    done(error)
                }
                done()
            })
    })

    test.skip('test-case for creating group', (done) => {

        supertest(app).post(`${baseUrl}/group`).send({
            "group_name": "college-friends"
        })
            .set('Authorization', `Bearer ${process.env.TOKEN}`)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .end((error, response) => {
                expect(response.status).toBe(201)
                expect(response.body.status).toBeTruthy()
                expect(response.body).toHaveProperty('message', 'created group')
                if (error) {
                    done(error)
                }
                done()
            })
    })
})


describe('Testing group-user endpoints', () => {
    test('test-case for checking if group exists in database or not', (done) => {
        supertest(app).post(`${baseUrl}/group`).send({
            "group_name": "school-friends"
        })
            .set('Authorization', `Bearer ${process.env.TOKEN}`)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401)
            .end((error, response) => {
                expect(response.status).toBe(401)
                expect(response.body.status).toBeFalsy()
                expect(response.body).toHaveProperty('message', 'already group has been created')
                if (error) {
                    done(error)
                }
                done()
            })
    })

    test('test-case for checking  to pass empty body content to add user in group or not', (done) => {

        supertest(app).patch(`${baseUrl}/group-user`).send({})
            .set('Authorization', `Bearer ${process.env.TOKEN}`)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end((error, response) => {
                expect(response.status).toBe(400)
                expect(response.status.body).toBeFalsy()
                expect(response.body).toHaveProperty('message', 'bad request')
                if (error) {
                    done(error)
                }
                done()
            })
    })

    test('test-case for checking id user already exist in group or not', (done) => {
        supertest(app).patch(`${baseUrl}/group-user`).send({
            "groupId": "664d8f8bb31736702ae77423",
            "userId": "664b4eba81d8fe4d35c10156"
        })
            .set('Authorization', `Bearer ${process.env.TOKEN}`)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .end((error, response) => {
                expect(response.status).toBe(400)
                expect(response.body.status).toBeFalsy()
                expect(response.body).toHaveProperty('message', 'already you have been added to the group')
                if (error) {
                    done(error)
                }
                done()
            })
    })

    test.skip('test-case for adding new user to the group', (done) => {
        supertest(app).patch(`${baseUrl}/group-user`).send({
            "groupId": "664d8f8bb31736702ae77423",
            "userId": "664b4eba81d8fe4d35c10156"
        })
            .set('Authorization', `Bearer ${process.env.TOKEN}`)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .end((error, response) => {
                expect(response.status).toBe(201)
                expect(response.body.status).toBeTruthy()
                expect(response.body).toHaveProperty('message', 'user added to the group')
                if (error) {
                    done(error)
                }
                done()
            })
    })
})


describe('Testing group-status endpoints', () => {
    test('test-case for checking if groupkey && sender is available in group to update seen-by status', (done) => {
        supertest(app).patch(`${baseUrl}/group-status`).send({
            "senderId": "664b4eba81d8fe4d35c10156",
            "groupId": "664d8f8bb31736702ae77424",
            "users": ["66471e7c9fa50773ae8b164a", "664b4eba81d8fe4d35c10156"]
        })
            .set('Authorization', `Bearer ${process.env.TOKEN}`)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .end((error, response) => {
                expect(response.status).toBe(401)
                expect(response.body.status).toBeFalsy()
                expect(response.body).toHaveProperty('message', 'you are not allowed to update the seen status')
                if (error) {
                    done(error)
                }
                done()
            })
    })

    test('test-case for checking  to pass empty body content to update status in group-message or not', (done) => {

        supertest(app).patch(`${baseUrl}/group-status`).send({})
            .set('Authorization', `Bearer ${process.env.TOKEN}`)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .end((error, response) => {
                expect(response.status).toBe(400)
                expect(response.status.body).toBeFalsy()
                expect(response.body).toHaveProperty('message', 'no body-of-content found')
                if (error) {
                    done(error)
                }
                done()
            })
    })

    test.skip('test-case for adding user to the group', (done) => {
        supertest(app).patch(`${baseUrl}/group-status`).send({
            "senderId": "664b4eba81d8fe4d35c10156",
            "groupId": "664d8f8bb31736702ae77423",
            "users": ["66471e7c9fa50773ae8b164a", "664b4eba81d8fe4d35c10156"]
        })
            .set('Authorization', `Bearer ${process.env.TOKEN}`)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .end((error, response) => {
                expect(response.status).toBe(201)
                expect(response.body.status).toBeTruthy()
                expect(response.body).toHaveProperty('message', 'updated seen-users array')
                if (error) {
                    done(error)
                }
                done()
            })
    })
})



