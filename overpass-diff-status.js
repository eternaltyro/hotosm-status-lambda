const request = require('request')
const https = require('https')
const moment = require('moment')
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
  var options = {
    'method': 'GET',
    'url': 'https://' + args['api_endpoint'] + '/api/v0/incidents',
    'headers': {
      'x-api-key': args['api_key'],
      'Content-Type': 'application/json'
    }
  }
  var incidentID = ''
  var incidentTimeStamp = moment('1900-01-01T00:00:00.000Z')
  var incidentStatus = ''
  request(options, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var incidents = JSON.parse(body)
      console.log('Checking incidents...')
      console.log(JSON.stringify(incidents))
      incidents.forEach(incident => {
        if (incident.name.indexOf('Overpass') >= 0) {
          if (!(incident.status === 'Resolved')) {
            var incidentTime = moment(incident.createdAt)
            if (incidentTimeStamp.isBefore(incidentTime)) {
              incidentTimeStamp = incidentTime
              incidentID = incident.incidentID
              incidentStatus = incident.status
            }
          }
        }
      })
      var overpassDiff = ''
      var hotDiff = ''
      options = {
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
      var incidentData = {}
      var fetchOptions = {}
      fetchOptions.url = 'http://overpass-api.de/api/augmented_diff_status'
      request(fetchOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          overpassDiff = body.trim()
          fetchOptions.url = 'http://overpass.hotosm.org/api/augmented_diff_status'
          request(fetchOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {
              hotDiff = body.trim()
              const difference = overpassDiff - hotDiff
              console.log('Difference: ', difference)
              if (difference > 15) {
                data.status = status[2]
                if (incidentID === '') {
                  console.log('New incident to be created')
                  incidentData = {
                    'name': 'Overpass Diff Processing',
                    'status': 'Identified',
                    'message': 'Performance issue identified'
                  }
                  options = {
                    'method': 'POST',
                    'host': args['api_endpoint'],
                    'path': '/api/v0/incidents/',
                    'headers': {
                      'x-api-key': args['api_key'],
                      'Content-Type': 'application/json'
                    }

                  }
                  console.log(JSON.stringify(incidentData))
                  const req = https.request(options, (res) => {
                    console.log('statusCode: ', res.statusCode)
                  })
                  req.write(JSON.stringify(incidentData))
                  req.end()
                } else {
                  console.log(incidentID + ' already created')
                  if (incidentStatus !== 'Investigating') {
                    incidentData = {
                      'status': 'Investigating',
                      'message': 'Performance issue identified'
                    }
                    options = {
                      'method': 'PATCH',
                      'host': args['api_endpoint'],
                      'path': '/api/v0/incidents/' + incidentID,
                      'headers': {
                        'x-api-key': args['api_key'],
                        'Content-Type': 'application/json'
                      }

                    }
                    console.log(options)
                    console.log(JSON.stringify(incidentData))
                    const req = https.request(options, (res) => {
                      console.log('statusCode: ', res.statusCode)
                    })
                    req.write(JSON.stringify(incidentData))
                    req.end()
                  } else {
                    console.log('Investigation status already updated')
                  }
                }
                console.log('HOT augmented diff behind overpass by ', overpassDiff - hotDiff)
              } else {
                if (incidentID !== '') {
                  console.log(incidentID + ' already created')
                  incidentData = {
                    'name': 'Overpass Diff Processing',
                    'status': 'Resolved',
                    'message': 'Performance issue addressed'
                  }
                  options = {
                    'method': 'PATCH',
                    'host': args['api_endpoint'],
                    'path': '/api/v0/incidents/' + incidentID,
                    'headers': {
                      'x-api-key': args['api_key'],
                      'Content-Type': 'application/json'
                    }

                  }
                  console.log(JSON.stringify(incidentData))
                  const req = https.request(options, (res) => {
                    console.log('statusCode: ', res.statusCode)
                  })
                  req.write(JSON.stringify(incidentData))
                  req.end()
                }
              }
              options = {
                'method': 'PATCH',
                'host': args['api_endpoint'],
                'path': '/api/v0/components/' + args['component_id'],
                'headers': {
                  'x-api-key': args['api_key'],
                  'Content-Type': 'application/json'
                }
              }
              const req = https.request(options, (res) => {
                console.log('statusCode: ', res.statusCode)
              })
              console.log(JSON.stringify(data))
              console.log(options)
              req.write(JSON.stringify(data))
              req.end()
            } else {

            }
          })
        } else {

        }
      })
    }
  })

  callback(null)
}
