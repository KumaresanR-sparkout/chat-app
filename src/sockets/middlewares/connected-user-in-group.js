import connectedUser from './connected-socket-users'
const socketUser=[]
//@description  Filtering the connected users in group to send message
export const connectedUserExistInGroup=async(users)=>{
    users.forEach(user=>{
        if(connectedUser.includes(user.toString())){
            socketUser.push(user.toString())
        }
    })
    return socketUser
}