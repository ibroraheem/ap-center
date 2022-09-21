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

const postApp = async (req, res) => {
    const { name, description, image, appFile, contactMail, website } = req.body
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    try {
        const user = await User.findOne({ _id: decoded.userId })
        if (!user) return res.status(401).json({ message: 'Unauthorized' })
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
        return res.status(201).json({ message: 'App successfully uploaded' })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

const updateApp = async (req, res) => {
    const { name, description, image, appFile, contactMail, website } = req.body
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    try {
        const user = await User.findOne({ _id: decoded.userId })
        if (!user) return res.status(401).json({ message: 'Unauthorized' })
        const app = await App.findOne({ _id: req.params.id })
        if (!app) return res.status(404).json({ message: 'App not found' })
        if (app.user.toString() !== user._id.toString() || app.user.role !== 'admin') return res.status(401).json({ message: 'Unauthorized' })
        if (name) app.name = name
        if (description) app.description = description
        if (image) app.image = image
        if (appFile) app.appFile = appFile
        if (contactMail) app.contactMail = contactMail
        if (website) app.website = website
        await app.save()
        return res.status(200).json({ message: 'App successfully updated' })
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

module.exports = { getAllApps, postApp, updateApp, getApp, deleteApp, getApps }
