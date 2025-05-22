const User = require("../model/user")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async(req,res)=>{
    try {
        const {username,email,password} = req.body
        if(!username || !email || !password){
            return res.status(400).json({error: "All Fields are required"})
        }
        if(username.length <5){
            return res.status(400).json({error: "User Name Must have 5 Character"})
        }
        if(password.length <6){
            return res.status(400).json({error: "password Must have 6 Character"})
        }

        const checkUser = await User.findOne({$or:[{email},{username}]})

        if(checkUser){
            return res.status(400).json({error: "UserName email already exist"})
        }else{
            const hashPass = await bcrypt.hash(password,10)
            const newUser = new User({username,email,password:hashPass});
            await newUser.save()
            return res.status(201).json({success: "Registration Successfull"})
        }
    } catch (error) {
        return res.status(500).json({error: "Internal Server Error"})
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const checkUser = await User.findOne({ email });
        if (!checkUser) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }

        const isMatch = await bcrypt.compare(password, checkUser.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }

        const token = jwt.sign(
            { id: checkUser._id, email: checkUser.email },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        res.cookie("taskifyUserToken", token, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === "production" ? true : false,
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
        });

        return res.status(200).json({ success: "Login Success!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const logOut = async(req, res)=>{
    try {
        res.clearCookie("taskifyUserToken",{
            httpOnly:true,
        })
        res.json({success:"Logged Out"})
    } catch (error) {
        return res.status(500).json({error:"Internal Server Error"})
    }
}

const userDetails = async(req,res)=>{
    try {
        const {user} = req;
        const getDetails = await User.findById(user._id).populate("tasks").select("-password")
        if(getDetails){
            const allTask = getDetails.tasks;
            let yetToStart = [];
            let inProgress = [];
            let completed = [];
            allTask.map((item)=>{
                if(item.status===  "yetToStart"){
                    yetToStart.push(item)
                } else if(item.status===  "inProgress"){
                    inProgress.push(item)
                } else {
                    completed.push(item)
                }
            })
            res.status(200).json({success:"Success", tasks: [{yetToStart},{inProgress},{completed}]})
        }
    } catch (error) {
        return res.status(500).json({error:"Internal Server Error"})
    }
}


module.exports = {register,login,logOut,userDetails}