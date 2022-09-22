const express = require('express');
const router = express.Router()

const {register, login, forgotPassword, resetPassword, confirm, resendConfirmation, getUsers, logout, getUser, revokeAccess, grantAccess} = require('../controllers/authController')



router.post('/register', register)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)
router.post('/confirm/:token', confirm)
router.post('/resend-confirmation', resendConfirmation)
router.post('/logout', logout)
router.get('/admin/users', getUsers)
router.get('/admin/user/:id', getUser)
router.patch('/admin/revoke-access/:id', revokeAccess)
router.patch('/admin/grant-access/:id', grantAccess)


module.exports = router