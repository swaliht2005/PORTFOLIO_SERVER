import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.header("Authorization")

    if (!authHeader) {
      return res.status(401).json({ message: "Access denied - No token provided" })
    }

    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader

    if (!token) {
      return res.status(401).json({ message: "Access denied - Invalid token format" })
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not set in environment variables")
      return res.status(500).json({ message: "Server configuration error" })
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET)
    req.user = verified
    next()
  } catch (err) {
    console.error("Token verification error:", err.message)

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" })
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" })
    }

    return res.status(500).json({ message: "Token verification failed" })
  }
}
