/**
 * Express Home Router.
 *
 * @author Kristoffer Åberg
 * @version 1.0.0
 */

'use strict'

const router = require('express').Router()

const controller = require('../controllers/homeController')

// GET /
router.get('/', controller.index)

// Exports.
module.exports = router
