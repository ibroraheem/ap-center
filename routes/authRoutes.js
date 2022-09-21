const express = require('express');
const router = express.Router()

const {register, login, forgotPassword, resetPassword, confirm, resendConfirmation} = require('../controllers/authController')

router.post('/register', register)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)
router.post('/confirm/:token', confirm)
router.post('/resend-confirmation', resendConfirmation)

module.exports = router