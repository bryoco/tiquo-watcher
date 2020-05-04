docker pull ricowang/tiquo_logger:dev

docker rm -f tiquo_logger

docker network create dev

docker run -d \
    --name tiquo_logger \
    --network dev \
    -e ENV=dev \
    -e DB=mongo \
    ricowang/tiquo_logger:dev

sleep 1

docker ps -a