#!/usr/bin/env bash

sh ./build-and-push.sh

ssh -i ~/.ssh/id_rsa root@${TIQUO_REMOTE} 'bash -s' < ./run-logger-mongo.sh 