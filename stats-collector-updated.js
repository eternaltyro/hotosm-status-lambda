const https = require('https')
const url = 'https://s3.amazonaws.com//hotosm-stats-collector/allProjects.json'
https.get(url, (resp) => {
  console.log(resp.headers['last-modified'])
}).on('error', (err) => {
  console.log('Error: ' + err.message)
})
