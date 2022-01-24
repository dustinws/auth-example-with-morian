import { sanitizeUser } from '../models/user.mjs'
import protectRoute from '../middleware/protectRoute.mjs'


export default function attachRoutes(router) {
  router.get('/me', protectRoute, (req, res) => {
    res.json(sanitizeUser(req.user))
  })
}
