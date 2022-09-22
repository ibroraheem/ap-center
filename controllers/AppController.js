const User = require('../model/user')
const App = require('../model/app')
const jwt = require('jsonwebtoken')

const postApp = async (req, res) => {
    const { name, description, image, appFile, contactMail, website } = req.body
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId)
    try {
        const newApp = new App({
            name,
            description,
            image,
            appFile,
            contactMail,
            website,
            user: user._id
        })
        await newApp.save()
        return res.status(201).json({ message: 'App created' })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

const updateApp = async (req, res) => {
    const { id } = req.params
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId)
    try {
        const app = await App.findById(id)
        if (!app) return res.status(400).json({ message: 'App not found' })
        if (app.user != user._id) return res.status(401).json({ message: 'Unauthorized' })
        const { name, description, image, appFile, contactMail, website } = req.body
        app.name = name
        app.description = description
        app.image = image
        app.appFile = appFile
        app.contactMail = contactMail
        app.website = website
        await app.save()
        return res.status(200).json({ message: 'App updated' })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

const deleteApp = async (req, res) => {
    const { id } = req.params
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId)
    try {
        const app = await App.findById(id)
        if (!app) return res.status(400).json({ message: 'App not found' })
        if (app.user != user._id) return res.status(401).json({ message: 'Unauthorized' })
        await app.remove()
        return res.status(200).json({ message: 'App deleted' })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

const getApp = async (req, res) => {
    const { id } = req.params
    try {
        const app = await App.findById(id)
        if (!app) return res.status(400).json({ message: 'App not found' })
        return res.status(200).json(app)
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

const getApps = async (req, res) => {
    try {
        const apps = await App.find()
        return res.status(200).json(apps)
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

module.exports = {postApp, getApp, getApps, deleteApp, updateApp}

