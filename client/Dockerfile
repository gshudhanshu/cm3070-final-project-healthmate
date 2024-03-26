FROM node:lts-alpine

WORKDIR /src

COPY package*.json /src

RUN npm install

COPY . .

RUN ls -la

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]