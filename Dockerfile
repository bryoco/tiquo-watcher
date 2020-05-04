FROM node:latest

WORKDIR /tiquo

COPY ./package-lock.json ./package.json ./

COPY ./build ./build

RUN npm i

ENTRYPOINT [ "node", "./build/src/logger.js" ]