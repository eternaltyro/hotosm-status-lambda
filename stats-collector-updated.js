const https = require('https')
const url = 'https://s3.amazonaws.com//hotosm-stats-collector/allProjects.json'
const now = new Date()
const status = {
  0: 'Operational',
  1: 'Under Maintenance',
  2: 'Degraded Performance',
  3: 'Partial Outage',
  4: 'Major Outage'
}
const args = {
  'api_endpoint': 'status.hotosm.org',
  'component_id': 'Im90hqAZDBxM',
  'api_key': '5nHHzwNIAj2lMJv7tLoyJ4UTVTmtoUty6bvkrZGO'
}
// exports.handler = function index (event, context, callback) {
https.get(url, (resp) => {
  const lastModified = new Date(Date.parse(resp.headers['last-modified']))
  var timeDifference = now.getHours() - lastModified.getHours()
  if (timeDifference > 6) {

  } else {
    const data = {
      'status': status[2]
    }
    console.log(data)
    const options = {
      'method': 'PATCH',
      'Host': 'https://status.hotosm.org',
      'path': '/api/v0/components/Im90hqAZDBxM',
      'headers': {
        // "authorization": "token 5nHHzwNIAj2lMJv7tLoyJ4UTVTmtoUty6bvkrZGO",
        'x-api-key': args['api_key'],
        'Content-Type': 'application/json'
      }

    }
    const req = https.request(options, (res) => {
      console.log('statusCode: ${res.statusCode}')
    })

    req.on('error', (error) => {
      console.log(options)
      console.error('ERRORRRRR', error)
    })
    req.write(JSON.stringify(data))
    req.end()
  }
}).on('error', (err) => {
  console.log('Error: ' + err.message)
})
//   callback(null)
// }
