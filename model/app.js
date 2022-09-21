const mongoose = require('mongoose')

const AppSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
  image:{
    type: Buffer,
    required: true
  },
    appFile:{
        type: Buffer,
        required: true
    },
    contactMail: {
        type: String,
        required: true,
    },
    website: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
},
    { timestamps: true }
)

const App = mongoose.model('App', AppSchema)
module.exports = App