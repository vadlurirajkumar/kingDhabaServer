const express = require("express")
const app = express()
const dotenv = require("dotenv")
dotenv.config();
const cors = require("cors")
const router = require("./routes/userRoute")
const adminRoute = require("./routes/adminRoute")
require("./conifg/dbFile")
const port = process.env.PORT

app.use(express.json())
app.use(cors());
app.use("/", router)
app.use("/", adminRoute)

app.listen(port, ()=>{
    console.log(`port running at ${port}`)
})