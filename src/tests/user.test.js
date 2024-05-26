import supertest from 'supertest'
import app from '../index'
import { dbConnection, dbDisconnect } from './dbConfig/mongod.dbConfig'

beforeAll(() => {
    return dbConnection()
})
afterAll(() => {
    return dbDisconnect()
})

const baseUrl = '/api/chat'

let token
let userId
let groupId

const userRegisteration = async (method, resource, body) => {
    const response = await supertest(app)[method](`${baseUrl}/${resource}`)
        .send(body)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
    return response
}

const tokenBasedUserAcess = async (method, resource, userId, body) => {
    const response = await supertest(app)[method](`${baseUrl}/${resource}?userId=${userId}`)
        .send(body)
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
    return response
}

const groupCreation = async (method, resource, body) => {
    const response = await supertest(app)[method](`${baseUrl}/${resource}`)
        .send(body)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
    return response
}

const deleteGroup = async (method, resource, groupId) => {
    const response = await supertest(app)[method](`${baseUrl}/${resource}?groupId=${groupId}`)
        .set('Authorization', `Bearer ${token}`)
    return response
}

const user = {
    "user_name": "gopi",
    "email": "gopi@gmail.com",
    "password": "Gopi@?123456"
}
const validLogin = {
    "email": "gopi@gmail.com",
    "password": "Gopi@?123456"
}
const inValidLogin = {
    "email": "gopi@gmail.com",
    "password": "Aopi@?123456"
}
const groupName = {
    "group_name": "lik"
}

describe('Testing registration user endpoints', () => {

    test('should handle empty request body correctly', async () => {
        const response = await userRegisteration('post', 'user', {})
        // console.log(response.body)
        expect(response.body.status_code).toBe(404)
        expect(response.body.status).toBeFalsy()
        expect(response.body).toHaveProperty('message', 'no content found to register')
    })

    test('shold handle register user', async () => {
        const response = await userRegisteration('post', 'user', user)
        expect(response.status).toBe(201)
        expect(response.body.status).toBeTruthy()
        expect(response.body).toHaveProperty('message', 'user added')
        //console.log(response.body)
        expect(response.body.data).toEqual(expect.any(Array))
    })

    test('should handle user already exists', async () => {
        const response = await userRegisteration('post', 'user', user)
        expect(response.status).toBe(400)
        expect(response.body.status).toBeFalsy()
        expect(response.body).toHaveProperty('message', 'user already exist')
    })

    test('should handle inValid email', async () => {
        const response = await userRegisteration('get', 'user', {
            "email": "kopi@gmail.com",
            "password": "Gopi@?123456"
        })
        expect(response.status).toBe(400)
        expect(response.body.status).toBeFalsy()
        expect(response.body).toHaveProperty('message', 'In valid email')
    })
    test('should handle invalid password', async () => {
        const response = await userRegisteration('get', 'user', inValidLogin)
        expect(response.status).toBe(401)
        expect(response.body.status).toBeFalsy()
        expect(response.body).toHaveProperty('message', 'In valid password')
    })

    test('should handle valid login', async () => {
        const response = await userRegisteration('get', 'user', validLogin)
        userId = response.body.data[0].userId
        token = response.body.data[0].token
        //console.log(response.body)
        expect(response.status).toBe(200)
        expect(response.body.status).toBeTruthy()
        expect(response.body).toHaveProperty('message', 'successfully login')
        expect(response.body.data).toEqual(expect.any(Array))
    })

    test('should handle invalid userId for update', async () => {
        //console.log(global.ttoken)
        const response = await tokenBasedUserAcess('patch', 'user', '66529d8f794406a83110181c', {
            "email": "mohan@gmail.com"
        })
        expect(response.status).toBe(401)
        expect(response.body.status).toBeFalsy()
        expect(response.body).toHaveProperty('message', 'you are not the user to update the details')
    })

    test('should handle valid userId for update', async () => {
        const response = await tokenBasedUserAcess('patch', 'user', userId, {
            "email": "gopi@gmail.com"
        })
        expect(response.status).toBe(201)
        expect(response.body.status).toBeTruthy()
        expect(response.body).toHaveProperty('message', 'updated your details')
        expect(response.body.data).toEqual(expect.any(Array))
    })

    test('should handle invalid userId for delete', async () => {
        const response = await tokenBasedUserAcess('delete', 'user', '66529d8f794406a83110181c')
        //console.log(response.body)
        expect(response.status).toBe(401)
        expect(response.body.status).toBeFalsy()
        expect(response.body).toHaveProperty('message', 'you are not the user to delete the details')
    })

    test('should handle valid userId for delete', async () => {
        const response = await tokenBasedUserAcess('delete', 'user', userId)
        expect(response.status).toBe(201)
        expect(response.body.status).toBeTruthy()
        expect(response.body).toHaveProperty('message', 'deleted your details')
    })

    test('should handle create group', async () => {
        const response = await groupCreation('post', 'group', groupName)
        groupId = response.body.data[0]._id
        console.log(response.body)
        expect(response.status).toBe(201)
        expect(response.body.status).toBeTruthy()
        expect(response.body).toHaveProperty('message', 'created group')
    })

    test('should handle delete group', async () => {
        const response = await deleteGroup('delete', 'group', groupId)
        // console.log(response.body)
        expect(response.status).toBe(200)
        expect(response.body.status).toBeTruthy()
        expect(response.body).toHaveProperty('message', 'deleted group')
    })
    token = null
    userId = null
    groupId = null
})
