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
  'api_endpoint': process.env['API_ENDPOINT'],
  'component_id': 'Im90hqAZDBxM',
  'api_key': process.env['API_KEY']
}
exports.handler = function index (event, context, callback) {
  https.get(url, (resp) => {
    const options = {
      'method': 'PATCH',
      'host': args['api_endpoint'],
      'path': '/api/v0/components/' + args['component_id'],
      'headers': {
        'x-api-key': args['api_key'],
        'Content-Type': 'application/json'
      }

    }
    const data = {
      'status': status[0]
    }
    const lastModified = new Date(Date.parse(resp.headers['last-modified']))
    var timeDifference = now.getHours() - lastModified.getHours()
    if (timeDifference > 6) {
      data.status = status[2]
    }
    const req = https.request(options, (res) => {
      console.log('statusCode: ', res.statusCode)
    })
    req.write(JSON.stringify(data))
    req.end()
  }).on('error', (err) => {
    console.log('Error: ' + err.message)
  })
  callback(null)
}
