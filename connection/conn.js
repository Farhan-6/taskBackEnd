const mongoose = require("mongoose")

const conn = async()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URI}`)
    console.log("Connected")
    } catch (error) {
        console.log("Not Connected")
    }
    
}

conn()