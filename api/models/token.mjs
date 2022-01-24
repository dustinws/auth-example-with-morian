import mongoose from 'mongoose'


export const schema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },

  user: {
    type: String,
    required: true,
  },
}, {
  versionKey: false,
})


export default mongoose.model('Token', schema)
