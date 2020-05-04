docker rm -f dynamo
docker run -d -p 8000:8000 --name dynamo amazon/dynamodb-local