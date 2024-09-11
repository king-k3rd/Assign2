const express = require("express");
const app = express()
app.use(express.json())
const router = express.Router()
const cors = require('cors')
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const categoryRouters = require("./routers/categoryRouters");
const productRouters = require("./routers/productRouters");
const authRouters = require("./routers/authRouters");
const cartRouters = require("./routers/cartRouters");
const paymentRouters = require("./routers/paymentRouters");

connectDB();
dotenv.config();

app.use(cors({
    origin: ["http://localhost:5173"],
    allowedHeaders: ["Content-Type","autorization", "auth-token"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}))

app.use(express.json())
app.use("/upload", express.static("upload"))
app.use("/", categoryRouters)
app.use("/", productRouters)
app.use("/", authRouters)
app.use("/", cartRouters)
app.use("/", paymentRouters)


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listning on port ${port}!..`));