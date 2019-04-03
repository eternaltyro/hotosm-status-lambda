# AWS LambStatus Lambda functions

This repo has a set of python & JS functions which can be uploaded to AWS Lambda. 

## Create a lambda

- Each lambda is treated as a new component. Generate a new component using:

```curl -X POST "https://<your_api_endpoint>/api/v0/components" \
  -d '{"name":"Website", "description":"", "status":"Operational"}' \
  -H "x-api-key: <your_api_key>" -H "Content-Type: application/json"```

- Check the list of existing components using:

```curl "https://<your_api_endpoint>/api/v0/components" \
  -H "x-api-key: <your_api_key>" ```

- Update an exisitng component with:

```curl -X PATCH "https://<your_api_endpoint>/api/v0/components/<your_component_id>" \
  -d '{"status":"Major Outage"}' \
  -H "x-api-key: <your_api_key>" -H "Content-Type: application/json"```

[Complete API Reference](https://lambstatus.github.io/apidocs)

## How to upload

### Python lambdas

The containers that run Lambda don't have the python library "Requests" by default, so we must create the zip file with that included. Set up a virtual environment and install the necessary libraries, then add those to the zip file. Finally, add the script you want to upload to the zip file.

```
cd /path/to/root/directory
virtualenv -p python3.6 venv
source venv/bin/activate
pip install -r requirements.txt
cd venv/lib/python3.6/site-packages
zip -r9 /path/to/root/directory/aws_upload.zip .
cd /path/to/root/directory
zip -g aws_upload.zip lambda_function.py
```

Then upload the zip file to aws using your preferred means. 



