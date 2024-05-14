export const sendSuccess=(res,status_code,message,data)=>{
    const response={
        "status_code":status_code,
        "status":true,
        "message":message,
        "data":data
    }
    res.send(status_code).json(response)
}

export const sendError=(res,status_code,message)=>{
    const response={
        "status_code":status_code,
        "status":false,
        "message":message
    }
    res.send(status_code).json(response)
}