from __future__ import print_function

import json
import os
import requests

print('Loading function')

def lambda_handler(event, context):
	    kwargs = {
        'api_endpoint': os.environ['API_ENDPOINT'],
        'component_id': 'BBmI7qnHfrwn',
        'status_text': status_opts[2],
        'api_key': os.environ['API_KEY']
    }

    r = request.get("https://tasks.hotosm.org/api/health-check", headers={'Accept':'application/json'})

    if not r.ok:
    	r = request.patch("https://{api_endpoint}/api/v0/components/{component_id}".format(**kwargs), json={'status': kwargs['status_text']}, headers={'x-api-key': kwargs['api_key']})
    	return r.json()
    else return r.status_code