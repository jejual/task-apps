
FROM node:14-slim

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . ./

CMD [ "node", "src/app.js" ]