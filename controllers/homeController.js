/**
 * Home Controller.
 *
 * @author Kristoffer Åberg
 * @version 1.0.0
 */

'use strict'

const fetch = require('node-fetch')

const homeController = {}

/**
 * index GET
 */
homeController.index = async (req, res, next) => {
  try {
    const issuesPromise = await fetch('https://api.github.com/repos/1dv023/ka222vq-examination-3/issues', {
      headers: {
        Authorization: 'token ' + process.env.GH_TOKEN
      }
    })

    const issues = await issuesPromise.json()

    const locals = {
      issues: (issues)
        .map(issue => ({
          id: issue.id,
          issueNr: issue.number,
          title: issue.title,
          user: issue.user.login,
          state: issue.state,
          url: issue.url,
          comments: issue.comments,
          text: issue.body,
          created: issue.created_at,
          updated: issue.updated_at
        }))
    }

    res.render('home/index', { locals })
  } catch (error) {
    next(error)
  }
}

// Exports.
module.exports = homeController
