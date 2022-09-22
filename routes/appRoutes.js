const express = require('express');
const router = express.Router();

const {postApp, getApps, getApp, updateApp, deleteApp} = require('../controllers/appController');

router.post('/app', postApp);
router.get('/apps', getApps);
router.get('/app/:id', getApp);
router.put('/app/:id', updateApp);
router.delete('/app/:id', deleteApp);

module.exports = router;
