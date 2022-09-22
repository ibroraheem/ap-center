const express = require('express')
const router = express.Router()

const {postApp, updateApp, getApps, getApp, deleteApp} = require('../controllers/appController')

router.post('/app', postApp)
router.patch('/app/:id', updateApp)
router.get('/apps', getApps)
router.get('/app/:id', getApp)
router.delete('/app/:id', deleteApp)

module.exports = router