"""Read a key's value from a Secret in AWS SecretsManager"""
import json
import boto3
from botocore.exceptions import ClientError


def get_secret(secret_name: str, secret_key: str) -> str:
    client = boto3.client('secretsmanager')
    try:
        response = client.get_secret_value(SecretId=secret_name)
    except ClientError as e:
        raise e
    else:
        if 'SecretString' not in response:
            raise KeyError
        secrets = json.loads(response['SecretString'])
        if secret_key not in secrets:
            raise KeyError
        return secrets[secret_key]
