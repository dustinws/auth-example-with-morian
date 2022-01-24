import mongoose from 'mongoose'


export const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },
}, {
  versionKey: false,
})


export function sanitizeUser(userDocument) {
  return {
    // eslint-disable-next-line no-underscore-dangle
    id: userDocument._id,
    email: userDocument.email,
  }
}


export default mongoose.model('User', schema)
