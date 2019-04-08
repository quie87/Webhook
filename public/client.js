/**
 * Client side script
 *
 * @author Kristoffer Åberg
 * @version 1.0.0
 */

// Connect to Websocket
const socket = window.io.connect()

// Lisstening to new issues
socket.on('newissue', data => {
  createNewIssue(data)
  notifications(data)
})

// Lisstening to edited issues
socket.on('edited', data => {
  let issueTitle = document.querySelector(`#issue-${data.id} .title`)
  issueTitle.textContent = `Title: ${data.title}`
  notifications(data)
})

// Lisstening to new coments
socket.on('newcomment', data => {
  let comments = document.querySelector(`#issue-${data.id} .comments`)
  comments.textContent = `Number of comments: ${data.comments + 1}`
  notifications(data)
})

// Lisstening to comments that have been deleted
socket.on('commentDeleted', data => {
  let comments = document.querySelector(`#issue-${data.id} .comments`)
  comments.textContent = `Number of comments: ${data.comments - 1}`
  notifications(data)
})

// Lisstening to issues that been closed
socket.on('issueClosed', data => {
  let issue = document.querySelector(`#issue-${data.id}`)
  issue.parentNode.parentNode.removeChild(issue.parentNode)
  notifications(data)
})

// Lisstening to reopened issues
socket.on('reopened', data => {
  createNewIssue(data)
  notifications(data)
})

// Lisstening to users getting disconnected
socket.on('disconnect', () => {
  console.log('User disconnected')
})

// Function that add a li element
function addLiElement (string) {
  let text = document.createTextNode(string)
  let el = document.createElement('li')
  el.appendChild(text)
  return el
}

// Function that create new issues and adds it to the DOM
function createNewIssue (data) {
  const issues = document.querySelector('#issues')
  const divClone = document.querySelector('#issue-card')
  const template = document.importNode(divClone, true)

  template.querySelector('.issueId').setAttribute('id', data.id)
  template.querySelector('.issueNr').textContent = `# ${data.issueNr}`
  template.querySelector('.title').textContent = `Title: ${data.title}`
  template.querySelector('.user').textContent = `User: ${data.user}`
  template.querySelector('.state').textContent = `State: ${data.state}`
  template.querySelector('.url').textContent = `URL: ${data.url}`
  template.querySelector('.comments').textContent = `Number of comments: ${data.comments}`
  template.querySelector('.text').textContent = `First comment: ${data.text}`
  template.querySelector('.created').textContent = `Created at: ${data.created}`
  template.querySelector('.updated').textContent = `Updated at: ${data.updated}`

  issues.insertBefore(template, divClone)
}

// Function that adds notifications about issue events to the DOM
function notifications (data) {
  let status = ''

  switch (data.action) {
    case data.action = 'opened':
      status = 'New Issue'
      break

    case data.action = 'edited':
      status = 'Issue edited'
      break

    case data.action = 'created':
      status = 'New Comment'
      break

    case data.action = 'deleted':
      status = 'Comment removed'
      break

    case data.action = 'closed':
      status = 'Issue closed'
      break

    case data.action = 'reopened':
      status = 'Issue reopened'
      break

    default:
      console.log('You was not prepared for this event man!')
  }

  const notification = document.querySelector('#notification')
  const div = document.createElement('div')
  const ul = document.createElement('ul')
  const a = document.createElement('a')

  div.setAttribute('class', 'issue-card')
  a.setAttribute('href', '#')
  a.setAttribute('class', 'close-btn')
  a.textContent = 'X'

  let headline = addLiElement('Notification')
  let issue = addLiElement('# ' + data.issueNr)
  let action = addLiElement('Event: ' + status)
  let title = addLiElement('Title: ' + data.title)
  let user = addLiElement('User: ' + data.user)

  ul.appendChild(headline)
  ul.appendChild(issue)
  ul.appendChild(action)
  ul.appendChild(title)
  ul.appendChild(user)

  div.appendChild(a)
  div.appendChild(ul)
  notification.appendChild(div)

  a.addEventListener('click', closeBtn => {
    a.parentNode.parentNode.removeChild(a.parentNode)
  })
}
