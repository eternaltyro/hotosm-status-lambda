const request = require('request')
const https = require('https')
const status = {
  0: 'Operational',
  1: 'Under Maintenance',
  2: 'Degraded Performance',
  3: 'Partial Outage',
  4: 'Major Outage'
}
const args = {
  'api_endpoint': process.env['API_ENDPOINT'],
  'component_id': 'dAK04IZNuHPm',
  'api_key': process.env['API_KEY']
}

exports.handler = function index (event, context, callback) {
  var overpassDiff = ''
  var hotDiff = ''
  var options = {
    'method': 'PATCH',
    'host': args['api_endpoint'],
    'path': '/api/v0/components/' + args['component_id'],
    'headers': {
      'x-api-key': args['api_key'],
      'Content-Type': 'application/json'
    }
  }
  var data = {
    'status': status[0]
  }
  options.url = 'http://overpass-api.de/api/augmented_diff_status'
  request(options, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      overpassDiff = body.trim()
      options.url = 'http://overpass.hotosm.org/api/augmented_diff_status'
      request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          hotDiff = body.trim()
          const difference = overpassDiff - hotDiff
          if (difference > 15) {
            data.status = status[2]
            console.log('HOT augmented diff behind overpass by ', overpassDiff - hotDiff)
          }
          const req = https.request(options, (res) => {
            console.log('statusCode: ', res.statusCode)
          })
          req.write(JSON.stringify(data))
          req.end()
        } else {

        }
      })
    } else {

    }
  })
  callback(null)
}
