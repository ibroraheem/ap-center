const express = require('express');
const router = express.Router()
const {postApp, updateApp, getApp, getAllApps, deleteApp} = require('../controllers/AppController')

router.get('apps/', getAllApps)
router.post('app/', postApp)
router.get('app/:id', getApp)
router.patch('app/:id', updateApp)
router.delete('app/:id', deleteApp)

module.exports = router