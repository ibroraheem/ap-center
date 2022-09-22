const User = require('../model/user')
const App = require('../model/app')
const jwt = require('jsonwebtoken')

const getApps = async (req, res) => {
    try {
        const apps = await App.find()
        return res.status(200).json({ apps })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}
const getApp = async (req, res) => {
    try {
        const app = await App.findById(req.params.id)
        return res.status(200).json({ app })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}
module.exports = {getApps, getApp}