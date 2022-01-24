import Token from '../models/token.mjs'
import User from '../models/user.mjs'


export default async function protectRoute(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({
      error: 'Must be logged in',
    })
  }

  const rawToken = req.headers.authorization.replace('Bearer ', '')

  // Find the token
  const savedToken = await Token.findOne({ token: rawToken })

  if (!savedToken) {
    return res.status(401).json({
      error: 'Must be logged in',
    })
  }

  req.token = savedToken
  req.user = await User.findOne({ _id: savedToken.user })

  return next()
}
