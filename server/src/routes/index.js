'use strict';

const express = require('express');
const heartController = require('../controllers/heart.controller');
const { asyncHanlderError } = require('../untils/index.util');
const router = express.Router();

// main
router.get('/api/v1', asyncHanlderError(heartController.started));

// search
router.get('/api/v1/search', asyncHanlderError(heartController.search));

// router.get('/api/v1/create', asyncHanlderError(heartController.create));

module.exports = router