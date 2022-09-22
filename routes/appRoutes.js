const express = require('express')
const router = express.Router()

const {getApps, getApp, createApp, updateApp, deleteApp} = require('../controllers/AppController')

router.get('/apps', getApps)
router.get('/app/:id', getApp)
router.post('/app', createApp)
router.patch('/app/:id', updateApp)
router.delete('/app/:id', deleteApp)

module.exports = router