import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const SECRET_KEY_JWT = process.env.SECRET_KEY_JWT

// Create token
export const createToken = (user) => {
  const payload = {
    userId: user.id,
    userName: user.name,
    userEmail: user.email
  }

  return jwt.sign(payload, SECRET_KEY_JWT, { expiresIn: '1h' })
}