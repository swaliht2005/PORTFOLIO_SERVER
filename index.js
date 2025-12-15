
import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cors from "cors"
import authRoutes from "./routes/auth.js"
import projectRoutes from "./routes/projects.js"
import uploadRoutes from "./routes/upload.js" 
dotenv.config()

const app = express()

app.use(cors())

app.use("/api/auth", 
    express.json({ limit: "50mb" }), 
    express.urlencoded({ limit: "50mb", extended: true }), 
    authRoutes
)
app.use("/api/projects", 
    express.json({ limit: "50mb" }), 
    express.urlencoded({ limit: "50mb", extended: true }), 
    projectRoutes
)


app.use("/api/upload", uploadRoutes)


const PORT = process.env.PORT || 5000

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB")
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err)
    process.exit(1)
  })

export default app