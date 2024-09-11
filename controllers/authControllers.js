const User = require('../models/users');
const bcrypt = require('bcryptjs');
// const {validateUser} = require("../validators");


exports.register = async (req,res) => {
    const { firstName, lastName, password, confirmPassword, email, phone, role } = req.body;

    if( password !== confirmPassword) {
        return res.json("password do not match")
    }
    try{
        let user = await User.findOne({ email })
        if (user){
            return res.json("User already exists!...")
        }

        user = new User({ firstName, lastName, password, confirmPassword, email, phone, role });
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)
        await user.save()
        res.json(user)
    
    } catch(error){
        console.log({ message: error.message});
    }
}


exports.login = async (req, res) => {
    const { email, password} = req.body;
    try {
        const user = await User.findOne({ email })  
        if (!user) {
            return res.status(400).json({ message: "invalid email" })
        }

        const validatePassword = await bcrypt.compare( password, user.password)
        if (!validatePassword) {
            return res.status(400).json({ message: "invalid password" })
        }
        //await user.save();

        const token = user.generateAuthToken();
        res.header("auth-token", token).json({ token })

    } catch (error) {
        console.log({ message: error.message })
        return res.status(500).json({message: "Server error, something went wrong!..."})
    }
}