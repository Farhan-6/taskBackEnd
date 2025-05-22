const express = require("express")
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')

require("dotenv").config()
require('./connection/conn')
const userApis = require("./controller/userController")
const taskApis = require('./controller/taskController')


app.use(express.json())
app.use(cors({
    origin : ["https://taskify-indol.vercel.app"],
    credentials: true
}))
app.use(cookieParser())

app.get('/',(req,res)=>{
    res.send("hello from back end")
})


app.use('/api/v1',userApis)
app.use('/api/v1',taskApis)

app.listen(`${process.env.PORT}`,()=>{
    console.log(`Listening to port ${process.env.PORT}`)
})
