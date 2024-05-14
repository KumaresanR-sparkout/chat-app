// import path from 'path'
// const loc=path.resolve('htmls')
export const serveHtml=async(req,res)=>{
    res.sendFile('index.html')
}