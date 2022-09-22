const express = require('express')
const router = express.Router()

const {getApps, getApp} = require('../controllers/AppController')

router.get('/apps', getApps)
router.get('/app/:id', getApp)
module.exports = router