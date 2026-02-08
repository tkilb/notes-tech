// Docs: https://www.npmjs.com/package/node-fetch
const fetch = require('node-fetch')

// Simple GET Text
fetch('https://github.com/')
  .then((res) => res.text())
  .then((body) => console.log(body))

// Simple GET JSON
fetch('https://api.github.com/users/github')
  .then((res) => res.json())
  .then((json) => console.log(json))

// Request POST with Text Body
fetch('https://httpbin.org/post', { method: 'POST', body: 'a=1' })
  .then((res) => res.json()) // expecting a json response
  .then((json) => console.log(json))

// Request POST with JSON Body
fetch('https://httpbin.org/post', {
  method: 'post',
  body: JSON.stringify({ a: 1 }),
  headers: { 'Content-Type': 'application/json' },
})
  .then((res) => res.json())
  .then((json) => console.log(json))

// Exception Handles
fetch('https://domain.invalid/').catch((err) => console.error(err))

// Handling client and server errors
function checkStatus(res) {
  if (res.ok) {
    // res.status >= 200 && res.status < 300
    return res
  } else {
    throw MyCustomError(res.statusText)
  }
}
fetch('https://httpbin.org/status/400')
  .then(checkStatus)
  .then((res) => console.log('will not get here...'))

// Streams
fetch(
  'https://assets-cdn.github.com/images/modules/logos_page/Octocat.png',
).then((res) => {
  const dest = fs.createWriteStream('./octocat.png')
  res.body.pipe(dest)
})
