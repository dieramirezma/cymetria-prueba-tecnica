import jwt from 'jsonwebtoken'

export const ensureAuth = (req, res, next) => {
  // Check if the authorization header is present
  if (!req.headers.authorization) {
    return res.status(403).send({ message: 'El token de autorización es requerido' })
  }

  // Clean the token and remove quotes
  const token = req.headers.authorization.replace(/['"]+/g, '')

  try {
    jwt.verify(token, process.env.SECRET_KEY_JWT, (error, decode) => {
      if (error) {
        if (error.name === 'TokenExpiredError') {
          return res.status(401).json({ message: 'Token caducado' })
        } else {
          console.log(error)
          return res.status(403).json({ message: 'Toeken inválido' })
        }
      } else {
        req.user = decode
        next()
      }
    })
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido' })
  }
}
