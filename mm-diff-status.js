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
  'component_id': '79B2MuS7Q8XC',
  'api_key': process.env['API_KEY']
}

exports.handler = function index (event, context, callback) {
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
  var mmDiff = ''
  var fetchOptions = {}
  fetchOptions.url = 'https://osm-stats-production-api.azurewebsites.net/status'
  request(fetchOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var mmStatus = JSON.parse(body)
      console.log(mmStatus)
      mmStatus.forEach(ele => {
        if (ele.component === 'augmented diffs') {
          mmDiff = ele.id
        }
      })
      fetchOptions.url = 'http://overpass.hotosm.org/api/augmented_diff_status'
      request(fetchOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          hotDiff = body.trim()
          var difference = hotDiff - mmDiff
          console.log(difference)
          if (difference >= 5) {
            data.status = status[2]
            console.log('MM Diff processing is behind by ', difference)
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
