rm -r ./build/*

tsc

docker build -t ricowang/tiquo_logger:dev .

docker push ricowang/tiquo_logger:dev