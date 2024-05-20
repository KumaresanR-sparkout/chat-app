import jwt from 'jsonwebtoken'
export function jwtWebToken(){
    const token=jwt.sign({
        username:"john"
    },'admin', { expiresIn: '1h' })
    console.log(token)
}