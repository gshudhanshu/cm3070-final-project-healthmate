FROM node:lts-alpine

WORKDIR /src

COPY client/package*.json ./

RUN npm install

COPY client/ .

RUN npm run build

EXPOSE 3000

RUN apk update \
    && apk upgrade \
    && apk add --no-cache --upgrade bash

CMD ["npm", "start"]