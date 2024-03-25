FROM node:lts-alpine

WORKDIR /src

COPY client/package*.json ./

# Add a listing command to debug
RUN ls -la

RUN npm install

COPY client/ /src/

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]