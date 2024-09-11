const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config()

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("connected to database!");
        
    }catch(error){
        console.log("err!!...something went wrong", error);
        
    }
}
 module.exports =connectDB;