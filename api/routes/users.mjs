import { uid } from 'uid'
import bcrypt from 'bcrypt'

import Token from '../models/token.mjs'
import User, { sanitizeUser } from '../models/user.mjs'
import protectRoute from '../middleware/protectRoute.mjs'


export default function attachRoutes(router) {
  /**
   * GET /users
   *
   * List all users
   */
  router.get('/users', protectRoute, async (req, res) => {
    const users = await User.find()

    res.json(users.map(sanitizeUser))
  })


  /**
   * POST /users
   *
   * Create a new user
   */
  router.post('/users', async (req, res) => {
    const { email, password } = req.body

    // Validate Email
    if (!/@/g.test(email)) {
      return res.status(400).json({
        error: 'Must be a valid email',
      })
    }

    // Validate Password
    if (password.length < 6) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters',
      })
    }

    // The email is not in use
    if (await User.findOne({ email })) {
      return res.status(400).json({
        error: 'Email is already in use',
      })
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Save the user
    const savedUser = await User.create({
      email,
      password: hashedPassword,
    })

    // Send the response
    return res.json(sanitizeUser(savedUser))
  })


  /**
   * POST /login
   *
   * Login a user
   */
  router.post('/login', async (req, res) => {
    const { email, password } = req.body

    const savedUser = await User.findOne({ email })

    // Does the user exist?
    if (!savedUser) {
      return res.status(400).json({
        error: 'Email or password not correct',
      })
    }

    // Is their password correct
    if (!(await bcrypt.compare(password, savedUser.password))) {
      return res.status(400).json({
        error: 'Email or password not correct',
      })
    }

    // Create a token
    const token = await Token.create({
      token: uid(),
      // eslint-disable-next-line no-underscore-dangle
      user: savedUser._id,
    })

    return res.json({
      token,
      user: sanitizeUser(savedUser),
    })
  })


  /**
   * POST /logout
   *
   * Logout a user
   */
  router.post('/logout', protectRoute, async (req, res) => {
    // eslint-disable-next-line no-underscore-dangle
    await Token.remove({ _id: req.token._id })

    res.json({ message: 'logged out' })
  })
}
