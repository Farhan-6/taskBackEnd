const jwt = require("jsonwebtoken")
const User = require("../model/user")

const authMiddleWare = async (req,res,next)=>{
    const token = req.cookies.taskifyUserToken
    try {
        if(!token){
            return res.status(401).json({error:"new-user"})
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)
        if(!user){
            return res.status(404).json({message:"User Not found"})
        }
        req.user = user;
        next()
    } catch (error) {
        return res.status(401).json({message:"Inavlid Token"})
    }
}

module.exports = authMiddleWare