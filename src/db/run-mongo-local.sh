docker rm -f mongo
docker run -d -p 27017:27017 --name mongo mongo 