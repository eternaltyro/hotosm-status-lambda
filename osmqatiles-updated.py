from __future__ import print_function

import json
import os
import requests
from datetime import datetime, timedelta

print('Loading function')

def lambda_handler(event, context):

    status_opts = {
        0: 'Operational', 
        1: 'Under Maintenance',
        2: 'Degraded Performance',
        3: 'Partial Outage',
        4: 'Major Outage'
    }

    kwargs = {
        'api_endpoint': os.environ['API_ENDPOINT'],
        'component_id': 'THbMK9b2w0XD',
        'api_key': os.environ['API_KEY']
    }

    metadata = requests.get("https://s3.amazonaws.com/mapbox/osm-qa-tiles-production/latest", headers={'Accept':'application/json'})

    if not metadata.ok:
        # error, push to logs
        return metadata.status_code
    else:
        last_updated = datetime.strptime(metadata.text, '%d%m%Y%H%M%S')
        today = datetime.today()
        if (today - last_updated) > timedelta(days = 3):
            r = requests.patch("https://{api_endpoint}/api/v0/components/{component_id}".format(**kwargs), json={'status': status_opts[2]}, headers={'x-api-key': kwargs['api_key']})
        else:
            r = requests.patch("https://{api_endpoint}/api/v0/components/{component_id}".format(**kwargs), json={'status': status_opts[0]}, headers={'x-api-key': kwargs['api_key']})
        return r.text
