/**
 * Express Webhook Router.
 *
 * @author Kristoffer Åberg
 * @version 1.0.0
 */

'use strict'

const router = require('express').Router()

const controller = require('../controllers/webhookController')

const crypto = require('crypto')

// Function that hash webhook secret
const createComparisonSignature = (body) => {
  try {
    const hmac = crypto.createHmac('sha1', process.env.OCTO_WIZARD_HOOK_SECRET)
    const selfSignature = hmac.update(body).digest('hex')
    return `sha1=${selfSignature}` // shape in GitHub header
  } catch (error) {
    return false
  }
}

// Function that compare and validate webhook secret
const compareSignatures = (signature, comparisonSignature) => {
  try {
    const source = Buffer.from(signature)
    const comparison = Buffer.from(comparisonSignature)
    return crypto.timingSafeEqual(source, comparison) // constant time comparison
  } catch (error) {
    return false
  }
}

// Middleware that secure POST. Makes sure POST is from Github repo
const verifyGithubPayload = (req, res, next) => {
  const { headers, body } = req

  const signature = headers['x-hub-signature']
  const comparisonSignature = createComparisonSignature(body)

  if (!compareSignatures(signature, comparisonSignature)) {
    return res.status(401).send('Mismatched signatures')
  }

  next()
}

// POST
router.post('/', verifyGithubPayload, controller.webhook)

// Exports.
module.exports = router
