import express from 'express'
import mongoose from 'mongoose'

import health from './api/routes/health.mjs'
import users from './api/routes/users.mjs'


await mongoose.connect('mongodb://localhost:27017/server-example')

const app = express()

app.use(express.static('public'))
app.use(express.json())


// Mount Routes
health(app)
users(app)


app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('App running on port 3000')
})
