const express = require("express")
require("dotenv").config();
const cors = require("cors")
const port = process.env.PORT
const app = express()

// Db connection 
require("./conifg/dbFile")

// importing router files
const router = require("./routes/userRoute")
const adminRoute = require("./routes/adminRoute")

// middleware
app.use(express.json())
app.use(cors());

// admin& user routes
app.use("/user", router) // user route calling
app.use("/admin", adminRoute) // admin route calling

// Port 
app.listen(port, ()=>{
    console.log(`port running at ${port}`)
})