const express = require('express')
const router = express.Router()

const {getApps, getApp} = require('../controllers/AppController')

router.get('/apps', getApps)

module.exports = router