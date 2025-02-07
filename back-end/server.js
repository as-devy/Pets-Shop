const express=require("express")
const app=express()


app.get("/",(request,response)=>{ 
    response.send("hello world")
})

app.listen(400,()=>{
    console.log("server is listening")
})