const express = require('express')
const router = express.Router()

const {getApps, getApp, createApp} = require('../controllers/AppController')

router.get('/apps', getApps)
router.get('/app/:id', getApp)
router.post('/app', createApp)
module.exports = router