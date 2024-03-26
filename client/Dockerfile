FROM node:lts-alpine

WORKDIR /src

# COPY package*.json /src
COPY . /src

RUN npm install

RUN ls -la

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]