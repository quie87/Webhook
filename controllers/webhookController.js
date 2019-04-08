/**
 * Home Controller.
 *
 * @author Kristoffer Åberg
 * @version 1.0.0
 */

'use strict'

const webhookController = {}

webhookController.webhook = (req, res) => {
  const io = req.app.get('socketio')

  let webhook = JSON.parse(req.body)

  const data = {
    id: webhook.issue.id,
    issueNr: webhook.issue.number,
    action: webhook.action,
    title: webhook.issue.title,
    user: webhook.issue.user.login,
    state: webhook.issue.state,
    url: webhook.issue.url,
    comments: webhook.issue.comments,
    text: webhook.issue.body,
    created: webhook.issue.created_at,
    updated: webhook.issue.updated_at
  }

  // Event emitters
  if (webhook.action === 'opened') {
    io.emit('newissue', data)
  }

  if (webhook.action === 'edited') {
    io.emit('edited', data)
  }

  if (webhook.action === 'created') {
    io.emit('newcomment', data)
  }

  if (webhook.action === 'deleted') {
    io.emit('commentDeleted', data)
  }

  if (webhook.action === 'closed') {
    io.emit('issueClosed', data)
  }

  if (webhook.action === 'reopened') {
    io.emit('reopened', data)
  }

  res.sendStatus(200)
}
// Exports.
module.exports = webhookController
