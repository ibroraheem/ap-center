const User = require('../models/user')
const App = require('../models/app')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    },
})


const getAllApps = async (req, res) => {
    try {
        const apps = await App.find()
        return res.status(200).json({ apps })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

const postApp = async (req, res) => {
    const { name, description, contactMail, website } = req.body
    storage.array('image', 'appFile')
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId)
    try {
        upload.array('image', 'appFile')
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

const getApp = async (req, res) => {
    const { id } = req.params
    try {
        const app = await App.findById(id)
        return res.status(200).json({ app })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

const updateApp = async (req, res) => {
    const { name, description, image, link, contactMail, website } = req.body
    const { id } = req.params
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    try {
        const user = await User.findById(decoded.userId)
        const app = await App.findById(id)
        if (user._id.toString() !== app.user.toString() || (user.role === 'admin')) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        app.name = name
        app.description = description
        app.image = image
        app.link = link
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

module.exports = { getAllApps, getApp, postApp, updateApp, deleteApp }
