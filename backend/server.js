require("dotenv").config()

const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

const port = process.env.PORT||4000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

const authRouter = require("./routes/auth.routes")
app.use("/api/auth", authRouter)

const interviewRouter = require("./routes/interview.routes")
app.use("/api/interview", interviewRouter)

const connectToDB = require("./config/database")
connectToDB()
