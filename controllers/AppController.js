const User = require('../model/user')
const App = require('../model/app')
const jwt = require('jsonwebtoken')


const postApp = async (req, res) => {
    const { name, description, image, appFile, contactMail, website } = req.body
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId)
    try {
        const app = new App({
            name,
            description,
            image,
            appFile,
            contactMail,
            website,
            user: user._id
        })
        await app.save()
        return res.status(201).json({ message: 'App created' })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

const getApps = async (req, res) => {
    try {
        const apps = await App.find()
        return res.status(200).json({ apps: apps }).sort({ createdAt: -1 })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

const getApp = async (req, res) => {
    const { id } = req.params
    try {
        const app = await App.findById(id)
        return res.status(200).json({ app: app })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

const updateApp = async (req, res) => {
    const { id } = req.params
    const { name, description, image, appFile, contactMail, website } = req.body
    try {
        const app = await App.findById(id)
        if (name) {
            app.name = name
        }
        if (description) {
            app.description = description
        }
        if (image) {
            app.image = image
        }
        if (appFile) {
            app.appFile = appFile
        }
        if (contactMail) {
            app.contactMail = contactMail
        }
        if (website) {
            app.website = website
        }
        await app.save()
        return res.status(200).json({ message: 'App updated' })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

const deleteApp = async (req, res) => {
    const { id } = req.params
    try {
        const app = await App.findById(id)
        await app.remove()
        return res.status(200).json({ message: 'App deleted' })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}



module.exports = { postApp, getApps, getApp, updateApp, deleteApp }