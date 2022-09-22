const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const User = require('../model/user')

const register = async (req, res) => {
    const { username, email, password } = req.body
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const isFirstUser = await User.countDocuments() === 0
        const role = isFirstUser ? 'admin' : 'user'
        if (isFirstUser) {
            const user = new User({
                username,
                email,
                password: hashedPassword,
                confirmationToken: '',
                role: role,
                confirmed: true
            })
            await user.save()
            return res.status(201).json({ message: 'Admin User created' })
        }
        const user = await User.findOne({ username })
        if (user) {
            return res.status(400).json({ message: 'Username already exists' })
        }
        const confirmationToken = jwt.sign({ username, email, password: hashedPassword }, process.env.JWT_SECRET, { expiresIn: '1d' })
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            confirmationToken,
            role: role,
            confirmed: false
        })
        await newUser.save()
        return res.status(201).json({ message: 'User created' })
        //Mailer Code goes here
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

const login = async (req, res) => {
    const { email, username, password } = req.body
    try {
        const user = await User.findOne({ username }) || await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'Username or password is incorrect' })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Username or password is incorrect' })
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
        return res.status(200).json({ message: 'User Logged in', token: token })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

const confirm = async (req, res) => {
    const { confirmationToken } = req.params.token
    try {
        const user = await User.findOne({ confirmationToken })
        if (!user) {
            return res.status(400).json({ message: 'Invalid Token' })
        }
        user.confirmed = true
        user.confirmationToken = ''
        await user.save()
        return res.status(200).json({ message: 'User confirmed' })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

const resendConfirmation = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    try {
        const user = await User.findOne({ confirmationToken: token })
        if (!user) {
            return res.status(400).json({ message: 'Invalid Token' })
        }
        const confirmationToken = jwt.sign({ username: user.username, email: user.email, password: user.password }, process.env.JWT_SECRET, { expiresIn: '1d' })
        user.confirmationToken = confirmationToken
        await user.save()
        //Mailer Code goes here
        return res.status(200).json({ message: 'Confirmation email resent' })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

const forgotPassword = async (req, res) => {
    const { email } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'User not found' })
        }
        const resetPasswordToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
        user.resetPasswordToken = resetPasswordToken
        await user.save()
        //Mailer Code goes here
        return res.status(200).json({ message: 'Reset Password Token sent' })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

const resetPassword = async (req, res) => {
    const { resetPasswordToken } = req.params.token
    const { password } = req.body
    try {
        const user = await User.findOne({ resetPasswordToken })
        if (!user) {
            return res.status(400).json({ message: 'Invalid Token' })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        user.password = hashedPassword
        user.resetPasswordToken = ''
        await user.save()
        return res.status(200).json({ message: 'Password Reset' })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

const getUsers = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId)
    try {
        const isAdmin = user.role === 'admin'
        if (!isAdmin) return res.status(401).json({ message: 'Unauthorized' })
        const users = await User.find({ role: 'user' }).sort({createdAt: -1})
        return res.status(200).json({ users })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

const getUser = async (req, res) => {
    const { id } = req.params
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId)
    try {
        const isAdmin = user.role === 'admin'
        if (!isAdmin) return res.status(401).json({ message: 'Unauthorized' })
        const users = await User.find({ id: user.id, role: 'admin' })
        return res.status(200).json({ users })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

const logout = async (req, res) => {
    let token = req.headers.authorization.split(' ')[1]
    try {
        let token = req.headers.authorization.split(' ')[1]
        token = jwt.sign({ token: token }, 'secret', { expiresIn: 1 })
        res.status(200).send({ token, message: 'Logged out' })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

const revokeAccess = async (req, res) => {
    const { id } = req.params
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId)
    try {
        const isAdmin = user.role === 'admin'
        if (!isAdmin) return res.status(401).json({ message: 'Unauthorized' })
        const user = await User.findById(id)
        if (!user) return res.status(400).json({ message: 'User not found' })
        user.access = false
        await user.save()
        return res.status(200).json({ message: 'Access revoked' })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

const grantAccess = async (req, res) => {
    const { id } = req.params
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId)
    try {
        const isAdmin = user.role === 'admin'
        if (!isAdmin) return res.status(401).json({ message: 'Unauthorized' })
        const user = await User.findById(id)
        if (!user) return res.status(400).json({ message: 'User not found' })
        user.access = true
        await user.save()
        return res.status(200).json({ message: 'Access granted' })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}
module.exports = { register, login, confirm, resendConfirmation, forgotPassword, resetPassword, getUsers, getUser, logout, revokeAccess, grantAccess }
