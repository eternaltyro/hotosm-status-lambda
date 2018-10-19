from __future__ import print_function

import json
import os
import requests

print('Loading function')

def lambda_handler(event, context):
    
    # This function will trigger when latency is high

    status_opts = {
        0: 'Investigating', 
        1: 'Identified',
        2: 'Monitoring',
        3: 'Resolved'
    }

    kwargs = {
        'api_endpoint': os.environ['API_ENDPOINT'],
        'component_id': 'BBmI7qnHfrwn',
        'status_text': status_opts[2],
        'api_key': os.environ['API_KEY']
    }

    payload = {'name': 'TM3 High Latency', 
              'status': "Monitoring", 
              'message': 'Tasking Manager is experiencing high latency and may be unresponsive. It should resolve itself as we scale our resources.'} 

    r = requests.post("https://{api_endpoint}/api/v0/incidents".format(**kwargs), 
        json=payload,
        headers={'x-api-key': kwargs['api_key']}
    )

    return r.text


# {
# 	"AlarmName":"awseb-e-8qzkykpymy-stack-highcpu-1PSNNLDG23HB7",
# 	"AlarmDescription":null,
# 	"AWSAccountId":"670261699094",
# 	"NewStateValue":"ALARM",
# 	"NewStateReason":"Threshold Crossed: 1 datapoint [49322.0 (05/10/18 18:14:00)] was greater than or equal to the threshold (40000.0).",
# 	"StateChangeTime":"2018-10-05T18:29:45.179+0000",
# 	"Region":"US East (N. Virginia)",
# 	"OldStateValue":"INSUFFICIENT_DATA",
# 	"Trigger": {
# 		"MetricName":"RequestCount",
# 		"Namespace":"AWS/ELB",
# 		"StatisticType":"Statistic",
# 		"Statistic":"SUM",
# 		"Unit":null,
# 		"Dimensions":[{
# 			"name":"LoadBalancerName",
# 			"value":"awseb-e-8-AWSEBLoa-1M21TM646O6PY"
# 			}],
# 		"Period":900,
# 		"EvaluationPeriods":1,
# 		"ComparisonOperator":"GreaterThanOrEqualToThreshold",
# 		"Threshold":40000.0,
# 		"TreatMissingData":"",
# 		"EvaluateLowSampleCountPercentile":""
# 	}
# }