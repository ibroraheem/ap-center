const User = require('../model/user')
const App = require('../model/app')
const jwt = require('jsonwebtoken')



const getAllApps = async (req, res) => {
    try {
        const apps = await App.find()
        return res.status(200).json({ apps })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

const getApp = async (req, res) => {
    const { id } = req.params
    try {
        const app = await App.findById(id)
        return res.status(200).json({ app })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

const deleteApp = async (req, res) => {
    const { id } = req.params
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    try {
        const user = await User.findById(decoded.userId)
        const app = await App.findById(id)
        if (user._id.toString() !== app.user.toString() || (user.role === 'admin')) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        await app.remove()
        return res.status(200).json({ message: 'App deleted' })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

const getApps = async (req, res) => {
    try{
        const apps = await App.find()
        return res.status(200).json({apps})
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
}

module.exports = { getAllApps, getApp, deleteApp, getApps }
