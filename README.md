# AWS LambStatus Lambda functions

This repo has a set of python functions which can be uploaded to AWS Lambda. 

## How to upload

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